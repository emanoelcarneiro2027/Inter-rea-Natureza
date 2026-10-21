/* =====================================================
   GUIA ETNOBOTÂNICO DE CAMAÇARI – lógica
   Depende de stats.js e data.js (carregados antes).

   Índice:
   1.  Utilitários e estado
   2.  Telas (roteador por hash)
   3.  Diagrama da bomba
   4.  Espécies (catálogo e ficha)
   5.  Bomba de sementes (formulações, passos, montador, calculadora)
   6.  Resultados (ensaios publicados e área da equipe)
   7.  Dispersão (listas e fichas da área)
   8.  Sobre (registros, equipe, fontes)
   9.  Eventos e inicialização
   ===================================================== */
"use strict";


/* ---------- 1. UTILITÁRIOS E ESTADO ---------- */
const STORE = {
  theme: "gb-tema",
  confirmed: "gb-confirmadas",
  mix: "gb-mistura",
  checks: "gb-listas",
  lab: "gb-laboratorio",
  areas: "gb-areas"
};
const SCREENS = ["inicio", "especies", "saberes", "resultados", "dispersao", "sobre"];

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const normalize = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const plural = (n, one, many) => (n === 1 ? one : many);
const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
const fmt = (n, d = 1) => (Number.isFinite(n)
  ? n.toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d })
  : "–");

// Leitura e escrita protegidas: o site funciona mesmo sem armazenamento
function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch (e) { return fallback; }
}
function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* ignora */ }
}

const findSpecies = (id) => SPECIES.find((s) => s.id === id);
const findFormulation = (id) => FORMULATIONS.find((f) => f.id === id);

let toastTimer;
function toast(message) {
  const el = $("toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2800);
}

const state = {
  tag: "Todas",
  fit: "all",
  search: "",
  openId: null,
  confirmed: new Set(load(STORE.confirmed, []).filter((id) => findSpecies(id))),
  mix: new Set(load(STORE.mix, []).filter((id) => findSpecies(id) && findSpecies(id).fit > 0)),
  checks: load(STORE.checks, {}),
  records: Array.isArray(load(STORE.lab, [])) ? load(STORE.lab, []) : [],
  areas: Array.isArray(load(STORE.areas, [])) ? load(STORE.areas, []) : [],
  labTab: "ger",
  labMetric: { res: "h", ret: "cap", ger: "pct" },
  labSpecies: "all",
  preview: false,          // prévia da equipe: mostra também os dados salvos neste navegador
  lastFocus: null
};


/* ---------- 2. TELAS ---------- */
function applyScreen(id) {
  const screen = SCREENS.includes(id) ? id : "inicio";
  document.querySelectorAll(".screen").forEach((el) => el.classList.toggle("active", el.id === screen));
  document.querySelectorAll(".nav-link[data-go]").forEach((btn) => {
    const active = btn.dataset.go === screen;
    btn.classList.toggle("active", active);
    if (active) btn.setAttribute("aria-current", "page");
    else btn.removeAttribute("aria-current");
  });
  if (screen === "especies") renderSpecies();
  if (screen === "dispersao") renderBuilder();
  window.scrollTo(0, 0);
}

function showScreen(id) {
  try {
    if (location.hash.slice(1) === id) applyScreen(id);
    else location.hash = id; // o evento hashchange faz o resto (e o botão voltar funciona)
  } catch (e) { applyScreen(id); }
}


/* ---------- 3. DIAGRAMA DA BOMBA ----------
   Cada camada é clicável (e acessível por teclado). */
const BIOCHAR_SPOTS = [
  [10, 108], [35, 92], [62, 118], [88, 100], [115, 110], [140, 95], [165, 120], [192, 102],
  [218, 90], [245, 112], [270, 98], [296, 116], [322, 94], [348, 108], [25, 82], [205, 84]
];
const MICROBE_SPOTS = [0, 45, 90, 135, 180, 225, 270, 315];

function polar(angle, radius) {
  const a = (angle * Math.PI) / 180;
  return [200 + radius * Math.cos(a), 200 + radius * Math.sin(a)];
}

function diagramSvg() {
  const dots = BIOCHAR_SPOTS.map(([angle, radius], i) => {
    const [x, y] = polar(angle, radius);
    const w = 8 + (i % 3) * 3;
    const h = 6 + (i % 2) * 3;
    return `<rect class="dotr f-char" x="${(x - w / 2).toFixed(1)}" y="${(y - h / 2).toFixed(1)}" width="${w}" height="${h}" rx="2" transform="rotate(${i * 37} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
  }).join("");

  const microbes = MICROBE_SPOTS.map((angle) => {
    const [x, y] = polar(angle, 44);
    return `<circle class="microbe" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.2"/>`;
  }).join("");

  const layerAttrs = (id) => `class="layer" data-layer="${id}" tabindex="0" role="button" aria-label="${LAYERS[id].title}"`;

  return `
    <svg class="bomb-svg" viewBox="0 0 400 400" role="group" aria-label="Corte de uma bomba de sementes, em camadas">
      <g ${layerAttrs("argila")}>
        <circle class="ring f-clay" cx="200" cy="200" r="176"/>
        <path class="crack" d="M70 120 q18 8 22 26 M318 96 q-14 14 -10 30 M338 262 q-16 -6 -26 4 M96 318 q10 -14 28 -14"/>
      </g>
      <g ${layerAttrs("humus")}>
        <circle class="ring f-humus" cx="200" cy="200" r="132"/>
      </g>
      <g ${layerAttrs("biochar")}>${dots}</g>
      <g ${layerAttrs("mucilagem")}>
        <circle class="ring f-gel" cx="200" cy="200" r="66"/>
      </g>
      <g ${layerAttrs("semente")}>
        <ellipse class="ring f-seed" cx="200" cy="200" rx="18" ry="27" transform="rotate(-25 200 200)"/>
        ${microbes}
      </g>
    </svg>
    <div class="layer-buttons" role="group" aria-label="Camadas da bomba">
      ${Object.keys(LAYERS).map((id) => `<button class="chip" data-layer-btn="${id}">${LAYERS[id].title.split(" (")[0]}</button>`).join("")}
    </div>
    <div class="layer-info" aria-live="polite"><p class="muted">Escolha uma camada, no desenho ou nos botões, para ver o que ela faz e em qual teste entra.</p></div>`;
}

function initDiagram(root) {
  root.innerHTML = diagramSvg();
  const svg = root.querySelector(".bomb-svg");
  const info = root.querySelector(".layer-info");
  let active = null;

  function select(id) {
    active = active === id ? null : id;
    svg.classList.toggle("has-active", active !== null);
    root.querySelectorAll("[data-layer]").forEach((g) => g.classList.toggle("on", g.dataset.layer === active));
    root.querySelectorAll("[data-layer-btn]").forEach((b) => b.classList.toggle("on", b.dataset.layerBtn === active));
    info.innerHTML = active
      ? `<h4>${LAYERS[active].title}</h4><p>${LAYERS[active].text}</p><p class="test">${LAYERS[active].test}</p>`
      : '<p class="muted">Escolha uma camada, no desenho ou nos botões, para ver o que ela faz e em qual teste entra.</p>';
  }

  root.addEventListener("click", (e) => {
    const layer = e.target.closest("[data-layer]");
    const btn = e.target.closest("[data-layer-btn]");
    if (layer) select(layer.dataset.layer);
    else if (btn) select(btn.dataset.layerBtn);
  });
  root.addEventListener("keydown", (e) => {
    const layer = e.target.closest("[data-layer]");
    if (layer && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); select(layer.dataset.layer); }
  });
}


