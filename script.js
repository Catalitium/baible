(function (global) {
      'use strict';

      const isBrowser = typeof document !== 'undefined';
      const root = isBrowser ? document.documentElement : { style: { setProperty: function () {} } };
      const historyApi = isBrowser ? global.history : null;
      const locationApi = isBrowser ? global.location : null;
      const PALETTES = [
  { base: '#fefdfa', secondary: '#f6f9ff', tertiary: '#fcf7ff', card: 'rgba(255,255,255,0.94)', cardSoft: 'rgba(255,255,255,0.86)', halo: 'rgba(148,163,184,0.15)', border: 'rgba(15,23,42,0.06)', accent: '#0f172a', accentSoft: 'rgba(148,163,184,0.35)' },
  { base: '#fffef9', secondary: '#f3fbff', tertiary: '#fff5fb', card: 'rgba(255,255,255,0.95)', cardSoft: 'rgba(255,255,255,0.88)', halo: 'rgba(226,232,240,0.4)', border: 'rgba(15,23,42,0.05)', accent: '#1d2742', accentSoft: 'rgba(148,163,184,0.28)' },
  { base: '#fdfcfe', secondary: '#f4fbff', tertiary: '#fcf8f2', card: 'rgba(255,255,255,0.93)', cardSoft: 'rgba(255,255,255,0.84)', halo: 'rgba(210,219,238,0.45)', border: 'rgba(15,23,42,0.07)', accent: '#111827', accentSoft: 'rgba(107,114,128,0.4)' }
      ];
      applyPalette(PALETTES[Math.floor(Math.random() * PALETTES.length)]);

      const LANG_CONFIG = [
  {
    code: 'en',
    flag: '🇬🇧',
    label: 'EN',
    name: 'English',
    sources: [
      'bibles/EN/'
    ],
    placeholder: 'Search "love", "John 3:16", "ps 23"...',
    hint: 'Examples: "Commandments", "Jesus", "john 3:16"',
    tagline: 'You are the salt of the earth but...',
    searchLabel: 'Search the Scriptures',
    random: 'Random verse',
    multi: 'Search all languages',
    multiHint: 'EN · ES · DE',
    multiDisabled: 'Load both languages to search everything.',
    loading: 'Loading verses...',
    idle: 'Type a keyword, book, or reference.',
    noResults: 'No verses matched. Try something else.',
    ready: 'Ready',
    resultsWord: 'results',
    virtualized: 'Virtualized',
    expand: 'Expand translations',
    collapse: 'Hide translations',
    error: 'Unable to load Bible texts. Check your connection.',
    randomStatus: 'Random verse ready',
    suggestions: ['Commandments', 'Jesus', 'Motivation', 'Psalms']
  },
  {
    code: 'es',
    flag: '🇪🇸',
    label: 'ES',
    name: 'Español',
    sources: [
      'bibles/ES/'
    ],
    placeholder: 'Buscar "amor", "Juan 3:16", "Salmo 23"...',
    hint: 'Ejemplos: "Comandamientos", "Jesús", "juan 3:16"',
    tagline: 'Mi pueblo es destruido por falta de conocimiento...',
    searchLabel: 'Buscar en las Escrituras',
    random: 'Versículo aleatorio',
    multi: 'Buscar en todos los idiomas',
    multiHint: 'EN · ES · DE',
    multiDisabled: 'Carga ambos idiomas para buscar en todo.',
    loading: 'Cargando versículos...',
    idle: 'Escribe una palabra, libro o referencia.',
    noResults: 'No se encontraron versículos. Intenta con otra búsqueda.',
    ready: 'Listo',
    resultsWord: 'resultados',
    virtualized: 'Virtualizado',
    expand: 'Expandir traducciones',
    collapse: 'Ocultar traducciones',
    error: 'No se pudieron cargar los textos bíblicos. Revisa tu conexión.',
    randomStatus: 'Versículo aleatorio listo',
    suggestions: ['Comandamientos', 'Jesús', 'Motivación', 'Salmos']
  },
  {
    code: 'de',
    flag: '🇩🇪',
    label: 'DE',
    name: 'Deutsch',
    sources: [
      'bibles/de_schlachter.json'
    ],
    placeholder: 'Suche "Liebe", "Johannes 3:16", "Psalm 23"...',
    hint: 'Beispiele: "Gebote", "Jesus", "Paulus 3:16"',
    tagline: 'Ihr seid das Salz der Erde... Wenn nun das Salz nicht mehr salzt, womit soll man es salzen?',
    searchLabel: 'Die Schrift durchsuchen',
    random: 'Zufälliger Vers',
    multi: 'Alle Sprachen durchsuchen',
    multiHint: 'EN · ES · DE',
    multiDisabled: 'Laden Sie alle Sprachen, um alles zu durchsuchen.',
    loading: 'Verse werden geladen...',
    idle: 'Geben Sie ein Schlüsselwort, Buch oder Referenz ein.',
    noResults: 'Keine Verse gefunden. Versuchen Sie etwas anderes.',
    ready: 'Bereit',
    resultsWord: 'Ergebnisse',
    virtualized: 'Virtualisiert',
    expand: 'Übersetzungen erweitern',
    collapse: 'Übersetzungen ausblenden',
    error: 'Bibeltexte konnten nicht geladen werden. Überprüfen Sie Ihre Verbindung.',
    randomStatus: 'Zufälliger Vers bereit',
    suggestions: ['Gebote', 'Jesus', 'Motivation', 'Psalmen']
  }
      ];
      const LANG_MAP = Object.create(null);
      LANG_CONFIG.forEach(cfg => {
  LANG_MAP[cfg.code] = cfg;
      });
      const LANG_ORDER = LANG_CONFIG.map(cfg => cfg.code);

      const BOOKS_EN = ['Genesis','Exodus','Leviticus','Numbers','Deuteronomy','Joshua','Judges','Ruth','1 Samuel','2 Samuel','1 Kings','2 Kings','1 Chronicles','2 Chronicles','Ezra','Nehemiah','Esther','Job','Psalms','Proverbs','Ecclesiastes','Song of Solomon','Isaiah','Jeremiah','Lamentations','Ezekiel','Daniel','Hosea','Joel','Amos','Obadiah','Jonah','Micah','Nahum','Habakkuk','Zephaniah','Haggai','Zechariah','Malachi','Matthew','Mark','Luke','John','Acts','Romans','1 Corinthians','2 Corinthians','Galatians','Ephesians','Philippians','Colossians','1 Thessalonians','2 Thessalonians','1 Timothy','2 Timothy','Titus','Philemon','Hebrews','James','1 Peter','2 Peter','1 John','2 John','3 John','Jude','Revelation'];
      const BOOKS_ES = ['Génesis','Éxodo','Levítico','Números','Deuteronomio','Josué','Jueces','Rut','1 Samuel','2 Samuel','1 Reyes','2 Reyes','1 Crónicas','2 Crónicas','Esdras','Nehemías','Ester','Job','Salmos','Proverbios','Eclesiastés','Cantares','Isaías','Jeremías','Lamentaciones','Ezequiel','Daniel','Oseas','Joel','Amós','Abdías','Jonás','Miqueas','Nahúm','Habacuc','Sofonías','Hageo','Zacarías','Malaquías','Mateo','Marcos','Lucas','Juan','Hechos','Romanos','1 Corintios','2 Corintios','Gálatas','Efesios','Filipenses','Colosenses','1 Tesalonicenses','2 Tesalonicenses','1 Timoteo','2 Timoteo','Tito','Filemón','Hebreos','Santiago','1 Pedro','2 Pedro','1 Juan','2 Juan','3 Juan','Judas','Apocalipsis'];
      const BOOKS_DE = ['1. Mose','2. Mose','3. Mose','4. Mose','5. Mose','Josua','Richter','Ruth','1. Samuel','2. Samuel','1. Könige','2. Könige','1. Chronik','2. Chronik','Esra','Nehemia','Ester','Hiob','Psalmen','Sprüche','Prediger','Hohelied','Jesaja','Jeremia','Klagelieder','Hesekiel','Daniel','Hosea','Joel','Amos','Obadja','Jona','Micha','Nahum','Habakuk','Zefanja','Haggai','Sacharja','Maleachi','Matthäus','Markus','Lukas','Johannes','Apostelgeschichte','Römer','1. Korinther','2. Korinther','Galater','Epheser','Philipper','Kolosser','1. Thessalonicher','2. Thessalonicher','1. Timotheus','2. Timotheus','Titus','Philemon','Hebräer','Jakobus','1. Petrus','2. Petrus','1. Johannes','2. Johannes','3. Johannes','Judas','Offenbarung'];
      const BOOK_LABELS = { en: BOOKS_EN, es: BOOKS_ES, de: BOOKS_DE };
      const BOOK_INDEX = new Map(BOOKS_EN.map((name, idx) => [name, idx]));
      const BOOK_ALIASES = {
  'Song of Solomon': ['song of songs', 'canticles', 'cantar de los cantares', 'cantico de los canticos', 'hohelied'],
  'Psalms': ['ps', 'psalm', 'psalmen', 'salmos'],
  'Proverbs': ['prov', 'spr', 'spruche', 'sprueche', 'proverbios'],
  'Ecclesiastes': ['qoheleth', 'prediger'],
  'Revelation': ['apocalypse', 'apocalipsis', 'offenbarung'],
  'Acts': ['hechos', 'apostelgeschichte'],
  'Genesis': ['gn'],
  'Exodus': ['ex'],
  'Leviticus': ['lv'],
  'Numbers': ['nm'],
  'Deuteronomy': ['dt'],
  '1 Samuel': ['1sam', 'i samuel'],
  '2 Samuel': ['2sam', 'ii samuel'],
  '1 Kings': ['1kgs', '1 reyes', '1 koenige'],
  '2 Kings': ['2kgs', '2 reyes', '2 koenige'],
  'Matthew': ['mt', 'mateo'],
  'Mark': ['mk', 'marcos'],
  'Luke': ['lk', 'lucas'],
  'John': ['jn', 'juan', 'johannes']
      };

      let BOOK_TOKENS;
      const STORAGE_KEYS = { lang: 'baible.lang', multi: 'baible.multi', reminder: 'baible.reminder' };
      const APP_DATA_VERSION = 1;
      const MAX_RESULTS = 200;
      const INITIAL_BATCH = 40;
      const LOAD_BATCH = 40;
      const SEARCH_DELAY = 300;
      const LOAD_STEPS = { start: 0.05, fetch: 0.35, normalize: 0.65, persist: 0.85, done: 1 };

      const refs = {};
      const loaderState = {};
      const bibleCache = new Map();
      const globalBundles = new Map();
      const loadingPromises = new Map();
      const analyticsQueue = [];
      let analyticsInterval = null;
      let searchTimer = null;
      let statusTimer = null;
      let hashSync = false;
      let cacheReset = false;

      const state = {
  lang: 'en',  // Will be initialized in init()
  multiLang: false,  // Will be initialized in init()
  query: '',
  ready: false,
  results: [],
  visibleCount: 0,
  highlightTokens: [],
  expanded: new Set(),
  isReference: false,
  lastReference: null,
  pendingReference: null,
  loadedLangs: new Set(),
  lastHash: ''
      };

      let storage;  // Will be initialized in init()

      if (isBrowser) {
  document.addEventListener('DOMContentLoaded', init);
  }

  function applyPalette(palette) {
  if (!palette) return;
  const mappings = {
    '--bg-base': palette.base,
    '--soft-bg': palette.base,
    '--bg-secondary': palette.secondary,
    '--bg-tertiary': palette.tertiary,
    '--card-bg': palette.card,
    '--card-soft': palette.cardSoft,
    '--halo': palette.halo,
    '--border-soft': palette.border,
    '--accent': palette.accent,
    '--accent-soft': palette.accentSoft
  };
  Object.keys(mappings).forEach(key => {
    if (mappings[key]) {
      root.style.setProperty(key, mappings[key]);
    }
  });
  }

  function loadStoredLang() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.lang);
    return LANG_MAP[stored] ? stored : 'en';
  } catch (_) {
    return 'en';
  }
  }
  function loadStoredMulti() {
  try {
    return localStorage.getItem(STORAGE_KEYS.multi) === '1';
  } catch (_) {
    return false;
  }
  }
  function getPreference(key, defaultValue) {
  try {
    const value = localStorage.getItem(key);
    if (value === null) return defaultValue;
    return value === '1' || value === 'true';
  } catch (_) {
    return defaultValue;
  }
  }
  function savePreference(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (_) {
    /* ignore */
  }
  }
  function createStorage() {
  const DB_NAME = 'baible.store';
  const STORE = 'languages';
  let dbPromise = null;
  function openDB() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);
      request.onerror = () => reject(request.error);
      request.onupgradeneeded = event => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE)) {
          db.createObjectStore(STORE, { keyPath: 'lang' });
        }
      };
      request.onsuccess = () => resolve(request.result);
    });
    return dbPromise;
  }
  async function read(lang) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readonly');
      const req = tx.objectStore(STORE).get(lang);
      req.onerror = () => reject(req.error);
      req.onsuccess = () => {
        const record = req.result;
        if (!record) {
          resolve({ books: null, stale: false });
        } else if (record.version !== APP_DATA_VERSION) {
          resolve({ books: null, stale: true });
        } else {
          resolve({ books: record.books, stale: false });
        }
      };
    });
  }
  async function write(lang, books) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.objectStore(STORE).put({ lang, books, version: APP_DATA_VERSION, updated: Date.now() });
    });
  }
  async function reset() {
    if (dbPromise) {
      const db = await dbPromise;
      db.close();
      dbPromise = null;
    }
    return new Promise((resolve, reject) => {
      const req = indexedDB.deleteDatabase(DB_NAME);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }
  return { read, write, reset };
}

  function buildBookTokens() {
    const map = new Map();
    BOOKS_EN.forEach((bookKey, idx) => {
      const tokens = new Set();
      addAliasTokens(tokens, BOOKS_EN[idx]);
      addAliasTokens(tokens, BOOKS_ES[idx]);
      addAliasTokens(tokens, BOOKS_DE[idx]);
      (BOOK_ALIASES[bookKey] || []).forEach(alias => addAliasTokens(tokens, alias));
      tokens.forEach(token => {
        if (token && !map.has(token)) {
          map.set(token, bookKey);
  }
    });
  });
  return map;
  }
  function addAliasTokens(set, label) {
  const normalized = normalizeBookLabel(label);
  if (!normalized) return;
  set.add(normalized);
  set.add(normalized.replace(/\s+/g, ''));
  const words = normalized.split(' ');
  if (words.length > 1) {
    set.add(words.map(word => word.charAt(0)).join(''));
    set.add(words.map(word => word.slice(0, 3)).join(''));
  }
  const short = words[0];
  if (short) {
    set.add(short.slice(0, 3));
    set.add(short.slice(0, 2));
  }
  if (/^[123]/.test(normalized)) {
    const rest = normalized.replace(/^[123]\s*/, '');
    const prefix = normalized.charAt(0);
    const ordinalMap = {
      '1': ['1', 'i', 'first', '1st', 'primer', 'primera', 'primero', 'uno', 'erst', 'erste'],
      '2': ['2', 'ii', 'second', '2nd', 'segundo', 'segunda', 'dos', 'zweite', 'zweit'],
      '3': ['3', 'iii', 'third', '3rd', 'tercero', 'tercera', 'tres', 'dritte']
    };
    (ordinalMap[prefix] || []).forEach(token => {
      set.add(`${token}${rest}`.trim());
      set.add(`${token} ${rest}`.trim());
    });
  }
  }
  function normalizeBookLabel(label) {
  return label
    ? label
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
    : '';
  }
  function resolveBook(fragment) {
  const target = normalizeBookLabel(fragment);
  if (!target) return null;
  if (BOOK_TOKENS.has(target)) {
    return BOOK_TOKENS.get(target);
  }
  let best = null;
  BOOK_TOKENS.forEach((bookKey, token) => {
    if (token.startsWith(target) || target.startsWith(token)) {
      if (!best || token.length > best.tokenLength) {
        best = { tokenLength: token.length, bookKey };
  }
    }
  });
  return best ? best.bookKey : null;
  }

  function getCopy() {
  return LANG_MAP[state.lang] || LANG_CONFIG[0];
  }
  function getBookLabel(bookKey, lang) {
  const idx = BOOK_INDEX.get(bookKey);
  if (idx == null) return bookKey;
  const labels = BOOK_LABELS[lang] || BOOKS_EN;
  return labels[idx] || bookKey;
  }
  function escapeHtml(value) {
  return (value || '').replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[char]);
  }
  function createNotice(text) {
  const div = document.createElement('div');
  div.className = 'rounded-2xl border border-dashed border-slate-200 bg-white/80 px-4 py-6 text-center text-sm text-slate-500';
  div.textContent = text;
  return div;
  }
  function normalizePlain(value) {
  return value
    ? value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
    : '';
  }
  function extractPlainTokens(value) {
  const plain = normalizePlain(value);
  return plain ? plain.split(' ').filter(Boolean) : [];
  }
  function buildHighlightTokens(value) {
  if (!value) return [];
  const plain = value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .match(/[A-Za-z0-9]+/g);
  if (!plain) return [];
  const seen = new Set();
  const tokens = [];
  for (let i = 0; i < plain.length; i += 1) {
    const token = plain[i].toLowerCase();
    if (token.length > 1 && !seen.has(token)) {
      seen.add(token);
      tokens.push(token);
    }
  }
  return tokens.slice(0, 6);
  }
  function highlightText(text, tokens) {
  if (!text) return '';
  if (!tokens || !tokens.length) return escapeHtml(text);
  const normalizedTokens = tokens.map(token => normalizePlain(token)).filter(Boolean);
  if (!normalizedTokens.length) return escapeHtml(text);
  return text.split(/(\s+)/).map(segment => {
    if (!segment.trim()) {
      return escapeHtml(segment);
    }
    const normalized = normalizePlain(segment);
    const shouldHighlight = normalizedTokens.some(token => normalized.includes(token));
    return shouldHighlight ? `<mark>${escapeHtml(segment)}</mark>` : escapeHtml(segment);
  }).join('');
  }
  function formatReference(reference, lang) {
  if (!reference) return '';
  const label = getBookLabel(reference.bookKey, lang || state.lang);
  return `${label} ${reference.chapter}${reference.verse ? ':' + reference.verse : ''}`;
  }

  function init() {
  storage = createStorage();
  BOOK_TOKENS = buildBookTokens();
  state.lang = loadStoredLang();
  state.multiLang = loadStoredMulti();
  parseHash();
  cacheRefs();
  bindEvents();
  // Load reminder preference
  if (refs.reminderToggle) {
    const reminderEnabled = getPreference(STORAGE_KEYS.reminder, false);
    refs.reminderToggle.checked = reminderEnabled;
  }
  root.setAttribute('lang', state.lang);
  refs.search.value = state.query;
  refs.search.disabled = true;
  refs.random.disabled = true;
  applyLanguageUI();
  applyMultiToggle();
  updateResultMeta();
  state.lastHash = locationApi ? locationApi.hash || '' : '';
  startBoot();
  initializeAnalytics();
  }

  function cacheRefs() {
  refs.loaderBanner = document.getElementById('loaderBanner');
  refs.loaderBar = document.getElementById('loaderBar');
  refs.loaderText = document.getElementById('loaderText');
  refs.langToggle = document.getElementById('langToggle');
  refs.langButtons = Array.from(refs.langToggle.querySelectorAll('.lang-seg[data-lang]'));
  refs.search = document.getElementById('searchInput');
  refs.searchLabel = document.getElementById('searchLabel');
  refs.searchHint = document.getElementById('searchHint');
  // MultiToggle removed - multilingual is now default
  refs.random = document.getElementById('randomBtn');
  refs.status = document.getElementById('statusMessage');
  refs.resultsList = document.getElementById('resultsList');
  refs.resultsScroller = document.getElementById('resultsScroller');
  refs.resultMeta = document.getElementById('resultMeta');
  refs.virtualBadge = document.getElementById('virtualBadge');
  refs.tagline = document.getElementById('appTagline');
  refs.langStatus = document.getElementById('langStatus');
  refs.suggestions = document.getElementById('suggestionRow');
  refs.reminderToggle = document.getElementById('reminderToggle');
  }

  function bindEvents() {
  refs.langToggle.addEventListener('click', handleLangChange);
  refs.search.addEventListener('input', handleSearchInput);
  refs.search.addEventListener('keydown', handleSearchKeyDown);
  refs.random.addEventListener('click', handleRandomClick);
  // MultiToggle removed - multilingual is now default
  refs.resultsList.addEventListener('click', handleResultsClick);
  refs.resultsScroller.addEventListener('scroll', handleScrollLoad);
  if (refs.suggestions) {
    refs.suggestions.addEventListener('click', handleSuggestionClick);
  }
  if (refs.reminderToggle) {
    refs.reminderToggle.addEventListener('click', handleReminderToggle);
    
    // Modal event listeners
    document.getElementById('cancelReminder').addEventListener('click', closeModal);
    document.querySelector('form[name="verse-reminder"]').addEventListener('submit', handleReminderSubmit);
    
    // Close modal on backdrop click
    document.getElementById('reminderModal').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) closeModal();
    });
    
    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !document.getElementById('reminderModal').classList.contains('hidden')) {
        closeModal();
      }
    });

    // Initialize toggle state from storage
    const storedReminder = getPreference(STORAGE_KEYS.reminder);
    if (storedReminder === '1') {
      const toggle = refs.reminderToggle;
      toggle.setAttribute('aria-checked', 'true');
      toggle.querySelector('span:not(.sr-only)').classList.remove('translate-x-0');
      toggle.querySelector('span:not(.sr-only)').classList.add('translate-x-5');
      toggle.classList.remove('bg-slate-200');
      toggle.classList.add('bg-slate-900');
    }
  }
  if (isBrowser) {
    global.addEventListener('hashchange', handleHashChange);
  }
}

  function startBoot() {
  updateLoaderProgress(state.lang, 'start');
  loadLanguage(state.lang)
    .then(() => {
      state.ready = true;
      refs.search.disabled = false;
      refs.random.disabled = false;
      if (state.pendingReference) {
        state.query = formatReference(state.pendingReference, state.lang);
        refs.search.value = state.query;
  }
      applyLanguageUI();
      runSearch(true);
    })
    .catch(() => {
      setStatusMessage(getCopy().error, 'error');
    });
  LANG_ORDER.filter(code => code !== state.lang).forEach(code => {
    loadLanguage(code).catch(() => {});
  });
  }

  function renderLangStatus() {
    if (!refs.langStatus) return;
    const fragment = document.createDocumentFragment();
    LANG_ORDER.forEach(code => {
      const meta = LANG_MAP[code];
      const ready = state.loadedLangs.has(code);
      if (!ready) return; // Only show loaded languages
      
      const item = document.createElement('li');
      item.className = 'text-xs font-medium';
      item.dataset.active = code === state.lang ? '1' : '0';
      item.innerHTML = meta.label;
      item.title = `${meta.name} - Ready`;
      if (code !== state.lang) {
        item.className += ' text-slate-400';
      } else {
        item.className += ' text-slate-900';
      }
      if (fragment.children.length > 0) {
        const separator = document.createElement('li');
        separator.className = 'text-slate-300';
        separator.textContent = '·';
        fragment.appendChild(separator);
      }
      fragment.appendChild(item);
    });
    refs.langStatus.innerHTML = '';
    refs.langStatus.appendChild(fragment);
  }

  async function loadLanguage(lang) {
  if (bibleCache.has(lang)) {
    state.loadedLangs.add(lang);
    renderLangStatus();
    applyMultiToggle();
    maybeRefreshResults();
    updateLoaderProgress(lang, 'done');
    return Promise.resolve(bibleCache.get(lang));
  }
  if (loadingPromises.has(lang)) {
    return loadingPromises.get(lang);
  }
  const promise = (async () => {
    updateLoaderProgress(lang, 'start');
    const cached = await storage.read(lang);
    if (cached.stale && !cacheReset) {
      cacheReset = true;
      await storage.reset();
    }
    if (cached.books) {
      integrateLanguage(lang, cached.books);
      state.loadedLangs.add(lang);
      applyMultiToggle();
      updateLoaderProgress(lang, 'done');
      maybeRefreshResults();
      maybeHideLoader();
      return bibleCache.get(lang);
    }
    updateLoaderProgress(lang, 'fetch');
    const raw = await fetchLanguagePayload(lang);
    updateLoaderProgress(lang, 'normalize');
    // fetchLanguagePayload returns { books: [...] }, normalizeBooks expects the books array
    const booksArray = raw && raw.books ? raw.books : (Array.isArray(raw) ? raw : []);
    const normalized = normalizeBooks(booksArray);
    updateLoaderProgress(lang, 'persist');
    await storage.write(lang, normalized);
    integrateLanguage(lang, normalized);
    state.loadedLangs.add(lang);
    applyMultiToggle();
    updateLoaderProgress(lang, 'done');
    maybeRefreshResults();
    maybeHideLoader();
    return bibleCache.get(lang);
  })().catch(error => {
    setStatusMessage(getCopy().error, 'error');
    throw error;
  }).finally(() => {
    loadingPromises.delete(lang);
  });
  loadingPromises.set(lang, promise);
  return promise;
  }

  function normalizeBooks(rawBooks) {
  const normalized = BOOKS_EN.map(() => []);
  if (!Array.isArray(rawBooks)) return normalized;
  for (let i = 0; i < BOOKS_EN.length; i += 1) {
    const entry = rawBooks[i] || null;
    const chapters = Array.isArray(entry && entry.chapters) ? entry.chapters : [];
    normalized[i] = chapters.map(chapter => {
      const verses = Array.isArray(chapter) ? chapter : [];
      return verses.map(cleanVerse).filter(Boolean);
    });
  }
  return normalized;
  }

  // Map Spanish book names to English book keys
  const ES_BOOK_TO_EN = {
    'Génesis': 'Genesis',
    'Éxodo': 'Exodus',
    'Levítico': 'Leviticus',
    'Números': 'Numbers',
    'Deuteronomio': 'Deuteronomy',
    'Josué': 'Joshua',
    'Jueces': 'Judges',
    'Rut': 'Ruth',
    '1 Samuel': '1 Samuel',
    '2 Samuel': '2 Samuel',
    '1 Reyes': '1 Kings',
    '2 Reyes': '2 Kings',
    '1 Crónicas': '1 Chronicles',
    '2 Crónicas': '2 Chronicles',
    'Ésdras': 'Ezra',
    'Nehemías': 'Nehemiah',
    'Ester': 'Esther',
    'Job': 'Job',
    'Salmos': 'Psalms',
    'Proverbios': 'Proverbs',
    'Eclesiástes': 'Ecclesiastes',
    'Cantares': 'Song of Solomon',
    'Isaías': 'Isaiah',
    'Jeremías': 'Jeremiah',
    'Lamentaciones': 'Lamentations',
    'Ezequiel': 'Ezekiel',
    'Daniel': 'Daniel',
    'Oséas': 'Hosea',
    'Joel': 'Joel',
    'Amós': 'Amos',
    'Abdías': 'Obadiah',
    'Jonás': 'Jonah',
    'Miquéas': 'Micah',
    'Nahum': 'Nahum',
    'Habacuc': 'Habakkuk',
    'Sofonías': 'Zephaniah',
    'Aggeo': 'Haggai',
    'Zacarías': 'Zechariah',
    'Malaquías': 'Malachi',
    'San Mateo': 'Matthew',
    'San Márcos': 'Mark',
    'San Lúcas': 'Luke',
    'San Juan': 'John',
    'Los Actos': 'Acts',
    'Romanos': 'Romans',
    '1 Corintios': '1 Corinthians',
    '2 Corintios': '2 Corinthians',
    'Gálatas': 'Galatians',
    'Efesios': 'Ephesians',
    'Filipenses': 'Philippians',
    'Colosenses': 'Colossians',
    '1 Tesalonicenses': '1 Thessalonians',
    '2 Tesalonicenses': '2 Thessalonians',
    '1 Timoteo': '1 Timothy',
    '2 Timoteo': '2 Timothy',
    'Tito': 'Titus',
    'Filemón': 'Philemon',
    'Hebreos': 'Hebrews',
    'Santiago': 'James',
    '1 San Pedro': '1 Peter',
    '2 San Pedro': '2 Peter',
    '1 San Juan': '1 John',
    '2 San Juan': '2 John',
    '3 San Juan': '3 John',
    'San Júdas': 'Jude',
    'Revelación': 'Revelation'
  };

  async function loadENFromFolder() {
    const books = [];
    let totalVerses = 0;
    
    // Simple: load all books in parallel
    const bookPromises = BOOKS_EN.map(async (bookName) => {
      const chapters = [];
      let chapterNum = 1;
      
      // Load chapters until we get a 404
      while (true) {
        try {
          const response = await fetch(`bibles/EN/${bookName}/${chapterNum}.json`);
          if (!response.ok) break; // Stop on first 404
          
          const data = await response.json();
          if (data && data.verses && Array.isArray(data.verses)) {
            const verses = data.verses.map(v => {
              // Handle both string and object formats
              if (typeof v === 'string') return v;
              return v.text || '';
            }).filter(Boolean);
            if (verses.length > 0) {
              chapters.push(verses);
              totalVerses += verses.length;
            }
          }
          chapterNum++;
        } catch (e) {
          break; // Stop on error
        }
      }
      
      return { name: bookName, chapters };
    });
    
    const results = await Promise.all(bookPromises);
    console.log(`[EN Loader] Loaded ${results.length} books, ${totalVerses} total verses`);
    return { books: results };
  }

  async function loadESFromFolder() {
    const books = [];
    const esBookFiles = [
      'Génesis.json', 'Éxodo.json', 'Levítico.json', 'Números.json', 'Deuteronomio.json',
      'Josué.json', 'Jueces.json', 'Rut.json', '1 Samuel.json', '2 Samuel.json',
      '1 Reyes.json', '2 Reyes.json', '1 Crónicas.json', '2 Crónicas.json',
      'Ésdras.json', 'Nehemías.json', 'Ester.json', 'Job.json', 'Salmos.json',
      'Proverbios.json', 'Eclesiástes.json', 'Cantares.json', 'Isaías.json',
      'Jeremías.json', 'Lamentaciones.json', 'Ezequiel.json', 'Daniel.json',
      'Oséas.json', 'Joel.json', 'Amós.json', 'Abdías.json', 'Jonás.json',
      'Miquéas.json', 'Nahum.json', 'Habacuc.json', 'Sofonías.json', 'Aggeo.json',
      'Zacarías.json', 'Malaquías.json', 'San Mateo.json', 'San Márcos.json',
      'San Lúcas.json', 'San Juan.json', 'Los Actos.json', 'Romanos.json',
      '1 Corintios.json', '2 Corintios.json', 'Gálatas.json', 'Efesios.json',
      'Filipenses.json', 'Colosenses.json', '1 Tesalonicenses.json', '2 Tesalonicenses.json',
      '1 Timoteo.json', '2 Timoteo.json', 'Tito.json', 'Filemón.json', 'Hebreos.json',
      'Santiago.json', '1 San Pedro.json', '2 San Pedro.json', '1 San Juan.json',
      '2 San Juan.json', '3 San Juan.json', 'San Júdas.json', 'Revelación.json'
    ];
    
    const bookPromises = esBookFiles.map(async (fileName) => {
      try {
        const bookPath = `bibles/ES/${fileName}`;
        const response = await fetch(bookPath);
        
        if (!response.ok) {
          return null;
        }
        
        const bookData = await response.json();
        if (!bookData || !bookData.chapters) {
          return null;
        }
        
        const esBookName = bookData.book || fileName.replace('.json', '');
        const enBookName = ES_BOOK_TO_EN[esBookName];
        
        if (!enBookName) {
          console.warn(`No mapping found for Spanish book: ${esBookName}`);
          return null;
        }
        
        const chapters = bookData.chapters.map(chapter => {
          if (!chapter.verses || !Array.isArray(chapter.verses)) {
            return [];
          }
          return chapter.verses.map(v => (typeof v === 'string' ? v : (v.text || ''))).filter(Boolean);
        });
        
        return { name: enBookName, chapters };
      } catch (error) {
        console.warn(`Failed to load ${fileName}:`, error);
        return null;
      }
    });
    
    const bookResults = await Promise.all(bookPromises);
    const validBooks = bookResults.filter(Boolean);
    
    // Sort books to match BOOKS_EN order
    const sortedBooks = BOOKS_EN.map(enBookName => {
      return validBooks.find(b => b.name === enBookName) || { name: enBookName, chapters: [] };
    });
    
    return { books: sortedBooks };
  }

  async function loadDEFromFile() {
    try {
      const response = await fetch('bibles/de_schlachter.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('German data is not an array');
      }
      
      // German file already uses English book names
      const books = [];
      data.forEach(deBook => {
        const bookName = deBook.name;
        // Verify it's a valid English book name
        if (!BOOK_INDEX.has(bookName)) {
          console.warn(`German book name not found in BOOKS_EN: ${bookName}`);
          return;
        }
        
        const chapters = (deBook.chapters || []).map(chapter => {
          if (Array.isArray(chapter)) {
            return chapter.map(v => (typeof v === 'string' ? v : String(v || ''))).filter(Boolean);
          }
          return [];
        });
        
        books.push({ name: bookName, chapters });
      });
      
      // Sort books to match BOOKS_EN order
      const sortedBooks = BOOKS_EN.map(enBookName => {
        return books.find(b => b.name === enBookName) || { name: enBookName, chapters: [] };
      });
      
      return { books: sortedBooks };
    } catch (error) {
      console.error('Failed to load German Bible:', error);
      throw error;
    }
  }

  async function fetchLanguagePayload(lang) {
  const config = LANG_CONFIG.find(l => l.code === lang);
  if (!config) throw new Error(`No config for language: ${lang}`);

  const errors = [];
  
  // Try all sources in parallel and return the first successful one
  const promises = config.sources.map(async (source) => {
    try {
      // Check if this is a local folder/file path
      if (source.startsWith('bibles/')) {
        if (source === 'bibles/EN/') {
          const data = await loadENFromFolder();
          return { success: true, data };
        } else if (source === 'bibles/ES/') {
          const data = await loadESFromFolder();
          return { success: true, data };
        } else if (source === 'bibles/de_schlachter.json') {
          const data = await loadDEFromFile();
          return { success: true, data };
        }
      }
      
      // Otherwise, try to fetch as URL
      const response = await fetch(source, {
        cache: 'no-store',
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
  }
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.warn(`Failed to load ${lang} from ${source}:`, error.message);
      errors.push(error.message);
      return { success: false };
    }
  });

  // Wait for all promises to settle, then find the first successful one
  const results = await Promise.all(promises);
  const success = results.find(result => result.success);
  
  if (success) {
    return success.data;
  }
  
  // If all sources failed, try to load a minimal embedded fallback
  const fallback = await tryLoadEmbeddedFallback(lang);
  if (fallback) {
    return fallback;
  }
  
  throw new Error(`All sources failed for ${lang}. Errors: ${errors.join(' | ')}`);
  }
      
      // Minimal embedded fallback data for when all network sources fail
  async function tryLoadEmbeddedFallback(lang) {
  console.warn('Loading embedded fallback for', lang);
  // This is a minimal dataset - just enough to show the app works
  const fallbacks = {
    en: {
      name: 'English',
      books: [{
        name: 'John',
        chapters: [
          null, // 0-indexed
          null,
          [
            { verse: 16, text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.' }
          ]
        ]
      }]
    },
    es: {
      name: 'Español',
      books: [{
        name: 'Juan',
        chapters: [
          null,
          null,
          [
            { verse: 16, text: 'Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.' }
          ]
        ]
      }]
    },
    de: {
      name: 'Deutsch',
      books: [{
        name: 'Johannes',
        chapters: [
          null,
          null,
          [
            { verse: 16, text: 'Denn also hat Gott die Welt geliebt, dass er seinen eingeborenen Sohn gab, damit alle, die an ihn glauben, nicht verloren werden, sondern das ewige Leben haben.' }
          ]
        ]
      }]
    }
  };
  
  return fallbacks[lang] || null;
  }

  function cleanVerse(text) {
  return typeof text === 'string' ? text.replace(/\s+/g, ' ').trim() : '';
  }

  function integrateLanguage(lang, books) {
  const verses = [];
  const verseMap = new Map();
  books.forEach((chapters, bookIndex) => {
    const bookKey = BOOKS_EN[bookIndex];
    (chapters || []).forEach((list, chapterIndex) => {
      (list || []).forEach((text, verseIndex) => {
        if (!text) return;
        const key = `${bookKey}|${chapterIndex + 1}|${verseIndex + 1}`;
        const normalized = normalizePlain(text);
        const entry = {
          id: `${key}-${lang}`,
          key,
          lang,
          bookKey,
          chapter: chapterIndex + 1,
          verse: verseIndex + 1,
          text,
          normalized
        };
        verses.push(entry);
        verseMap.set(key, entry);
        const bundle = globalBundles.get(key) || { bookKey, chapter: chapterIndex + 1, verse: verseIndex + 1, texts: {} };
        bundle.texts[lang] = text;
        globalBundles.set(key, bundle);
      });
    });
  });
  console.log(`[Integrate] ${lang}: ${verses.length} verses integrated into flat array`);
  bibleCache.set(lang, { books, flat: verses, verseMap });
  }

  function handleLangChange(event) {
    const button = event.target.closest('button[data-lang]');
    if (!button) return;
    
    const next = button.dataset.lang;
    if (!next || next === state.lang) return;
    
    // Update pressed state on buttons
    refs.langButtons.forEach(btn => {
      btn.setAttribute('aria-pressed', btn === button);
      if (btn === button) {
        btn.classList.remove('bg-slate-200');
        btn.classList.add('bg-white', 'shadow-sm');
      } else {
        btn.classList.remove('bg-white', 'shadow-sm');
        btn.classList.add('bg-transparent');
      }
    });
    
    // Update state and preferences
    state.lang = next;
    savePreference(STORAGE_KEYS.lang, next);
    root.setAttribute('lang', state.lang);
    
    // Update UI
    applyLanguageUI();
    refs.search.disabled = true;
  refs.random.disabled = true;
  loadLanguage(state.lang)
    .then(() => {
      state.ready = true;
      refs.search.disabled = false;
      refs.random.disabled = false;
      runSearch(true);
    })
    .catch(() => {
      setStatusMessage(getCopy().error, 'error');
    });
  syncHash(state.lastReference);
  trackEvent('toggle_language', { lang: state.lang });
  }

  function handleSearchInput() {
  clearTimeout(searchTimer);
  state.query = refs.search.value;
  state.expanded.clear();
  searchTimer = setTimeout(() => runSearch(true), SEARCH_DELAY);
  }

  function handleSearchKeyDown(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    clearTimeout(searchTimer);
    state.query = refs.search.value;
    runSearch(true);
  }
  }

  function handleRandomClick() {
  console.log('[Random] Button clicked, checking data...');
  
  // Check if data exists
  const data = bibleCache.get(state.lang);
  console.log('[Random] Data check:', {
    hasData: !!data,
    hasFlat: !!(data && data.flat),
    flatLength: data && data.flat ? data.flat.length : 0,
    ready: state.ready,
    lang: state.lang
  });
  
  if (!data || !data.flat || !data.flat.length) {
    console.warn('[Random] No data available, attempting to load...');
    setStatusMessage('Loading verses...', 'info');
    // Try to load if not loaded
    loadLanguage(state.lang).then(() => {
      console.log('[Random] Data loaded, retrying...');
      handleRandomClick(); // Retry after loading
    }).catch((err) => {
      console.error('[Random] Failed to load:', err);
      setStatusMessage('Failed to load verses. Please refresh the page.', 'error');
    });
    return;
  }
  
  // Pick a random verse
  const randomIndex = Math.floor(Math.random() * data.flat.length);
  const verse = data.flat[randomIndex];
  console.log('[Random] Selected verse:', {
    index: randomIndex,
    total: data.flat.length,
    verse: verse ? `${verse.bookKey} ${verse.chapter}:${verse.verse}` : 'null',
    hasText: !!(verse && verse.text)
  });
  
  if (!verse || !verse.text) {
    console.error('[Random] Invalid verse:', verse);
    setStatusMessage('Error: Invalid verse data', 'error');
    return;
  }
  
  // Create result and display
  const result = composeVerseResult(verse);
  console.log('[Random] Composed result:', result);
  
  state.results = [result];
  state.visibleCount = 1;
  state.highlightTokens = [];
  state.isReference = true;
  state.lastReference = { bookKey: verse.bookKey, chapter: verse.chapter, verse: verse.verse };
  state.query = formatReference(state.lastReference, state.lang);
  refs.search.value = state.query;
  
  renderResults(true);
  setStatusMessage(`${getCopy().randomStatus} · ${LANG_MAP[state.lang].label}`, 'info');
  syncHash(state.lastReference);
  trackEvent('random_select', {
    lang: state.lang,
    reference: formatReference(state.lastReference, state.lang)
  });
  console.log('[Random] Successfully displayed verse');
  }

  // handleMultiToggleChange removed - multilingual is now default

  function handleReminderToggle(event) {
    const button = event.currentTarget;
    const isEnabled = button.getAttribute('aria-checked') === 'true';
    
    if (!isEnabled) {
      // Opening modal
      const modal = document.getElementById('reminderModal');
      const emailInput = document.getElementById('reminderEmail');
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      emailInput.focus();
    } else {
      // Turning off reminder
      button.setAttribute('aria-checked', 'false');
      button.querySelector('span:not(.sr-only)').classList.remove('translate-x-5');
      button.querySelector('span:not(.sr-only)').classList.add('translate-x-0');
      button.classList.remove('bg-slate-900');
      button.classList.add('bg-slate-200');
      savePreference(STORAGE_KEYS.reminder, '0');
      console.log('Weekly reminder disabled');
    }
  }

  function closeModal() {
    const modal = document.getElementById('reminderModal');
    const formEl = modal.querySelector('form');
    const successEl = document.getElementById('formSuccess');
    
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    
    // Reset form state
    formEl.classList.remove('hidden');
    successEl.classList.add('hidden');
    formEl.reset();
  }

  function handleReminderSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const email = form.email.value;
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const emailInput = form.querySelector('input[type="email"]');
      emailInput.setCustomValidity('Please enter a valid email address');
      emailInput.reportValidity();
      return;
    }

    // Submit to Netlify
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(new FormData(form)).toString()
    })
    .then(() => {
      // Show success state
      form.classList.add('hidden');
      document.getElementById('formSuccess').classList.remove('hidden');
      
      // Update toggle state
      const toggle = document.getElementById('reminderToggle');
      toggle.setAttribute('aria-checked', 'true');
      toggle.querySelector('span:not(.sr-only)').classList.remove('translate-x-0');
      toggle.querySelector('span:not(.sr-only)').classList.add('translate-x-5');
      toggle.classList.remove('bg-slate-200');
      toggle.classList.add('bg-slate-900');
      
      // Store preference
      savePreference(STORAGE_KEYS.reminder, '1');
      console.log('Weekly reminder enabled');
      
      // Auto-close after delay
      setTimeout(closeModal, 2000);
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
    });
  }

  function handleResultsClick(event) {
  const shareButton = event.target.closest('[data-action="share"]');
  if (shareButton) {
    handleShareClick(shareButton);
    return;
  }
  const button = event.target.closest('[data-action="toggle-translation"]');
  if (!button) return;
  const panelId = button.getAttribute('data-target');
  const panel = document.getElementById(panelId);
  if (!panel) return;
  if (!panel.dataset.loaded) {
    populateTranslationPanel(panel);
  }
  const isOpen = panel.classList.toggle('open');
  panel.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
  if (isOpen) {
    state.expanded.add(panelId);
  } else {
    state.expanded.delete(panelId);
  }
  button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  const labelSpan = button.querySelector('span[data-label]');
  if (labelSpan) {
    labelSpan.textContent = isOpen ? getCopy().collapse : getCopy().expand;
  }
  trackEvent('expand_translations', {
    lang: state.lang,
    key: button.dataset.key || '',
    type: button.dataset.type || '',
    open: isOpen ? '1' : '0'
  });
  }

  async function handleShareClick(button) {
  const payload = button.dataset.shareText || '';
  if (!payload) return;
  try {
    if (isBrowser && global.navigator && global.navigator.clipboard && global.navigator.clipboard.writeText) {
      await global.navigator.clipboard.writeText(payload);
    } else if (isBrowser && document.querySelector) {
      const tempArea = document.createElement('textarea');
      tempArea.value = payload;
      tempArea.setAttribute('readonly', '');
      tempArea.style.position = 'absolute';
      tempArea.style.left = '-9999px';
      document.body.appendChild(tempArea);
      tempArea.select();
      document.execCommand('copy');
      tempArea.remove();
    } else {
      throw new Error('Clipboard unavailable');
    }
    setStatusMessage('Copied verse to clipboard.', 'info');
    trackEvent('share', {
      lang: button.dataset.shareLang || state.lang,
      reference: button.dataset.reference || '',
      type: button.dataset.shareType || ''
    });
  } catch (error) {
    setStatusMessage('Unable to copy verse.', 'error');
  }
  }

  function handleScrollLoad() {
  if (state.visibleCount >= state.results.length) return;
  const container = refs.resultsScroller;
  if (container.scrollTop + container.clientHeight >= container.scrollHeight - 120) {
    state.visibleCount = Math.min(state.visibleCount + LOAD_BATCH, state.results.length);
    const snapshot = container.scrollTop;
    renderResults(false);
    container.scrollTop = snapshot;
  }
  }

  function handleHashChange() {
  if (hashSync) return;
  parseHash();
  refs.search.value = state.query;
  applyLanguageUI();
  loadLanguage(state.lang).then(() => {
    state.ready = true;
    runSearch(true);
  });
  }

  function parseHash() {
  const rawHash = locationApi ? locationApi.hash || '' : '';
  const hash = rawHash.replace(/^#/, '');
  if (!hash) return;
  const params = new URLSearchParams(hash);
  const langParam = params.get('lang');
  if (langParam && LANG_MAP[langParam]) {
    state.lang = langParam;
  }
  state.multiLang = params.get('all') === '1';
  const bookParam = params.get('b');
  const chapterParam = parseInt(params.get('c') || '', 10);
  const verseParam = parseInt(params.get('v') || '', 10);
  const queryParam = params.get('q');
  if (bookParam && !Number.isNaN(chapterParam)) {
    const resolved = resolveBook(bookParam);
    if (resolved) {
      state.pendingReference = {
        bookKey: resolved,
        chapter: chapterParam,
        verse: Number.isNaN(verseParam) ? null : verseParam
      };
      state.query = `${bookParam} ${chapterParam}${Number.isNaN(verseParam) ? '' : ':' + verseParam}`;
    }
  } else if (queryParam) {
    state.query = queryParam;
  }
  }

  function syncHash(reference) {
  const params = new URLSearchParams();
  params.set('lang', state.lang);
  if (state.multiLang) {
    params.set('all', '1');
  }
  if (reference && reference.bookKey) {
    params.set('b', getBookLabel(reference.bookKey, state.lang));
    params.set('c', String(reference.chapter));
    if (reference.verse) {
      params.set('v', String(reference.verse));
    }
  } else if (state.query.trim()) {
    params.set('q', state.query.trim());
  }
  const nextHash = `#${params.toString()}`;
  if (nextHash === state.lastHash) return;
  state.lastHash = nextHash;
  if (!isBrowser || !historyApi || !historyApi.replaceState) {
    return;
  }
  hashSync = true;
  historyApi.replaceState(null, '', nextHash);
  global.setTimeout(() => {
    hashSync = false;
  }, 0);
  }

  function applyLanguageUI() {
  const copy = getCopy();
  if (refs.searchLabel) refs.searchLabel.textContent = copy.searchLabel;
  if (refs.search) refs.search.placeholder = copy.placeholder;
  if (refs.searchHint) refs.searchHint.textContent = copy.hint;
  if (refs.random) {
    refs.random.textContent = copy.random;
    refs.random.setAttribute('aria-label', copy.random);
  }
  if (refs.tagline) refs.tagline.textContent = copy.tagline;
  if (refs.virtualBadge) refs.virtualBadge.textContent = copy.virtualized;
  if (refs.langButtons) {
    refs.langButtons.forEach(button => {
      button.setAttribute('aria-pressed', button.dataset.lang === state.lang ? 'true' : 'false');
    });
  }
  if (isBrowser) {
    document.title = `Baible - ${copy.name}`;
  }
  renderSuggestions();
  renderLangStatus();
  }

  function applyMultiToggle() {
  // Multilingual is always enabled by default
  state.multiLang = state.loadedLangs.size > 1;
  }

  function renderSuggestions() {
  if (!refs.suggestions) return;
  const copy = getCopy();
  // Sort suggestions alphabetically
  const suggestions = (copy.suggestions || []).slice().sort();
  refs.suggestions.innerHTML = '';
  if (!suggestions.length) {
    refs.suggestions.classList.add('hidden');
    return;
  }
  refs.suggestions.classList.remove('hidden');
  suggestions.forEach(text => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'suggestion-btn';
    button.dataset.suggest = text;
    button.textContent = text;
    refs.suggestions.appendChild(button);
  });
  }

  function handleSuggestionClick(event) {
  const button = event.target.closest('[data-suggest]');
  if (!button) return;
  let value = button.dataset.suggest || '';
  
  // Special handling for "Psalms" - show a random psalm
  const valueLower = value.toLowerCase();
  if (valueLower === 'psalms' || valueLower === 'salmos' || valueLower === 'psalmen') {
    const data = bibleCache.get(state.lang);
    if (data && data.flat) {
      // Filter verses from Psalms (bookKey is "Psalms")
      const psalmsVerses = data.flat.filter(v => v.bookKey === 'Psalms');
      if (psalmsVerses.length > 0) {
        const randomPsalm = psalmsVerses[Math.floor(Math.random() * psalmsVerses.length)];
        value = `${randomPsalm.bookKey} ${randomPsalm.chapter}:${randomPsalm.verse}`;
      } else {
        value = 'Psalms';
      }
    } else {
      value = 'Psalms';
    }
  }
  
  refs.search.value = value;
  state.query = value;
  runSearch(true);
}

  function parseReference(input) {
  // Match book, chapter, and optional verse (e.g., 'John 3:16' or 'Genesis 1')
  const refPattern = /^\s*(\d*\s*[a-zA-ZÀ-ÿ]+(?:\s+[a-zA-ZÀ-ÿ]+)*)\s*(\d+)(?::(\d+))?\s*$/;
  const match = input.match(refPattern);
  if (!match) return null;
  
  const [, bookPart, chapterStr, verseStr] = match;
  const bookKey = resolveBook(bookPart.trim());
  if (!bookKey) return null;
  
  const chapter = parseInt(chapterStr, 10);
  const verse = verseStr ? parseInt(verseStr, 10) : null;
  
  return { bookKey, chapter, verse };
}

