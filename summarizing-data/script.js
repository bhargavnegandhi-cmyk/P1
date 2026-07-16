// ============================================================
// Organizing, Visualizing & Describing Data — interactivity
// ============================================================

/* ---------- stat helpers ---------- */
function parseNums(str){
  return str.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
}
function mean(arr){ return arr.reduce((a,b)=>a+b,0) / arr.length; }
function median(arr){
  const s = [...arr].sort((a,b)=>a-b);
  const n = s.length;
  if (n % 2 === 1) return s[(n-1)/2];
  return (s[n/2 - 1] + s[n/2]) / 2;
}
function modeOf(arr){
  const counts = {};
  arr.forEach(x => counts[x] = (counts[x]||0)+1);
  let max = 0;
  Object.values(counts).forEach(c => { if (c > max) max = c; });
  if (max <= 1) return null;
  return Object.keys(counts).filter(k => counts[k] === max).map(Number);
}
function geoMean(arr){
  if (arr.some(x => x < 0)) return NaN;
  const logSum = arr.reduce((a,b) => a + Math.log(b), 0);
  return Math.exp(logSum / arr.length);
}
function harmMean(arr){
  if (arr.some(x => x <= 0)) return NaN;
  const sumRecip = arr.reduce((a,b) => a + 1/b, 0);
  return arr.length / sumRecip;
}
function sampleVariance(arr){
  const m = mean(arr);
  const sumSq = arr.reduce((a,b) => a + (b-m)*(b-m), 0);
  return sumSq / (arr.length - 1);
}
function fmt(n, d=2){
  if (!isFinite(n)) return "—";
  return n.toFixed(d);
}

/* ---------- SVG helpers ---------- */
function svgEl(tag, attrs){
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const k in attrs) el.setAttribute(k, attrs[k]);
  return el;
}
/* ============================================================
   11b — BOX AND WHISKER PLOT (EAA Index quartiles)
   ============================================================ */
