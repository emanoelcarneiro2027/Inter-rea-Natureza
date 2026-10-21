/* =====================================================
   GUIA ETNOBOTÂNICO – estatística (funções puras, sem DOM)
   Índice:
   1. Médias e desvio
   2. ANOVA de um fator (com valor p)
   3. Índice de velocidade de germinação (IVG)
   ===================================================== */
"use strict";

(function (root) {

  /* ---------- 1. MÉDIAS E DESVIO ---------- */
  const mean = (a) => a.reduce((s, x) => s + x, 0) / a.length;

  // Desvio-padrão amostral (n − 1). Com menos de 2 valores não existe.
  function sd(a) {
    if (a.length < 2) return NaN;
    const m = mean(a);
    return Math.sqrt(a.reduce((s, x) => s + (x - m) ** 2, 0) / (a.length - 1));
  }


  /* ---------- 2. ANOVA DE UM FATOR ----------
     Compara as médias de 2 ou mais grupos. O valor p vem da
     distribuição F, calculada com a função beta incompleta
     (Numerical Recipes, cap. 6). */
  function lgamma(x) {
    const c = [76.18009172947146, -86.50532032941677, 24.01409824083091,
      -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5];
    let y = x;
    let t = x + 5.5;
    t -= (x + 0.5) * Math.log(t);
    let s = 1.000000000190015;
    for (let j = 0; j < 6; j++) { y += 1; s += c[j] / y; }
    return -t + Math.log(2.5066282746310005 * s / x);
  }

  function betacf(a, b, x) {
    const FPMIN = 1e-300;
    const qab = a + b, qap = a + 1, qam = a - 1;
    let c = 1;
    let d = 1 - qab * x / qap;
    if (Math.abs(d) < FPMIN) d = FPMIN;
    d = 1 / d;
    let h = d;
    for (let m = 1; m <= 200; m++) {
      const m2 = 2 * m;
      let aa = m * (b - m) * x / ((qam + m2) * (a + m2));
      d = 1 + aa * d; if (Math.abs(d) < FPMIN) d = FPMIN;
      c = 1 + aa / c; if (Math.abs(c) < FPMIN) c = FPMIN;
      d = 1 / d; h *= d * c;
      aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
      d = 1 + aa * d; if (Math.abs(d) < FPMIN) d = FPMIN;
      c = 1 + aa / c; if (Math.abs(c) < FPMIN) c = FPMIN;
      d = 1 / d;
      const del = d * c;
      h *= del;
      if (Math.abs(del - 1) < 3e-12) break;
    }
    return h;
  }

  function betai(a, b, x) {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    const bt = Math.exp(lgamma(a + b) - lgamma(a) - lgamma(b) + a * Math.log(x) + b * Math.log(1 - x));
    return x < (a + 1) / (a + b + 2)
      ? bt * betacf(a, b, x) / a
      : 1 - bt * betacf(b, a, 1 - x) / b;
  }

  // P(F ≥ valor observado) com d1 e d2 graus de liberdade
  function fPValue(F, d1, d2) {
    if (!(F >= 0)) return NaN;
    return betai(d2 / 2, d1 / 2, d2 / (d2 + d1 * F));
  }

  // groups: lista de listas de números. Devolve null se não der para calcular.
  function anova(groups) {
    const g = groups.filter((x) => x.length > 0);
    const k = g.length;
    const N = g.reduce((s, x) => s + x.length, 0);
    if (k < 2 || N - k < 1) return null;

    const all = [].concat(...g);
    const grand = mean(all);
    const ssb = g.reduce((s, x) => s + x.length * (mean(x) - grand) ** 2, 0);
    const ssw = g.reduce((s, x) => {
      const m = mean(x);
      return s + x.reduce((t, v) => t + (v - m) ** 2, 0);
    }, 0);

    const d1 = k - 1;
    const d2 = N - k;
    if (ssw === 0) return { F: ssb === 0 ? 0 : Infinity, p: ssb === 0 ? 1 : 0, d1, d2 };

    const F = (ssb / d1) / (ssw / d2);
    return { F, p: fPValue(F, d1, d2), d1, d2 };
  }


  /* ---------- 3. IVG (Maguire, 1962) ----------
     IVG = soma de (novas germinadas ÷ dias desde a semeadura).
     cumulative: germinadas acumuladas em cada contagem (null = não contou).
     days:       dia de cada contagem. */
  function ivg(cumulative, days) {
    let previous = 0;
    let total = 0;
    cumulative.forEach((value, i) => {
      if (value === null || value === undefined) return;
      total += Math.max(0, value - previous) / days[i];
      previous = Math.max(previous, value);
    });
    return total;
  }

  const api = { mean, sd, anova, fPValue, ivg };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.Stats = api;

})(typeof window !== "undefined" ? window : globalThis);