/* ---------- 4. ESPÉCIES ---------- */
const TILE_CLASS = { "Pioneira": "pioneira", "Restinga e Mata": "restinga", "Frutífera nativa": "fruta", "PANC": "panc", "Uso tradicional": "fruta", "Introduzida": "panc" };
const tileClass = (sp) => TILE_CLASS[sp.tags[0]] || "restinga";

function photoOf(sp) {
  const ph = (typeof PHOTOS !== "undefined" && PHOTOS[sp.id]) || null;
  return ph && ph.src ? ph : null;
}
const photoImg = (sp, ph, big = false) => `<img src="${esc(ph.src)}" alt="${esc(ph.alt || sp.name)}" loading="lazy" style="${big ? "display:block;width:100%;max-height:18rem;" : "position:absolute;inset:0;width:100%;height:100%;"}object-fit:cover" onerror="this.closest('.tile, .modal-photo').classList.remove('has-photo');this.remove()">`;

function visibleSpecies() {
  const query = normalize(state.search.trim());
  return SPECIES.filter((sp) => {
    const originTag = ORIGIN_LABELS[sp.origin];
    const text = normalize([sp.name, sp.sci, sp.family, originTag, sp.tags.join(" "), sp.culture].join(" "));
    return (
      (state.tag === "Todas" || sp.tags.includes(state.tag) || originTag === state.tag) &&
      (state.fit === "all" || (state.fit === "sel" ? SELECTED.includes(sp.id) : state.fit === "good" ? sp.fit >= 2 : sp.fit === 0)) &&
      text.includes(query)
    );
  });
}

function fitBars(fit) {
  return `<span class="fit-bars" aria-hidden="true">${[1, 2, 3].map((n) => `<i class="${n <= fit ? "on" : ""}"></i>`).join("")}</span>`;
}

function mixButton(sp, small = true) {
  const cls = `btn${small ? " small" : ""}`;
  if (sp.fit === 0) return `<button class="${cls}" disabled>Fora da bomba</button>`;
  const inMix = state.mix.has(sp.id);
  return `<button class="${cls}${inMix ? " on" : ""}" data-mix="${sp.id}" aria-pressed="${inMix}">${inMix ? "Na mistura (remover)" : "Adicionar à mistura"}</button>`;
}

function renderSpecies() {
  $("tagFilters").innerHTML = TAGS.map((tag) =>
    `<button class="chip ${state.tag === tag ? "on" : ""}" data-tag="${tag}" aria-pressed="${state.tag === tag}">${tag}</button>`).join("");

  const list = visibleSpecies();
  const filtered = state.tag !== "Todas" || state.fit !== "all" || state.search.trim() !== "";
  $("speciesCount").textContent = `${list.length} ${plural(list.length, "espécie", "espécies")}`;
  $("confirmCount").textContent = `${state.confirmed.size} de ${SPECIES.length} com ocorrência confirmada em Camaçari`;
  $("clearSpecies").hidden = !filtered;

  $("speciesGrid").innerHTML = list.length ? list.map((sp) => `
    <article class="card">
      <button class="card-open" data-open="${sp.id}" aria-label="Abrir a ficha de ${esc(sp.name)}">
        <span class="tile ${tileClass(sp)}${photoOf(sp) ? " has-photo" : ""}">
          ${photoOf(sp) ? photoImg(sp, photoOf(sp)) : ""}<span class="tile-letter" aria-hidden="true">${esc(sp.name[0])}</span>
          <span class="tile-sci">${esc(sp.sci)}</span>
        </span>
        <span class="card-body">
          <span class="card-name">${esc(sp.name)}</span>
          <span class="card-meta">${esc([ORIGIN_LABELS[sp.origin], ...sp.tags].join(", "))}</span>
          ${SELECTED.includes(sp.id) ? '<span class="selected-mark">Selecionada para o ensaio</span>' : ""}
          <span class="fit ${sp.fit === 0 ? "zero" : ""}">${fitBars(sp.fit)}${FIT_LABELS[sp.fit]}</span>
        </span>
      </button>
      <div class="card-actions">${mixButton(sp)}</div>
    </article>`).join("")
    : `<div class="empty">Nenhuma espécie com esses filtros.<br><button class="btn" data-clear-species>Limpar filtros</button></div>`;
}

function clearSpeciesFilters() {
  state.tag = "Todas";
  state.fit = "all";
  state.search = "";
  $("speciesSearch").value = "";
  $("fitSelect").value = "all";
  renderSpecies();
}

function toggleMix(id) {
  const sp = findSpecies(id);
  if (!sp || sp.fit === 0) return;
  if (state.mix.has(id)) { state.mix.delete(id); toast(`${sp.name} saiu da mistura.`); }
  else { state.mix.add(id); toast(`${sp.name} entrou na mistura. Veja o resultado em Bomba de sementes.`); }
  save(STORE.mix, [...state.mix]);
  renderSpecies();
  renderBuilder();
  if (state.openId) renderSpeciesModal(state.openId);
}

function toggleConfirmed(id, checked) {
  if (checked) state.confirmed.add(id); else state.confirmed.delete(id);
  save(STORE.confirmed, [...state.confirmed]);
  renderSpecies();
}

/* Ficha da espécie (janela) */
function renderSpeciesModal(id) {
  const sp = findSpecies(id);
  const confirmed = state.confirmed.has(id);
  $("modalContent").innerHTML = `
    <div class="modal-head ${tileClass(sp)}">
      <h3 id="modalTitle">${esc(sp.name)}</h3>
      <p class="sci">${esc(sp.sci)}</p>
      <p class="family">Família ${esc(sp.family)}</p>
    </div>
    ${photoOf(sp) ? `<figure class="modal-photo has-photo" style="margin:0">${photoImg(sp, photoOf(sp), true)}${photoOf(sp).credit ? `<figcaption>${esc(photoOf(sp).credit)}</figcaption>` : ""}</figure>` : ""}
    <div class="modal-body">
      <div class="tag-list"><span class="tag origin ${sp.origin}">${esc(ORIGIN_LABELS[sp.origin])}</span>${SELECTED.includes(sp.id) ? '<span class="tag sel">Selecionada para o ensaio</span>' : ""}${sp.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}${sp.roles.map((r) => `<span class="tag">${esc(ROLE_LABELS[r])}</span>`).join("")}</div>
      <section><h4>Origem</h4><p>${esc(sp.originNote)}</p></section>
      <section><h4>Importância ecológica</h4><p>${esc(sp.ecology)}</p></section>
      <section><h4>Importância cultural</h4><p>${esc(sp.culture)}</p></section>
      <section><h4>Semente</h4><ul>${sp.seed.map((s) => `<li>${esc(s)}</li>`).join("")}</ul></section>
      <section><h4>Na bomba de sementes: ${FIT_LABELS[sp.fit].toLowerCase()}</h4><p>${esc(sp.bomb)}</p></section>
      ${sp.caution ? `<section class="caution"><strong>Cuidado.</strong> ${esc(sp.caution)}</section>` : ""}
      <section class="confirm">
        <label><input type="checkbox" data-confirm="${sp.id}" ${confirmed ? "checked" : ""}> Ocorrência confirmada em Camaçari</label>
        <p>Marque depois de conferir no speciesLink (registros por município) ou na Flora e Funga do Brasil. Enquanto não marcar, trate como pendente.</p>
      </section>
      <div class="modal-actions">${mixButton(sp, false)}</div>
    </div>`;
}

function lockScroll() {
  document.body.classList.toggle("lock", $("modal").classList.contains("open"));
}

