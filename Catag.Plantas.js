/* =====================================================
   HERBÁRIO – lógica
   Índice:
   1. Dados das plantas
   2. Constantes e estado
   3. Utilitários
   4. Renderização (catálogo e detalhes)
   5. Ações (favoritar, navegar, abrir/fechar)
   6. Eventos
   7. Inicialização
   ===================================================== */


/* ---------- 1. DADOS DAS PLANTAS ----------
   Para adicionar uma planta, copie um bloco e troque os valores.
   light / water: 1 (pouco) a 3 (muito)
   difficulty:    1 (fácil) a 3 (difícil)
   petSafe:       true = segura para pets
------------------------------------------- */
const plants = [
  {
    name: "Monstera", scientific: "Monstera deliciosa", emoji: "🍃", color: "#cfe8d5",
    family: "Araceae", region: "México e América Central", climate: "Tropical",
    light: 2, water: 2, temperature: "18–30 °C", humidity: "Média a alta",
    soil: "Rico em matéria orgânica, bem drenado", difficulty: 1, petSafe: false,
    propagation: "Estaquia em água ou terra",
    tip: "Limpe as folhas com pano úmido e dê um tutor para ela subir.",
    fact: "Os furos nas folhas ajudam a resistir a ventos fortes e deixam a luz chegar às folhas de baixo."
  },
  {
    name: "Samambaia", scientific: "Nephrolepis exaltata", emoji: "🌿", color: "#d8ecc8",
    family: "Nephrolepidaceae", region: "Regiões tropicais, incluindo o Brasil", climate: "Tropical úmido",
    light: 1, water: 3, temperature: "16–27 °C", humidity: "Alta",
    soil: "Úmido, leve e ácido", difficulty: 2, petSafe: true,
    propagation: "Divisão da touceira",
    tip: "Nunca deixe o substrato secar e borrife água nas folhas em dias secos.",
    fact: "Samambaias existem há mais de 300 milhões de anos, antes dos dinossauros."
  },
  {
    name: "Espada-de-São-Jorge", scientific: "Dracaena trifasciata", emoji: "🗡️", color: "#cde3c0",
    family: "Asparagaceae", region: "África Ocidental", climate: "Tropical seco",
    light: 3, water: 1, temperature: "15–32 °C", humidity: "Baixa",
    soil: "Arenoso, muito bem drenado", difficulty: 1, petSafe: false,
    propagation: "Divisão de rizomas ou folha em pedaços",
    tip: "Regue só quando a terra estiver totalmente seca. O excesso de água apodrece a raiz.",
    fact: "Estudos da NASA mostraram que ela ajuda a filtrar certos poluentes em ambientes fechados."
  },
  {
    name: "Jiboia", scientific: "Epipremnum aureum", emoji: "🌱", color: "#e4efc2",
    family: "Araceae", region: "Ilhas do Pacífico Sul", climate: "Tropical",
    light: 2, water: 2, temperature: "15–29 °C", humidity: "Média",
    soil: "Leve, com boa drenagem", difficulty: 1, petSafe: false,
    propagation: "Estaquia em água",
    tip: "Pode ficar pendente ou subir em tutor; pode podar sem medo para ficar cheia.",
    fact: "Cresce em água por meses, sem precisar de terra."
  },
  {
    name: "Bromélia", scientific: "Guzmania lingulata", emoji: "🌺", color: "#f6d3cf",
    family: "Bromeliaceae", region: "Mata Atlântica e Américas", climate: "Tropical úmido",
    light: 2, water: 2, temperature: "18–29 °C", humidity: "Alta",
    soil: "Casca de pinus e húmus, bem arejado", difficulty: 2, petSafe: true,
    propagation: "Filhotes que nascem na base",
    tip: "Mantenha água no centro (copo) e troque a cada poucos dias.",
    fact: "O copo central acumula chuva e abriga pequenos animais na natureza."
  },
  {
    name: "Orquídea", scientific: "Phalaenopsis", emoji: "🌸", color: "#f3d6ea",
    family: "Orchidaceae", region: "Sudeste Asiático", climate: "Tropical úmido",
    light: 2, water: 2, temperature: "18–28 °C", humidity: "Alta",
    soil: "Casca de pinus ou musgo, raízes expostas", difficulty: 3, petSafe: true,
    propagation: "Keikis (mudas na haste)",
    tip: "Regue por imersão e só quando as raízes estiverem esbranquiçadas.",
    fact: "A flor pode durar até 3 meses aberta."
  },
  {
    name: "Aloe vera", scientific: "Aloe vera", emoji: "🪴", color: "#d3e8cf",
    family: "Asphodelaceae", region: "Península Arábica", climate: "Árido",
    light: 3, water: 1, temperature: "13–35 °C", humidity: "Baixa",
    soil: "Arenoso, drenagem rápida", difficulty: 1, petSafe: false,
    propagation: "Mudas que brotam ao lado",
    tip: "Precisa de sol direto e vaso com furos; regue pouco no inverno.",
    fact: "O gel das folhas é usado há milênios em cuidados com a pele."
  },
  {
    name: "Lavanda", scientific: "Lavandula angustifolia", emoji: "💜", color: "#e0d6f3",
    family: "Lamiaceae", region: "Mediterrâneo", climate: "Mediterrâneo",
    light: 3, water: 1, temperature: "10–30 °C", humidity: "Baixa",
    soil: "Alcalino, pedregoso e drenado", difficulty: 2, petSafe: false,
    propagation: "Estacas semilenhosas",
    tip: "Poda após a floração mantém a planta compacta; não encharque.",
    fact: "Suas flores atraem abelhas e borboletas."
  },
  {
    name: "Violeta-africana", scientific: "Streptocarpus ionanthus", emoji: "🌼", color: "#d9d2f2",
    family: "Gesneriaceae", region: "Tanzânia e Quênia", climate: "Tropical de altitude",
    light: 2, water: 2, temperature: "18–26 °C", humidity: "Média",
    soil: "Leve, com perlita", difficulty: 2, petSafe: true,
    propagation: "Folha enraizada em substrato",
    tip: "Regue pela base, sem molhar as folhas, que são aveludadas.",
    fact: "Com boa luz, floresce praticamente o ano todo."
  },
  {
    name: "Zamioculca", scientific: "Zamioculcas zamiifolia", emoji: "🌳", color: "#c6e2cc",
    family: "Araceae", region: "Leste da África", climate: "Tropical seco",
    light: 1, water: 1, temperature: "15–30 °C", humidity: "Baixa",
    soil: "Bem drenado, com areia", difficulty: 1, petSafe: false,
    propagation: "Folhas ou divisão dos rizomas",
    tip: "Os rizomas guardam água: regue a cada 2–3 semanas e relaxe.",
    fact: "Aguenta semanas de seca e pouca luz, por isso é a queridinha dos escritórios."
  }
];


