/* Статические и резервные данные проекта */

export const TOP_SPECTACLES = [
  { title: 'Вишнёвый сад', city: 'msk', theatre: 'МХТ им. Чехова', year: 2024, status: 'Идёт', director: 'Денис Азаров', rating: 9.2, img: 'images/foto_1.jpg' },
  { title: 'Заповедник', city: 'msk', theatre: 'Театр им. Пушкина', year: 2025, status: 'Идёт', director: 'Евгений Писарев', rating: 9.4, img: 'images/foto_2.jpg' },
  { title: 'Сирано де Бержерак', city: 'msk', theatre: 'Театр Вахтангова', year: 2024, status: 'Идёт', director: 'Римас Туминас', rating: 9.5, img: 'images/foto_3.jpg' },
  { title: 'Борис Годунов', city: 'msk', theatre: 'Большой театр', year: 2025, status: 'Идёт', director: 'Александр Сокуров', rating: 9.6, img: 'images/foto_4.jpg' },
  { title: 'На дне', city: 'msk', theatre: 'МХТ им. Чехова', year: 2024, status: 'Идёт', director: 'Константин Богомолов', rating: 9.3, img: 'images/foto_5.jpg' },
  { title: 'Евгений Онегин', city: 'msk', theatre: 'Большой театр', year: 2024, status: 'Идёт', director: 'Дмитрий Черняков', rating: 9.5, img: 'images/foto_6.jpg' },
  { title: 'Макбет', city: 'spb', theatre: 'Александринский театр', year: 2026, status: 'Идёт', director: 'Николай Рощин', rating: 9.0, img: 'images/foto_7.jpg' },
  { title: 'Три', city: 'spb', theatre: 'Театр «Мастерская»', year: 2025, status: 'Идёт', director: 'Пётр Шерешевский', rating: 9.3, img: 'images/foto_8.jpg' },
  { title: 'Гамлет', city: 'spb', theatre: 'Александринский театр', year: 2024, status: 'Идёт', director: 'Валерий Фокин', rating: 9.1, img: 'images/foto_9.jpg' },
  { title: 'Пастернак', city: 'spb', theatre: 'Театр «Мастерская»', year: 2025, status: 'Идёт', director: 'Григорий Козлов', rating: 9.2, img: 'images/foto_10.jpg' },
  { title: 'Музей невинности', city: 'kzn', theatre: 'Театр им. Г. Камала', year: 2026, status: 'Идёт', director: 'Никита Кобелев', rating: 9.5, img: 'images/foto_11.jpg' },
  { title: 'Судьба человека', city: 'kzn', theatre: 'Особняк Демидова', year: 2025, status: 'Идёт', director: 'Айдар Заббаров', rating: 9.3, img: 'images/foto_12.jpg' },
  { title: 'Лебединое озеро', city: 'kzn', theatre: 'Театр оперы и балета им. Джалиля', year: 2025, status: 'Идёт', director: '—', rating: 9.4, img: 'images/foto_13.jpg' },
  { title: 'Любой ценой', city: 'ekb', theatre: 'Свердловский театр драмы', year: 2025, status: 'Идёт', director: 'Алексей Бадаев', rating: 9.6, img: 'images/foto_14.jpg' },
  { title: 'Баядера', city: 'ekb', theatre: 'Свердловская музкомедия', year: 2025, status: 'Идёт', director: '—', rating: 9.4, img: 'images/foto_15.jpg' },
  { title: 'Зойкина квартира', city: 'ekb', theatre: 'Театр кукол', year: 2025, status: 'Идёт', director: '—', rating: 9.0, img: 'images/foto_16.jpg' },
  { title: 'Чайки', city: 'nsk', theatre: 'Новосибирский городской драмтеатр', year: 2025, status: 'Идёт', director: 'Сергей Афанасьев', rating: 9.5, img: 'images/foto_17.jpg' },
  { title: 'Сильва', city: 'nsk', theatre: 'Новосибирский музыкальный театр', year: 2025, status: 'Идёт', director: '—', rating: 9.3, img: 'images/foto_18.jpg' },
  { title: 'Бесы', city: 'nsk', theatre: 'Театр «Красный факел»', year: 2025, status: 'Идёт', director: 'Андрей Прикотенко', rating: 9.2, img: 'images/foto_19.jpg' },
  { title: 'Бесприданница', city: 'nnv', theatre: 'Камерный музыкальный театр', year: 2025, status: 'Идёт', director: 'Сергей Миндрин', rating: 9.5, img: 'images/foto_20.jpg' },
  { title: 'Сотворившая чудо', city: 'nnv', theatre: 'Театр юного зрителя', year: 2023, status: 'Идёт', director: 'Алексей Логачев', rating: 9.2, img: 'images/foto_21.jpg' },
  { title: 'Пиковая дама', city: 'nnv', theatre: 'Театр оперы и балета', year: 2024, status: 'Идёт', director: 'Максим Петров', rating: 9.3, img: 'images/foto_22.jpg' }
];

export const CARD_GRADIENTS = [
  'linear-gradient(135deg, #4a1d2e, #7d3450)',
  'linear-gradient(135deg, #2d2a4a, #4a3f7d)',
  'linear-gradient(135deg, #1d3a4a, #2e647d)',
  'linear-gradient(135deg, #3f1d1d, #7d3030)',
  'linear-gradient(135deg, #1d4a3a, #2e7d5c)',
  'linear-gradient(135deg, #3a2a1d, #7d5c2e)',
  'linear-gradient(135deg, #2a1d4a, #4a2e7d)',
];

