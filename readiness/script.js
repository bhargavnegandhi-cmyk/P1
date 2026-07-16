// ============================================================
// Readiness Dashboard — reads persisted diagnostics and renders
// per-module readiness verdicts + weakest/strongest concept lists
// ============================================================

// The full universe of modules and concepts (mirrors the Final Review's question bank).
// Used to compute coverage — i.e., how many of a module's concepts have been tested at all.
const CFA_MODULE_CONCEPTS = {
  "Numbers & Arithmetic": ["The Four Operations","Negative Numbers","Fractions, Decimals & Percentages","Order of Operations (BODMAS)","Ratios & Proportions","Turning Words Into Math"],
  "Math Foundations": ["Exponents & Roots","Logarithms","Summation Notation","Rearranging Equations","Sets & Set Notation","Functions & the Cartesian Plane"],
  "Interest Rates, PV & FV": ["Interest Rates","Future Value of a Lump Sum","Compounding Frequency & EAR","Future Value of an Annuity","Present Value of a Lump Sum","Present Value of an Annuity","Perpetuities","Rates, Growth & Number of Periods","Size of Annuity Payments","Equivalence & Additivity"],
  "Organizing & Visualizing Data": ["Data Types","Organizing Data","Frequency Distributions","Contingency Tables","Histograms & Frequency Polygons","Line & Bubble Line Charts","Scatter Plots & Matrices","Bar Charts","Tree-Maps & Word Clouds","Heat Maps & Choosing Charts"],
  "Summarizing Data": ["Mean, Median, Mode","Outliers, Trimmed & Winsorized Means","Weighted, Geometric & Harmonic Mean","Quantiles","Measures of Dispersion","Downside Deviation & CV"],
  "Probability Concepts": ["Random Variables & Events","Rules of Probability","Three Ways to Estimate P","Odds","Conditional Probability","Joint Probability","Addition Rule","Independent vs Dependent","Total Probability Rule","Multiplication & Factorial","Labeling & Combinations","Permutations"],
  "Common Probability Distributions": ["Random Variables & Distributions","Discrete Uniform","Continuous Uniform","The Binomial Distribution","Mean, Variance & Applications","Properties of the Normal","The Empirical Rule","Standardizing & Z-Scores","Student's t-Distribution","Chi-Square & F-Distributions"],
  "Sampling & Estimation": ["Point Estimates","Properties of a Good Estimator","Structure & Interpretation","Known Population Variance","Unknown Population Variance","Selecting Sample Size","Data Snooping Bias","Sample Selection & Survivorship","Look-Ahead & Time-Period Bias"],
  "Hypothesis Testing": ["Why Hypothesis Testing?","Stating the Hypotheses","Test Statistics","Significance, Type I/II Errors & Power","Decision Rules & Critical Values","Statistical vs. Economic Significance","The Role of p-Values","Multiple Testing","A Single Mean","Difference in Means — Independent","Difference in Means — Paired","Tests of Variance"],
};

function pctColor(pct){
  if (pct >= 80) return '#2F8F6B';
  if (pct >= 50) return '#E8A33D';
  return '#D6573F';
}

function verdictFor(coverage, accuracy){
  if (coverage === 0) return {label:'Not Yet Assessed', cls:'unassessed'};
  if (coverage < 1) {
    // partially tested — base verdict on accuracy so far, but flag incompleteness in label
    if (accuracy >= 80) return {label:'Partially Assessed — Strong So Far', cls:'review'};
    if (accuracy >= 50) return {label:'Partially Assessed', cls:'review'};
    return {label:'Partially Assessed — Weak So Far', cls:'notready'};
  }
  if (accuracy >= 80) return {label:'Ready', cls:'ready'};
  if (accuracy >= 50) return {label:'Needs Review', cls:'review'};
  return {label:'Not Ready', cls:'notready'};
}

