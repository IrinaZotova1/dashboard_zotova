import { getTodayInfo, cleanWikiText } from './utils.js';

/** Загружает викитекст страницы «Портал:Театр/День/{дата}» */
export async function fetchWikiPage(signal) {
  const { apiUrl } = getTodayInfo();
  const res = await fetch(apiUrl, { signal });
  if (!res.ok) throw new Error(`Wikipedia HTTP ${res.status}`);
  const data = await res.json();
  const wikitext = data.parse?.wikitext?.['*'] || '';
  if (!wikitext) throw new Error('Empty wikitext');
  return wikitext;
}

/** Ищет фото персоны: Wikipedia pageimages → Commons search */
export async function fetchPersonPhoto(wikiTitle, personName, signal) {
  if (wikiTitle) {
    try {
      const url = `https://ru.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(wikiTitle)}&prop=pageimages&format=json&origin=*&pithumbsize=1000`;
      const res = await fetch(url, { signal });
      const data = await res.json();
      const page = Object.values(data.query?.pages || {})[0];
      if (page?.thumbnail?.source) return page.thumbnail.source;
    } catch(e) { if (e.name === 'AbortError') throw e; }
  }
  if (personName) {
    try {
      const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(personName)}&gsrlimit=1&prop=imageinfo&iiprop=url&iiurlwidth=1000&format=json&origin=*`;
      const res = await fetch(url, { signal });
      const data = await res.json();
      const page = Object.values(data.query?.pages || {})[0];
      if (page?.imageinfo?.[0]?.thumburl) return page.imageinfo[0].thumburl;
    } catch(e) { if (e.name === 'AbortError') throw e; }
  }
  return null;
}

/** Ищет фото события по ключевой фразе */
export async function fetchEventPhoto(query, signal) {
  if (!query) return null;
  try {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=1&prop=imageinfo&iiprop=url&iiurlwidth=1000&format=json&origin=*`;
    const res = await fetch(url, { signal });
    const data = await res.json();
    const page = Object.values(data.query?.pages || {})[0];
    if (page?.imageinfo?.[0]?.thumburl) return page.imageinfo[0].thumburl;
  } catch(e) { if (e.name === 'AbortError') throw e; }
  return null;
}

/** Ищет случайную пьесу из категорий Википедии */
export async function fetchRandomPlay(signal) {
  const categories = [
    'Категория:Пьесы_по_алфавиту',
    'Категория:Пьесы_России',
    'Категория:Пьесы_XIX_века',
    'Категория:Пьесы_XX_века'
  ];
  const category = categories[Math.floor(Math.random() * categories.length)];

  const listUrl = `https://ru.wikipedia.org/w/api.php?action=query&list=categorymembers&cmtitle=${encodeURIComponent(category)}&cmlimit=200&cmtype=page&format=json&origin=*`;
  const listRes = await fetch(listUrl, { signal });
  if (!listRes.ok) throw new Error(`HTTP ${listRes.status}`);
  const listData = await listRes.json();
  const pages = listData.query?.categorymembers || [];
  if (!pages.length) return null;

  const title = pages[Math.floor(Math.random() * pages.length)].title;
  const detailUrl = `https://ru.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=extracts|pageimages&exintro=true&explaintext=true&pithumbsize=300&format=json&origin=*`;
  const detailRes = await fetch(detailUrl, { signal });
  const detailData = await detailRes.json();
  const page = Object.values(detailData.query?.pages || {})[0];

  const extract = (page?.extract || '').replace(/\s+/g, ' ').trim();
  return {
    title,
    description: extract.length > 180 ? extract.slice(0, 177) + '…' : (extract || 'Описание отсутствует'),
    img: page?.thumbnail?.source || '',
    url: `https://ru.wikipedia.org/wiki/${encodeURIComponent(title)}`
  };
}

/** Парсит раздел «Родились» — возвращает массив персон */
export function parsePersonsFromWikitext(wikitext) {
  if (!wikitext) return [];
  const sectionMatch = wikitext.match(/={2,4}\s*Родились\s*={2,4}([\s\S]*?)(?=={2,4}\s*[А-ЯЁ]|$)/);
  if (!sectionMatch) return [];

  const lines = sectionMatch[1].split('\n').filter(l => /^[*\-]/.test(l.trim()));
  const persons = [];

  for (const line of lines) {
    const yearMatch = line.match(/\[?\[?(\d{4})\]?\]?/);
    const birthYear = yearMatch ? yearMatch[1] : '';

    const allLinks = [...line.matchAll(/\[\[([^|\]]+)(?:\|([^\]]+))?\]\]/g)];
    const personLink = allLinks.find(m => !/^\d{1,4}$/.test(m[1].trim()));
    if (!personLink) continue;

    const wikiTitle = personLink[1];
    const displayName = personLink[2] || personLink[1];
    const rest = line.replace(personLink[0], '');
    let description = cleanWikiText(rest)
      .replace(/^[\*\-]\s*/, '')
      .replace(/\[?\d{4}\]?/g, '')
      .replace(/^[—–,:;\s]+/, '');
    if (!description || description.length < 5) description = 'театральный деятель';
    const firstSentence = description.split(/\.\s/)[0];
    if (firstSentence.length > 10) description = firstSentence;

    persons.push({
      name: displayName,
      years: birthYear ? `${birthYear}–` : '',
      role: description,
      wikiTitle,
      wikiUrl: `https://ru.wikipedia.org/wiki/${encodeURIComponent(wikiTitle)}`
    });
  }
  return persons;
}

/** Парсит раздел «События» — возвращает массив событий */
export function parseEventsFromWikitext(wikitext) {
  if (!wikitext) return [];
  const sectionMatch = wikitext.match(/={2,4}\s*События\s*={2,4}([\s\S]*?)(?=={2,4}\s*[А-ЯЁ]|$)/);
  if (!sectionMatch) return [];

  const lines = sectionMatch[1].split('\n').filter(l => /^[*\-]/.test(l.trim()));
  const list = [];

  for (const line of lines) {
    const yearMatch = line.match(/\[?\[?(\d{4})\]?\]?/);
    const year = yearMatch ? yearMatch[1] : '';
    let description = cleanWikiText(line)
      .replace(/^[\*\-]\s*/, '')
      .replace(/^\d{4}\s*[—–-]?\s*/, '');
    if (!description || description.length < 15) continue;

    let title = description;
    const breakMatch = description.match(/^(.{15,80}?)(?:\s*[—–:]\s+|\.\s+)/);
    if (breakMatch) title = breakMatch[1].trim();
    else if (title.length > 75) title = title.slice(0, 72) + '…';

    const linkMatch = line.match(/\[\[([^|\]]+)(?:\|[^\]]+)?\]\]/);
    const searchQuery = linkMatch ? linkMatch[1] : title;
    list.push({ year, title, description, wikiUrl: '', searchQuery });
  }
  return list;
}