function openSpecies(id) {
  const wasOpen = $("modal").classList.contains("open");
  if (!wasOpen) state.lastFocus = document.activeElement;
  state.openId = id;
  renderSpeciesModal(id);
  $("modal").classList.add("open");
  $("modalContent").scrollTop = 0;
  lockScroll();
  if (!wasOpen) $("closeBtn").focus();
}

function closeSpecies() {
  state.openId = null;
  $("modal").classList.remove("open");
  lockScroll();
  const el = state.lastFocus;
  if (el && document.contains(el) && el.offsetParent !== null) el.focus();
}

function stepSpecies(step) {
  const visible = visibleSpecies();
  const list = visible.some((s) => s.id === state.openId) ? visible : SPECIES;
  const current = list.findIndex((s) => s.id === state.openId);
  openSpecies(list[(current + step + list.length) % list.length].id);
}


/* ---------- 5. BOMBA DE SEMENTES ---------- */
function renderFormulations() {
  $("formulationList").innerHTML = FORMULATIONS.map((f) => `
    <article class="formulation">
      <h4><span class="code">${f.id}</span>${esc(f.name)}</h4>
      <p>${esc(f.desc)}</p>
      ${f.parts.length ? `<ul class="parts">
        ${f.parts.map(([name, n]) => `<li><span>${esc(name)}</span><span>${fmt(n, n % 1 ? 1 : 0)} ${plural(n, "parte", "partes")}</span></li>`).join("")}
        ${f.liquid ? `<li><span>Líquido</span><span>${esc(f.liquid)}</span></li>` : '<li><span>Líquido</span><span>Água, até moldar</span></li>'}
        ${f.extra ? `<li class="extra"><span>${esc(f.extra)}</span><span></span></li>` : ""}
      </ul>` : ""}
    </article>`).join("");
}

function renderSteps() {
  $("stepList").innerHTML = BOMB_STEPS.map((s) => `<li><h4>${esc(s.title)}</h4><p>${esc(s.text)}</p></li>`).join("");
}

/* Montador de mistura */
function renderBuilder() {
  $("mixPicker").innerHTML = SPECIES.map((sp) => {
    const off = sp.fit === 0;
    return `<label class="mix-item ${off ? "disabled" : ""}">
      <input type="checkbox" data-mixcheck="${sp.id}" ${state.mix.has(sp.id) ? "checked" : ""} ${off ? "disabled" : ""}>
      <span>${esc(sp.name)}<small>${esc(sp.sci)}${off ? ". Fora da bomba: propaga-se por outro caminho" : ""}</small></span>
    </label>`;
  }).join("");

  const chosen = [...state.mix].map(findSpecies).filter(Boolean);
  if (!chosen.length) {
    $("mixReport").innerHTML = "<h4>Sua mistura</h4><p class=\"muted\">Marque ao menos uma espécie para ver as funções cobertas e os cuidados.</p>";
    return;
  }

  const roles = MAIN_ROLES.map((role) => {
    const who = chosen.filter((sp) => sp.roles.includes(role)).map((sp) => sp.name);
    return who.length
      ? `<li class="yes">${ROLE_LABELS[role]}: ${esc(who.join(", "))}</li>`
      : `<li class="no">Falta: ${ROLE_LABELS[role].toLowerCase()}</li>`;
  }).join("");

  const alerts = [];
  chosen.forEach((sp) => {
    const flags = sp.flags || [];
    if (flags.includes("fresca")) alerts.push(`${sp.name}: semente recalcitrante. Use fresca e semeie a bomba logo.`);
    if (flags.includes("dormencia")) alerts.push(`${sp.name}: quebre a dormência antes de moldar (escarificação ou água).`);
    if (flags.includes("luz")) alerts.push(`${sp.name}: a semente precisa de luz. Camada fina de argila ou semente na superfície.`);
    if (flags.includes("grande")) alerts.push(`${sp.name}: semente grande. Faça a bomba maior ou semeie direto.`);
  });
  const freshCount = chosen.filter((sp) => (sp.flags || []).includes("fresca")).length;
  if (freshCount && freshCount < chosen.length) {
    alerts.push("A mistura junta sementes que não podem ser guardadas com outras que podem. Faça o lote no dia da colheita.");
  }
  if (chosen.length > 5) {
    alerts.push("Mais de 5 espécies diminui as repetições por espécie no experimento. Considere reduzir.");
  }

  $("mixReport").innerHTML = `
    <h4>Sua mistura: ${chosen.length} ${plural(chosen.length, "espécie", "espécies")}</h4>
    <ul class="role-list">${roles}</ul>
    <h4>Cuidados com as sementes</h4>
    ${alerts.length ? `<ul class="alert-list">${alerts.map((a) => `<li>${esc(a)}</li>`).join("")}</ul>` : '<p class="muted">Nenhum cuidado especial para estas espécies.</p>'}`;
}

/* Calculadora de lote */
function parseNumber(text) {
  const clean = String(text).trim().replace(",", ".");
  if (clean === "") return null;
  const n = Number(clean);
  return Number.isFinite(n) ? n : null;
}

function renderCalc() {
  const f = findFormulation($("calcFormulation").value);
  const count = parseNumber($("calcCount").value);
  const diameter = parseNumber($("calcDiameter").value);
  const seeds = parseNumber($("calcSeeds").value);
  const out = $("calcResult");

  if (!f || !Number.isInteger(count) || count < 1 || count > 10000) { out.innerHTML = '<p class="muted">Informe um número de bombas inteiro, entre 1 e 10.000.</p>'; return; }
  if (diameter === null || diameter < 1 || diameter > 10) { out.innerHTML = '<p class="muted">Informe um diâmetro entre 1 e 10 cm.</p>'; return; }
  if (!Number.isInteger(seeds) || seeds < 0 || seeds > 50) { out.innerHTML = '<p class="muted">Informe um número de sementes por bomba entre 0 e 50.</p>'; return; }
  if (!f.parts.length) { out.innerHTML = '<p class="muted">O controle não usa bomba: semeie as sementes direto no substrato.</p>'; return; }

  const each = (4 / 3) * Math.PI * (diameter / 2) ** 3;     // cm³ = mL
  const total = each * count * 1.15;                         // 15% de folga para perdas
  const sumParts = f.parts.reduce((s, [, n]) => s + n, 0);

  out.innerHTML = `
    <div class="table-wrap"><table class="table">
      <thead><tr><th scope="col">Item</th><th scope="col" class="num">Quantidade</th></tr></thead>
      <tbody>
        ${f.parts.map(([name, n]) => `<tr><td>${esc(name)}</td><td class="num">${fmt((total * n) / sumParts, 0)} mL</td></tr>`).join("")}
        <tr><td>Líquido</td><td class="num">${esc(f.liquid || "água")}, até moldar</td></tr>
        <tr><td>Sementes</td><td class="num">${count * seeds} no total</td></tr>
      </tbody>
    </table></div>
    <p class="muted">Cada bomba tem cerca de ${fmt(each, 0)} mL. As quantidades já incluem 15% de folga para perdas. A semente ocupa volume, então ajuste na prática.</p>`;
}


/* ---------- 6. LABORATÓRIO ----------
   Três ensaios: resistência mecânica, retenção hídrica e germinação.
   Os dados ficam no navegador. Nada é preenchido pelo site. */
const COUNT_DAYS = [7, 14, 21, 28];

