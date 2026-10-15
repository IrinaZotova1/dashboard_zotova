# dashboard Зотова Ирина 4-мд-5

Архитектура
text
UIComponent (абстрактный)
├── ToDoWidget, QuoteWidget, Top5Widget, TopSpectaclesWidget
└── PlayOfTheDayWidget, LegendWidget, HistoryWidget   ← API
UIComponent — контракт виджета: render() обязателен, load()
опционален. Даёт шапку, 4 состояния, AbortController, автоснятие
слушателей.

Dashboard — Map<id, widget>, ловит событие widget-close
от кнопки «×» и вызывает widget.destroy(). Виджет о панели не знает.

main.js — регистрирует фабрики в WIDGET_FACTORY, кнопки тулбара
вызывают dashboard.addWidget(...).

Виджеты
Виджет	Источник
ToDo	локальный массив
Quote, Top5, TopSpectacles	data.js
Play of the Day	Wikipedia API (случайная категория пьес)
Legend of the Day	Wikipedia API (портал «Театр/День» → «Родились») + Commons
History	Wikipedia API (портал «Театр/День» → «События») + Commons
Три API-виджета — с запасом по требованию «минимум 2».

Источники данных
Wikipedia API — action=parse&prop=wikitext для портала
«Театр/День»; prop=pageimages, list=categorymembers,
prop=extracts|pageimages для персон, событий и пьес.

Wikimedia Commons — резервный источник фото персон и событий.

Unsplash — мгновенные fallback-фоны, пока грузится реальное фото.

data.js — статические наборы (спектакли, цитаты, топ-5,
архив персон и событий) на случай недоступности API.

Тексты из API вставляются только через textContent — никакого
innerHTML для недоверенных данных. innerHTML — только для
собственных SVG-иконок.

Жизненный цикл
destroy() освобождает всё:

Ресурс	Действие
Незавершённые fetch	abortController.abort()
setInterval / setTimeout	clearInterval по _intervals
Слушатели DOM	removeEventListener по _listeners
DOM-узел	удаляется из parentNode
Ссылки	element = null, contentEl = null
Отмена устаревших запросов — _getAbortSignal() при каждом новом
load() прерывает предыдущий fetch. Все запросы получают signal
и корректно падают по AbortError.

Четыре состояния (_renderState): loading / empty / error /
success — единый UI для всех API-виджетов.

Доступность
Все действия — с клавиатуры (Tab + Enter/Space), только нативные
<button>, <a>, <select>, <input>.

Видимый фокус — единый :focus-visible, отдельный светлый вариант
для тёмных фонов.

Добавление виджетов — только кнопками тулбара; drag-n-drop не
используется, кнопочная альтернатива встроена по умолчанию.

ARIA: role="region" + aria-label на виджетах, aria-live="polite"
у списков и состояний, aria-label у иконочных кнопок.

Ограничения
Зависимость от внешних API: при недоступности Wikipedia три виджета
показывают error (с переходом в локальный архив у «Легенды» и
«Истории»). Статические виджеты работают всегда.

Парсинг викитекста эвристический — при смене шаблонов портала
возможны сбои, тогда срабатывает fallback.

fetchPersonPhoto берёт первое фото из Commons без сортировки —
иногда это не портрет.

Фильтры «Топ спектаклей» — только по локальному массиву.

ToDo-список не сохраняется между сессиями (localStorage не
используется).

Порядок виджетов = порядок добавления, перестановка не поддерживается.

Шрифты NauryzRedKeds / Gropled подключаются через local();
без них используется Inter.

Добавить новый виджет
Создать класс-наследник UIComponent в js/MyWidget.js.

Реализовать render(), при необходимости — load().

Зарегистрировать в WIDGET_FACTORY (main.js) и добавить
<button data-add="my-widget"> в тулбар.

Dashboard и UIComponent менять не нужно — демонстрация принципа
открытости/закрытости.