export const LEGEND_BG_FALLBACK = [
  'https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1499363536502-87642509e31b?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1507924538820-ede94a04019d?auto=format&fit=crop&w=1200&q=80',
];

export const HISTORY_BG_FALLBACK = [
  'https://images.unsplash.com/photo-1507924538820-ede94a04019d?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1514306191718-452ec28c7814?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1499363536502-87642509e31b?auto=format&fit=crop&w=1200&q=80',
];

export const FALLBACK_LEGENDS = [
  { name: 'Константин Станиславский', years: '1863–1938', role: 'Реформатор сцены, создатель знаменитой системы актёрской техники, соучредитель МХТ.', wikiUrl: 'https://ru.wikipedia.org/wiki/Станиславский,_Константин_Сергеевич', wikiTitle: 'Станиславский,_Константин_Сергеевич' },
  { name: 'Всеволод Мейерхольд', years: '1874–1940', role: 'Режиссёр-новатор, создатель биомеханики, реформатор условного театра.', wikiUrl: 'https://ru.wikipedia.org/wiki/Мейерхольд,_Всеволод_Эмильевич', wikiTitle: 'Мейерхольд,_Всеволод_Эмильевич' },
  { name: 'Владимир Немирович-Данченко', years: '1858–1943', role: 'Режиссёр, драматург, соучредитель Московского Художественного театра.', wikiUrl: 'https://ru.wikipedia.org/wiki/Немирович-Данченко,_Владимир_Иванович', wikiTitle: 'Немирович-Данченко,_Владимир_Иванович' },
  { name: 'Михаил Чехов', years: '1891–1955', role: 'Актёр, режиссёр, педагог, племянник А. П. Чехова.', wikiUrl: 'https://ru.wikipedia.org/wiki/Чехов,_Михаил_Александрович', wikiTitle: 'Чехов,_Михаил_Александрович' },
];

export const FALLBACK_EVENTS = [
  { year: '1898', title: 'Открытие МХТ', description: 'Станиславский и Немирович-Данченко основали Московский Художественный театр — начало новой эпохи русского театра.', wikiUrl: 'https://ru.wikipedia.org/wiki/Московский_Художественный_театр', searchQuery: 'Московский Художественный театр' },
  { year: '1956', title: 'Рождение «Современника»', description: 'Премьера спектакля «Вечно живые» по пьесе Виктора Розова — день рождения театра «Современник».', wikiUrl: 'https://ru.wikipedia.org/wiki/Современник_(театр)', searchQuery: 'Современник театр' },
  { year: '1824', title: 'Открытие Малого театра', description: 'В Москве открыт Малый театр, который позже назовут «вторым университетом» России.', wikiUrl: 'https://ru.wikipedia.org/wiki/Малый_театр', searchQuery: 'Малый театр Москва' },
  { year: '1964', title: 'Премьера «Доброго человека из Сезуана»', description: 'Спектакль Брехта в постановке Юрия Любимова — день рождения Театра на Таганке.', wikiUrl: 'https://ru.wikipedia.org/wiki/Театр_на_Таганке', searchQuery: 'Театр на Таганке' },
  { year: '1776', title: 'Основание Большого театра', description: 'Князь Пётр Урусов получил высочайшее разрешение на содержание театральных представлений в Москве.', wikiUrl: 'https://ru.wikipedia.org/wiki/Большой_театр', searchQuery: 'Большой театр Москва' },
  { year: '1783', title: 'Открытие Александринского театра', description: 'В Санкт-Петербурге основан первый русский публичный театр — будущая Александринка.', wikiUrl: 'https://ru.wikipedia.org/wiki/Александринский_театр', searchQuery: 'Александринский театр' },
  { year: '1860', title: 'Открытие Мариинского театра', description: 'Императорский театр в Санкт-Петербурге получил имя Мариинского — в честь супруги Александра II.', wikiUrl: 'https://ru.wikipedia.org/wiki/Мариинский_театр', searchQuery: 'Мариинский театр' },
  { year: '1921', title: 'Открытие Театра Вахтангова', description: 'Студия Евгения Вахтангова стала самостоятельным театром — сегодня это Театр им. Вахтангова.', wikiUrl: 'https://ru.wikipedia.org/wiki/Театр_имени_Евгения_Вахтангова', searchQuery: 'Театр Вахтангова' },
];

export const PLAYS_TOP5 = [
  { title: 'Женитьба', author: 'Н. Гоголь', count: 59 },
  { title: 'Ревизор', author: 'Н. Гоголь', count: 54 },
  { title: 'Вишнёвый сад', author: 'А. Чехов', count: 45 },
  { title: 'Чайка', author: 'А. Чехов', count: 32 },
  { title: 'Ромео и Джульетта', author: 'У. Шекспир', count: 31 },
];

export const QUOTES = [
  { text: 'Театр — это такая кафедра, с которой можно много сказать миру добра.', author: 'Николай Гоголь' },
  { text: 'Театр начинается с вешалки.', author: 'Константин Станиславский' },
  { text: 'Весь мир — театр, а люди в нём — актёры.', author: 'Уильям Шекспир' },
  { text: 'Не верю!', author: 'Константин Станиславский' },
  { text: 'Театр — это искусство отражать.', author: 'Владимир Немирович-Данченко' },
  { text: 'Сцена — это единственное место, где можно быть кем угодно.', author: 'Михаил Чехов' },
];