// ============================================================
// Common Probability Distributions — interactivity
// ============================================================

/* ---------- math helpers ---------- */
function factorial(n){
  n = Math.round(n);
  if (n < 0) return NaN;
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}
function combination(n, x){
  if (x < 0 || x > n) return 0;
  return factorial(n) / (factorial(n-x) * factorial(x));
}
function binomialPMF(n, p, x){
  return combination(n, x) * Math.pow(p, x) * Math.pow(1-p, n-x);
}
// Standard normal CDF via Abramowitz & Stegun 7.1.26 approximation (erf-based)
function erf(x){
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);
  const a1=0.254829592, a2=-0.284496736, a3=1.421413741, a4=-1.453152027, a5=1.061405429, p=0.3275911;
  const t = 1/(1+p*x);
  const y = 1 - (((((a5*t+a4)*t)+a3)*t+a2)*t+a1)*t*Math.exp(-x*x);
  return sign*y;
}
function normCDF(z){
  return 0.5 * (1 + erf(z/Math.sqrt(2)));
}
function normPDF(x, mu=0, sigma=1){
  return Math.exp(-0.5*Math.pow((x-mu)/sigma,2)) / (sigma*Math.sqrt(2*Math.PI));
}
// Lanczos approximation for the Gamma function
function gamma(z){
  const g = 7;
  const c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
  if (z < 0.5){
    return Math.PI / (Math.sin(Math.PI*z) * gamma(1-z));
  }
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
function chiSqPDF(x, k){
  if (x <= 0) return 0;
  const num = Math.pow(x, k/2 - 1) * Math.exp(-x/2);
  const den = Math.pow(2, k/2) * gamma(k/2);
  return num/den;
}
function fmtP(n, d=4){ return isFinite(n) ? n.toFixed(d) : "—"; }
function svgEl(tag, attrs){
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const k in attrs) el.setAttribute(k, attrs[k]);
  return el;
}

/* ============================================================
   02 — Discrete uniform explorer
   ============================================================ */
(function(){
  const nI = document.getElementById('duN'), x1I = document.getElementById('duX1'), x2I = document.getElementById('duX2');
  const chart = document.getElementById('duChart'), result = document.getElementById('duResult'), steps = document.getElementById('duSteps');
  if (!nI) return;
  function render(){
    const n = Math.max(2, parseInt(nI.value,10) || 2);
    let x1 = parseInt(x1I.value,10), x2 = parseInt(x2I.value,10);
    if (x1 > x2) [x1,x2] = [x2,x1];
    const p = 1/n;
    chart.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.style.display = 'flex'; wrap.style.gap = '3px'; wrap.style.alignItems = 'flex-end'; wrap.style.height = '90px';
    for (let x=1; x<=n; x++){
      const col = document.createElement('div');
      col.style.flex = '1'; col.style.display = 'flex'; col.style.flexDirection='column'; col.style.alignItems='center'; col.style.justifyContent='flex-end'; col.style.height='100%';
      const bar = document.createElement('div');
      bar.style.width = '100%'; bar.style.height = '70px';
      bar.style.background = (x>=x1 && x<=x2) ? 'var(--amber-deep)' : 'var(--indigo)';
      bar.style.borderRadius = '3px 3px 0 0';
      col.appendChild(bar);
      const lbl = document.createElement('div');
      lbl.style.fontFamily='var(--font-mono)'; lbl.style.fontSize='.65rem'; lbl.style.marginTop='4px'; lbl.style.color='var(--ink-soft)';
      lbl.textContent = x;
      col.appendChild(lbl);
      wrap.appendChild(col);
    }
    chart.appendChild(wrap);
    const Fx2 = x2/n, Fx1minus1 = (x1-1)/n;
    const prob = Fx2 - Fx1minus1;
    result.textContent = `P(${x1} ≤ X ≤ ${x2}) = ${fmtP(prob,4)}`;
    steps.textContent = `F(${x2}) − F(${x1-1}) = ${fmtP(Fx2,3)} − ${fmtP(Fx1minus1,3)} = ${fmtP(prob,4)}`;
  }
  [nI,x1I,x2I].forEach(el => el.addEventListener('input', render));
  render();
})();