const TESTS = {
  res: {
    label: "Resistência mecânica",
    protocol: [
      "Solte cada bomba seca de alturas crescentes (0,5 m, 1,0 m, 1,5 m, 2,0 m) sobre piso duro.",
      "Registre a maior altura em que a bomba não fragmentou.",
      "Opcional: coloque massas sobre a bomba até ela quebrar e registre a massa suportada."
    ],
    metrics: {
      h: { label: "Altura máxima sem fragmentar", unit: "m", decimals: 2 },
      m: { label: "Massa suportada", unit: "kg", decimals: 2 }
    }
  },
  ret: {
    label: "Retenção hídrica",
    protocol: [
      "Pese a bomba seca ao ar (massa seca).",
      "Sature a bomba (imersão por tempo fixo, igual para todas) e pese de novo (massa saturada).",
      "Deixe em ambiente à sombra e pese após 24, 48 e 72 horas. Todas as pesagens em gramas, na mesma balança."
    ],
    metrics: {
      cap: { label: "Capacidade de retenção", unit: "% da massa seca", decimals: 1 },
      r24: { label: "Água retida após 24 h", unit: "% da água absorvida", decimals: 1 },
      r48: { label: "Água retida após 48 h", unit: "% da água absorvida", decimals: 1 },
      r72: { label: "Água retida após 72 h", unit: "% da água absorvida", decimals: 1 }
    }
  },
  ger: {
    label: "Germinação",
    protocol: [
      "Semeie um grupo de bombas (ou de sementes, no controle) por repetição, com mesmo substrato, luz e rega.",
      "Conte as plântulas emergidas aos 7, 14, 21 e 28 dias. Registre o número acumulado, não o do dia.",
      "Uma repetição é um grupo independente (uma bandeja, por exemplo). Quanto mais repetições, mais confiável a comparação."
    ],
    metrics: {
      pct: { label: "Germinação", unit: "%", decimals: 1 },
      ivg: { label: "IVG (índice de velocidade de germinação)", unit: "", decimals: 2 }
    }
  }
};

// Calcula as métricas de um registro. Devolve null nas que faltam dados.
function computeRecord(r) {
  if (r.test === "res") return { h: r.h, m: r.m === undefined ? null : r.m };

  if (r.test === "ret") {
    const absorbed = r.msat - r.ms;
    const kept = (m) => (m === null || m === undefined || absorbed <= 0 ? null : ((m - r.ms) / absorbed) * 100);
    return { cap: (absorbed / r.ms) * 100, r24: kept(r.m24), r48: kept(r.m48), r72: kept(r.m72) };
  }

  const counts = COUNT_DAYS.map((d) => (r["g" + d] === undefined ? null : r["g" + d]));
  const known = counts.filter((c) => c !== null);
  const final = known.length ? Math.max(...known) : null;
  return {
    pct: final === null ? null : (final / r.n) * 100,
    ivg: known.length ? Stats.ivg(counts, COUNT_DAYS) : null
  };
}

// Registros que o guia mostra: os publicados em data.js (RESULTS).
// Na prévia da equipe entram também os salvos neste navegador.
function viewRecords() {
  if (!state.preview) return RESULTS;
  const published = new Set(RESULTS.map((r) => r.id));
  return RESULTS.concat(state.records.filter((r) => !published.has(r.id)));
}

function labGroups(test, metric) {
  const records = viewRecords();
  return FORMULATIONS.filter((f) => f.tests.includes(test)).map((f) => {
    const values = records
      .filter((r) => r.test === test && r.f === f.id && (test !== "ger" || state.labSpecies === "all" || r.species === state.labSpecies))
      .map((r) => computeRecord(r)[metric])
      .filter((v) => v !== null && v !== undefined && Number.isFinite(v));
    return { id: f.id, short: f.short, values, n: values.length, mean: values.length ? Stats.mean(values) : NaN, sd: Stats.sd(values) };
  });
}

function saveRecords() { save(STORE.lab, state.records); }

/* --- gráfico de barras com desvio-padrão e pontos das repetições --- */
// Escolhe um passo "redondo" (1, 2, 2,5, 5 ou 10 × potência de 10) para ~4 divisões
// e um topo que deixe uma pequena folga acima do maior valor.
function niceScale(max) {
  const safe = Math.max(max, 1e-9);
  const raw = safe / 4;
  const exp = Math.floor(Math.log10(raw));
  const f = raw / 10 ** exp;
  const step = [1, 2, 2.5, 5, 10].find((n) => n >= f - 1e-9) * 10 ** exp;
  const top = Math.ceil((safe * 1.05) / step) * step;
  return { top, step, ticks: Math.round(top / step) };
}

function barChartSvg(groups, meta) {
  const W = 640, H = 330, m = { l: 58, r: 16, t: 34, b: 58 };
  const iw = W - m.l - m.r;
  const ih = H - m.t - m.b;
  const maxValue = Math.max(...groups.map((g) => Math.max(g.mean + (Number.isFinite(g.sd) ? g.sd : 0), ...g.values)));
  const { top, step, ticks } = niceScale(maxValue);
  const y = (v) => m.t + ih - (v / top) * ih;
  const band = iw / groups.length;
  const bw = Math.min(58, band * 0.58);
  const tickDecimals = step >= 1 ? 0 : step >= 0.1 ? 2 : 3;

  let svg = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Gráfico de barras: ${esc(meta.label)} por formulação. Os dados completos estão na tabela abaixo.">`;
  svg += `<text class="ax" x="${m.l}" y="14">${esc(meta.label)}${meta.unit ? ` (${esc(meta.unit)})` : ""}</text>`;

  for (let i = 0; i <= ticks; i++) {
    const v = step * i;
    svg += `<line class="${i === 0 ? "baseline" : "gridline"}" x1="${m.l}" x2="${W - m.r}" y1="${y(v)}" y2="${y(v)}"/>`;
    svg += `<text class="ax" x="${m.l - 8}" y="${y(v) + 4}" text-anchor="end">${fmt(v, tickDecimals)}</text>`;
  }

  groups.forEach((g, i) => {
    const cx = m.l + band * i + band / 2;
    const x0 = cx - bw / 2;
    const yTop = y(g.mean);
    const yBase = y(0);
    const hBar = yBase - yTop;
    const r = Math.min(4, hBar / 2);
    const tip = `${g.id} (${g.short}): média ${fmt(g.mean, meta.decimals)} ${meta.unit}, desvio-padrão ${fmt(g.sd, meta.decimals)}, n = ${g.n}`;

    svg += `<g class="mark" tabindex="0" data-tip="${esc(tip)}" aria-label="${esc(tip)}">`;
    svg += hBar > 0.5
      ? `<path class="bar" d="M${x0} ${yBase} V${yTop + r} Q${x0} ${yTop} ${x0 + r} ${yTop} H${x0 + bw - r} Q${x0 + bw} ${yTop} ${x0 + bw} ${yTop + r} V${yBase} Z"/>`
      : `<rect class="bar" x="${x0}" y="${yBase - 2}" width="${bw}" height="2"/>`;

    if (Number.isFinite(g.sd)) {
      const lo = y(Math.max(0, g.mean - g.sd));
      const hi = y(g.mean + g.sd);
      svg += `<path class="err" d="M${cx} ${lo} V${hi} M${cx - 6} ${lo} H${cx + 6} M${cx - 6} ${hi} H${cx + 6}"/>`;
    }
    svg += "</g>";

    g.values.forEach((v, k) => {
      const jitter = ((k % 5) - 2) * 6;
      svg += `<circle class="dot mark" data-tip="${esc(`${g.id}, repetição ${k + 1}: ${fmt(v, meta.decimals)} ${meta.unit}`)}" cx="${cx + jitter}" cy="${y(v)}" r="3.6"/>`;
    });

    const labelY = Math.min(y(g.mean + (Number.isFinite(g.sd) ? g.sd : 0)), ...g.values.map(y)) - 8;
    svg += `<text class="ax-strong" x="${cx}" y="${Math.max(labelY, 26)}" text-anchor="middle">${fmt(g.mean, meta.decimals)}</text>`;
    svg += `<text class="ax-strong" x="${cx}" y="${H - 32}" text-anchor="middle">${g.id}</text>`;
    svg += `<text class="ax" x="${cx}" y="${H - 16}" text-anchor="middle">${esc(g.short)}</text>`;
  });

  return svg + "</svg>";
}

