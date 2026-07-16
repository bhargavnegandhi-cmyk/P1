// ============================================================
// Probability Concepts site — interactivity
// ============================================================

/* ---------- helpers ---------- */
function factorial(n){
  n = Math.round(n);
  if (n < 0) return NaN;
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}
function fmt(num){
  if (!isFinite(num)) return "—";
  if (Math.abs(num) >= 1000) return num.toLocaleString();
  return (Math.round(num * 10000) / 10000).toString();
}
function toSubOrSup(n, kind){
  // not used, placeholder for readability
  return n;
}

/* ---------- 1. Probability dial ---------- */
(function(){
  const dial = document.getElementById('probDial');
  const val = document.getElementById('dialValue');
  const word = document.getElementById('dialWord');
  const odds = document.getElementById('dialOdds');
  const pct = document.getElementById('dialPct');
  if(!dial) return;

  function wordFor(p){
    if (p === 0) return "Impossible";
    if (p < 0.15) return "Very unlikely";
    if (p < 0.4) return "Unlikely";
    if (p < 0.6) return "Toss-up";
    if (p < 0.85) return "Likely";
    if (p < 1) return "Very likely";
    return "Certain";
  }
  function update(){
    const p = (+dial.value) / 100;
    val.textContent = p.toFixed(2);
    word.textContent = wordFor(p);
    pct.textContent = (p*100).toFixed(0) + "%";
    if (p >= 1){
      odds.textContent = "undefined (÷0) — a certain event has no meaningful odds";
    } else if (p <= 0){
      odds.textContent = "0 to 1";
    } else {
      const oddsFor = p / (1-p);
      // express as simplified-ish a:b using the raw ratio to 2dp
      odds.textContent = oddsFor.toFixed(2) + " to 1";
    }
  }
  dial.addEventListener('input', update);
  update();
})();

/* ---------- 2. Odds <-> probability converter ---------- */
(function(){
  const input = document.getElementById('convProb');
  const out = document.getElementById('convOut');
  if(!input) return;
  function update(){
    let p = parseFloat(input.value);
    if (isNaN(p) || p < 0) p = 0;
    if (p > 1) p = 1;
    if (p === 1){
      out.innerHTML = "Odds for E: undefined (a certain event) <br>Odds against E: 0 to 1";
      return;
    }
    if (p === 0){
      out.innerHTML = "Odds for E: 0 to 1 <br>Odds against E: undefined (an impossible event)";
      return;
    }
    const oddsFor = p / (1-p);
    const oddsAgainst = (1-p) / p;
    out.innerHTML = `Odds for E = ${p.toFixed(2)} / ${(1-p).toFixed(2)} = ${oddsFor.toFixed(2)} to 1<br>Odds against E = ${oddsAgainst.toFixed(2)} to 1`;
  }
  input.addEventListener('input', update);
  update();
})();

/* ---------- 3. Factorial calculator ---------- */
(function(){
  const nInput = document.getElementById('factN');
  const result = document.getElementById('factResult');
  const steps = document.getElementById('factSteps');
  if(!nInput) return;
  function update(){
    let n = parseInt(nInput.value, 10);
    if (isNaN(n) || n < 0){ result.textContent = "Enter a whole number ≥ 0"; steps.textContent = ""; return; }
    if (n > 18){ n = 18; nInput.value = 18; }
    const r = factorial(n);
    result.textContent = `${n}! = ${fmt(r)}`;
    if (n === 0){ steps.textContent = "0! = 1 by convention"; return; }
    const chain = [];
    for (let i = n; i >= 1; i--) chain.push(i);
    steps.textContent = chain.join(" × ") + ` = ${fmt(r)}`;
  }
  nInput.addEventListener('input', update);
  update();
})();

/* ---------- 4. Combination calculator ---------- */
(function(){
  const nInput = document.getElementById('combN');
  const rInput = document.getElementById('combR');
  const result = document.getElementById('combResult');
  const steps = document.getElementById('combSteps');
  if(!nInput) return;
  function update(){
    let n = parseInt(nInput.value, 10), r = parseInt(rInput.value, 10);
    if (isNaN(n) || isNaN(r) || n < 0 || r < 0 || r > n){
      result.textContent = "Need 0 ≤ r ≤ n";
      steps.textContent = "";
      return;
    }
    const val = factorial(n) / (factorial(n-r) * factorial(r));
    result.innerHTML = `<sub></sub>${n}C${r} = ${fmt(val)}`;
    steps.textContent = `${n}! / (${n-r}! × ${r}!) = ${fmt(val)}`;
  }
  nInput.addEventListener('input', update);
  rInput.addEventListener('input', update);
  update();
})();