// Test function for search functionality
  function testSearch() {
  const tests = [
    { input: 'John 3:16', type: 'verse', desc: 'Standard verse reference' },
    { input: 'psalm 23', type: 'chapter', desc: 'Chapter reference' },
    { input: '1 corinthians 13', type: 'chapter', desc: 'Multi-word book name' },
    { input: 'gen 1:1', type: 'verse', desc: 'Abbreviated book name' },
    { input: 'love', type: 'keyword', desc: 'Keyword search' },
    { input: 'juan 3:16', type: 'verse', desc: 'Spanish reference' },
    { input: 'johannes 3:16', type: 'verse', desc: 'German reference' },
    { input: 'invalid reference', type: 'none', desc: 'Invalid reference' }
  ];

  console.log('=== Starting Search Tests ===');
  tests.forEach(test => {
    const ref = parseReference(test.input);
    const result = ref ? 
      (ref.verse !== null ? 'verse' : 'chapter') : 
      (test.input.trim().split(' ').length > 2 || test.input.includes(':')) ? 'invalid' : 'keyword';
    
    const status = result === test.type || (test.type === 'none' && result === 'invalid') ? '✅' : '❌';
    console.log(`${status} ${test.desc}: "${test.input}" => ${result} ${ref ? JSON.stringify(ref) : ''}`);
  });
  console.log('=== End of Tests ===');
}

  function runSearch(resetScroll) {
  if (!state.ready) {
    updateResultMeta();
    return;
  }
  const copy = getCopy();
  const query = state.query.trim();
  state.highlightTokens = buildHighlightTokens(query);
  state.expanded.clear();
  let reference = parseReference(query);
  if (!reference && state.pendingReference) {
    reference = state.pendingReference;
  }
  state.pendingReference = null;
  
  if (!query) {
    state.results = [];
    state.visibleCount = 0;
    refs.resultsList.innerHTML = '';
    refs.resultsList.appendChild(createNotice(copy.idle));
    refs.virtualBadge.classList.add('hidden');
    updateResultMeta();
    syncHash(null);
    if (resetScroll) refs.resultsScroller.scrollTop = 0;
    return;
  }
  
  if (reference) {
    const resolved = buildReferenceResult(reference);
    if (resolved) {
      state.results = [resolved];
      state.visibleCount = 1;
      state.isReference = true;
      state.lastReference = reference;
      renderResults(resetScroll);
      syncHash(reference);
      trackEvent('search', {
  action: 'reference',
  lang: state.lang,
  query,
  results: 1
      });
      return;
    }
  }
  
  const dataset = collectDataset();
  if (!dataset || !dataset.length) {
    if (state.query.trim()) {
      refs.resultsList.innerHTML = '';
      refs.resultsList.appendChild(createNotice(copy.loading));
    }
    refs.virtualBadge.classList.add('hidden');
    state.results = [];
    updateResultMeta();
    return;
  }
  
  const normQuery = normalizePlain(query);
  const tokens = extractPlainTokens(query);
  const matches = [];
  
  dataset.forEach(verse => {
    const normalized = verse.normalized;
    const exact = normQuery && normalized.includes(normQuery) ? 1 : 0;
    let hits = 0;
    
    for (let i = 0; i < tokens.length; i += 1) {
      if (tokens[i] && normalized.includes(tokens[i])) {
  hits += 1;
  }
    }
    
    if (!exact && hits === 0) return;
    matches.push({ verse, exact, hits });
  });
  
  matches.sort((a, b) => {
    if (b.exact !== a.exact) return b.exact - a.exact;
    if (b.hits !== a.hits) return b.hits - a.hits;
    const prefDiff = (b.verse.lang === state.lang ? 1 : 0) - (a.verse.lang === state.lang ? 1 : 0);
    if (prefDiff !== 0) return prefDiff;
    const orderDiff = (BOOK_INDEX.get(a.verse.bookKey) || 0) - (BOOK_INDEX.get(b.verse.bookKey) || 0);
    if (orderDiff !== 0) return orderDiff;
    if (a.verse.chapter !== b.verse.chapter) return a.verse.chapter - b.verse.chapter;
    return a.verse.verse - b.verse.verse;
  });
  
  const limited = matches.slice(0, MAX_RESULTS).map(item => composeVerseResult(item.verse));
  state.results = limited;
  state.visibleCount = Math.min(INITIAL_BATCH, state.results.length);
  state.isReference = false;
  state.lastReference = null;
  renderResults(resetScroll);
  syncHash(null);
  trackEvent('search', {
    action: 'keyword',
    lang: state.lang,
    query,
    results: state.results.length,
    multi: state.multiLang ? '1' : '0'
  });
}

  function buildReferenceResult(reference) {
  if (!reference || !reference.bookKey || !reference.chapter) {
    return null;
  }
  if (!reference.verse) {
    const verses = getChapterVerses(state.lang, reference.bookKey, reference.chapter);
    if (!verses.length) return null;
    const panelId = `panel-${reference.bookKey.replace(/\s+/g, '-')}-c${reference.chapter}`;
    return {
      type: 'chapter',
      key: `${reference.bookKey}|${reference.chapter}`,
      domKey: panelId,
      bookKey: reference.bookKey,
      chapter: reference.chapter,
      title: `${getBookLabel(reference.bookKey, state.lang)} ${reference.chapter}`,
      verses,
      panelId,
      showExpand: getChapterTranslationCount(reference.bookKey, reference.chapter) > 1,
      reference
    };
  }
  const verse = findVerse(reference.bookKey, reference.chapter, reference.verse, state.lang);
  return verse ? composeVerseResult(verse) : null;
}

  function composeVerseResult(verse) {
  const panelId = `panel-${verse.key.replace(/\|/g, '-')}-${verse.lang}`;
  return {
    type: 'verse',
    key: verse.key,
    domKey: `${verse.key}-${verse.lang}`,
    bookKey: verse.bookKey,
    chapter: verse.chapter,
    verse: verse.verse,
    lang: verse.lang,
    title: `${getBookLabel(verse.bookKey, verse.lang)} ${verse.chapter}:${verse.verse}`,
    text: verse.text,
    highlightHtml: highlightText(verse.text, state.highlightTokens),
    panelId,
    showExpand: getVerseTranslationCount(verse.key) > 1,
    reference: { bookKey: verse.bookKey, chapter: verse.chapter, verse: verse.verse }
  };
}

  function renderResults(resetScroll) {
  const copy = getCopy();
  refs.resultsList.innerHTML = '';
  if (!state.results.length) {
    const message = state.query.trim() ? copy.noResults : copy.idle;
    refs.resultsList.appendChild(createNotice(message));
    refs.virtualBadge.classList.add('hidden');
    updateResultMeta();
    if (resetScroll) refs.resultsScroller.scrollTop = 0;
    return;
  }
  state.results.slice(0, state.visibleCount).forEach(result => {
    refs.resultsList.appendChild(buildResultCard(result));
  });
  refs.virtualBadge.classList.toggle('hidden', state.results.length <= state.visibleCount);
  updateResultMeta();
  if (resetScroll) refs.resultsScroller.scrollTop = 0;
}

  function buildResultCard(result) {
  const card = document.createElement('article');
  card.className = 'card';
  card.dataset.key = result.domKey;
  const header = document.createElement('div');
  header.className = 'flex flex-wrap items-center justify-between gap-3';
  const title = document.createElement('p');
  title.className = 'text-sm font-semibold text-slate-700';
  title.textContent = result.title;
  header.appendChild(title);
  const badges = document.createElement('div');
  badges.className = 'flex items-center gap-2 text-xs';
  if (result.type === 'chapter') {
    const chip = document.createElement('span');
    chip.className = 'pill';
    chip.textContent = 'Chapter';
    badges.appendChild(chip);
  } else {
    const langMeta = LANG_MAP[result.lang];
    if (langMeta) {
      const chip = document.createElement('span');
      chip.className = 'pill flex items-center gap-1';
      chip.textContent = `${langMeta.flag} ${langMeta.label}`;
      badges.appendChild(chip);
    }
  }
  header.appendChild(badges);
  card.appendChild(header);
  if (result.type === 'chapter') {
    const wrapper = document.createElement('div');
    wrapper.className = 'mt-3 max-h-72 overflow-y-auto rounded-2xl bg-slate-50/80 p-3 text-sm leading-relaxed text-slate-700';
    result.verses.forEach(item => {
      const line = document.createElement('p');
      line.className = 'mb-2 last:mb-0';
      line.innerHTML = `<span class="font-semibold text-slate-500">${item.verse}</span> ${escapeHtml(item.text)}`;
      wrapper.appendChild(line);
    });
    card.appendChild(wrapper);
  } else {
    const paragraph = document.createElement('p');
    paragraph.className = 'mt-3 text-base leading-relaxed text-slate-800';
    paragraph.innerHTML = result.highlightHtml;
    card.appendChild(paragraph);
  }
  const actions = document.createElement('div');
  actions.className = 'mt-4 flex flex-wrap items-center gap-3';
  actions.appendChild(buildShareButton(result));
  let panel = null;
  if (result.showExpand) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-slate-900';
    button.dataset.action = 'toggle-translation';
    button.dataset.target = result.panelId;
    button.dataset.key = result.key;
    button.dataset.type = result.type;
    button.setAttribute('aria-expanded', state.expanded.has(result.panelId) ? 'true' : 'false');
    button.setAttribute('aria-controls', result.panelId);
    button.innerHTML = '<span aria-hidden="true">⤢</span><span data-label>' + (state.expanded.has(result.panelId) ? getCopy().collapse : getCopy().expand) + '</span>';
    actions.appendChild(button);
    panel = document.createElement('div');
    panel.id = result.panelId;
    panel.className = 'translation-panel';
    panel.dataset.size = result.type === 'chapter' ? 'tall' : 'short';
    panel.dataset.bundle = result.key;
    panel.dataset.type = result.type;
    panel.dataset.book = result.bookKey;
    panel.dataset.chapter = String(result.chapter);
    panel.setAttribute('aria-hidden', 'true');
    if (state.expanded.has(result.panelId)) {
      panel.classList.add('open');
      panel.setAttribute('aria-hidden', 'false');
      populateTranslationPanel(panel);
    }
  }
  card.appendChild(actions);
  if (panel) {
    card.appendChild(panel);
  }
  return card;
}

  function buildShareButton(result) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'share-btn inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-slate-900';
  button.dataset.action = 'share';
  button.dataset.shareLang = result.lang || state.lang;
  button.dataset.shareType = result.type;
  button.dataset.reference = result.title;
  button.dataset.shareText = buildShareText(result);
  button.innerHTML = '<span aria-hidden="true">↗</span><span>Share</span>';
  return button;
}

  function buildShareText(result) {
  if (result.type === 'chapter') {
    const preview = result.verses.slice(0, 6).map(item => `${item.verse}. ${item.text}`).join('\n');
    const suffix = result.verses.length > 6 ? '\n…' : '';
    return `${result.title}\n${preview}${suffix}\n— Baible`;
  }
  return `${result.title}\n${result.text}\n— Baible`;
}

  function populateTranslationPanel(panel) {
  const type = panel.dataset.type;
  let content = '';
  if (type === 'chapter') {
    const bookKey = panel.dataset.book;
    const chapter = parseInt(panel.dataset.chapter || '0', 10);
    const translations = gatherChapterTranslations(bookKey, chapter);
    content = translations.map(entry => {
      const verses = entry.verses
  .map(v => `<p class="text-sm text-slate-700"><span class="font-semibold text-slate-500">${v.verse}</span> ${escapeHtml(v.text)}</p>`)
  .join('');
      return `<div class="mb-3 rounded-2xl bg-white/85 p-3 text-sm">
  <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">${entry.flag} ${entry.label}</p>
  <div class="space-y-2">${verses}</div>
      </div>`;
    }).join('');
  } else {
    const translations = gatherVerseTranslations(panel.dataset.bundle);
    content = translations.map(entry => `<div class="mb-3 rounded-2xl bg-white/85 p-3 text-sm leading-relaxed text-slate-700">
      <p class="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">${entry.flag} ${entry.label}</p>
      <p>${escapeHtml(entry.text)}</p>
    </div>`).join('');
  }
  panel.innerHTML = content || `<p class="text-sm text-slate-500">${getCopy().loading}</p>`;
  panel.dataset.loaded = '1';
}

  function updateResultMeta() {
  const copy = getCopy();
  if (!state.ready) {
    refs.resultMeta.textContent = copy.loading;
    return;
  }
  if (!state.results.length) {
    refs.resultMeta.textContent = state.query.trim() ? copy.noResults : copy.idle;
    return;
  }
  if (state.visibleCount < state.results.length) {
    refs.resultMeta.textContent = `${state.visibleCount} / ${state.results.length} ${copy.resultsWord}`;
  } else {
    refs.resultMeta.textContent = `${state.results.length} ${copy.resultsWord}`;
  }
  }

  function collectDataset() {
  if (state.multiLang) {
    const combined = [];
    LANG_ORDER.forEach(code => {
      const data = bibleCache.get(code);
      if (data && data.flat && Array.isArray(data.flat) && data.flat.length > 0) {
        combined.push(...data.flat);
  }
    });
    return combined;
  }
    const data = bibleCache.get(state.lang);
    if (!data || !data.flat || !Array.isArray(data.flat)) {
      return [];
    }
    return data.flat.length > 0 ? data.flat : [];
  }

  function getCopy() {
    return LANG_MAP[state.lang] || LANG_CONFIG[0];
  }

  function getBookLabel(bookKey, lang) {
    const idx = BOOK_INDEX.get(bookKey);
    if (idx == null) return bookKey;
    const labels = BOOK_LABELS[lang] || BOOKS_EN;
    return labels[idx] || bookKey;
  }

  function getVerseTranslationCount(key) {
    const bundle = globalBundles.get(key);
    if (!bundle || !bundle.texts) return 0;
    return Object.keys(bundle.texts).length;
  }

  function gatherVerseTranslations(key) {
    const bundle = globalBundles.get(key);
    if (!bundle) return [];
    const items = [];
    LANG_ORDER.forEach(lang => {
      const text = bundle.texts[lang];
      if (!text) return;
      const meta = LANG_MAP[lang];
      items.push({ flag: meta.flag, label: meta.label, text });
    });
    return items;
  }

  function getChapterTranslationCount(bookKey, chapter) {
    let total = 0;
    LANG_ORDER.forEach(lang => {
      if (getChapterVerses(lang, bookKey, chapter).length) {
        total += 1;
  }
    });
    return total;
  }

  function getChapterVerses(lang, bookKey, chapter) {
  const data = bibleCache.get(lang);
  if (!data || !data.books) return [];
  const bookIndex = BOOK_INDEX.get(bookKey);
  if (bookIndex == null) return [];
  const bookChapters = data.books[bookIndex] || [];
  const chapterVerses = bookChapters[chapter - 1] || [];
  return chapterVerses.map((text, verseIndex) => ({
    verse: verseIndex + 1,
    text: text
  }));
  }

  function findVerse(bookKey, chapter, verse, lang) {
  const data = bibleCache.get(lang);
  if (!data) return null;
  const key = `${bookKey}|${chapter}|${verse}`;
  return data.verseMap.get(key) || null;
  }

  function maybeRefreshResults() {
  if (!state.results.length) return;
  const snapshot = refs.resultsScroller.scrollTop;
  renderResults(false);
  refs.resultsScroller.scrollTop = snapshot;
  }

  function updateLoaderProgress(lang, stage) {
  loaderState[lang] = Math.max(loaderState[lang] || 0, LOAD_STEPS[stage] || LOAD_STEPS.start);
  const total = LANG_ORDER.reduce((sum, code) => sum + (loaderState[code] || 0), 0);
  const percent = Math.min(100, Math.round((total / LANG_ORDER.length) * 100));
  if (refs.loaderBar) {
    refs.loaderBar.style.width = `${percent}%`;
  }
  if (refs.loaderText) {
    const meta = LANG_MAP[lang];
    refs.loaderText.textContent = `Loading ${meta.label} ${Math.round((loaderState[lang] || 0) * 100)}%`;
  }
  renderLangStatus();
  }

  function maybeHideLoader() {
  if (state.loadedLangs.size === LANG_ORDER.length && refs.loaderBanner) {
    refs.loaderBanner.classList.add('hidden');
  }
  }

  function setStatusMessage(text, tone) {
  if (!refs.status) return;
  if (statusTimer) {
    clearTimeout(statusTimer);
    statusTimer = null;
  }
  if (!text) {
    refs.status.classList.add('hidden');
    refs.status.textContent = '';
    return;
  }
  refs.status.classList.remove('hidden');
  refs.status.textContent = text;
  const isError = tone === 'error';
  refs.status.classList.toggle('bg-rose-50', isError);
  refs.status.classList.toggle('text-rose-800', isError);
  refs.status.classList.toggle('border-rose-200', isError);
  refs.status.classList.toggle('bg-amber-50', !isError);
  refs.status.classList.toggle('text-amber-900', !isError);
  refs.status.classList.toggle('border-amber-200', !isError);
  if (!isError) {
    statusTimer = global.setTimeout(() => {
      setStatusMessage('', '');
    }, 5000);
  }
  }

  function escapeHtml(value) {
  return (value || '').replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[char]);
  }









  function trackEvent(name, detail) {
    const payload = Object.assign({ event_category: 'interaction' }, detail || {});
    if (payload.reference && !payload.event_label) {
      payload.event_label = payload.reference;
    }
    if (payload.query && !payload.search_term) {
      payload.search_term = payload.query;
    }
    if (payload.lang && !payload.event_label) {
      payload.event_label = payload.lang;
    }
    if (hasGtag()) {
      global.gtag('event', name, payload);
    } else {
      analyticsQueue.push({ name, payload });
    }
  }

  function flushAnalytics() {
    if (!analyticsQueue.length || !hasGtag()) return;
    while (analyticsQueue.length) {
      const entry = analyticsQueue.shift();
      global.gtag('event', entry.name, entry.payload);
    }
  }

  function initializeAnalytics() {
    if (analyticsInterval) return;
    analyticsInterval = global.setInterval(flushAnalytics, 1000);
    if (isBrowser) {
      global.addEventListener('load', flushAnalytics);
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          flushAnalytics();
        }
      });
    }
    trackEvent('page_view', {
      page_location: locationApi ? locationApi.href : '',
      page_title: 'Baible'
    });
  }

  function hasGtag() {
    return isBrowser && typeof global.gtag === 'function';
  }

  // Initialize analytics
  initializeAnalytics();
})(typeof window !== 'undefined' ? window : globalThis);