/* ---------- 2. CONSTANTES E ESTADO ---------- */
const DIFFICULTY_LABELS = ["", "Fácil", "Média", "Difícil"];
const LIGHT_LABELS      = ["", "Sombra / luz difusa", "Meia-sombra", "Sol pleno"];
const WATER_LABELS      = ["", "Pouca água", "Moderada", "Frequente"];
const FILTER_OPTIONS    = ["Todas", "Fácil", "Média", "Difícil"];

const state = {
  difficulty: 0,        // 0 = todas
  onlyPetSafe: false,
  onlyFavorites: false,
  search: "",
  openPlant: null,      // nome da planta aberta no modal
  favorites: new Set()
};


/* ---------- 3. UTILITÁRIOS ---------- */
const $ = (id) => document.getElementById(id);

// Mostra "●●○" para níveis de 1 a 3
const meter = (n) => "●".repeat(n) + "○".repeat(3 - n);

const findPlant = (name) => plants.find((p) => p.name === name);

// Favoritos salvos no navegador (com proteção contra erro)
function loadFavorites() {
  try {
    JSON.parse(localStorage.getItem("herbario-fav") || "[]")
      .forEach((name) => state.favorites.add(name));
  } catch (e) { /* ignora */ }
}
function saveFavorites() {
  try {
    localStorage.setItem("herbario-fav", JSON.stringify([...state.favorites]));
  } catch (e) { /* ignora */ }
}