/* ---------- 5. Permutation calculator ---------- */
(function(){
  const nInput = document.getElementById('permN');
  const rInput = document.getElementById('permR');
  const result = document.getElementById('permResult');
  const steps = document.getElementById('permSteps');
  if(!nInput) return;
  function update(){
    let n = parseInt(nInput.value, 10), r = parseInt(rInput.value, 10);
    if (isNaN(n) || isNaN(r) || n < 0 || r < 0 || r > n){
      result.textContent = "Need 0 ≤ r ≤ n";
      steps.textContent = "";
      return;
    }
    const val = factorial(n) / factorial(n-r);
    result.textContent = `${n}P${r} = ${fmt(val)}`;
    steps.textContent = `${n}! / ${n-r}! = ${fmt(val)}`;
  }
  nInput.addEventListener('input', update);
  rInput.addEventListener('input', update);
  update();
})();

/* ---------- 6. Check-in mini quizzes ---------- */
(function(){
  document.querySelectorAll('.checkin').forEach(box => {
    const btns = box.querySelectorAll('.opt-btn');
    const feedback = box.querySelector('.checkin-feedback');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        btns.forEach(b => b.disabled = true);
        btns.forEach(b => {
          if (b.dataset.correct === 'true') b.classList.add('correct');
        });
        if (btn.dataset.correct !== 'true') btn.classList.add('incorrect');
        feedback.classList.add('show');
        markSectionProgress(box.closest('section').id);
      });
    });
  });
})();

