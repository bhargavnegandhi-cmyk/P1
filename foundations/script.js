// ============================================================
// Math Foundations for CFA Quant — interactivity
// ============================================================

function parseNums(str){
  return str.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
}
function mean(arr){ return arr.reduce((a,b)=>a+b,0) / arr.length; }
function fmt(n, d=4){ return isFinite(n) ? n.toFixed(d) : "—"; }
function svgEl(tag, attrs){
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const k in attrs) el.setAttribute(k, attrs[k]);
  return el;
}

/* ============================================================
   01 — Exponent explorer
   ============================================================ */
(function(){
  const xI = document.getElementById('expX'), nI = document.getElementById('expN');
  const chart = document.getElementById('expChart'), result = document.getElementById('expResult'), steps = document.getElementById('expSteps');
  if (!xI) return;
  function render(){
    const x = parseFloat(xI.value), n = parseInt(nI.value,10);
    const val = Math.pow(x, n);
    result.textContent = `${x}${superscript(n)} = ${fmt(val,4)}`;
    if (n >= 0 && Number.isInteger(n) && n <= 12){
      const chain = new Array(Math.max(n,1)).fill(x).join(' × ');
      steps.textContent = n === 0 ? `${x}⁰ = 1 (by definition)` : `${chain} = ${fmt(val,4)}`;
    } else if (n < 0) {
      steps.textContent = `1 / (${x}${superscript(-n)}) = 1 / ${fmt(Math.pow(x,-n),4)} = ${fmt(val,4)}`;
    } else {
      steps.textContent = `${x}^${n} = ${fmt(val,4)}`;
    }
    // mini bar chart showing growth across n=0..n
    chart.innerHTML = '';
    const maxN = Math.max(1, Math.min(10, Math.round(Math.abs(n))));
    const wrap = document.createElement('div');
    wrap.style.display='flex'; wrap.style.gap='3px'; wrap.style.alignItems='flex-end'; wrap.style.height='90px';
    const values = [];
    for (let i=0; i<=maxN; i++) values.push(Math.pow(x, n>=0 ? i : -i));
    const maxVal = Math.max(...values.map(v=>Math.abs(v)), 1);
    values.forEach((v,i) => {
      const col = document.createElement('div');
      col.style.flex='1'; col.style.display='flex'; col.style.flexDirection='column'; col.style.alignItems='center'; col.style.justifyContent='flex-end'; col.style.height='100%';
      const bar = document.createElement('div');
      bar.style.width='100%'; bar.style.height=Math.max(2,Math.min(70,(Math.abs(v)/maxVal*70)))+'px'; bar.style.background='var(--indigo)'; bar.style.borderRadius='2px 2px 0 0';
      col.appendChild(bar);
      const lbl = document.createElement('div');
      lbl.style.fontFamily='var(--font-mono)'; lbl.style.fontSize='.6rem'; lbl.style.marginTop='3px'; lbl.style.color='var(--ink-soft)';
      lbl.textContent = n>=0 ? i : -i;
      col.appendChild(lbl);
      wrap.appendChild(col);
    });
    chart.appendChild(wrap);
  }
  function superscript(n){
    const map = {'0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹','-':'⁻'};
    return String(n).split('').map(c => map[c] || c).join('');
  }
  [xI,nI].forEach(el => el.addEventListener('input', render));
  render();
})();

/* ============================================================
   02 — Natural log calculator
   ============================================================ */
(function(){
  const xI = document.getElementById('lnX');
  const result = document.getElementById('lnResult'), steps = document.getElementById('lnSteps');
  if (!xI) return;
  function render(){
    const x = parseFloat(xI.value);
    if (isNaN(x) || x <= 0){ result.textContent = 'x must be positive'; steps.textContent=''; return; }
    const val = Math.log(x);
    result.textContent = `ln(${x}) = ${fmt(val,4)}`;
    steps.textContent = `e^${fmt(val,4)} ≈ ${x} — that's the defining relationship`;
  }
  xI.addEventListener('input', render);
  render();
})();

