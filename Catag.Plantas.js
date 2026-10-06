// Lista de plantas: para adicionar uma nova, copie um bloco e troque os dados
const plants = [
  {n:"Monstera", s:"Monstera deliciosa", e:"🍃", r:"América Central e México", c:"Tropical", l:"Meia-sombra", a:"1x por semana", p:"Grande (até 3 m)", f:"As folhas furadas ajudam a planta a resistir a ventos fortes na floresta."},
  {n:"Samambaia", s:"Nephrolepis exaltata", e:"🌿", r:"Regiões tropicais, incluindo o Brasil", c:"Tropical úmido", l:"Sombra / luz difusa", a:"Solo sempre úmido", p:"Médio (até 90 cm)", f:"Samambaias existem há mais de 300 milhões de anos, antes dos dinossauros."},
  {n:"Espada-de-São-Jorge", s:"Dracaena trifasciata", e:"🗡️", r:"África Ocidental", c:"Tropical seco", l:"Sol pleno a sombra", a:"A cada 2–3 semanas", p:"Médio (até 1 m)", f:"É muito resistente e tolera esquecimentos de rega."},
  {n:"Jiboia", s:"Epipremnum aureum", e:"🌱", r:"Ilhas do Pacífico Sul (Polinésia)", c:"Tropical", l:"Meia-sombra", a:"1–2x por semana", p:"Trepadeira (vários metros)", f:"Pode crescer em água, sem terra, por meses."},
  {n:"Bromélia", s:"Guzmania spp.", e:"🌺", r:"Mata Atlântica e Américas", c:"Tropical úmido", l:"Luz difusa", a:"Água no centro (copo)", p:"Pequeno a médio", f:"O 'copo' no centro acumula água da chuva e abriga pequenos animais."},
  {n:"Orquídea", s:"Phalaenopsis", e:"🌸", r:"Sudeste Asiático", c:"Tropical úmido", l:"Luz indireta forte", a:"1x por semana", p:"Pequeno (40–60 cm)", f:"Uma flor pode durar até 3 meses aberta."},
  {n:"Aloe vera", s:"Aloe vera", e:"🪴", r:"Península Arábica", c:"Árido / semiárido", l:"Sol pleno", a:"A cada 2 semanas", p:"Pequeno (até 60 cm)", f:"O gel das folhas é usado há milênios em cuidados com a pele."},
  {n:"Lavanda", s:"Lavandula angustifolia", e:"💜", r:"Mediterrâneo", c:"Mediterrâneo / seco", l:"Sol pleno", a:"Moderada, sem encharcar", p:"Médio (até 80 cm)", f:"Suas flores atraem abelhas e borboletas."}
];

const regs = ["Todas", ...new Set(plants.map(p => p.c))];
let cur = "Todas";

// Troca de tela (introdução <-> catálogo)
function go(id){
  document.querySelectorAll('.screen').forEach(s => s.classList.toggle('on', s.id === id));
  scrollTo(0, 0);
}

// Desenha filtros e cards
function render(){
  document.getElementById('filters').innerHTML = regs
    .map(r => `<button class="chip ${r === cur ? 'on' : ''}" onclick="cur='${r}';render()">${r}</button>`)
    .join('');

  const list = plants.filter(p => cur === "Todas" || p.c === cur);

  document.getElementById('grid').innerHTML = list.length
    ? list.map(p => `
        <button class="card" onclick="openM('${p.n}')">
          <div class="e">${p.e}</div>
          <h3>${p.n}</h3>
          <i>${p.s}</i>
          <small>Ver detalhes</small>
        </button>`).join('')
    : '<div class="none">Nenhuma planta encontrada.</div>';
}

// Abre a janela com os detalhes da planta
function openM(n){
  const p = plants.find(x => x.n === n);
  document.getElementById('detail').innerHTML = `
    <div class="e">${p.e}</div>
    <h3>${p.n}</h3>
    <p class="sci">${p.s}</p>
    <dl>
      <dt>Região</dt><dd>${p.r}</dd>
      <dt>Clima</dt><dd>${p.c}</dd>
      <dt>Luz</dt><dd>${p.l}</dd>
      <dt>Rega</dt><dd>${p.a}</dd>
      <dt>Porte</dt><dd>${p.p}</dd>
    </dl>
    <div class="fact">💡 ${p.f}</div>`;
  document.getElementById('modal').classList.add('on');
}

function closeM(){
  document.getElementById('modal').classList.remove('on');
}

// Fecha com a tecla Esc
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeM(); });

render();