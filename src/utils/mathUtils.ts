// Lanczos approximation for Gamma function
export function gamma(z: number): number {
  if (z < 0.5) {
    return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
  }
  z -= 1;
  const g = 7;
  const p = [
    0.99999999999980993,
    676.5203681218851,
    -1259.1392167224028,
    771.32342877765313,
    -176.61502916214059,
    12.507343278686905,
    -0.13857109526572012,
    9.9843695780195716e-6,
    1.5056327351493116e-7
  ];
  let x = p[0];
  for (let i = 1; i < g + 2; i++) {
    x += p[i] / (z + i);
  }
  const t = z + g + 0.5;
  return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
}

export function beta(x: number, y: number): number {
  return (gamma(x) * gamma(y)) / gamma(x + y);
}

export function factorial(n: number): number {
  if (n < 0) return 0;
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

export function choose(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  let out = 1;
  const limit = Math.min(k, n - k);
  for (let i = 1; i <= limit; i++) {
    out = (out * (n - limit + i)) / i;
  }
  return Math.round(out);
}

// Numerical integration using Simpson's 3/8 rule or compound trapezoidal rule
export function integrate(f: (x: number) => number, start: number, end: number, steps: number = 200): number {
  if (start >= end) return 0;
  const h = (end - start) / steps;
  let sum = 0.5 * (f(start) + f(end));
  for (let i = 1; i < steps; i++) {
    sum += f(start + i * h);
  }
  const result = sum * h;
  return isNaN(result) ? 0 : result;
}

// --- NORMAL ---
export function normalPdf(x: number, mean: number, stdDev: number): number {
  if (stdDev <= 0) return 0;
  const exponent = -Math.pow(x - mean, 2) / (2 * Math.pow(stdDev, 2));
  return (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
}

export function erf(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  const absX = Math.abs(x);

  const t = 1.0 / (1.0 + p * absX);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);

  return sign * y;
}

export function normalCdf(x: number, mean: number, stdDev: number): number {
  if (stdDev <= 0) return 0;
  return 0.5 * (1 + erf((x - mean) / (stdDev * Math.sqrt(2))));
}

// --- BINOMIAL ---
export function binomialPmf(k: number, n: number, p: number): number {
  if (k < 0 || k > n || p < 0 || p > 1) return 0;
  return choose(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
}

export function binomialCdf(k: number, n: number, p: number): number {
  let sum = 0;
  const limit = Math.floor(k);
  for (let i = 0; i <= limit; i++) {
    sum += binomialPmf(i, n, p);
  }
  return Math.min(1, Math.max(0, sum));
}

// --- POISSON ---
export function poissonPmf(k: number, lambda: number): number {
  if (k < 0 || lambda <= 0) return 0;
  // Use log gamma to avoid factorial overflow for larger k
  const logPmf = k * Math.log(lambda) - lambda - Math.log(factorial(k));
  const val = Math.exp(logPmf);
  return isNaN(val) ? 0 : val;
}

export function poissonCdf(k: number, lambda: number): number {
  let sum = 0;
  const limit = Math.floor(k);
  for (let i = 0; i <= limit; i++) {
    sum += poissonPmf(i, lambda);
  }
  return Math.min(1, Math.max(0, sum));
}

// --- UNIFORM ---
export function uniformPdf(x: number, min: number, max: number): number {
  if (max <= min) return 0;
  if (x >= min && x <= max) {
    return 1 / (max - min);
  }
  return 0;
}

export function uniformCdf(x: number, min: number, max: number): number {
  if (max <= min) return 0;
  if (x < min) return 0;
  if (x > max) return 1;
  return (x - min) / (max - min);
}

// --- EXPONENTIAL ---
export function exponentialPdf(x: number, lambda: number): number {
  if (x < 0 || lambda <= 0) return 0;
  return lambda * Math.exp(-lambda * x);
}

export function exponentialCdf(x: number, lambda: number): number {
  if (x < 0 || lambda <= 0) return 0;
  return 1 - Math.exp(-lambda * x);
}

// --- STUDENT T ---
export function tPdf(t: number, df: number): number {
  if (df <= 0) return 0;
  const num = gamma((df + 1) / 2);
  const den = Math.sqrt(df * Math.PI) * gamma(df / 2);
  const factor = Math.pow(1 + (t * t) / df, -(df + 1) / 2);
  return (num / den) * factor;
}

export function tCdf(t: number, df: number): number {
  if (df <= 0) return 0;
  if (t === 0) return 0.5;
  if (t < 0) return 1 - tCdf(-t, df);
  
  // Cap integration bounds for stability
  const integrateTo = Math.min(t, 8);
  const val = integrate((x) => tPdf(x, df), 0, integrateTo, 200);
  let finalVal = 0.5 + val;
  if (t > 8) {
    // Smooth transition to 1
    finalVal = 0.999 + (1 - 0.999) * (1 - Math.exp(-(t - 8)));
  }
  return Math.min(1, Math.max(0, finalVal));
}

// --- CHI-SQUARE ---
export function chiSquarePdf(x: number, df: number): number {
  if (x <= 0 || df <= 0) return 0;
  const num = Math.pow(x, df / 2 - 1) * Math.exp(-x / 2);
  const den = Math.pow(2, df / 2) * gamma(df / 2);
  const val = num / den;
  return isNaN(val) || !isFinite(val) ? 0 : val;
}

export function chiSquareCdf(x: number, df: number): number {
  if (x <= 0 || df <= 0) return 0;
  const integrateTo = Math.min(x, 100);
  const val = integrate((v) => chiSquarePdf(v, df), 0, integrateTo, 250);
  if (x > 100) {
    return Math.min(1, val + (1 - val) * (1 - Math.exp(-(x - 100) / 10)));
  }
  return Math.min(1, Math.max(0, val));
}

// --- F-DISTRIBUTION ---
export function fPdf(x: number, d1: number, d2: number): number {
  if (x <= 0 || d1 <= 0 || d2 <= 0) return 0;
  const num = Math.pow(d1 * x, d1) * Math.pow(d2, d2);
  const den = Math.pow(d1 * x + d2, d1 + d2);
  const term1 = Math.sqrt(num / den);
  const term2 = x * beta(d1 / 2, d2 / 2);
  const val = term1 / term2;
  return isNaN(val) || !isFinite(val) ? 0 : val;
}

export function fCdf(x: number, d1: number, d2: number): number {
  if (x <= 0 || d1 <= 0 || d2 <= 0) return 0;
  const integrateTo = Math.min(x, 50);
  const val = integrate((v) => fPdf(v, d1, d2), 0, integrateTo, 250);
  if (x > 50) {
    return Math.min(1, val + (1 - val) * (1 - Math.exp(-(x - 50) / 5)));
  }
  return Math.min(1, Math.max(0, val));
}