/* ============================================================
   03 — Continuous uniform explorer
   ============================================================ */
(function(){
  const aI = document.getElementById('cuA'), bI = document.getElementById('cuB'), xI = document.getElementById('cuX');
  const chart = document.getElementById('cuChart'), result = document.getElementById('cuResult'), steps = document.getElementById('cuSteps');
  if (!aI) return;
  function render(){
    const a = parseFloat(aI.value), b = parseFloat(bI.value), x = parseFloat(xI.value);
    const W=460, H=130, padL=36, padB=24, padT=10, padR=16;
    const domainMin = a - (b-a)*0.15, domainMax = b + (b-a)*0.15;
    const xScale = v => padL + (v-domainMin)/(domainMax-domainMin)*(W-padL-padR);
    const height = H - padT - padB;
    const svg = svgEl('svg', {viewBox:`0 0 ${W} ${H}`, width:'100%', class:'dist-svg', style:'max-width:480px;'});
    // baseline
    svg.appendChild(svgEl('line', {x1:padL, x2:W-padR, y1:H-padB, y2:H-padB, stroke:'#4A4763', 'stroke-width':1}));
    // shaded region a to x
    const clampedX = Math.max(a, Math.min(b, x));
    svg.appendChild(svgEl('rect', {x:xScale(a), y:padT, width:xScale(clampedX)-xScale(a), height:height, fill:'#E8A33D', 'fill-opacity':0.35}));
    // pdf rectangle outline
    svg.appendChild(svgEl('rect', {x:xScale(a), y:padT, width:xScale(b)-xScale(a), height:height, fill:'none', stroke:'#2B2560', 'stroke-width':2}));
    // labels
    [a,b].forEach(v => {
      const t = svgEl('text', {x:xScale(v), y:H-8, 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':10, fill:'#1C1B29'});
      t.textContent = v;
      svg.appendChild(t);
    });
    if (x>=a && x<=b){
      svg.appendChild(svgEl('line', {x1:xScale(x), x2:xScale(x), y1:padT, y2:H-padB, stroke:'#C77F1E', 'stroke-width':2, 'stroke-dasharray':'3,2'}));
      const t = svgEl('text', {x:xScale(x), y:padT-2, 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':9, fill:'#C77F1E', 'font-weight':'600'});
      t.textContent = 'x='+x;
      svg.appendChild(t);
    }
    chart.innerHTML = '';
    chart.appendChild(svg);

    const mean = (a+b)/2, variance = Math.pow(b-a,2)/12;
    let Fx;
    if (x < a) Fx = 0; else if (x > b) Fx = 1; else Fx = (x-a)/(b-a);
    result.textContent = `F(${x}) = ${fmtP(Fx,3)}`;
    steps.textContent = `(${x}−${a})/(${b}−${a}) = ${fmtP(Fx,3)} · μ=${fmtP(mean,3)} · σ²=${fmtP(variance,4)}`;
  }
  [aI,bI,xI].forEach(el => el.addEventListener('input', render));
  render();
})();

/* ============================================================
   04 — Binomial tree visualization (n=4, static)
   ============================================================ */
(function(){
  const container = document.getElementById('binomialTreeChart');
  if (!container) return;
  const n = 4;
  const W = 560, H = 260, padL = 30, padR = 30;
  const xStep = (W - padL - padR) / n;
  const svg = svgEl('svg', {viewBox:`0 0 ${W} ${H}`, width:'100%', style:'max-width:600px;'});
  // compute node positions: at period t, there are t+1 nodes, indexed by number of up-moves (0..t)
  function yForNode(t, ups){
    // center nodes vertically; more ups = higher (lower y)
    const spread = 200;
    const mid = H/2;
    if (t === 0) return mid;
    const step = spread / (2*n);
    return mid - (ups - t/2) * step * 2;
  }
  // draw edges
  for (let t=0; t<n; t++){
    for (let ups=0; ups<=t; ups++){
      const x1 = padL + t*xStep, y1 = yForNode(t, ups);
      // up edge
      const x2u = padL + (t+1)*xStep, y2u = yForNode(t+1, ups+1);
      svg.appendChild(svgEl('line', {x1, y1, x2:x2u, y2:y2u, stroke:'#2F8F6B', 'stroke-width':1.3, 'stroke-opacity':0.6}));
      // down edge
      const y2d = yForNode(t+1, ups);
      svg.appendChild(svgEl('line', {x1, y1, x2:x2u, y2:y2d, stroke:'#D6573F', 'stroke-width':1.3, 'stroke-opacity':0.6}));
    }
  }
  // draw nodes + labels at final period with path counts
  for (let t=0; t<=n; t++){
    for (let ups=0; ups<=t; ups++){
      const x = padL + t*xStep, y = yForNode(t, ups);
      svg.appendChild(svgEl('circle', {cx:x, cy:y, r: t===n ? 5 : 3, fill: t===n ? '#E8A33D' : '#2B2560', stroke:'#fff', 'stroke-width':1}));
      if (t === n){
        const paths = combination(n, ups);
        const txt = svgEl('text', {x:x+8, y:y+3, 'font-family':'IBM Plex Mono', 'font-size':9, fill:'#1C1B29'});
        txt.textContent = `${ups} up: ${paths} path${paths===1?'':'s'}`;
        svg.appendChild(txt);
      }
    }
  }
  // period labels
  for (let t=0; t<=n; t++){
    const x = padL + t*xStep;
    const txt = svgEl('text', {x, y:H-6, 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':9, fill:'#4A4763'});
    txt.textContent = 't='+t;
    svg.appendChild(txt);
  }
  container.appendChild(svg);
})();

/* ============================================================
   04b — Binomial probability calculator + distribution chart
   ============================================================ */
(function(){
  const nI = document.getElementById('binN'), pI = document.getElementById('binP'), xI = document.getElementById('binX');
  const chart = document.getElementById('binChart'), result = document.getElementById('binResult'), steps = document.getElementById('binSteps');
  if (!nI) return;
  function render(){
    const n = Math.max(1, Math.min(30, parseInt(nI.value,10) || 1));
    const p = Math.max(0, Math.min(1, parseFloat(pI.value)));
    const x = Math.max(0, Math.min(n, parseInt(xI.value,10) || 0));
    const probs = [];
    for (let k=0; k<=n; k++) probs.push(binomialPMF(n,p,k));
    const max = Math.max(...probs);
    chart.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.style.display='flex'; wrap.style.gap='2px'; wrap.style.alignItems='flex-end'; wrap.style.height='120px'; wrap.style.overflowX='auto';
    probs.forEach((pr, k) => {
      const col = document.createElement('div');
      col.style.flex='1 0 auto'; col.style.minWidth='16px'; col.style.display='flex'; col.style.flexDirection='column'; col.style.alignItems='center'; col.style.justifyContent='flex-end'; col.style.height='100%';
      const bar = document.createElement('div');
      bar.style.width='100%'; bar.style.height = Math.max(2,(pr/max*90))+'px';
      bar.style.background = k===x ? 'var(--amber-deep)' : 'var(--indigo)';
      bar.style.borderRadius='2px 2px 0 0';
      bar.title = `p(${k}) = ${pr.toFixed(4)}`;
      col.appendChild(bar);
      const lbl = document.createElement('div');
      lbl.style.fontFamily='var(--font-mono)'; lbl.style.fontSize='.6rem'; lbl.style.marginTop='3px'; lbl.style.color='var(--ink-soft)';
      lbl.textContent = k;
      col.appendChild(lbl);
      wrap.appendChild(col);
    });
    chart.appendChild(wrap);
    const px = binomialPMF(n,p,x);
    result.textContent = `p(${x}) = ${fmtP(px,4)}`;
    steps.textContent = `${n}C${x} × ${fmtP(p,3)}^${x} × ${fmtP(1-p,3)}^${n-x} = ${fmtP(combination(n,x),0)} × ${fmtP(px/combination(n,x),6)} = ${fmtP(px,4)}`;
  }
  [nI,pI,xI].forEach(el => el.addEventListener('input', render));
  render();
})();

/* ============================================================
   05 — Binomial mean/variance calculator
   ============================================================ */
(function(){
  const nI = document.getElementById('bmN'), pI = document.getElementById('bmP');
  const out = document.getElementById('bmOut');
  if (!nI) return;
  function render(){
    const n = parseFloat(nI.value), p = parseFloat(pI.value);
    const mean = n*p, variance = n*p*(1-p), sd = Math.sqrt(variance);
    out.innerHTML = `
      <div class="stat-readout"><div class="k">Mean</div><div class="v">${fmtP(mean,3)}</div></div>
      <div class="stat-readout"><div class="k">Variance</div><div class="v">${fmtP(variance,3)}</div></div>
      <div class="stat-readout"><div class="k">Std Dev</div><div class="v">${fmtP(sd,3)}</div></div>
    `;
  }
  [nI,pI].forEach(el => el.addEventListener('input', render));
  render();
})();

/* ============================================================
   06 — Two normals comparison (static chart)
   ============================================================ */
(function(){
  const container = document.getElementById('twoNormalsChart');
  if (!container) return;
  const W=460, H=200, padL=20, padR=20, padT=10, padB=24;
  const domainMin=-8, domainMax=8;
  const xScale = v => padL + (v-domainMin)/(domainMax-domainMin)*(W-padL-padR);
  const maxPdf = normPDF(0,0,1);
  const yScale = v => (H-padB) - (v/maxPdf)*(H-padT-padB);
  const svg = svgEl('svg', {viewBox:`0 0 ${W} ${H}`, width:'100%', class:'dist-svg', style:'max-width:480px;'});
  svg.appendChild(svgEl('line', {x1:padL, x2:W-padR, y1:H-padB, y2:H-padB, stroke:'#E3DCC9'}));
  [[1,'#2B2560','σ=1'],[2,'#E8A33D','σ=2']].forEach(([sigma,color,label]) => {
    let d = '';
    for (let x=domainMin; x<=domainMax; x+=0.1){
      const px = xScale(x), py = yScale(normPDF(x,0,sigma));
      d += (x===domainMin ? 'M':'L') + px + ',' + py + ' ';
    }
    svg.appendChild(svgEl('path', {d, fill:'none', stroke:color, 'stroke-width':2.2}));
  });
  [-6,-4,-2,0,2,4,6].forEach(v => {
    const t = svgEl('text', {x:xScale(v), y:H-8, 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':9, fill:'#4A4763'});
    t.textContent = v;
    svg.appendChild(t);
  });
  container.appendChild(svg);
  const legend = document.createElement('div');
  legend.style.display='flex'; legend.style.gap='16px'; legend.style.marginTop='8px'; legend.style.fontFamily='var(--font-mono)'; legend.style.fontSize='.75rem';
  legend.innerHTML = `<span><span style="display:inline-block;width:10px;height:10px;background:#2B2560;border-radius:2px;margin-right:5px;"></span>μ=0, σ=1</span><span><span style="display:inline-block;width:10px;height:10px;background:#E8A33D;border-radius:2px;margin-right:5px;"></span>μ=0, σ=2</span>`;
  container.appendChild(legend);
})();

/* ============================================================
   07 — Empirical rule chart with sigma buttons
   ============================================================ */
(function(){
  const container = document.getElementById('empiricalRuleChart');
  const btnRow = document.getElementById('sigmaBtnRow');
  if (!container) return;
  const pctMap = {1:68, 2:95, 3:99};
  function render(k){
    const W=520, H=220, padL=24, padR=24, padT=10, padB=24;
    const domainMin=-4, domainMax=4;
    const xScale = v => padL + (v-domainMin)/(domainMax-domainMin)*(W-padL-padR);
    const maxPdf = normPDF(0);
    const yScale = v => (H-padB) - (v/maxPdf)*(H-padT-padB);
    const svg = svgEl('svg', {viewBox:`0 0 ${W} ${H}`, width:'100%', class:'dist-svg', style:'max-width:560px;'});
    svg.appendChild(svgEl('line', {x1:padL, x2:W-padR, y1:H-padB, y2:H-padB, stroke:'#E3DCC9'}));
    // shaded area path
    let areaD = `M${xScale(-k)},${H-padB} `;
    for (let x=-k; x<=k; x+=0.05){
      areaD += `L${xScale(x)},${yScale(normPDF(x))} `;
    }
    areaD += `L${xScale(k)},${H-padB} Z`;
    svg.appendChild(svgEl('path', {d:areaD, fill:'#E8A33D', 'fill-opacity':0.4}));
    // curve
    let d = '';
    for (let x=domainMin; x<=domainMax; x+=0.05){
      const px=xScale(x), py=yScale(normPDF(x));
      d += (x===domainMin?'M':'L')+px+','+py+' ';
    }
    svg.appendChild(svgEl('path', {d, fill:'none', stroke:'#2B2560', 'stroke-width':2}));
    // markers
    [-k,0,k].forEach(v => {
      svg.appendChild(svgEl('line', {x1:xScale(v), x2:xScale(v), y1:yScale(normPDF(v)), y2:H-padB, stroke:'#C77F1E', 'stroke-width':1, 'stroke-dasharray':'2,2'}));
    });
    [-3,-2,-1,0,1,2,3].forEach(v => {
      const t = svgEl('text', {x:xScale(v), y:H-8, 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':9, fill:'#4A4763'});
      t.textContent = (v>0?'+':'')+v+'σ';
      svg.appendChild(t);
    });
    const pctText = svgEl('text', {x:W/2, y:padT+14, 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':13, fill:'#C77F1E', 'font-weight':'700'});
    pctText.textContent = `~${pctMap[k]}% of observations`;
    svg.appendChild(pctText);
    container.innerHTML = '';
    container.appendChild(svg);
  }
  btnRow.querySelectorAll('.sigma-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btnRow.querySelectorAll('.sigma-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      render(parseInt(btn.dataset.k,10));
    });
  });
  render(2);
})();

/* ============================================================
   08 — Z-score & normal probability calculator
   ============================================================ */
(function(){
  const xI = document.getElementById('zX'), muI = document.getElementById('zMu'), sigmaI = document.getElementById('zSigma');
  const out = document.getElementById('zOut');
  if (!xI) return;
  function render(){
    const X = parseFloat(xI.value), mu = parseFloat(muI.value), sigma = parseFloat(sigmaI.value);
    const z = (X-mu)/sigma;
    const pBelow = normCDF(z);
    const pAbove = 1 - pBelow;
    out.innerHTML = `
      <div class="stat-readout"><div class="k">Z-score</div><div class="v">${fmtP(z,3)}</div></div>
      <div class="stat-readout"><div class="k">P(X≤x)</div><div class="v">${(pBelow*100).toFixed(2)}%</div></div>
      <div class="stat-readout"><div class="k">P(X&gt;x)</div><div class="v">${(pAbove*100).toFixed(2)}%</div></div>
    `;
  }
  [xI,muI,sigmaI].forEach(el => el.addEventListener('input', render));
  render();
})();

/* ============================================================
   09 — t-distribution vs normal chart (df slider)
   ============================================================ */
(function(){
  const container = document.getElementById('tDistChart');
  const dfI = document.getElementById('tDf');
  if (!container) return;
  function render(){
    const df = Math.max(1, Math.min(30, parseInt(dfI.value,10) || 4));
    const W=520, H=220, padL=24, padR=24, padT=10, padB=24;
    const domainMin=-5, domainMax=5;
    const xScale = v => padL + (v-domainMin)/(domainMax-domainMin)*(W-padL-padR);
    const maxPdf = Math.max(normPDF(0), tPDF(0,df));
    const yScale = v => (H-padB) - (v/maxPdf)*(H-padT-padB);
    const svg = svgEl('svg', {viewBox:`0 0 ${W} ${H}`, width:'100%', class:'dist-svg', style:'max-width:560px;'});
    svg.appendChild(svgEl('line', {x1:padL, x2:W-padR, y1:H-padB, y2:H-padB, stroke:'#E3DCC9'}));
    // normal dashed
    let dN = '';
    for (let x=domainMin; x<=domainMax; x+=0.08){
      const px=xScale(x), py=yScale(normPDF(x));
      dN += (x===domainMin?'M':'L')+px+','+py+' ';
    }
    svg.appendChild(svgEl('path', {d:dN, fill:'none', stroke:'#9c94c9', 'stroke-width':1.8, 'stroke-dasharray':'5,4'}));
    // t curve
    let dT = '';
    for (let x=domainMin; x<=domainMax; x+=0.08){
      const px=xScale(x), py=yScale(tPDF(x,df));
      dT += (x===domainMin?'M':'L')+px+','+py+' ';
    }
    svg.appendChild(svgEl('path', {d:dT, fill:'none', stroke:'#C77F1E', 'stroke-width':2.4}));
    [-4,-2,0,2,4].forEach(v => {
      const t = svgEl('text', {x:xScale(v), y:H-8, 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':9, fill:'#4A4763'});
      t.textContent = v;
      svg.appendChild(t);
    });
    container.innerHTML = '';
    container.appendChild(svg);
    const legend = document.createElement('div');
    legend.style.display='flex'; legend.style.gap='16px'; legend.style.marginTop='8px'; legend.style.fontFamily='var(--font-mono)'; legend.style.fontSize='.75rem';
    legend.innerHTML = `<span><span style="display:inline-block;width:14px;height:2px;background:#C77F1E;margin-right:5px;vertical-align:middle;"></span>t-distribution (df=${df})</span><span><span style="display:inline-block;width:14px;height:2px;background:#9c94c9;margin-right:5px;vertical-align:middle; border-top:2px dashed #9c94c9;"></span>Standard normal</span>`;
    container.appendChild(legend);
  }
  dfI.addEventListener('input', render);
  render();
})();

/* ============================================================
   10 — Chi-square chart (df slider)
   ============================================================ */
(function(){
  const container = document.getElementById('chiSqChart');
  const dfI = document.getElementById('chiDf');
  if (!container) return;
  function render(){
    const k = Math.max(1, Math.min(15, parseInt(dfI.value,10) || 3));
    const W=520, H=200, padL=24, padR=24, padT=10, padB=24;
    const domainMax = Math.max(10, k*3);
    const xScale = v => padL + (v/domainMax)*(W-padL-padR);
    // find approx max pdf value by sampling
    let maxPdf = 0;
    for (let x=0.05; x<=domainMax; x+=0.05){ maxPdf = Math.max(maxPdf, chiSqPDF(x,k)); }
    const yScale = v => (H-padB) - (v/maxPdf)*(H-padT-padB);
    const svg = svgEl('svg', {viewBox:`0 0 ${W} ${H}`, width:'100%', class:'dist-svg', style:'max-width:560px;'});
    svg.appendChild(svgEl('line', {x1:padL, x2:W-padR, y1:H-padB, y2:H-padB, stroke:'#E3DCC9'}));
    let d = '';
    for (let x=0.02; x<=domainMax; x+=0.05){
      const px=xScale(x), py=yScale(chiSqPDF(x,k));
      d += (x===0.02?'M':'L')+px+','+py+' ';
    }
    svg.appendChild(svgEl('path', {d, fill:'none', stroke:'#2F8F6B', 'stroke-width':2.4}));
    for (let v=0; v<=domainMax; v+=Math.ceil(domainMax/8)){
      const t = svgEl('text', {x:xScale(v), y:H-8, 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':9, fill:'#4A4763'});
      t.textContent = v;
      svg.appendChild(t);
    }
    container.innerHTML = '';
    container.appendChild(svg);
    const lbl = document.createElement('div');
    lbl.style.fontFamily='var(--font-mono)'; lbl.style.fontSize='.75rem'; lbl.style.color='var(--ink-soft)'; lbl.style.marginTop='6px';
    lbl.textContent = `Chi-square distribution, df=${k} — note the long right tail and the boundary at zero.`;
    container.appendChild(lbl);
  }
  dfI.addEventListener('input', render);
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
const sectionIds = ['sec-basics','sec-discreteuniform','sec-continuousuniform','sec-binomial','sec-binomialapp','sec-normal','sec-normalprob','sec-standardize','sec-tdist','sec-chisq','sec-quiz'];
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
  try { localStorage.setItem('cfa-progress-distributions', String(pct)); } catch(e) {}
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
    concept: "Random Variables & Distributions",
    q: "The number of central bank board members voting for a rate hike is an example of a:",
    opts: ["Continuous random variable", "Discrete random variable", "Neither — it's not random"],
    correct: 1,
    exp: "It's a countable, finite quantity (0 up to the number of members) — the definition of a discrete random variable."
  },
  {
    concept: "Random Variables & Distributions",
    q: "For a continuous random variable, what is the probability that it takes on any single exact value?",
    opts: ["It equals the pdf value at that point", "It is always exactly 0", "It depends on the distribution's mean"],
    correct: 1,
    exp: "Continuous random variables have infinitely many possible values in any interval, so the probability of hitting any one exact value is always 0 — only ranges carry positive probability."
  },
  {
    concept: "Discrete Uniform",
    q: "A discrete uniform random variable has outcomes 1 through 12, equally likely. What is F(5)?",
    opts: ["1/12", "5/12", "7/12"],
    correct: 1,
    exp: "F(5) = P(X ≤ 5) = 5 × (1/12) = 5/12, since 5 of the 12 equally likely outcomes are at or below 5."
  },
  {
    concept: "Continuous Uniform",
    q: "X is continuous uniform between a=20 and b=50. What is the mean?",
    opts: ["30", "35", "50"],
    correct: 1,
    exp: "μ = (a+b)/2 = (20+50)/2 = 35."
  },
  {
    concept: "Continuous Uniform",
    q: "X is continuous uniform between 0 and 10. What is P(3 ≤ X ≤ 7)?",
    opts: ["0.30", "0.40", "0.70"],
    correct: 1,
    exp: "P(3≤X≤7) = (7−3)/(10−0) = 4/10 = 0.40 — the interval's share of the total width."
  },
  {
    concept: "The Binomial Distribution",
    q: "Which of these is NOT one of the two core assumptions behind the binomial distribution?",
    opts: ["The probability of success is constant across trials", "The trials are independent", "The number of trials must be at least 30"],
    correct: 2,
    exp: "The binomial model requires constant p and independent trials — there's no minimum sample size requirement."
  },
  {
    concept: "The Binomial Distribution",
    q: "In a binomial model with n=6, how many distinct sequences produce exactly 4 successes?",
    opts: ["24", "15", "6"],
    correct: 1,
    exp: "₆C₄ = 6!/(2!4!) = 15."
  },
  {
    concept: "Mean, Variance & Applications",
    q: "A binomial random variable has n=20 and p=0.4. What is its mean?",
    opts: ["8", "0.4", "20"],
    correct: 0,
    exp: "E(X) = np = 20 × 0.4 = 8."
  },
  {
    concept: "Mean, Variance & Applications",
    q: "A binomial random variable has n=16, p=0.25. What is its variance?",
    opts: ["4.0", "3.0", "12.0"],
    correct: 1,
    exp: "Var(X) = np(1−p) = 16 × 0.25 × 0.75 = 3.0."
  },
  {
    concept: "The Binomial Distribution",
    q: "A binomial distribution with p exactly equal to 0.50 is:",
    opts: ["Always skewed right", "Symmetric", "Always skewed left"],
    correct: 1,
    exp: "When p = 0.50, successes and failures are equally likely, making the distribution perfectly symmetric; any p ≠ 0.50 introduces skew."
  },
  {
    concept: "Properties of the Normal",
    q: "Which statement about the normal distribution is TRUE?",
    opts: ["It is completely described by its mean and variance", "Its skewness is always positive", "Its kurtosis is always 0"],
    correct: 0,
    exp: "A normal distribution is fully specified by exactly two parameters: mean (μ) and variance (σ²). Its skewness is 0 and its kurtosis is 3 (excess kurtosis 0)."
  },
  {
    concept: "Properties of the Normal",
    q: "A portfolio's return is a weighted average of returns on 15 jointly normal stocks. The portfolio's return distribution is:",
    opts: ["Normal", "Binomial", "Impossible to determine"],
    correct: 0,
    exp: "A linear combination of jointly normal random variables is itself normally distributed."
  },
  {
    concept: "Properties of the Normal",
    q: "For a multivariate normal distribution of 10 stocks, how many distinct pairwise correlations must be specified?",
    opts: ["10", "45", "100"],
    correct: 1,
    exp: "n(n−1)/2 = 10×9/2 = 45 distinct pairwise correlations."
  },
  {
    concept: "The Empirical Rule",
    q: "Approximately what percentage of a normal distribution's observations fall within ±2 standard deviations of the mean?",
    opts: ["68%", "95%", "99.7%"],
    correct: 1,
    exp: "The empirical rule: roughly 95% of observations fall within μ ± 2σ (more precisely, ±1.96σ)."
  },
  {
    concept: "Standardizing & Z-Scores",
    q: "X ~ N(40, 5²). What is the Z-score for X = 47.5?",
    opts: ["1.00", "1.50", "7.50"],
    correct: 1,
    exp: "Z = (47.5 − 40)/5 = 7.5/5 = 1.50."
  },
  {
    concept: "Standardizing & Z-Scores",
    q: "If P(Z ≤ 1.65) ≈ 0.95, what is P(Z > 1.65)?",
    opts: ["0.95", "0.05", "1.65"],
    correct: 1,
    exp: "P(Z > 1.65) = 1 − P(Z ≤ 1.65) = 1 − 0.95 = 0.05."
  },
  {
    concept: "Student's t-Distribution",
    q: "The ratio t = (X̄ − μ)/(s/√n), using the sample standard deviation s instead of the true σ, follows:",
    opts: ["The standard normal distribution", "The t-distribution with n−1 degrees of freedom", "The chi-square distribution"],
    correct: 1,
    exp: "Substituting the estimated s for the true σ introduces extra uncertainty, which is exactly what gives this ratio a t-distribution (fatter tails) rather than a standard normal one."
  },
  {
    concept: "Student's t-Distribution",
    q: "As the degrees of freedom of a t-distribution grow very large, its shape:",
    opts: ["Becomes more skewed", "Approaches the standard normal distribution", "Becomes bounded below by zero"],
    correct: 1,
    exp: "With more degrees of freedom, the t-distribution's tails thin out and it converges toward the standard normal shape."
  },
  {
    concept: "Chi-Square & F-Distributions",
    q: "Which distribution is built from the sum of squared independent standard normal random variables?",
    opts: ["Student's t-distribution", "The F-distribution", "The chi-square distribution"],
    correct: 2,
    exp: "The chi-square distribution with k degrees of freedom is exactly the distribution of a sum of k squared independent standard normal variables."
  },
  {
    concept: "Chi-Square & F-Distributions",
    q: "The F-distribution requires how many degrees-of-freedom parameters?",
    opts: ["One", "Two — numerator and denominator", "Three"],
    correct: 1,
    exp: "Since the F-distribution is the ratio of two chi-square variables (each with its own df), it needs both a numerator and a denominator degrees-of-freedom parameter."
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
          cfaRecordAnswer(item.concept, "Common Probability Distributions", i === item.correct);
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
