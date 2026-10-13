import { Dashboard } from './js/Dashboard.js';
import { ToDoWidget } from './js/ToDoWidget.js';
import { QuoteWidget } from './js/QuoteWidget.js';
import { TopSpectaclesWidget } from './js/TopSpectaclesWidget.js';
import { PlayOfTheDayWidget } from './js/PlayOfTheDayWidget.js';
import { LegendWidget } from './js/LegendWidget.js';
import { HistoryWidget } from './js/HistoryWidget.js';
import { Top5Widget } from './js/Top5Widget.js';

/* Реестр: ключ в data-add → конструктор виджета */
const WIDGET_FACTORY = {
  'todo':           () => new ToDoWidget(),
  'quote':          () => new QuoteWidget(),
  'top-spectacles': () => new TopSpectaclesWidget(),
  'play-of-day':    () => new PlayOfTheDayWidget(),
  'legend':         () => new LegendWidget(),
  'history':        () => new HistoryWidget(),
  'top5':           () => new Top5Widget(),
};

function init() {
  const dashboard = new Dashboard('#dashboard');
  window.__dashboard = dashboard; // для отладки

  // Навешиваем обработчики на кнопки добавления
  document.querySelectorAll('[data-add]').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.add;
      const factory = WIDGET_FACTORY[type];
      if (!factory) return;
      dashboard.addWidget(factory());
    });
  });

  // Виджеты по умолчанию
  dashboard.addWidget(new TopSpectaclesWidget());
  dashboard.addWidget(new PlayOfTheDayWidget());
  dashboard.addWidget(new LegendWidget());
  dashboard.addWidget(new HistoryWidget());
  dashboard.addWidget(new Top5Widget());
  dashboard.addWidget(new QuoteWidget());

  // Анимация появления
  document.querySelectorAll('.card, .panel-image').forEach((c, i) => {
    c.style.animationDelay = (i * 0.07) + 's';
  });
}

document.addEventListener('DOMContentLoaded', init);