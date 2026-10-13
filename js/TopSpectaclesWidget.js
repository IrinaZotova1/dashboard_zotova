import { UIComponent } from './UIComponent.js';
import { h, CITIES } from './utils.js';
import { TOP_SPECTACLES, CARD_GRADIENTS } from './data.js';

/**
 * Виджет «Топ спектаклей России».
 * Работает на статических данных, поддерживает фильтрацию по городу и году.
 */
export class TopSpectaclesWidget extends UIComponent {
  constructor(config = {}) {
    super({
      title: 'Топ спектаклей',
      chip: 'Live',
      variant: 'hero',
      wide: true,
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l2.4 7.4H22l-6 4.4 2.3 7.4L12 16.8 5.7 21.2 8 13.8l-6-4.4h7.6z"/></svg>',
      ...config
    });
    this.cityFilter = 'all';
    this.yearFilter = 'all';
  }

  render() {
    const section = h('section', {
      class: 'card hero full',
      attrs: { 'data-widget-id': this.id, role: 'region', 'aria-label': this.title }
    });

    this.heroImage = h('div', { class: 'hero-image', attrs: { 'aria-hidden': 'true' } });
    this.heroImage.style.background = 'linear-gradient(135deg, #1c1b1a 0%, #3a2530 50%, #1c1b1a 100%)';

    this.countEl = h('span', { class: 'pill', text: '· спектаклей' });

    const citySelect = h('select', { class: 'filter-select', attrs: { 'aria-label': 'Выбор города' } });
    for (const [val, label] of [['all','Все города'],['msk','Москва'],['spb','Санкт-Петербург'],['kzn','Казань'],['ekb','Екатеринбург'],['nsk','Новосибирск'],['nnv','Нижний Новгород']]) {
      citySelect.appendChild(h('option', { text: label, attrs: { value: val } }));
    }
    this._on(citySelect, 'change', (e) => { this.cityFilter = e.target.value; this._renderList(); });

    const yearSelect = h('select', { class: 'filter-select', attrs: { 'aria-label': 'Выбор года премьеры' } });
    for (const val of ['all','2026','2025','2024']) {
      yearSelect.appendChild(h('option', { text: val === 'all' ? 'Все годы' : val, attrs: { value: val } }));
    }
    this._on(yearSelect, 'change', (e) => { this.yearFilter = e.target.value; this._renderList(); });

    this.carousel = h('div', { class: 'carousel-strip', attrs: { role: 'list' } });

    const heroContent = h('div', { class: 'hero-content' },
      h('div', { class: 'hero-top' },
        h('div', { class: 'pill-group' },
          h('span', { class: 'pill pill-live', text: 'Live' }),
          h('span', { class: 'pill' }, 'Топ спектаклей')
        ),
        h('div', { class: 'pill-group' }, this.countEl)
      ),
      h('div', { class: 'hero-bottom' },
        h('div', { class: 'hero-title-block' },
          h('h2', { class: 'hero-title', text: 'Топ спектаклей России' }),
          h('p', { class: 'hero-desc', text: 'Лучшие постановки театров Москвы, Санкт-Петербурга, Казани, Екатеринбурга, Новосибирска и Нижнего Новгорода.' }),
          h('div', { class: 'hero-filters' }, citySelect, yearSelect)
        ),
        this.carousel
      )
    );

    section.appendChild(this.heroImage);
    section.appendChild(h('div', { class: 'hero-overlay', attrs: { 'aria-hidden': 'true' } }));
    section.appendChild(heroContent);
    section.appendChild(this._buildHead());

    this.element = section;
    return section;
  }

  async load() {
    this._renderList();
  }

  _renderList() {
    const filtered = TOP_SPECTACLES.filter(s =>
      (this.cityFilter === 'all' || s.city === this.cityFilter) &&
      (this.yearFilter === 'all' || String(s.year) === this.yearFilter)
    );

    this.countEl.textContent = `${filtered.length} спектаклей`;

    if (!filtered.length) {
      this._renderState(this.carousel, 'empty', 'По выбранным фильтрам ничего нет');
      return;
    }

    this.carousel.replaceChildren(...filtered.map((s, i) => this._buildCard(s, i)));
  }

  _buildCard(s, i) {
    const poster = h('div', { class: 'show-poster' });
    poster.appendChild(h('span', {
      class: `show-status show-status--${s.status === 'Идёт' ? 'active' : 'ended'}`,
      text: s.status
    }));

    const ratingSvg = h('span', { html: '<svg viewBox="0 0 24 24" fill="currentColor" style="width:11px;height:11px;color:#d4a24e" aria-hidden="true"><path d="M12 2l2.4 7.4H22l-6 4.4 2.3 7.4L12 16.8 5.7 21.2 8 13.8l-6-4.4h7.6z"/></svg>' });
    poster.appendChild(h('span', { class: 'show-rating', attrs: { 'aria-label': `Рейтинг ${s.rating.toFixed(1)}` } },
      ratingSvg, document.createTextNode(' ' + s.rating.toFixed(1))));

    const img = h('img', { attrs: { src: s.img || '', alt: s.title, loading: 'lazy', referrerpolicy: 'no-referrer' } });
    img.addEventListener('error', () => {
      img.style.display = 'none';
      poster.style.background = CARD_GRADIENTS[i % CARD_GRADIENTS.length];
    }, { once: true });
    poster.appendChild(img);

    return h('article', { class: 'show-card', attrs: { role: 'listitem' } },
      poster,
      h('div', { class: 'show-body' },
        h('div', { class: 'show-theatre', text: `${s.theatre} · ${CITIES[s.city]}` }),
        h('div', { class: 'show-title', text: s.title }),
        h('div', { class: 'show-meta-block' },
          h('div', { class: 'show-meta-row' }, 'Режиссёр: ', h('strong', { text: s.director })),
          h('div', { class: 'show-meta-row' }, 'Премьера: ', h('strong', { text: String(s.year) }))
        ),
        h('div', { class: 'show-bottom' },
          h('span', { text: s.status === 'Идёт' ? 'Сейчас на сцене' : 'Архив' }),
          h('span', { class: 'show-year', text: String(s.year) })
        )
      )
    );
  }
}// JavaScript Document