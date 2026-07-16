// ============================================================
// Flashcards — 162 cards, 2 per concept, across all 9 Quant modules
// Self-assessment feeds the shared diagnostics system
// ============================================================

const FLASHCARDS = [
  // ===== Numbers & Arithmetic =====
  { cat:"Numbers & Arithmetic", concept:"The Four Operations",
    front:"What does 6 × 4 actually represent?", back:"Six groups of four, added together — repeated addition: 4+4+4+4+4+4 = 24." },
  { cat:"Numbers & Arithmetic", concept:"The Four Operations",
    front:"What question does 18 ÷ 3 actually ask?", back:"How many groups of 3 fit inside 18? (Answer: 6 groups.)" },

  { cat:"Numbers & Arithmetic", concept:"Negative Numbers",
    front:"How do you handle subtracting a negative number?", back:"Subtracting a negative flips to addition: a − (−b) = a + b." },
  { cat:"Numbers & Arithmetic", concept:"Negative Numbers",
    front:"What's the sign rule for multiplying two negative numbers?", back:"Multiplying two negatives gives a positive." },

  { cat:"Numbers & Arithmetic", concept:"Fractions, Decimals & Percentages",
    front:"How do you convert a fraction to a decimal?", back:"Divide the numerator by the denominator." },
  { cat:"Numbers & Arithmetic", concept:"Fractions, Decimals & Percentages",
    front:"What's the '10% then adjust' trick for finding 15% of a number?", back:"Find 10% (move the decimal one place left), then add half of that (5%) again." },

  { cat:"Numbers & Arithmetic", concept:"Order of Operations (BODMAS)",
    front:"What does BODMAS stand for?", back:"Brackets, Orders (powers/roots), Division & Multiplication (left to right), Addition & Subtraction (left to right)." },
  { cat:"Numbers & Arithmetic", concept:"Order of Operations (BODMAS)",
    front:"Do Division and Multiplication have different priority in BODMAS?", back:"No — they share equal priority and are resolved strictly left to right." },

  { cat:"Numbers & Arithmetic", concept:"Ratios & Proportions",
    front:"How do you solve a proportion like a/b = c/x?", back:"Cross-multiply: a×x = b×c, then solve for x." },
  { cat:"Numbers & Arithmetic", concept:"Ratios & Proportions",
    front:"What is the 'unitary method' for ratio problems?", back:"Find the value of one unit first, then scale up to however many units you need." },

  { cat:"Numbers & Arithmetic", concept:"Turning Words Into Math",
    front:"What does 'reduced to only 75% of its original price' mean as a single operation?", back:"A 25% discount — if 75% remains, 25% was removed." },
  { cat:"Numbers & Arithmetic", concept:"Turning Words Into Math",
    front:"What's the formula for percentage change?", back:"%Δ = (New value − Original value) / Original value." },

  // ===== Math Foundations =====
  { cat:"Math Foundations", concept:"Exponents & Roots",
    front:"What's the rule for dividing exponents with the same base?", back:"xᵃ / xᵇ = xᵃ⁻ᵇ — subtract the exponents." },
  { cat:"Math Foundations", concept:"Exponents & Roots",
    front:"What does a negative exponent mean?", back:"It means 'take the reciprocal': x⁻ᵃ = 1/xᵃ." },

  { cat:"Math Foundations", concept:"Logarithms",
    front:"What's the relationship between ln(x)=y and exponents?", back:"ln(x)=y means exactly the same thing as e^y = x — logs and exponents are inverses." },
  { cat:"Math Foundations", concept:"Logarithms",
    front:"What log rule lets you solve FV=PV(1+r)^N for N?", back:"ln(aᵇ) = b×ln(a) — taking ln of both sides brings N down out of the exponent." },

  { cat:"Math Foundations", concept:"Summation Notation",
    front:"What does Σᵢ₌₁ⁿ Xᵢ mean?", back:"Add up X₁ through Xₙ — it's shorthand for repeated addition." },
  { cat:"Math Foundations", concept:"Summation Notation",
    front:"Can you factor a constant out of a summation?", back:"Yes: Σ(c×Xᵢ) = c×ΣXᵢ." },

  { cat:"Math Foundations", concept:"Rearranging Equations",
    front:"What's the one rule behind rearranging any equation?", back:"Whatever you do to one side, you must do to the other — an equation is a balance scale." },
  { cat:"Math Foundations", concept:"Rearranging Equations",
    front:"When rearranging, what's the most common mistake to avoid?", back:"Applying an operation to only part of one side, instead of the entire side." },

  { cat:"Math Foundations", concept:"Sets & Set Notation",
    front:"What does A ∩ B mean?", back:"The intersection — elements found in both A and B." },
  { cat:"Math Foundations", concept:"Sets & Set Notation",
    front:"What does A ∩ B = ∅ tell you about two events?", back:"They're mutually exclusive — no shared outcomes." },

  { cat:"Math Foundations", concept:"Functions & the Cartesian Plane",
    front:"In y = mx + b, what do m and b represent?", back:"m is the slope (rise per unit run); b is the y-intercept (value of y when x=0)." },
  { cat:"Math Foundations", concept:"Functions & the Cartesian Plane",
    front:"What's the defining property of a function?", back:"Exactly one output for every input — never two different outputs for the same input." },

  // ===== Interest Rates, PV & FV =====
  { cat:"Interest Rates, PV & FV", concept:"Interest Rates",
    front:"What two components make up the nominal risk-free rate?", back:"The real risk-free rate plus the expected inflation premium." },
  { cat:"Interest Rates, PV & FV", concept:"Interest Rates",
    front:"What does the liquidity premium compensate for?", back:"The extra risk of holding an asset that's hard to sell quickly without a price concession." },

  { cat:"Interest Rates, PV & FV", concept:"Future Value of a Lump Sum",
    front:"Give the future value of a lump sum formula.", back:"FV = PV × (1+r)^N." },
  { cat:"Interest Rates, PV & FV", concept:"Future Value of a Lump Sum",
    front:"Holding the rate fixed, what happens to FV as N increases?", back:"FV rises — more compounding periods at a positive rate always increases future value." },

  { cat:"Interest Rates, PV & FV", concept:"Compounding Frequency & EAR",
    front:"How do you calculate the effective annual rate from a stated rate compounded m times a year?", back:"EAR = (1 + stated rate/m)^m − 1." },
  { cat:"Interest Rates, PV & FV", concept:"Compounding Frequency & EAR",
    front:"Does more frequent compounding ever decrease the EAR?", back:"No — holding the stated rate fixed, more frequent compounding always increases (or leaves unchanged) the EAR." },

  { cat:"Interest Rates, PV & FV", concept:"Future Value of an Annuity",
    front:"Give the future value annuity factor formula.", back:"FV factor = [(1+r)^N − 1] / r." },
  { cat:"Interest Rates, PV & FV", concept:"Future Value of an Annuity",
    front:"How does an annuity due's future value compare to an ordinary annuity's?", back:"FV(due) = FV(ordinary) × (1+r) — each payment compounds for one extra period." },

  { cat:"Interest Rates, PV & FV", concept:"Present Value of a Lump Sum",
    front:"Give the present value of a lump sum formula.", back:"PV = FV / (1+r)^N." },
  { cat:"Interest Rates, PV & FV", concept:"Present Value of a Lump Sum",
    front:"Holding the discount rate constant, what happens to PV as a payment moves further into the future?", back:"PV falls — more distant payments get discounted more heavily." },

  { cat:"Interest Rates, PV & FV", concept:"Present Value of an Annuity",
    front:"Give the present value annuity factor formula.", back:"PV factor = [1 − (1+r)⁻ᴺ] / r." },
  { cat:"Interest Rates, PV & FV", concept:"Present Value of an Annuity",
    front:"How do you value a deferred annuity whose first payment is at t=8?", back:"Value it as an ordinary annuity as of t=7 (one period before the first payment), then discount that value back to t=0." },

  { cat:"Interest Rates, PV & FV", concept:"Perpetuities",
    front:"Give the perpetuity present value formula.", back:"PV = Payment / r." },
  { cat:"Interest Rates, PV & FV", concept:"Perpetuities",
    front:"How do you value a deferred perpetuity whose first payment is at t=4?", back:"Value it as a normal perpetuity as of t=3, then discount that value back to today." },

  { cat:"Interest Rates, PV & FV", concept:"Rates, Growth & Number of Periods",
    front:"Give the compound annual growth rate (CAGR) formula.", back:"CAGR = (Ending value / Beginning value)^(1/N) − 1." },
  { cat:"Interest Rates, PV & FV", concept:"Rates, Growth & Number of Periods",
    front:"What is the Rule of 72 used for?", back:"Quickly estimating how many years it takes an investment to double: years ≈ 72/interest rate." },

  { cat:"Interest Rates, PV & FV", concept:"Size of Annuity Payments",
    front:"How do you solve for the payment on a loan?", back:"Rearrange the present value of an annuity formula, since the loan amount (PV) is known and the payment is the unknown." },
  { cat:"Interest Rates, PV & FV", concept:"Size of Annuity Payments",
    front:"What's the formula for the annuity payment given PV?", back:"Payment = PV / (PV annuity factor)." },

  { cat:"Interest Rates, PV & FV", concept:"Equivalence & Additivity",
    front:"What does the cash flow additivity principle require?", back:"Cash flows can only be added or subtracted directly once they're all valued at the same point in time." },
  { cat:"Interest Rates, PV & FV", concept:"Equivalence & Additivity",
    front:"Why can't you directly add a cash flow at t=1 to one at t=5?", back:"They're at different points in time — you must first move them to a common date (via FV or PV) before combining them." },

  // ===== Organizing & Visualizing Data =====
  { cat:"Organizing & Visualizing Data", concept:"Data Types",
    front:"What's the difference between nominal and ordinal data?", back:"Nominal: categories with no inherent order (e.g., sector codes). Ordinal: categories with a meaningful order but unequal gaps (e.g., credit ratings)." },
  { cat:"Organizing & Visualizing Data", concept:"Data Types",
    front:"What is panel data?", back:"Data that combines multiple entities observed over multiple time periods — a blend of cross-sectional and time-series data." },

  { cat:"Organizing & Visualizing Data", concept:"Organizing Data",
    front:"What is raw data?", back:"Unprocessed data collected directly from its source, before any cleaning or structuring." },
  { cat:"Organizing & Visualizing Data", concept:"Organizing Data",
    front:"What makes data 'structured'?", back:"It's arranged into rows (observations) and columns (variables) — the standard tabular format." },

  { cat:"Organizing & Visualizing Data", concept:"Frequency Distributions",
    front:"How do you calculate bin width for a frequency distribution?", back:"Bin width = (maximum value − minimum value) / number of bins." },
  { cat:"Organizing & Visualizing Data", concept:"Frequency Distributions",
    front:"What must the cumulative relative frequency of the last bin always equal?", back:"1 (100%) — every observation is accounted for by the final bin." },

  { cat:"Organizing & Visualizing Data", concept:"Contingency Tables",
    front:"What are the row and column totals in a contingency table called?", back:"Marginal frequencies." },
  { cat:"Organizing & Visualizing Data", concept:"Contingency Tables",
    front:"What does dividing each cell by its row total show you?", back:"Within each row, what proportion falls into each column category." },

  { cat:"Organizing & Visualizing Data", concept:"Histograms & Frequency Polygons",
    front:"What does the tallest bar on a histogram represent?", back:"The bin with the highest frequency." },
  { cat:"Organizing & Visualizing Data", concept:"Histograms & Frequency Polygons",
    front:"How is a frequency polygon constructed?", back:"By connecting the midpoint of each histogram bar's top with straight lines." },

  { cat:"Organizing & Visualizing Data", concept:"Line & Bubble Line Charts",
    front:"What does a bubble line chart add to a standard line chart?", back:"A third dimension of data, shown through the size of the bubble at each point." },
  { cat:"Organizing & Visualizing Data", concept:"Line & Bubble Line Charts",
    front:"What's the best chart type for comparing trends of multiple series over time?", back:"A line chart." },

  { cat:"Organizing & Visualizing Data", concept:"Scatter Plots & Matrices",
    front:"What does a scatter plot with points tightly hugging an upward line indicate?", back:"A strong positive relationship between the two variables." },
  { cat:"Organizing & Visualizing Data", concept:"Scatter Plots & Matrices",
    front:"What's the most efficient chart for inspecting pairwise relationships among many variables at once?", back:"A scatter plot matrix." },

  { cat:"Organizing & Visualizing Data", concept:"Bar Charts",
    front:"What advantage does a stacked bar chart have over a grouped bar chart?", back:"It shows each bar's total (marginal) value at a glance, while still breaking it into sub-components." },
  { cat:"Organizing & Visualizing Data", concept:"Bar Charts",
    front:"What's misleading about a bar chart whose y-axis doesn't start at zero?", back:"It visually exaggerates differences between bars that may not be as large as they appear." },

  { cat:"Organizing & Visualizing Data", concept:"Tree-Maps & Word Clouds",
    front:"What visual property does a tree-map use to represent magnitude?", back:"Rectangle area, not height or length." },
  { cat:"Organizing & Visualizing Data", concept:"Tree-Maps & Word Clouds",
    front:"What's a word cloud best suited for visualizing?", back:"The relative frequency of terms in unstructured text, like an earnings call transcript." },

  { cat:"Organizing & Visualizing Data", concept:"Heat Maps & Choosing Charts",
    front:"What is a heat map commonly used to visualize?", back:"A correlation matrix, using color intensity to represent the strength of relationships." },
  { cat:"Organizing & Visualizing Data", concept:"Heat Maps & Choosing Charts",
    front:"What's the best chart for exploring whether two continuous numerical variables are related?", back:"A scatter plot." },

  // ===== Summarizing Data =====
  { cat:"Summarizing Data", concept:"Mean, Median, Mode",
    front:"For any dataset, what does the sum of deviations from the mean always equal?", back:"Zero — deviations above and below the mean always cancel out exactly." },
  { cat:"Summarizing Data", concept:"Mean, Median, Mode",
    front:"For a positively (right) skewed distribution, what's the typical order of mean, median, mode?", back:"Mode < Median < Mean." },

  { cat:"Summarizing Data", concept:"Outliers, Trimmed & Winsorized Means",
    front:"Which measure of central tendency is least affected by an extreme outlier: mean or median?", back:"The median — it's based on position, not magnitude, so it barely moves when an outlier is added." },
  { cat:"Summarizing Data", concept:"Outliers, Trimmed & Winsorized Means",
    front:"How does a winsorized mean differ from a trimmed mean?", back:"A trimmed mean removes extreme values entirely; a winsorized mean replaces them with a specified percentile value instead of deleting them." },

  { cat:"Summarizing Data", concept:"Weighted, Geometric & Harmonic Mean",
    front:"How do you calculate a weighted mean?", back:"Multiply each value by its weight, then sum the results." },
  { cat:"Summarizing Data", concept:"Weighted, Geometric & Harmonic Mean",
    front:"Which mean is most appropriate for averaging investment returns over multiple periods?", back:"The geometric mean — it correctly captures compounding, unlike the arithmetic mean." },

  { cat:"Summarizing Data", concept:"Quantiles",
    front:"How do you find the position (L) of the median in a sorted sample of n observations?", back:"L50 = (n+1) × 0.50." },
  { cat:"Summarizing Data", concept:"Quantiles",
    front:"How is the interquartile range (IQR) calculated?", back:"IQR = Q3 − Q1." },

  { cat:"Summarizing Data", concept:"Measures of Dispersion",
    front:"Why does sample variance divide by (n−1) instead of n?", back:"To correct for a downward bias — using the sample mean instead of the true population mean understates variability, so (n−1) provides an unbiased estimator." },
  { cat:"Summarizing Data", concept:"Measures of Dispersion",
    front:"What does mean absolute deviation (MAD) use instead of squaring deviations?", back:"The absolute value of each deviation from the mean." },

  { cat:"Summarizing Data", concept:"Downside Deviation & CV",
    front:"How is the coefficient of variation (CV) calculated?", back:"CV = Standard deviation / Mean — risk per unit of return." },
  { cat:"Summarizing Data", concept:"Downside Deviation & CV",
    front:"How does raising the target return affect a target semideviation calculation?", back:"It typically increases measured downside risk, since more observations now fall below the higher target." },

  // ===== Probability Concepts =====
  { cat:"Probability Concepts", concept:"Random Variables & Events",
    front:"What's the difference between a random variable and an event?", back:"A random variable is a quantity whose value is uncertain; an event is a specified outcome or set of outcomes." },
  { cat:"Probability Concepts", concept:"Random Variables & Events",
    front:"What makes a random variable 'discrete'?", back:"It can take on a countable set of distinct values, like the number of defaults in a portfolio." },

  { cat:"Probability Concepts", concept:"Rules of Probability",
    front:"What two conditions define a valid probability?", back:"0 ≤ P(E) ≤ 1 for every event, and the probabilities of all possible outcomes must sum to 1." },
  { cat:"Probability Concepts", concept:"Rules of Probability",
    front:"If A and B are mutually exclusive, what is P(A and B)?", back:"0 — mutually exclusive events can never occur together." },

  { cat:"Probability Concepts", concept:"Three Ways to Estimate P",
    front:"Name the three ways to estimate a probability.", back:"A priori (logical reasoning), empirical (historical data), and subjective (personal judgment)." },
  { cat:"Probability Concepts", concept:"Three Ways to Estimate P",
    front:"What is a priori probability based on?", back:"Formal reasoning and logical structure, without relying on data or personal judgment." },

  { cat:"Probability Concepts", concept:"Odds",
    front:"How do you convert a probability P(E) into odds for E?", back:"Odds for E = P(E) / [1 − P(E)]." },
  { cat:"Probability Concepts", concept:"Odds",
    front:"If odds against an event are quoted as 'a to b', what's the implied probability?", back:"P(event) = b / (a+b)." },

  { cat:"Probability Concepts", concept:"Conditional Probability",
    front:"Give the formula for conditional probability P(A|B).", back:"P(A|B) = P(AB) / P(B)." },
  { cat:"Probability Concepts", concept:"Conditional Probability",
    front:"If P(A|B) = P(A), what does that tell you?", back:"A and B are independent — conditioning on B doesn't change A's probability." },

  { cat:"Probability Concepts", concept:"Joint Probability",
    front:"Give the multiplication rule for joint probability.", back:"P(AB) = P(A|B) × P(B)." },
  { cat:"Probability Concepts", concept:"Joint Probability",
    front:"When does the multiplication rule simplify to P(AB) = P(A) × P(B)?", back:"When A and B are independent." },

  { cat:"Probability Concepts", concept:"Addition Rule",
    front:"Give the addition rule for P(A or B).", back:"P(A or B) = P(A) + P(B) − P(AB)." },
  { cat:"Probability Concepts", concept:"Addition Rule",
    front:"How does the addition rule simplify for mutually exclusive events?", back:"P(A or B) = P(A) + P(B), since P(AB) = 0." },

  { cat:"Probability Concepts", concept:"Independent vs Dependent",
    front:"For independent events, how do you calculate P(A and B)?", back:"P(AB) = P(A) × P(B)." },
  { cat:"Probability Concepts", concept:"Independent vs Dependent",
    front:"Are two card draws without replacement independent?", back:"No — removing the first card changes the composition of the deck, making the draws dependent." },

  { cat:"Probability Concepts", concept:"Total Probability Rule",
    front:"What condition must the scenarios in the total probability rule satisfy?", back:"They must be mutually exclusive and exhaustive — covering every possibility exactly once." },
  { cat:"Probability Concepts", concept:"Total Probability Rule",
    front:"How do you compute an overall probability using the total probability rule?", back:"Sum each scenario's probability times its conditional probability of the event: P(E) = ΣP(Sᵢ)×P(E|Sᵢ)." },

  { cat:"Probability Concepts", concept:"Multiplication & Factorial",
    front:"How do you count total combinations across independent categories (e.g., appetizers × mains × desserts)?", back:"Multiply the number of choices in each category together — the multiplication rule for counting." },
  { cat:"Probability Concepts", concept:"Multiplication & Factorial",
    front:"How many ways can you arrange n distinct items in a sequence?", back:"n! (n factorial)." },

  { cat:"Probability Concepts", concept:"Labeling & Combinations",
    front:"Give the combinations formula for choosing r items from n (order doesn't matter).", back:"nCr = n! / [r!(n−r)!]." },
  { cat:"Probability Concepts", concept:"Labeling & Combinations",
    front:"When should you use combinations instead of permutations?", back:"When the order of selection doesn't matter — like choosing a committee with no distinct roles." },

  { cat:"Probability Concepts", concept:"Permutations",
    front:"Give the permutations formula for arranging r items from n (order matters).", back:"nPr = n! / (n−r)!." },
  { cat:"Probability Concepts", concept:"Permutations",
    front:"When should you use permutations instead of combinations?", back:"When order matters — like awarding distinct Gold/Silver/Bronze positions." },

  // ===== Common Probability Distributions =====
  { cat:"Common Probability Distributions", concept:"Random Variables & Distributions",
    front:"For a continuous random variable, what's the probability it takes on any single exact value?", back:"0 — probability is only meaningful over a range for continuous distributions." },
  { cat:"Common Probability Distributions", concept:"Random Variables & Distributions",
    front:"Give an example of a discrete random variable in finance.", back:"The number of trades executed in a day, or the number of defaults in a bond portfolio." },

  { cat:"Common Probability Distributions", concept:"Discrete Uniform",
    front:"In a discrete uniform distribution with n equally likely outcomes, what's the probability of each?", back:"1/n." },
  { cat:"Common Probability Distributions", concept:"Discrete Uniform",
    front:"For a discrete uniform variable over 1 to n, how do you find F(k) (the CDF)?", back:"F(k) = k/n — the count of outcomes at or below k, divided by the total count." },

  { cat:"Common Probability Distributions", concept:"Continuous Uniform",
    front:"Give the mean formula for a continuous uniform distribution over [a,b].", back:"Mean = (a+b)/2." },
  { cat:"Common Probability Distributions", concept:"Continuous Uniform",
    front:"How do you find P(x1 ≤ X ≤ x2) for a continuous uniform distribution over [a,b]?", back:"P = (x2−x1)/(b−a) — the proportion of the total range covered." },

  { cat:"Common Probability Distributions", concept:"The Binomial Distribution",
    front:"What two conditions must hold for a binomial distribution to apply?", back:"Each trial is independent, and each has the same (constant) probability of success." },
  { cat:"Common Probability Distributions", concept:"The Binomial Distribution",
    front:"When is a binomial distribution symmetric?", back:"When p (probability of success) exactly equals 0.5." },

  { cat:"Common Probability Distributions", concept:"Mean, Variance & Applications",
    front:"Give the mean formula for a binomial distribution.", back:"Mean = n × p." },
  { cat:"Common Probability Distributions", concept:"Mean, Variance & Applications",
    front:"Give the variance formula for a binomial distribution.", back:"Variance = n × p × (1−p)." },

  { cat:"Common Probability Distributions", concept:"Properties of the Normal",
    front:"What two parameters fully describe a normal distribution?", back:"Its mean and its variance." },
  { cat:"Common Probability Distributions", concept:"Properties of the Normal",
    front:"Is a linear combination of jointly normal random variables also normal?", back:"Yes — a portfolio return built from jointly normal asset returns is itself normally distributed." },

  { cat:"Common Probability Distributions", concept:"The Empirical Rule",
    front:"What percentage of a normal distribution falls within ±1 standard deviation?", back:"Approximately 68%." },
  { cat:"Common Probability Distributions", concept:"The Empirical Rule",
    front:"What percentage of a normal distribution falls within ±2 and ±3 standard deviations?", back:"About 95% within ±2 SD, and about 99.7% within ±3 SD." },

  { cat:"Common Probability Distributions", concept:"Standardizing & Z-Scores",
    front:"Give the Z-score formula.", back:"Z = (X − μ) / σ." },
  { cat:"Common Probability Distributions", concept:"Standardizing & Z-Scores",
    front:"If P(Z ≤ 1.28) ≈ 0.90, what is P(Z > 1.28)?", back:"0.10 — since total probability is 1, P(Z>1.28) = 1 − P(Z≤1.28)." },

  { cat:"Common Probability Distributions", concept:"Student's t-Distribution",
    front:"Why does the t-distribution have fatter tails than the normal distribution?", back:"It reflects the extra uncertainty from estimating the population standard deviation using the sample standard deviation." },
  { cat:"Common Probability Distributions", concept:"Student's t-Distribution",
    front:"What happens to the t-distribution as degrees of freedom grow very large?", back:"It converges toward the standard normal distribution." },

  { cat:"Common Probability Distributions", concept:"Chi-Square & F-Distributions",
    front:"What is the chi-square distribution built from?", back:"The sum of squared independent standard normal random variables." },
  { cat:"Common Probability Distributions", concept:"Chi-Square & F-Distributions",
    front:"How many degrees-of-freedom parameters does the F-distribution require?", back:"Two — one for the numerator, one for the denominator, since it's the ratio of two chi-square variables." },

  // ===== Sampling & Estimation =====
  { cat:"Sampling & Estimation", concept:"Point Estimates",
    front:"What is a point estimate?", back:"A single calculated value, like a sample mean, used as a best guess for an unknown population parameter." },
  { cat:"Sampling & Estimation", concept:"Point Estimates",
    front:"What's the point estimate formula for the sample mean?", back:"Sum all observations, then divide by the count." },

  { cat:"Sampling & Estimation", concept:"Properties of a Good Estimator",
    front:"What makes an estimator 'unbiased'?", back:"Its expected value equals the true population parameter, at every sample size." },
  { cat:"Sampling & Estimation", concept:"Properties of a Good Estimator",
    front:"What makes an estimator 'consistent'?", back:"Its sampling distribution concentrates increasingly tightly around the true parameter as sample size grows." },

  { cat:"Sampling & Estimation", concept:"Structure & Interpretation",
    front:"What's the general structure of every confidence interval?", back:"Point estimate ± (reliability factor × standard error)." },
  { cat:"Sampling & Estimation", concept:"Structure & Interpretation",
    front:"How does raising the confidence level from 90% to 99% affect the interval's width?", back:"It widens the interval — a higher confidence level requires a larger reliability factor." },

  { cat:"Sampling & Estimation", concept:"Known Population Variance",
    front:"With known population variance, which distribution provides the reliability factor?", back:"The standard normal (z) distribution." },
  { cat:"Sampling & Estimation", concept:"Known Population Variance",
    front:"What's the z reliability factor for a 95% confidence interval?", back:"±1.96." },

  { cat:"Sampling & Estimation", concept:"Unknown Population Variance",
    front:"With unknown population variance and a small sample, which distribution should you use?", back:"The t-distribution, with n−1 degrees of freedom." },
  { cat:"Sampling & Estimation", concept:"Unknown Population Variance",
    front:"Why is it acceptable to use a z reliability factor with unknown variance, if the sample is large?", back:"The t-distribution converges to the normal distribution as sample size (and degrees of freedom) grows large." },

  { cat:"Sampling & Estimation", concept:"Selecting Sample Size",
    front:"Give the standard error of the sample mean formula.", back:"SE = σ / √n." },
  { cat:"Sampling & Estimation", concept:"Selecting Sample Size",
    front:"If sample size quadruples (n → 4n), what happens to the standard error?", back:"It halves — SE is proportional to 1/√n, and √4=2." },

  { cat:"Sampling & Estimation", concept:"Data Snooping Bias",
    front:"What is data snooping (data mining) bias?", back:"Testing many variables on the same dataset and reporting only the significant few, without disclosing the rest." },
  { cat:"Sampling & Estimation", concept:"Data Snooping Bias",
    front:"What's a warning sign of data mining in a research paper?", back:"Describing a signal as found by 'searching many possible variables until one worked.'" },

  { cat:"Sampling & Estimation", concept:"Sample Selection & Survivorship",
    front:"What is survivorship bias?", back:"When a dataset only includes entities that 'survived' (like still-operating funds), excluding those that failed or closed, overstating historical performance." },
  { cat:"Sampling & Estimation", concept:"Sample Selection & Survivorship",
    front:"Does survivorship bias make historical data look better or worse than reality?", back:"Better — failures are excluded, inflating average performance." },

  { cat:"Sampling & Estimation", concept:"Look-Ahead & Time-Period Bias",
    front:"What is look-ahead bias?", back:"Using information in a backtest before it was actually publicly available to investors at that time." },
  { cat:"Sampling & Estimation", concept:"Look-Ahead & Time-Period Bias",
    front:"What is time-period bias?", back:"Results being sensitive to the specific time period studied, especially when market regimes shift within that period." },

  // ===== Hypothesis Testing =====
  { cat:"Hypothesis Testing", concept:"Why Hypothesis Testing?",
    front:"What is hypothesis testing fundamentally used for?", back:"Using sample data to assess a specific claim about an unknown population parameter." },
  { cat:"Hypothesis Testing", concept:"Why Hypothesis Testing?",
    front:"Can hypothesis testing ever absolutely prove a null hypothesis true?", back:"No — it only ever supports 'reject' or 'fail to reject,' based on probability, never absolute proof." },

  { cat:"Hypothesis Testing", concept:"Stating the Hypotheses",
    front:"What is the null hypothesis (H₀)?", back:"The specific claim being directly tested, assumed true until evidence suggests otherwise." },
  { cat:"Hypothesis Testing", concept:"Stating the Hypotheses",
    front:"What makes a hypothesis test 'two-sided'?", back:"The alternative hypothesis uses 'not equal to' (≠) rather than a directional inequality." },

  { cat:"Hypothesis Testing", concept:"Test Statistics",
    front:"Give the general formula for a test statistic.", back:"(Sample statistic − Hypothesized value) / Standard error." },
  { cat:"Hypothesis Testing", concept:"Test Statistics",
    front:"Which distribution does a single-mean test statistic follow with unknown variance and a small sample?", back:"The t-distribution, with n−1 degrees of freedom." },

  { cat:"Hypothesis Testing", concept:"Significance, Type I/II Errors & Power",
    front:"What is a Type I error?", back:"Incorrectly rejecting a null hypothesis that's actually true (a false positive)." },
  { cat:"Hypothesis Testing", concept:"Significance, Type I/II Errors & Power",
    front:"How is the power of a test defined?", back:"1 minus the probability of a Type II error — the probability of correctly rejecting a false null hypothesis." },

  { cat:"Hypothesis Testing", concept:"Decision Rules & Critical Values",
    front:"What are the two-sided 5% critical values for a z-distributed test statistic?", back:"±1.96." },
  { cat:"Hypothesis Testing", concept:"Decision Rules & Critical Values",
    front:"If a hypothesized value falls outside the corresponding confidence interval, what's the decision?", back:"Reject the null hypothesis." },

  { cat:"Hypothesis Testing", concept:"Statistical vs. Economic Significance",
    front:"Can a result be statistically significant but not economically significant?", back:"Yes — a real, detectable effect can still be too small to matter once real-world costs (like transaction costs) are considered." },
  { cat:"Hypothesis Testing", concept:"Statistical vs. Economic Significance",
    front:"Why can very large samples produce statistically significant but practically meaningless results?", back:"With enough data, even a tiny, trivial effect can become statistically detectable." },

  { cat:"Hypothesis Testing", concept:"The Role of p-Values",
    front:"What is the p-value of a hypothesis test?", back:"The smallest significance level at which the null hypothesis could be rejected, given the observed data." },
  { cat:"Hypothesis Testing", concept:"The Role of p-Values",
    front:"If the p-value is less than the significance level, what's the decision?", back:"Reject the null hypothesis." },

  { cat:"Hypothesis Testing", concept:"Multiple Testing",
    front:"Running 100 independent tests at 5% significance, with every null true, how many false positives are expected by chance?", back:"About 5 (100 × 0.05)." },
  { cat:"Hypothesis Testing", concept:"Multiple Testing",
    front:"What does the Benjamini-Hochberg procedure control for?", back:"The false discovery rate when running many simultaneous hypothesis tests." },

  { cat:"Hypothesis Testing", concept:"A Single Mean",
    front:"Give the t-statistic formula for testing a single mean.", back:"t = (X̄ − μ₀) / (s/√n)." },
  { cat:"Hypothesis Testing", concept:"A Single Mean",
    front:"What degrees of freedom apply to a single-mean t-test?", back:"n − 1." },

  { cat:"Hypothesis Testing", concept:"Difference in Means — Independent",
    front:"What degrees of freedom apply to a pooled-variance two-sample t-test?", back:"n₁ + n₂ − 2." },
  { cat:"Hypothesis Testing", concept:"Difference in Means — Independent",
    front:"What assumption does the pooled variance approach require?", back:"The two populations being compared have equal variances." },

  { cat:"Hypothesis Testing", concept:"Difference in Means — Paired",
    front:"When should you use a paired comparisons test instead of an independent samples test?", back:"When the same set of observations is measured twice (e.g., the same companies, or the same time periods) — shared underlying units." },
  { cat:"Hypothesis Testing", concept:"Difference in Means — Paired",
    front:"How does a paired test actually work?", back:"It calculates the difference for each pair, then runs a single-mean test on whether that mean difference is zero." },

  { cat:"Hypothesis Testing", concept:"Tests of Variance",
    front:"What test statistic and distribution are used to test a single population variance?", back:"A chi-square test statistic, using the chi-square distribution." },
  { cat:"Hypothesis Testing", concept:"Tests of Variance",
    front:"What degrees of freedom apply to an F-test comparing two variances, with samples of size n₁ and n₂?", back:"(n₁−1, n₂−1) — one for the numerator, one for the denominator." },
];