/* ---------- 7. Sidebar scroll-spy + progress + mobile toggle ---------- */
const sectionIds = ['sec-basics','sec-properties','sec-types','sec-odds','sec-conditional','sec-joint','sec-addition','sec-independence','sec-total','sec-counting','sec-labeling','sec-permutation','sec-quiz'];
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
  try { localStorage.setItem('cfa-progress-probability-concepts', String(pct)); } catch(e) {}
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
    concept: "Random Variables & Events",
    q: "You draw one card from a standard 52-card deck. \"Drawing a red card\" is best described as:",
    opts: ["A random variable", "An outcome", "An event"],
    correct: 2,
    exp: "It's a set of 26 possible outcomes (all red cards) bundled together — that's the definition of an event."
  },
  {
    concept: "Rules of Probability",
    q: "Which pair of statements together define a valid probability?",
    opts: ["0 ≤ P(E) ≤ 1, and probabilities of mutually exclusive & exhaustive events sum to 1", "P(E) can be any real number, and probabilities sum to 100", "0 ≤ P(E) ≤ 100, and probabilities can overlap freely"],
    correct: 0,
    exp: "Those are the two defining properties of probability: bounded between 0 and 1, and a full mutually-exclusive-and-exhaustive set sums to exactly 1."
  },
  {
    concept: "Rules of Probability",
    q: "Events A and B are mutually exclusive. What must P(AB) equal?",
    opts: ["1", "0", "P(A) × P(B)"],
    correct: 1,
    exp: "Mutually exclusive events can never both occur, so their joint probability is 0 by definition."
  },
  {
    concept: "Three Ways to Estimate P",
    q: "An analyst says: \"Based on logical reasoning about a fair coin, P(heads) = 0.5.\" This is an example of:",
    opts: ["Empirical probability", "Subjective probability", "A priori probability"],
    correct: 2,
    exp: "It's derived through pure logical analysis of a symmetric situation, without gathering data — that's a priori."
  },
  {
    concept: "Three Ways to Estimate P",
    q: "51 out of 60 stocks in an index pay a dividend, giving P = 51/60 = 0.85. This is an example of:",
    opts: ["Empirical probability", "Subjective probability", "A priori probability"],
    correct: 0,
    exp: "It's a relative frequency computed from observed historical data — the definition of empirical probability."
  },
  {
    concept: "Odds",
    q: "If P(E) = 0.20, what are the odds for E?",
    opts: ["0.20 to 1", "0.25 to 1", "4 to 1"],
    correct: 1,
    exp: "Odds for E = P(E)/(1−P(E)) = 0.20/0.80 = 0.25, or \"0.25 to 1\" (equivalently \"1 to 4\")."
  },
  {
    concept: "Odds",
    q: "The odds against a horse winning are quoted as \"3 to 1.\" What is the implied probability the horse wins?",
    opts: ["0.75", "0.25", "3.00"],
    correct: 1,
    exp: "For odds against of \"a to b,\" P(E) = b/(a+b) = 1/(3+1) = 0.25."
  },
  {
    concept: "Conditional Probability",
    q: "P(A) = 0.60 unconditionally. P(A | B) = 0.60 as well. What does this tell you?",
    opts: ["A and B are mutually exclusive", "A and B are independent", "A causes B"],
    correct: 1,
    exp: "When conditioning on B doesn't change the probability of A, that's the textbook definition of independence."
  },
  {
    concept: "Conditional Probability",
    q: "P(AB) = 0.15 and P(B) = 0.30. What is P(A | B)?",
    opts: ["0.045", "0.50", "2.00"],
    correct: 1,
    exp: "P(A|B) = P(AB)/P(B) = 0.15/0.30 = 0.50."
  },
  {
    concept: "Joint Probability",
    q: "P(A | B) = 0.40 and P(B) = 0.25. What is the joint probability P(AB)?",
    opts: ["0.10", "1.60", "0.65"],
    correct: 0,
    exp: "Multiplication rule: P(AB) = P(A|B) × P(B) = 0.40 × 0.25 = 0.10."
  },
  {
    concept: "Addition Rule",
    q: "P(A) = 0.5, P(B) = 0.4, P(AB) = 0.2. What is P(A or B)?",
    opts: ["0.90", "0.70", "1.10"],
    correct: 1,
    exp: "Addition rule: P(A or B) = P(A) + P(B) − P(AB) = 0.5 + 0.4 − 0.2 = 0.70."
  },
  {
    concept: "Addition Rule",
    q: "Two events are mutually exclusive. What is P(A or B) equal to?",
    opts: ["P(A) + P(B)", "P(A) × P(B)", "P(A) − P(B)"],
    correct: 0,
    exp: "Since mutually exclusive events have P(AB) = 0, the addition rule simplifies to a plain sum."
  },
  {
    concept: "Independent vs Dependent",
    q: "P(A) = 0.7, P(B) = 0.5, and A and B are independent. What is P(A and B)?",
    opts: ["0.35", "1.20", "0.20"],
    correct: 0,
    exp: "Multiplication rule for independent events: P(AB) = P(A) × P(B) = 0.7 × 0.5 = 0.35."
  },
  {
    concept: "Independent vs Dependent",
    q: "You draw two cards from a deck without replacing the first. Are the two draws independent?",
    opts: ["Yes", "No, they're dependent"],
    correct: 1,
    exp: "Removing the first card changes the composition of the deck for the second draw, so the draws are dependent."
  },
  {
    concept: "Total Probability Rule",
    q: "30% of loans are \"high risk\" (default rate 15%) and 70% are \"low risk\" (default rate 3%). Using the total probability rule, what's the overall default rate?",
    opts: ["0.090", "0.066", "0.180"],
    correct: 1,
    exp: "P(default) = 0.15×0.30 + 0.03×0.70 = 0.045 + 0.021 = 0.066, or 6.6%."
  },
  {
    concept: "Total Probability Rule",
    q: "The total probability rule requires the scenarios (S₁, S₂, …, Sₙ) to be:",
    opts: ["Independent and identically distributed", "Mutually exclusive and exhaustive", "Equal in probability"],
    correct: 1,
    exp: "The scenarios must cover every possibility with no overlap — mutually exclusive and exhaustive — for the weighted-average logic to hold."
  },
  {
    concept: "Multiplication & Factorial",
    q: "You must assign 4 distinct tasks to 4 different people, one task each. In how many ways can this be done?",
    opts: ["16", "24", "4"],
    correct: 1,
    exp: "This is 4! = 4×3×2×1 = 24, the classic factorial assignment problem."
  },
  {
    concept: "Multiplication & Factorial",
    q: "A pizza shop offers 5 crusts, 4 sauces, and 6 toppings-combinations. Using the multiplication rule for counting, how many distinct pizzas are possible (one from each category)?",
    opts: ["15", "120", "20"],
    correct: 1,
    exp: "5 × 4 × 6 = 120."
  },
  {
    concept: "Labeling & Combinations",
    q: "You need to choose a 3-person subcommittee (no ranked roles) from 7 board members. How many different subcommittees are possible?",
    opts: ["210", "35", "343"],
    correct: 1,
    exp: "Order doesn't matter, so use the combination formula: ₇C₃ = 7!/(4!×3!) = 35."
  },
  {
    concept: "Permutations",
    q: "5 sprinters race for Gold, Silver, and Bronze (order matters). How many different podium results are possible?",
    opts: ["10", "60", "125"],
    correct: 1,
    exp: "Order matters, so use the permutation formula: ₅P₃ = 5!/2! = 60."
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

    // if already answered, show state
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
          cfaRecordAnswer(item.concept, "Probability Concepts", i === item.correct);
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
      if (current < QUIZ.length - 1){
        current++;
        renderQuestion();
      } else {
        renderScore();
      }
    });
    prevBtn.addEventListener('click', () => {
      if (current > 0){
        current--;
        renderQuestion();
      }
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
