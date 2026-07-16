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
   05 — HISTOGRAM (real EAA Equity Index data, 10 bins)
   ============================================================ */
(function(){
  const container = document.getElementById('histogramChart');
  if (!container) return;
  const bins = [
    {label:"-5 to -4", val:1}, {label:"-4 to -3", val:7}, {label:"-3 to -2", val:23},
    {label:"-2 to -1", val:77}, {label:"-1 to 0", val:470}, {label:"0 to 1", val:555},
    {label:"1 to 2", val:110}, {label:"2 to 3", val:13}, {label:"3 to 4", val:1}, {label:"4 to 5", val:1}
  ];
  const max = Math.max(...bins.map(b=>b.val));
  const wrap = document.createElement('div');
  wrap.className = 'bars';
  bins.forEach(b => {
    const col = document.createElement('div');
    col.className = 'bar-col';
    const bar = document.createElement('div');
    bar.className = 'bar';
    bar.style.height = Math.max(2, (b.val/max)*100) + '%';
    const tip = document.createElement('div');
    tip.className = 'bar-tooltip';
    tip.textContent = b.val + ' days';
    bar.appendChild(tip);
    col.appendChild(bar);
    const lbl = document.createElement('div');
    lbl.className = 'bar-label';
    lbl.textContent = b.label + '%';
    col.appendChild(lbl);
    wrap.appendChild(col);
  });
  container.appendChild(wrap);
})();

/* ============================================================
   06a — BAR CHART (portfolio sector frequencies, Exhibit 8)
   ============================================================ */
(function(){
  const container = document.getElementById('barChart');
  if (!container) return;
  const data = [
    {label:"Industrials", val:73},
    {label:"Info. Technology", val:69},
    {label:"Financials", val:67},
    {label:"Consumer Disc.", val:62},
    {label:"Health Care", val:54},
    {label:"Consumer Staples", val:33},
    {label:"Real Estate", val:30},
    {label:"Energy", val:29},
    {label:"Utilities", val:26},
    {label:"Materials", val:26},
    {label:"Comm. Services", val:10},
  ];
  const max = Math.max(...data.map(d=>d.val));
  const rows = document.createElement('div');
  data.forEach(d => {
    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.alignItems = 'center';
    row.style.gap = '10px';
    row.style.margin = '6px 0';
    const lbl = document.createElement('div');
    lbl.style.width = '150px';
    lbl.style.fontFamily = 'var(--font-mono)';
    lbl.style.fontSize = '.75rem';
    lbl.style.color = 'var(--ink-soft)';
    lbl.textContent = d.label;
    const barTrack = document.createElement('div');
    barTrack.style.flex = '1';
    barTrack.style.background = 'var(--paper-dim)';
    barTrack.style.borderRadius = '4px';
    barTrack.style.overflow = 'hidden';
    barTrack.style.height = '20px';
    const bar = document.createElement('div');
    bar.style.height = '100%';
    bar.style.width = (d.val/max*100) + '%';
    bar.style.background = 'var(--indigo)';
    bar.style.borderRadius = '4px';
    barTrack.appendChild(bar);
    const valLbl = document.createElement('div');
    valLbl.style.width = '36px';
    valLbl.style.fontFamily = 'var(--font-mono)';
    valLbl.style.fontSize = '.75rem';
    valLbl.textContent = d.val;
    row.appendChild(lbl); row.appendChild(barTrack); row.appendChild(valLbl);
    rows.appendChild(row);
  });
  container.appendChild(rows);
})();

/* ============================================================
   06b — GROUPED / STACKED BAR CHART (sector x market cap, Exhibit 14)
   ============================================================ */
