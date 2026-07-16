// ============================================================
// Sampling & Estimation — interactivity
// ============================================================

/* ---------- math helpers ---------- */
function erf(x){
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);
  const a1=0.254829592, a2=-0.284496736, a3=1.421413741, a4=-1.453152027, a5=1.061405429, p=0.3275911;
  const t = 1/(1+p*x);
  const y = 1 - (((((a5*t+a4)*t)+a3)*t+a2)*t+a1)*t*Math.exp(-x*x);
  return sign*y;
}
function normCDF(z){ return 0.5 * (1 + erf(z/Math.sqrt(2))); }
function normPDF(x, mu=0, sigma=1){ return Math.exp(-0.5*Math.pow((x-mu)/sigma,2)) / (sigma*Math.sqrt(2*Math.PI)); }
// Inverse standard normal CDF via bisection (returns z such that normCDF(z) = p)
function normInv(p){
  let lo = -8, hi = 8;
  for (let i=0; i<80; i++){
    const mid = (lo+hi)/2;
    if (normCDF(mid) < p) lo = mid; else hi = mid;
  }
  return (lo+hi)/2;
}
// Lanczos gamma
function gamma(z){
  const g = 7;
  const c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
  if (z < 0.5) return Math.PI / (Math.sin(Math.PI*z) * gamma(1-z));
  z -= 1;
  let x = c[0];
  for (let i=1; i<g+2; i++) x += c[i]/(z+i);
  const t = z + g + 0.5;
  return Math.sqrt(2*Math.PI) * Math.pow(t, z+0.5) * Math.exp(-t) * x;
}
function tPDF(x, df){
  const num = gamma((df+1)/2);
  const den = Math.sqrt(df*Math.PI) * gamma(df/2);
  return (num/den) * Math.pow(1 + (x*x)/df, -(df+1)/2);
}
// Right-tail area of t-distribution beyond x>=0, via Simpson's rule numerical integration
function tRightTail(x, df){
  // integrate tPDF from x to a large upper bound
  const upper = x + 60;
  const n = 2000;
  const h = (upper - x) / n;
  let sum = tPDF(x, df) + tPDF(upper, df);
  for (let i=1; i<n; i++){
    const xi = x + i*h;
    sum += tPDF(xi, df) * (i % 2 === 0 ? 2 : 4);
  }
  return (h/3) * sum;
}
// Inverse: find t such that right-tail area = alpha (bisection)
function tInv(alpha, df){
  let lo = 0, hi = 40;
  for (let i=0; i<60; i++){
    const mid = (lo+hi)/2;
    const area = tRightTail(mid, df);
    if (area > alpha) lo = mid; else hi = mid;
  }
  return (lo+hi)/2;
}
function fmtP(n, d=4){ return isFinite(n) ? n.toFixed(d) : "—"; }
function svgEl(tag, attrs){
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const k in attrs) el.setAttribute(k, attrs[k]);
  return el;
}

/* ============================================================
   02 — Estimator properties chart (unbiased/efficient/consistent)
   ============================================================ */
