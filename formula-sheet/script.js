// ============================================================
// Formula Cheat Sheet — data-driven, rendered with KaTeX
// ============================================================

const MODULES = [
  {
    num: "00",
    title: "Numbers &amp; Arithmetic",
    formulas: [
      { name: "The four operations", tex: ["a+b,\\;\\; a-b,\\;\\; a\\times b,\\;\\; a\\div b"] },
      { name: "Negative number rules", tex: ["a-(-b) = a+b", "(-a)\\times(-b) = ab"] },
      { name: "Fraction ↔ decimal ↔ %", tex: ["\\dfrac{a}{b} \\;(\\div) \\to \\text{decimal} \\;(\\times 100) \\to \\%"] },
      { name: "BODMAS order", tex: ["\\text{Brackets} \\to \\text{Orders} \\to \\dfrac{\\times}{\\div} \\to \\dfrac{+}{-}"], note: "Divide/Multiply and Add/Subtract: left to right within each pair" },
      { name: "Proportion (cross-multiply)", tex: ["\\dfrac{a}{b} = \\dfrac{c}{d} \\;\\Rightarrow\\; ad = bc"] },
      { name: "Percentage change", tex: ["\\%\\Delta = \\dfrac{\\text{new} - \\text{original}}{\\text{original}} \\times 100"] },
    ]
  },
  {
    num: "0A",
    title: "Math Foundations",
    formulas: [
      { name: "Exponent rules", tex: ["x^a \\times x^b = x^{a+b}", "x^a / x^b = x^{a-b}", "(x^a)^b = x^{ab}", "x^{-a} = \\dfrac{1}{x^a}, \\quad x^{1/n} = \\sqrt[n]{x}"] },
      { name: "Logarithm rules", tex: ["\\ln(x)=y \\iff e^y = x", "\\ln(ab) = \\ln a + \\ln b", "\\ln(a/b) = \\ln a - \\ln b", "\\ln(a^b) = b \\ln a"] },
      { name: "Summation notation", tex: ["\\sum_{i=1}^n X_i = X_1+X_2+\\cdots+X_n", "\\sum(X_i+Y_i) = \\sum X_i + \\sum Y_i", "\\sum(cX_i) = c\\sum X_i"] },
      { name: "Linear function", tex: ["y = mx+b"], note: "m = slope, b = y-intercept" },
      { name: "Set operations", tex: ["A \\cup B \\text{ (union): in A or B or both}", "A \\cap B \\text{ (intersection): in both}", "A \\cap B = \\emptyset \\text{ : disjoint / mutually exclusive}"] },
    ]
  },
];