// Aplica busca e filtros
function getVisiblePlants() {
  return plants.filter((p) => {
    const text = (p.name + p.scientific + p.region + p.climate).toLowerCase();
    return (
      (!state.difficulty || p.difficulty === state.difficulty) &&
      (!state.onlyPetSafe || p.petSafe) &&
      (!state.onlyFavorites || state.favorites.has(p.name)) &&
      text.includes(state.search)
    );
  });
}


/* ---------- 4. RENDERIZAÇÃO ---------- */
function renderFilters() {
  $("difficultyFilters").innerHTML = FILTER_OPTIONS.map((label, level) => `
    <button class="chip ${state.difficulty === level ? "on" : ""}" data-level="${level}">
      ${level ? "🌱 " : ""}${label}
    </button>`).join("");

  $("petBtn").classList.toggle("on", state.onlyPetSafe);
  $("favBtn").classList.toggle("on", state.onlyFavorites);
}

function renderCard(p, index) {
  const isFav = state.favorites.has(p.name);
  return `
    <div class="card" tabindex="0" data-name="${p.name}" style="animation-delay:${index * 40}ms">
      <button class="card-fav" data-fav="${p.name}" aria-label="Favoritar">${isFav ? "❤️" : "🤍"}</button>
      <div class="card-photo-wrap">
        <div class="card-photo" style="background:${p.color}">${p.emoji}</div>
      </div>
      <div class="card-body">
        <h3>${p.name}</h3>
        <i>${p.scientific}</i>
        <div class="badges">
          <span class="badge">${DIFFICULTY_LABELS[p.difficulty]}</span>
          <span class="badge">☀ ${LIGHT_LABELS[p.light]}</span>
          <span class="badge">${p.petSafe ? "🐾 Pet-safe" : "⚠ Tóxica p/ pets"}</span>
        </div>
      </div>
    </div>`;
}

function renderCatalog() {
  renderFilters();

  const visible = getVisiblePlants();
  $("resultCount").textContent =
    `${visible.length} ${visible.length === 1 ? "planta encontrada" : "plantas encontradas"}`;

  $("plantGrid").innerHTML = visible.length
    ? visible.map(renderCard).join("")
    : '<div class="empty">🌵 Nenhuma planta com esses filtros.</div>';
}

function renderDetails(p) {
  const isFav = state.favorites.has(p.name);
  $("modalContent").innerHTML = `
    <div class="modal-head" style="background:${p.color}">
      <div class="emoji">${p.emoji}</div>
      <h3>${p.name}</h3>
      <i>${p.scientific} · ${p.family}</i>
    </div>

    <div class="modal-body">
      <div class="info-grid">
        <div class="info-item"><small>Origem</small><b>🌍 ${p.region}</b></div>
        <div class="info-item"><small>Clima</small><b>${p.climate}</b></div>
        <div class="info-item"><small>Luz</small><b class="meter">${meter(p.light)}</b><b>${LIGHT_LABELS[p.light]}</b></div>
        <div class="info-item"><small>Rega</small><b class="meter">${meter(p.water)}</b><b>${WATER_LABELS[p.water]}</b></div>
        <div class="info-item"><small>Temperatura</small><b>🌡 ${p.temperature}</b></div>
        <div class="info-item"><small>Umidade</small><b>💧 ${p.humidity}</b></div>
        <div class="info-item"><small>Dificuldade</small><b>${DIFFICULTY_LABELS[p.difficulty]}</b></div>
        <div class="info-item"><small>Pets</small><b>${p.petSafe ? "🐾 Segura" : "⚠ Tóxica: mantenha longe"}</b></div>
      </div>

      <div class="detail"><h4>Solo ideal</h4><p>${p.soil}</p></div>
      <div class="detail"><h4>Como multiplicar</h4><p>${p.propagation}</p></div>
      <div class="detail"><h4>Dica de cuidado</h4><p>${p.tip}</p></div>
      <div class="fact">💡 <b>Curiosidade:</b> ${p.fact}</div>

      <p class="modal-actions">
        <button class="chip" data-fav="${p.name}">
          ${isFav ? "❤️ Remover dos favoritos" : "🤍 Favoritar"}
        </button>
      </p>
    </div>`;
}