(function(){
  const container = document.getElementById('propertiesChart');
  const tabs = document.getElementById('propTabs');
  if (!container) return;

  function curvePath(xScale, yScale, mu, sigma, domainMin, domainMax){
    let d = '';
    for (let x=domainMin; x<=domainMax; x+=0.08){
      const px = xScale(x), py = yScale(normPDF(x, mu, sigma));
      d += (x===domainMin ? 'M':'L') + px + ',' + py + ' ';
    }
    return d;
  }

  function render(mode){
    const W=500, H=200, padL=20, padR=20, padT=14, padB=20;
    const domainMin=-6, domainMax=10;
    const xScale = v => padL + (v-domainMin)/(domainMax-domainMin)*(W-padL-padR);
    const svg = svgEl('svg', {viewBox:`0 0 ${W} ${H}`, width:'100%', class:'dist-svg', style:'max-width:540px;'});

    let curves, legendHTML, trueValX = 2;
    if (mode === 'unbiased'){
      curves = [
        {mu:2, sigma:1.3, color:'#2F8F6B', label:'Unbiased estimator (centered on μ)'},
        {mu:5, sigma:1.3, color:'#D6573F', label:'Biased estimator (off-center)'}
      ];
    } else if (mode === 'efficient'){
      curves = [
        {mu:2, sigma:0.9, color:'#2F8F6B', label:'Efficient (tighter spread)'},
        {mu:2, sigma:2.2, color:'#D6573F', label:'Inefficient (wider spread, same mean)'}
      ];
    } else {
      curves = [
        {mu:2, sigma:2.2, color:'#D6573F', label:'n = 30 (wide)'},
        {mu:2, sigma:1.1, color:'#E8A33D', label:'n = 200 (tighter)'},
        {mu:2, sigma:0.5, color:'#2F8F6B', label:'n = 1,000 (very tight)'}
      ];
    }
    const maxPdf = Math.max(...curves.map(c => normPDF(c.mu, c.mu, c.sigma)));
    const yScale = v => (H-padB) - (v/maxPdf)*(H-padT-padB);

    svg.appendChild(svgEl('line', {x1:padL, x2:W-padR, y1:H-padB, y2:H-padB, stroke:'#E3DCC9'}));
    // true value marker
    svg.appendChild(svgEl('line', {x1:xScale(trueValX), x2:xScale(trueValX), y1:padT, y2:H-padB, stroke:'#1C1B29', 'stroke-width':1.5, 'stroke-dasharray':'4,3'}));
    const trueLbl = svgEl('text', {x:xScale(trueValX), y:padT-2, 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':9, fill:'#1C1B29', 'font-weight':'700'});
    trueLbl.textContent = 'true μ';
    svg.appendChild(trueLbl);

    curves.forEach(c => {
      const d = curvePath(xScale, yScale, c.mu, c.sigma, domainMin, domainMax);
      svg.appendChild(svgEl('path', {d, fill:'none', stroke:c.color, 'stroke-width':2.2}));
    });
    container.innerHTML = '';
    container.appendChild(svg);
    const legend = document.createElement('div');
    legend.style.display='flex'; legend.style.flexWrap='wrap'; legend.style.gap='14px'; legend.style.marginTop='8px'; legend.style.fontFamily='var(--font-mono)'; legend.style.fontSize='.72rem';
    legend.innerHTML = curves.map(c => `<span><span style="display:inline-block;width:10px;height:10px;background:${c.color};border-radius:2px;margin-right:5px;"></span>${c.label}</span>`).join('');
    container.appendChild(legend);
  }

  tabs.querySelectorAll('.calc-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.querySelectorAll('.calc-tab').forEach(t=>t.classList.remove('active'));
      tab.classList.add('active');
      render(tab.dataset.prop);
    });
  });
  render('unbiased');
})();

/* ============================================================
   04 — CI known variance number line (static illustrative)
   ============================================================ */
