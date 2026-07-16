// ============================================================
// Final Review — 162 questions across all 9 Quant modules
// 2 questions per real concept/section, for reliable per-concept diagnosis
// ============================================================

const QUIZ = [
  // ========== MODULE 00: Numbers & Arithmetic (6 concepts x 2 = 12) ==========
  { cat:"Numbers & Arithmetic", concept:"The Four Operations",
    q:"A vendor sells 7 items at ₹35 each. How much revenue in total?",
    opts:["₹245","₹42","₹280"], correct:0,
    exp:"7 × 35 = 245 — seven groups of thirty-five, added together." },
  { cat:"Numbers & Arithmetic", concept:"The Four Operations",
    q:"56 ÷ 8 asks which question?",
    opts:["How many groups of 8 fit inside 56?","How many groups of 56 fit inside 8?","What is 56 plus 8?"], correct:0,
    exp:"Division asks how many equal groups fit — 56÷8=7, since seven groups of 8 make 56." },

  { cat:"Numbers & Arithmetic", concept:"Negative Numbers",
    q:"What is 18 − (−25)?",
    opts:["−7","43","7"], correct:1,
    exp:"Subtracting a negative flips to addition: 18−(−25) = 18+25 = 43." },
  { cat:"Numbers & Arithmetic", concept:"Negative Numbers",
    q:"What is (−9) × (−7)?",
    opts:["−63","63","−16"], correct:1,
    exp:"Multiplying two negatives gives a positive: (−9)×(−7)=63." },

  { cat:"Numbers & Arithmetic", concept:"Fractions, Decimals & Percentages",
    q:"What is 7/16 written as a decimal?",
    opts:["0.4375","0.716","0.5625"], correct:0,
    exp:"7 ÷ 16 = 0.4375." },
  { cat:"Numbers & Arithmetic", concept:"Fractions, Decimals & Percentages",
    q:"Using the '10% then adjust' method, what is 15% of 460?",
    opts:["46","69","92"], correct:1,
    exp:"10% of 460=46. Half of that (5%)=23. 15%=46+23=69." },

  { cat:"Numbers & Arithmetic", concept:"Order of Operations (BODMAS)",
    q:"Evaluate: 8 + 3 × (9 − 5)",
    opts:["44","20","15"], correct:1,
    exp:"Brackets first: (9−5)=4. Then multiplication: 3×4=12. Then addition: 8+12=20." },
  { cat:"Numbers & Arithmetic", concept:"Order of Operations (BODMAS)",
    q:"In BODMAS, do Division and Multiplication have different priority levels?",
    opts:["No, they share equal priority and go left to right","Yes, Division always comes first","Yes, Multiplication always comes first"], correct:0,
    exp:"Division and Multiplication share equal priority, resolved strictly left to right, whichever appears first." },

  { cat:"Numbers & Arithmetic", concept:"Ratios & Proportions",
    q:"Solve the proportion: 4/16 = 7/x.",
    opts:["28","1.75","20"], correct:0,
    exp:"Cross-multiply: 4x=16×7=112, so x=112/4=28." },
  { cat:"Numbers & Arithmetic", concept:"Ratios & Proportions",
    q:"If 5 machines can complete a job in 12 hours, roughly how long would 10 machines take (equal rates)?",
    opts:["24 hours","6 hours","12 hours"], correct:1,
    exp:"Doubling the machines halves the time needed for the same total work: 6 hours." },

  { cat:"Numbers & Arithmetic", concept:"Turning Words Into Math",
    q:"\"Reduced to only 75% of its original price\" is equivalent to which single operation?",
    opts:["A 75% discount","A 25% discount","A 75% increase"], correct:1,
    exp:"If 75% of the original remains, 25% was removed — a 25% discount." },
  { cat:"Numbers & Arithmetic", concept:"Turning Words Into Math",
    q:"A quantity rises from 250 to 300. What is the percentage increase?",
    opts:["50%","20%","16.7%"], correct:1,
    exp:"%increase = (change)/(original) = (300−250)/250 = 50/250 = 20%." },

  // ========== MODULE 0A: Math Foundations (6 concepts x 2 = 12) ==========
  { cat:"Math Foundations", concept:"Exponents & Roots",
    q:"Simplify: x⁶ / x²",
    opts:["x³","x⁴","x⁸"], correct:1,
    exp:"Dividing same-base exponents subtracts them: x⁶/x²=x⁴." },
  { cat:"Math Foundations", concept:"Exponents & Roots",
    q:"What is x⁻² equal to?",
    opts:["−x²","1/x²","2/x"], correct:1,
    exp:"A negative exponent means reciprocal: x⁻²=1/x²." },

  { cat:"Math Foundations", concept:"Logarithms",
    q:"What is ln(e³)?",
    opts:["3","e³","1"], correct:0,
    exp:"ln and e are inverses: ln(e³)=3." },
  { cat:"Math Foundations", concept:"Logarithms",
    q:"Using log rules, ln(a×b) simplifies to:",
    opts:["ln(a)+ln(b)","ln(a)−ln(b)","ln(a)×ln(b)"], correct:0,
    exp:"Multiplying inside a log becomes addition outside: ln(ab)=ln(a)+ln(b)." },

  { cat:"Math Foundations", concept:"Summation Notation",
    q:"What does Σᵢ₌₁⁴ 2i expand to and equal?",
    opts:["2+4+6+8 = 20","2×4×6×8 = 384","2+4=6"], correct:0,
    exp:"Σ from i=1 to 4 of 2i = 2(1)+2(2)+2(3)+2(4) = 2+4+6+8 = 20." },
  { cat:"Math Foundations", concept:"Summation Notation",
    q:"Which property lets you split Σ(Xᵢ+Yᵢ)?",
    opts:["Σ(Xᵢ+Yᵢ) = ΣXᵢ + ΣYᵢ","Σ(Xᵢ+Yᵢ) = ΣXᵢ × ΣYᵢ","Sums cannot be split"], correct:0,
    exp:"A summation of a sum splits into the sum of two separate summations." },

  { cat:"Math Foundations", concept:"Rearranging Equations",
    q:"Solve for x: 7x + 9 = 44.",
    opts:["x=5","x=7.57","x=35"], correct:0,
    exp:"Subtract 9: 7x=35. Divide by 7: x=5." },
  { cat:"Math Foundations", concept:"Rearranging Equations",
    q:"Solve for r: FV = PV(1+r).",
    opts:["r = FV/PV","r = FV/PV − 1","r = FV − PV"], correct:1,
    exp:"Divide both sides by PV: FV/PV=1+r. Subtract 1: r=FV/PV−1." },

  { cat:"Math Foundations", concept:"Sets & Set Notation",
    q:"A={2,4,6,8} and B={4,8,10}. What is A∩B?",
    opts:["{4,8}","{2,4,6,8,10}","∅"], correct:0,
    exp:"The intersection is only elements in both sets: 4 and 8." },
  { cat:"Math Foundations", concept:"Sets & Set Notation",
    q:"If A∩B=∅, the two events are:",
    opts:["Independent","Mutually exclusive","Exhaustive"], correct:1,
    exp:"An empty intersection means no shared outcomes — mutually exclusive." },

  { cat:"Math Foundations", concept:"Functions & the Cartesian Plane",
    q:"In y=mx+b, what does m represent?",
    opts:["The y-intercept","The slope","The x-intercept"], correct:1,
    exp:"m is the slope — how much y changes per unit change in x." },
  { cat:"Math Foundations", concept:"Functions & the Cartesian Plane",
    q:"A line has equation y=−3x+7. As x increases by 1, y:",
    opts:["Increases by 3","Decreases by 3","Stays the same"], correct:1,
    exp:"The slope is −3, so y falls by 3 for every 1-unit increase in x." },

  // ========== MODULE 01: Interest Rates, PV & FV (10 concepts x 2 = 20) ==========
  { cat:"Interest Rates, PV & FV", concept:"Interest Rates",
    q:"An interest rate's compensation for expected inflation plus the real risk-free rate together define the:",
    opts:["Nominal risk-free rate","Liquidity premium","Default risk premium"], correct:0,
    exp:"The nominal risk-free rate = real risk-free rate + expected inflation premium." },
  { cat:"Interest Rates, PV & FV", concept:"Interest Rates",
    q:"A bond that's hard to sell quickly without a price concession carries an extra yield component called the:",
    opts:["Maturity premium","Liquidity premium","Default risk premium"], correct:1,
    exp:"Illiquidity is compensated via a liquidity premium." },

  { cat:"Interest Rates, PV & FV", concept:"Future Value of a Lump Sum",
    q:"$5,000 is invested for 6 years at 5% compounded annually. What is the future value (nearest dollar)?",
    opts:["$6,700","$6,500","$7,000"], correct:0,
    exp:"FV = 5000×(1.05)^6 ≈ $6,700." },
  { cat:"Interest Rates, PV & FV", concept:"Future Value of a Lump Sum",
    q:"Holding the rate fixed, how does FV change as N (number of periods) increases?",
    opts:["FV falls","FV rises","FV is unaffected"], correct:1,
    exp:"More compounding periods at a positive rate always increases future value." },

  { cat:"Interest Rates, PV & FV", concept:"Compounding Frequency & EAR",
    q:"An 8% stated annual rate is compounded quarterly. What is the effective annual rate (nearest 0.01%)?",
    opts:["8.00%","8.24%","8.30%"], correct:1,
    exp:"EAR = (1+0.08/4)^4 − 1 ≈ 8.24%." },
  { cat:"Interest Rates, PV & FV", concept:"Compounding Frequency & EAR",
    q:"Holding the stated annual rate fixed, more frequent compounding always:",
    opts:["Decreases the EAR","Increases (or leaves unchanged) the EAR","Has no predictable effect"], correct:1,
    exp:"More frequent compounding raises or leaves unchanged the effective annual rate, never decreases it." },

  { cat:"Interest Rates, PV & FV", concept:"Future Value of an Annuity",
    q:"An ordinary annuity pays $800 yearly for 10 years at 6%. What is the future value annuity factor (nearest 0.1)?",
    opts:["13.2","10.0","7.4"], correct:0,
    exp:"FV factor = [(1.06)^10 − 1]/0.06 ≈ 13.2." },
  { cat:"Interest Rates, PV & FV", concept:"Future Value of an Annuity",
    q:"An annuity DUE's future value, compared to an otherwise identical ordinary annuity, is:",
    opts:["Lower","Higher, by a factor of (1+r)","Identical"], correct:1,
    exp:"Annuity due payments occur one period earlier, so each compounds for one extra period: FV(due)=FV(ordinary)×(1+r)." },

  { cat:"Interest Rates, PV & FV", concept:"Present Value of a Lump Sum",
    q:"$30,000 is due in 5 years. At a 7% discount rate, what is its present value (nearest $100)?",
    opts:["$21,400","$25,000","$19,000"], correct:0,
    exp:"PV = 30,000/(1.07)^5 ≈ $21,390." },
  { cat:"Interest Rates, PV & FV", concept:"Present Value of a Lump Sum",
    q:"Holding the discount rate constant, as a payment is pushed further into the future, its present value:",
    opts:["Rises","Falls","Stays the same"], correct:1,
    exp:"A more distant payment gets discounted more heavily, so its PV falls." },

  { cat:"Interest Rates, PV & FV", concept:"Present Value of an Annuity",
    q:"An ordinary annuity of $1,000/year for 5 years is discounted at 8%. What is the PV annuity factor (nearest 0.01)?",
    opts:["3.99","4.50","5.87"], correct:0,
    exp:"PV factor = [1−(1.08)⁻⁵]/0.08 ≈ 3.99." },
  { cat:"Interest Rates, PV & FV", concept:"Present Value of an Annuity",
    q:"A deferred annuity's first payment occurs at t=8, not t=1. What is the correct first step to value it today?",
    opts:["Value it as an ordinary annuity as of t=7, then discount that value back to t=0", "Discount each payment individually using its own maturity, ignoring the annuity formula entirely", "Treat it exactly like an ordinary annuity starting at t=1"], correct:0,
    exp:"Value the annuity as of one period before its first payment (t=7), then discount that lump sum back to today." },

  { cat:"Interest Rates, PV & FV", concept:"Perpetuities",
    q:"A perpetuity pays $40 per year forever, starting one year from now, at a 5% discount rate. What is its present value?",
    opts:["$800","$200","$400"], correct:0,
    exp:"PV = 40/0.05 = $800." },
  { cat:"Interest Rates, PV & FV", concept:"Perpetuities",
    q:"A perpetuity's first payment occurs at t=4 instead of t=1. What must you do differently to value it?",
    opts:["Nothing — perpetuities cannot be deferred","Value it as a normal perpetuity as of t=3, then discount that value back to t=0", "Simply multiply the standard perpetuity formula by 4"], correct:1,
    exp:"A deferred perpetuity is valued at t=3 (one period before the first payment), then that value is discounted back to today." },

  { cat:"Interest Rates, PV & FV", concept:"Rates, Growth & Number of Periods",
    q:"A company's revenue grew from $180M to $310M over 6 years. What is the approximate compound annual growth rate?",
    opts:["9.5%","12%","18%"], correct:0,
    exp:"CAGR = (310/180)^(1/6) − 1 ≈ 9.5%." },
  { cat:"Interest Rates, PV & FV", concept:"Rates, Growth & Number of Periods",
    q:"Using the Rule of 72, approximately how many years to double an investment at 8% annual growth?",
    opts:["6 years","9 years","12 years"], correct:1,
    exp:"Rule of 72: 72/8 = 9 years." },

  { cat:"Interest Rates, PV & FV", concept:"Size of Annuity Payments",
    q:"A $15,000 loan is repaid with equal annual payments over 4 years at 6% (PV annuity factor ≈ 3.4651). What is the annual payment (nearest $10)?",
    opts:["$4,330","$3,750","$5,200"], correct:0,
    exp:"Payment = 15,000/3.4651 ≈ $4,330." },
  { cat:"Interest Rates, PV & FV", concept:"Size of Annuity Payments",
    q:"To solve for the periodic payment on a loan, which formula do you rearrange?",
    opts:["The future value of a lump sum formula", "The present value of an annuity formula, solving for the payment", "The perpetuity formula"], correct:1,
    exp:"Loan payments are solved by rearranging the present value of an annuity formula, since PV=loan amount is known and payment is unknown." },

  { cat:"Interest Rates, PV & FV", concept:"Equivalence & Additivity",
    q:"The cash flow additivity principle states cash flows can be combined directly only when they:",
    opts:["Are indexed to the same point in time","Come from the same company","Are both positive"], correct:0,
    exp:"Cash flows can only be added or subtracted directly once they're all valued at the same point in time." },
  { cat:"Interest Rates, PV & FV", concept:"Equivalence & Additivity",
    q:"Series A pays $100 at t=1 and t=2; Series B pays $200 at t=1 and t=2. At 5% interest, what is the future value of the combined series at t=2?",
    opts:["$615.00","$600.00","$630.75"], correct:0,
    exp:"Combined payment is $300 at each date. FV = 300×(1.05)¹ + 300×(1.05)⁰ = 315 + 300 = $615.00." },

  // ========== MODULE 02: Organizing & Visualizing Data (10 concepts x 2 = 20) ==========
  { cat:"Organizing & Visualizing Data", concept:"Data Types",
    q:"Credit ratings (AAA, AA, A, BBB, ...) are an example of which data type?",
    opts:["Nominal","Ordinal","Continuous"], correct:1,
    exp:"Credit ratings have a meaningful order but the gaps between categories aren't numerically equal — ordinal data." },
  { cat:"Organizing & Visualizing Data", concept:"Data Types",
    q:"A dataset tracking the same 50 companies' revenue every year for 10 years is:",
    opts:["Cross-sectional data","Panel data","Time-series data only, with no cross-sectional element"], correct:1,
    exp:"Data combining multiple entities observed over multiple time periods is panel data." },

  { cat:"Organizing & Visualizing Data", concept:"Organizing Data",
    q:"Raw, unprocessed data collected directly from its source, before any cleaning, is called:",
    opts:["A frequency distribution","Raw data","A contingency table"], correct:1,
    exp:"Raw data is the term for unprocessed data exactly as collected." },
  { cat:"Organizing & Visualizing Data", concept:"Organizing Data",
    q:"Arranging data into rows and columns, with each row an observation and each column a variable, produces:",
    opts:["A one-dimensional array only","A structured (tabular) dataset","An unstructured dataset"], correct:1,
    exp:"This row/column arrangement is the standard structured (tabular) data format." },

  { cat:"Organizing & Visualizing Data", concept:"Frequency Distributions",
    q:"A dataset has minimum −12 and maximum 36. Using 6 bins, what is the bin width?",
    opts:["8","6","48"], correct:0,
    exp:"Bin width = (max−min)/number of bins = (36−(−12))/6 = 48/6 = 8." },
  { cat:"Organizing & Visualizing Data", concept:"Frequency Distributions",
    q:"In a frequency distribution table, the cumulative relative frequency of the final bin must equal:",
    opts:["0","1 (100%)","The bin width"], correct:1,
    exp:"By the last bin, all observations are accounted for, so cumulative relative frequency reaches exactly 1." },

  { cat:"Organizing & Visualizing Data", concept:"Contingency Tables",
    q:"In a contingency table, the totals in the rightmost column and bottom row are called:",
    opts:["Marginal frequencies","Joint frequencies","Conditional frequencies"], correct:0,
    exp:"Row and column totals in a contingency table are marginal frequencies." },
  { cat:"Organizing & Visualizing Data", concept:"Contingency Tables",
    q:"Dividing each cell in a contingency table by its row's total answers which question?",
    opts:["What share of the grand total does this cell represent?", "Within this row, what proportion falls into each column category?", "What is the column's marginal frequency?"], correct:1,
    exp:"Row-percentage tables show, within each row, how observations split across the columns." },

  { cat:"Organizing & Visualizing Data", concept:"Histograms & Frequency Polygons",
    q:"On a histogram, the tallest bar represents:",
    opts:["The bin with the highest frequency","The bin with the widest range","The mean of the dataset"], correct:0,
    exp:"Bar height in a histogram directly represents frequency — the tallest bar is the most frequent bin." },
  { cat:"Organizing & Visualizing Data", concept:"Histograms & Frequency Polygons",
    q:"A frequency polygon is constructed by:",
    opts:["Connecting the midpoints of each histogram bar with straight lines", "Drawing a smooth curve through the raw data points", "Stacking bars on top of each other"], correct:0,
    exp:"A frequency polygon connects the midpoint of each bin's top with straight lines." },

  { cat:"Organizing & Visualizing Data", concept:"Line & Bubble Line Charts",
    q:"A chart plotting a company's quarterly revenue over time, with bubble size representing that quarter's profit margin, is a:",
    opts:["Bubble line chart","Scatter plot matrix","Heat map"], correct:0,
    exp:"A line chart with a third dimension shown via bubble size is a bubble line chart." },
  { cat:"Organizing & Visualizing Data", concept:"Line & Bubble Line Charts",
    q:"For comparing the trend of two products' sales over the same 12 months, the best chart type is a:",
    opts:["Line chart","Tree-map","Heat map"], correct:0,
    exp:"Line charts are ideal for showing trends over time, especially comparing multiple series." },

  { cat:"Organizing & Visualizing Data", concept:"Scatter Plots & Matrices",
    q:"A scatter plot shows points tightly clustered around an upward-sloping line. This suggests:",
    opts:["A strong positive relationship between the two variables", "No relationship at all", "A strong negative relationship"], correct:0,
    exp:"Points tightly following an upward line indicate a strong positive association." },
  { cat:"Organizing & Visualizing Data", concept:"Scatter Plots & Matrices",
    q:"To inspect pairwise relationships among five candidate variables at once, the most efficient chart is a:",
    opts:["Single scatter plot","Scatter plot matrix","Bar chart"], correct:1,
    exp:"A scatter plot matrix shows every pairwise combination of variables in a grid of small scatter plots." },

  { cat:"Organizing & Visualizing Data", concept:"Bar Charts",
    q:"A stacked bar chart, compared to a grouped (clustered) bar chart, makes it easier to see:",
    opts:["Each category's exact sub-component values", "Each bar's total (marginal) value, while still showing sub-components", "Nothing — they show identical information"], correct:1,
    exp:"Stacked bars show the total height at a glance while still breaking down each bar into sub-components." },
  { cat:"Organizing & Visualizing Data", concept:"Bar Charts",
    q:"A vertical bar chart's y-axis starts at 50 instead of 0, exaggerating visual differences. This is an example of:",
    opts:["A truncated (misleading) axis","A properly scaled chart","A logarithmic scale"], correct:0,
    exp:"Starting an axis above zero visually exaggerates differences — a common misleading chart technique." },

  { cat:"Organizing & Visualizing Data", concept:"Tree-Maps & Word Clouds",
    q:"Which visualization uses rectangle area, not height or length, to represent magnitude?",
    opts:["Tree-map","Line chart","Scatter plot"], correct:0,
    exp:"A tree-map represents magnitude through the area of nested rectangles." },
  { cat:"Organizing & Visualizing Data", concept:"Tree-Maps & Word Clouds",
    q:"A word cloud is best suited to visualizing:",
    opts:["Precise numerical time-series data","The relative frequency of terms in unstructured text","Exact regression coefficients"], correct:1,
    exp:"Word clouds size words by frequency, making them useful for exploring unstructured text like earnings call transcripts." },

  { cat:"Organizing & Visualizing Data", concept:"Heat Maps & Choosing Charts",
    q:"A heat map is commonly used to visualize:",
    opts:["A correlation matrix, with color intensity showing strength", "A single company's stock price over time", "A pie chart's proportions"], correct:0,
    exp:"Heat maps use color intensity to represent magnitude across a grid, often for correlation matrices." },
  { cat:"Organizing & Visualizing Data", concept:"Heat Maps & Choosing Charts",
    q:"When exploring whether two continuous numerical variables are related, the best chart choice is generally a:",
    opts:["Scatter plot","Bar chart","Tree-map"], correct:0,
    exp:"Scatter plots are purpose-built for examining the relationship between two numerical variables." },

  // ========== MODULE 03: Summarizing Data (6 concepts x 2 = 12) ==========
  { cat:"Summarizing Data", concept:"Mean, Median, Mode",
    q:"For the dataset 4, 8, 8, 11, 11, 11, 15, what is the mode?",
    opts:["8","11","9.71"], correct:1,
    exp:"11 appears three times, more than any other value — the mode is 11." },
  { cat:"Summarizing Data", concept:"Mean, Median, Mode",
    q:"For any dataset, the sum of deviations of each observation from the arithmetic mean equals:",
    opts:["The variance","Zero, always","The standard deviation"], correct:1,
    exp:"By the mean's defining property, deviations above and below it always sum to exactly zero." },

  { cat:"Summarizing Data", concept:"Outliers, Trimmed & Winsorized Means",
    q:"Given the dataset 2, 3, 4, 5, 6, 500, which measure of central tendency is LEAST affected by the outlier?",
    opts:["The arithmetic mean","The median","Both are equally affected"], correct:1,
    exp:"The median, based on position rather than magnitude, is far less sensitive to extreme outliers than the mean." },
  { cat:"Summarizing Data", concept:"Outliers, Trimmed & Winsorized Means",
    q:"A winsorized mean handles extreme values by:",
    opts:["Deleting them entirely from the dataset", "Replacing them with a specified percentile value, rather than removing them", "Doubling their weight in the calculation"], correct:1,
    exp:"Winsorizing replaces extreme values with a cutoff percentile value instead of discarding them." },

  { cat:"Summarizing Data", concept:"Weighted, Geometric & Harmonic Mean",
    q:"A portfolio is 30% stocks (return 8%), 50% bonds (return 12%), 20% cash (return 3%). What is the weighted mean return?",
    opts:["9.0%","7.7%","9.5%"], correct:0,
    exp:"Weighted mean = 0.3(8)+0.5(12)+0.2(3) = 2.4+6.0+0.6 = 9.0%." },
  { cat:"Summarizing Data", concept:"Weighted, Geometric & Harmonic Mean",
    q:"A stock returns 20% in Year 1 and −10% in Year 2. What is the geometric mean return (approximately)?",
    opts:["3.9%","5.0%","4.5%"], correct:0,
    exp:"Geometric mean = [(1.20)(0.90)]^0.5 − 1 ≈ 3.9%." },

  { cat:"Summarizing Data", concept:"Quantiles",
    q:"In a sorted sample of 39 observations, what is the position of the median (L50)?",
    opts:["Position 19.5","Position 20","Position 20.5"], correct:1,
    exp:"L50 = (n+1)×0.50 = 40×0.5 = position 20." },
  { cat:"Summarizing Data", concept:"Quantiles",
    q:"The interquartile range (IQR) is calculated as:",
    opts:["Q3 − Q1","Q3 + Q1","(Q3+Q1)/2"], correct:0,
    exp:"IQR = third quartile minus first quartile, capturing the middle 50% of the data's spread." },

  { cat:"Summarizing Data", concept:"Measures of Dispersion",
    q:"Why does the sample variance formula divide by (n−1) instead of n?",
    opts:["To correct for a downward bias when estimating population variance from a sample", "It's an arbitrary convention with no statistical reason", "To make the formula easier to compute by hand"], correct:0,
    exp:"Dividing by (n−1) corrects for the fact that using the sample mean (rather than the true population mean) understates variability, providing an unbiased estimator." },
  { cat:"Summarizing Data", concept:"Measures of Dispersion",
    q:"Which measure of dispersion uses absolute values of deviations, rather than squaring them?",
    opts:["Variance","Standard deviation","Mean absolute deviation (MAD)"], correct:2,
    exp:"MAD averages the absolute value of each deviation from the mean, without squaring." },

  { cat:"Summarizing Data", concept:"Downside Deviation & CV",
    q:"Fund A: mean return 5%, std dev 8%. Fund B: mean return 12%, std dev 15%. Which has a higher coefficient of variation (more risk per unit of return)?",
    opts:["Fund A (CV=1.6)","Fund B (CV=1.25)","Both are identical"], correct:0,
    exp:"CV = std dev/mean. Fund A: 8/5=1.6. Fund B: 15/12=1.25. Fund A has the higher CV." },
  { cat:"Summarizing Data", concept:"Downside Deviation & CV",
    q:"Raising the target return used in a downside (target) semideviation calculation, holding the data fixed, will typically:",
    opts:["Decrease the measured downside risk","Increase the measured downside risk, since more observations fall below the higher target","Have no effect at all"], correct:1,
    exp:"A higher target return means more observations fall short of it, generally increasing measured downside deviation." },

  // ========== MODULE 04: Probability Concepts (12 concepts x 2 = 24) ==========
  { cat:"Probability Concepts", concept:"Random Variables & Events",
    q:"Rolling a fair die and \"observing an even number\" is best described as:",
    opts:["A random variable","An event","A conditional probability"], correct:1,
    exp:"An event is a specified outcome or set of outcomes — here, rolling an even number." },
  { cat:"Probability Concepts", concept:"Random Variables & Events",
    q:"A random variable that can take on a countable set of distinct values (like the number of defaults in a bond portfolio) is:",
    opts:["Discrete","Continuous","Deterministic"], correct:0,
    exp:"A variable with countable, distinct possible values is a discrete random variable." },

  { cat:"Probability Concepts", concept:"Rules of Probability",
    q:"Which pair of conditions together define a valid probability?",
    opts:["0 ≤ P(E) ≤ 1, and probabilities of all possible outcomes sum to 1", "P(E) can be any real number", "P(E) must always equal 0.5"], correct:0,
    exp:"Valid probabilities are bounded between 0 and 1, and the full set of possible outcomes must sum to 1." },
  { cat:"Probability Concepts", concept:"Rules of Probability",
    q:"If events A and B are mutually exclusive, what must P(A and B) equal?",
    opts:["0","1","P(A) × P(B)"], correct:0,
    exp:"Mutually exclusive events can never occur together, so their joint probability is exactly 0." },

  { cat:"Probability Concepts", concept:"Three Ways to Estimate P",
    q:"Assigning P(heads)=0.5 for a coin based purely on logical symmetry, without any data, is an example of:",
    opts:["A priori probability","Empirical probability","Subjective probability"], correct:0,
    exp:"Reasoning from logical structure alone (not data or personal judgment) is a priori probability." },
  { cat:"Probability Concepts", concept:"Three Ways to Estimate P",
    q:"An analyst says \"I believe there's a 70% chance this merger closes,\" based on personal judgment rather than a formal model. This is:",
    opts:["A priori probability","Empirical probability","Subjective probability"], correct:2,
    exp:"A probability estimate based on personal judgment or experience, without formal data or symmetry, is subjective probability." },

  { cat:"Probability Concepts", concept:"Odds",
    q:"If P(E) = 0.30, what are the odds for E?",
    opts:["0.30 to 0.70","3 to 7 (0.30/0.70)","7 to 3"], correct:1,
    exp:"Odds for E = P(E)/[1−P(E)] = 0.30/0.70 = 3 to 7." },
  { cat:"Probability Concepts", concept:"Odds",
    q:"The odds against an event are quoted as \"5 to 2.\" What is the implied probability of the event occurring?",
    opts:["5/7","2/7","2/5"], correct:1,
    exp:"Odds against a:b implies P(event) = b/(a+b) = 2/(5+2) = 2/7." },

  { cat:"Probability Concepts", concept:"Conditional Probability",
    q:"If P(A) = 0.4 and P(A|B) = 0.4 as well, what does this indicate?",
    opts:["A and B are mutually exclusive","A and B are independent","A and B are identical events"], correct:1,
    exp:"When conditioning on B doesn't change A's probability, A and B are independent." },
  { cat:"Probability Concepts", concept:"Conditional Probability",
    q:"P(AB) = 0.12 and P(B) = 0.40. What is P(A|B)?",
    opts:["0.30","0.048","0.52"], correct:0,
    exp:"P(A|B) = P(AB)/P(B) = 0.12/0.40 = 0.30." },

  { cat:"Probability Concepts", concept:"Joint Probability",
    q:"P(A|B) = 0.25 and P(B) = 0.60. What is the joint probability P(AB)?",
    opts:["0.15","0.42","0.85"], correct:0,
    exp:"P(AB) = P(A|B) × P(B) = 0.25 × 0.60 = 0.15." },
  { cat:"Probability Concepts", concept:"Joint Probability",
    q:"The multiplication rule for joint probability, P(AB) = P(A|B)×P(B), reduces to P(AB)=P(A)×P(B) exactly when:",
    opts:["A and B are mutually exclusive","A and B are independent","P(A) equals P(B)"], correct:1,
    exp:"For independent events, P(A|B)=P(A), so the multiplication rule simplifies to the product of the unconditional probabilities." },

  { cat:"Probability Concepts", concept:"Addition Rule",
    q:"P(A)=0.5, P(B)=0.3, P(AB)=0.1. What is P(A or B)?",
    opts:["0.7","0.8","0.9"], correct:0,
    exp:"P(A or B) = P(A)+P(B)−P(AB) = 0.5+0.3−0.1 = 0.7." },
  { cat:"Probability Concepts", concept:"Addition Rule",
    q:"For two mutually exclusive events, the addition rule P(A or B) simplifies to:",
    opts:["P(A) + P(B)","P(A) × P(B)","P(A) − P(B)"], correct:0,
    exp:"Since P(AB)=0 for mutually exclusive events, the addition rule drops the subtraction term entirely." },

  { cat:"Probability Concepts", concept:"Independent vs Dependent",
    q:"P(A)=0.6, P(B)=0.5, and A and B are independent. What is P(A and B)?",
    opts:["0.30","1.10","0.10"], correct:0,
    exp:"For independent events, P(AB)=P(A)×P(B)=0.6×0.5=0.30." },
  { cat:"Probability Concepts", concept:"Independent vs Dependent",
    q:"Drawing two cards from a deck WITHOUT replacing the first — are the two draws independent?",
    opts:["Yes, always independent","No — the first draw changes the composition of the deck for the second","Only if both cards are the same suit"], correct:1,
    exp:"Without replacement, removing the first card changes the probabilities for the second draw — the draws are dependent." },

  { cat:"Probability Concepts", concept:"Total Probability Rule",
    q:"40% of loans are 'high risk' (default rate 12%) and 60% are 'low risk' (default rate 2%). Using the total probability rule, what's the overall default rate?",
    opts:["5.2%","7.0%","6.0%"], correct:0,
    exp:"Overall rate = 0.4(0.12) + 0.6(0.02) = 0.048+0.012 = 0.052 = 5.2%." },
  { cat:"Probability Concepts", concept:"Total Probability Rule",
    q:"The total probability rule requires the conditioning scenarios to be:",
    opts:["Mutually exclusive and exhaustive","Independent of each other","Equal in probability"], correct:0,
    exp:"The scenarios must be mutually exclusive and exhaustive, covering every possibility exactly once." },

  { cat:"Probability Concepts", concept:"Multiplication & Factorial",
    q:"A restaurant offers 4 appetizers, 6 mains, and 3 desserts. Using the multiplication rule, how many distinct 3-course meals are possible?",
    opts:["72","13","24"], correct:0,
    exp:"4 × 6 × 3 = 72 distinct combinations." },
  { cat:"Probability Concepts", concept:"Multiplication & Factorial",
    q:"You must assign 6 distinct tasks to 6 different people, one task each. In how many ways can this be done?",
    opts:["720","36","6"], correct:0,
    exp:"6! = 720 distinct assignments." },

  { cat:"Probability Concepts", concept:"Labeling & Combinations",
    q:"How many different 4-person subcommittees (no distinct roles) can be chosen from 9 board members?",
    opts:["126","3,024","36"], correct:0,
    exp:"C(9,4) = 9!/(4!×5!) = 126." },
  { cat:"Probability Concepts", concept:"Labeling & Combinations",
    q:"Combinations differ from permutations in that combinations:",
    opts:["Count arrangements where order matters", "Count selections where order does NOT matter", "Can never be calculated using factorials"], correct:1,
    exp:"Combinations count the number of ways to select items when the order of selection doesn't matter." },

  { cat:"Probability Concepts", concept:"Permutations",
    q:"7 runners compete for Gold, Silver, and Bronze (order matters). How many different podium results are possible?",
    opts:["210","35","343"], correct:0,
    exp:"P(7,3) = 7!/(7−3)! = 7×6×5 = 210." },
  { cat:"Probability Concepts", concept:"Permutations",
    q:"The formula for permutations of n items taken r at a time is:",
    opts:["n!/(n−r)!","n!/[r!(n−r)!]","n!/r!"], correct:0,
    exp:"nPr = n!/(n−r)! — the combinations formula additionally divides by r! since order doesn't matter there." },

  // ========== MODULE 05: Common Probability Distributions (10 concepts x 2 = 20) ==========
  { cat:"Common Probability Distributions", concept:"Random Variables & Distributions",
    q:"The number of trades executed by a desk in a day is an example of a:",
    opts:["Discrete random variable","Continuous random variable","Deterministic value"], correct:0,
    exp:"A countable value like the number of trades is a discrete random variable." },
  { cat:"Common Probability Distributions", concept:"Random Variables & Distributions",
    q:"For a continuous random variable, the probability it takes on any single exact value is:",
    opts:["Always 1","Always 0","Equal to its probability density at that point"], correct:1,
    exp:"For continuous distributions, probability is only meaningful over a range — the probability of any exact single point is 0." },

  { cat:"Common Probability Distributions", concept:"Discrete Uniform",
    q:"A discrete uniform random variable has outcomes 1 through 10, equally likely. What is F(6)?",
    opts:["0.6","0.1","1.0"], correct:0,
    exp:"F(6) = P(X≤6) = 6/10 = 0.6 for a discrete uniform distribution." },
  { cat:"Common Probability Distributions", concept:"Discrete Uniform",
    q:"For a discrete uniform distribution over n equally likely outcomes, each outcome has probability:",
    opts:["1/n","n","1/n²"], correct:0,
    exp:"Each of the n equally likely outcomes has probability 1/n." },

  { cat:"Common Probability Distributions", concept:"Continuous Uniform",
    q:"X is continuous uniform between a=15 and b=45. What is the mean?",
    opts:["30","22.5","15"], correct:0,
    exp:"Mean of continuous uniform = (a+b)/2 = (15+45)/2 = 30." },
  { cat:"Common Probability Distributions", concept:"Continuous Uniform",
    q:"X is continuous uniform between 0 and 20. What is P(5 ≤ X ≤ 12)?",
    opts:["0.35","0.60","0.12"], correct:0,
    exp:"P = (12−5)/(20−0) = 7/20 = 0.35." },

  { cat:"Common Probability Distributions", concept:"The Binomial Distribution",
    q:"Which of these is a core assumption behind the binomial distribution?",
    opts:["The probability of success changes with each trial", "Each trial is independent, with a constant probability of success", "Outcomes must be continuous"], correct:1,
    exp:"The binomial model requires independent trials, each with the same (constant) probability of success." },
  { cat:"Common Probability Distributions", concept:"The Binomial Distribution",
    q:"A binomial distribution with p exactly 0.5 is:",
    opts:["Symmetric","Always right-skewed","Always left-skewed"], correct:0,
    exp:"When p=0.5, the binomial distribution is perfectly symmetric." },

  { cat:"Common Probability Distributions", concept:"Mean, Variance & Applications",
    q:"A binomial random variable has n=30, p=0.25. What is its mean?",
    opts:["7.5","5.625","30"], correct:0,
    exp:"Binomial mean = n×p = 30×0.25 = 7.5." },
  { cat:"Common Probability Distributions", concept:"Mean, Variance & Applications",
    q:"A binomial random variable has n=30, p=0.25. What is its variance?",
    opts:["5.625","7.5","2.37"], correct:0,
    exp:"Binomial variance = n×p×(1−p) = 30×0.25×0.75 = 5.625." },

  { cat:"Common Probability Distributions", concept:"Properties of the Normal",
    q:"Which statement about the normal distribution is TRUE?",
    opts:["It is fully described by its mean and variance alone", "It is always positively skewed", "It has no defined mean"], correct:0,
    exp:"The normal distribution is completely characterized by just two parameters: its mean and variance." },
  { cat:"Common Probability Distributions", concept:"Properties of the Normal",
    q:"A portfolio return is a weighted average of returns on several jointly normally distributed assets. The portfolio return distribution is:",
    opts:["Also normal","Uniform","Undefined without more information"], correct:0,
    exp:"A linear combination of jointly normal random variables is itself normally distributed." },

  { cat:"Common Probability Distributions", concept:"The Empirical Rule",
    q:"Approximately what percentage of a normal distribution falls within ±1 standard deviation of the mean?",
    opts:["68%","95%","99.7%"], correct:0,
    exp:"The empirical rule: about 68% falls within ±1 SD, 95% within ±2 SD, 99.7% within ±3 SD." },
  { cat:"Common Probability Distributions", concept:"The Empirical Rule",
    q:"According to the empirical rule, approximately what percentage falls within ±3 standard deviations?",
    opts:["99.7%","95%","90%"], correct:0,
    exp:"Nearly the entire distribution (99.7%) falls within ±3 standard deviations for a normal distribution." },

  { cat:"Common Probability Distributions", concept:"Standardizing & Z-Scores",
    q:"X ~ N(100, 15²). What is the Z-score for X=88?",
    opts:["−0.80","0.80","−1.13"], correct:0,
    exp:"Z = (X−μ)/σ = (88−100)/15 = −0.80." },
  { cat:"Common Probability Distributions", concept:"Standardizing & Z-Scores",
    q:"If P(Z ≤ 1.28) ≈ 0.90, what is P(Z > 1.28)?",
    opts:["0.10","0.90","0.28"], correct:0,
    exp:"P(Z>1.28) = 1 − P(Z≤1.28) = 1 − 0.90 = 0.10." },

  { cat:"Common Probability Distributions", concept:"Student's t-Distribution",
    q:"Compared to the standard normal distribution, the t-distribution has:",
    opts:["Fatter tails, reflecting extra uncertainty from estimating σ", "Identical tails", "Thinner tails"], correct:0,
    exp:"The t-distribution has fatter tails than the normal, reflecting the added uncertainty of using the sample standard deviation." },
  { cat:"Common Probability Distributions", concept:"Student's t-Distribution",
    q:"As the degrees of freedom of a t-distribution grow very large, its shape:",
    opts:["Converges toward the standard normal distribution", "Becomes more skewed", "Becomes uniform"], correct:0,
    exp:"As df→∞, the t-distribution converges to the standard normal distribution." },

  { cat:"Common Probability Distributions", concept:"Chi-Square & F-Distributions",
    q:"The chi-square distribution is built from the sum of squared independent:",
    opts:["Standard normal random variables","Binomial random variables","Uniform random variables"], correct:0,
    exp:"A chi-square distributed variable is the sum of squares of independent standard normal variables." },
  { cat:"Common Probability Distributions", concept:"Chi-Square & F-Distributions",
    q:"The F-distribution requires how many degrees-of-freedom parameters?",
    opts:["Two — one for the numerator, one for the denominator", "One", "None — it's parameter-free"], correct:0,
    exp:"The F-distribution needs two df parameters, since it's the ratio of two chi-square distributed variables." },

  // ========== MODULE 06: Sampling & Estimation (9 concepts x 2 = 18) ==========
  { cat:"Sampling & Estimation", concept:"Point Estimates",
    q:"A single calculated value, like a sample mean, used as a best guess for an unknown population parameter, is called a:",
    opts:["Point estimate","Confidence interval","Hypothesis"], correct:0,
    exp:"A single-value estimate of a population parameter is a point estimate." },
  { cat:"Sampling & Estimation", concept:"Point Estimates",
    q:"The formula \"sum the observations and divide by the count\" is the point estimate formula for:",
    opts:["The sample mean","The sample variance","The sample median"], correct:0,
    exp:"This is the standard formula for the sample mean, a point estimator of the population mean." },

  { cat:"Sampling & Estimation", concept:"Properties of a Good Estimator",
    q:"An estimator whose expected value equals the population parameter at every sample size is called:",
    opts:["Unbiased","Efficient","Consistent"], correct:0,
    exp:"An unbiased estimator's sampling distribution is centered exactly on the true parameter." },
  { cat:"Sampling & Estimation", concept:"Properties of a Good Estimator",
    q:"As sample size grows toward infinity, a consistent estimator's sampling distribution:",
    opts:["Concentrates increasingly tightly around the true parameter", "Spreads out further", "Becomes biased"], correct:0,
    exp:"Consistency means the estimator converges toward the true parameter value as sample size grows." },

  { cat:"Sampling & Estimation", concept:"Structure & Interpretation",
    q:"The general structure of a confidence interval is:",
    opts:["Point estimate ± (reliability factor × standard error)", "Point estimate × confidence level", "Standard error ÷ sample size"], correct:0,
    exp:"Every confidence interval follows this structure: a point estimate, plus or minus a reliability factor times the standard error." },
  { cat:"Sampling & Estimation", concept:"Structure & Interpretation",
    q:"Holding sample size and standard deviation constant, raising the confidence level from 90% to 99% makes the confidence interval:",
    opts:["Wider","Narrower","Unchanged"], correct:0,
    exp:"A higher confidence level requires a larger reliability factor, widening the interval." },

  { cat:"Sampling & Estimation", concept:"Known Population Variance",
    q:"Sampling from a normal distribution with known σ=40, a sample of n=100 has X̄=250. What is the 95% confidence interval (nearest 0.1)?",
    opts:["[242.2, 257.8]","[246.1, 253.9]","[210.0, 290.0]"], correct:0,
    exp:"SE=40/√100=4. CI = 250 ± 1.96(4) = [242.16, 257.84]." },
  { cat:"Sampling & Estimation", concept:"Known Population Variance",
    q:"With known population variance, which distribution provides the reliability factor for the confidence interval?",
    opts:["The standard normal (z) distribution","The t-distribution","The chi-square distribution"], correct:0,
    exp:"Known population variance uses the z-distribution for the reliability factor." },

  { cat:"Sampling & Estimation", concept:"Unknown Population Variance",
    q:"With an unknown population variance and a small sample from a normal population, which distribution should be used?",
    opts:["The t-distribution, with n−1 degrees of freedom", "The standard normal distribution, always", "The binomial distribution"], correct:0,
    exp:"Unknown variance with a small sample calls for the t-distribution with n−1 degrees of freedom." },
  { cat:"Sampling & Estimation", concept:"Unknown Population Variance",
    q:"Why is it acceptable to use a z reliability factor with unknown population variance, as long as the sample is large?",
    opts:["The t-distribution converges to the normal distribution as sample size grows", "Large samples eliminate the need for any reliability factor", "Population variance becomes known automatically at large samples"], correct:0,
    exp:"As sample size (and degrees of freedom) grows large, the t-distribution converges to the standard normal, making z a reasonable approximation." },

  { cat:"Sampling & Estimation", concept:"Selecting Sample Size",
    q:"The standard error of the sample mean is given by:",
    opts:["σ/√n","σ×√n","σ/n"], correct:0,
    exp:"Standard error = population standard deviation divided by the square root of sample size." },
  { cat:"Sampling & Estimation", concept:"Selecting Sample Size",
    q:"If sample size increases from n to 4n, the standard error of the mean approximately:",
    opts:["Halves","Doubles","Stays the same"], correct:0,
    exp:"SE is proportional to 1/√n, so quadrupling n halves the standard error (√4=2, so SE divides by 2)." },

  { cat:"Sampling & Estimation", concept:"Data Snooping Bias",
    q:"Testing hundreds of variables on the same dataset and reporting only the significant few, without disclosing the rest, is:",
    opts:["Data snooping (data mining) bias","Survivorship bias","Look-ahead bias"], correct:0,
    exp:"Selectively reporting only significant results from repeated testing on the same data is data snooping bias." },
  { cat:"Sampling & Estimation", concept:"Data Snooping Bias",
    q:"A research paper describing a trading signal as discovered by \"searching many possible variables until one worked\" is a warning sign of:",
    opts:["Data mining / data snooping","Survivorship bias","Time-period bias"], correct:0,
    exp:"Searching many variables until finding one that 'works' is a classic data-mining red flag." },

  { cat:"Sampling & Estimation", concept:"Sample Selection & Survivorship",
    q:"A mutual fund database that only includes funds still operating today, excluding those that closed, is most likely to cause:",
    opts:["Survivorship bias","Look-ahead bias","Time-period bias"], correct:0,
    exp:"Excluding failed/closed funds from a dataset overstates historical performance — survivorship bias." },
  { cat:"Sampling & Estimation", concept:"Sample Selection & Survivorship",
    q:"Survivorship bias tends to make historical performance data look:",
    opts:["Better than it actually was","Worse than it actually was","Unaffected either way"], correct:0,
    exp:"Since only 'survivors' remain in the dataset, average historical performance is overstated." },

  { cat:"Sampling & Estimation", concept:"Look-Ahead & Time-Period Bias",
    q:"A backtest ranks stocks using Q4 book value as of December 31st, even though that figure wasn't publicly released until mid-February. This is:",
    opts:["Look-ahead bias","Survivorship bias","Data snooping"], correct:0,
    exp:"Using information before it was actually available to investors is look-ahead bias." },
  { cat:"Sampling & Estimation", concept:"Look-Ahead & Time-Period Bias",
    q:"A study spans a period covering both a low-volatility regime and a high-volatility regime, without adjusting for the shift. This risks:",
    opts:["Time-period bias","Look-ahead bias only","No bias at all"], correct:0,
    exp:"Results can be sensitive to the specific time period studied, especially when regimes shift within it — time-period bias." },

  // ========== MODULE 07: Hypothesis Testing (12 concepts x 2 = 24) ==========
  { cat:"Hypothesis Testing", concept:"Why Hypothesis Testing?",
    q:"Hypothesis testing is fundamentally a tool for:",
    opts:["Using sample data to assess a claim about a population parameter", "Calculating a population parameter exactly, with no uncertainty", "Replacing the need for any sample data at all"], correct:0,
    exp:"Hypothesis testing uses sample evidence to evaluate a specific claim about an unknown population parameter." },
  { cat:"Hypothesis Testing", concept:"Why Hypothesis Testing?",
    q:"Why can't hypothesis testing ever prove a null hypothesis is absolutely true?",
    opts:["Sample evidence can only support 'fail to reject' or 'reject', never absolute proof", "Hypothesis testing always proves hypotheses true or false with certainty", "It's a limitation only of small samples"], correct:0,
    exp:"Statistical tests work with sample evidence and probability, so they can never provide absolute proof — only support for rejecting or failing to reject." },

  { cat:"Hypothesis Testing", concept:"Stating the Hypotheses",
    q:"Which statement about the null and alternative hypotheses is correct?",
    opts:["The null hypothesis is the statement being directly tested, assumed true until evidence suggests otherwise", "The alternative hypothesis is always assumed true at the start", "Both hypotheses must include an equality"], correct:0,
    exp:"H₀ is the claim under direct test, presumed true unless the evidence strongly contradicts it." },
  { cat:"Hypothesis Testing", concept:"Stating the Hypotheses",
    q:"H₀: μ = 10 versus Hₐ: μ ≠ 10 is an example of a:",
    opts:["One-sided test","Two-sided test","Non-parametric test"], correct:1,
    exp:"A 'not equal to' alternative hypothesis defines a two-sided test." },

  { cat:"Hypothesis Testing", concept:"Test Statistics",
    q:"The test statistic for a single population mean with an unknown population variance and a small sample follows which distribution?",
    opts:["The t-distribution","The chi-square distribution","The F-distribution"], correct:0,
    exp:"Unknown variance, small sample from a normal population — the t-distribution." },
  { cat:"Hypothesis Testing", concept:"Test Statistics",
    q:"A test statistic is generally calculated as:",
    opts:["(Sample statistic − Hypothesized value) / Standard error", "Sample statistic × Standard error", "Hypothesized value / Sample size"], correct:0,
    exp:"The general test statistic formula: (sample statistic minus hypothesized parameter) divided by standard error." },

  { cat:"Hypothesis Testing", concept:"Significance, Type I/II Errors & Power",
    q:"A Type I error occurs when:",
    opts:["A true null hypothesis is incorrectly rejected", "A false null hypothesis is not rejected", "The sample size is too small"], correct:0,
    exp:"Type I error = rejecting a null hypothesis that's actually true (a false positive)." },
  { cat:"Hypothesis Testing", concept:"Significance, Type I/II Errors & Power",
    q:"The power of a test is defined as:",
    opts:["1 minus the probability of a Type II error", "The probability of a Type I error", "The significance level itself"], correct:0,
    exp:"Power = 1 − P(Type II error) — the probability of correctly rejecting a false null hypothesis." },

  { cat:"Hypothesis Testing", concept:"Decision Rules & Critical Values",
    q:"For a two-sided test at the 5% significance level using a z-distributed test statistic, the critical values are approximately:",
    opts:["±1.96","±1.65","±2.58"], correct:0,
    exp:"The two-sided 5% critical values for the standard normal distribution are ±1.96." },
  { cat:"Hypothesis Testing", concept:"Decision Rules & Critical Values",
    q:"Testing H₀: μ=25 at the 95% confidence level, the sample's 95% CI is [23.1, 24.8]. What is the decision?",
    opts:["Reject H₀, since 25 falls outside the confidence interval", "Fail to reject H₀", "The test is inconclusive"], correct:0,
    exp:"Since the hypothesized value 25 falls outside the 95% CI, H₀ is rejected at the corresponding significance level." },

  { cat:"Hypothesis Testing", concept:"Statistical vs. Economic Significance",
    q:"A trading strategy's mean return is statistically significantly different from zero, but the edge is smaller than transaction costs. This result is:",
    opts:["Statistically significant but not economically significant", "Both statistically and economically significant", "Neither statistically nor economically significant"], correct:0,
    exp:"A real but tiny effect can be statistically detectable while still being too small to matter once real-world costs are considered." },
  { cat:"Hypothesis Testing", concept:"Statistical vs. Economic Significance",
    q:"Why might a very large sample size produce statistically significant results with little practical relevance?",
    opts:["Large samples can detect even trivially small effects as 'significant'", "Large samples always inflate the true effect size", "Statistical significance requires small samples"], correct:0,
    exp:"With enough data, even a tiny, practically meaningless effect can become statistically detectable." },

  { cat:"Hypothesis Testing", concept:"The Role of p-Values",
    q:"The p-value of a hypothesis test is best described as:",
    opts:["The smallest significance level at which the null hypothesis can be rejected", "The probability the null hypothesis is true", "The probability of a Type II error"], correct:0,
    exp:"The p-value is the smallest significance level at which the observed result would lead to rejecting H₀." },
  { cat:"Hypothesis Testing", concept:"The Role of p-Values",
    q:"A two-sided test produces a calculated z-statistic of 1.75. Approximately what is the p-value?",
    opts:["0.08","0.04","0.20"], correct:0,
    exp:"For a two-sided test, p-value = 2×(1−Φ(1.75)) ≈ 0.08." },

  { cat:"Hypothesis Testing", concept:"Multiple Testing",
    q:"A researcher runs 200 independent hypothesis tests at a 5% significance level, and every null hypothesis is actually true. About how many statistically significant results should she expect purely by chance?",
    opts:["10","5","1"], correct:0,
    exp:"200 × 0.05 = 10 expected false positives purely by chance." },
  { cat:"Hypothesis Testing", concept:"Multiple Testing",
    q:"The Benjamini-Hochberg procedure is designed to address which specific problem?",
    opts:["Controlling the false discovery rate when running many simultaneous tests", "Increasing statistical power in a single test", "Eliminating the need for a null hypothesis"], correct:0,
    exp:"Benjamini-Hochberg controls the expected proportion of false positives among multiple simultaneous tests." },

  { cat:"Hypothesis Testing", concept:"A Single Mean",
    q:"Testing H₀: μ=6 vs. Hₐ: μ≠6 with n=33, X̄=5.299, s=1.4284, the calculated t-statistic is approximately:",
    opts:["−2.82","−0.70","−5.02"], correct:0,
    exp:"t = (X̄−μ)/(s/√n) = (5.299−6)/(1.4284/√33) ≈ −2.82." },
  { cat:"Hypothesis Testing", concept:"A Single Mean",
    q:"For a test of a single mean with unknown population variance, the degrees of freedom used is:",
    opts:["n − 1","n","n − 2"], correct:0,
    exp:"A single-mean t-test uses n−1 degrees of freedom." },

  { cat:"Hypothesis Testing", concept:"Difference in Means — Independent",
    q:"When testing the difference between two INDEPENDENT sample means (assuming equal variances), what degrees of freedom apply to the pooled t-test, with n₁=18 and n₂=22?",
    opts:["38","40","36"], correct:0,
    exp:"Pooled variance t-test degrees of freedom = n₁+n₂−2 = 18+22−2 = 38." },
  { cat:"Hypothesis Testing", concept:"Difference in Means — Independent",
    q:"The pooled variance approach for comparing two independent means assumes:",
    opts:["The two populations have equal variances", "The two populations have unequal variances", "Both samples have identical means"], correct:0,
    exp:"Pooling the variance estimate is only valid when the two populations are assumed to have equal variances." },

  { cat:"Hypothesis Testing", concept:"Difference in Means — Paired",
    q:"Two analysts' forecast errors are measured on the exact same 40 companies. The appropriate test for comparing their mean errors is a:",
    opts:["Paired comparisons t-test","Independent samples t-test","Chi-square test"], correct:0,
    exp:"When the same set of observations is measured twice (shared underlying units), a paired test is appropriate, not an independent-samples test." },
  { cat:"Hypothesis Testing", concept:"Difference in Means — Paired",
    q:"The paired comparisons test works by first calculating:",
    opts:["The difference between each paired observation, then testing whether the mean difference is zero", "The pooled variance of the two independent samples", "The correlation between the two groups"], correct:0,
    exp:"Paired testing reduces to a single-mean test on the per-pair differences, testing whether their mean is zero." },

  { cat:"Hypothesis Testing", concept:"Tests of Variance",
    q:"A test of a single population variance uses which test statistic and distribution?",
    opts:["A chi-square statistic, chi-square distribution", "A t-statistic, t-distribution", "An F-statistic, F-distribution"], correct:0,
    exp:"Single-variance tests use a chi-square test statistic and the chi-square distribution." },
  { cat:"Hypothesis Testing", concept:"Tests of Variance",
    q:"An F-test comparing the variances of two independent samples, with n₁=20 and n₂=15, has which degrees of freedom?",
    opts:["19 and 14","20 and 15","35"], correct:0,
    exp:"F-test degrees of freedom are (n₁−1, n₂−1) = (19, 14)." },
];