MODULES.push(
  {
    num: "01",
    title: "Interest Rates, PV &amp; FV",
    formulas: [
      { name: "Future value of a lump sum", tex: ["FV = PV(1+r)^N"] },
      { name: "Non-annual compounding", tex: ["FV = PV\\left(1+\\dfrac{r_s}{m}\\right)^{mN}"] },
      { name: "Continuous compounding", tex: ["FV = PV \\cdot e^{r_s N}"] },
      { name: "Effective annual rate (EAR)", tex: ["EAR = \\left(1+\\dfrac{r_s}{m}\\right)^{m} - 1", "EAR = e^{r_s} - 1 \\quad \\text{(continuous)}"] },
      { name: "Present value of a lump sum", tex: ["PV = FV_N(1+r)^{-N}"] },
      { name: "FV of an ordinary annuity", tex: ["FV_N = A \\cdot \\dfrac{(1+r)^N - 1}{r}"] },
      { name: "PV of an ordinary annuity", tex: ["PV = A \\cdot \\dfrac{1-(1+r)^{-N}}{r}"] },
      { name: "PV of an annuity due", tex: ["PV_{due} = PV_{ordinary} \\times (1+r)"] },
      { name: "PV of a perpetuity", tex: ["PV = \\dfrac{A}{r}"], note: "Deferred: value at t−1 before first payment, then discount back to t=0" },
      { name: "Growth rate", tex: ["g = \\left(\\dfrac{FV_N}{PV}\\right)^{1/N} - 1"] },
      { name: "Solving for N", tex: ["N = \\dfrac{\\ln(FV/PV)}{\\ln(1+r)}"], note: "Rule of 72: N ≈ 72 / r(%)" },
      { name: "Annuity payment", tex: ["A = \\dfrac{PV}{\\left[\\dfrac{1-(1+r)^{-N}}{r}\\right]}"] },
    ]
  },
  {
    num: "02",
    title: "Organizing &amp; Visualizing Data",
    formulas: [
      { name: "Bin width (frequency distributions)", tex: ["\\text{Bin width} = \\dfrac{\\text{Range}}{k}"], note: "Range = Max − Min; round bin width up" },
      { name: "Relative frequency", tex: ["\\text{Relative freq} = \\dfrac{\\text{bin count}}{n}"] },
      { name: "Cumulative relative frequency", tex: ["\\text{Running sum of relative frequencies}"], note: "Reaches 100% at the last bin" },
      { name: "Contingency table %", tex: ["\\%\\text{ overall} = \\dfrac{\\text{cell}}{\\text{grand total}}", "\\%\\text{ row} = \\dfrac{\\text{cell}}{\\text{row total}}", "\\%\\text{ column} = \\dfrac{\\text{cell}}{\\text{column total}}"] },
    ]
  },
  {
    num: "03",
    title: "Summarizing Data",
    formulas: [
      { name: "Arithmetic mean", tex: ["\\bar{X} = \\dfrac{\\sum X_i}{n}"] },
      { name: "Weighted mean", tex: ["\\bar{X}_w = \\sum(w_i \\times X_i), \\quad \\sum w_i = 1"] },
      { name: "Geometric mean", tex: ["G = (X_1 \\times X_2 \\times \\cdots \\times X_n)^{1/n}"], note: "For returns: [(1+R₁)(1+R₂)…(1+Rₙ)]^(1/n) − 1" },
      { name: "Harmonic mean", tex: ["H = \\dfrac{n}{\\sum(1/X_i)}"], note: "H ≤ G ≤ X̄ always (equal only if all Xᵢ identical)" },
      { name: "Percentile location", tex: ["L_y = (n+1) \\times \\dfrac{y}{100}"], note: "Interpolate if Ly isn't a whole number" },
      { name: "Range &amp; MAD", tex: ["\\text{Range} = Max - Min", "MAD = \\dfrac{\\sum|X_i - \\bar{X}|}{n}"] },
      { name: "Sample variance &amp; std. dev.", tex: ["s^2 = \\dfrac{\\sum(X_i-\\bar{X})^2}{n-1}", "s = \\sqrt{s^2}"] },
      { name: "Target (semi)deviation", tex: ["s_{target} = \\sqrt{\\dfrac{\\sum(X_i-B)^2}{n-1}}"], note: "Sum only over Xᵢ ≤ target B" },
      { name: "Coefficient of variation", tex: ["CV = \\dfrac{s}{\\bar{X}}"] },
    ]
  },
  {
    num: "04",
    title: "Probability Concepts",
    formulas: [
      { name: "Properties of probability", tex: ["0 \\le P(E) \\le 1", "\\sum P(E_i) = 1"], note: "second line: mutually exclusive &amp; exhaustive" },
      { name: "Odds", tex: ["\\text{Odds for } E = \\dfrac{P(E)}{1-P(E)}", "\\text{Odds against } E = \\dfrac{1-P(E)}{P(E)}"] },
      { name: "Conditional probability", tex: ["P(A|B) = \\dfrac{P(AB)}{P(B)}"] },
      { name: "Multiplication rule", tex: ["P(AB) = P(A|B) \\times P(B)"], note: "If independent: P(AB) = P(A) × P(B)" },
      { name: "Addition rule", tex: ["P(A \\text{ or } B) = P(A)+P(B)-P(AB)"] },
      { name: "Total probability rule", tex: ["P(A) = \\sum P(A|S_i)P(S_i)"], note: "Sᵢ mutually exclusive &amp; exhaustive" },
      { name: "Counting", tex: ["n! = n\\times(n-1)\\times\\cdots\\times 1", "{}_nC_r = \\dfrac{n!}{(n-r)!\\,r!} \\;\\text{(order doesn't matter)}", "{}_nP_r = \\dfrac{n!}{(n-r)!} \\;\\text{(order matters)}", "\\text{Multinomial: } \\dfrac{n!}{n_1!n_2!\\cdots n_k!}"] },
    ]
  },
);

