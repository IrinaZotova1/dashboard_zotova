/** Безопасный конструктор DOM-элементов (без innerHTML для данных) */
export function h(tag, opts = {}, ...children) {
  const node = document.createElement(tag);
  if (typeof opts === 'string') { node.className = opts; opts = {}; }
  if (opts.class) node.className = opts.class;
  if (opts.text != null) node.textContent = String(opts.text);
  if (opts.html) node.innerHTML = opts.html; // только для SVG-иконок
  if (opts.attrs) {
    for (const [k, v] of Object.entries(opts.attrs)) {
      if (v != null && v !== false) node.setAttribute(k, v);
    }
  }
  if (opts.style) Object.assign(node.style, opts.style);
  if (opts.on) {
    for (const [ev, fn] of Object.entries(opts.on)) node.addEventListener(ev, fn);
  }
  for (const c of children.flat()) {
    if (c == null || c === false) continue;
    node.appendChild(typeof c === 'string' || typeof c === 'number'
      ? document.createTextNode(String(c)) : c);
  }
  return node;
}

export const MONTHS_RU = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];

export const CITIES = {
  msk: 'Москва', spb: 'Санкт-Петербург', kzn: 'Казань',
  ekb: 'Екатеринбург', nsk: 'Новосибирск', nnv: 'Нижний Новгород'
};

/** Возвращает информацию о текущей дате и URL портала «Театр/День» */
export function getTodayInfo() {
  const now = new Date();
  const day = now.getDate();
  const monthName = MONTHS_RU[now.getMonth()];
  const pageTitle = `Портал:Театр/День/${day}_${monthName}`;
  const apiUrl = `https://ru.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(pageTitle)}&prop=wikitext&format=json&origin=*`;
  return { day, monthName, pageTitle, apiUrl, dateLabel: `${day} ${monthName}` };
}

/** Удаляет вики-разметку из строки, оставляя чистый текст */
export function cleanWikiText(str) {
  return String(str || '')
    .replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g, '$2')
    .replace(/\[\[([^\]]+)\]\]/g, '$1')
    .replace(/\[(?:https?:\/\/\S+)\s+([^\]]+)\]/g, '$1')
    .replace(/\[(?:https?:\/\/\S+)\]/g, '')
    .replace(/{{[^{}]*}}/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/'''?/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}