(function(){
  const container = document.getElementById('groupedStackedChart');
  if (!container) return;
  const data = [
    {sector:"Comm. Svcs", small:55, mid:35, large:20},
    {sector:"Cons. Staples", small:50, mid:30, large:30},
    {sector:"Energy", small:175, mid:95, large:20},
    {sector:"Health Care", small:275, mid:105, large:55},
    {sector:"Utilities", small:20, mid:25, large:10},
  ];
  const colors = {small:'#2B2560', mid:'#E8A33D', large:'#2F8F6B'};
  let mode = 'grouped';

  function render(){
    container.innerHTML = '';
    const maxTotal = mode === 'stacked'
      ? Math.max(...data.map(d => d.small+d.mid+d.large))
      : Math.max(...data.map(d => Math.max(d.small,d.mid,d.large)));

    const legend = document.createElement('div');
    legend.style.display = 'flex'; legend.style.gap = '16px'; legend.style.marginBottom = '14px';
    legend.style.fontFamily = 'var(--font-mono)'; legend.style.fontSize = '.75rem';
    ['small','mid','large'].forEach(k => {
      const item = document.createElement('span');
      item.innerHTML = `<span style="display:inline-block;width:10px;height:10px;background:${colors[k]};border-radius:2px;margin-right:5px;"></span>${k==='small'?'Small Cap':k==='mid'?'Mid Cap':'Large Cap'}`;
      legend.appendChild(item);
    });
    container.appendChild(legend);

    data.forEach(d => {
      const row = document.createElement('div');
      row.style.display = 'flex'; row.style.alignItems = 'center'; row.style.gap = '10px'; row.style.margin = '8px 0';
      const lbl = document.createElement('div');
      lbl.style.width = '120px'; lbl.style.fontFamily='var(--font-mono)'; lbl.style.fontSize='.72rem'; lbl.style.color='var(--ink-soft)';
      lbl.textContent = d.sector;
      row.appendChild(lbl);

      if (mode === 'grouped'){
        const cluster = document.createElement('div');
        cluster.style.display = 'flex'; cluster.style.gap = '3px'; cluster.style.flex = '1'; cluster.style.height='26px';
        ['small','mid','large'].forEach(k => {
          const barWrap = document.createElement('div');
          barWrap.style.flex = '1'; barWrap.style.background='var(--paper-dim)'; barWrap.style.borderRadius='3px'; barWrap.style.display='flex'; barWrap.style.alignItems='flex-end'; barWrap.style.height='100%';
          const bar = document.createElement('div');
          bar.style.width = '100%'; bar.style.height = (d[k]/maxTotal*100)+'%'; bar.style.background = colors[k]; bar.style.borderRadius='3px 3px 0 0';
          bar.title = k + ': ' + d[k];
          barWrap.appendChild(bar);
          cluster.appendChild(barWrap);
        });
        row.appendChild(cluster);
      } else {
        const track = document.createElement('div');
        track.style.flex = '1'; track.style.height = '26px'; track.style.display='flex'; track.style.borderRadius='4px'; track.style.overflow='hidden';
        const total = d.small + d.mid + d.large;
        ['small','mid','large'].forEach(k => {
          const seg = document.createElement('div');
          seg.style.width = (d[k]/maxTotal*100)+'%'; seg.style.background = colors[k];
          seg.title = k + ': ' + d[k];
          track.appendChild(seg);
        });
        row.appendChild(track);
        const totalLbl = document.createElement('div');
        totalLbl.style.width='40px'; totalLbl.style.fontFamily='var(--font-mono)'; totalLbl.style.fontSize='.72rem';
        totalLbl.textContent = total;
        row.appendChild(totalLbl);
      }
      container.appendChild(row);
    });
  }
  render();

  document.querySelectorAll('.calc-tab[data-mode]').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.calc-tab[data-mode]').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      mode = tab.dataset.mode;
      render();
    });
  });
})();

/* ============================================================
   06c — TREE-MAP (sector marginal frequencies)
   ============================================================ */