function render(){
  const diagnostics = cfaLoadDiagnostics();
  const container = document.getElementById('dashboardContent');
  const conceptNames = Object.keys(diagnostics);

  if (conceptNames.length === 0){
    container.innerHTML = `
      <div class="empty-state">
        <div style="font-size:2rem;">📊</div>
        <p><strong>No data yet.</strong> This dashboard builds itself from your answers anywhere in this toolkit — any module's quiz, the Final Review, or the flashcards. Try a few cards or questions anywhere (even partially) and your readiness breakdown will appear here, concept by concept.</p>
        <a href="../final-review/index.html" class="start-btn">Take the Final Review →</a>
      </div>`;
    return;
  }

  // Overall summary
  let totalAttempts = 0, totalCorrect = 0;
  conceptNames.forEach(c => { totalAttempts += diagnostics[c].attempts; totalCorrect += diagnostics[c].correct; });
  const overallPct = totalAttempts > 0 ? Math.round((totalCorrect/totalAttempts)*100) : 0;
  const totalConcepts = Object.values(CFA_MODULE_CONCEPTS).reduce((a,arr)=>a+arr.length,0);
  const testedConcepts = conceptNames.length;

  // Build per-concept accuracy list (only concepts with at least 1 attempt)
  const conceptStats = conceptNames.map(name => {
    const d = diagnostics[name];
    const pct = d.attempts > 0 ? Math.round((d.correct/d.attempts)*100) : 0;
    return { name, cat: d.cat, pct, attempts: d.attempts };
  });
  const weakest = [...conceptStats].sort((a,b) => a.pct - b.pct).slice(0, 6);
  const strongest = [...conceptStats].sort((a,b) => b.pct - a.pct).filter(c => c.pct >= 80).slice(0, 6);

  let html = '';

  // Summary row
  html += `<div class="summary-row">
    <div class="summary-card"><div class="k">Overall accuracy</div><div class="v">${overallPct}%</div></div>
    <div class="summary-card"><div class="k">Concepts tested</div><div class="v">${testedConcepts}/${totalConcepts}</div></div>
    <div class="summary-card"><div class="k">Total answers logged</div><div class="v">${totalAttempts}</div></div>
  </div>`;

  // Focus here (weakest)
  if (weakest.length > 0){
    html += `<div class="focus-section"><h2>Focus here — your weakest concepts</h2>`;
    weakest.forEach(c => {
      html += `<span class="concept-pill"><span class="dot" style="background:${pctColor(c.pct)};"></span>${c.name} <span class="pct">${c.pct}%</span></span>`;
    });
    html += `</div>`;
  }

  // Strongest
  if (strongest.length > 0){
    html += `<div class="focus-section"><h2>Confirmed strong</h2>`;
    strongest.forEach(c => {
      html += `<span class="concept-pill"><span class="dot" style="background:${pctColor(c.pct)};"></span>${c.name} <span class="pct">${c.pct}%</span></span>`;
    });
    html += `</div>`;
  }

  // Per-module breakdown
  html += `<div class="focus-section"><h2>Readiness by module</h2>`;
  Object.entries(CFA_MODULE_CONCEPTS).forEach(([cat, allConcepts]) => {
    const testedInCat = allConcepts.filter(c => diagnostics[c]);
    const coverage = testedInCat.length / allConcepts.length;
    let catCorrect = 0, catAttempts = 0;
    testedInCat.forEach(c => { catCorrect += diagnostics[c].correct; catAttempts += diagnostics[c].attempts; });
    const catPct = catAttempts > 0 ? Math.round((catCorrect/catAttempts)*100) : 0;
    const verdict = verdictFor(coverage, catPct);

    html += `<div class="module-card">
      <div class="module-card-head">
        <h3>${cat}</h3>
        <span class="verdict ${verdict.cls}">${verdict.label}</span>
      </div>`;

    allConcepts.forEach(concept => {
      const d = diagnostics[concept];
      if (d){
        const pct = d.attempts > 0 ? Math.round((d.correct/d.attempts)*100) : 0;
        html += `<div class="concept-row">
          <div class="name">${concept}</div>
          <div class="track"><div class="fill" style="width:${pct}%; background:${pctColor(pct)};"></div></div>
          <div class="stat">${d.correct}/${d.attempts} (${pct}%)</div>
        </div>`;
      } else {
        html += `<div class="concept-row">
          <div class="name" style="color:var(--ink-soft);">${concept}</div>
          <div class="track"><div class="fill" style="width:0%;"></div></div>
          <div class="stat" style="color:var(--ink-soft);">not tested</div>
        </div>`;
      }
    });
    html += `</div>`;
  });
  html += `</div>`;

  container.innerHTML = html;
}

document.getElementById('resetBtn').addEventListener('click', () => {
  if (confirm('This clears all recorded quiz performance data from this browser. Continue?')){
    cfaResetDiagnostics();
    render();
  }
});

render();