function anovaSentence(groups) {
  const withData = groups.filter((g) => g.n > 0);
  const result = Stats.anova(withData.map((g) => g.values));
  if (withData.length < 2) return "Para comparar, registre pelo menos duas formulações.";
  if (!result) return "Para calcular o teste, falta repetição: cada formulação precisa de mais de um valor em pelo menos um dos grupos.";

  const pText = result.p < 0.001 ? "p < 0,001" : `p = ${fmt(result.p, 3)}`;
  const base = `ANOVA de um fator: F(${result.d1}; ${result.d2}) = ${fmt(result.F, 2)}, ${pText}.`;
  const reading = result.p < 0.05
    ? "Há indício de que ao menos duas formulações diferem. O teste não diz quais: compare as médias e o desvio."
    : "Não dá para afirmar que as formulações diferem. Isso não prova que são iguais: com poucas repetições, o teste tem pouca força.";
  const small = withData.some((g) => g.n < 3) ? " Com menos de 3 repetições por formulação, trate o resultado como indício, não como conclusão." : "";
  return `${base} ${reading}${small}`;
}

const EMPTY_RESULTS = {
  ger: "Os resultados de germinação aparecem aqui depois que a equipe medir e publicar os ensaios. Serão mostrados a porcentagem de germinação e a velocidade (IVG) de cada formulação, com desvio-padrão e teste estatístico.",
  res: "Os resultados de resistência mecânica aparecem aqui depois dos ensaios.",
  ret: "Os resultados de retenção hídrica aparecem aqui depois dos ensaios."
};

function renderResultsBlock(test) {
  const el = $("results-" + test);
  if (!el) return;

  // Sem nenhuma medida deste ensaio: explica o que vai aparecer, sem inventar nada.
  if (!viewRecords().some((r) => r.test === test)) {
    el.innerHTML = `<div class="chart-empty">${EMPTY_RESULTS[test]}</div>`;
    return;
  }

  const metricKey = state.labMetric[test];
  const meta = TESTS[test].metrics[metricKey];
  const groups = labGroups(test, metricKey);
  const withData = groups.filter((g) => g.n > 0);

  const metricOptions = Object.entries(TESTS[test].metrics)
    .map(([key, mt]) => `<option value="${key}" ${key === metricKey ? "selected" : ""}>${esc(mt.label)}</option>`).join("");
  const speciesOptions = test === "ger"
    ? `<label>Espécie
         <select data-res-species>
           <option value="all">Todas</option>
           ${SPECIES.filter((s) => s.fit > 0).map((s) => `<option value="${s.id}" ${state.labSpecies === s.id ? "selected" : ""}>${esc(s.name)}</option>`).join("")}
         </select></label>` : "";

  let body;
  if (!withData.length) {
    body = '<div class="chart-empty">Nenhum registro com este filtro de espécie.</div>';
  } else {
    body = `
      <div class="chart">${barChartSvg(withData, meta)}<div class="tip" hidden></div></div>
      <p class="legend-note">Barras: média. Linha: desvio-padrão. Pontos: cada repetição.</p>
      <div class="table-wrap"><table class="table">
        <thead><tr><th scope="col">Formulação</th><th scope="col" class="num">n</th><th scope="col" class="num">Média</th><th scope="col" class="num">Desvio-padrão</th><th scope="col" class="num">Mínimo a máximo</th></tr></thead>
        <tbody>${withData.map((g) => `<tr>
          <td>${g.id}, ${esc(g.short)}</td><td class="num">${g.n}</td><td class="num">${fmt(g.mean, meta.decimals)}</td>
          <td class="num">${fmt(g.sd, meta.decimals)}</td><td class="num">${fmt(Math.min(...g.values), meta.decimals)} a ${fmt(Math.max(...g.values), meta.decimals)}</td></tr>`).join("")}
        </tbody></table></div>
      <p class="stat-text strong">${esc(anovaSentence(groups))}</p>
      <p class="stat-text muted">Barras de erro e valor p medem a variação entre repetições, não garantem o resultado no campo. Chuva, solo e animais mudam tudo fora do laboratório.</p>`;
  }

  el.innerHTML = `
    <div class="result-head">
      <label>Métrica <select data-res-metric="${test}">${metricOptions}</select></label>
      ${speciesOptions}
    </div>${body}`;
}

function renderLabResults() {
  ["ger", "res", "ret"].forEach(renderResultsBlock);
}

/* --- registros (tabela) --- */
function describeRecord(r) {
  if (r.test === "res") return `altura ${fmt(r.h, 2)} m${r.m !== undefined && r.m !== null ? `, massa ${fmt(r.m, 2)} kg` : ""}`;
  if (r.test === "ret") return `seca ${fmt(r.ms, 1)} g, saturada ${fmt(r.msat, 1)} g`;
  const c = computeRecord(r);
  return `${r.n} sementes, ${fmt(c.pct, 1)}% germinadas`;
}

function renderLabRecords() {
  const recs = state.records.filter((r) => r.test === state.labTab);
  $("labRecords").innerHTML = recs.length ? `
    <h4>Registros deste ensaio (${recs.length})</h4>
    <div class="table-wrap"><table class="table">
      <thead><tr><th scope="col">Formulação</th><th scope="col">Repetição</th><th scope="col">Medidas</th><th scope="col"><span class="sr">Ação</span></th></tr></thead>
      <tbody>${recs.map((r) => {
        const sp = r.species ? findSpecies(r.species) : null;
        return `<tr>
          <td>${esc(r.f)}${r.demo ? '<span class="tag-demo">exemplo</span>' : ""}</td>
          <td>${esc(r.rep || "–")}${sp ? `, ${esc(sp.name)}` : ""}</td>
          <td>${esc(describeRecord(r))}</td>
          <td><button class="link-btn" data-del="${esc(r.id)}">Excluir</button></td></tr>`;
      }).join("")}</tbody></table></div>` : "";
}

function renderLabBanner() {
  const demo = state.records.some((r) => r.demo);
  $("labBanner").innerHTML = demo
    ? `<div class="banner">Há dados de exemplo, fictícios, misturados aos registros. Eles servem só para testar os gráficos e nunca devem ser publicados.<button class="link-btn" data-demo-remove>Remover exemplos</button></div>`
    : "";
  $("resBanner").innerHTML = state.preview
    ? `<div class="banner">Prévia da equipe: os gráficos incluem dados salvos neste navegador, que os visitantes não veem.<button class="link-btn" data-preview-toggle>Voltar à versão publicada</button></div>`
    : "";
  const btn = $("previewBtn");
  if (btn) {
    btn.textContent = state.preview ? "Voltar à versão publicada" : "Ver prévia no guia";
    btn.classList.toggle("on", state.preview);
  }
}

/* --- formulário de cada ensaio --- */
function formField(id, label, hint = "") {
  return `<label>${label}<input type="text" id="${id}" inputmode="decimal" autocomplete="off">${hint ? `<span class="hint">${hint}</span>` : ""}</label>`;
}