(function(){
  const container = document.getElementById('ciKnownLine');
  if (!container) return;
  const mean = 25, se = 2, z = 1.96;
  const lower = mean - z*se, upper = mean + z*se;
  const W=460, H=110, padL=30, padR=30;
  const domainMin = lower - 6, domainMax = upper + 6;
  const xScale = v => padL + (v-domainMin)/(domainMax-domainMin)*(W-padL-padR);
  const svg = svgEl('svg', {viewBox:`0 0 ${W} ${H}`, width:'100%', class:'ci-line-svg', style:'max-width:480px;'});
  const y = 55;
  svg.appendChild(svgEl('line', {x1:padL, x2:W-padR, y1:y, y2:y, stroke:'#E3DCC9', 'stroke-width':2}));
  svg.appendChild(svgEl('line', {x1:xScale(lower), x2:xScale(upper), y1:y, y2:y, stroke:'#2B2560', 'stroke-width':4}));
  [lower, mean, upper].forEach((v,i) => {
    svg.appendChild(svgEl('circle', {cx:xScale(v), cy:y, r:5, fill: i===1 ? '#E8A33D' : '#2B2560', stroke:'#fff', 'stroke-width':1.5}));
    const t = svgEl('text', {x:xScale(v), y:y-14, 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':10, fill:'#1C1B23', 'font-weight':'600'});
    t.textContent = v.toFixed(2);
    svg.appendChild(t);
  });
  const capt = svgEl('text', {x:W/2, y:H-8, 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':9, fill:'#4A4763'});
  capt.textContent = '95% CI for μ: [21.08, 28.92], centered on X̄=25';
  svg.appendChild(capt);
  container.appendChild(svg);
})();

/* ============================================================
   05 — CI decision flowchart (static SVG)
   ============================================================ */
(function(){
  const container = document.getElementById('ciFlowchart');
  if (!container) return;
  container.innerHTML = `
    <div style="display:flex; flex-direction:column; gap:10px; font-size:.85rem;">
      <div style="background:var(--indigo-deep); color:#fff; border-radius:8px; padding:10px 14px;"><b>Is the population variance known?</b></div>
      <div style="display:flex; gap:10px; padding-left:20px;">
        <div style="flex:1; background:var(--paper-dim); border-radius:8px; padding:10px 14px;"><b>Yes →</b> use <span class="mono" style="color:var(--indigo-deep); font-weight:700;">z</span> (Equation: X̄ ± z·σ/√n)</div>
        <div style="flex:1; background:var(--paper-dim); border-radius:8px; padding:10px 14px;"><b>No, but sample is large (n≥30) →</b> use <span class="mono" style="color:var(--amber-deep); font-weight:700;">t</span> (preferred) or <span class="mono">z</span>-alternative</div>
      </div>
      <div style="background:var(--paper-dim); border-radius:8px; padding:10px 14px; margin-left:20px;"><b>No, and sample is small →</b> use <span class="mono" style="color:var(--amber-deep); font-weight:700;">t</span>, only if the population is (approximately) normal. Otherwise, not available.</div>
    </div>
  `;
})();

/* ============================================================
   05b — Universal confidence interval calculator
   ============================================================ */
(function(){
  const meanI = document.getElementById('ciMean'), sigmaI = document.getElementById('ciSigma'),
        nI = document.getElementById('ciN'), confI = document.getElementById('ciConf');
  const result = document.getElementById('ciResult'), steps = document.getElementById('ciSteps');
  if (!meanI) return;
  function type(){ return document.querySelector('input[name="ciType"]:checked').value; }
  function render(){
    const mean = parseFloat(meanI.value), sigma = parseFloat(sigmaI.value), n = parseInt(nI.value,10);
    const conf = parseFloat(confI.value);
    const alpha = 1 - conf/100;
    const se = sigma/Math.sqrt(n);
    let factor, factorLabel;
    const t = type();
    if (t === 'known' || t === 'zalt'){
      factor = normInv(1 - alpha/2);
      factorLabel = `z_{${(alpha/2).toFixed(3)}} = ${factor.toFixed(3)}`;
    } else {
      const df = n-1;
      factor = tInv(alpha/2, df);
      factorLabel = `t_{${(alpha/2).toFixed(3)}}(df=${df}) ≈ ${factor.toFixed(3)}`;
    }
    const E = factor*se;
    const lower = mean - E, upper = mean + E;
    result.textContent = `${conf}% CI: [${fmtP(lower,4)}, ${fmtP(upper,4)}]`;
    steps.textContent = `${factorLabel} · SE = ${fmtP(se,4)} · ${mean} ± ${fmtP(E,4)}`;
  }
  [meanI,sigmaI,nI,confI].forEach(el => el.addEventListener('input', render));
  document.querySelectorAll('input[name="ciType"]').forEach(el => el.addEventListener('change', render));
  render();
})();

/* ============================================================
   06 — Sample size vs CI width chart
   ============================================================ */
(function(){
  const container = document.getElementById('sampleSizeChart');
  const sI = document.getElementById('ssS'), confI = document.getElementById('ssConf');
  if (!container) return;
  function render(){
    const s = parseFloat(sI.value), conf = parseFloat(confI.value);
    const alpha = 1 - conf/100;
    const ns = [10, 20, 30, 50, 100];
    const rows = ns.map(n => {
      const df = n-1;
      const t = tInv(alpha/2, df);
      const se = s/Math.sqrt(n);
      const width = 2*t*se;
      return {n, width};
    });
    const maxWidth = Math.max(...rows.map(r=>r.width));
    container.innerHTML = '';
    rows.forEach(r => {
      const row = document.createElement('div');
      row.style.display='flex'; row.style.alignItems='center'; row.style.gap='10px'; row.style.margin='6px 0';
      const lbl = document.createElement('div');
      lbl.style.width='60px'; lbl.style.fontFamily='var(--font-mono)'; lbl.style.fontSize='.75rem'; lbl.style.color='var(--ink-soft)';
      lbl.textContent = 'n='+r.n;
      const track = document.createElement('div');
      track.style.flex='1'; track.style.background='var(--paper-dim)'; track.style.borderRadius='4px'; track.style.height='20px';
      const bar = document.createElement('div');
      bar.style.height='100%'; bar.style.width=(r.width/maxWidth*100)+'%'; bar.style.background='var(--indigo)'; bar.style.borderRadius='4px';
      track.appendChild(bar);
      const valLbl = document.createElement('div');
      valLbl.style.width='70px'; valLbl.style.fontFamily='var(--font-mono)'; valLbl.style.fontSize='.75rem';
      valLbl.textContent = 'w=' + r.width.toFixed(2);
      row.appendChild(lbl); row.appendChild(track); row.appendChild(valLbl);
      container.appendChild(row);
    });
  }
  [sI,confI].forEach(el => el.addEventListener('input', render));
  render();
})();

/* ============================================================
   08 — Survivorship bias scatter chart (illustrative, Exhibit 9 style)
   ============================================================ */
(function(){
  const container = document.getElementById('survivorshipChart');
  if (!container) return;
  function mulberry32(a){
    return function(){
      let t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  const rnd = mulberry32(7);
  const surviving = [];
  for (let i=0; i<40; i++){
    const pb = rnd()*6 + 0.3;
    const ret = 0.35 - 0.06*pb + (rnd()*2-1)*0.08;
    surviving.push([pb, ret]);
  }
  const failing = [];
  for (let i=0; i<18; i++){
    const pb = rnd()*1.5 + 0.2;
    const ret = -0.25 + (rnd()*2-1)*0.12;
    failing.push([pb, ret]);
  }
  const W=520, H=260, pad=40;
  const allPts = surviving.concat(failing);
  const xs = allPts.map(p=>p[0]), ys = allPts.map(p=>p[1]);
  const xMin=0, xMax=Math.max(...xs)+0.3, yMin=Math.min(...ys)-0.05, yMax=Math.max(...ys)+0.05;
  const xScale = v => pad + (v-xMin)/(xMax-xMin)*(W-2*pad);
  const yScale = v => H-pad - (v-yMin)/(yMax-yMin)*(H-2*pad);
  const svg = svgEl('svg', {viewBox:`0 0 ${W} ${H}`, width:'100%', style:'max-width:560px;'});
  svg.appendChild(svgEl('line', {x1:pad, x2:W-pad, y1:yScale(0), y2:yScale(0), stroke:'#E3DCC9'}));
  svg.appendChild(svgEl('line', {x1:xScale(0), x2:xScale(0), y1:pad, y2:H-pad, stroke:'#E3DCC9'}));
  surviving.forEach(p => svg.appendChild(svgEl('circle', {cx:xScale(p[0]), cy:yScale(p[1]), r:4, fill:'#2F8F6B', 'fill-opacity':0.7})));
  failing.forEach(p => svg.appendChild(svgEl('circle', {cx:xScale(p[0]), cy:yScale(p[1]), r:4, fill:'#D6573F', 'fill-opacity':0.7})));
  // trend line for surviving only (negative slope)
  const x1=0.3, x2=xMax-0.2;
  const y1 = 0.35-0.06*x1, y2 = 0.35-0.06*x2;
  svg.appendChild(svgEl('line', {x1:xScale(x1), x2:xScale(x2), y1:yScale(y1), y2:yScale(y2), stroke:'#2F8F6B', 'stroke-width':2}));
  // trend line for all (flat, dotted)
  const allMeanReturn = allPts.reduce((a,p)=>a+p[1],0)/allPts.length;
  svg.appendChild(svgEl('line', {x1:xScale(xMin), x2:xScale(xMax), y1:yScale(allMeanReturn), y2:yScale(allMeanReturn), stroke:'#1C1B29', 'stroke-width':2, 'stroke-dasharray':'5,4'}));
  const xlabel = svgEl('text', {x:W/2, y:H-8, 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':10, fill:'#4A4763'});
  xlabel.textContent = 'Price-to-Book (P/B)';
  svg.appendChild(xlabel);
  container.innerHTML = '';
  container.appendChild(svg);
  const legend = document.createElement('div');
  legend.style.display='flex'; legend.style.gap='16px'; legend.style.marginTop='8px'; legend.style.fontFamily='var(--font-mono)'; legend.style.fontSize='.72rem'; legend.style.flexWrap='wrap';
  legend.innerHTML = `<span><span style="display:inline-block;width:10px;height:10px;background:#2F8F6B;border-radius:50%;margin-right:5px;"></span>Surviving stocks</span><span><span style="display:inline-block;width:10px;height:10px;background:#D6573F;border-radius:50%;margin-right:5px;"></span>Failing stocks (usually excluded)</span>`;
  container.appendChild(legend);
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
const sectionIds = ['sec-intro','sec-properties','sec-cistructure','sec-ciknown','sec-ciunknown','sec-samplesize','sec-datasnooping','sec-selectionbias','sec-lookahead','sec-quiz'];
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
  try { localStorage.setItem('cfa-progress-sampling', String(pct)); } catch(e) {}
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
    concept: "Point Estimates",
    q: "An analyst wants to know the current average dividend yield of all stocks in an index. She calculates it from the index's current constituents and gets 2.3%. The formula \"sum the yields and divide by the count\" is the:",
    opts: ["Estimate", "Estimator", "Confidence interval"],
    correct: 1,
    exp: "The formula itself — which would give a different result on a different sample — is the estimator. The number 2.3% it produced this time is the estimate."
  },
  {
    concept: "Point Estimates",
    q: "Which branch of statistical inference asks \"what is this parameter's value?\" rather than starting with a specific claimed value to test?",
    opts: ["Hypothesis testing", "Estimation", "Regression analysis"],
    correct: 1,
    exp: "Estimation seeks the best answer to a parameter's value directly, without a starting hypothesis to test."
  },
  {
    concept: "Properties of a Good Estimator",
    q: "An estimator's expected value (the mean of its sampling distribution) exactly equals the population parameter it targets, at every sample size. This estimator is:",
    opts: ["Efficient", "Consistent", "Unbiased"],
    correct: 2,
    exp: "That's the definition of unbiasedness — no systematic over- or under-estimation, regardless of sample size."
  },
  {
    concept: "Properties of a Good Estimator",
    q: "Between two unbiased estimators of the same parameter, the one with the smaller sampling-distribution variance is called the more:",
    opts: ["Consistent estimator", "Efficient estimator", "Biased estimator"],
    correct: 1,
    exp: "Efficiency compares unbiased estimators by how tightly their sampling distributions cluster — smaller variance means more efficient."
  },
  {
    concept: "Properties of a Good Estimator",
    q: "As sample size approaches infinity, a consistent estimator's sampling distribution:",
    opts: ["Becomes more spread out", "Concentrates on the true parameter value", "Becomes skewed"],
    correct: 1,
    exp: "Consistency means the estimator's standard error shrinks toward zero and its distribution collapses onto the true value as n grows."
  },
  {
    concept: "Structure & Interpretation",
    q: "The structure of every confidence interval in this reading is:",
    opts: ["Point estimate × Reliability factor ÷ Standard error", "Point estimate ± Reliability factor × Standard error", "Reliability factor ± Point estimate × Standard error"],
    correct: 1,
    exp: "Point estimate ± Reliability factor × Standard error is the universal structure for every confidence interval covered."
  },
  {
    concept: "Known Population Variance",
    q: "Sampling from a normal distribution with known σ=30, a sample of n=225 has X̄=100. What is the 95% confidence interval?",
    opts: ["[96.08, 103.92]", "[94.00, 106.00]", "[98.04, 101.96]"],
    correct: 0,
    exp: "SE = 30/√225 = 2. CI = 100 ± 1.96(2) = 100 ± 3.92 = [96.08, 103.92]."
  },
  {
    concept: "Known Population Variance",
    q: "The reliability factor for a 99% confidence interval based on the standard normal distribution is approximately:",
    opts: ["1.65", "1.96", "2.58"],
    correct: 2,
    exp: "z₀.₀₀₅ = 2.58 leaves 0.5% in each tail, totaling 1% outside the interval — matching a 99% confidence level."
  },
  {
    concept: "Unknown Population Variance",
    q: "A sample of n=40 has an unknown population variance, but the sample is large. Which statistic is theoretically most conservative (widest interval) for the confidence interval?",
    opts: ["z", "t", "Both give identical results always"],
    correct: 1,
    exp: "The t-distribution has fatter tails than the normal, so its reliability factor is larger, producing a wider, more conservative interval — even in large samples where z would be technically acceptable."
  },
  {
    concept: "Unknown Population Variance",
    q: "Why is it acceptable to use a z reliability factor with an unknown population variance, as long as the sample is large?",
    opts: ["Because s always equals σ in large samples", "Because of the central limit theorem, which makes X̄'s sampling distribution approximately normal regardless of the population's shape", "Because large samples have no sampling error"],
    correct: 1,
    exp: "The CLT guarantees that with a large enough sample, the sampling distribution of the mean is approximately normal, justifying the z-based approach even without knowing the population's true shape."
  },
  {
    concept: "Unknown Population Variance",
    q: "A sample has n=12, drawn from a population whose distribution shape is unknown and whose variance is unknown. What is the correct approach?",
    opts: ["Use z, since it's always safe", "Use t with df=11", "Neither z nor t is theoretically available"],
    correct: 2,
    exp: "With a small sample from a population that hasn't been confirmed normal, and unknown variance, neither the CLT (needs large n) nor the small-sample t-distribution (needs population normality) is justified."
  },
  {
    concept: "Structure & Interpretation",
    q: "Holding sample size and standard deviation constant, what happens to a confidence interval's width if the desired confidence level rises from 90% to 99%?",
    opts: ["It narrows", "It widens", "It is unaffected"],
    correct: 1,
    exp: "A higher confidence level requires a larger reliability factor, producing a wider interval — greater confidence trades off against precision."
  },
  {
    concept: "Selecting Sample Size",
    q: "The standard error of the sample mean is given by:",
    opts: ["s × √n", "s / √n", "s² / n"],
    correct: 1,
    exp: "Standard error of the mean = sample standard deviation divided by the square root of sample size, s/√n."
  },
  {
    concept: "Selecting Sample Size",
    q: "If sample size increases from n to 9n, the standard error of the mean approximately:",
    opts: ["Falls to 1/3 of its original value", "Falls to 1/9 of its original value", "Triples"],
    correct: 0,
    exp: "Standard error scales with 1/√n; √9 = 3, so the standard error falls to 1/3 of its original value."
  },
  {
    concept: "Data Snooping Bias",
    q: "A research team tests hundreds of variables on the same historical dataset and reports only the handful that turned out statistically significant, without mentioning the rest. This is a textbook case of:",
    opts: ["Look-ahead bias", "Data snooping bias", "Time-period bias"],
    correct: 1,
    exp: "Repeatedly mining the same dataset and reporting only the 'winning' results — without disclosing the many failed attempts — is the definition of data snooping bias."
  },
  {
    concept: "Data Snooping Bias",
    q: "Which phrase, if found in a research paper describing how a variable was chosen, is a classic warning sign of data mining?",
    opts: ["\"We formed this hypothesis based on economic theory before testing it\"", "\"We noticed that this variable seemed to predict returns\"", "\"We tested this hypothesis on an out-of-sample dataset\""],
    correct: 1,
    exp: "\"We noticed that…\" hints the variable was found by searching the data after the fact, rather than being specified by theory beforehand — the \"too much digging\" warning sign."
  },
  {
    concept: "Sample Selection & Survivorship",
    q: "A database of hedge funds only includes funds that are still operating and voluntarily choose to report their performance. This combination is most likely to cause:",
    opts: ["Look-ahead bias only", "Survivorship bias and self-selection bias", "Time-period bias only"],
    correct: 1,
    exp: "Funds that closed are excluded (survivorship bias), and funds with poor records may simply choose not to report (self-selection bias) — both inflate the apparent average performance."
  },
  {
    concept: "Look-Ahead & Time-Period Bias",
    q: "A backtest uses a company's Q4 book value, dated December 31st, to rank stocks as of December 31st — even though that book value wasn't publicly released until mid-February. This is:",
    opts: ["Survivorship bias", "Look-ahead bias", "Data snooping bias"],
    correct: 1,
    exp: "Using information before it was actually available to real investors on that date is the definition of look-ahead bias."
  },
  {
    concept: "Look-Ahead & Time-Period Bias",
    q: "What is the recommended fix for look-ahead bias when using fundamental data in a backtest?",
    opts: ["Use point-in-time (PIT) data, stamped with its actual public release date", "Use a longer sample period", "Use the z-alternative instead of the t-distribution"],
    correct: 0,
    exp: "Point-in-time data is tagged with the date it actually became available, ensuring a backtest only uses information a real investor could have had at that time."
  },
  {
    concept: "Look-Ahead & Time-Period Bias",
    q: "A study covers a 40-year period that includes both a low-volatility regime and a high-volatility regime, blended into one dataset without accounting for the shift. This is most likely an example of:",
    opts: ["Time-period bias", "Sample selection bias", "Data snooping bias"],
    correct: 0,
    exp: "Spanning a structural regime change without accounting for it blends two genuinely different return distributions into one potentially misleading result — the essence of time-period bias."
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
          cfaRecordAnswer(item.concept, "Sampling & Estimation", i === item.correct);
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
