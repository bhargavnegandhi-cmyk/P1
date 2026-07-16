// ============================================================
// Basics of Hypothesis Testing — interactivity
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
function normInv(p){
  let lo=-8, hi=8;
  for (let i=0;i<80;i++){ const mid=(lo+hi)/2; if (normCDF(mid)<p) lo=mid; else hi=mid; }
  return (lo+hi)/2;
}
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
// Numerically stable log(Gamma(z)) — avoids overflow for large z (e.g. large degrees of freedom)
function lnGamma(z){
  const g = 7;
  const c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
  if (z < 0.5) return Math.log(Math.PI / Math.sin(Math.PI*z)) - lnGamma(1-z);
  z -= 1;
  let x = c[0];
  for (let i=1; i<g+2; i++) x += c[i]/(z+i);
  const t = z + g + 0.5;
  return 0.5*Math.log(2*Math.PI) + (z+0.5)*Math.log(t) - t + Math.log(x);
}
function tPDF(x, df){
  const lnCoef = lnGamma((df+1)/2) - lnGamma(df/2) - 0.5*Math.log(df*Math.PI);
  const lnShape = -(df+1)/2 * Math.log(1 + (x*x)/df);
  return Math.exp(lnCoef + lnShape);
}
function simpsonIntegrate(f, a, b, n){
  if (n % 2 === 1) n++;
  const h = (b-a)/n;
  let sum = f(a) + f(b);
  for (let i=1; i<n; i++){
    sum += f(a+i*h) * (i%2===0 ? 2 : 4);
  }
  return (h/3)*sum;
}
function tRightTail(x, df){
  return simpsonIntegrate(t => tPDF(t, df), x, x+60, 2000);
}
function tInv(alpha, df){
  let lo=0, hi=60;
  for (let i=0;i<60;i++){ const mid=(lo+hi)/2; if (tRightTail(mid,df) > alpha) lo=mid; else hi=mid; }
  return (lo+hi)/2;
}
function chiSqPDF(x, k){
  if (x <= 0) return 0;
  const lnCoef = (k/2 - 1)*Math.log(x) - x/2 - (k/2)*Math.log(2) - lnGamma(k/2);
  return Math.exp(lnCoef);
}
function chiSqRightTail(x, k){
  const upper = Math.max(x + 10*Math.sqrt(2*k) + 50, x+100);
  return simpsonIntegrate(t => chiSqPDF(t, k), x, upper, 3000);
}
// Inverse chi-square: find x such that right-tail area = p (i.e., x is the (1-p) quantile)
function chiSqInv(p, k){
  let lo = 1e-6, hi = k*20 + 200;
  for (let i=0;i<80;i++){
    const mid=(lo+hi)/2;
    if (chiSqRightTail(mid,k) > p) lo=mid; else hi=mid;
  }
  return (lo+hi)/2;
}
// F-distribution pdf via Beta function (Beta(a,b) = gamma(a)gamma(b)/gamma(a+b))
function fPDF(x, d1, d2){
  if (x <= 0) return 0;
  const lnBeta = lnGamma(d1/2) + lnGamma(d2/2) - lnGamma((d1+d2)/2);
  const lnNum = 0.5*(d1*Math.log(d1*x) + d2*Math.log(d2) - (d1+d2)*Math.log(d1*x+d2));
  return Math.exp(lnNum - Math.log(x) - lnBeta);
}
function fRightTail(x, d1, d2){
  const upper = Math.max(x*8 + 50, 200);
  return simpsonIntegrate(t => fPDF(t, d1, d2), x, upper, 3000);
}
function fInv(p, d1, d2){
  let lo = 1e-6, hi = 80;
  for (let i=0;i<80;i++){
    const mid=(lo+hi)/2;
    if (fRightTail(mid,d1,d2) > p) lo=mid; else hi=mid;
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
   01 — Sampling distribution histogram (illustrative, seeded)
   ============================================================ */
(function(){
  const container = document.getElementById('samplingDistChart');
  if (!container) return;
  function mulberry32(a){
    return function(){
      let t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  const rnd = mulberry32(123);
  // simulate 100 sample means of n=30 draws from N(6,2^2)
  function randNorm(){
    const u1 = rnd(), u2 = rnd();
    return Math.sqrt(-2*Math.log(u1)) * Math.cos(2*Math.PI*u2);
  }
  const means = [];
  for (let s=0; s<100; s++){
    let sum=0;
    for (let i=0;i<30;i++) sum += 6 + 2*randNorm();
    means.push(sum/30);
  }
  const min = Math.min(...means), max = Math.max(...means);
  const binCount = 11;
  const width = (max-min)/binCount;
  const bins = new Array(binCount).fill(0);
  means.forEach(m => {
    let idx = Math.floor((m-min)/width);
    if (idx >= binCount) idx = binCount-1;
    bins[idx]++;
  });
  const maxBin = Math.max(...bins);
  const wrap = document.createElement('div');
  wrap.style.display='flex'; wrap.style.gap='3px'; wrap.style.alignItems='flex-end'; wrap.style.height='110px';
  bins.forEach((count,i) => {
    const col = document.createElement('div');
    col.style.flex='1'; col.style.display='flex'; col.style.flexDirection='column'; col.style.alignItems='center'; col.style.justifyContent='flex-end'; col.style.height='100%';
    const bar = document.createElement('div');
    bar.style.width='100%'; bar.style.height=Math.max(2,(count/maxBin*85))+'px'; bar.style.background='var(--indigo)'; bar.style.borderRadius='2px 2px 0 0';
    col.appendChild(bar);
    const lbl = document.createElement('div');
    lbl.style.fontFamily='var(--font-mono)'; lbl.style.fontSize='.58rem'; lbl.style.marginTop='4px'; lbl.style.color='var(--ink-soft)'; lbl.style.transform='rotate(-45deg)'; lbl.style.whiteSpace='nowrap';
    lbl.textContent = (min+i*width).toFixed(2);
    col.appendChild(lbl);
    wrap.appendChild(col);
  });
  container.appendChild(wrap);
})();

/* ============================================================
   04 — Error matrix interactive
   ============================================================ */
(function(){
  const matrix = document.getElementById('errMatrix');
  const explain = document.getElementById('errExplain');
  if (!matrix) return;
  const info = {
    correct1: {title:"Correct decision", text:"You failed to reject a true null hypothesis — the right call. This happens with probability 1−α, the confidence level."},
    type2: {title:"Type II error (β)", text:"You failed to reject a false null hypothesis — a missed detection, a false negative. Its probability is denoted β."},
    type1: {title:"Type I error (α)", text:"You rejected a true null hypothesis — a false alarm, a false positive. Its probability is exactly the significance level, α."},
    correct2: {title:"Correct decision (power)", text:"You correctly rejected a false null hypothesis. This probability, 1−β, is called the power of the test."}
  };
  matrix.querySelectorAll('.cell').forEach(cell => {
    cell.addEventListener('click', () => {
      matrix.querySelectorAll('.cell').forEach(c => c.classList.remove('correct','error'));
      const key = cell.dataset.outcome;
      if (key === 'correct1' || key === 'correct2') cell.classList.add('correct');
      else cell.classList.add('error');
      const info_ = info[key];
      explain.innerHTML = `<strong>${info_.title}:</strong> ${info_.text}`;
      explain.style.display = 'block';
    });
  });
})();

/* ============================================================
   05 — Rejection region chart (two/right/left tabs)
   ============================================================ */
(function(){
  const container = document.getElementById('rejectionRegionChart');
  const tabs = document.getElementById('rejectionTabs');
  if (!container) return;
  function render(side){
    const W=520, H=210, padL=24, padR=24, padT=14, padB=24;
    const domainMin=-4, domainMax=4;
    const xScale = v => padL + (v-domainMin)/(domainMax-domainMin)*(W-padL-padR);
    const maxPdf = normPDF(0);
    const yScale = v => (H-padB) - (v/maxPdf)*(H-padT-padB);
    const svg = svgEl('svg', {viewBox:`0 0 ${W} ${H}`, width:'100%', class:'dist-svg', style:'max-width:560px;'});
    svg.appendChild(svgEl('line', {x1:padL, x2:W-padR, y1:H-padB, y2:H-padB, stroke:'#E3DCC9'}));
    let z1, z2;
    if (side === 'two'){ z1=-1.96; z2=1.96; }
    else if (side === 'right'){ z1=null; z2=1.645; }
    else { z1=-1.645; z2=null; }
    // shaded rejection regions
    function shadeRegion(from, to){
      let d = `M${xScale(from)},${H-padB} `;
      for (let x=from; x<=to; x+=0.05) d += `L${xScale(x)},${yScale(normPDF(x))} `;
      d += `L${xScale(to)},${H-padB} Z`;
      svg.appendChild(svgEl('path', {d, fill:'#D6573F', 'fill-opacity':0.4}));
    }
    if (z1 !== null) shadeRegion(domainMin, z1);
    if (z2 !== null) shadeRegion(z2, domainMax);
    let d = '';
    for (let x=domainMin; x<=domainMax; x+=0.05){
      const px=xScale(x), py=yScale(normPDF(x));
      d += (x===domainMin?'M':'L')+px+','+py+' ';
    }
    svg.appendChild(svgEl('path', {d, fill:'none', stroke:'#2B2560', 'stroke-width':2}));
    [z1,z2].forEach(z => {
      if (z===null) return;
      svg.appendChild(svgEl('line', {x1:xScale(z), x2:xScale(z), y1:padT, y2:H-padB, stroke:'#C77F1E', 'stroke-width':1.5, 'stroke-dasharray':'3,2'}));
      const t = svgEl('text', {x:xScale(z), y:padT-2, 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':10, fill:'#C77F1E', 'font-weight':'700'});
      t.textContent = z.toFixed(3);
      svg.appendChild(t);
    });
    const label = svgEl('text', {x:W/2, y:H-6, 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':10, fill:'#4A4763'});
    label.textContent = side==='two' ? 'Reject in both tails (2.5% each)' : side==='right' ? 'Reject in right tail only (5%)' : 'Reject in left tail only (5%)';
    svg.appendChild(label);
    container.innerHTML = '';
    container.appendChild(svg);
  }
  tabs.querySelectorAll('.test-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.querySelectorAll('.test-tab').forEach(t=>t.classList.remove('active'));
      tab.classList.add('active');
      render(tab.dataset.side);
    });
  });
  render('two');
})();

/* ============================================================
   07 — p-value chart & calculator
   ============================================================ */
(function(){
  const container = document.getElementById('pvalueChart');
  const zI = document.getElementById('pvZ');
  const result = document.getElementById('pvResult');
  if (!container) return;
  function render(){
    const z = parseFloat(zI.value);
    const absZ = Math.abs(z);
    const p = 2*(1-normCDF(absZ));
    result.textContent = `p-value = ${(p*100).toFixed(2)}%`;

    const W=520, H=200, padL=24, padR=24, padT=14, padB=24;
    const domainMin=-4, domainMax=4;
    const xScale = v => padL + (v-domainMin)/(domainMax-domainMin)*(W-padL-padR);
    const maxPdf = normPDF(0);
    const yScale = v => (H-padB) - (v/maxPdf)*(H-padT-padB);
    const svg = svgEl('svg', {viewBox:`0 0 ${W} ${H}`, width:'100%', class:'dist-svg', style:'max-width:560px;'});
    svg.appendChild(svgEl('line', {x1:padL, x2:W-padR, y1:H-padB, y2:H-padB, stroke:'#E3DCC9'}));
    function shadeRegion(from, to, color, opacity){
      let d = `M${xScale(from)},${H-padB} `;
      for (let x=from; x<=to; x+=0.05) d += `L${xScale(x)},${yScale(normPDF(x))} `;
      d += `L${xScale(to)},${H-padB} Z`;
      svg.appendChild(svgEl('path', {d, fill:color, 'fill-opacity':opacity}));
    }
    // alpha=5% region (fixed reference, light)
    shadeRegion(domainMin, -1.96, '#2B2560', 0.18);
    shadeRegion(1.96, domainMax, '#2B2560', 0.18);
    // p-value region (calculated z, darker overlay)
    shadeRegion(domainMin, -absZ, '#D6573F', 0.5);
    shadeRegion(absZ, domainMax, '#D6573F', 0.5);
    let d = '';
    for (let x=domainMin; x<=domainMax; x+=0.05){
      const px=xScale(x), py=yScale(normPDF(x));
      d += (x===domainMin?'M':'L')+px+','+py+' ';
    }
    svg.appendChild(svgEl('path', {d, fill:'none', stroke:'#2B2560', 'stroke-width':2}));
    [-absZ, absZ].forEach(v => {
      svg.appendChild(svgEl('line', {x1:xScale(v), x2:xScale(v), y1:padT, y2:H-padB, stroke:'#8a2f1c', 'stroke-width':1.5}));
    });
    container.innerHTML = '';
    container.appendChild(svg);
    const legend = document.createElement('div');
    legend.style.display='flex'; legend.style.gap='14px'; legend.style.marginTop='6px'; legend.style.fontFamily='var(--font-mono)'; legend.style.fontSize='.7rem'; legend.style.flexWrap='wrap';
    legend.innerHTML = `<span><span style="display:inline-block;width:10px;height:10px;background:#2B2560;opacity:.4;border-radius:2px;margin-right:5px;"></span>α=5% region (±1.96)</span><span><span style="display:inline-block;width:10px;height:10px;background:#D6573F;opacity:.6;border-radius:2px;margin-right:5px;"></span>p-value region (±${absZ.toFixed(2)})</span>`;
    container.appendChild(legend);
  }
  zI.addEventListener('input', render);
  render();
})();

/* ============================================================
   09 — Single mean test calculator
   ============================================================ */
(function(){
  const meanI=document.getElementById('smMean'), mu0I=document.getElementById('smMu0'),
        sI=document.getElementById('smS'), nI=document.getElementById('smN'), alphaI=document.getElementById('smAlpha');
  const steps=document.getElementById('smSteps'), decision=document.getElementById('smDecision');
  if (!meanI) return;
  function side(){ return document.querySelector('input[name="smSide"]:checked').value; }
  function render(){
    const mean=parseFloat(meanI.value), mu0=parseFloat(mu0I.value), s=parseFloat(sI.value), n=parseInt(nI.value,10);
    const alpha=parseFloat(alphaI.value)/100;
    const df = n-1;
    const se = s/Math.sqrt(n);
    const t = (mean-mu0)/se;
    const sd = side();
    let reject, critText;
    if (sd === 'two'){
      const crit = tInv(alpha/2, df);
      reject = Math.abs(t) > crit;
      critText = `±${crit.toFixed(3)}`;
    } else if (sd === 'right'){
      const crit = tInv(alpha, df);
      reject = t > crit;
      critText = `${crit.toFixed(3)} (right)`;
    } else {
      const crit = tInv(alpha, df);
      reject = t < -crit;
      critText = `−${crit.toFixed(3)} (left)`;
    }
    steps.textContent = `t = (${mean}−${mu0})/(${s}/√${n}) = ${fmtP(t,3)} · df=${df} · critical ${critText}`;
    decision.textContent = reject ? 'REJECT the null' : 'FAIL TO REJECT the null';
    decision.className = 'decision-banner ' + (reject ? 'reject' : 'fail');
  }
  [meanI,mu0I,sI,nI,alphaI].forEach(el => el.addEventListener('input', render));
  document.querySelectorAll('input[name="smSide"]').forEach(el => el.addEventListener('change', render));
  render();
})();

/* ============================================================
   10 — Independent samples t-test calculator
   ============================================================ */
(function(){
  const m1I=document.getElementById('imMean1'), s1I=document.getElementById('imS1'), n1I=document.getElementById('imN1'),
        m2I=document.getElementById('imMean2'), s2I=document.getElementById('imS2'), n2I=document.getElementById('imN2'),
        alphaI=document.getElementById('imAlpha');
  const steps=document.getElementById('imSteps'), decision=document.getElementById('imDecision');
  if (!m1I) return;
  function render(){
    const m1=parseFloat(m1I.value), s1=parseFloat(s1I.value), n1=parseInt(n1I.value,10);
    const m2=parseFloat(m2I.value), s2=parseFloat(s2I.value), n2=parseInt(n2I.value,10);
    const alpha=parseFloat(alphaI.value)/100;
    const df = n1+n2-2;
    const sp2 = ((n1-1)*s1*s1 + (n2-1)*s2*s2) / df;
    const se = Math.sqrt(sp2/n1 + sp2/n2);
    const t = (m1-m2)/se;
    const crit = tInv(alpha/2, df);
    const reject = Math.abs(t) > crit;
    steps.textContent = `s²ₚ=${fmtP(sp2,4)} · t=${fmtP(t,3)} · df=${df} · critical ±${crit.toFixed(3)}`;
    decision.textContent = reject ? 'REJECT the null' : 'FAIL TO REJECT the null';
    decision.className = 'decision-banner ' + (reject ? 'reject' : 'fail');
  }
  [m1I,s1I,n1I,m2I,s2I,n2I,alphaI].forEach(el => el.addEventListener('input', render));
  render();
})();

/* ============================================================
   11 — Paired samples t-test calculator
   ============================================================ */
(function(){
  const dbarI=document.getElementById('pmDbar'), sdI=document.getElementById('pmSd'),
        nI=document.getElementById('pmN'), mu0I=document.getElementById('pmMu0'), alphaI=document.getElementById('pmAlpha');
  const steps=document.getElementById('pmSteps'), decision=document.getElementById('pmDecision');
  if (!dbarI) return;
  function render(){
    const dbar=parseFloat(dbarI.value), sd=parseFloat(sdI.value), n=parseInt(nI.value,10);
    const mu0=parseFloat(mu0I.value), alpha=parseFloat(alphaI.value)/100;
    const df = n-1;
    const sdbar = sd/Math.sqrt(n);
    const t = (dbar-mu0)/sdbar;
    const crit = tInv(alpha/2, df);
    const reject = Math.abs(t) > crit;
    steps.textContent = `s_d̄=${fmtP(sdbar,3)} · t=${fmtP(t,3)} · df=${df} · critical ±${crit.toFixed(3)}`;
    decision.textContent = reject ? 'REJECT the null' : 'FAIL TO REJECT the null';
    decision.className = 'decision-banner ' + (reject ? 'reject' : 'fail');
  }
  [dbarI,sdI,nI,mu0I,alphaI].forEach(el => el.addEventListener('input', render));
  render();
})();

/* ============================================================
   12 — Variance tests: chi-square & F, with tab toggle
   ============================================================ */
(function(){
  const varTabs = document.getElementById('varTabs');
  const chisqPanel = document.getElementById('chisqPanel'), fPanel = document.getElementById('fPanel');
  if (!varTabs) return;

  // chi-square
  const csS=document.getElementById('csS'), csSigma0=document.getElementById('csSigma0'),
        csN=document.getElementById('csN'), csAlpha=document.getElementById('csAlpha');
  const csSteps=document.getElementById('csSteps'), csDecision=document.getElementById('csDecision');
  function renderChiSq(){
    const s=parseFloat(csS.value), sigma0=parseFloat(csSigma0.value), n=parseInt(csN.value,10);
    const alpha=parseFloat(csAlpha.value)/100;
    const df = n-1;
    const chi2 = df*(s*s)/(sigma0*sigma0);
    const lower = chiSqInv(1-alpha/2, df);
    const upper = chiSqInv(alpha/2, df);
    const reject = chi2 < lower || chi2 > upper;
    csSteps.textContent = `χ² = ${df}(${s}²)/${sigma0}² = ${fmtP(chi2,3)} · df=${df} · critical [${lower.toFixed(3)}, ${upper.toFixed(3)}]`;
    csDecision.textContent = reject ? 'REJECT the null' : 'FAIL TO REJECT the null';
    csDecision.className = 'decision-banner ' + (reject ? 'reject' : 'fail');
  }
  [csS,csSigma0,csN,csAlpha].forEach(el => el.addEventListener('input', renderChiSq));
  renderChiSq();

  // F-test
  const fS1=document.getElementById('fS1'), fN1=document.getElementById('fN1'),
        fS2=document.getElementById('fS2'), fN2=document.getElementById('fN2'), fAlpha=document.getElementById('fAlpha');
  const fSteps=document.getElementById('fSteps'), fDecision=document.getElementById('fDecision');
  function renderF(){
    const s1=parseFloat(fS1.value), n1=parseInt(fN1.value,10);
    const s2=parseFloat(fS2.value), n2=parseInt(fN2.value,10);
    const alpha=parseFloat(fAlpha.value)/100;
    const df1=n1-1, df2=n2-1;
    const F = (s1*s1)/(s2*s2);
    const upper = fInv(alpha/2, df1, df2);
    const lower = fInv(1-alpha/2, df1, df2);
    const reject = F < lower || F > upper;
    fSteps.textContent = `F = ${s1}²/${s2}² = ${fmtP(F,3)} · df=(${df1},${df2}) · critical [${lower.toFixed(3)}, ${upper.toFixed(3)}]`;
    fDecision.textContent = reject ? 'REJECT the null' : 'FAIL TO REJECT the null';
    fDecision.className = 'decision-banner ' + (reject ? 'reject' : 'fail');
  }
  [fS1,fN1,fS2,fN2,fAlpha].forEach(el => el.addEventListener('input', renderF));
  renderF();

  varTabs.querySelectorAll('.test-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      varTabs.querySelectorAll('.test-tab').forEach(t=>t.classList.remove('active'));
      tab.classList.add('active');
      if (tab.dataset.vartest === 'chisq'){ chisqPanel.style.display=''; fPanel.style.display='none'; }
      else { chisqPanel.style.display='none'; fPanel.style.display=''; }
    });
  });
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
const sectionIds = ['sec-intro','sec-process','sec-teststat','sec-significance','sec-decisionrule','sec-economic','sec-pvalue','sec-multiple','sec-singlemean','sec-indepmeans','sec-pairedmeans','sec-variance','sec-quiz'];
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
  try { localStorage.setItem('cfa-progress-hypothesis-testing', String(pct)); } catch(e) {}
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
    concept: "Stating the Hypotheses",
    q: "Which statement about the null and alternative hypotheses is correct?",
    opts: ["The null hypothesis is what the researcher hopes to find evidence for", "The null hypothesis is what the researcher is trying to reject", "The alternative hypothesis always contains the equality sign"],
    correct: 1,
    exp: "The null hypothesis is the default claim, assumed true unless the sample provides strong evidence against it — it's what a researcher is typically hoping to reject in favor of the alternative."
  },
  {
    concept: "Stating the Hypotheses",
    q: "H₀: μ ≤ 4 versus Hₐ: μ > 4 is an example of a:",
    opts: ["Two-sided test", "One-sided (right) test", "One-sided (left) test"],
    correct: 1,
    exp: "The alternative hypothesis specifies \"greater than,\" with rejection occurring in the right tail — a one-sided (right) test."
  },
  {
    concept: "Test Statistics",
    q: "Which distribution does the test statistic for a single population mean (unknown variance) follow?",
    opts: ["Standard normal", "t-distribution with n−1 degrees of freedom", "Chi-square distribution"],
    correct: 1,
    exp: "With unknown population variance, the theoretically correct test statistic for a single mean is t-distributed with n−1 degrees of freedom."
  },
  {
    concept: "Significance, Type I/II Errors & Power",
    q: "A Type I error occurs when:",
    opts: ["A true null hypothesis is rejected", "A false null hypothesis is not rejected", "A true null hypothesis is not rejected"],
    correct: 0,
    exp: "A Type I error is a false positive — incorrectly rejecting a null hypothesis that is actually true."
  },
  {
    concept: "Significance, Type I/II Errors & Power",
    q: "The power of a test is defined as:",
    opts: ["The probability of a Type I error", "The probability of correctly rejecting a false null hypothesis", "The probability of failing to reject a true null hypothesis"],
    correct: 1,
    exp: "Power = 1 − β, the probability of correctly rejecting a false null hypothesis — catching a real effect when it exists."
  },
  {
    concept: "Significance, Type I/II Errors & Power",
    q: "All else equal, decreasing the significance level (α) from 5% to 1%:",
    opts: ["Decreases the probability of a Type II error", "Increases the probability of a Type II error", "Has no effect on Type II error probability"],
    correct: 1,
    exp: "A stricter α makes Type I errors rarer but mechanically raises the probability of a Type II error, since the null is rejected less often overall."
  },
  {
    concept: "Decision Rules & Critical Values",
    q: "For a two-sided test at the 5% significance level using a z-distributed test statistic, the critical values are approximately:",
    opts: ["±1.645", "±1.960", "±2.576"],
    correct: 1,
    exp: "A 5% two-sided test splits α equally between both tails (2.5% each), giving critical values of ±1.960."
  },
  {
    concept: "Decision Rules & Critical Values",
    q: "Testing H₀: μ = 50 at the 95% confidence level, the sample's 95% confidence interval is [48.2, 49.9]. What is the decision?",
    opts: ["Reject the null", "Fail to reject the null", "Cannot be determined"],
    correct: 0,
    exp: "The hypothesized value 50 falls outside the confidence interval [48.2, 49.9], so the null is rejected — the two approaches always agree."
  },
  {
    concept: "Statistical vs. Economic Significance",
    q: "A trading strategy's mean return is statistically significantly different from zero, but the estimated edge is smaller than the strategy's transaction costs. This result is:",
    opts: ["Statistically significant and economically significant", "Statistically significant but not economically significant", "Neither statistically nor economically significant"],
    correct: 1,
    exp: "Clearing the statistical bar doesn't guarantee economic value — if the edge doesn't cover real-world costs like transaction costs, it isn't economically significant."
  },
  {
    concept: "The Role of p-Values",
    q: "The p-value of a hypothesis test is best described as:",
    opts: ["The probability the null hypothesis is true", "The smallest level of significance at which the null hypothesis can be rejected", "The confidence level of the test"],
    correct: 1,
    exp: "The p-value is the area beyond the calculated test statistic — equivalently, the smallest α at which you'd still reject the null."
  },
  {
    concept: "The Role of p-Values",
    q: "A two-sided test produces a calculated z-statistic of 2.05. Approximately what is the p-value?",
    opts: ["About 2%", "About 4%", "About 10%"],
    correct: 1,
    exp: "P(Z > 2.05) ≈ 2.0%, doubled for a two-sided test gives a p-value of roughly 4%."
  },
  {
    concept: "Multiple Testing",
    q: "A researcher runs 200 independent hypothesis tests at a 5% significance level, and every null hypothesis happens to be true. About how many statistically significant results should she expect purely by chance?",
    opts: ["0", "10", "50"],
    correct: 1,
    exp: "200 × 0.05 = 10 expected false positives purely from the multiple testing problem, even with every null hypothesis true."
  },
  {
    concept: "Multiple Testing",
    q: "The Benjamini-Hochberg procedure addresses which specific problem?",
    opts: ["Non-normal data in small samples", "Inflated false-positive rates from running many hypothesis tests", "Unequal variances between two samples"],
    correct: 1,
    exp: "The BH correction adjusts the significance threshold applied to each test in a batch, controlling the false discovery rate that arises from running many tests."
  },
  {
    concept: "A Single Mean",
    q: "Testing H₀: μ = 6 vs. Hₐ: μ ≠ 6 with n=33, X̄=5.299%, s=1.4284%, the calculated t-statistic is approximately:",
    opts: ["−2.819", "−0.701", "5.299"],
    correct: 0,
    exp: "t = (5.299−6)/(1.4284/√33) = −0.701/0.2487 ≈ −2.819."
  },
  {
    concept: "Difference in Means — Independent",
    q: "When testing the difference between two independent sample means (assuming equal variances), the pooled variance is:",
    opts: ["A simple average of the two sample variances", "A weighted average of the two sample variances, weighted by each sample's degrees of freedom", "The larger of the two sample variances"],
    correct: 1,
    exp: "The pooled variance formula weights each sample's variance by (nᵢ−1), its degrees of freedom, before combining them."
  },
  {
    concept: "Difference in Means — Paired",
    q: "Two portfolio managers' monthly returns are measured over the exact same 36 months and share the same underlying market risk factors. The appropriate test for comparing their means is:",
    opts: ["The independent-samples t-test", "The paired (dependent-samples) t-test", "The chi-square test"],
    correct: 1,
    exp: "Because both return series share the same time periods and risk exposures, they are dependent — the paired t-test correctly accounts for that shared variation and is more powerful as a result."
  },
  {
    concept: "Tests of Variance",
    q: "A test of a single population variance uses which test statistic and distribution?",
    opts: ["(n−1)s²/σ₀², chi-square distributed", "s₁²/s₂², F-distributed", "(X̄−μ₀)/(s/√n), t-distributed"],
    correct: 0,
    exp: "A test concerning a single variance uses χ² = (n−1)s²/σ₀², which follows a chi-square distribution with n−1 degrees of freedom."
  },
  {
    concept: "Tests of Variance",
    q: "Why can't the two-sided critical values for a chi-square test simply be written as ± some number?",
    opts: ["Because chi-square tests are always one-sided", "Because the chi-square distribution is asymmetric and bounded below by zero", "Because degrees of freedom must be equal on both sides"],
    correct: 1,
    exp: "The chi-square distribution's asymmetry and lower bound of zero mean the two tails require two distinct, differently-valued critical values rather than a mirrored ± pair."
  },
  {
    concept: "Tests of Variance",
    q: "An F-test comparing the variances of two independent samples, with n₁=25 and n₂=40, has how many degrees of freedom?",
    opts: ["24 and 39", "25 and 40", "63"],
    correct: 0,
    exp: "The F-distribution's degrees of freedom are (n₁−1) and (n₂−1) — the divisors used to compute each sample's variance — giving 24 and 39 here."
  },
  {
    concept: "Tests of Variance",
    q: "Comparing Investment One (s=1.4284%) and Investment Two (s=2.5914%), each with n=33, the calculated F-statistic (larger variance in the numerator) is approximately:",
    opts: ["1.81", "3.29", "0.30"],
    correct: 1,
    exp: "F = (2.5914)²/(1.4284)² = 6.7153/2.0403 ≈ 3.29, indicating a meaningfully larger variance for Investment Two."
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
          cfaRecordAnswer(item.concept, "Hypothesis Testing", i === item.correct);
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
