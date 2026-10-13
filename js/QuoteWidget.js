import { UIComponent } from './UIComponent.js';
import { h } from './utils.js';
import { QUOTES } from './data.js';

/**
 * Виджет «Случайная цитата».
 * Кнопка обновления переключает цитату из внутреннего массива.
 */
export class QuoteWidget extends UIComponent {
  constructor(config = {}) {
    super({
      title: 'Цитата о театре',
      chip: 'Цитата',
      variant: 'quote',
      wide: true,
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2-2-2H4c-1.25 0-2 .75-2 2v4c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2-2-2h-4c-1.25 0-2 .75-2 2v4c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>',
      ...config
    });
    this.index = 0;
  }

  render() {
    const section = h('section', {
      class: 'card quote-card full',
      attrs: { 'data-widget-id': this.id, role: 'region', 'aria-label': this.title }
    });

    // ВАЖНО: сохраняем корень ДО _buildHead() — иначе кнопки «−» (свернуть)
    // и «×» (закрыть), чьи обработчики читают this.element, могут
    // оказаться нерабочими.
    this.element = section;

    section.appendChild(this._buildHead());

    this.textEl = h('div', { class: 'quote-text', attrs: { 'aria-live': 'polite' } });
    this.authorEl = h('div', { class: 'quote-author' });

    const refreshBtn = h('button', {
      class: 'quote-refresh',
      attrs: { type: 'button', title: 'Другая цитата', 'aria-label': 'Показать другую цитату' },
      html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.5 9a9 9 0 0 1 14.9-3.4L23 10"/><path d="M20.5 15a9 9 0 0 1-14.9 3.4L1 14"/></svg>'
    });
    this._on(refreshBtn, 'click', () => this._next());

    this.contentEl = h('div', { class: 'card-body' });
    this.contentEl.appendChild(
      h('div', { class: 'quote-inner' },
        h('div', { class: 'quote-mark', text: '“', attrs: { 'aria-hidden': 'true' } }),
        h('div', { class: 'quote-body' }, this.textEl, this.authorEl),
        refreshBtn
      )
    );
    section.appendChild(this.contentEl);

    this._renderQuote();
    return section;
  }

  _renderQuote() {
    const q = QUOTES[this.index];
    this.textEl.textContent = q.text;
    this.authorEl.textContent = q.author;
  }

  _next() {
    this.index = (this.index + 1) % QUOTES.length;
    this._renderQuote();
  }
}