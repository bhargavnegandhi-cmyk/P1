// ============================================================
// Numbers & Arithmetic — interactivity
// ============================================================

function fmt(n, d=4){
  if (!isFinite(n)) return "—";
  // trim trailing zeros for cleaner display
  const s = n.toFixed(d);
  return s.replace(/\.?0+$/, '') || '0';
}
function gcd(a, b){ a=Math.abs(a); b=Math.abs(b); while(b){ [a,b]=[b, a%b]; } return a || 1; }
function svgEl(tag, attrs){
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const k in attrs) el.setAttribute(k, attrs[k]);
  return el;
}

/* ============================================================
   01 — Multiplication as repeated addition
   ============================================================ */
(function(){
  const aI = document.getElementById('mulA'), bI = document.getElementById('mulB');
  const chart = document.getElementById('mulChart'), result = document.getElementById('mulResult');
  if (!aI) return;
  function render(){
    const a = Math.max(1, Math.min(12, parseInt(aI.value,10)||1));
    const b = Math.max(1, Math.min(12, parseInt(bI.value,10)||1));
    result.textContent = `${a} × ${b} = ${a*b}`;
    chart.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.style.display = 'flex'; wrap.style.flexDirection='column'; wrap.style.gap='4px';
    for (let g=0; g<a; g++){
      const row = document.createElement('div');
      row.style.display='flex'; row.style.gap='4px';
      for (let i=0; i<b; i++){
        const dot = document.createElement('div');
        dot.style.width='16px'; dot.style.height='16px'; dot.style.borderRadius='50%'; dot.style.background='var(--indigo)';
        row.appendChild(dot);
      }
      wrap.appendChild(row);
    }
    chart.appendChild(wrap);
  }
  [aI,bI].forEach(el => el.addEventListener('input', render));
  render();
})();

/* ============================================================
   02 — Number line
   ============================================================ */