/* ---------- 5. AÇÕES ---------- */
function showScreen(id) {
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.toggle("active", screen.id === id);
  });
  window.scrollTo(0, 0);
}

function openModal(name) {
  state.openPlant = name;
  renderDetails(findPlant(name));
  $("modal").classList.add("open");
}

function closeModal() {
  state.openPlant = null;
  $("modal").classList.remove("open");
}

// Vai para a próxima (+1) ou anterior (-1) planta dentro dos filtros atuais
function navigate(step) {
  const visible = getVisiblePlants();
  if (!visible.length) return;
  const current = visible.findIndex((p) => p.name === state.openPlant);
  const next = (current + step + visible.length) % visible.length;
  openModal(visible[next].name);
}

function toggleFavorite(name) {
  if (state.favorites.has(name)) state.favorites.delete(name);
  else state.favorites.add(name);

  saveFavorites();
  renderCatalog();
  if (state.openPlant) renderDetails(findPlant(state.openPlant));
}

function toggleTheme() {
  const root = document.documentElement;
  const isDark = root.dataset.theme
    ? root.dataset.theme === "dark"
    : window.matchMedia("(prefers-color-scheme: dark)").matches;
  root.dataset.theme = isDark ? "light" : "dark";
}


/* ---------- 6. EVENTOS ---------- */

// Troca de tela (botões com data-go)
document.addEventListener("click", (e) => {
  const goBtn = e.target.closest("[data-go]");
  if (goBtn) showScreen(goBtn.dataset.go);
});

// Filtro de dificuldade
$("difficultyFilters").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-level]");
  if (!btn) return;
  state.difficulty = Number(btn.dataset.level);
  renderCatalog();
});

$("petBtn").addEventListener("click", () => { state.onlyPetSafe = !state.onlyPetSafe; renderCatalog(); });
$("favBtn").addEventListener("click", () => { state.onlyFavorites = !state.onlyFavorites; renderCatalog(); });
$("searchInput").addEventListener("input", (e) => { state.search = e.target.value.toLowerCase(); renderCatalog(); });

// Cards: favoritar (coração) ou abrir detalhes
$("plantGrid").addEventListener("click", (e) => {
  const fav = e.target.closest("[data-fav]");
  if (fav) return toggleFavorite(fav.dataset.fav);

  const card = e.target.closest(".card");
  if (card) openModal(card.dataset.name);
});
$("plantGrid").addEventListener("keydown", (e) => {
  const card = e.target.closest(".card");
  if (e.key === "Enter" && card) openModal(card.dataset.name);
});

// Modal
$("modalContent").addEventListener("click", (e) => {
  const fav = e.target.closest("[data-fav]");
  if (fav) toggleFavorite(fav.dataset.fav);
});
$("closeBtn").addEventListener("click", closeModal);
$("prevBtn").addEventListener("click", () => navigate(-1));
$("nextBtn").addEventListener("click", () => navigate(1));
$("modal").addEventListener("click", (e) => { if (e.target === $("modal")) closeModal(); });

document.addEventListener("keydown", (e) => {
  if (!state.openPlant) return;
  if (e.key === "Escape") closeModal();
  if (e.key === "ArrowRight") navigate(1);
  if (e.key === "ArrowLeft") navigate(-1);
});

$("themeBtn").addEventListener("click", toggleTheme);


/* ---------- 7. INICIALIZAÇÃO ---------- */
function init() {
  loadFavorites();

  // Estatísticas da tela inicial
  $("statSpecies").textContent = plants.length;
  $("statPet").textContent = plants.filter((p) => p.petSafe).length;
  $("statEasy").textContent = plants.filter((p) => p.difficulty === 1).length;

  renderCatalog();
}

init();
