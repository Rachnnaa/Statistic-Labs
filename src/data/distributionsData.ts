import { DistributionInfo } from '../types';

export const distributionsData: Record<string, DistributionInfo> = {
  normal: {
    id: 'normal',
    name: 'Normal Distribution',
    type: 'continuous',
    definition: 'A continuous probability distribution characterized by a symmetric bell-shaped curve. It is uniquely determined by its mean (μ) and standard deviation (σ). Due to the Central Limit Theorem, it describes many natural, social, and physical phenomena.',
    formula: 'f(x) = \\frac{1}{\\sigma \\sqrt{2\\pi}} e^{-\\frac{(x - \\mu)^2}{2\\sigma^2}}',
    meanFormula: '\\mu',
    varianceFormula: '\\sigma^2',
    properties: [
      'Symmetric about the mean (μ), which is also the mode and median.',
      'Unimodal: possesses a single peak at x = μ.',
      'The total area under the probability density curve is exactly 1.',
      'Empirical Rule: 68.27% of values fall within 1σ, 95.45% within 2σ, and 99.73% within 3σ of the mean.'
    ],
    applications: [
      'Modeling physical measurements like height, weight, and blood pressure.',
      'Standardized test scores (e.g., SAT, IQ scores).',
      'Quality control in manufacturing (measuring component sizes).',
      'Finance: modeling stock portfolio returns and asset pricing.'
    ],
    realLifeExample: 'The heights of adult males in a country are normally distributed with a mean of 175 cm and a standard deviation of 7 cm.',
    advantages: [
      'Extremely well-understood with closed-form statistical properties.',
      'Forms the backbone of inferential statistics and hypothesis testing (e.g., Z-tests, t-tests).',
      'The Central Limit Theorem guarantees that sample means will converge here.'
    ],
    limitations: [
      'Extends infinitely in both directions, meaning it can assign non-zero probabilities to physically impossible values (e.g., negative height or weight).',
      'Fails to model highly skewed or heavy-tailed data (e.g., income distributions).'
    ],
    derivation: 'The Normal distribution can be derived as the limit of a Binomial distribution as the number of trials n approaches infinity, while keeping the probability of success p constant (de Moivre-Laplace theorem). Alternatively, it is the distribution that maximizes information entropy for a specified mean and variance.'
  },
  binomial: {
    id: 'binomial',
    name: 'Binomial Distribution',
    type: 'discrete',
    definition: 'A discrete probability distribution that models the number of successes in a fixed number (n) of independent trials, where each trial has only two possible outcomes (success/failure) with a constant probability of success (p).',
    formula: 'P(X = k) = \\binom{n}{k} p^k (1 - p)^{n - k}',
    meanFormula: 'n \\cdot p',
    varianceFormula: 'n \\cdot p \\cdot (1 - p)',
    properties: [
      'Discrete: X can only take integer values from 0 to n.',
      'The sum of probabilities across all outcomes (0 to n) equals 1.',
      'Symmetric if p = 0.5; skewed right if p < 0.5; skewed left if p > 0.5.'
    ],
    applications: [
      'Quality control: counting the number of defective items in a batch of size n.',
      'Medical trials: counting how many patients out of n respond to a treatment.',
      'A/B testing: counting conversion rates on web pages.',
      'Spam filters: analyzing binary occurrences of words in emails.'
    ],
    realLifeExample: 'Flipping a fair coin 10 times and counting the number of heads (n = 10, p = 0.5).',
    advantages: [
      'Simple and highly intuitive for modeling binary choices.',
      'Highly useful for decision-making in business, marketing, and medical research.'
    ],
    limitations: [
      'Assumes trials are completely independent (which is not always true in real life).',
      'Requires the probability of success (p) to remain exactly constant across all trials.'
    ],
    derivation: 'Starting from a single Bernoulli trial with success probability p, the sum of n independent and identically distributed (i.i.d.) Bernoulli variables results in the Binomial distribution. The binomial coefficient represents the number of ways to arrange k successes and (n-k) failures.'
  },
  poisson: {
    id: 'poisson',
    name: 'Poisson Distribution',
    type: 'discrete',
    definition: 'A discrete probability distribution that expresses the probability of a given number of events occurring in a fixed interval of time or space, assuming these events occur with a known constant mean rate (λ) and independently of the time since the last event.',
    formula: 'P(X = k) = \\frac{\\lambda^k e^{-\\lambda}}{k!}',
    meanFormula: '\\lambda',
    varianceFormula: '\\lambda',
    properties: [
      'Discrete: can take any non-negative integer values (0, 1, 2, ... to infinity).',
      'The mean and variance are uniquely equal to each other (both equal to λ).',
      'As λ increases, the distribution approaches a Normal distribution.'
    ],
    applications: [
      'Modeling website traffic: number of server hits per minute.',
      'Customer service: number of phone calls received by a call center per hour.',
      'Safety engineering: number of traffic accidents at an intersection per month.',
      'Physics: radioactive decay events in a given time period.'
    ],
    realLifeExample: 'An emergency room receives an average of 4 patients per hour (λ = 4). We can calculate the probability of receiving 0, 1, or 5 patients in any given hour.',
    advantages: [
      'Incredibly effective for modeling rate-based arrival processes.',
      'Requires only one parameter (λ), making it exceptionally simple to calibrate.'
    ],
    limitations: [
      'The assumption that mean equals variance is often violated in real data (overdispersion, where variance is greater than the mean, is common).',
      'Assumes events cannot occur simultaneously at the exact same split-second.'
    ],
    derivation: 'The Poisson distribution can be derived as a limiting case of the Binomial distribution as the number of trials n approaches infinity and the probability of success p approaches zero, such that the product np = λ remains constant.'
  },
  uniform: {
    id: 'uniform',
    name: 'Continuous Uniform',
    type: 'continuous',
    definition: 'A continuous probability distribution where all intervals of the same length on the distribution\'s support [a, b] are equally probable. It represents a state of complete uncertainty or equal likelihood across a bounded interval.',
    formula: 'f(x) = \\begin{cases} \\frac{1}{b - a} & \\text{for } a \\le x \\le b \\\\ 0 & \\text{otherwise} \\end{cases}',
    meanFormula: '\\frac{a + b}{2}',
    varianceFormula: '\\frac{(b - a)^2}{12}',
    properties: [
      'Rectangular shape with flat density between a and b.',
      'Symmetric about the midpoint.',
      'Cumulative distribution function (CDF) increases linearly from 0 to 1 between a and b.'
    ],
    applications: [
      'Random number generators (generating numbers between 0 and 1).',
      'Physics: modeling the phase angle of a signal.',
      'Prior distributions in Bayesian statistics when nothing is known about a parameter.'
    ],
    realLifeExample: 'A bus arrives at a stop exactly every 15 minutes. If you arrive randomly, your waiting time is uniformly distributed between 0 and 15 minutes.',
    advantages: [
      'Easiest distribution to calculate, integrate, and understand.',
      'Perfect for simulating random baselines in computer modeling.'
    ],
    limitations: [
      'Real-world phenomena rarely have perfectly flat, sharp-cutoff bounds where probability drops instantly to zero.'
    ],
    derivation: 'Derived from the principle of indifference in probability theory, stating that if there is no physical reason to favor one sub-interval over another of equal length, they must be assigned equal probabilities.'
  },
  exponential: {
    id: 'exponential',
    name: 'Exponential Distribution',
    type: 'continuous',
    definition: 'A continuous probability distribution that models the time or space between independent events occurring at a constant average rate (λ). It is the continuous counterpart of the geometric distribution.',
    formula: 'f(x) = \\lambda e^{-\\lambda x} \\quad (x \\ge 0)',
    meanFormula: '\\frac{1}{\\lambda}',
    varianceFormula: '\\frac{1}{\\lambda^2}',
    properties: [
      'Memoryless: P(X > s + t | X > s) = P(X > t). The probability of waiting an extra minute is independent of how long you have already waited.',
      'Strictly decreasing, with the peak at x = 0.',
      'Right-skewed with a long positive tail.'
    ],
    applications: [
      'Reliability engineering: modeling the lifespan of electronic components.',
      'Service systems: wait times between phone calls, customer arrivals, or transaction processing.',
      'Seismology: time intervals between earthquakes.'
    ],
    realLifeExample: 'The lifespan of a certain laptop battery is exponentially distributed with a failure rate of λ = 0.2 per year, meaning an average lifespan of 5 years.',
    advantages: [
      'The memoryless property makes mathematical calculations for system scheduling and queueing theory highly tractable.'
    ],
    limitations: [
      'The memoryless property is physically unrealistic for modeling human aging or mechanical wear-and-tear, where components degrade over time.'
    ],
    derivation: 'It is derived directly from the Poisson process. If the number of events in an interval follows a Poisson distribution, the continuous time waiting between those successive events follows an Exponential distribution.'
  },
  t: {
    id: 't',
    name: "Student's t-Distribution",
    type: 'continuous',
    definition: 'A continuous probability distribution that arises when estimating the mean of a normally distributed population in situations where the sample size is small (n < 30) and the population\'s standard deviation is unknown.',
    formula: 'f(t) = \\frac{\\Gamma(\\frac{\\nu+1}{2})}{\\sqrt{\\nu\\pi} \\Gamma(\\frac{\\nu}{2})} \\left(1 + \\frac{t^2}{\\nu}\\right)^{-\\frac{\\nu+1}{2}}',
    meanFormula: '0 \\quad (\\text{for } \\nu > 1)',
    varianceFormula: '\\frac{\\nu}{\\nu - 2} \\quad (\\text{for } \\nu > 2)',
    properties: [
      'Symmetric, bell-shaped, and centered at 0 (like the Standard Normal).',
      'Has heavier tails (higher kurtosis) than the Normal distribution, making it more robust to outliers.',
      'As degrees of freedom (ν) approach infinity, it converges exactly to the Standard Normal distribution (Z-distribution).'
    ],
    applications: [
      'Constructing confidence intervals for a population mean when standard deviation is unknown.',
      'Performing Student\'s t-tests to compare means of two samples.',
      'Robust regression modeling in financial economics.'
    ],
    realLifeExample: 'An analyst tests whether a new fertilizer increases crop yield by measuring 15 crop samples. Since the sample size is small and the true standard deviation is unknown, they use a t-distribution with 14 degrees of freedom.',
    advantages: [
      'Accounts for the extra uncertainty introduced by estimating the population variance from a small sample.'
    ],
    limitations: [
      'Requires the underlying population to be approximately normally distributed, especially for extremely small samples.'
    ],
    derivation: 'Discovered by William Sealy Gosset (under the pen name "Student") in 1908. If Z is a standard normal variable and V is a Chi-Square variable with ν degrees of freedom independent of Z, then the ratio T = Z / sqrt(V / ν) follows Student\'s t-distribution.'
  },
  chisquare: {
    id: 'chisquare',
    name: 'Chi-Square Distribution',
    type: 'continuous',
    definition: 'A continuous probability distribution of the sum of squares of (k) independent standard normal random variables. It is widely used in hypothesis testing and constructing confidence intervals for variances.',
    formula: 'f(x) = \\frac{1}{2^{k/2} \\Gamma(k/2)} x^{k/2 - 1} e^{-x/2} \\quad (x > 0)',
    meanFormula: 'k',
    varianceFormula: '2k',
    properties: [
      'Skewed heavily to the right. As the degrees of freedom (k) increase, it becomes more symmetric and approaches a Normal distribution.',
      'Bounded on the left by zero; all Chi-Square values must be positive.'
    ],
    applications: [
      'Chi-Square test of independence (testing if two categorical variables are related).',
      'Goodness-of-fit test (testing if a sample matches a theoretical distribution).',
      'Estimating confidence intervals for population variance.'
    ],
    realLifeExample: 'Testing whether there is an association between gender (male/female) and pet preference (dog/cat/bird) in a survey of 200 people.',
    advantages: [
      'The math is highly standardized and tabulated, forming the base of most non-parametric categorical statistical tests.'
    ],
    limitations: [
      'Highly sensitive to small sample sizes; contingency table cells should generally have an expected frequency of at least 5 to maintain test validity.'
    ],
    derivation: 'If Z_1, Z_2, ..., Z_k are independent standard normal random variables, the sum X = sum(Z_i^2) is distributed according to the Chi-Square distribution with k degrees of freedom.'
  },
  f: {
    id: 'f',
    name: 'Fisher-Snedecor F-Distribution',
    type: 'continuous',
    definition: 'A continuous probability distribution that arises frequently as the null distribution of a test statistic in the analysis of variance (ANOVA). It is the ratio of two independent chi-square variables, each divided by its degrees of freedom.',
    formula: 'f(x) = \\frac{\\sqrt{\\frac{(d_1 x)^{d_1} d_2^{d_2}}{(d_1 x + d_2)^{d_1 + d_2}}}}{x \\cdot B\\left(\\frac{d_1}{2}, \\frac{d_2}{2}\\right)} \\quad (x > 0)',
    meanFormula: '\\frac{d_2}{d_2 - 2} \\quad (\\text{for } d_2 > 2)',
    varianceFormula: '\\frac{2 d_2^2 (d_1 + d_2 - 2)}{d_1 (d_2 - 2)^2 (d_2 - 4)} \\quad (\\text{for } d_2 > 4)',
    properties: [
      'Asymmetrical and heavily skewed to the right.',
      'Takes only non-negative values (x > 0).',
      'Determined by two separate degrees of freedom: numerator (d1) and denominator (d2).'
    ],
    applications: [
      'Analysis of Variance (ANOVA) to compare means of three or more independent groups.',
      'F-test of overall significance in multiple linear regression.',
      'Testing whether two population variances are equal.'
    ],
    realLifeExample: 'An agricultural scientist compares the average wheat yield under 4 different soil fertilizers. They use ANOVA, which relies on the F-distribution to determine if the differences in means are statistically significant.',
    advantages: [
      'Enables simultaneous comparison of multiple groups, avoiding the inflation of Type I errors that would occur if doing multiple pairwise t-tests.'
    ],
    limitations: [
      'Extremely sensitive to departures from normality in the parent populations.'
    ],
    derivation: 'Let U_1 and U_2 be independent Chi-Square variables with degrees of freedom d_1 and d_2, respectively. The random variable F = (U_1 / d_1) / (U_2 / d_2) is distributed according to the F-distribution.'
  }
};
