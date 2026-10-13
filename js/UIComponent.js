import { h } from './utils.js';

/**
 * Базовый (абстрактный) класс виджета.
 * Все конкретные виджеты должны наследоваться от него
 * и реализовывать методы render() и (опционально) load().
 */
export class UIComponent {
  constructor(config = {}) {
    this.id = config.id || `widget-${Math.random().toString(36).slice(2, 9)}`;
    this.title = config.title || 'Виджет';
    this.subtitle = config.subtitle || '';
    this.icon = config.icon || '';
    this.chip = config.chip || '';
    this.variant = config.variant || 'card';
    this.wide = config.wide === true;

    this.element = null;
    this.contentEl = null;
    this._minimized = false;

    this._listeners = [];
    this._abortController = null;
    this._intervals = [];
  }

  /** Абстрактный метод — должен быть реализован в наследниках */
  render() {
    throw new Error('render() must be implemented in subclass');
  }

  /** Опциональный метод загрузки данных */
  async load() {}

  /** Собирает «шапку» виджета с иконкой, заголовком и кнопкой закрытия */
_buildHead() {
  const closeBtn = h('button', {
    class: 'widget-ctrl',
    attrs: { type: 'button', 'aria-label': 'Закрыть виджет', title: 'Закрыть' },
    text: '×'
  });
  this._on(closeBtn, 'click', () => this.close());

  const iconEl = this.icon
    ? h('div', { class: 'card-icon', html: this.icon })
    : null;

  const titleBlock = h('div', {},
    h('div', { class: 'card-title', text: this.title }),
    this.subtitle ? h('div', { class: 'card-subtitle', text: this.subtitle }) : null
  );

  return h('header', { class: 'card-head' },
    h('div', { class: 'card-title-wrap' }, iconEl, titleBlock),
    h('div', { class: 'widget-actions' },
      this.chip ? h('span', { class: 'chip', text: this.chip }) : null,
      closeBtn
    )
  );
}

  /** Сворачивает / разворачивает виджет */
  minimize() {
    if (!this.element) return;
    this._minimized = !this._minimized;
    this.element.classList.toggle('widget--minimized', this._minimized);
    const btn = this.element.querySelector('.widget-ctrl');
    if (btn) {
      btn.textContent = this._minimized ? '+' : '−';
      btn.setAttribute('aria-label', this._minimized ? 'Развернуть виджет' : 'Свернуть виджет');
    }
  }

  /** Сообщает Dashboard, что виджет нужно удалить */
  close() {
    if (!this.element) return;
    this.element.dispatchEvent(new CustomEvent('widget-close', {
      detail: { id: this.id },
      bubbles: true
    }));
  }

  /** Регистрирует слушатель с автосохранением для destroy() */
  _on(target, event, handler, options) {
    if (!target) return;
    target.addEventListener(event, handler, options);
    this._listeners.push({ target, event, handler, options });
  }

  /** Возвращает свежий AbortSignal, отменяя предыдущий запрос */
  _getAbortSignal() {
    if (this._abortController) this._abortController.abort();
    this._abortController = new AbortController();
    return this._abortController.signal;
  }

  /** Рендерит одно из 4 состояний: loading / empty / error / success */
  _renderState(container, state, message) {
    if (!container) return;
    container.replaceChildren();
    const box = h('div', {
      class: `widget-state widget-state--${state}`,
      attrs: { role: 'status', 'aria-live': 'polite' }
    });
    if (state === 'loading') {
      box.appendChild(h('div', { class: 'widget-state__spinner', attrs: { 'aria-hidden': 'true' } }));
    }
    box.appendChild(h('div', { text: message || '' }));
    container.appendChild(box);
  }

  /** Полная очистка: отмена запросов, таймеров, слушателей, удаление из DOM */
  destroy() {
    if (this._abortController) {
      try { this._abortController.abort(); } catch(e) {}
      this._abortController = null;
    }
    this._intervals.forEach(id => clearInterval(id));
    this._intervals = [];
    this._listeners.forEach(({ target, event, handler, options }) => {
      target.removeEventListener(event, handler, options);
    });
    this._listeners = [];
    if (this.element?.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    this.element = null;
    this.contentEl = null;
  }
}