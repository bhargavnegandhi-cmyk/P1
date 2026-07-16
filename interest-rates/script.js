// ============================================================
// Interest Rates, Present Value & Future Value — interactivity
// ============================================================

function fmtMoney(n){
  if (!isFinite(n)) return "—";
  const sign = n < 0 ? "-" : "";
  return sign + "$" + Math.abs(n).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2});
}
function fmtNum(n, d=4){
  if (!isFinite(n)) return "—";
  return n.toFixed(d);
}
function svgEl(tag, attrs){
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const k in attrs) el.setAttribute(k, attrs[k]);
  return el;
}

/* ============================================================
   Reusable timeline diagram builder
   ============================================================ */
function drawTimeline(container, {periods, marks, title}){
  container.innerHTML = '';
  if (title){
    const h = document.createElement('div');
    h.style.fontFamily = 'var(--font-mono)'; h.style.fontSize = '.72rem'; h.style.color = 'var(--ink-soft)';
    h.style.marginBottom = '10px'; h.style.textTransform = 'uppercase'; h.style.letterSpacing = '.05em';
    h.textContent = title;
    container.appendChild(h);
  }
  const W = 560, H = 110, padL = 40, padR = 40;
  const step = (W - padL - padR) / periods;
  const svg = svgEl('svg', {viewBox:`0 0 ${W} ${H}`, width:'100%', class:'timeline-svg', style:'max-width:600px;'});
  const y = 40;
  svg.appendChild(svgEl('line', {x1:padL, x2:W-padR, y1:y, y2:y, stroke:'#4A4763', 'stroke-width':1.5}));
  for (let t=0; t<=periods; t++){
    const x = padL + t*step;
    svg.appendChild(svgEl('line', {x1:x, x2:x, y1:y-6, y2:y+6, stroke:'#4A4763', 'stroke-width':1.5}));
    const lbl = svgEl('text', {x:x, y:y+22, 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':10, fill:'#1C1B29'});
    lbl.textContent = t;
    svg.appendChild(lbl);
  }
  (marks||[]).forEach(m => {
    const x = padL + m.t*step;
    const ty = m.above ? y-16 : y+40;
    const txt = svgEl('text', {x:x, y:ty, 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':10, fill: m.color||'#2B2560', 'font-weight':'600'});
    txt.textContent = m.label;
    svg.appendChild(txt);
    svg.appendChild(svgEl('circle', {cx:x, cy:y, r:4, fill: m.color||'#E8A33D', stroke:'#2B2560', 'stroke-width':1}));
  });
  container.appendChild(svg);
}

/* Timeline 1 — PV growing to FV */
(function(){
  const el = document.getElementById('timeline1');
  if (!el) return;
  drawTimeline(el, {
    periods: 5,
    title: 'PV at t=0 grows to FV at t=N',
    marks: [
      {t:0, label:'PV', above:true, color:'#2F8F6B'},
      {t:5, label:'FV₅ = PV(1+r)⁵', above:false, color:'#C77F1E'}
    ]
  });
})();

/* Timeline — ordinary annuity */
(function(){
  const el = document.getElementById('timeline-annuity');
  if (!el) return;
  drawTimeline(el, {
    periods: 5,
    title: 'Ordinary annuity — 5 payments, first at t=1',
    marks: [1,2,3,4,5].map(t => ({t, label:'A', above:false, color:'#2B2560'}))
  });
})();

/* Timeline — additivity */
(function(){
  const el = document.getElementById('timeline-additivity');
  if (!el) return;
  drawTimeline(el, {
    periods: 2,
    title: 'Series A + Series B = combined series',
    marks: [
      {t:1, label:'$300', above:false, color:'#2B2560'},
      {t:2, label:'$300', above:false, color:'#2B2560'},
    ]
  });
})();

/* ============================================================
   02 — Lump sum FV/PV/r/N solver
   ============================================================ */
(function(){
  const pvI = document.getElementById('lumpPV'), rI = document.getElementById('lumpR'),
        nI = document.getElementById('lumpN'), fvI = document.getElementById('lumpFV');
  const result = document.getElementById('lumpResult'), steps = document.getElementById('lumpSteps');
  const solveRow = document.getElementById('lumpSolveRow');
  if (!pvI) return;
  let solving = 'FV';

  function setSolving(mode){
    solving = mode;
    const idMap = {PV:'lumpPV', r:'lumpR', N:'lumpN', FV:'lumpFV'};
    const fieldMap = {PV:'lumpField-PV', r:'lumpField-r', N:'lumpField-N', FV:'lumpField-FV'};
    ['PV','r','N','FV'].forEach(k => {
      const field = document.getElementById(fieldMap[k]);
      const input = document.getElementById(idMap[k]);
      if (k === solving){
        field.classList.add('solving');
        input.readOnly = true;
      } else {
        field.classList.remove('solving');
        input.readOnly = false;
      }
    });
    solveRow.querySelectorAll('.tvm-solve-btn').forEach(b => b.classList.toggle('active', b.dataset.solve === mode));
    update();
  }

  function update(){
    const PV = parseFloat(pvI.value), rPct = parseFloat(rI.value), N = parseFloat(nI.value), FV = parseFloat(fvI.value);
    const r = rPct/100;
    try {
      if (solving === 'FV'){
        const fv = PV * Math.pow(1+r, N);
        fvI.value = fv.toFixed(2);
        result.textContent = `FV = ${fmtMoney(fv)}`;
        steps.textContent = `${PV} × (1+${fmtNum(r,4)})^${N} = ${fmtMoney(fv)}`;
      } else if (solving === 'PV'){
        const pv = FV / Math.pow(1+r, N);
        pvI.value = pv.toFixed(2);
        result.textContent = `PV = ${fmtMoney(pv)}`;
        steps.textContent = `${FV} / (1+${fmtNum(r,4)})^${N} = ${fmtMoney(pv)}`;
      } else if (solving === 'r'){
        const rate = Math.pow(FV/PV, 1/N) - 1;
        rI.value = (rate*100).toFixed(3);
        result.textContent = `r = ${(rate*100).toFixed(3)}%`;
        steps.textContent = `(${FV}/${PV})^(1/${N}) − 1 = ${(rate*100).toFixed(3)}%`;
      } else if (solving === 'N'){
        const n = Math.log(FV/PV) / Math.log(1+r);
        nI.value = n.toFixed(3);
        result.textContent = `N = ${n.toFixed(3)}`;
        steps.textContent = `ln(${FV}/${PV}) / ln(1+${fmtNum(r,4)}) = ${n.toFixed(3)}`;
      }
    } catch(e){ result.textContent = 'Check inputs'; steps.textContent=''; }
  }

  solveRow.querySelectorAll('.tvm-solve-btn').forEach(btn => {
    btn.addEventListener('click', () => setSolving(btn.dataset.solve));
  });
  [pvI,rI,nI,fvI].forEach(el => el.addEventListener('input', update));
  setSolving('FV');
})();

/* ============================================================
   03 — Compounding frequency chart
   ============================================================ */
(function(){
  const container = document.getElementById('compoundingChart');
  if (!container) return;
  const rs = 0.08;
  const freqs = [
    {label:'Annual', m:1},
    {label:'Semiannual', m:2},
    {label:'Quarterly', m:4},
    {label:'Monthly', m:12},
    {label:'Daily', m:365},
  ];
  const values = freqs.map(f => ({label:f.label, val: Math.pow(1+rs/f.m, f.m)}));
  values.push({label:'Continuous', val: Math.exp(rs)});
  const min = Math.min(...values.map(v=>v.val));
  const max = Math.max(...values.map(v=>v.val));
  const rows = document.createElement('div');
  values.forEach(v => {
    const row = document.createElement('div');
    row.style.display='flex'; row.style.alignItems='center'; row.style.gap='10px'; row.style.margin='6px 0';
    const lbl = document.createElement('div');
    lbl.style.width='110px'; lbl.style.fontFamily='var(--font-mono)'; lbl.style.fontSize='.75rem'; lbl.style.color='var(--ink-soft)';
    lbl.textContent = v.label;
    const track = document.createElement('div');
    track.style.flex='1'; track.style.background='var(--paper-dim)'; track.style.borderRadius='4px'; track.style.height='20px'; track.style.position='relative';
    const bar = document.createElement('div');
    const pct = (v.val - min*0.999) / (max - min*0.999) * 100;
    bar.style.height='100%'; bar.style.width = Math.max(4,pct)+'%'; bar.style.background='var(--indigo)'; bar.style.borderRadius='4px';
    track.appendChild(bar);
    const valLbl = document.createElement('div');
    valLbl.style.width='90px'; valLbl.style.fontFamily='var(--font-mono)'; valLbl.style.fontSize='.75rem';
    valLbl.textContent = '$' + v.val.toFixed(6);
    row.appendChild(lbl); row.appendChild(track); row.appendChild(valLbl);
    rows.appendChild(row);
  });
  container.appendChild(rows);
})();

/* ============================================================
   03b — EAR calculator
   ============================================================ */
(function(){
  const rsI = document.getElementById('earRs'), mI = document.getElementById('earM'), contC = document.getElementById('earContinuous');
  const result = document.getElementById('earResult'), steps = document.getElementById('earSteps');
  if (!rsI) return;
  function update(){
    const rs = parseFloat(rsI.value)/100;
    const m = parseInt(mI.value,10);
    if (contC.checked){
      const ear = Math.exp(rs) - 1;
      result.textContent = `EAR = ${(ear*100).toFixed(2)}%`;
      steps.textContent = `e^${fmtNum(rs,4)} − 1 = ${(ear*100).toFixed(2)}%`;
      mI.disabled = true;
    } else {
      mI.disabled = false;
      const ear = Math.pow(1 + rs/m, m) - 1;
      result.textContent = `EAR = ${(ear*100).toFixed(2)}%`;
      steps.textContent = `(1 + ${fmtNum(rs,4)}/${m})^${m} − 1 = ${(ear*100).toFixed(2)}%`;
    }
  }
  [rsI,mI,contC].forEach(el => el.addEventListener('input', update));
  update();
})();

/* ============================================================
   06 — Annuity PV/FV/A/N solver (ordinary or due)
   ============================================================ */
(function(){
  const aI = document.getElementById('annA'), rI = document.getElementById('annR'), nI = document.getElementById('annN'),
        pvI = document.getElementById('annPV'), fvI = document.getElementById('annFV');
  const result = document.getElementById('annResult'), steps = document.getElementById('annSteps');
  const solveRow = document.getElementById('annSolveRow');
  if (!aI) return;
  let solving = 'PV';

  function isDue(){
    return document.querySelector('input[name="annType"]:checked').value === 'due';
  }

  function setSolving(mode){
    solving = mode;
    const idMap = {A:'annA', r:'annR', N:'annN', PV:'annPV', FV:'annFV'};
    const fieldMap = {A:'annField-A', r:'annField-r', N:'annField-N', PV:'annField-PV', FV:'annField-FV'};
    ['A','r','N','PV','FV'].forEach(k => {
      const field = document.getElementById(fieldMap[k]);
      const input = document.getElementById(idMap[k]);
      if (!field) return;
      if (k === solving){ field.classList.add('solving'); input.readOnly = true; }
      else { field.classList.remove('solving'); if (k !== 'r') input.readOnly = false; }
    });
    solveRow.querySelectorAll('.tvm-solve-btn').forEach(b => b.classList.toggle('active', b.dataset.solve === mode));
    update();
  }

  function update(){
    const A = parseFloat(aI.value), rPct = parseFloat(rI.value), N = parseFloat(nI.value);
    const r = rPct/100;
    const due = isDue();
    const dueMult = due ? (1+r) : 1;
    try {
      if (solving === 'PV'){
        const factor = (1 - Math.pow(1+r, -N)) / r;
        const pv = A * factor * dueMult;
        pvI.value = pv.toFixed(2);
        const fv = pv * Math.pow(1+r, N);
        fvI.value = fv.toFixed(2);
        result.textContent = `PV = ${fmtMoney(pv)}`;
        steps.textContent = `${A} × [1 − (1+${fmtNum(r,4)})^−${N}]/${fmtNum(r,4)}${due ? ' × (1+r)':''} = ${fmtMoney(pv)}`;
      } else if (solving === 'FV'){
        const factor = (Math.pow(1+r, N) - 1) / r;
        const fv = A * factor * dueMult;
        fvI.value = fv.toFixed(2);
        const pv = fv / Math.pow(1+r, N);
        pvI.value = pv.toFixed(2);
        result.textContent = `FV = ${fmtMoney(fv)}`;
        steps.textContent = `${A} × [(1+${fmtNum(r,4)})^${N} − 1]/${fmtNum(r,4)}${due ? ' × (1+r)':''} = ${fmtMoney(fv)}`;
      } else if (solving === 'A'){
        const PV = parseFloat(pvI.value) || 0;
        const factor = (1 - Math.pow(1+r, -N)) / r * dueMult;
        const a = PV / factor;
        aI.value = a.toFixed(2);
        result.textContent = `A = ${fmtMoney(a)}`;
        steps.textContent = `${PV} / {[1 − (1+${fmtNum(r,4)})^−${N}]/${fmtNum(r,4)}${due?' × (1+r)':''}} = ${fmtMoney(a)}`;
      } else if (solving === 'N'){
        const PV = parseFloat(pvI.value) || 0;
        // N = -ln(1 - PV*r/(A*dueMult)) / ln(1+r)
        const denom = A * dueMult;
        const inner = 1 - (PV * r) / denom;
        const n = -Math.log(inner) / Math.log(1+r);
        nI.value = n.toFixed(3);
        result.textContent = `N = ${n.toFixed(3)}`;
        steps.textContent = `−ln(1 − PV×r/A${due?'×(1+r)':''}) / ln(1+r) = ${n.toFixed(3)}`;
      }
    } catch(e){ result.textContent = 'Check inputs'; steps.textContent=''; }
  }

  solveRow.querySelectorAll('.tvm-solve-btn').forEach(btn => {
    btn.addEventListener('click', () => setSolving(btn.dataset.solve));
  });
  [aI,rI,nI,pvI,fvI].forEach(el => el.addEventListener('input', update));
  document.querySelectorAll('input[name="annType"]').forEach(el => el.addEventListener('change', update));
  setSolving('PV');
})();

/* ============================================================
   07 — Perpetuity calculator (with deferred start)
   ============================================================ */
(function(){
  const aI = document.getElementById('perpA'), rI = document.getElementById('perpR'), tI = document.getElementById('perpT');
  const result = document.getElementById('perpResult'), steps = document.getElementById('perpSteps');
  if (!aI) return;
  function update(){
    const A = parseFloat(aI.value), r = parseFloat(rI.value)/100, t = parseInt(tI.value,10);
    const pvAtDeferPoint = A / r; // value one period before first payment
    const deferPeriods = t - 1; // periods to discount back from (t-1) to 0
    const pv0 = pvAtDeferPoint / Math.pow(1+r, deferPeriods);
    result.textContent = `PV₀ = ${fmtMoney(pv0)}`;
    if (deferPeriods === 0){
      steps.textContent = `PV: A/r = ${A}/${fmtNum(r,4)} = ${fmtMoney(pvAtDeferPoint)} (first payment at t=1, so this is already PV₀)`;
    } else {
      steps.textContent = `PV at t=${t-1}: A/r = ${fmtMoney(pvAtDeferPoint)}; discount back ${deferPeriods} periods: ${fmtMoney(pvAtDeferPoint)}/(1+${fmtNum(r,4)})^${deferPeriods} = ${fmtMoney(pv0)}`;
    }
  }
  [aI,rI,tI].forEach(el => el.addEventListener('input', update));
  update();
})();

/* ============================================================
   08 — Rule of 72 vs exact
   ============================================================ */
(function(){
  const rI = document.getElementById('ruleR');
  const out = document.getElementById('ruleOut');
  if (!rI) return;
  function update(){
    const rPct = parseFloat(rI.value);
    const r = rPct/100;
    const rule72 = 72 / rPct;
    const exact = Math.log(2) / Math.log(1+r);
    out.innerHTML = `
      <div class="stat-readout"><div class="k">Rule of 72</div><div class="v">${fmtNum(rule72,2)} yrs</div></div>
      <div class="stat-readout"><div class="k">Exact (ln)</div><div class="v">${fmtNum(exact,2)} yrs</div></div>
    `;
  }
  rI.addEventListener('input', update);
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
   Sidebar scroll-spy + progress + mobile toggle
   ============================================================ */
const sectionIds = ['sec-rates','sec-fvlump','sec-compounding','sec-fvannuity','sec-pvlump','sec-pvannuity','sec-perpetuity','sec-solving','sec-payment','sec-additivity','sec-quiz'];
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
  try { localStorage.setItem('cfa-progress-interest-rates', String(pct)); } catch(e) {}
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
    concept: "Interest Rates",
    q: "A bond's interest rate is described as compensating investors for expected inflation and the real time preference for consumption. Together, these two components make up the:",
    opts: ["Default risk premium", "Nominal risk-free rate", "Maturity premium"],
    correct: 1,
    exp: "The real risk-free rate plus the inflation premium together form the nominal risk-free rate — approximated by short-term government bills."
  },
  {
    concept: "Interest Rates",
    q: "Two otherwise-identical bonds differ only in that one trades infrequently in a thin market. The thinly-traded bond's higher yield primarily compensates for:",
    opts: ["Default risk", "Liquidity risk", "Maturity risk"],
    correct: 1,
    exp: "Difficulty selling an investment quickly without moving its price is precisely what the liquidity premium compensates for."
  },
  {
    concept: "Future Value of a Lump Sum",
    q: "$8,000 is invested for 4 years at 6% compounded annually. What is the future value?",
    opts: ["$9,920.00", "$10,099.13", "$8,480.00"],
    correct: 1,
    exp: "FV = $8,000 × (1.06)⁴ = $8,000 × 1.262477 = $10,099.13."
  },
  {
    concept: "Compounding Frequency & EAR",
    q: "Which is true about compounding, holding the stated annual rate fixed?",
    opts: ["More frequent compounding always produces a smaller ending amount", "More frequent compounding always produces a larger ending amount", "Compounding frequency never affects the ending amount"],
    correct: 1,
    exp: "More frequent compounding means interest starts earning its own interest sooner, so the ending amount rises with compounding frequency, up to the continuous-compounding limit."
  },
  {
    concept: "Compounding Frequency & EAR",
    q: "A rate of 10% is compounded semiannually. What is the effective annual rate?",
    opts: ["10.00%", "10.25%", "10.50%"],
    correct: 1,
    exp: "EAR = (1 + 0.10/2)² − 1 = (1.05)² − 1 = 1.1025 − 1 = 10.25%."
  },
  {
    concept: "Compounding Frequency & EAR",
    q: "A rate of 9% is compounded continuously. What is the effective annual rate (to two decimals)?",
    opts: ["9.00%", "9.42%", "9.81%"],
    correct: 1,
    exp: "EAR = e^0.09 − 1 = 1.094174 − 1 = 9.42%."
  },
  {
    concept: "Future Value of an Annuity",
    q: "An ordinary annuity pays $500 at the end of each year for 8 years, earning 7% annually. What is the future value annuity factor?",
    opts: ["8.000", "10.260", "1.718"],
    correct: 1,
    exp: "[(1.07)⁸ − 1] / 0.07 = [1.718186 − 1] / 0.07 ≈ 10.260."
  },
  {
    concept: "Future Value of an Annuity",
    q: "You must compute the future value of a stream of cash flows that are all different amounts. What's the correct approach?",
    opts: ["Use the ordinary annuity FV formula with the average cash flow", "Compound each individual cash flow forward to the same date and sum them", "Use the perpetuity formula"],
    correct: 1,
    exp: "Unequal cash flow streams have no shortcut formula — each cash flow must be compounded (or discounted) individually to a common date, then summed."
  },
  {
    concept: "Present Value of a Lump Sum",
    q: "A payment of $50,000 is due in 8 years. At a 6% discount rate, what is its present value?",
    opts: ["$29,000.00", "$31,370.62", "$50,000.00"],
    correct: 1,
    exp: "PV = $50,000 × (1.06)⁻⁸ = $50,000 × 0.627412 = $31,370.62."
  },
  {
    concept: "Present Value of a Lump Sum",
    q: "Holding the discount rate constant, how does present value change as a payment is pushed further into the future?",
    opts: ["It increases", "It decreases", "It stays the same"],
    correct: 1,
    exp: "The present value factor (1+r)⁻ᴺ shrinks as N grows, so a more distant payment is always worth less today, all else equal."
  },
  {
    concept: "Present Value of an Annuity",
    q: "An ordinary annuity of $2,000 per year for 6 years is discounted at 9%. What is the present value annuity factor?",
    opts: ["4.486", "6.000", "1.677"],
    correct: 0,
    exp: "[1 − (1.09)⁻⁶] / 0.09 = [1 − 0.596267]/0.09 ≈ 4.486."
  },
  {
    concept: "Present Value of an Annuity",
    q: "An annuity due and an ordinary annuity have identical payment amounts, rates, and number of periods. How do their present values compare?",
    opts: ["The annuity due's PV equals the ordinary annuity's PV", "The annuity due's PV is (1+r) times larger", "The ordinary annuity's PV is larger"],
    correct: 1,
    exp: "Every payment in an annuity due is discounted one less period than the corresponding ordinary annuity payment, so PV(due) = PV(ordinary) × (1+r)."
  },
  {
    concept: "Perpetuities",
    q: "A perpetuity pays $75 per year forever, starting one year from now, at a 6% discount rate. What is its present value?",
    opts: ["$450", "$1,250", "$12.50"],
    correct: 1,
    exp: "PV = A/r = $75/0.06 = $1,250."
  },
  {
    concept: "Perpetuities",
    q: "A perpetuity of $60 per year has its first payment at t = 6. At a 5% discount rate, what is the correct first step to value it today?",
    opts: ["Divide $60 by 0.05 directly to get today's PV", "Value it as an ordinary perpetuity as of t = 5, then discount that value back 5 periods", "Value it as an ordinary perpetuity as of t = 6"],
    correct: 1,
    exp: "A deferred perpetuity is first valued one period before its first payment (here, t = 5, since payments start at t = 6), then that lump sum is discounted back to today."
  },
  {
    concept: "Rates, Growth & Number of Periods",
    q: "A company's revenue grew from $200M to $350M over 7 years. What is the compound annual growth rate?",
    opts: ["10.71%", "8.30%", "75.00%"],
    correct: 1,
    exp: "g = (350/200)^(1/7) − 1 = (1.75)^0.1429 − 1 ≈ 8.30%. The 75% figure is total growth over the period, not annualized."
  },
  {
    concept: "Rates, Growth & Number of Periods",
    q: "Using the Rule of 72, approximately how many years does it take an investment to double at a 9% annual rate?",
    opts: ["6 years", "8 years", "9 years"],
    correct: 1,
    exp: "72 / 9 = 8 years, a close approximation to the exact figure of ln(2)/ln(1.09) ≈ 8.04 years."
  },
  {
    concept: "Size of Annuity Payments",
    q: "A loan of $20,000 is to be repaid with equal annual payments over 5 years at 7% interest. Using a present value annuity factor of 4.100197, what is the annual payment?",
    opts: ["$4,000.00", "$4,878.30", "$2,857.14"],
    correct: 1,
    exp: "A = PV / annuity factor = $20,000 / 4.100197 ≈ $4,878.30."
  },
  {
    concept: "Equivalence & Additivity",
    q: "The cash flow additivity principle states that cash flows can be added or subtracted directly only when they are:",
    opts: ["Denominated in the same currency", "Indexed at the same point in time", "Both annuities"],
    correct: 1,
    exp: "Money can only be combined arithmetically once every amount is expressed as of the same date — that's the additivity principle."
  },
  {
    concept: "Equivalence & Additivity",
    q: "Series A pays $50 at t=1 and t=2; Series B pays $150 at t=1 and t=2. At 4% interest, what is the future value of the combined series (A+B) at t=2?",
    opts: ["$200.00", "$208.00", "$408.00"],
    correct: 1,
    exp: "Combined payment each period is $200. FV = $200(1.04) + $200 = $208 + $200 = $408. (Check: $208 alone is just the first payment compounded one period — the full FV of the combined series is $408.)"
  },
  {
    concept: "Present Value of an Annuity",
    q: "A pension fund manager needs the present value of an annuity whose first payment occurs at t = 11, not t = 1. What is the appropriate first step?",
    opts: ["Apply the ordinary annuity formula directly with N equal to the number of payments, treating the answer as PV at t = 0", "Compute the annuity's value as of t = 10 (one period before the first payment), then discount that value back to t = 0", "Compute the annuity's value as of t = 11"],
    correct: 1,
    exp: "Just like a deferred perpetuity, a deferred annuity is first valued one period before its first payment (t = 10 here), then that value is discounted back to today."
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
          cfaRecordAnswer(item.concept, "Interest Rates, PV & FV", i === item.correct);
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