MODULES.push(
  {
    num: "05",
    title: "Common Probability Distributions",
    formulas: [
      { name: "Discrete uniform", tex: ["p(x) = \\dfrac{1}{n}"] },
      { name: "Continuous uniform", tex: ["f(x) = \\dfrac{1}{b-a}", "F(x) = \\dfrac{x-a}{b-a}", "\\mu = \\dfrac{a+b}{2}, \\quad \\sigma^2 = \\dfrac{(b-a)^2}{12}"] },
      { name: "Binomial distribution", tex: ["p(x) = {}_nC_x \\cdot p^x(1-p)^{n-x}", "E(X) = np, \\quad Var(X) = np(1-p)"] },
      { name: "Standardization (Z-score)", tex: ["Z = \\dfrac{X-\\mu}{\\sigma}"] },
      { name: "Empirical rule (normal dist.)", tex: ["\\approx 50\\% \\text{ within } \\mu \\pm \\tfrac{2}{3}\\sigma", "\\approx 68\\% \\text{ within } \\mu \\pm 1\\sigma", "\\approx 95\\% \\text{ within } \\mu \\pm 2\\sigma \\;(\\pm 1.96\\sigma)", "\\approx 99\\% \\text{ within } \\mu \\pm 3\\sigma \\;(\\pm 2.58\\sigma)"] },
      { name: "t / chi-square / F distributions", tex: ["t: \\text{ symmetric, } df=n-1\\text{, fatter tails than normal}", "\\chi^2: \\text{ asymmetric, } \\ge 0 \\text{, } df=k", "F: \\text{ asymmetric, } \\ge 0 \\text{, } df=(m,n)"] },
    ]
  },
  {
    num: "06",
    title: "Sampling &amp; Estimation",
    formulas: [
      { name: "Standard error of the mean", tex: ["SE = \\dfrac{s}{\\sqrt{n}} \\quad (\\text{or } \\sigma/\\sqrt{n} \\text{ if known})"] },
      { name: "Confidence interval — general form", tex: ["\\text{Point estimate} \\pm \\text{Reliability factor} \\times SE"] },
      { name: "CI — known population variance", tex: ["\\bar{X} \\pm z_{\\alpha/2} \\cdot \\dfrac{\\sigma}{\\sqrt{n}}"] },
      { name: "CI — unknown variance", tex: ["\\bar{X} \\pm t_{\\alpha/2} \\cdot \\dfrac{s}{\\sqrt{n}} \\quad df=n-1", "\\text{z-alt (large n): } \\bar{X} \\pm z_{\\alpha/2}\\cdot\\dfrac{s}{\\sqrt{n}}"] },
      { name: "Required sample size", tex: ["n = \\left(\\dfrac{\\text{reliability factor} \\times s}{E}\\right)^2"] },
      { name: "Common z reliability factors", tex: ["90\\% \\to 1.65 \\quad 95\\% \\to 1.96 \\quad 99\\% \\to 2.58"] },
    ]
  },
  {
    num: "07",
    title: "Basics of Hypothesis Testing",
    formulas: [
      { name: "Test of a single mean", tex: ["t = \\dfrac{\\bar{X}-\\mu_0}{s/\\sqrt{n}} \\quad df=n-1"] },
      { name: "Difference in means (independent)", tex: ["s_p^2 = \\dfrac{(n_1-1)s_1^2+(n_2-1)s_2^2}{n_1+n_2-2}", "t = \\dfrac{(\\bar{X}_1-\\bar{X}_2)-(\\mu_1-\\mu_2)}{\\sqrt{s_p^2/n_1+s_p^2/n_2}}", "df = n_1+n_2-2"] },
      { name: "Difference in means (paired)", tex: ["t = \\dfrac{\\bar{d}-\\mu_{d0}}{s_{\\bar{d}}} \\quad s_{\\bar{d}}=\\dfrac{s_d}{\\sqrt{n}} \\quad df=n-1"] },
      { name: "Test of a single variance", tex: ["\\chi^2 = \\dfrac{(n-1)s^2}{\\sigma_0^2} \\quad df=n-1"] },
      { name: "Test of equality of two variances", tex: ["F = \\dfrac{s_1^2}{s_2^2} \\quad df=(n_1-1,\\, n_2-1)"], note: "Convention: larger variance in numerator" },
      { name: "Key vocabulary", tex: ["\\alpha = P(\\text{Type I error}), \\quad \\beta = P(\\text{Type II error})", "\\text{Power} = 1-\\beta"], note: "p-value: smallest α at which H₀ is still rejected" },
    ]
  }
);

/* ============================================================
   Render engine
   ============================================================ */
(function(){
  const sheet = document.getElementById('sheet');
  MODULES.forEach(mod => {
    const block = document.createElement('div');
    block.className = 'module-block';

    const h2 = document.createElement('h2');
    h2.innerHTML = `<span class="module-num">${mod.num}</span>${mod.title}`;
    block.appendChild(h2);

    mod.formulas.forEach(f => {
      const item = document.createElement('div');
      item.className = 'formula-item';

      const name = document.createElement('div');
      name.className = 'formula-name';
      name.innerHTML = f.name;
      item.appendChild(name);

      const expr = document.createElement('div');
      expr.className = 'formula-expr';
      f.tex.forEach(line => {
        const lineDiv = document.createElement('div');
        lineDiv.className = 'katex-line';
        try {
          katex.render(line, lineDiv, { throwOnError: false, displayMode: false });
        } catch(e) {
          lineDiv.textContent = line;
        }
        expr.appendChild(lineDiv);
      });
      item.appendChild(expr);

      if (f.note){
        const note = document.createElement('div');
        note.className = 'formula-note';
        note.innerHTML = f.note;
        item.appendChild(note);
      }

      block.appendChild(item);
    });

    sheet.appendChild(block);
  });
})();