/* ============================================================
   Flashcard engine — flip, filter, shuffle, self-assessment
   ============================================================ */
(function(){
  const cardArea = document.getElementById('cardArea');
  const moduleSelect = document.getElementById('moduleSelect');
  const shuffleBtn = document.getElementById('shuffleBtn');
  const deckProgress = document.getElementById('deckProgress');
  const deckFill = document.getElementById('deckFill');

  const categories = [...new Set(FLASHCARDS.map(c => c.cat))];
  categories.forEach(cat => {
    const count = FLASHCARDS.filter(c => c.cat === cat).length;
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = `${cat} (${count} cards)`;
    moduleSelect.appendChild(opt);
  });

  function shuffleArr(arr){
    const a = [...arr];
    for (let i=a.length-1; i>0; i--){
      const j = Math.floor(Math.random()*(i+1));
      [a[i],a[j]] = [a[j],a[i]];
    }
    return a;
  }

  let deck = shuffleArr(FLASHCARDS);
  let index = 0;
  let flipped = false;
  let assessedThisCard = false;
  let reviewedCount = 0;
  const reviewedSet = new Set();

  function currentFilter(){ return moduleSelect.value; }

  function applyFilter(){
    const f = currentFilter();
    const source = f === 'all' ? FLASHCARDS : FLASHCARDS.filter(c => c.cat === f);
    deck = shuffleArr(source);
    index = 0;
    reviewedCount = 0;
    reviewedSet.clear();
    render();
  }

  function render(){
    if (deck.length === 0){
      cardArea.innerHTML = `<div class="empty-deck">No cards in this selection.</div>`;
      deckProgress.textContent = '';
      deckFill.style.width = '0%';
      return;
    }
    const card = deck[index];
    flipped = false;
    assessedThisCard = false;

    cardArea.innerHTML = `
      <div class="card-scene">
        <div class="flashcard" id="flashcardEl">
          <div class="card-face card-front">
            <div class="card-tag">${card.cat}</div>
            <div class="card-text">${card.front}</div>
            <div class="card-hint">Tap to flip</div>
          </div>
          <div class="card-face card-back">
            <div class="card-tag">${card.concept}</div>
            <div class="card-text">${card.back}</div>
            <div class="card-hint">Tap to flip back</div>
          </div>
        </div>
      </div>
      <div class="self-assess-row">
        <button class="assess-btn still-learning" id="stillLearningBtn">Still learning</button>
        <button class="assess-btn got-it" id="gotItBtn">Got it ✓</button>
      </div>
      <div class="nav-row">
        <button class="nav-btn" id="prevBtn" ${index===0 ? 'disabled' : ''}>← Previous</button>
        <span class="nav-counter">${index+1} / ${deck.length}</span>
        <button class="nav-btn" id="nextBtn" ${index===deck.length-1 ? 'disabled' : ''}>Next →</button>
      </div>
    `;

    const flashcardEl = document.getElementById('flashcardEl');
    flashcardEl.addEventListener('click', () => {
      flipped = !flipped;
      flashcardEl.classList.toggle('flipped', flipped);
      if (flipped){
        document.getElementById('stillLearningBtn').classList.add('show');
        document.getElementById('gotItBtn').classList.add('show');
      }
    });

    function assess(gotIt){
      if (assessedThisCard) return;
      assessedThisCard = true;
      if (typeof cfaRecordAnswer === 'function'){
        cfaRecordAnswer(card.concept, card.cat, gotIt);
      }
      if (!reviewedSet.has(index)){
        reviewedSet.add(index);
        reviewedCount++;
      }
      updateProgress();
      setTimeout(() => {
        if (index < deck.length - 1){ index++; render(); }
      }, 350);
    }

    document.getElementById('stillLearningBtn').addEventListener('click', (e) => { e.stopPropagation(); assess(false); });
    document.getElementById('gotItBtn').addEventListener('click', (e) => { e.stopPropagation(); assess(true); });

    document.getElementById('prevBtn').addEventListener('click', () => {
      if (index > 0){ index--; render(); }
    });
    document.getElementById('nextBtn').addEventListener('click', () => {
      if (index < deck.length - 1){ index++; render(); }
    });

    updateProgress();
  }

  function updateProgress(){
    const pct = deck.length > 0 ? Math.round((reviewedCount/deck.length)*100) : 0;
    deckProgress.textContent = `${reviewedCount} of ${deck.length} cards reviewed this session`;
    deckFill.style.width = pct + '%';
  }

  moduleSelect.addEventListener('change', applyFilter);
  shuffleBtn.addEventListener('click', () => {
    deck = shuffleArr(deck);
    index = 0;
    render();
  });

  render();
})();