(function(){
  const container = document.getElementById('treemapChart');
  if (!container) return;
  const data = [
    {label:"Health Care", val:435, color:"#2B2560"},
    {label:"Energy", val:290, color:"#E8A33D"},
    {label:"Comm. Services", val:110, color:"#2F8F6B"},
    {label:"Cons. Staples", val:110, color:"#5C4FBF"},
    {label:"Utilities", val:55, color:"#D6573F"},
  ];
  data.forEach(d => {
    const cell = document.createElement('div');
    cell.className = 'treemap-cell';
    cell.style.background = d.color;
    cell.style.flexBasis = (d.val*2) + 'px';
    cell.innerHTML = `<span><b>${d.label}</b>${d.val} stocks</span>`;
    container.appendChild(cell);
  });
})();

/* ============================================================
   06d — WORD CLOUD
   ============================================================ */
(function(){
  const container = document.getElementById('wordCloud');
  if (!container) return;
  const words = [
    {w:"revenue", size:2.6, color:"var(--indigo-deep)"},
    {w:"billion", size:2.3, color:"var(--indigo-deep)"},
    {w:"growth", size:2.1, color:"var(--green)"},
    {w:"income", size:1.9, color:"var(--green)"},
    {w:"financial", size:1.7, color:"var(--indigo-deep)"},
    {w:"year", size:1.6, color:"var(--ink-soft)"},
    {w:"operating", size:1.3, color:"var(--ink-soft)"},
    {w:"segment", size:1.2, color:"var(--ink-soft)"},
    {w:"expenses", size:1.4, color:"var(--red)"},
    {w:"fine", size:1.1, color:"var(--red)"},
    {w:"tax", size:1.0, color:"var(--ink-soft)"},
    {w:"cash flow", size:1.3, color:"var(--green)"},
    {w:"advertising", size:1.1, color:"var(--ink-soft)"},
    {w:"currency", size:0.95, color:"var(--ink-soft)"},
  ];
  words.forEach(item => {
    const span = document.createElement('span');
    span.textContent = item.w;
    span.style.fontSize = item.size + 'rem';
    span.style.color = item.color;
    container.appendChild(span);
  });
})();

/* ============================================================
   07a — LINE CHART (ABC Inc. 10-day closing price)
   ============================================================ */