function renderLabForm() {
  const test = state.labTab;
  const formOptions = FORMULATIONS.filter((f) => f.tests.includes(test))
    .map((f) => `<option value="${f.id}">${f.id}, ${esc(f.short)}</option>`).join("");

  let fields = "";
  if (test === "res") {
    fields = formField("f_h", "Altura máxima sem fragmentar (m)") + formField("f_m", "Massa suportada (kg), opcional");
  } else if (test === "ret") {
    fields = formField("f_ms", "Massa seca (g)") + formField("f_msat", "Massa saturada (g)")
      + formField("f_m24", "Massa após 24 h (g)", "Opcional") + formField("f_m48", "Massa após 48 h (g)", "Opcional")
      + formField("f_m72", "Massa após 72 h (g)", "Opcional");
  } else {
    fields = `<label class="wide">Espécie
        <select id="f_species"><option value="">Mistura ou sem especificar</option>
        ${SPECIES.filter((s) => s.fit > 0).map((s) => `<option value="${s.id}">${esc(s.name)}</option>`).join("")}</select></label>`
      + formField("f_n", "Sementes semeadas")
      + COUNT_DAYS.map((d) => formField("f_g" + d, `Acumuladas até o dia ${d}`, d === 7 ? "Preencha ao menos uma contagem" : "")).join("");
  }

  $("labForm").innerHTML = `
    <div class="protocol"><strong>Como medir</strong><ul>${TESTS[test].protocol.map((p) => `<li>${esc(p)}</li>`).join("")}</ul></div>
    <form class="lab-form" id="labFormEl" novalidate>
      <label>Formulação<select id="f_f">${formOptions}</select></label>
      <label>Nome da repetição<input type="text" id="f_rep" maxlength="40" placeholder="Ex.: bandeja 1"></label>
      ${fields}
      <p class="form-error" id="labError" role="alert"></p>
      <button class="btn primary wide" type="submit">Salvar medida</button>
    </form>`;
}

function readLabForm() {
  const test = state.labTab;
  const val = (id) => parseNumber($(id).value);
  const base = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, test, f: $("f_f").value, rep: $("f_rep").value.trim() };
  const fail = (message) => ({ error: message });
  const positive = (n) => n !== null && n > 0;

  if (test === "res") {
    const h = val("f_h"), m = val("f_m");
    if (!positive(h)) return fail("Informe a altura máxima, maior que zero.");
    if ($("f_m").value.trim() !== "" && (m === null || m < 0)) return fail("A massa suportada deve ser um número maior ou igual a zero.");
    const rec = { ...base, h };
    if (m !== null) rec.m = m;
    return { rec };
  }

  if (test === "ret") {
    const ms = val("f_ms"), msat = val("f_msat");
    if (!positive(ms) || !positive(msat)) return fail("Informe a massa seca e a massa saturada, em gramas.");
    if (msat <= ms) return fail("A massa saturada precisa ser maior que a massa seca.");
    const rec = { ...base, ms, msat };
    let last = msat;
    for (const key of ["m24", "m48", "m72"]) {
      const raw = $("f_" + key).value.trim();
      if (raw === "") continue;
      const v = val("f_" + key);
      if (!positive(v)) return fail("As massas das pesagens devem ser números maiores que zero.");
      if (v > last) return fail("As massas devem diminuir com o tempo, pela secagem. Confira as pesagens.");
      rec[key] = v;
      last = v;
    }
    return { rec };
  }

  const n = val("f_n");
  if (!Number.isInteger(n) || n < 1) return fail("Informe o número de sementes semeadas (inteiro, 1 ou mais).");
  const rec = { ...base, n, species: $("f_species").value };
  let previous = 0;
  let any = false;
  for (const d of COUNT_DAYS) {
    const raw = $("f_g" + d).value.trim();
    if (raw === "") continue;
    const g = val("f_g" + d);
    if (!Number.isInteger(g) || g < 0) return fail("As contagens devem ser números inteiros, a partir de zero.");
    if (g > n) return fail("Não pode haver mais plântulas que sementes semeadas.");
    if (g < previous) return fail("As contagens são acumuladas: cada uma deve ser igual ou maior que a anterior.");
    rec["g" + d] = g;
    previous = g;
    any = true;
  }
  if (!any) return fail("Preencha ao menos uma contagem de plântulas.");
  return { rec };
}

function submitLab(e) {
  e.preventDefault();
  const result = readLabForm();
  if (result.error) { $("labError").textContent = result.error; return; }
  state.records.push(result.rec);
  saveRecords();
  renderLabForm();
  renderLabRecords();
  renderLabResults();
  renderLabBanner();
  toast("Medida salva.");
}

/* --- abas --- */
function renderLabTabs() {
  $("labTabs").innerHTML = Object.entries(TESTS).map(([key, t]) =>
    `<button class="tab" role="tab" data-lab-tab="${key}" aria-selected="${state.labTab === key}">${t.label}</button>`).join("");
}

function setLabTab(tab) {
  state.labTab = tab;
  renderLabTabs();
  renderLabForm();
  renderLabRecords();
  renderLabResults();
}

/* --- exemplos fictícios e exportação --- */
function demoRecords() {
  const out = [];
  const add = (rec) => out.push({ ...rec, id: `demo-${out.length}`, demo: true });
  const ger = {
    F0: [[10, 2, 3, 4, 4], [10, 1, 3, 3, 4], [10, 2, 2, 3, 3], [10, 1, 2, 4, 4]],
    F1: [[10, 3, 5, 6, 6], [10, 2, 4, 5, 6], [10, 3, 4, 5, 5], [10, 2, 5, 6, 7]],
    F2: [[10, 4, 6, 7, 7], [10, 3, 5, 7, 8], [10, 4, 6, 6, 7], [10, 5, 6, 7, 8]],
    F3: [[10, 4, 7, 8, 8], [10, 5, 7, 8, 9], [10, 3, 6, 7, 8], [10, 4, 6, 8, 8]]
  };
  Object.entries(ger).forEach(([f, reps]) => reps.forEach(([n, g7, g14, g21, g28], i) =>
    add({ test: "ger", f, rep: `exemplo ${i + 1}`, species: "", n, g7, g14, g21, g28 })));
  const res = { F1: [0.5, 1.0, 0.5, 1.0], F2: [1.0, 1.0, 1.5, 1.0], F3: [1.5, 1.0, 1.5, 2.0] };
  Object.entries(res).forEach(([f, hs]) => hs.forEach((h, i) => add({ test: "res", f, rep: `exemplo ${i + 1}`, h })));
  const ret = {
    F1: [[30, 41, 38, 35, 33], [31, 42, 39, 36, 34], [30, 40, 37, 35, 33]],
    F2: [[30, 43, 40, 37, 35], [31, 44, 41, 38, 36], [30, 42, 40, 37, 35]],
    F3: [[30, 46, 44, 41, 39], [31, 47, 45, 42, 40], [30, 45, 43, 41, 39]]
  };
  Object.entries(ret).forEach(([f, reps]) => reps.forEach(([ms, msat, m24, m48, m72], i) =>
    add({ test: "ret", f, rep: `exemplo ${i + 1}`, ms, msat, m24, m48, m72 })));
  return out;
}

