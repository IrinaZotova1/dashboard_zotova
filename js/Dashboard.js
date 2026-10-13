import { UIComponent } from './UIComponent.js';

/**
 * Класс-менеджер панели виджетов.
 * Хранит коллекцию активных виджетов, отвечает за добавление и удаление.
 */
export class Dashboard {
  constructor(containerSelector) {
    this.container = document.querySelector(containerSelector);
    if (!this.container) throw new Error('Dashboard container not found');

    this.widgets = new Map();

    // Слушаем кастомное событие widget-close от виджетов
    this._onClose = (e) => {
      const id = e.detail?.id;
      if (id) this.removeWidget(id);
    };
    this.container.addEventListener('widget-close', this._onClose);
  }

  /** Добавляет виджет-экземпляр в панель */
  addWidget(widget) {
    if (!(widget instanceof UIComponent)) {
      console.warn('addWidget: ожидается экземпляр UIComponent');
      return null;
    }
    const root = widget.render();
    this.container.appendChild(root);
    this.widgets.set(widget.id, widget);

    // Асинхронная загрузка данных, если есть
    if (typeof widget.load === 'function') {
      widget.load().catch(err => console.warn('Widget load error:', err));
    }
    return widget;
  }

  /** Удаляет виджет по ID, вызывая его destroy() */
  removeWidget(widgetId) {
    const widget = this.widgets.get(widgetId);
    if (!widget) return false;
    widget.destroy();
    this.widgets.delete(widgetId);
    return true;
  }

  /** Количество активных виджетов */
  get count() {
    return this.widgets.size;
  }

  /** Полная очистка панели */
  destroy() {
    for (const w of this.widgets.values()) w.destroy();
    this.widgets.clear();
    this.container.removeEventListener('widget-close', this._onClose);
  }
}