(function(){
  const container = document.getElementById('lineChart');
  if (!container) return;
  const prices = [57.21,58.26,58.64,56.19,54.78,54.26,56.88,54.74,52.42,50.14];
  const W = 560, H = 240, padL = 46, padB = 30, padT = 16, padR = 16;
  const min = Math.min(...prices), max = Math.max(...prices);
  const xStep = (W - padL - padR) / (prices.length - 1);
  const yScale = v => H - padB - ((v - min) / (max - min)) * (H - padT - padB);

  const svg = svgEl('svg', {viewBox:`0 0 ${W} ${H}`, width:'100%', style:'max-width:600px;'});

  // gridlines + y labels
  for (let i=0; i<=4; i++){
    const v = min + (max-min)*i/4;
    const y = yScale(v);
    svg.appendChild(svgEl('line', {x1:padL, x2:W-padR, y1:y, y2:y, stroke:'#E3DCC9', 'stroke-width':1}));
    const t = svgEl('text', {x:padL-6, y:y+3, 'text-anchor':'end', 'font-family':'IBM Plex Mono', 'font-size':9, fill:'#4A4763'});
    t.textContent = '$' + v.toFixed(0);
    svg.appendChild(t);
  }
  // line path
  let d = '';
  prices.forEach((p,i) => {
    const x = padL + i*xStep, y = yScale(p);
    d += (i===0 ? 'M' : 'L') + x + ',' + y + ' ';
  });
  svg.appendChild(svgEl('path', {d, fill:'none', stroke:'#2B2560', 'stroke-width':2.5}));
  // dots + x labels
  prices.forEach((p,i) => {
    const x = padL + i*xStep, y = yScale(p);
    svg.appendChild(svgEl('circle', {cx:x, cy:y, r:4, fill:'#E8A33D', stroke:'#2B2560', 'stroke-width':1.5}));
    const t = svgEl('text', {x:x, y:H-8, 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':9, fill:'#4A4763'});
    t.textContent = i+1;
    svg.appendChild(t);
  });
  container.appendChild(svg);
})();

/* ============================================================
   07b — SCATTER PLOT (IT vs S&P500 / Utilities vs S&P500, synthetic)
   ============================================================ */
(function(){
  const container = document.getElementById('scatterChart');
  const caption = document.getElementById('scatterCaption');
  if (!container) return;

  // Deterministic pseudo-random generator (seeded)
  function mulberry32(a){
    return function(){
      let t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  const rnd = mulberry32(42);

  function genSeries(n, slope, noise){
    const pts = [];
    for (let i=0; i<n; i++){
      const x = (rnd()*16) - 8;
      const y = slope*x + (rnd()*2-1)*noise;
      pts.push([x,y]);
    }
    return pts;
  }
  const itPts = genSeries(58, 1.05, 1.6);
  itPts.push([6, -6]); // flagged outlier
  const utilPts = genSeries(58, 0.05, 3.2);

  function render(pts, isIT){
    container.innerHTML = '';
    const W=520, H=320, pad=40;
    const xs = pts.map(p=>p[0]), ys = pts.map(p=>p[1]);
    const xMin=Math.min(...xs)-1, xMax=Math.max(...xs)+1, yMin=Math.min(...ys)-1, yMax=Math.max(...ys)+1;
    const xScale = v => pad + (v-xMin)/(xMax-xMin)*(W-2*pad);
    const yScale = v => H-pad - (v-yMin)/(yMax-yMin)*(H-2*pad);
    const svg = svgEl('svg', {viewBox:`0 0 ${W} ${H}`, width:'100%', style:'max-width:560px;', class:'scatter-svg'});
    // axes
    svg.appendChild(svgEl('line', {x1:pad, x2:W-pad, y1:yScale(0), y2:yScale(0), stroke:'#E3DCC9'}));
    svg.appendChild(svgEl('line', {x1:xScale(0), x2:xScale(0), y1:pad, y2:H-pad, stroke:'#E3DCC9'}));
    const xlabel = svgEl('text', {x:W/2, y:H-8, 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':10, fill:'#4A4763'});
    xlabel.textContent = 'S&P 500 monthly return (%)';
    svg.appendChild(xlabel);
    pts.forEach((p,i) => {
      const isOutlier = isIT && i === pts.length-1;
      svg.appendChild(svgEl('circle', {cx:xScale(p[0]), cy:yScale(p[1]), r:isOutlier?6:4, class:'scatter-dot' + (isOutlier?' outlier':'')}));
    });
    container.appendChild(svg);
  }
  render(itPts, true);

  document.querySelectorAll('.calc-tab[data-scatter]').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.calc-tab[data-scatter]').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      if (tab.dataset.scatter === 'it'){
        render(itPts, true);
        caption.textContent = "IT sector returns cluster tightly along a rising line with the broad market — a strong positive relationship, with one flagged outlier month.";
      } else {
        render(utilPts, false);
        caption.textContent = "Utilities returns scatter with no clear pattern against the broad market — little to no linear relationship.";
      }
    });
  });
})();

/* ============================================================
   08 — HEAT MAP (sector x cap, Exhibit 31 style data)
   ============================================================ */
(function(){
  const container = document.getElementById('heatMap');
  if (!container) return;
  const rows = ["Comm. Services","Cons. Staples","Energy","Health Care","Utilities"];
  const cols = ["Small Cap","Mid Cap","Large Cap"];
  const data = [
    [21,43,83],
    [36,81,45],
    [99,95,29],
    [4,8,18],
    [81,37,58]
  ];
  const flat = data.flat();
  const max = Math.max(...flat), min = Math.min(...flat);
  function colorFor(v){
    const t = (v - min) / (max - min);
    // interpolate paper-dim -> amber -> red for intensity
    const r1=243,g1=238,b1=227; // paper-dim
    const r2=214,g2=87,b2=63; // red
    const r = Math.round(r1 + (r2-r1)*t);
    const g = Math.round(g1 + (g2-g1)*t);
    const b = Math.round(b1 + (b2-b1)*t);
    return `rgb(${r},${g},${b})`;
  }
  const grid = document.createElement('div');
  grid.className = 'heatgrid';
  grid.style.gridTemplateColumns = '130px repeat(3, 1fr)';
  // header row
  grid.appendChild(document.createElement('div'));
  cols.forEach(c => {
    const el = document.createElement('div');
    el.className = 'heat-col-label';
    el.textContent = c;
    grid.appendChild(el);
  });
  data.forEach((row, i) => {
    const rowLabel = document.createElement('div');
    rowLabel.className = 'heat-row-label';
    rowLabel.textContent = rows[i];
    grid.appendChild(rowLabel);
    row.forEach(v => {
      const cell = document.createElement('div');
      cell.className = 'heat-cell';
      cell.style.background = colorFor(v);
      const t = (v-min)/(max-min);
      cell.style.color = t > 0.5 ? '#fff' : 'var(--ink)';
      cell.textContent = v;
      grid.appendChild(cell);
    });
  });
  container.appendChild(grid);
})();

/* ============================================================
   03 — Bin width builder
   ============================================================ */
(function(){
  const minI = document.getElementById('fdMin'), maxI = document.getElementById('fdMax'), kI = document.getElementById('fdK');
  const result = document.getElementById('fdResult'), steps = document.getElementById('fdSteps');
  if (!minI) return;
  function update(){
    const mn = parseFloat(minI.value), mx = parseFloat(maxI.value), k = parseInt(kI.value,10);
    if (isNaN(mn) || isNaN(mx) || isNaN(k) || k <= 0 || mx <= mn){
      result.textContent = 'Check inputs'; steps.textContent = ''; return;
    }
    const range = mx - mn;
    const width = range / k;
    result.textContent = `Bin width ≈ ${fmt(width, 3)}`;
    steps.textContent = `Range = ${fmt(mx,2)} − ${fmt(mn,2)} = ${fmt(range,2)} → ${fmt(range,2)}/${k} = ${fmt(width,3)}`;
  }
  [minI,maxI,kI].forEach(el => el.addEventListener('input', update));
  update();
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
   04 — Relative frequency toggle table (overall / row / column)
   ============================================================ */
(function(){
  const container = document.getElementById('freqTable');
  const toggleRow = document.getElementById('freqToggleRow');
  const caption = document.getElementById('freqCaption');
  if (!container) return;
  const rows = ["Comm. Services","Cons. Staples","Energy","Health Care","Utilities"];
  const cols = ["Small","Mid","Large"];
  const data = [
    [55,35,20],
    [50,30,30],
    [175,95,20],
    [275,105,55],
    [20,25,10]
  ];
  const rowTotals = data.map(r => r.reduce((a,b)=>a+b,0));
  const colTotals = [0,1,2].map(c => data.reduce((a,r)=>a+r[c],0));
  const grandTotal = rowTotals.reduce((a,b)=>a+b,0);

  function render(mode){
    const table = document.createElement('table');
    table.className = 'exhibit';
    table.style.margin = '0';
    let thead = '<tr><th>Sector</th>' + cols.map(c=>`<th>${c}</th>`).join('') + '<th>Total</th></tr>';
    let body = '';
    data.forEach((row, i) => {
      body += `<tr><td>${rows[i]}</td>`;
      row.forEach((v, j) => {
        let pct;
        if (mode==='overall') pct = v/grandTotal*100;
        else if (mode==='row') pct = v/rowTotals[i]*100;
        else pct = v/colTotals[j]*100;
        body += `<td class="num">${pct.toFixed(1)}%</td>`;
      });
      let rowTotalPct = mode==='overall' ? rowTotals[i]/grandTotal*100 : mode==='row' ? 100 : null;
      body += `<td class="num">${rowTotalPct!==null ? rowTotalPct.toFixed(1)+'%' : '—'}</td></tr>`;
    });
    let footer = '<tr><td><strong>Total</strong></td>';
    cols.forEach((c,j) => {
      let pct = mode==='overall' ? colTotals[j]/grandTotal*100 : mode==='col' ? 100 : null;
      footer += `<td class="num"><strong>${pct!==null ? pct.toFixed(1)+'%' : '—'}</strong></td>`;
    });
    footer += `<td class="num"><strong>100.0%</strong></td></tr>`;
    table.innerHTML = thead + body + footer;
    container.innerHTML = '';
    container.appendChild(table);

    const captions = {
      overall: "Every cell as a share of the full 1,000-stock portfolio.",
      row: "Every cell as a share of its own sector's total — each row sums to 100%.",
      col: "Every cell as a share of its own cap-size total — each column sums to 100%."
    };
    caption.textContent = captions[mode];
  }
  toggleRow.querySelectorAll('.calc-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      toggleRow.querySelectorAll('.calc-tab').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      render(btn.dataset.freqmode);
    });
  });
  render('overall');
})();

