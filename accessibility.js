// ============================================================
// Accessibility Toolkit — shared across every page in the toolkit
// Self-contained: injects its own styles and UI, no dependencies.
// Provides: text size control, high-contrast mode, reading-ease
// mode (wider spacing), and read-aloud via the browser's built-in
// speech engine (works fully offline on most systems).
// ============================================================

(function(){
  const STORAGE_KEY = 'cfa-a11y-prefs';

  function loadPrefs(){
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : { fontScale: 100, highContrast: false, readingEase: false };
    } catch(e){
      return { fontScale: 100, highContrast: false, readingEase: false };
    }
  }
  function savePrefs(p){
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch(e){}
  }

  let prefs = loadPrefs();

  /* ---------- inject styles ---------- */
  const style = document.createElement('style');
  style.textContent = `
    .a11y-fab{
      position: fixed; bottom: 20px; right: 20px; z-index: 9999;
      width: 52px; height: 52px; border-radius: 50%;
      background: #2B2560; color: #fff; border: none; cursor: pointer;
      font-family: 'IBM Plex Mono', monospace; font-size: 18px; font-weight: 700;
      box-shadow: 0 4px 16px rgba(0,0,0,.25);
      display: flex; align-items: center; justify-content: center;
    }
    .a11y-fab:hover{ background: #201C49; }
    .a11y-panel{
      position: fixed; bottom: 82px; right: 20px; z-index: 9999;
      background: #fff; border: 1px solid #E3DCC9; border-radius: 14px;
      box-shadow: 0 12px 32px rgba(0,0,0,.2);
      padding: 18px; width: 260px;
      font-family: 'Sora', -apple-system, sans-serif; font-size: .85rem; color: #1C1B29;
      display: none;
    }
    .a11y-panel.open{ display: block; }
    .a11y-panel h4{
      font-family: 'IBM Plex Mono', monospace; font-size: .7rem; text-transform: uppercase; letter-spacing: .06em;
      color: #4A4763; margin: 0 0 12px; font-weight: 700;
    }
    .a11y-row{ display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
    .a11y-row:last-child{ margin-bottom: 0; }
    .a11y-row label{ flex: 1; }
    .a11y-fontctl{ display: flex; align-items: center; gap: 6px; }
    .a11y-fontctl button{
      width: 28px; height: 28px; border-radius: 6px; border: 1.5px solid #E3DCC9; background: #F3EEE3;
      cursor: pointer; font-family: 'IBM Plex Mono', monospace; font-weight: 700; color: #2B2560;
    }
    .a11y-fontctl button:hover{ background: #E3DCC9; }
    .a11y-fontctl span{ font-family: 'IBM Plex Mono', monospace; font-size: .72rem; width: 34px; text-align: center; color: #4A4763; }
    .a11y-toggle{
      position: relative; width: 38px; height: 22px; border-radius: 12px; background: #E3DCC9;
      border: none; cursor: pointer; flex: 0 0 auto;
    }
    .a11y-toggle.on{ background: #2F8F6B; }
    .a11y-toggle::after{
      content: ""; position: absolute; top: 2px; left: 2px; width: 18px; height: 18px; border-radius: 50%;
      background: #fff; transition: left .15s;
    }
    .a11y-toggle.on::after{ left: 18px; }
    .a11y-readbtn{
      width: 100%; margin-top: 4px; padding: 9px; border-radius: 8px; border: none;
      background: #2B2560; color: #fff; font-family: 'IBM Plex Mono', monospace; font-size: .78rem; font-weight: 600;
      cursor: pointer;
    }
    .a11y-readbtn:hover{ background: #201C49; }
    .a11y-readbtn.reading{ background: #C77F1E; }
    .a11y-hr{ border: none; border-top: 1px solid #E3DCC9; margin: 14px 0; }

    /* High contrast mode */
    html.a11y-contrast body{ background: #000 !important; color: #fff !important; }
    html.a11y-contrast .sidebar{ background: #000 !important; border-right: 2px solid #fff; }
    html.a11y-contrast .section:nth-child(even){ background: #0a0a0a !important; }
    html.a11y-contrast .section{ border-bottom: 1px solid #444 !important; }
    html.a11y-contrast .callout, html.a11y-contrast .definition, html.a11y-contrast .dist-card,
    html.a11y-contrast .tvm-card, html.a11y-contrast .calc-card, html.a11y-contrast .chart-card,
    html.a11y-contrast .card, html.a11y-contrast .module-block{
      background: #000 !important; color: #fff !important; border: 1.5px solid #fff !important;
    }
    html.a11y-contrast h1, html.a11y-contrast h2, html.a11y-contrast h3{ color: #FFD166 !important; }
    html.a11y-contrast a{ color: #6FD3FF !important; }
    html.a11y-contrast .opt-btn{ background: #111 !important; color: #fff !important; border-color: #fff !important; }
    html.a11y-contrast .formula-expr{ background: #111 !important; }

    /* Reading-ease mode: wider spacing, plainer rhythm */
    html.a11y-easy body{ line-height: 1.9 !important; letter-spacing: .01em; }
    html.a11y-easy p{ max-width: 62ch; margin-bottom: 1.3em !important; }
    html.a11y-easy .section, html.a11y-easy .hero-mini, html.a11y-easy .hero{ line-height: 1.9; }

    .a11y-reading-highlight{ background: rgba(232,163,61,.35); border-radius: 3px; }
  `;
  document.head.appendChild(style);

  /* ---------- build UI ---------- */
  const fab = document.createElement('button');
  fab.className = 'a11y-fab';
  fab.setAttribute('aria-label', 'Accessibility options');
  fab.textContent = 'Aa';

  const panel = document.createElement('div');
  panel.className = 'a11y-panel';
  panel.innerHTML = `
    <h4>Reading &amp; Accessibility</h4>
    <div class="a11y-row">
      <label>Text size</label>
      <div class="a11y-fontctl">
        <button id="a11yFontDown">A-</button>
        <span id="a11yFontPct">100%</span>
        <button id="a11yFontUp">A+</button>
      </div>
    </div>
    <div class="a11y-row">
      <label>High contrast</label>
      <button class="a11y-toggle" id="a11yContrastToggle"></button>
    </div>
    <div class="a11y-row">
      <label>Reading-ease spacing</label>
      <button class="a11y-toggle" id="a11yEaseToggle"></button>
    </div>
    <hr class="a11y-hr">
    <button class="a11y-readbtn" id="a11yReadBtn">🔊 Read this page aloud</button>
  `;

  document.body.appendChild(fab);
  document.body.appendChild(panel);

  fab.addEventListener('click', () => panel.classList.toggle('open'));
  document.addEventListener('click', (e) => {
    if (!panel.contains(e.target) && e.target !== fab && panel.classList.contains('open')){
      panel.classList.remove('open');
    }
  });

  /* ---------- font scale ---------- */
  const fontPctEl = document.getElementById('a11yFontPct');
  function applyFontScale(){
    document.documentElement.style.fontSize = prefs.fontScale + '%';
    fontPctEl.textContent = prefs.fontScale + '%';
  }
  document.getElementById('a11yFontUp').addEventListener('click', () => {
    prefs.fontScale = Math.min(160, prefs.fontScale + 10);
    applyFontScale(); savePrefs(prefs);
  });
  document.getElementById('a11yFontDown').addEventListener('click', () => {
    prefs.fontScale = Math.max(80, prefs.fontScale - 10);
    applyFontScale(); savePrefs(prefs);
  });

  /* ---------- high contrast ---------- */
  const contrastToggle = document.getElementById('a11yContrastToggle');
  function applyContrast(){
    document.documentElement.classList.toggle('a11y-contrast', prefs.highContrast);
    contrastToggle.classList.toggle('on', prefs.highContrast);
  }
  contrastToggle.addEventListener('click', () => {
    prefs.highContrast = !prefs.highContrast;
    applyContrast(); savePrefs(prefs);
  });

  /* ---------- reading ease ---------- */
  const easeToggle = document.getElementById('a11yEaseToggle');
  function applyEase(){
    document.documentElement.classList.toggle('a11y-easy', prefs.readingEase);
    easeToggle.classList.toggle('on', prefs.readingEase);
  }
  easeToggle.addEventListener('click', () => {
    prefs.readingEase = !prefs.readingEase;
    applyEase(); savePrefs(prefs);
  });

  /* ---------- read aloud ---------- */
  const readBtn = document.getElementById('a11yReadBtn');
  let speaking = false;
  function getMainContent(){
    return document.querySelector('main') || document.querySelector('.sheet') || document.querySelector('.wrap') || document.body;
  }
  function stopReading(){
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    speaking = false;
    readBtn.textContent = '🔊 Read this page aloud';
    readBtn.classList.remove('reading');
  }
  readBtn.addEventListener('click', () => {
    if (!('speechSynthesis' in window)){
      alert('Your browser does not support read-aloud. Try a recent version of Chrome, Edge, or Safari.');
      return;
    }
    if (speaking){
      stopReading();
      return;
    }
    const root = getMainContent();
    const text = root.innerText || root.textContent || '';
    if (!text.trim()){
      alert('Nothing found to read on this page.');
      return;
    }
    // Speech synthesis has a practical character limit per utterance in some browsers —
    // split into chunks at sentence boundaries to keep it reliable on long pages.
    const chunks = text.match(/[^.!?]+[.!?]+|\n+|[^.!?]+$/g) || [text];
    let i = 0;
    speaking = true;
    readBtn.textContent = '⏹ Stop reading';
    readBtn.classList.add('reading');
    function speakNext(){
      if (!speaking || i >= chunks.length){ stopReading(); return; }
      const chunk = chunks[i].trim();
      i++;
      if (!chunk){ speakNext(); return; }
      const utter = new SpeechSynthesisUtterance(chunk);
      utter.rate = 0.95;
      utter.onend = speakNext;
      utter.onerror = speakNext;
      window.speechSynthesis.speak(utter);
    }
    speakNext();
  });

  // stop reading if the user navigates away
  window.addEventListener('beforeunload', stopReading);

  /* ---------- apply saved preferences on load ---------- */
  applyFontScale();
  applyContrast();
  applyEase();
})();