/* ============================================================
   03 — Summation calculator
   ============================================================ */
(function(){
  const input = document.getElementById('sumInput');
  const result = document.getElementById('sumResult'), steps = document.getElementById('sumSteps');
  if (!input) return;
  function mode(){ return document.querySelector('input[name="sumMode"]:checked').value; }
  function render(){
    const arr = parseNums(input.value);
    if (arr.length === 0){ result.textContent = 'Enter numbers'; steps.textContent=''; return; }
    const m = mode();
    if (m === 'plain'){
      const sum = arr.reduce((a,b)=>a+b,0);
      result.textContent = `Σ = ${fmt(sum,2)}`;
      steps.textContent = arr.join(' + ') + ` = ${fmt(sum,2)}`;
    } else if (m === 'squared'){
      const squares = arr.map(v=>v*v);
      const sum = squares.reduce((a,b)=>a+b,0);
      result.textContent = `Σ = ${fmt(sum,2)}`;
      steps.textContent = squares.map((v,i)=>`${arr[i]}²`).join(' + ') + ` = ` + squares.map(v=>fmt(v,1)).join(' + ') + ` = ${fmt(sum,2)}`;
    } else {
      const xbar = mean(arr);
      const devs = arr.map(v=>Math.pow(v-xbar,2));
      const sum = devs.reduce((a,b)=>a+b,0);
      result.textContent = `Σ = ${fmt(sum,2)}`;
      steps.textContent = `X̄=${fmt(xbar,2)} · ` + arr.map(v=>`(${v}−${fmt(xbar,2)})²`).join(' + ') + ` = ${fmt(sum,2)}`;
    }
  }
  input.addEventListener('input', render);
  document.querySelectorAll('input[name="sumMode"]').forEach(el => el.addEventListener('change', render));
  render();
})();

/* ============================================================
   05 — Venn diagram (clickable regions)
   ============================================================ */
(function(){
  const container = document.getElementById('vennChart');
  const explain = document.getElementById('vennExplain');
  if (!container) return;
  const info = {
    aonly: {title:"A only (A − B)", text:"Elements in A but not in B. In probability terms, this is the part of event A that doesn't overlap with B."},
    bonly: {title:"B only (B − A)", text:"Elements in B but not in A — the mirror image of A only."},
    intersection: {title:"A ∩ B — the intersection", text:"Elements in both A and B at once. This is exactly the joint probability P(AB) from the multiplication rule."},
    union: {title:"A ∪ B — the union (whole shaded area)", text:"Everything in A, or B, or both — every element that belongs to at least one of the two sets. This is exactly what the addition rule P(A or B) computes."}
  };
  const W=360, H=220;
  const svg = svgEl('svg', {viewBox:`0 0 ${W} ${H}`, width:'100%', class:'venn-svg', style:'max-width:400px; display:block; margin:0 auto;'});
  const circleA = svgEl('circle', {cx:140, cy:110, r:75, fill:'#2B2560', 'fill-opacity':'0.35', class:'venn-region', 'data-region':'aonly'});
  const circleB = svgEl('circle', {cx:220, cy:110, r:75, fill:'#E8A33D', 'fill-opacity':'0.35', class:'venn-region', 'data-region':'bonly'});
  svg.appendChild(circleA);
  svg.appendChild(circleB);
  // intersection overlay (approximate lens via clip - simple approach: a smaller circle-ish path using two arcs)
  const lensPath = svgEl('path', {
    d: "M 180 47 A 75 75 0 0 1 180 173 A 75 75 0 0 1 180 47 Z",
    fill: '#2F8F6B', 'fill-opacity':'0.55', class:'venn-region', 'data-region':'intersection'
  });
  svg.appendChild(lensPath);
  const labelA = svgEl('text', {x:100, y:60, 'font-family':'IBM Plex Mono', 'font-size':13, fill:'#1C1B29', 'font-weight':'700'});
  labelA.textContent = 'A';
  svg.appendChild(labelA);
  const labelB = svgEl('text', {x:250, y:60, 'font-family':'IBM Plex Mono', 'font-size':13, fill:'#1C1B29', 'font-weight':'700'});
  labelB.textContent = 'B';
  svg.appendChild(labelB);
  container.innerHTML = '';
  container.appendChild(svg);

  const hint = document.createElement('p');
  hint.style.fontSize = '.8rem'; hint.style.color = 'var(--ink-soft)'; hint.style.textAlign='center'; hint.style.marginTop='8px';
  hint.textContent = 'Click a region — or the button below for the full union.';
  container.appendChild(hint);

  const unionBtn = document.createElement('button');
  unionBtn.className = 'test-tab';
  unionBtn.style.display = 'block';
  unionBtn.style.margin = '10px auto 0';
  unionBtn.textContent = 'Show A ∪ B (union)';
  unionBtn.addEventListener('click', () => showInfo('union'));
  container.appendChild(unionBtn);

  function showInfo(key){
    const i = info[key];
    explain.innerHTML = `<strong>${i.title}:</strong> ${i.text}`;
    explain.style.display = 'block';
  }
  svg.querySelectorAll('.venn-region').forEach(region => {
    region.addEventListener('click', () => showInfo(region.dataset.region));
  });
})();

