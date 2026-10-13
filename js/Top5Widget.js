import { UIComponent } from './UIComponent.js';
import { h } from './utils.js';
import { PLAYS_TOP5 } from './data.js';

/**
 * Виджет «Топ-5 спектаклей» — рейтинг по количеству постановок.
 * Работает на статических данных.
 */
export class Top5Widget extends UIComponent {
  constructor(config = {}) {
    super({
      title: 'Топ-5 спектаклей',
      subtitle: 'По количеству постановок',
      chip: 'Сезон',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l2.4 7.4H22l-6 4.4 2.3 7.4L12 16.8 5.7 21.2 8 13.8l-6-4.4h7.6z"/></svg>',
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
    const max = PLAYS_TOP5[0].count;

    PLAYS_TOP5.forEach((p, i) => {
      const fill = h('div', { class: 'play-bar-fill', attrs: { 'aria-hidden': 'true' } });
      fill.style.width = `${(p.count / max * 100).toFixed(1)}%`;

      this.contentEl.appendChild(
        h('div', { class: 'play-row' },
          h('div', { class: 'play-rank', text: String(i + 1) }),
          h('div', { class: 'play-info' },
            h('div', { class: 'play-title', text: p.title }),
            h('div', { class: 'play-author', text: p.author }),
            h('div', { class: 'play-bar' }, fill)
          ),
          h('div', { class: 'play-count', text: String(p.count), attrs: { 'aria-label': `Постановок: ${p.count}` } })
        )
      );
    });

    section.appendChild(this.contentEl);
    this.element = section;
    return section;
  }
}// JavaScript Document