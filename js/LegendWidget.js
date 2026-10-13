import { UIComponent } from './UIComponent.js';
import { h, getTodayInfo } from './utils.js';
import { fetchWikiPage, fetchPersonPhoto, parsePersonsFromWikitext } from './api.js';
import { LEGEND_BG_FALLBACK, FALLBACK_LEGENDS } from './data.js';

/**
 * Виджет «Легенда дня» — персона театра, родившаяся в текущий день.
 * 4 состояния: loading / empty / error / success. Возврат к fallback — кнопкой.
 */
export class LegendWidget extends UIComponent {
  constructor(config = {}) {
    super({
      title: 'Легенда дня',
      subtitle: getTodayInfo().dateLabel,
      chip: 'Персона',
      variant: 'image',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></svg>',
      ...config
    });
    this.legends = [];
    this.index = 0;
  }

  render() {
    const section = h('section', {
      class: 'panel-image',
      attrs: { 'data-widget-id': this.id, role: 'region', 'aria-label': this.title }
    });
    section.style.backgroundImage = `url('${LEGEND_BG_FALLBACK[0]}')`;

    this.contentEl = h('div', { class: 'panel-image-content' });
    this.contentEl.appendChild(this._buildHead());

    this.textEl = h('div', { class: 'legend-body', attrs: { 'aria-live': 'polite' } });
    this.contentEl.appendChild(this.textEl);

    this.prevBtn = h('button', {
      class: 'panel-nav-btn',
      attrs: { type: 'button', 'aria-label': 'Предыдущая легенда', title: 'Назад' },
      html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>'
    });
    this.nextBtn = h('button', {
      class: 'panel-nav-btn',
      attrs: { type: 'button', 'aria-label': 'Следующая легенда', title: 'Вперёд' },
      html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>'
    });
    this._on(this.prevBtn, 'click', () => this._showIndex(this.index - 1));
    this._on(this.nextBtn, 'click', () => this._showIndex(this.index + 1));

    this.contentEl.appendChild(h('div', { class: 'panel-nav' }, this.prevBtn, this.nextBtn));

    section.appendChild(this.contentEl);
    this.element = section;
    return section;
  }

  async load() {
    this._renderState(this.textEl, 'loading', 'Загрузка легенды…');
    const signal = this._getAbortSignal();

    try {
      const wikitext = await fetchWikiPage(signal);
      if (signal.aborted) return;

      const legends = parsePersonsFromWikitext(wikitext);
      if (!legends.length) {
        this._renderState(this.textEl, 'empty', 'Сегодня в Википедии нет данных');
        return;
      }

      this.legends = legends;
      this.index = 0;
      this._renderCurrent();
    } catch (err) {
      if (err.name === 'AbortError') return;
      console.warn('Legend error:', err);
      this._renderState(this.textEl, 'error', 'Ошибка загрузки · нажмите «Вперёд» для архива');
    }
  }

  _showIndex(i) {
    if (i < 0) return;
    if (i >= this.legends.length) return;

    // Первый клик после error — загружаем fallback
    if (!this.legends.length && i === 0) {
      this.legends = FALLBACK_LEGENDS;
      this.index = 0;
      this._renderCurrent();
      return;
    }
    this.index = i;
    this._renderCurrent();
  }

  _renderCurrent() {
    const person = this.legends[this.index];
    const fallbackBg = LEGEND_BG_FALLBACK[this.index % LEGEND_BG_FALLBACK.length];
    this.element.style.backgroundImage = `url('${fallbackBg}')`;

    const signal = this._abortController?.signal;
    fetchPersonPhoto(person.wikiTitle, person.name, signal).then(photo => {
      if (photo && !signal?.aborted) {
        this.element.style.backgroundImage = `url('${photo}')`;
      }
    }).catch(() => {});

    const link = person.wikiUrl ? h('a', {
      class: 'card-link-white',
      attrs: { href: person.wikiUrl, target: '_blank', rel: 'noopener' },
      html: 'Источник <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:13px;height:13px" aria-hidden="true"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg>'
    }) : null;

    this.textEl.replaceChildren(
      h('div', { class: 'legend-name', text: person.name }),
      person.years ? h('div', { class: 'legend-years', text: person.years }) : null,
      h('div', { class: 'legend-excerpt' },
        h('strong', { text: person.years ? 'Родился в этот день. ' : 'Вспомним сегодня. ' }),
        document.createTextNode(person.role)
      ),
      link
    );
    this._updateNav();
  }

  _updateNav() {
    this.prevBtn.disabled = this.index <= 0;
    this.nextBtn.disabled = this.index >= this.legends.length - 1;
  }
}// JavaScript Document