/* ============================================================
   06 — Linear function grapher
   ============================================================ */
(function(){
  const container = document.getElementById('lineGraphChart');
  const mI = document.getElementById('graphM'), bI = document.getElementById('graphB');
  if (!container) return;
  function render(){
    const m = parseFloat(mI.value), b = parseFloat(bI.value);
    const W=480, H=280, pad=36;
    const domainMin=-6, domainMax=6;
    const xScale = v => pad + (v-domainMin)/(domainMax-domainMin)*(W-2*pad);
    const yScale = v => H-pad - (v-domainMin)/(domainMax-domainMin)*(H-2*pad);
    const svg = svgEl('svg', {viewBox:`0 0 ${W} ${H}`, width:'100%', class:'graph-svg', style:'max-width:500px;'});
    // grid
    for (let v=domainMin; v<=domainMax; v++){
      svg.appendChild(svgEl('line', {x1:xScale(v), x2:xScale(v), y1:pad, y2:H-pad, stroke:'#E3DCC9', 'stroke-width':0.5}));
      svg.appendChild(svgEl('line', {x1:pad, x2:W-pad, y1:yScale(v), y2:yScale(v), stroke:'#E3DCC9', 'stroke-width':0.5}));
    }
    // axes
    svg.appendChild(svgEl('line', {x1:pad, x2:W-pad, y1:yScale(0), y2:yScale(0), stroke:'#4A4763', 'stroke-width':1.5}));
    svg.appendChild(svgEl('line', {x1:xScale(0), x2:xScale(0), y1:pad, y2:H-pad, stroke:'#4A4763', 'stroke-width':1.5}));
    // axis labels
    [-6,-4,-2,2,4,6].forEach(v => {
      const t = svgEl('text', {x:xScale(v), y:yScale(0)+14, 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':8, fill:'#4A4763'});
      t.textContent = v;
      svg.appendChild(t);
    });
    // line y = mx+b, clipped to domain
    const y1 = m*domainMin+b, y2 = m*domainMax+b;
    svg.appendChild(svgEl('line', {x1:xScale(domainMin), y1:yScale(Math.max(domainMin,Math.min(domainMax,y1))), x2:xScale(domainMax), y2:yScale(Math.max(domainMin,Math.min(domainMax,y2))), stroke:'#C77F1E', 'stroke-width':2.5}));
    // intercept marker
    if (b>=domainMin && b<=domainMax){
      svg.appendChild(svgEl('circle', {cx:xScale(0), cy:yScale(b), r:5, fill:'#2F8F6B', stroke:'#fff', 'stroke-width':1.5}));
      const t = svgEl('text', {x:xScale(0)+8, y:yScale(b)-8, 'font-family':'IBM Plex Mono', 'font-size':9, fill:'#2F8F6B', 'font-weight':'700'});
      t.textContent = `b=${b}`;
      svg.appendChild(t);
    }
    const eqLabel = svgEl('text', {x:W-pad, y:pad-8, 'text-anchor':'end', 'font-family':'IBM Plex Mono', 'font-size':11, fill:'#C77F1E', 'font-weight':'700'});
    eqLabel.textContent = `y = ${m}x ${b>=0?'+':'−'} ${Math.abs(b)}`;
    svg.appendChild(eqLabel);
    container.innerHTML = '';
    container.appendChild(svg);
  }
  [mI,bI].forEach(el => el.addEventListener('input', render));
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
const sectionIds = ['sec-exponents','sec-logs','sec-summation','sec-algebra','sec-sets','sec-functions','sec-quiz'];
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
  try { localStorage.setItem('cfa-progress-foundations', String(pct)); } catch(e) {}
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
    concept: "Exponents & Roots",
    q: "What does x⁴ mean?",
    opts: ["x × 4", "x × x × x × x", "4 × x × x"],
    correct: 1,
    exp: "An exponent counts how many copies of x are multiplied together: x⁴ = x × x × x × x."
  },
  {
    concept: "Exponents & Roots",
    q: "Simplify: x⁵ / x²",
    opts: ["x³", "x⁷", "x^2.5"],
    correct: 0,
    exp: "Dividing same-base exponents subtracts them: x⁵/x² = x⁵⁻² = x³."
  },
  {
    concept: "Exponents & Roots",
    q: "What is x⁰ equal to, for any nonzero x?",
    opts: ["0", "1", "x"],
    correct: 1,
    exp: "By definition, any nonzero number raised to the power 0 equals 1."
  },
  {
    concept: "Exponents & Roots",
    q: "Rewrite x⁻³ using a positive exponent.",
    opts: ["−x³", "1/x³", "3/x"],
    correct: 1,
    exp: "A negative exponent means 'take the reciprocal': x⁻³ = 1/x³."
  },
  {
    concept: "Exponents & Roots",
    q: "The square root of x can be written as which exponent?",
    opts: ["x²", "x^(1/2)", "x^(-2)"],
    correct: 1,
    exp: "Roots are fractional exponents: the square root of x is x^(1/2)."
  },
  {
    concept: "Logarithms",
    q: "ln(x) = y means exactly the same thing as:",
    opts: ["x = y²", "e^y = x", "x × y = 1"],
    correct: 1,
    exp: "A logarithm and an exponent are inverse operations: ln(x) = y is the same statement as e^y = x."
  },
  {
    concept: "Logarithms",
    q: "Using log rules, ln(a/b) simplifies to:",
    opts: ["ln(a) − ln(b)", "ln(a) + ln(b)", "ln(a) × ln(b)"],
    correct: 0,
    exp: "Dividing inside a log becomes subtraction outside: ln(a/b) = ln(a) − ln(b)."
  },
  {
    concept: "Logarithms",
    q: "Solving FV = PV(1+r)^N for N requires which key algebra move?",
    opts: ["Squaring both sides", "Taking the natural log of both sides", "Multiplying both sides by N"],
    correct: 1,
    exp: "Taking ln of both sides lets you use ln(a^b) = b·ln(a) to bring the exponent N down where it can be isolated."
  },
  {
    concept: "Summation Notation",
    q: "What does Σᵢ₌₁³ Xᵢ expand to?",
    opts: ["X₁ + X₂ + X₃", "X₁ × X₂ × X₃", "X₃ − X₁"],
    correct: 0,
    exp: "Σ with i running from 1 to 3 means add up X₁, X₂, and X₃."
  },
  {
    concept: "Summation Notation",
    q: "For the data 2, 5, 3, what does (ΣXᵢ)² equal — squaring the total, not each term?",
    opts: ["38", "100", "10"],
    correct: 1,
    exp: "This notation squares the total: (2+5+3)² = 10² = 100. (Careful — this is different from ΣXᵢ², which would square each term first and then add: 4+25+9=38.)"
  },
  {
    concept: "Summation Notation",
    q: "Which property lets you factor a constant outside a summation?",
    opts: ["Σ(c × Xᵢ) = c × ΣXᵢ", "Σ(Xᵢ + c) = ΣXᵢ", "Σc = c"],
    correct: 0,
    exp: "A constant multiplier can always be pulled outside the summation: Σ(c × Xᵢ) = c × ΣXᵢ."
  },
  {
    concept: "Rearranging Equations",
    q: "Solve for x: 5x − 4 = 26.",
    opts: ["x = 4.4", "x = 6", "x = 30"],
    correct: 1,
    exp: "Add 4 to both sides: 5x = 30. Divide both sides by 5: x = 6."
  },
  {
    concept: "Rearranging Equations",
    q: "When rearranging PV = A × [1−(1+r)⁻ᴺ]/r to solve for A, what must you divide by?",
    opts: ["Just r", "The entire bracketed expression [1−(1+r)⁻ᴺ]/r", "Just (1+r)⁻ᴺ"],
    correct: 1,
    exp: "You must divide both sides by the entire multiplier attached to A — the whole bracketed term — not just a piece of it."
  },
  {
    concept: "Sets & Set Notation",
    q: "A = {1, 3, 5, 7} and B = {3, 5, 9}. What is A ∪ B?",
    opts: ["{3, 5}", "{1, 3, 5, 7, 9}", "{1, 7, 9}"],
    correct: 1,
    exp: "The union combines every element from both sets, without duplicating the shared ones: {1, 3, 5, 7, 9}."
  },
  {
    concept: "Sets & Set Notation",
    q: "A = {1, 3, 5, 7} and B = {3, 5, 9}. What is A ∩ B?",
    opts: ["{3, 5}", "{1, 7, 9}", "∅"],
    correct: 0,
    exp: "The intersection is only the elements found in both sets: 3 and 5 appear in both A and B."
  },
  {
    concept: "Sets & Set Notation",
    q: "In probability language, A ∩ B = ∅ describes two events that are:",
    opts: ["Independent", "Mutually exclusive", "Exhaustive"],
    correct: 1,
    exp: "An empty intersection means the two sets (events) share no outcomes at all — the set-theory definition of mutually exclusive."
  },
  {
    concept: "Functions & the Cartesian Plane",
    q: "A function f(x) is best defined as a rule that:",
    opts: ["Produces a random output for each input", "Produces exactly one output for each input", "Only accepts positive inputs"],
    correct: 1,
    exp: "The defining feature of a function is reliability: one specific output for every input, never two different outputs for the same input."
  },
  {
    concept: "Functions & the Cartesian Plane",
    q: "In the linear equation y = mx + b, what does b represent?",
    opts: ["The slope", "The y-intercept (value of y when x=0)", "The x-intercept"],
    correct: 1,
    exp: "b is the y-intercept — where the line crosses the y-axis, which happens exactly when x = 0."
  },
  {
    concept: "Functions & the Cartesian Plane",
    q: "A line has equation y = −2x + 5. As x increases by 1, what happens to y?",
    opts: ["y increases by 2", "y decreases by 2", "y stays the same"],
    correct: 1,
    exp: "The slope is −2, meaning y falls by 2 units for every 1-unit increase in x."
  },
  {
    concept: "Functions & the Cartesian Plane",
    q: "A probability density function f(x), plotted as a bell curve, is an example of:",
    opts: ["A set", "A function graphed on the Cartesian plane", "A summation"],
    correct: 1,
    exp: "f(x) assigns exactly one height (probability density) to each possible value x — precisely the definition of a function, visualized on the x-y plane."
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
          cfaRecordAnswer(item.concept, "Math Foundations", i === item.correct);
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
    if (pct >= 90) msg = "Excellent — you've genuinely internalized the toolkit.";
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