/* ============================================================
   Quiz engine — shuffled order, category tags, breakdown by module
   ============================================================ */
(function(){
  const shell = document.getElementById('quizShell');
  if (!shell) return;

  function shuffle(arr){
    const a = [...arr];
    for (let i=a.length-1; i>0; i--){
      const j = Math.floor(Math.random()*(i+1));
      [a[i],a[j]] = [a[j],a[i]];
    }
    return a;
  }

  let order = shuffle(QUIZ);
  let current = 0;
  let score = 0;
  let answered = new Array(order.length).fill(null);
  const categories = [...new Set(QUIZ.map(q=>q.cat))];
  const catScores = {};
  categories.forEach(c => catScores[c] = {correct:0, total:0});

  function renderIntro(){
    shell.innerHTML = `
      <div style="text-align:center; padding:20px 0;">
        <p style="color:var(--ink-soft); margin-bottom:20px;">${order.length} questions, shuffled — 2 per concept, across all 9 modules, for a genuinely reliable readiness read. One attempt per question, with an explanation after each.</p>
        <button class="start-btn" id="startBtn">Start the Final Review →</button>
      </div>`;
    document.getElementById('startBtn').addEventListener('click', () => { renderQuestion(); });
  }

  function renderQuestion(){
    const item = order[current];
    let html = `<div class="cat-tag">${item.cat} · ${item.concept}</div>`;
    html += `<div class="quiz-progress">Question ${current+1} of ${order.length} &nbsp;·&nbsp; Score so far: ${score}</div>`;
    html += `<div class="quiz-q">${item.q}</div>`;
    html += `<div class="opt-list" id="quizOpts">`;
    item.opts.forEach((opt, i) => {
      html += `<button class="opt-btn" data-i="${i}">${opt}</button>`;
    });
    html += `</div>`;
    html += `<div class="quiz-explain" id="quizExplain">${item.exp}</div>`;
    html += `<div class="quiz-nav">
      <button class="btn ghost" id="quizPrev" ${current===0 ? 'disabled' : ''}>← Previous</button>
      <button class="btn" id="quizNext" disabled>${current === order.length-1 ? 'See final score' : 'Next →'}</button>
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
        const isCorrect = i === item.correct;
        if (isCorrect) score++;
        catScores[item.cat].total++;
        if (isCorrect) catScores[item.cat].correct++;
        if (typeof cfaRecordAnswer === 'function' && item.concept){
          cfaRecordAnswer(item.concept, item.cat, isCorrect);
        }
        opts.forEach(b => {
          b.disabled = true;
          const bi = +b.dataset.i;
          if (bi === item.correct) b.classList.add('correct');
          else if (bi === i) b.classList.add('incorrect');
        });
        explain.classList.add('show');
        nextBtn.disabled = false;
      });
    });

    nextBtn.addEventListener('click', () => {
      if (current < order.length - 1){ current++; renderQuestion(); }
      else { renderScore(); }
    });
    prevBtn.addEventListener('click', () => {
      if (current > 0){ current--; renderQuestion(); }
    });
  }

  function renderScore(){
    const pct = Math.round((score / order.length) * 100);
    let msg = "Solid overall foundation — use the breakdown below to see exactly which modules to revisit.";
    if (pct >= 90) msg = "Excellent — you've genuinely internalized the full curriculum.";
    else if (pct >= 70) msg = "Good work — a few gaps worth revisiting, shown below.";

    let breakdownHTML = '<div class="cat-breakdown">';
    categories.forEach(cat => {
      const cs = catScores[cat];
      const catPct = cs.total > 0 ? Math.round((cs.correct/cs.total)*100) : 0;
      breakdownHTML += `
        <div class="cat-row">
          <div class="name">${cat}</div>
          <div class="track"><div class="fill" style="width:${catPct}%;"></div></div>
          <div class="score">${cs.correct}/${cs.total}</div>
        </div>`;
    });
    breakdownHTML += '</div>';

    shell.innerHTML = `
      <div class="quiz-score">
        <div style="font-family:var(--font-mono); font-size:.8rem; color:var(--ink-soft); text-transform:uppercase; letter-spacing:.08em;">Final score</div>
        <div class="big">${score} / ${order.length}</div>
        <p style="max-width:52ch; margin:10px auto 6px; color:var(--ink-soft);">${msg}</p>
      </div>
      <h3 style="font-family:var(--font-mono); font-size:.8rem; text-transform:uppercase; letter-spacing:.05em; color:var(--indigo); margin:24px 0 4px;">Score by module</h3>
      ${breakdownHTML}
      <div style="text-align:center; margin-top:24px; display:flex; gap:12px; justify-content:center; flex-wrap:wrap;">
        <button class="btn" id="quizRestart">Retake (new shuffled order)</button>
        <a href="../readiness/index.html" class="btn ghost" style="text-decoration:none; display:inline-flex; align-items:center;">See full readiness dashboard →</a>
      </div>`;
    document.getElementById('quizRestart').addEventListener('click', () => {
      order = shuffle(QUIZ);
      current = 0; score = 0;
      answered = new Array(order.length).fill(null);
      categories.forEach(c => { catScores[c] = {correct:0, total:0}; });
      renderQuestion();
    });
  }

  renderIntro();
})();

/* ============================================================
   Quiz engine — shuffled order, category tags, breakdown by module
   ============================================================ */
(function(){
  const shell = document.getElementById('quizShell');
  if (!shell) return;

  function shuffle(arr){
    const a = [...arr];
    for (let i=a.length-1; i>0; i--){
      const j = Math.floor(Math.random()*(i+1));
      [a[i],a[j]] = [a[j],a[i]];
    }
    return a;
  }

  let order = shuffle(QUIZ);
  let current = 0;
  let score = 0;
  let answered = new Array(order.length).fill(null);
  const categories = [...new Set(QUIZ.map(q=>q.cat))];
  const catScores = {};
  categories.forEach(c => catScores[c] = {correct:0, total:0});

  function renderIntro(){
    shell.innerHTML = `
      <div style="text-align:center; padding:20px 0;">
        <p style="color:var(--ink-soft); margin-bottom:20px;">${order.length} questions, shuffled — 2 per concept, across all 9 modules, for a genuinely reliable readiness read. One attempt per question, with an explanation after each.</p>
        <button class="start-btn" id="startBtn">Start the Final Review →</button>
      </div>`;
    document.getElementById('startBtn').addEventListener('click', () => { renderQuestion(); });
  }

  function renderQuestion(){
    const item = order[current];
    let html = `<div class="cat-tag">${item.cat} · ${item.concept}</div>`;
    html += `<div class="quiz-progress">Question ${current+1} of ${order.length} &nbsp;·&nbsp; Score so far: ${score}</div>`;
    html += `<div class="quiz-q">${item.q}</div>`;
    html += `<div class="opt-list" id="quizOpts">`;
    item.opts.forEach((opt, i) => {
      html += `<button class="opt-btn" data-i="${i}">${opt}</button>`;
    });
    html += `</div>`;
    html += `<div class="quiz-explain" id="quizExplain">${item.exp}</div>`;
    html += `<div class="quiz-nav">
      <button class="btn ghost" id="quizPrev" ${current===0 ? 'disabled' : ''}>← Previous</button>
      <button class="btn" id="quizNext" disabled>${current === order.length-1 ? 'See final score' : 'Next →'}</button>
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
        const isCorrect = i === item.correct;
        if (isCorrect) score++;
        catScores[item.cat].total++;
        if (isCorrect) catScores[item.cat].correct++;
        if (typeof cfaRecordAnswer === 'function' && item.concept){
          cfaRecordAnswer(item.concept, item.cat, isCorrect);
        }
        opts.forEach(b => {
          b.disabled = true;
          const bi = +b.dataset.i;
          if (bi === item.correct) b.classList.add('correct');
          else if (bi === i) b.classList.add('incorrect');
        });
        explain.classList.add('show');
        nextBtn.disabled = false;
      });
    });

    nextBtn.addEventListener('click', () => {
      if (current < order.length - 1){ current++; renderQuestion(); }
      else { renderScore(); }
    });
    prevBtn.addEventListener('click', () => {
      if (current > 0){ current--; renderQuestion(); }
    });
  }

  function renderScore(){
    const pct = Math.round((score / order.length) * 100);
    let msg = "Solid overall foundation — use the breakdown below to see exactly which modules to revisit.";
    if (pct >= 90) msg = "Excellent — you've genuinely internalized the full curriculum.";
    else if (pct >= 70) msg = "Good work — a few gaps worth revisiting, shown below.";

    let breakdownHTML = '<div class="cat-breakdown">';
    categories.forEach(cat => {
      const cs = catScores[cat];
      const catPct = cs.total > 0 ? Math.round((cs.correct/cs.total)*100) : 0;
      breakdownHTML += `
        <div class="cat-row">
          <div class="name">${cat}</div>
          <div class="track"><div class="fill" style="width:${catPct}%;"></div></div>
          <div class="score">${cs.correct}/${cs.total}</div>
        </div>`;
    });
    breakdownHTML += '</div>';

    shell.innerHTML = `
      <div class="quiz-score">
        <div style="font-family:var(--font-mono); font-size:.8rem; color:var(--ink-soft); text-transform:uppercase; letter-spacing:.08em;">Final score</div>
        <div class="big">${score} / ${order.length}</div>
        <p style="max-width:52ch; margin:10px auto 6px; color:var(--ink-soft);">${msg}</p>
      </div>
      <h3 style="font-family:var(--font-mono); font-size:.8rem; text-transform:uppercase; letter-spacing:.05em; color:var(--indigo); margin:24px 0 4px;">Score by module</h3>
      ${breakdownHTML}
      <div style="text-align:center; margin-top:24px; display:flex; gap:12px; justify-content:center; flex-wrap:wrap;">
        <button class="btn" id="quizRestart">Retake (new shuffled order)</button>
        <a href="../readiness/index.html" class="btn ghost" style="text-decoration:none; display:inline-flex; align-items:center;">See full readiness dashboard →</a>
      </div>`;
    document.getElementById('quizRestart').addEventListener('click', () => {
      order = shuffle(QUIZ);
      current = 0; score = 0;
      answered = new Array(order.length).fill(null);
      categories.forEach(c => { catScores[c] = {correct:0, total:0}; });
      renderQuestion();
    });
  }

  renderIntro();
})();
