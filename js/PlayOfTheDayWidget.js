import { UIComponent } from './UIComponent.js';
import { h } from './utils.js';
import { fetchRandomPlay } from './api.js';

/**
 * Виджет «Пьеса дня» — случайная пьеса из Википедии.
 * Поддерживает 4 состояния: loading / empty / error / success.
 */
export class PlayOfTheDayWidget extends UIComponent {
  constructor(config = {}) {
    super({
      title: 'Пьеса дня',
      subtitle: 'Случайная пьеса из Википедии',
      chip: 'Драматургия',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
      ...config
    });
  }

  render() {
    const section = h('section', {
      class: 'card',
      attrs: { 'data-widget-id': this.id, role: 'region', 'aria-label': this.title }
    });

    section.appendChild(this._buildHead());

    this.contentEl = h('div', { class: 'card-body' });
    this.listEl = h('div', { class: 'rep-list', attrs: { 'aria-live': 'polite' } });
    this.contentEl.appendChild(this.listEl);

    const btn = h('button', {
      class: 'rep-refresh',
      attrs: { type: 'button', 'aria-label': 'Загрузить другую пьесу' },
      text: 'Другая пьеса'
    });
    this._on(btn, 'click', () => this.load());
    this.contentEl.appendChild(btn);

    section.appendChild(this.contentEl);
    this.element = section;
    return section;
  }

  async load() {
    this._renderState(this.listEl, 'loading', 'Загрузка пьесы…');
    const signal = this._getAbortSignal();

    try {
      const play = await fetchRandomPlay(signal);
      if (signal.aborted) return;

      if (!play) {
        this._renderState(this.listEl, 'empty', 'Пьесы не найдены');
        return;
      }
      this._renderPlay(play);
    } catch (err) {
      if (err.name === 'AbortError') return;
      console.warn('Play error:', err);
      this._renderState(this.listEl, 'error', 'Сервис временно недоступен');
    }
  }

  _renderPlay(play) {
    const thumb = h('div', { class: 'rep-thumb' });
    if (play.img) {
      thumb.style.backgroundImage = `url('${play.img}')`;
    } else {
      thumb.style.background = 'linear-gradient(135deg,#4a1d2e,#7d3450)';
      thumb.style.display = 'grid';
      thumb.style.placeItems = 'center';
      thumb.style.color = '#fff';
      thumb.style.fontSize = '32px';
      thumb.textContent = '📖';
    }

    const item = h('a', {
      class: 'rep-item',
      attrs: { href: play.url, target: '_blank', rel: 'noopener noreferrer' }
    },
      thumb,
      h('div', { class: 'rep-info' },
        h('div', { class: 'rep-name', text: play.title }),
        h('div', { class: 'rep-desc', text: play.description }),
        h('div', { class: 'rep-meta' },
          h('span', { class: 'rep-date-badge', text: 'Wikipedia' }),
          h('span', { text: 'Русская драматургия' })
        )
      )
    );

    this.listEl.replaceChildren(item);
  }
}// JavaScript Document