(function(){
  const container = document.getElementById('numberLineChart');
  const startI = document.getElementById('nlStart'), addI = document.getElementById('nlAdd');
  const result = document.getElementById('nlResult');
  if (!container) return;
  function render(){
    const start = parseFloat(startI ? startI.value : -3) || 0;
    const add = parseFloat(addI ? addI.value : 7) || 0;
    const end = start + add;
    if (result) result.textContent = `${start} + (${add}) = ${end}`;

    const W=520, H=110, padL=30, padR=30;
    const domainMin = Math.min(-10, start-2, end-2), domainMax = Math.max(10, start+2, end+2);
    const xScale = v => padL + (v-domainMin)/(domainMax-domainMin)*(W-padL-padR);
    const svg = svgEl('svg', {viewBox:`0 0 ${W} ${H}`, width:'100%', class:'number-line-svg', style:'max-width:560px;'});
    const y = 55;
    svg.appendChild(svgEl('line', {x1:padL, x2:W-padR, y1:y, y2:y, stroke:'#4A4763', 'stroke-width':1.5}));
    for (let v=Math.ceil(domainMin); v<=Math.floor(domainMax); v++){
      const x = xScale(v);
      svg.appendChild(svgEl('line', {x1:x, x2:x, y1:y-5, y2:y+5, stroke:'#E3DCC9', 'stroke-width':1}));
      if (v % 2 === 0){
        const t = svgEl('text', {x, y:y+20, 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':9, fill:'#4A4763'});
        t.textContent = v;
        svg.appendChild(t);
      }
    }
    // arrow from start to end
    svg.appendChild(svgEl('line', {x1:xScale(start), x2:xScale(end), y1:y-20, y2:y-20, stroke:'#C77F1E', 'stroke-width':2}));
    svg.appendChild(svgEl('circle', {cx:xScale(start), cy:y, r:5, fill:'#2B2560', stroke:'#fff', 'stroke-width':1.5}));
    svg.appendChild(svgEl('circle', {cx:xScale(end), cy:y, r:5, fill:'#2F8F6B', stroke:'#fff', 'stroke-width':1.5}));
    const startLbl = svgEl('text', {x:xScale(start), y:y-26, 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':9, fill:'#2B2560', 'font-weight':'700'});
    startLbl.textContent = 'start: '+start;
    svg.appendChild(startLbl);
    const endLbl = svgEl('text', {x:xScale(end), y:y-26, 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':9, fill:'#2F8F6B', 'font-weight':'700'});
    endLbl.textContent = 'end: '+end;
    svg.appendChild(endLbl);
    container.innerHTML = '';
    container.appendChild(svg);
  }
  [startI, addI].forEach(el => el && el.addEventListener('input', render));
  render();
})();

/* ============================================================
   03 — Fraction / decimal / percentage converter + pie chart
   ============================================================ */
(function(){
  const numI = document.getElementById('fracNum'), denI = document.getElementById('fracDen');
  const out = document.getElementById('fracOut');
  const pieContainer = document.getElementById('pieChart');
  if (!numI) return;
  function render(){
    const num = parseFloat(numI.value), den = parseFloat(denI.value);
    if (isNaN(num) || isNaN(den) || den === 0){
      out.innerHTML = '<div class="stat-readout"><div class="k">—</div><div class="v">Check inputs</div></div>';
      return;
    }
    const decimal = num/den;
    const pct = decimal*100;
    const g = gcd(Math.round(num), Math.round(den));
    const simplified = (Number.isInteger(num) && Number.isInteger(den) && g>1) ? ` (${num/g}/${den/g})` : '';
    out.innerHTML = `
      <div class="stat-readout"><div class="k">Fraction</div><div class="v">${num}/${den}${simplified}</div></div>
      <div class="stat-readout"><div class="k">Decimal</div><div class="v">${fmt(decimal,4)}</div></div>
      <div class="stat-readout"><div class="k">Percentage</div><div class="v">${fmt(pct,2)}%</div></div>
    `;
    if (pieContainer){
      const frac = Math.max(0, Math.min(1, decimal));
      const W=200, H=200, r=80, cx=100, cy=100;
      const angle = frac*2*Math.PI;
      const x1 = cx, y1 = cy-r;
      const x2 = cx + r*Math.sin(angle), y2 = cy - r*Math.cos(angle);
      const largeArc = angle > Math.PI ? 1 : 0;
      const svg = svgEl('svg', {viewBox:`0 0 ${W} ${H}`, width:'160', height:'160', class:'pie-svg', style:'display:block; margin:0 auto;'});
      svg.appendChild(svgEl('circle', {cx, cy, r, fill:'#F3EEE3', stroke:'#E3DCC9', 'stroke-width':1.5}));
      if (frac > 0.001 && frac < 0.999){
        const path = `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${largeArc} 1 ${x2},${y2} Z`;
        svg.appendChild(svgEl('path', {d:path, fill:'#2B2560'}));
      } else if (frac >= 0.999){
        svg.appendChild(svgEl('circle', {cx, cy, r, fill:'#2B2560'}));
      }
      const label = svgEl('text', {x:cx, y:cy+5, 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':16, fill:'#1C1B29', 'font-weight':'700', style:'mix-blend-mode:difference; fill:#fff;'});
      pieContainer.innerHTML = '';
      pieContainer.appendChild(svg);
      const capt = document.createElement('p');
      capt.style.textAlign = 'center'; capt.style.fontFamily='var(--font-mono)'; capt.style.fontSize='.85rem'; capt.style.color='var(--ink-soft)'; capt.style.marginTop='8px';
      capt.textContent = `${num}/${den} = ${fmt(decimal,3)} = ${fmt(pct,1)}%`;
      pieContainer.appendChild(capt);
    }
  }
  [numI,denI].forEach(el => el.addEventListener('input', render));
  render();
})();

/* ============================================================
   04 — BODMAS expression evaluator (safe hand-written parser)
   ============================================================ */
(function(){
  const input = document.getElementById('bodmasInput');
  const result = document.getElementById('bodmasResult');
  if (!input) return;

  function tokenize(str){
    const tokens = [];
    let i = 0;
    while (i < str.length){
      const c = str[i];
      if (/\s/.test(c)){ i++; continue; }
      if (/[0-9.]/.test(c)){
        let num = '';
        while (i < str.length && /[0-9.]/.test(str[i])){ num += str[i]; i++; }
        tokens.push({type:'num', value: parseFloat(num)});
        continue;
      }
      if ('+-*/^()'.includes(c)){
        tokens.push({type:'op', value:c});
        i++;
        continue;
      }
      throw new Error('Unexpected character: ' + c);
    }
    return tokens;
  }

  // Recursive-descent parser respecting BODMAS: () then ^ then */ then +-
  function parse(tokens){
    let pos = 0;
    function peek(){ return tokens[pos]; }
    function consume(){ return tokens[pos++]; }

    function parseExpr(){ // + and -
      let left = parseTerm();
      while (peek() && peek().type==='op' && (peek().value==='+' || peek().value==='-')){
        const op = consume().value;
        const right = parseTerm();
        left = op === '+' ? left+right : left-right;
      }
      return left;
    }
    function parseTerm(){ // * and /
      let left = parsePower();
      while (peek() && peek().type==='op' && (peek().value==='*' || peek().value==='/')){
        const op = consume().value;
        const right = parsePower();
        left = op === '*' ? left*right : left/right;
      }
      return left;
    }
    function parsePower(){ // ^
      let left = parseUnary();
      if (peek() && peek().type==='op' && peek().value==='^'){
        consume();
        const right = parsePower(); // right-associative
        left = Math.pow(left, right);
      }
      return left;
    }
    function parseUnary(){
      if (peek() && peek().type==='op' && peek().value==='-'){
        consume();
        return -parseUnary();
      }
      return parseAtom();
    }
    function parseAtom(){
      const t = peek();
      if (t && t.type==='num'){ consume(); return t.value; }
      if (t && t.type==='op' && t.value==='('){
        consume();
        const v = parseExpr();
        if (peek() && peek().value===')') consume();
        return v;
      }
      throw new Error('Unexpected token');
    }
    const val = parseExpr();
    return val;
  }

  function render(){
    try {
      const tokens = tokenize(input.value);
      const val = parse(tokens);
      result.textContent = `= ${fmt(val,6)}`;
    } catch(e){
      result.textContent = 'Check the expression';
    }
  }
  input.addEventListener('input', render);
  render();
})();

/* ============================================================
   05 — Proportion solver
   ============================================================ */
(function(){
  const aI = document.getElementById('propA'), bI = document.getElementById('propB'), cI = document.getElementById('propC');
  const result = document.getElementById('propResult'), steps = document.getElementById('propSteps');
  if (!aI) return;
  function render(){
    const a = parseFloat(aI.value), b = parseFloat(bI.value), c = parseFloat(cI.value);
    if (isNaN(a) || isNaN(b) || isNaN(c) || a === 0){
      result.textContent = 'Check inputs'; steps.textContent=''; return;
    }
    const x = (b*c)/a;
    result.textContent = `x = ${fmt(x,4)}`;
    steps.textContent = `${a}/${b} = ${c}/x → ${a}x = ${b}×${c} → x = ${fmt(b*c,2)}/${a} = ${fmt(x,4)}`;
  }
  [aI,bI,cI].forEach(el => el.addEventListener('input', render));
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
const sectionIds = ['sec-operations','sec-negatives','sec-fractions','sec-bodmas','sec-ratios','sec-wordproblems','sec-quiz'];
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
  try { localStorage.setItem('cfa-progress-arithmetic', String(pct)); } catch(e) {}
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
    concept: "The Four Operations",
    q: "What does 5 × 6 actually represent?",
    opts: ["5 added to 6", "Five groups of six, added together", "6 taken away from 5, five times"],
    correct: 1,
    exp: "Multiplication is repeated addition: 5 × 6 = 6+6+6+6+6 = 30, five groups of six."
  },
  {
    concept: "The Four Operations",
    q: "A shopkeeper has ₹340 and spends ₹95. How much remains?",
    opts: ["₹235", "₹245", "₹435"],
    correct: 1,
    exp: "340 − 95 = 245."
  },
  {
    concept: "The Four Operations",
    q: "18 ÷ 3 asks which question?",
    opts: ["How many groups of 3 fit inside 18?", "How many times does 18 fit inside 3?", "What is 18 plus 3?"],
    correct: 0,
    exp: "Division asks how many equal groups fit — 18 ÷ 3 = 6, because six groups of 3 make 18."
  },
  {
    concept: "Negative Numbers",
    q: "What is 8 − (−5)?",
    opts: ["3", "13", "−13"],
    correct: 1,
    exp: "Subtracting a negative flips to addition: 8 − (−5) = 8 + 5 = 13."
  },
  {
    concept: "Negative Numbers",
    q: "What is (−6) × (−4)?",
    opts: ["−24", "24", "−10"],
    correct: 1,
    exp: "Multiplying two negatives gives a positive: (−6) × (−4) = 24."
  },
  {
    concept: "Negative Numbers",
    q: "A hiker starts at an elevation of −45 meters (below a reference point) and climbs 70 meters. What is the new elevation?",
    opts: ["25 meters", "−115 meters", "115 meters"],
    correct: 0,
    exp: "−45 + 70 = 25 meters, now above the reference point."
  },
  {
    concept: "Fractions, Decimals & Percentages",
    q: "What is 5/8 written as a decimal?",
    opts: ["0.58", "0.625", "1.6"],
    correct: 1,
    exp: "5 ÷ 8 = 0.625."
  },
  {
    concept: "Fractions, Decimals & Percentages",
    q: "What is 0.4 written as a percentage?",
    opts: ["4%", "0.4%", "40%"],
    correct: 2,
    exp: "Multiply the decimal by 100: 0.4 × 100 = 40%."
  },
  {
    concept: "Fractions, Decimals & Percentages",
    q: "Using the '10% then adjust' method, what is 15% of 380?",
    opts: ["38", "57", "76"],
    correct: 1,
    exp: "10% of 380 = 38. Half of that (5%) = 19. 15% = 38 + 19 = 57."
  },
  {
    concept: "Order of Operations (BODMAS)",
    q: "Evaluate: 3 + 4 × 2",
    opts: ["14", "11", "10"],
    correct: 1,
    exp: "Multiplication before addition (BODMAS): 4×2=8, then 3+8=11."
  },
  {
    concept: "Order of Operations (BODMAS)",
    q: "Evaluate: (6 + 2) × 3 − 4",
    opts: ["20", "18", "14"],
    correct: 0,
    exp: "Brackets first: 6+2=8. Then multiplication: 8×3=24. Then subtraction: 24−4=20."
  },
  {
    concept: "Order of Operations (BODMAS)",
    q: "Evaluate: 20 ÷ 4 × 2",
    opts: ["2.5", "10", "20"],
    correct: 1,
    exp: "Division and multiplication share equal priority and go left to right: 20÷4=5, then 5×2=10."
  },
  {
    concept: "Order of Operations (BODMAS)",
    q: "In BODMAS, which comes first: brackets, or orders (powers/roots)?",
    opts: ["Orders always come first", "Brackets always come first", "They're solved simultaneously"],
    correct: 1,
    exp: "Brackets are resolved first, before powers, roots, or any other operation."
  },
  {
    concept: "Ratios & Proportions",
    q: "If 4 workers can paint a fence in 10 days, roughly how many days would 8 workers (at the same rate) take?",
    opts: ["20 days", "5 days", "10 days"],
    correct: 1,
    exp: "Doubling the workers halves the time needed for the same total work: 5 days."
  },
  {
    concept: "Ratios & Proportions",
    q: "Solve the proportion: 3/9 = 5/x. What is x?",
    opts: ["15", "1.67", "45"],
    correct: 0,
    exp: "Cross-multiply: 3x = 9×5 = 45, so x = 45/3 = 15."
  },
  {
    concept: "Fractions, Decimals & Percentages",
    q: "A ₹1,200 item is marked down by 30%. What is the sale price?",
    opts: ["₹360", "₹840", "₹900"],
    correct: 1,
    exp: "30% of 1,200 = 360. Sale price = 1,200 − 360 = ₹840."
  },
  {
    concept: "Fractions, Decimals & Percentages",
    q: "A quantity rises from 400 to 500. What is the percentage increase?",
    opts: ["20%", "25%", "100%"],
    correct: 1,
    exp: "Percentage increase = (change)/(original) = (500−400)/400 = 100/400 = 25%."
  },
  {
    concept: "Ratios & Proportions",
    q: "\"A recipe uses 2 eggs for every 3 cups of flour.\" If you use 9 cups of flour, how many eggs (keeping the same ratio)?",
    opts: ["6 eggs", "4.5 eggs", "13.5 eggs"],
    correct: 0,
    exp: "The ratio 2:3 scaled up: 9 cups is 3 times 3 cups, so eggs also multiply by 3: 2×3 = 6 eggs."
  },
  {
    concept: "Turning Words Into Math",
    q: "\"Reduced to only 60% of its original price\" means the same thing as which single operation?",
    opts: ["A 60% discount", "A 40% discount", "A 60% increase"],
    correct: 1,
    exp: "If only 60% of the original price remains, then 40% has been removed — a 40% discount."
  },
  {
    concept: "Turning Words Into Math",
    q: "After solving a word problem about a discount, why is it useful to restate the answer as a full sentence and check if it's reasonable?",
    opts: ["It's required by convention", "It helps catch errors, like a sale price ending up higher than the original", "It has no real benefit"],
    correct: 1,
    exp: "Sanity-checking the final answer against common sense — a discounted price should never exceed the original — is a reliable way to catch a flipped or misapplied step."
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
          cfaRecordAnswer(item.concept, "Numbers & Arithmetic", i === item.correct);
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
    if (pct >= 90) msg = "Excellent — this is genuinely solid ground to build on.";
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
