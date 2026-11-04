/* =====================================================
   GUIA ETNOBOTÂNICO DE CAMAÇARI – lógica
   Depende de GuiaDados.js (carregado antes).

   Índice:
   1.  Utilitários e estado
   2.  Telas (roteador por hash)
   3.  Diagrama da bomba
   4.  Espécies (catálogo e ficha)
   5.  Bomba de sementes (formulações, passos, montador de mistura)
   6.  Resultados (germinação)
   7.  Dispersão (listas de verificação)
   8.  Sobre (registros, equipe, fontes)
   9.  Eventos e inicialização
   ===================================================== */
"use strict";


/* ---------- 1. UTILITÁRIOS E ESTADO ---------- */
const STORE = {
  theme: "gb-tema",
  confirmed: "gb-confirmadas",
  mix: "gb-mistura",
<<<<<<< HEAD
=======
  checks: "gb-listas"
>>>>>>> 50e1a751b5d9e8cbe2fd879ca7367e9c600931d3
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
<<<<<<< HEAD
=======
  checks: load(STORE.checks, {}),
>>>>>>> 50e1a751b5d9e8cbe2fd879ca7367e9c600931d3
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
function polar(angle, radius) {
  const a = (angle * Math.PI) / 180;
  return [200 + radius * Math.cos(a), 200 + radius * Math.sin(a)];
}

function diagramSvg() {
  const layerAttrs = (id) => `class="layer" data-layer="${id}" tabindex="0" role="button" aria-label="${LAYERS[id].title}"`;

  return `
    <svg class="bomb-svg" viewBox="0 0 400 400" role="group" aria-label="Corte da bomba de argila com terra no interior (F2), em camadas">
      <g ${layerAttrs("argila")}>
        <circle class="ring f-clay" cx="200" cy="200" r="176"/>
        <path class="crack" d="M70 120 q18 8 22 26 M318 96 q-14 14 -10 30 M338 262 q-16 -6 -26 4 M96 318 q10 -14 28 -14"/>
      </g>
      <g ${layerAttrs("humus")}>
        <circle class="ring f-humus" cx="200" cy="200" r="118"/>
      </g>
      <g ${layerAttrs("semente")}>
        <ellipse class="ring f-seed" cx="160" cy="190" rx="16" ry="24" transform="rotate(-25 160 190)"/>
        <ellipse class="ring f-seed" cx="232" cy="176" rx="16" ry="24" transform="rotate(20 232 176)"/>
        <ellipse class="ring f-seed" cx="196" cy="236" rx="16" ry="24" transform="rotate(75 196 236)"/>
        <ellipse class="ring f-seed" cx="210" cy="150" rx="14" ry="21" transform="rotate(-50 210 150)"/>
      </g>
    </svg>
    <div class="layer-buttons" role="group" aria-label="Camadas da bomba">
      ${Object.keys(LAYERS).map((id) => `<button class="chip" data-layer-btn="${id}">${LAYERS[id].title.split(" (")[0]}</button>`).join("")}
    </div>
    <div class="layer-info" aria-live="polite"><p class="muted">Escolha uma camada, no desenho ou nos botões, para ver o que ela faz e em quais formulações entra.</p></div>`;
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
      : '<p class="muted">Escolha uma camada, no desenho ou nos botões, para ver o que ela faz e em quais formulações entra.</p>';
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
          ${SELECTED.includes(sp.id) ? '<span class="selected-mark">Selecionada para o experimento</span>' : ""}
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
      <div class="tag-list"><span class="tag origin ${sp.origin}">${esc(ORIGIN_LABELS[sp.origin])}</span>${SELECTED.includes(sp.id) ? '<span class="tag sel">Selecionada para o experimento</span>' : ""}${sp.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}${sp.roles.map((r) => `<span class="tag">${esc(ROLE_LABELS[r])}</span>`).join("")}</div>
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
    <article class="formulation${f.status === "selecionada" ? " chosen" : ""}">
      <h4><span class="code">${f.id}</span>${esc(f.name)}</h4>
      ${f.statusNote ? `<p class="status ${esc(f.status)}">${esc(f.statusNote)}</p>` : ""}
      <p>${esc(f.desc)}</p>
      <ul class="parts">
        ${f.parts.map(([name, q]) => `<li><span>${esc(name)}</span><span>${esc(q)}</span></li>`).join("")}
      </ul>
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

/* ---------- 4a. BIOMA ---------- */
function renderBioma() {
  const root = $("biomaRoot");
  if (!root || typeof BIOMA === "undefined") return;
  root.innerHTML = `
    <h3 class="section-title">O bioma</h3>
    <h4 class="sub-title">${esc(BIOMA.titulo)}</h4>
    <p class="measure">${esc(BIOMA.resumo)}</p>
    <dl class="facts">${BIOMA.fatos.map((f) => `<div><dt>${esc(f.rotulo)}</dt><dd>${esc(f.valor)}</dd><small>${esc(f.nota)}</small></div>`).join("")}</dl>
    ${BIOMA.ambientes.map((a) => `<h4 class="sub-title">${esc(a.nome)}</h4><p class="measure">${esc(a.texto)}</p>`).join("")}
    <h4 class="sub-title">Ameaças</h4><p class="measure">${esc(BIOMA.ameacas)}</p>
    <h4 class="sub-title">O que isso significa para a bomba</h4><p class="measure">${esc(BIOMA.implicacao)}</p>
    <p class="note measure">${esc(BIOMA.limite)}</p>`;
}

<<<<<<< HEAD
/* ---------- 6b. CARROSSEL DA BOMBA ---------- */
function renderGaleria() {
  const root = $("galeriaRoot");
  if (!root || typeof FOTOS_PROJETO === "undefined" || !FOTOS_PROJETO.length) return;
  const fotos = FOTOS_PROJETO;
  const n = fotos.length;
  let i = 0;
  const cam = '<svg viewBox="0 0 48 48" width="44" height="44" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 15h8l3-5h14l3 5h8v22H6z"/><circle cx="24" cy="26" r="7"/></svg>';
  const arrow = (d) => `<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>`;

  root.innerHTML = `
    <div class="carousel" role="region" aria-roledescription="carrossel" aria-label="Fotos da bomba de sementes" tabindex="0">
      <div class="car-stage">
        <div class="gal-frame car-frame empty"><div class="gal-empty">${cam}<span class="car-ph"></span></div></div>
        ${n > 1 ? `<button type="button" class="car-btn prev" data-car="-1" aria-label="Foto anterior">${arrow("M15 5l-7 7 7 7")}</button>
        <button type="button" class="car-btn next" data-car="1" aria-label="Próxima foto">${arrow("M9 5l7 7-7 7")}</button>` : ""}
      </div>
      <div class="car-foot">
        <p class="car-caption" aria-live="polite"></p>
        ${n > 1 ? `<div class="car-dots" role="group" aria-label="Escolher foto">${fotos.map((_, k) => `<button type="button" class="car-dot" data-dot="${k}" aria-label="Foto ${k + 1} de ${n}"></button>`).join("")}</div>` : ""}
        ${n > 1 ? `<span class="car-count"></span>` : ""}
      </div>
    </div>`;

  const box = root.querySelector(".carousel");
  const frame = root.querySelector(".car-frame");

  function show(k) {
    i = (k + n) % n;
    const f = fotos[i] || {};
    frame.querySelector("img")?.remove();
    frame.classList.add("empty");
    if (f.src) {
      const img = new Image();
      img.alt = f.legenda || "Bomba de sementes";
      img.onload = () => frame.classList.remove("empty");
      img.onerror = () => { img.remove(); frame.classList.add("empty"); };
      img.src = f.src;
      frame.prepend(img);
    }
    frame.querySelector(".car-ph").textContent = `Foto ${i + 1}`;
    box.querySelector(".car-caption").innerHTML = `${esc(f.legenda || "")}${f.credito ? `<small>${esc(f.credito)}</small>` : ""}`;
    const c = box.querySelector(".car-count");
    if (c) c.textContent = `${i + 1} de ${n}`;
    box.querySelectorAll(".car-dot").forEach((d, k) => { d.classList.toggle("on", k === i); d.setAttribute("aria-current", k === i ? "true" : "false"); });
  }

  box.addEventListener("click", (e) => {
    const b = e.target.closest("[data-car]");
    const d = e.target.closest("[data-dot]");
    if (b) show(i + Number(b.dataset.car));
    else if (d) show(Number(d.dataset.dot));
  });
  box.addEventListener("keydown", (e) => {
    if (n < 2) return;
    if (e.key === "ArrowLeft") { e.preventDefault(); show(i - 1); }
    if (e.key === "ArrowRight") { e.preventDefault(); show(i + 1); }
  });
  let x0 = null;
  box.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  box.addEventListener("touchend", (e) => {
    if (x0 === null || n < 2) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) show(i + (dx < 0 ? 1 : -1));
    x0 = null;
  });
  show(0);
}

/* ---------- 6a. RESULTADOS: pH E RESISTÊNCIA HÍDRICA ---------- */
function renderMetodo() {
  const ph = $("phRoot");
  const agua = $("aguaRoot");
  const metodo = $("metodoRoot");
  if (metodo) {
    metodo.innerHTML = `
      <p class="measure">${esc(METODO.intro)}</p>
      <dl class="method">
        <div><dt>Sementes</dt><dd>${esc(METODO.sementes)}</dd></div>
        <div><dt>Materiais</dt><dd>${esc(METODO.materiais)}</dd></div>
        <div><dt>Secagem</dt><dd>${esc(METODO.secagem)}</dd></div>
        <div><dt>Análise</dt><dd>${esc(METODO.analise)}</dd></div>
      </dl>`;
  }
  if (ph) {
    ph.innerHTML = `
      <div class="table-wrap"><table class="table">
        <thead><tr><th scope="col">Amostra (cerca de 4 g)</th><th scope="col" class="num">pH</th></tr></thead>
        <tbody>${RESULT_PH.map((r) => `<tr><th scope="row">${esc(r.amostra)}</th><td class="num"><strong>${fmt(r.ph, 2)}</strong></td></tr>`).join("")}</tbody>
      </table></div>
      <p class="muted measure">Faixa de referência para a germinação, segundo a equipe: ${esc(PH_FAIXA)}.</p>
      <p class="measure">${esc(PH_TEXTO)}</p>`;
  }
  if (agua) {
    const rows = RESULT_AGUA.map((r) => {
      const f = findFormulation(r.formulacao);
      const d = r.depois - r.antes;
      const pct = (d / r.antes) * 100;
      const sign = (n, dig) => (n > 0 ? "+" : n < 0 ? "−" : "") + fmt(Math.abs(n), dig);
      return `<tr>
        <th scope="row">${esc(r.formulacao)}, ${esc(f ? f.short : "")}</th>
        <td class="num">${fmt(r.antes, 2)}</td><td class="num">${fmt(r.depois, 2)}</td>
        <td class="num"><strong>${sign(d, 2)}</strong></td><td class="num">${sign(pct, 1)}%</td>
      </tr>`;
    }).join("");
    agua.innerHTML = `
      <div class="table-wrap"><table class="table">
        <thead><tr><th scope="col">Formulação</th><th scope="col" class="num">Massa antes (g)</th><th scope="col" class="num">Massa depois (g)</th><th scope="col" class="num">Variação (g)</th><th scope="col" class="num">Variação (%)</th></tr></thead>
        <tbody>${rows}</tbody>
      </table></div>
      <p class="muted measure">Imersão em 200 mL de água por 5 minutos. Variação = depois − antes.</p>
      <p class="measure">${esc(AGUA_TEXTO)}</p>`;
  }
  const sel = findFormulation(FORMULACAO_SELECIONADA);
  const conc = $("selecionadaRoot");
  if (conc && sel) {
    conc.innerHTML = `<p class="measure">Pela comparação descritiva do desempenho estrutural e germinativo, a <strong>${esc(sel.id)}, ${esc(sel.name.toLowerCase())}</strong>, foi a selecionada.</p>`;
  }
}

/* ---------- 6. RESULTADOS DE GERMINAÇÃO ----------
   Lê a lista GERMINACAO do GuiaDados.js. A única conta é
   germinadas ÷ semeadas × 100. Linhas com erro são avisadas na tela. */
function germinationRows() {
  const good = [];
  const problems = [];
  (Array.isArray(GERMINACAO) ? GERMINACAO : []).forEach((r, i) => {
    const line = i + 1;
    const f = r && findFormulation(r.formulacao);
    const sown = Number(r && r.semeadas);
    const grown = Number(r && r.germinadas);
    if (!f) problems.push(`Linha ${line}: formulação "${r && r.formulacao}" não existe (use F1, F2 ou F3).`);
    else if (!Number.isInteger(sown) || sown < 1) problems.push(`Linha ${line}: "semeadas" precisa ser um número inteiro maior que zero.`);
    else if (!Number.isInteger(grown) || grown < 0 || grown > sown) problems.push(`Linha ${line}: "germinadas" precisa ser um inteiro entre 0 e ${sown}.`);
    else good.push({ f, sp: findSpecies(r.especie), speciesId: r.especie, sown, grown, pct: (grown / sown) * 100 });
  });
=======
/* ---------- 6a. RESULTADOS: pH E RESISTÊNCIA HÍDRICA ---------- */
function renderMetodo() {
  const ph = $("phRoot");
  const agua = $("aguaRoot");
  const metodo = $("metodoRoot");
  if (metodo) {
    metodo.innerHTML = `
      <p class="measure">${esc(METODO.intro)}</p>
      <dl class="method">
        <div><dt>Sementes</dt><dd>${esc(METODO.sementes)}</dd></div>
        <div><dt>Materiais</dt><dd>${esc(METODO.materiais)}</dd></div>
        <div><dt>Secagem</dt><dd>${esc(METODO.secagem)}</dd></div>
        <div><dt>Análise</dt><dd>${esc(METODO.analise)}</dd></div>
      </dl>`;
  }
  if (ph) {
    ph.innerHTML = `
      <div class="table-wrap"><table class="table">
        <thead><tr><th scope="col">Amostra (cerca de 4 g)</th><th scope="col" class="num">pH</th></tr></thead>
        <tbody>${RESULT_PH.map((r) => `<tr><th scope="row">${esc(r.amostra)}</th><td class="num"><strong>${fmt(r.ph, 2)}</strong></td></tr>`).join("")}</tbody>
      </table></div>
      <p class="muted measure">Faixa de referência para a germinação, segundo a equipe: ${esc(PH_FAIXA)}.</p>
      <p class="measure">${esc(PH_TEXTO)}</p>`;
  }
  if (agua) {
    const rows = RESULT_AGUA.map((r) => {
      const f = findFormulation(r.formulacao);
      const d = r.depois - r.antes;
      const pct = (d / r.antes) * 100;
      const sign = (n, dig) => (n > 0 ? "+" : n < 0 ? "−" : "") + fmt(Math.abs(n), dig);
      return `<tr>
        <th scope="row">${esc(r.formulacao)}, ${esc(f ? f.short : "")}</th>
        <td class="num">${fmt(r.antes, 2)}</td><td class="num">${fmt(r.depois, 2)}</td>
        <td class="num"><strong>${sign(d, 2)}</strong></td><td class="num">${sign(pct, 1)}%</td>
      </tr>`;
    }).join("");
    agua.innerHTML = `
      <div class="table-wrap"><table class="table">
        <thead><tr><th scope="col">Formulação</th><th scope="col" class="num">Massa antes (g)</th><th scope="col" class="num">Massa depois (g)</th><th scope="col" class="num">Variação (g)</th><th scope="col" class="num">Variação (%)</th></tr></thead>
        <tbody>${rows}</tbody>
      </table></div>
      <p class="muted measure">Imersão em 200 mL de água por 5 minutos. Variação = depois − antes.</p>
      <p class="measure">${esc(AGUA_TEXTO)}</p>`;
  }
  const sel = findFormulation(FORMULACAO_SELECIONADA);
  const conc = $("selecionadaRoot");
  if (conc && sel) {
    conc.innerHTML = `<p class="measure">Pela comparação descritiva do desempenho estrutural e germinativo, a <strong>${esc(sel.id)}, ${esc(sel.name.toLowerCase())}</strong>, foi a selecionada.</p>`;
  }
}

/* ---------- 6. RESULTADOS DE GERMINAÇÃO ----------
   Lê a lista GERMINACAO do GuiaDados.js. A única conta é
   germinadas ÷ semeadas × 100. Linhas com erro são avisadas na tela. */
function germinationRows() {
  const good = [];
  const problems = [];
  (Array.isArray(GERMINACAO) ? GERMINACAO : []).forEach((r, i) => {
    const line = i + 1;
    const f = r && findFormulation(r.formulacao);
    const sown = Number(r && r.semeadas);
    const grown = Number(r && r.germinadas);
    if (!f) problems.push(`Linha ${line}: formulação "${r && r.formulacao}" não existe (use F1, F2 ou F3).`);
    else if (!Number.isInteger(sown) || sown < 1) problems.push(`Linha ${line}: "semeadas" precisa ser um número inteiro maior que zero.`);
    else if (!Number.isInteger(grown) || grown < 0 || grown > sown) problems.push(`Linha ${line}: "germinadas" precisa ser um inteiro entre 0 e ${sown}.`);
    else good.push({ f, sp: findSpecies(r.especie), speciesId: r.especie, sown, grown, pct: (grown / sown) * 100 });
  });
>>>>>>> 50e1a751b5d9e8cbe2fd879ca7367e9c600931d3
  return { good, problems };
}

const pctBar = (pct) => `<span class="pct-bar" role="img" aria-label="${fmt(pct, 1)} por cento"><i style="width:${clamp(pct, 0, 100)}%"></i></span>`;

function renderGerminacao() {
  const { good, problems } = germinationRows();
  const root = $("germRoot");
  const warn = problems.length
    ? `<div class="notice" role="alert"><strong>Atenção, há linhas com erro em GERMINACAO (GuiaDados.js):</strong><ul>${problems.map((m) => `<li>${esc(m)}</li>`).join("")}</ul></div>`
    : "";

  if (!good.length) {
    root.innerHTML = `
      <h3 class="section-title">Germinação</h3>
      ${warn}
      <p class="measure">${esc(GERM_TEXTO)}</p>
      <p class="muted measure">Condições do ensaio: bombas em recipientes com 150 g de terra, irrigadas com borrifador uma vez ao dia, com acompanhamento de uma semana.</p>
      <details class="how">
        <summary>Para mostrar a contagem de sementes (arquivo GuiaDados.js)</summary>
        <p>Procure <code>const GERMINACAO = [</code> e acrescente uma linha por formulação e espécie. O site calcula a porcentagem sozinho.</p>
        <pre><code>{ formulacao: "F2", especie: "maxixe", semeadas: 20, germinadas: 12 },</code></pre>
      </details>`;
    return;
  }

  // Resumo por formulação
  const byF = FORMULATIONS.map((f) => {
    const rows = good.filter((r) => r.f.id === f.id);
    const sown = rows.reduce((t, r) => t + r.sown, 0);
    const grown = rows.reduce((t, r) => t + r.grown, 0);
    return { f, sown, grown, pct: sown ? (grown / sown) * 100 : null };
  }).filter((r) => r.sown > 0);

    const summaryRows = byF.map((r) => `
    <tr>
      <th scope="row">${esc(r.f.id)}, ${esc(r.f.short)}</th>
      <td class="num">${r.sown}</td><td class="num">${r.grown}</td>
      <td class="num"><strong>${fmt(r.pct, 1)}%</strong></td>
      <td>${pctBar(r.pct)}</td>
    </tr>`).join("");

  const detailRows = good.map((r) => `
    <tr>
      <th scope="row">${esc(r.sp ? r.sp.name : r.speciesId)}</th>
      <td>${esc(r.f.id)}, ${esc(r.f.short)}</td>
      <td class="num">${r.sown}</td><td class="num">${r.grown}</td>
      <td class="num"><strong>${fmt(r.pct, 1)}%</strong></td>
    </tr>`).join("");

  const best = [...byF].sort((x, y) => y.pct - x.pct)[0];
  const lead = best
    ? `<p class="measure">${esc(GERM_TEXTO)} Na contagem de sementes, a maior germinação foi a da <strong>${esc(best.f.id)}, ${esc(best.f.short)}</strong>, com ${fmt(best.pct, 1)}%.</p>`
    : "";

  root.innerHTML = `
    <h3 class="section-title">Germinação</h3>
    ${warn}
    ${lead}
    <h4 class="sub-title">Por formulação</h4>
    <div class="table-wrap"><table class="table">
      <thead><tr><th scope="col">Formulação</th><th scope="col" class="num">Semeadas</th><th scope="col" class="num">Germinadas</th><th scope="col" class="num">Germinação</th><th scope="col"><span class="sr">Barra</span></th></tr></thead>
      <tbody>${summaryRows}</tbody>
    </table></div>

    <h4 class="sub-title">Por espécie</h4>
    <div class="table-wrap"><table class="table">
      <thead><tr><th scope="col">Espécie</th><th scope="col">Formulação</th><th scope="col" class="num">Semeadas</th><th scope="col" class="num">Germinadas</th><th scope="col" class="num">Germinação</th></tr></thead>
      <tbody>${detailRows}</tbody>
    </table></div>
    <p class="muted measure">Germinação (%) = germinadas ÷ semeadas × 100. Os números vêm das medidas da equipe. Chuva, solo e animais no campo mudam o resultado fora do laboratório.</p>`;
}

<<<<<<< HEAD
=======

/* ---------- 7. DISPERSÃO ---------- */
function syncChecks() {
  document.querySelectorAll("input[data-check]").forEach((box) => { box.checked = Boolean(state.checks[box.dataset.check]); });
}

>>>>>>> 50e1a751b5d9e8cbe2fd879ca7367e9c600931d3

/* ---------- 8. PROJETO ---------- */
function renderTeam() {
  const has = TEAM.turmas || TEAM.orientadores.length || TEAM.integrantes.length;
  $("teamBox").innerHTML = `<h3>Turmas e orientação</h3>` + (has ? `
    ${TEAM.turmas ? `<p><strong>Turmas:</strong> ${esc(TEAM.turmas)}</p>` : ""}
    ${TEAM.orientadores.length ? `<p><strong>Professores orientadores:</strong> ${esc(TEAM.orientadores.join(", "))}</p>` : ""}
    ${TEAM.integrantes.length ? `<p><strong>Equipe:</strong> ${esc(TEAM.integrantes.join(", "))}</p>` : ""}`
    : '<p class="muted">Ainda sem nomes. Preencha o bloco TEAM no arquivo GuiaDados.js para que turmas, professores orientadores e equipe apareçam aqui.</p>');
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
});

document.addEventListener("change", (e) => {
  const t = e.target;
  if (t.matches("input[data-confirm]")) {
    toggleConfirmed(t.dataset.confirm, t.checked);
  } else if (t.matches("input[data-mixcheck]")) {
    toggleMix(t.dataset.mixcheck);
  }
});

$("speciesSearch").addEventListener("input", (e) => { state.search = e.target.value; renderSpecies(); });
$("fitSelect").addEventListener("change", (e) => { state.fit = e.target.value; renderSpecies(); });

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

  renderBioma();
  renderMetodo();
<<<<<<< HEAD
  renderGaleria();
  renderGerminacao();
=======
  renderGerminacao();
  syncChecks();
>>>>>>> 50e1a751b5d9e8cbe2fd879ca7367e9c600931d3
  renderTeam();
  renderSources();
  renderSpecies();
  renderBuilder();
  applyScreen(location.hash.slice(1));
}

init();

