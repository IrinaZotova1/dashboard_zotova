import { UIComponent } from './UIComponent.js';
import { h, getTodayInfo } from './utils.js';
import { fetchWikiPage, fetchEventPhoto, parseEventsFromWikitext } from './api.js';
import { HISTORY_BG_FALLBACK, FALLBACK_EVENTS } from './data.js';

/**
 * Виджет «История театра» — события дня из Википедии.
 * 4 состояния, навигация по событиям, счётчик «N / M».
 */
export class HistoryWidget extends UIComponent {
  constructor(config = {}) {
    super({
      title: 'История театра',
      subtitle: getTodayInfo().dateLabel,
      chip: 'Событие',
      variant: 'image',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
      ...config
    });
    this.events = [];
    this.index = 0;
  }

  render() {
    const section = h('section', {
      class: 'panel-image',
      attrs: { 'data-widget-id': this.id, role: 'region', 'aria-label': this.title }
    });
    section.style.backgroundImage = `url('${HISTORY_BG_FALLBACK[0]}')`;

    this.contentEl = h('div', { class: 'panel-image-content' });
    this.contentEl.appendChild(this._buildHead());

    this.textEl = h('div', { class: 'history-body', attrs: { 'aria-live': 'polite' } });
    this.contentEl.appendChild(this.textEl);

    this.prevBtn = h('button', {
      class: 'panel-nav-btn',
      attrs: { type: 'button', 'aria-label': 'Предыдущее событие', title: 'Назад' },
      html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>'
    });
    this.nextBtn = h('button', {
      class: 'panel-nav-btn',
      attrs: { type: 'button', 'aria-label': 'Следующее событие', title: 'Вперёд' },
      html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>'
    });
    this.counterEl = h('span', { class: 'history-counter', attrs: { 'aria-live': 'polite' } });

    this._on(this.prevBtn, 'click', () => this._showIndex(this.index - 1));
    this._on(this.nextBtn, 'click', () => this._showIndex(this.index + 1));

    this.contentEl.appendChild(h('div', { class: 'panel-nav' }, this.prevBtn, this.nextBtn, this.counterEl));

    section.appendChild(this.contentEl);
    this.element = section;
    return section;
  }

  async load() {
    this._renderState(this.textEl, 'loading', 'Загрузка события…');
    const signal = this._getAbortSignal();

    try {
      const wikitext = await fetchWikiPage(signal);
      if (signal.aborted) return;

      const events = parseEventsFromWikitext(wikitext);
      if (!events.length) {
        this._renderState(this.textEl, 'empty', 'Сегодня событий не найдено');
        return;
      }
      this.events = events;
      this.index = 0;
      this._renderCurrent();
    } catch (err) {
      if (err.name === 'AbortError') return;
      console.warn('History error:', err);
      this._renderState(this.textEl, 'error', 'Ошибка загрузки');
    }
  }

  _showIndex(i) {
    if (i < 0) return;

    // Клик после error → грузим архив
    if (!this.events.length && i === 0) {
      this.events = FALLBACK_EVENTS;
      this.index = 0;
      this._renderCurrent();
      return;
    }
    if (i >= this.events.length) return;
    this.index = i;
    this._renderCurrent();
  }

  _renderCurrent() {
    const event = this.events[this.index];
    const fallbackBg = HISTORY_BG_FALLBACK[this.index % HISTORY_BG_FALLBACK.length];
    this.element.style.backgroundImage = `url('${fallbackBg}')`;

    const signal = this._abortController?.signal;
    fetchEventPhoto(event.searchQuery || event.title, signal).then(photo => {
      if (photo && !signal?.aborted) {
        this.element.style.backgroundImage = `url('${photo}')`;
      }
    }).catch(() => {});

    const link = event.wikiUrl ? h('a', {
      class: 'card-link-white',
      attrs: { href: event.wikiUrl, target: '_blank', rel: 'noopener' },
      html: 'Источник <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:13px;height:13px" aria-hidden="true"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg>'
    }) : null;

    this.textEl.replaceChildren(
      h('div', { class: 'history-year-inline', text: event.year || '·' }),
      h('div', { class: 'history-title', text: event.title }),
      h('div', { class: 'history-desc', text: event.description }),
      link
    );
    this._updateNav();
  }

  _updateNav() {
    this.prevBtn.disabled = this.index <= 0;
    this.nextBtn.disabled = this.index >= this.events.length - 1;
    this.counterEl.textContent = this.events.length
      ? `${this.index + 1} / ${this.events.length}`
      : '';
  }
}