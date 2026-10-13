import { UIComponent } from './UIComponent.js';
import { h } from './utils.js';

/**
 * Виджет «Список дел».
 * Инкапсулирует массив задач, поддерживает добавление, удаление, отметку.
 */
export class ToDoWidget extends UIComponent {
  constructor(config = {}) {
    super({
      title: 'Список дел',
      subtitle: 'Что хочу посмотреть',
      chip: 'ToDo',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
      ...config
    });

    this.tasks = config.tasks ? [...config.tasks] : [
      { id: 1, text: 'Купить билет на «Вишнёвый сад»', done: false },
      { id: 2, text: 'Сходить на «Чайку» в Современник', done: true }
    ];
    this._nextId = Math.max(0, ...this.tasks.map(t => t.id)) + 1;
  }

  render() {
    const section = h('section', {
      class: 'card',
      attrs: { 'data-widget-id': this.id, role: 'region', 'aria-label': this.title }
    });

    section.appendChild(this._buildHead());

    this.contentEl = h('div', { class: 'card-body' });

    // Форма добавления
    const input = h('input', {
      class: 'todo-input',
      attrs: { type: 'text', placeholder: 'Что посмотреть?', 'aria-label': 'Новая запись' }
    });
    const addBtn = h('button', {
      class: 'todo-add',
      attrs: { type: 'submit', 'aria-label': 'Добавить запись' },
      text: 'Добавить'
    });
    const form = h('form', { class: 'todo-form' }, input, addBtn);

    this._on(form, 'submit', (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      this.tasks.push({ id: this._nextId++, text, done: false });
      input.value = '';
      input.focus();
      this._renderTasks();
    });

    this.listEl = h('ul', { class: 'todo-list', attrs: { 'aria-live': 'polite' } });

    this.contentEl.appendChild(form);
    this.contentEl.appendChild(this.listEl);
    section.appendChild(this.contentEl);

    this._renderTasks();
    this.element = section;
    return section;
  }

  _renderTasks() {
    this.listEl.replaceChildren();

    if (!this.tasks.length) {
      this.listEl.appendChild(h('li', { class: 'todo-empty', text: 'Список пуст' }));
      return;
    }

    for (const t of this.tasks) {
      const checkbox = h('input', {
        class: 'todo-checkbox',
        attrs: { type: 'checkbox', 'aria-label': `Отметить «${t.text}»` }
      });
      checkbox.checked = t.done;
      this._on(checkbox, 'change', () => {
        t.done = !t.done;
        this._renderTasks();
      });

      const label = h('label', {
        class: 'todo-text' + (t.done ? ' todo-text--done' : ''),
        text: t.text
      });

      const delBtn = h('button', {
        class: 'todo-delete',
        attrs: { type: 'button', title: 'Удалить', 'aria-label': `Удалить «${t.text}»` },
        text: '×'
      });
      this._on(delBtn, 'click', () => {
        this.tasks = this.tasks.filter(x => x.id !== t.id);
        this._renderTasks();
      });

      this.listEl.appendChild(h('li', { class: 'todo-item' }, checkbox, label, delBtn));
    }
  }
}// JavaScript Document