function csvEscape(v) {
  const s = String(v);
  return /[;"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function exportCsv() {
  const published = new Set(RESULTS.map((r) => r.id));
  const real = RESULTS.concat(state.records.filter((r) => !r.demo && !published.has(r.id)));
  if (!real.length) { toast("Ainda não há dados reais para exportar."); return; }

  const rows = [["ensaio", "formulacao", "especie", "repeticao", "variavel", "valor"]];
  const num = (v) => (typeof v === "number" ? String(v).replace(".", ",") : v);
  real.forEach((r) => {
    const sp = r.species ? findSpecies(r.species).name : "";
    const push = (name, v) => { if (v !== null && v !== undefined && Number.isFinite(v)) rows.push([TESTS[r.test].label, r.f, sp, r.rep || "", name, num(v)]); };
    const raw = ["h", "m", "ms", "msat", "m24", "m48", "m72", "n", "g7", "g14", "g21", "g28"];
    raw.forEach((k) => push(k, r[k]));
    const c = computeRecord(r);
    Object.keys(c).forEach((k) => push(`${TESTS[r.test].metrics[k].label} (${TESTS[r.test].metrics[k].unit || "índice"})`, c[k]));
  });

  const text = "﻿" + rows.map((row) => row.map(csvEscape).join(";")).join("\r\n");
  const url = URL.createObjectURL(new Blob([text], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = "laboratorio-bombas-de-sementes.csv";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast("CSV exportado, sem os dados de exemplo.");
}

/* Gera o texto para colar em data.js (RESULTS) com todos os dados reais */
function showPublish() {
  const published = new Set(RESULTS.map((r) => r.id));
  const fresh = state.records.filter((r) => !r.demo && !published.has(r.id));
  if (!RESULTS.length && !fresh.length) { toast("Ainda não há dados reais para publicar."); return; }

  const text = `const RESULTS = ${JSON.stringify(RESULTS.concat(fresh), null, 2)};`;
  $("publishWrap").hidden = false;
  const box = $("publishBox");
  box.value = text;
  box.focus();
  box.select();
  try {
    navigator.clipboard.writeText(text).then(
      () => toast("Copiado. Cole em data.js no lugar de RESULTS."),
      () => toast("Selecione o texto e copie com Ctrl+C.")
    );
  } catch (e) { toast("Selecione o texto e copie com Ctrl+C."); }
}

function clearLocalRecords() {
  if (!state.records.length) { toast("Não há registros salvos neste navegador."); return; }
  const ok = window.confirm("Apagar todos os registros salvos neste navegador, inclusive os de exemplo? Os resultados já publicados em data.js não são afetados.");
  if (!ok) return;
  state.records = [];
  state.preview = false;
  saveRecords();
  renderLabRecords();
  renderLabResults();
  renderLabBanner();
  toast("Registros apagados.");
}

function initLab() {
  const how = (test) => `<details class="how"><summary>Como foi medido</summary><ul>${TESTS[test].protocol.map((p) => `<li>${esc(p)}</li>`).join("")}</ul></details>`;
  $("labRoot").innerHTML = `
    <div id="resBanner"></div>

    <h3 class="section-title">Germinação</h3>
    ${how("ger")}
    <div id="results-ger" aria-live="polite"></div>

    <h3 class="section-title sub">Ensaios complementares</h3>
    <p class="muted measure">Resistência e retenção de água ajudam a explicar o desempenho de cada formulação: uma bomba que quebra cedo ou seca rápido protege menos a semente.</p>
    <h4>Resistência mecânica</h4>
    ${how("res")}
    <div id="results-res" aria-live="polite"></div>
    <h4>Retenção hídrica</h4>
    ${how("ret")}
    <div id="results-ret" aria-live="polite"></div>

    <details class="team-panel" id="teamPanel">
      <summary>Área da equipe: registrar medidas e publicar os resultados</summary>
      <div class="panel-body">
        <p class="muted measure">Os visitantes veem só os resultados publicados em data.js (RESULTS). Aqui a equipe digita as medidas, confere a prévia no guia e copia os dados para publicar. Os registros ficam salvos só neste navegador.</p>
        <div class="actions">
          <button class="btn small" id="previewBtn" data-preview-toggle>Ver prévia no guia</button>
          <button class="btn small" data-publish>Copiar dados para publicar</button>
          <button class="btn small" data-export>Exportar CSV</button>
          <button class="btn small" data-demo-load>Ver com dados de exemplo</button>
          <button class="btn small" data-clear-local>Limpar registros salvos</button>
        </div>
        <div id="labBanner"></div>
        <div id="publishWrap" hidden>
          <p class="muted">Cole este texto em data.js, no lugar do bloco que começa com const RESULTS.</p>
          <textarea id="publishBox" class="publish-box" readonly rows="8" aria-label="Dados para publicar"></textarea>
        </div>
        <div class="tabs" id="labTabs" role="tablist" aria-label="Ensaios"></div>
        <div class="lab-grid">
          <div id="labForm"></div>
          <div class="records" id="labRecords"></div>
        </div>
      </div>
    </details>`;
  renderLabBanner();
  setLabTab(state.labTab);
}

/* tooltip do gráfico (mouse e teclado) */
function showTip(target, event) {
  const box = target.closest(".chart");
  const tip = box && box.querySelector(".tip");
  if (!tip || !target.dataset.tip) return;
  tip.textContent = target.dataset.tip;
  tip.hidden = false;
  const rect = box.getBoundingClientRect();
  const t = target.getBoundingClientRect();
  const px = event && event.clientX ? event.clientX : t.left + t.width / 2;
  const py = event && event.clientY ? event.clientY : t.top;
  tip.style.left = `${clamp(px - rect.left + 12, 0, rect.width - tip.offsetWidth)}px`;
  tip.style.top = `${clamp(py - rect.top - tip.offsetHeight - 10, 0, rect.height)}px`;
}
function hideTip(target) {
  const box = target && target.closest(".chart");
  const tip = box && box.querySelector(".tip");
  if (tip) tip.hidden = true;
}


/* ---------- 7. DISPERSÃO ---------- */
function syncChecks() {
  document.querySelectorAll("input[data-check]").forEach((box) => { box.checked = Boolean(state.checks[box.dataset.check]); });
}

function renderAreas() {
  $("areaList").innerHTML = state.areas.length
    ? state.areas.map((a) => `
      <article class="area">
        <strong>${esc(a.name)}</strong>
        <button class="link-btn" data-area-del="${esc(a.id)}">Excluir</button>
        <p>${esc(a.type)}. Solo ${esc(a.soil.toLowerCase())}. Sol ${esc(a.sun.toLowerCase())}.${a.notes ? ` ${esc(a.notes)}` : ""}</p>
      </article>`).join("")
    : '<p class="muted">Nenhuma ficha ainda. Preencha o formulário acima para registrar a primeira área.</p>';
}

function submitArea(e) {
  e.preventDefault();
  const name = $("areaName").value.trim();
  if (!name) { $("areaName").focus(); toast("Informe o nome do local."); return; }
  state.areas.unshift({
    id: `${Date.now()}`, name,
    type: $("areaType").value, soil: $("areaSoil").value, sun: $("areaSun").value,
    notes: $("areaNotes").value.trim()
  });
  save(STORE.areas, state.areas);
  $("areaForm").reset();
  renderAreas();
  toast("Ficha salva.");
}


/* ---------- 8. PROJETO ---------- */
function renderTestimonies() {
  const list = TESTIMONIES.filter((t) => t && t.text);
  $("testimonies").innerHTML = list.length
    ? list.map((t) => `<figure class="testimony"><blockquote>${esc(t.text)}</blockquote>
        <figcaption>${esc(t.name || "")}${t.community ? `, ${esc(t.community)}` : ""}${t.practice ? `. Prática: ${esc(t.practice)}` : ""}</figcaption></figure>`).join("")
    : '<p class="muted measure">Os registros feitos com as comunidades aparecerão aqui, depois de autorizados por quem os compartilhou.</p>';
}

function renderTeam() {
  const has = TEAM.turmas || TEAM.orientadores.length || TEAM.integrantes.length;
  $("teamBox").innerHTML = `<h3>Turmas e orientação</h3>` + (has ? `
    ${TEAM.turmas ? `<p><strong>Turmas:</strong> ${esc(TEAM.turmas)}</p>` : ""}
    ${TEAM.orientadores.length ? `<p><strong>Professores orientadores:</strong> ${esc(TEAM.orientadores.join(", "))}</p>` : ""}
    ${TEAM.integrantes.length ? `<p><strong>Equipe:</strong> ${esc(TEAM.integrantes.join(", "))}</p>` : ""}`
    : '<p class="muted">Ainda sem nomes. Preencha o bloco TEAM no arquivo data.js para que turmas, professores orientadores e equipe apareçam aqui.</p>');
}

function renderSources() {
  const item = (s) => `<li>${s.u ? `<a href="${esc(s.u)}" target="_blank" rel="noopener">${esc(s.t)}</a>` : esc(s.t)}<small>${esc(s.n)}</small></li>`;
  $("sourcesRead").innerHTML = SOURCES.read.map(item).join("");
  $("sourcesConsult").innerHTML = SOURCES.consult.map(item).join("");
}


/* ---------- 9. EVENTOS E INICIALIZAÇÃO ---------- */
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  save(STORE.theme, theme);
}

document.addEventListener("click", (e) => {
  const t = e.target;
  const go = t.closest("[data-go]");
  if (go) { if ($("modal").classList.contains("open")) closeSpecies(); return showScreen(go.dataset.go); }

  const open = t.closest("[data-open]");
  if (open) return openSpecies(open.dataset.open);

  const mix = t.closest("[data-mix]");
  if (mix) return toggleMix(mix.dataset.mix);

  const tag = t.closest("[data-tag]");
  if (tag) { state.tag = tag.dataset.tag; return renderSpecies(); }

  if (t.closest("[data-clear-species]") || t.closest("#clearSpecies")) return clearSpeciesFilters();

  const tab = t.closest("[data-lab-tab]");
  if (tab) return setLabTab(tab.dataset.labTab);

  const del = t.closest("[data-del]");
  if (del) {
    state.records = state.records.filter((r) => r.id !== del.dataset.del);
    saveRecords();
    renderLabRecords(); renderLabResults(); renderLabBanner();
    return toast("Registro excluído.");
  }

  if (t.closest("[data-demo-load]")) {
    if (!state.records.some((r) => r.demo)) { state.records = state.records.concat(demoRecords()); saveRecords(); }
    state.preview = true;
    renderLabRecords(); renderLabResults(); renderLabBanner();
    return toast("Dados de exemplo carregados. São fictícios.");
  }
  if (t.closest("[data-demo-remove]")) {
    state.records = state.records.filter((r) => !r.demo);
    saveRecords();
    renderLabRecords(); renderLabResults(); renderLabBanner();
    return toast("Exemplos removidos.");
  }
  if (t.closest("[data-export]")) return exportCsv();
  if (t.closest("[data-publish]")) return showPublish();
  if (t.closest("[data-clear-local]")) return clearLocalRecords();
  if (t.closest("[data-preview-toggle]")) {
    state.preview = !state.preview;
    renderLabResults();
    return renderLabBanner();
  }

  const areaDel = t.closest("[data-area-del]");
  if (areaDel) {
    state.areas = state.areas.filter((a) => a.id !== areaDel.dataset.areaDel);
    save(STORE.areas, state.areas);
    return renderAreas();
  }
});

document.addEventListener("change", (e) => {
  const t = e.target;
  if (t.matches("input[data-check]")) {
    state.checks[t.dataset.check] = t.checked;
    save(STORE.checks, state.checks);
  } else if (t.matches("input[data-confirm]")) {
    toggleConfirmed(t.dataset.confirm, t.checked);
  } else if (t.matches("input[data-mixcheck]")) {
    toggleMix(t.dataset.mixcheck);
  } else if (t.matches("select[data-res-metric]")) {
    state.labMetric[t.dataset.resMetric] = t.value;
    renderResultsBlock(t.dataset.resMetric);
  } else if (t.matches("select[data-res-species]")) {
    state.labSpecies = t.value;
    renderResultsBlock("ger");
  }
});

document.addEventListener("submit", (e) => {
  if (e.target.id === "labFormEl") submitLab(e);
  if (e.target.id === "areaForm") submitArea(e);
});

// Gráfico: dica ao passar o mouse ou focar
document.addEventListener("mouseover", (e) => { const m = e.target.closest(".chart .mark"); if (m) showTip(m, e); });
document.addEventListener("mousemove", (e) => { const m = e.target.closest(".chart .mark"); if (m) showTip(m, e); });
document.addEventListener("mouseout", (e) => { if (e.target.closest(".chart .mark")) hideTip(e.target); });
document.addEventListener("focusin", (e) => { const m = e.target.closest && e.target.closest(".chart .mark"); if (m) showTip(m); });
document.addEventListener("focusout", (e) => { if (e.target.closest && e.target.closest(".chart .mark")) hideTip(e.target); });

$("speciesSearch").addEventListener("input", (e) => { state.search = e.target.value; renderSpecies(); });
$("fitSelect").addEventListener("change", (e) => { state.fit = e.target.value; renderSpecies(); });
["calcFormulation", "calcCount", "calcDiameter", "calcSeeds"].forEach((id) => {
  $(id).addEventListener("input", renderCalc);
  $(id).addEventListener("change", renderCalc);
});

$("closeBtn").addEventListener("click", closeSpecies);
$("prevBtn").addEventListener("click", () => stepSpecies(-1));
$("nextBtn").addEventListener("click", () => stepSpecies(1));
$("modal").addEventListener("click", (e) => { if (e.target === $("modal")) closeSpecies(); });

// Teclado na ficha: Esc fecha, setas navegam, Tab fica dentro da janela
document.addEventListener("keydown", (e) => {
  if (!$("modal").classList.contains("open")) return;
  if (e.key === "Escape") return closeSpecies();
  const typing = /^(INPUT|SELECT|TEXTAREA)$/.test(document.activeElement.tagName);
  if (!typing && e.key === "ArrowRight") return stepSpecies(1);
  if (!typing && e.key === "ArrowLeft") return stepSpecies(-1);
  if (e.key === "Tab") {
    const focusable = [...$("modal").querySelectorAll("button, input, select, [tabindex]:not([tabindex='-1'])")]
      .filter((el) => !el.disabled && el.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});

$("themeBtn").addEventListener("click", () => {
  const root = document.documentElement;
  const dark = root.dataset.theme ? root.dataset.theme === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(dark ? "light" : "dark");
});
window.addEventListener("hashchange", () => applyScreen(location.hash.slice(1)));

function init() {
  const savedTheme = load(STORE.theme, null);
  if (savedTheme === "dark" || savedTheme === "light") document.documentElement.dataset.theme = savedTheme;

  initDiagram($("homeDiagram"));
  renderFormulations();
  renderSteps();

  $("calcFormulation").innerHTML = FORMULATIONS.filter((f) => f.parts.length)
    .map((f) => `<option value="${f.id}">${f.id}, ${esc(f.short)}</option>`).join("");
  renderCalc();

  initLab();
  syncChecks();
  renderAreas();
  renderTeam();
  renderSources();
  renderTestimonies();
  renderSpecies();
  renderBuilder();
  applyScreen(location.hash.slice(1));
}

init();