/* ============================================================
   06 — Bubble line chart (ABC Inc. revenue + EPS)
   ============================================================ */
(function(){
  const container = document.getElementById('bubbleLineChart');
  if (!container) return;
  const data = [
    {q:'Q1Y1', revenue:3784, eps:1.37},
    {q:'Q2Y1', revenue:4236, eps:1.78},
    {q:'Q3Y1', revenue:4187, eps:-3.38},
    {q:'Q4Y1', revenue:3889, eps:-8.66},
    {q:'Q1Y2', revenue:4097, eps:-0.34},
    {q:'Q2Y2', revenue:5905, eps:3.89},
    {q:'Q3Y2', revenue:4997, eps:-2.88},
    {q:'Q4Y2', revenue:4389, eps:-3.98},
  ];
  const W=560, H=280, padL=54, padR=20, padT=20, padB=34;
  const revenues = data.map(d=>d.revenue);
  const minRev = Math.min(...revenues), maxRev = Math.max(...revenues);
  const xStep = (W-padL-padR)/(data.length-1);
  const yScale = v => (H-padB) - (v-minRev)/(maxRev-minRev)*(H-padT-padB);
  const maxAbsEps = Math.max(...data.map(d=>Math.abs(d.eps)));
  const radiusScale = eps => 4 + (Math.abs(eps)/maxAbsEps)*14;

  const svg = svgEl('svg', {viewBox:`0 0 ${W} ${H}`, width:'100%', style:'max-width:600px;'});
  for (let i=0;i<=4;i++){
    const v = minRev + (maxRev-minRev)*i/4;
    const y = yScale(v);
    svg.appendChild(svgEl('line', {x1:padL, x2:W-padR, y1:y, y2:y, stroke:'#E3DCC9', 'stroke-width':1}));
    const t = svgEl('text', {x:padL-6, y:y+3, 'text-anchor':'end', 'font-family':'IBM Plex Mono', 'font-size':9, fill:'#4A4763'});
    t.textContent = '$'+Math.round(v);
    svg.appendChild(t);
  }
  let d = '';
  data.forEach((pt,i) => {
    const x = padL+i*xStep, y = yScale(pt.revenue);
    d += (i===0?'M':'L')+x+','+y+' ';
  });
  svg.appendChild(svgEl('path', {d, fill:'none', stroke:'#2B2560', 'stroke-width':1.5, 'stroke-dasharray':'3,2'}));
  data.forEach((pt,i) => {
    const x = padL+i*xStep, y = yScale(pt.revenue);
    const r = radiusScale(pt.eps);
    const color = pt.eps >= 0 ? '#2F8F6B' : '#D6573F';
    svg.appendChild(svgEl('circle', {cx:x, cy:y, r, fill:color, 'fill-opacity':0.7, stroke:color, 'stroke-width':1.5}));
    const t = svgEl('text', {x, y:H-14, 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':8, fill:'#4A4763'});
    t.textContent = pt.q;
    svg.appendChild(t);
  });
  container.appendChild(svg);
  const legend = document.createElement('div');
  legend.style.display='flex'; legend.style.gap='16px'; legend.style.marginTop='8px'; legend.style.fontFamily='var(--font-mono)'; legend.style.fontSize='.72rem';
  legend.innerHTML = `<span><span style="display:inline-block;width:10px;height:10px;background:#2F8F6B;border-radius:50%;margin-right:5px;"></span>Profitable quarter (bubble size = |EPS|)</span><span><span style="display:inline-block;width:10px;height:10px;background:#D6573F;border-radius:50%;margin-right:5px;"></span>Loss-making quarter</span>`;
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
const sectionIds = ['sec-types','sec-organizing','sec-frequency','sec-contingency','sec-histogram','sec-linescatter','sec-scatter','sec-barcharts','sec-treewords','sec-heatguide','sec-quiz'];
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
  try { localStorage.setItem('cfa-progress-organizing-viz', String(pct)); } catch(e) {}
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
    concept: "Data Types",
    q: "A dataset records each company's GICS sector using codes 10, 15, 20, …, 60. What type of data are these codes?",
    opts: ["Continuous numerical data", "Nominal categorical data (coded numerically)", "Ordinal categorical data"],
    correct: 1,
    exp: "The codes are just labels with no meaningful order or arithmetic — classic nominal data, even though they're written as numbers."
  },
  {
    concept: "Data Types",
    q: "You record the P/E ratio of 50 companies at a single point in time. This is:",
    opts: ["Time-series data", "Cross-sectional data", "Panel data"],
    correct: 1,
    exp: "Many observational units (companies), one variable, one point in time — the definition of cross-sectional data."
  },
  {
    concept: "Organizing Data",
    q: "A quarterly EPS dataset for 3 companies over 4 quarters, arranged as a table, is:",
    opts: ["Panel data", "Purely cross-sectional data", "Purely time-series data"],
    correct: 0,
    exp: "It mixes multiple observational units (companies) with multiple time periods (quarters) — the definition of panel data."
  },
  {
    concept: "Frequency Distributions",
    q: "A dataset has minimum −8 and maximum 24. Using 8 bins, what is the bin width?",
    opts: ["3", "4", "2"],
    correct: 1,
    exp: "Range = 24 − (−8) = 32. Bin width = 32 / 8 = 4."
  },
  {
    concept: "Frequency Distributions",
    q: "In a frequency distribution table, the cumulative relative frequency of the very last bin must always equal:",
    opts: ["0%", "50%", "100%"],
    correct: 2,
    exp: "By definition, cumulating the relative frequency of every bin up through the last one captures the entire dataset — 100%."
  },
  {
    concept: "Contingency Tables",
    q: "In a contingency table, the row and column totals are called:",
    opts: ["Joint frequencies", "Marginal frequencies", "Cumulative frequencies"],
    correct: 1,
    exp: "The totals along the edges of a contingency table — summing across a row or down a column — are marginal frequencies."
  },
  {
    concept: "Contingency Tables",
    q: "A classification model's contingency table of predicted vs. actual outcomes is specifically called a:",
    opts: ["Frequency polygon", "Confusion matrix", "Heat map"],
    correct: 1,
    exp: "A 2×2 (or R×C) contingency table comparing predicted vs. actual classifications is called a confusion matrix."
  },
  {
    concept: "Contingency Tables",
    q: "Dividing every cell in a contingency table by its own row's total answers which question?",
    opts: ["What share of the whole dataset is this cell?", "Within this row's category, how is it split across the columns?", "Within this column's category, how is it split across the rows?"],
    correct: 1,
    exp: "Dividing by the row total normalizes each row to sum to 100%, showing how that row's category breaks down across the column categories."
  },
  {
    concept: "Histograms & Frequency Polygons",
    q: "On a histogram, the tallest bar corresponds to the:",
    opts: ["Median bin", "Modal bin", "Mean bin"],
    correct: 1,
    exp: "The bin with the highest frequency — the tallest bar — is called the modal interval."
  },
  {
    concept: "Line & Bubble Line Charts",
    q: "You want one chart showing a company's quarterly revenue over time, with bubble size showing the magnitude of that quarter's EPS. This is a:",
    opts: ["Scatter plot matrix", "Bubble line chart", "Tree-map"],
    correct: 1,
    exp: "A bubble line chart extends a line chart with a third dimension (bubble size, often also color) — exactly this use case."
  },
  {
    concept: "Scatter Plots & Matrices",
    q: "A scatter plot of two variables shows points tightly hugging an upward-sloping line. This indicates:",
    opts: ["No relationship", "A strong positive relationship", "A strong negative relationship"],
    correct: 1,
    exp: "Tight clustering along an upward-sloping line is the visual signature of a strong positive relationship."
  },
  {
    concept: "Scatter Plots & Matrices",
    q: "You need to inspect the pairwise relationships among six different candidate factors before building a model. The most efficient single chart for this is a:",
    opts: ["Single scatter plot", "Scatter plot matrix", "Bar chart"],
    correct: 1,
    exp: "A scatter plot matrix arranges every pairwise comparison among multiple variables into one grid, letting you scan all relationships at once."
  },
  {
    concept: "Bar Charts",
    q: "You want a chart where each sector's total bar height instantly shows you that sector's overall (marginal) frequency, while still breaking each bar down by market cap. Which chart type?",
    opts: ["Grouped bar chart", "Stacked bar chart", "Scatter plot"],
    correct: 1,
    exp: "A stacked bar chart's total bar height equals the marginal frequency, with segments showing the sub-group breakdown."
  },
  {
    concept: "Bar Charts",
    q: "A vertical bar chart's y-axis starts at 80 instead of 0, making small differences in sales look dramatic. This is an example of:",
    opts: ["Correct use of a bar chart", "A misleading truncated axis", "A scatter plot matrix"],
    correct: 1,
    exp: "A y-axis that doesn't start at zero exaggerates the visual difference between bars — a classic charting pitfall."
  },
  {
    concept: "Tree-Maps & Word Clouds",
    q: "Which visualization uses rectangle area, rather than length or height, to represent magnitude?",
    opts: ["Bar chart", "Tree-map", "Line chart"],
    correct: 1,
    exp: "A tree-map's defining feature is using the area of each rectangle to represent its relative magnitude."
  },
  {
    concept: "Tree-Maps & Word Clouds",
    q: "Which visualization is best suited to representing unstructured text data, like an earnings call transcript?",
    opts: ["Word cloud", "Scatter plot", "Heat map"],
    correct: 0,
    exp: "A word cloud sizes words by frequency of appearance, making it the standard tool for visualizing unstructured text."
  },
  {
    concept: "Heat Maps & Choosing Charts",
    q: "A heat map is often used to visualize which of the following?",
    opts: ["A single variable's frequency distribution", "A correlation matrix among several variables", "A one-dimensional array"],
    correct: 1,
    exp: "Heat maps are a standard way to represent a full correlation matrix — color intensity showing the strength of each pairwise relationship at a glance."
  },
  {
    concept: "Scatter Plots & Matrices",
    q: "Exploring whether two numerical variables are related is best done with a:",
    opts: ["Bar chart", "Scatter plot", "Word cloud"],
    correct: 1,
    exp: "A scatter plot is purpose-built for visually assessing the relationship between two numerical variables."
  },
  {
    concept: "Tree-Maps & Word Clouds",
    q: "A tree-map becomes hard to interpret once it nests more than about how many levels of hierarchy?",
    opts: ["One", "Three", "Ten"],
    correct: 1,
    exp: "Tree-maps are best kept to roughly two or three nested levels (e.g., sector → cap size) before they become too visually dense to read clearly."
  },
  {
    concept: "Line & Bubble Line Charts",
    q: "You are comparing quarterly sales for two products over the same 12 quarters and want to clearly show the trend for each over time. The best chart is a:",
    opts: ["Line chart with two series", "Heat map", "Word cloud"],
    correct: 0,
    exp: "A line chart with two data series is the standard way to compare how two time series trend against each other."
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
          cfaRecordAnswer(item.concept, "Organizing & Visualizing Data", i === item.correct);
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