(function(){
  const container = document.getElementById('boxplotChart');
  if (!container) return;
  const stats = { min:-4.108, lowerFence:-1.422, q1:-0.293, median:0.044, q3:0.460, upperFence:1.589, max:5.001 };
  const W=560, H=140, pad=50;
  const domainMin = -4.5, domainMax = 5.3;
  const xScale = v => pad + (v-domainMin)/(domainMax-domainMin)*(W-2*pad);
  const svg = svgEl('svg', {viewBox:`0 0 ${W} ${H}`, width:'100%', style:'max-width:600px;'});
  const midY = 70;

  // whisker line from min to max
  svg.appendChild(svgEl('line', {x1:xScale(stats.min), x2:xScale(stats.max), y1:midY, y2:midY, stroke:'#4A4763', 'stroke-width':1.5}));
  // box
  svg.appendChild(svgEl('rect', {x:xScale(stats.q1), y:midY-22, width:xScale(stats.q3)-xScale(stats.q1), height:44, fill:'#E8A33D', 'fill-opacity':0.35, stroke:'#C77F1E', 'stroke-width':2}));
  // median line
  svg.appendChild(svgEl('line', {x1:xScale(stats.median), x2:xScale(stats.median), y1:midY-22, y2:midY+22, stroke:'#2B2560', 'stroke-width':2.5}));
  // fence caps
  [stats.min, stats.max].forEach(v => {
    svg.appendChild(svgEl('line', {x1:xScale(v), x2:xScale(v), y1:midY-12, y2:midY+12, stroke:'#4A4763', 'stroke-width':1.5}));
  });
  // labels
  const labelData = [
    [stats.min, 'Min ' + stats.min.toFixed(2)],
    [stats.q1, 'Q1 ' + stats.q1.toFixed(2)],
    [stats.median, 'Med ' + stats.median.toFixed(2)],
    [stats.q3, 'Q3 ' + stats.q3.toFixed(2)],
    [stats.max, 'Max ' + stats.max.toFixed(2)],
  ];
  labelData.forEach(([v,txt], i) => {
    const t = svgEl('text', {x:xScale(v), y:midY+40+((i%2)*14), 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':9, fill:'#1C1B29'});
    t.textContent = txt;
    svg.appendChild(t);
  });
  container.appendChild(svg);
})();

/* ============================================================
   09 — Mean / Median / Mode playground
   ============================================================ */
(function(){
  const input = document.getElementById('cmInput');
  const out = document.getElementById('cmOut');
  if (!input) return;
  function update(){
    const arr = parseNums(input.value);
    if (arr.length === 0){ out.innerHTML = '<div class="stat-readout"><div class="k">—</div><div class="v">Enter numbers</div></div>'; return; }
    const m = mean(arr), med = median(arr), mo = modeOf(arr);
    const modeStr = mo === null ? 'none' : mo.join(', ');
    out.innerHTML = `
      <div class="stat-readout"><div class="k">Mean</div><div class="v">${fmt(m,2)}</div></div>
      <div class="stat-readout"><div class="k">Median</div><div class="v">${fmt(med,2)}</div></div>
      <div class="stat-readout"><div class="k">Mode</div><div class="v">${modeStr}</div></div>
    `;
  }
  input.addEventListener('input', update);
  update();
})();

/* ============================================================
   10 — Arithmetic / Geometric / Harmonic mean calculator
   ============================================================ */
(function(){
  const input = document.getElementById('meansInput');
  const out = document.getElementById('meansOut');
  if (!input) return;
  function update(){
    const arr = parseNums(input.value);
    if (arr.length === 0){ out.innerHTML = '<div class="stat-readout"><div class="k">—</div><div class="v">Enter numbers</div></div>'; return; }
    const a = mean(arr), g = geoMean(arr), h = harmMean(arr);
    out.innerHTML = `
      <div class="stat-readout"><div class="k">Arithmetic</div><div class="v">${fmt(a,2)}</div></div>
      <div class="stat-readout"><div class="k">Geometric</div><div class="v">${isNaN(g)?'n/a (needs ≥0)':fmt(g,2)}</div></div>
      <div class="stat-readout"><div class="k">Harmonic</div><div class="v">${isNaN(h)?'n/a (needs &gt;0)':fmt(h,2)}</div></div>
    `;
  }
  input.addEventListener('input', update);
  update();
})();

/* ============================================================
   10b — Decision flow: which mean should I use?
   ============================================================ */
(function(){
  const container = document.getElementById('decisionFlow');
  if (!container) return;
  function render(){
    container.innerHTML = `
      <div class="decision-node">
        <div class="qtext">Do you need to include all values, including outliers?</div>
        <div class="branches">
          <button data-r="arith">Yes</button>
          <button data-r="q2">No</button>
        </div>
      </div>
    `;
    container.querySelector('[data-r="arith"]').addEventListener('click', () => showResult('Use the <strong>arithmetic mean</strong> — it uses every observation with equal weight.'));
    container.querySelector('[data-r="q2"]').addEventListener('click', renderQ2);
  }
  function renderQ2(){
    container.innerHTML = `
      <div class="decision-node">
        <div class="qtext">Is there compounding involved (e.g., averaging returns over time)?</div>
        <div class="branches">
          <button data-r="geo">Yes</button>
          <button data-r="q3">No</button>
        </div>
      </div>
    `;
    container.querySelector('[data-r="geo"]').addEventListener('click', () => showResult('Use the <strong>geometric mean</strong> — it correctly captures compound growth over time.'));
    container.querySelector('[data-r="q3"]').addEventListener('click', renderQ3);
  }
  function renderQ3(){
    container.innerHTML = `
      <div class="decision-node">
        <div class="qtext">Are there extreme outliers you want to dampen (without deleting data)?</div>
        <div class="branches">
          <button data-r="harm">Yes</button>
          <button data-r="arith2">No</button>
        </div>
      </div>
    `;
    container.querySelector('[data-r="harm"]').addEventListener('click', () => showResult('Consider the <strong>harmonic mean</strong> (for rates/ratios), or a <strong>trimmed</strong> / <strong>winsorized mean</strong> otherwise.'));
    container.querySelector('[data-r="arith2"]').addEventListener('click', () => showResult('The <strong>arithmetic mean</strong> is the sensible default.'));
  }
  function showResult(html){
    const result = document.createElement('div');
    result.className = 'decision-result';
    result.innerHTML = html + ' <button style="margin-left:10px; font-family:var(--font-mono); font-size:.75rem; background:transparent; border:1px solid #fff; color:#fff; border-radius:6px; padding:3px 9px; cursor:pointer;" id="decisionReset">Start over</button>';
    container.appendChild(result);
    document.getElementById('decisionReset').addEventListener('click', render);
  }
  render();
})();

/* ============================================================
   11 — Percentile locator
   ============================================================ */
(function(){
  const nI = document.getElementById('pctN'), yI = document.getElementById('pctY');
  const result = document.getElementById('pctResult'), steps = document.getElementById('pctSteps');
  if (!nI) return;
  function update(){
    const n = parseInt(nI.value,10), y = parseFloat(yI.value);
    if (isNaN(n) || isNaN(y) || n <= 0){ result.textContent='Check inputs'; steps.textContent=''; return; }
    const Ly = (n+1) * y/100;
    result.textContent = `L${y} = ${fmt(Ly,2)}`;
    if (Number.isInteger(Math.round(Ly*1000)/1000)){
      steps.textContent = `(${n} + 1) × ${y}/100 = ${fmt(Ly,2)} → whole number, use the ${Math.round(Ly)}th sorted value directly`;
    } else {
      const lower = Math.floor(Ly), upper = Math.ceil(Ly);
      steps.textContent = `(${n} + 1) × ${y}/100 = ${fmt(Ly,2)} → interpolate between the ${lower}th and ${upper}th sorted values`;
    }
  }
  [nI,yI].forEach(el => el.addEventListener('input', update));
  update();
})();

/* ============================================================
   12 — Dispersion calculator
   ============================================================ */
(function(){
  const input = document.getElementById('dispInput');
  const out = document.getElementById('dispOut');
  if (!input) return;
  function update(){
    const arr = parseNums(input.value);
    if (arr.length < 2){ out.innerHTML = '<div class="stat-readout"><div class="k">—</div><div class="v">Need ≥2 numbers</div></div>'; return; }
    const range = Math.max(...arr) - Math.min(...arr);
    const m = mean(arr);
    const mad = arr.reduce((a,b) => a + Math.abs(b-m), 0) / arr.length;
    const v = sampleVariance(arr);
    const sd = Math.sqrt(v);
    out.innerHTML = `
      <div class="stat-readout"><div class="k">Range</div><div class="v">${fmt(range,2)}</div></div>
      <div class="stat-readout"><div class="k">MAD</div><div class="v">${fmt(mad,2)}</div></div>
      <div class="stat-readout"><div class="k">Variance</div><div class="v">${fmt(v,2)}</div></div>
      <div class="stat-readout"><div class="k">Std Dev</div><div class="v">${fmt(sd,2)}</div></div>
    `;
  }
  input.addEventListener('input', update);
  update();
})();

/* ============================================================
   13 — Target semideviation & coefficient of variation
   ============================================================ */
(function(){
  const input = document.getElementById('ddInput');
  const targetI = document.getElementById('ddTarget');
  const out = document.getElementById('ddOut');
  if (!input) return;
  function update(){
    const arr = parseNums(input.value);
    const target = parseFloat(targetI.value);
    if (arr.length < 2 || isNaN(target)){ out.innerHTML = '<div class="stat-readout"><div class="k">—</div><div class="v">Check inputs</div></div>'; return; }
    const m = mean(arr);
    const sd = Math.sqrt(sampleVariance(arr));
    const below = arr.filter(x => x <= target);
    let semidev = NaN;
    if (below.length > 0 && arr.length > 1){
      const sumSq = below.reduce((a,b) => a + (b-target)*(b-target), 0);
      semidev = Math.sqrt(sumSq / (arr.length - 1));
    }
    const cv = m !== 0 ? sd / m : NaN;
    out.innerHTML = `
      <div class="stat-readout"><div class="k">Mean</div><div class="v">${fmt(m,2)}</div></div>
      <div class="stat-readout"><div class="k">Std Dev</div><div class="v">${fmt(sd,2)}</div></div>
      <div class="stat-readout"><div class="k">Target Semidev</div><div class="v">${isNaN(semidev)?'n/a':fmt(semidev,2)}</div></div>
      <div class="stat-readout"><div class="k">CV</div><div class="v">${isNaN(cv)?'n/a':fmt(cv,2)}</div></div>
    `;
  }
  [input,targetI].forEach(el => el.addEventListener('input', update));
  update();
})();


/* ============================================================
   01b — Center of gravity chart (static)
   ============================================================ */
(function(){
  const container = document.getElementById('cogChart');
  if (!container) return;
  const counts = {2:1,4:2,6:1,10:2,12:3};
  const W=520, H=160, padL=30, padR=30, baseY=110;
  const domainMin=1, domainMax=13;
  const xScale = v => padL + (v-domainMin)/(domainMax-domainMin)*(W-padL-padR);
  const svg = svgEl('svg', {viewBox:`0 0 ${W} ${H}`, width:'100%', style:'max-width:560px;'});
  svg.appendChild(svgEl('line', {x1:padL, x2:W-padR, y1:baseY, y2:baseY, stroke:'#4A4763', 'stroke-width':1.5}));
  for (let v=1; v<=13; v++){
    const x = xScale(v);
    svg.appendChild(svgEl('line', {x1:x, x2:x, y1:baseY-4, y2:baseY+4, stroke:'#E3DCC9', 'stroke-width':1}));
    if (v%2===0 || v===1){
      const t = svgEl('text', {x, y:baseY+18, 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':9, fill:'#4A4763'});
      t.textContent = v;
      svg.appendChild(t);
    }
  }
  Object.entries(counts).forEach(([val,cnt]) => {
    const x = xScale(+val);
    for (let i=0;i<cnt;i++){
      svg.appendChild(svgEl('rect', {x:x-6, y:baseY-10-i*16, width:12, height:14, fill:'#2B2560', rx:2}));
    }
  });
  // fulcrum triangle at mean=8
  const fx = xScale(8);
  svg.appendChild(svgEl('polygon', {points:`${fx-10},${baseY+10} ${fx+10},${baseY+10} ${fx},${baseY-4}`, fill:'#E8A33D'}));
  const meanLbl = svgEl('text', {x:fx, y:baseY+26, 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':10, fill:'#C77F1E', 'font-weight':'700'});
  meanLbl.textContent = 'mean = 8 (fulcrum)';
  svg.appendChild(meanLbl);
  container.appendChild(svg);
})();

/* ============================================================
   01c — Skewness diagram (tabs: left/symmetric/right)
   ============================================================ */
(function(){
  const container = document.getElementById('skewChart');
  const tabs = document.getElementById('skewTabs');
  if (!container) return;
  function skewedCurve(x, skew){
    // simple asymmetric bump function for illustration only
    const base = Math.exp(-0.5*x*x);
    if (skew === 0) return base;
    const shift = skew * 0.35;
    return Math.exp(-0.5*Math.pow(x - shift*x*Math.abs(x)*0.5, 2));
  }
  function render(mode){
    const W=480, H=190, padL=20, padR=20, padT=16, padB=34;
    const domainMin=-4, domainMax=4;
    const xScale = v => padL + (v-domainMin)/(domainMax-domainMin)*(W-padL-padR);
    const skewParam = mode==='left' ? -1 : mode==='right' ? 1 : 0;
    let pts = [];
    for (let x=domainMin; x<=domainMax; x+=0.05){
      let xx = x;
      if (skewParam !== 0){
        // stretch one tail using a cube warp for a simple asymmetric bump
        xx = x + skewParam*0.18*Math.pow(x,3)/8;
      }
      pts.push([x, Math.exp(-0.5*xx*xx)]);
    }
    const maxY = Math.max(...pts.map(p=>p[1]));
    const yScale = v => (H-padB) - (v/maxY)*(H-padT-padB);
    const svg = svgEl('svg', {viewBox:`0 0 ${W} ${H}`, width:'100%', class:'skew-svg', style:'max-width:520px;'});
    svg.appendChild(svgEl('line', {x1:padL, x2:W-padR, y1:H-padB, y2:H-padB, stroke:'#E3DCC9'}));
    let d = '';
    pts.forEach((p,i) => { d += (i===0?'M':'L')+xScale(p[0])+','+yScale(p[1])+' '; });
    svg.appendChild(svgEl('path', {d, fill:'none', stroke:'#2B2560', 'stroke-width':2.2}));

    // approximate mean/median/mode marker positions for illustration
    let modeX, medianX, meanX;
    if (mode === 'sym'){ modeX=medianX=meanX=0; }
    else if (mode === 'right'){ modeX=-0.5; medianX=0; meanX=0.6; }
    else { modeX=0.5; medianX=0; meanX=-0.6; }
    [[modeX,'Mode','#2F8F6B',-8],[medianX,'Median','#C77F1E',10],[meanX,'Mean','#D6573F',28]].forEach(([xv,label,color,dy]) => {
      const x = xScale(xv);
      svg.appendChild(svgEl('line', {x1:x, x2:x, y1:padT, y2:H-padB, stroke:color, 'stroke-width':1.5, 'stroke-dasharray':'3,2'}));
      const t = svgEl('text', {x, y:H-8, 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':9, fill:color, 'font-weight':'700'});
      t.textContent = label;
      svg.appendChild(t);
    });
    container.innerHTML = '';
    container.appendChild(svg);
  }
  tabs.querySelectorAll('.test-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.querySelectorAll('.test-tab').forEach(t=>t.classList.remove('active'));
      tab.classList.add('active');
      render(tab.dataset.skew);
    });
  });
  render('left');
})();

/* ============================================================
   02 — Trimmed & winsorized mean calculator
   ============================================================ */
(function(){
  const input = document.getElementById('trimInput'), pctI = document.getElementById('trimPct');
  const out = document.getElementById('trimOut');
  if (!input) return;
  function render(){
    const arr = parseNums(input.value);
    const pct = parseFloat(pctI.value)/100;
    if (arr.length === 0){ out.innerHTML = '<div class="stat-readout"><div class="k">—</div><div class="v">Enter numbers</div></div>'; return; }
    const sorted = [...arr].sort((a,b)=>a-b);
    const n = sorted.length;
    const rawMean = mean(arr);

    // trimmed mean: drop pct from each side (by count, rounding down for illustration)
    const dropCount = Math.floor(n*pct);
    const trimmed = sorted.slice(dropCount, n-dropCount);
    const trimmedMean = trimmed.length ? mean(trimmed) : NaN;

    // winsorized mean: cap values below/above the pct and (1-pct) percentile
    function percentileValue(p){
      const Ly = (n+1)*p;
      const lower = Math.floor(Ly), upper = Math.ceil(Ly);
      if (lower === upper || lower < 1) return sorted[Math.min(Math.max(Math.round(Ly),1),n)-1];
      const frac = Ly - lower;
      const lo = sorted[Math.min(Math.max(lower,1),n)-1];
      const hi = sorted[Math.min(Math.max(upper,1),n)-1];
      return lo + frac*(hi-lo);
    }
    const lowCut = percentileValue(pct);
    const highCut = percentileValue(1-pct);
    const winsorized = sorted.map(v => v < lowCut ? lowCut : v > highCut ? highCut : v);
    const winsorizedMean = mean(winsorized);

    out.innerHTML = `
      <div class="stat-readout"><div class="k">Raw mean</div><div class="v">${fmt(rawMean,2)}</div></div>
      <div class="stat-readout"><div class="k">Trimmed mean</div><div class="v">${fmt(trimmedMean,2)}</div></div>
      <div class="stat-readout"><div class="k">Winsorized mean</div><div class="v">${fmt(winsorizedMean,2)}</div></div>
    `;
  }
  [input,pctI].forEach(el => el.addEventListener('input', render));
  render();
})();

/* ============================================================
   Check-in mini quizzes
   ============================================================ */
(function(){
  document.querySelectorAll('.checkin').forEach(box => {
    const btns = box.querySelectorAll('.opt-btn');
    const feedback = box.querySelector('.checkin-feedback');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        btns.forEach(b => b.disabled = true);
        btns.forEach(b => { if (b.dataset.correct === 'true') b.classList.add('correct'); });
        if (btn.dataset.correct !== 'true') btn.classList.add('incorrect');
        feedback.classList.add('show');
        markSectionProgress(box.closest('section').id);
      });
    });
  });
})();

/* ============================================================
   Sidebar scroll-spy + progress + mobile toggle
   ============================================================ */
const sectionIds = ['sec-central','sec-outliers','sec-othermeans','sec-quantiles','sec-dispersion','sec-downside','sec-quiz'];
const visited = new Set();

function markSectionProgress(id){
  if (sectionIds.includes(id)){
    visited.add(id);
    updateProgress();
  }
}
function updateProgress(){
  const pct = Math.round((visited.size / sectionIds.length) * 100);
  const fill = document.getElementById('progressFill');
  const label = document.getElementById('progressPct');
  if (fill) fill.style.width = pct + '%';
  if (label) label.textContent = pct + '%';
  sectionIds.forEach(id => {
    const link = document.querySelector(`.toc a[data-sec="${id}"]`);
    if (link && visited.has(id)) link.classList.add('done');
  });
  try { localStorage.setItem('cfa-progress-summarizing-data', String(pct)); } catch(e) {}
}

(function(){
  const links = document.querySelectorAll('.toc a[data-sec]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.id;
      const link = document.querySelector(`.toc a[data-sec="${id}"]`);
      if (!link) return;
      if (entry.isIntersecting){
        links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        markSectionProgress(id);
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px', threshold: 0 });

  sectionIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });

  const toggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');
  if (toggle){
    toggle.addEventListener('click', () => sidebar.classList.toggle('open'));
    document.querySelectorAll('.toc a').forEach(a => a.addEventListener('click', () => sidebar.classList.remove('open')));
  }
})();

/* ============================================================
   QUIZ
   ============================================================ */
const QUIZ = [
  {
    concept: "Mean, Median, Mode",
    q: "For the dataset 2, 4, 4, 6, 10, 10, 12, 12, 12, what is the mode?",
    opts: ["10", "12", "8"],
    correct: 1,
    exp: "12 appears three times, more than any other value, making it the mode."
  },
  {
    concept: "Mean, Median, Mode",
    q: "Using the center-of-gravity analogy, the arithmetic mean is the point where:",
    opts: ["The most observations are clustered", "A bar holding all the observations, stacked by frequency, would balance on a fulcrum", "The data is split into two equal halves"],
    correct: 1,
    exp: "The mean behaves like a physical center of gravity — the one point where the weighted bar of observations balances perfectly."
  },
  {
    concept: "Mean, Median, Mode",
    q: "For any dataset, the sum of deviations of each observation from the arithmetic mean equals:",
    opts: ["The variance", "Always zero", "The standard deviation"],
    correct: 1,
    exp: "This is a mathematical identity: Σ(Xᵢ − X̄) always equals exactly zero, regardless of the dataset — the positive and negative deviations exactly cancel."
  },
  {
    concept: "Mean, Median, Mode",
    q: "A distribution with positive (right) skewness typically has which ordering of mean, median, and mode?",
    opts: ["Mean < Median < Mode", "Mode < Median < Mean", "Mean = Median = Mode"],
    correct: 1,
    exp: "Right skew means a long tail of large values pulls the mean above the median, which in turn sits above the mode."
  },
  {
    concept: "Outliers, Trimmed & Winsorized Means",
    q: "Given the dataset 1, 2, 3, 4, 5, 6, 1000, which measure of central tendency is least affected by the outlier of 1000?",
    opts: ["Arithmetic mean", "Median", "They're equally affected"],
    correct: 1,
    exp: "The median (4) ignores the magnitude of extreme values entirely, unlike the arithmetic mean, which is pulled sharply upward by the 1000."
  },
  {
    concept: "Outliers, Trimmed & Winsorized Means",
    q: "A 5% trimmed mean, compared to the raw arithmetic mean on the same dataset, is computed using:",
    opts: ["All of the original observations", "95% of the original observations, with the most extreme 5% removed", "Only the median value"],
    correct: 1,
    exp: "A 5% trimmed mean discards the lowest 2.5% and highest 2.5% of values (5% total) and averages the remaining 95%."
  },
  {
    concept: "Outliers, Trimmed & Winsorized Means",
    q: "A 95% winsorized mean, unlike a trimmed mean, handles extreme values by:",
    opts: ["Deleting them entirely", "Replacing them with a specified cutoff value rather than deleting them", "Ignoring the entire dataset"],
    correct: 1,
    exp: "Winsorizing caps extreme values at a specified percentile rather than removing them, so the full sample size is preserved."
  },
  {
    concept: "Weighted, Geometric & Harmonic Mean",
    q: "A portfolio is 40% stocks (return 10%) and 60% bonds (return 4%). What is the weighted mean return?",
    opts: ["7.0%", "6.4%", "8.2%"],
    correct: 1,
    exp: "Weighted mean = 0.40(10%) + 0.60(4%) = 4.0% + 2.4% = 6.4%."
  },
  {
    concept: "Weighted, Geometric & Harmonic Mean",
    q: "A stock returns 10% in Year 1 and −10% in Year 2. What is the geometric mean return?",
    opts: ["0%", "About −0.5%", "About 1.0%"],
    correct: 1,
    exp: "[(1.10)(0.90)]^(1/2) − 1 = √0.99 − 1 ≈ −0.503%. Unlike the arithmetic mean (0%), the geometric mean correctly reflects that the investment actually lost value overall."
  },
  {
    concept: "Weighted, Geometric & Harmonic Mean",
    q: "Which mean is most appropriate for cost averaging — investing a fixed amount of money at different share prices?",
    opts: ["Arithmetic mean", "Geometric mean", "Harmonic mean"],
    correct: 2,
    exp: "The harmonic mean is the mathematically correct average purchase price when a fixed dollar amount buys a varying number of shares at each price."
  },
  {
    concept: "Weighted, Geometric & Harmonic Mean",
    q: "For a given dataset that isn't perfectly constant, which ordering always holds?",
    opts: ["Arithmetic mean ≤ Geometric mean ≤ Harmonic mean", "Harmonic mean ≤ Geometric mean ≤ Arithmetic mean", "Geometric mean ≤ Harmonic mean ≤ Arithmetic mean"],
    correct: 1,
    exp: "Harmonic mean ≤ Geometric mean ≤ Arithmetic mean always holds (with equality only when every observation is identical)."
  },
  {
    concept: "Quantiles",
    q: "In a sorted sample of 49 observations, what is the location L50 (the median's position)?",
    opts: ["24.5", "25", "50"],
    correct: 1,
    exp: "Ly = (n+1) × y/100 = (49+1) × 50/100 = 50 × 0.5 = 25 — a whole number, so the median is exactly the 25th sorted value."
  },
  {
    concept: "Quantiles",
    q: "The interquartile range (IQR) is calculated as:",
    opts: ["Q3 + Q1", "Q3 − Q1", "(Q3 + Q1)/2"],
    correct: 1,
    exp: "IQR = Q3 − Q1, measuring the spread of the middle 50% of the data."
  },
  {
    concept: "Quantiles",
    q: "On a box-and-whisker plot, the box itself spans:",
    opts: ["The minimum to the maximum", "Q1 to Q3", "One standard deviation above and below the mean"],
    correct: 1,
    exp: "The box spans the interquartile range, from Q1 to Q3, with the median typically marked inside it."
  },
  {
    concept: "Measures of Dispersion",
    q: "Why does the sample variance formula divide the sum of squared deviations by (n − 1) rather than n?",
    opts: ["It's easier to compute", "It corrects for using an estimated sample mean, keeping the estimator unbiased", "It only matters for very large samples"],
    correct: 1,
    exp: "Using the sample mean (itself estimated from the data) uses up one degree of freedom; dividing by n − 1 keeps the sample variance an unbiased estimator of the population variance."
  },
  {
    concept: "Measures of Dispersion",
    q: "Which measure of dispersion uses the absolute value of deviations from the mean, rather than squaring them?",
    opts: ["Sample variance", "Mean absolute deviation (MAD)", "Standard deviation"],
    correct: 1,
    exp: "MAD averages the absolute value of each deviation from the mean, sidestepping the sum-to-zero problem without squaring."
  },
  {
    concept: "Downside Deviation & CV",
    q: "Fund A: mean return 6%, std dev 9%. Fund B: mean return 15%, std dev 20%. Which fund has more risk per unit of return (higher coefficient of variation)?",
    opts: ["Fund A (CV = 1.50)", "Fund B (CV = 1.33)", "They're equal"],
    correct: 0,
    exp: "CV(A) = 9/6 = 1.50 vs. CV(B) = 20/15 ≈ 1.33. Despite Fund B's larger raw standard deviation, Fund A carries more risk per unit of expected return."
  },
  {
    concept: "Downside Deviation & CV",
    q: "Target semideviation differs from ordinary standard deviation because it:",
    opts: ["Only includes observations below a specified target", "Squares every deviation regardless of direction", "Ignores the sample size"],
    correct: 0,
    exp: "Target (semi)deviation only counts shortfalls below a chosen target return, focusing specifically on downside risk rather than total dispersion."
  },
  {
    concept: "Downside Deviation & CV",
    q: "Raising the target return used in a semideviation calculation, holding the data fixed, will typically:",
    opts: ["Decrease the semideviation, since fewer observations qualify", "Increase the semideviation, since more observations now fall below the higher bar", "Have no effect on the semideviation"],
    correct: 1,
    exp: "A higher target means more observations count as 'below target,' which mechanically tends to raise the calculated semideviation."
  },
  {
    concept: "Weighted, Geometric & Harmonic Mean",
    q: "40% of a bond portfolio is investment-grade (2% default rate), 60% is high-yield (8% default rate). What is the overall (weighted mean) default rate?",
    opts: ["0.050", "0.056", "0.100"],
    correct: 1,
    exp: "0.02×0.40 + 0.08×0.60 = 0.008 + 0.048 = 0.056, or 5.6% — a weighted mean using the portfolio proportions as weights."
  }
];

(function(){
  const shell = document.getElementById('quizShell');
  if (!shell) return;
  let current = 0;
  let score = 0;
  const answered = new Array(QUIZ.length).fill(null);

  function renderQuestion(){
    const item = QUIZ[current];
    let html = `<div class="quiz-progress">Question ${current+1} of ${QUIZ.length} &nbsp;·&nbsp; Score so far: ${score}</div>`;
    html += `<div class="quiz-q">${item.q}</div>`;
    html += `<div class="opt-list" id="quizOpts">`;
    item.opts.forEach((opt, i) => {
      html += `<button class="opt-btn" data-i="${i}">${opt}</button>`;
    });
    html += `</div>`;
    html += `<div class="quiz-explain" id="quizExplain">${item.exp}</div>`;
    html += `<div class="quiz-nav">
      <button class="btn ghost" id="quizPrev" ${current===0 ? 'disabled' : ''}>← Previous</button>
      <button class="btn" id="quizNext" disabled>${current === QUIZ.length-1 ? 'See score' : 'Next →'}</button>
    </div>`;
    shell.innerHTML = html;

    const opts = shell.querySelectorAll('.opt-btn');
    const explain = document.getElementById('quizExplain');
    const nextBtn = document.getElementById('quizNext');
    const prevBtn = document.getElementById('quizPrev');

    if (answered[current] !== null){
      opts.forEach(btn => {
        btn.disabled = true;
        const i = +btn.dataset.i;
        if (i === item.correct) btn.classList.add('correct');
        else if (i === answered[current]) btn.classList.add('incorrect');
      });
      explain.classList.add('show');
      nextBtn.disabled = false;
    }

    opts.forEach(btn => {
      btn.addEventListener('click', () => {
        if (answered[current] !== null) return;
        const i = +btn.dataset.i;
        answered[current] = i;
        if (i === item.correct) score++;
        if (typeof cfaRecordAnswer === "function" && item.concept){
          cfaRecordAnswer(item.concept, "Summarizing Data", i === item.correct);
        }
        opts.forEach(b => {
          b.disabled = true;
          const bi = +b.dataset.i;
          if (bi === item.correct) b.classList.add('correct');
          else if (bi === i) b.classList.add('incorrect');
        });
        explain.classList.add('show');
        nextBtn.disabled = false;
        markSectionProgress('sec-quiz');
      });
    });

    nextBtn.addEventListener('click', () => {
      if (current < QUIZ.length - 1){ current++; renderQuestion(); }
      else { renderScore(); }
    });
    prevBtn.addEventListener('click', () => {
      if (current > 0){ current--; renderQuestion(); }
    });
  }

  function renderScore(){
    const pct = Math.round((score / QUIZ.length) * 100);
    let msg = "Solid foundation — review the sections you missed and try again.";
    if (pct >= 90) msg = "Excellent — you've genuinely internalized this reading.";
    else if (pct >= 70) msg = "Good work — a couple of gaps worth revisiting.";
    shell.innerHTML = `
      <div class="quiz-score">
        <div style="font-family:var(--font-mono); font-size:.8rem; color:var(--ink-soft); text-transform:uppercase; letter-spacing:.08em;">Final score</div>
        <div class="big">${score} / ${QUIZ.length}</div>
        <p style="max-width:46ch; margin:10px auto 22px; color:var(--ink-soft);">${msg}</p>
        <button class="btn" id="quizRestart">Retake the quiz</button>
      </div>`;
    document.getElementById('quizRestart').addEventListener('click', () => {
      current = 0; score = 0;
      answered.fill(null);
      renderQuestion();
    });
  }

  renderQuestion();
})();
