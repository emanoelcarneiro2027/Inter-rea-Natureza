/* =====================================================
   GUIA ETNOBOTÂNICO – dados do projeto
   Edite este arquivo para ajustar espécies, formulações,
   fontes e resultados publicados. O site lê tudo daqui.

   Índice:
   1. Espécies
   2. Papéis ecológicos e níveis de aptidão
   3. Formulações das bombas de sementes
   4. Camadas do diagrama da bomba
   5. Passo a passo da produção
   6. Espécies selecionadas, resultados e registros
   7. Equipe
   8. Fontes
   ===================================================== */
"use strict";


/* ---------- 1. ESPÉCIES ----------
   fit:  0 fora da bomba · 1 só semente fresca · 2 exige cuidado · 3 boa candidata
   flags (opcional, alimenta os avisos do montador):
         fresca (semente recalcitrante) | dormencia | luz | grande
   roles: cobertura | solo | fauna | alimento | conservacao
   tags:  Pioneira | Restinga e Mata | Frutífera nativa | PANC
   Os textos são resumos para estudo. Confirme cada dado nas
   fontes (seção 8) antes de citá-lo no artigo.
------------------------------------------- */
const SPECIES = [
  {
    id: "aroeira", name: "Aroeira-vermelha", sci: "Schinus terebinthifolia", family: "Anacardiaceae",
    tags: ["Pioneira", "Restinga e Mata"], roles: ["cobertura", "fauna"], fit: 3,
    ecology: "Pioneira de crescimento rápido, comum em restingas e bordas de mata. Os frutos alimentam aves, que ajudam a espalhar as sementes.",
    culture: "Os frutos são a pimenta-rosa da culinária. Casca e folhas aparecem em usos medicinais populares.",
    seed: ["Retirar a polpa do fruto costuma melhorar a germinação.", "Guardar seca e fresca, por pouco tempo."],
    bomb: "Boa candidata: sementes pequenas, fáceis de envolver na argila.",
    caution: "Pode causar dermatite de contato em pessoas sensíveis. Use luvas."
  },
  {
    id: "embauba", name: "Embaúba", sci: "Cecropia pachystachya", family: "Urticaceae",
    tags: ["Pioneira"], roles: ["cobertura", "fauna"], fit: 3, flags: ["luz"],
    ecology: "Ocupa clareiras e áreas abertas, sombreia o solo e atrai aves e morcegos pelos frutos.",
    culture: "As folhas têm uso medicinal popular, em chás. É uma referência quando se fala de regeneração da mata.",
    seed: ["Sementes minúsculas que precisam de luz para germinar: não enterre.", "Uma casca grossa de argila pode bloquear a luz."],
    bomb: "Teste uma camada fina de argila ou deixe as sementes na superfície da bomba. É uma boa pergunta para o experimento.",
    caution: ""
  },
  {
    id: "inga", name: "Ingá", sci: "Inga spp. (ex.: Inga laurina)", family: "Fabaceae",
    tags: ["Frutífera nativa", "Restinga e Mata"], roles: ["solo", "fauna", "alimento"], fit: 1, flags: ["fresca"],
    ecology: "Leguminosa que se associa a bactérias fixadoras de nitrogênio e melhora o solo. As flores atraem beija-flores e abelhas.",
    culture: "A polpa branca e doce do fruto é comida in natura. A árvore é comum em quintais e beiras de rio.",
    seed: ["Sementes recalcitrantes: perdem a viabilidade em poucos dias e não toleram secagem."],
    bomb: "Só funciona com sementes recém-colhidas, em bombas feitas e semeadas no mesmo dia. Não serve para estoque.",
    caution: ""
  },
  {
    id: "jatoba", name: "Jatobá", sci: "Hymenaea courbaril", family: "Fabaceae",
    tags: ["Frutífera nativa", "Restinga e Mata"], roles: ["fauna", "alimento"], fit: 2, flags: ["dormencia", "grande"],
    ecology: "Árvore grande e longeva. Cutias e outros roedores enterram suas sementes e ajudam na dispersão.",
    culture: "A polpa farinácea do fruto é consumida. A resina, a jutaicica, tem usos tradicionais.",
    seed: ["Tegumento muito duro: precisa de quebra de dormência (escarificação mecânica ou ácida).", "A Embrapa lista o jatobá entre as espécies com esse tratamento."],
    bomb: "Escarifique antes. As sementes são grandes, então a bomba precisa ser maior ou a semente vai direto ao solo.",
    caution: "Ao lixar as sementes, use luvas e óculos."
  },
  {
    id: "mulungu", name: "Mulungu", sci: "Erythrina velutina", family: "Fabaceae",
    tags: ["Pioneira", "Restinga e Mata"], roles: ["cobertura", "solo", "fauna"], fit: 3, flags: ["dormencia"],
    ecology: "Leguminosa de crescimento rápido. As flores, ricas em néctar, atraem aves e abelhas.",
    culture: "A casca é usada em chás calmantes na medicina popular.",
    seed: ["Tegumento impermeável: escarificar ou imergir em água ajuda a germinar."],
    bomb: "Tamanho médio, bom encaixe na bomba. Escarifique antes de moldar.",
    caution: "As sementes de Erythrina são tóxicas se ingeridas. Mantenha longe de crianças e animais."
  },
  {
    id: "pitanga", name: "Pitanga", sci: "Eugenia uniflora", family: "Myrtaceae",
    tags: ["Frutífera nativa", "Restinga e Mata"], roles: ["fauna", "alimento"], fit: 2, flags: ["fresca"],
    ecology: "Myrtaceae é a família com mais espécies na Mata Atlântica e nas restingas. A pitangueira alimenta aves e insetos.",
    culture: "O fruto é comum em quintais e as folhas são usadas em chás populares.",
    seed: ["As sementes perdem a viabilidade rápido: semeie logo depois de tirar a polpa."],
    bomb: "Use bombas feitas e semeadas em poucos dias.",
    caution: ""
  },
  {
    id: "murici", name: "Murici", sci: "Byrsonima blanchetiana", family: "Malpighiaceae",
    tags: ["Restinga e Mata", "Frutífera nativa"], roles: ["fauna", "alimento"], fit: 2,
    ecology: "Aparece entre as espécies de maior valor de importância na restinga em moitas de Praia do Forte, no Litoral Norte da Bahia.",
    culture: "As espécies de Byrsonima são chamadas de muricis, e seus frutos são consumidos no Nordeste.",
    seed: ["Endocarpo duro e germinação lenta e irregular em espécies do gênero.", "Há pouca informação específica para esta espécie."],
    bomb: "Bom tema de experimento: use sementes bem limpas e mais tempo de observação.",
    caution: ""
  },
  {
    id: "mangaba", name: "Mangaba", sci: "Hancornia speciosa", family: "Apocynaceae",
    tags: ["Frutífera nativa", "Restinga e Mata"], roles: ["fauna", "alimento"], fit: 1, flags: ["fresca"],
    ecology: "Árvore típica de restingas e tabuleiros costeiros do Nordeste. O fruto alimenta a fauna.",
    culture: "É colhida do chão quando cai madura. As catadoras de mangaba, mulheres extrativistas, são reconhecidas como comunidade tradicional no Nordeste, com destaque para Sergipe.",
    seed: ["Sementes recalcitrantes: semeie frescas."],
    bomb: "Só com semente fresca. Respeite a colheita tradicional: pegue frutos caídos e deixe parte para a fauna.",
    caution: ""
  },
  {
    id: "araca", name: "Araçá", sci: "Psidium guineense", family: "Myrtaceae",
    tags: ["Frutífera nativa", "Restinga e Mata", "PANC"], roles: ["fauna", "alimento"], fit: 3,
    ecology: "Arbusto de áreas abertas e restingas. Os frutos atraem aves e pequenos mamíferos.",
    culture: "O fruto, ácido e doce, é comido in natura e em doces e sucos. Folhas são usadas em chás populares.",
    seed: ["Sementes pequenas e numerosas, que germinam bem depois de retirar a polpa."],
    bomb: "Boa candidata, de tamanho fácil de padronizar.",
    caution: ""
  },
  {
    id: "jurubeba", name: "Jurubeba", sci: "Solanum paniculatum", family: "Solanaceae",
    tags: ["Pioneira", "PANC"], roles: ["cobertura", "alimento"], fit: 3,
    ecology: "Arbusto pioneiro de áreas abertas e pastos degradados. As flores atraem abelhas e os frutos atraem aves.",
    culture: "Os frutos verdes entram cozidos em pratos regionais e em conservas. A planta também tem uso medicinal popular.",
    seed: ["Sementes pequenas, boas para a bomba."],
    bomb: "Boa candidata, e é uma PANC nativa.",
    caution: "Não coma cru. Confirme a identificação antes de consumir, porque existem Solanum tóxicos."
  },
  {
    id: "oranobis", name: "Ora-pro-nóbis", sci: "Pereskia aculeata", family: "Cactaceae",
    tags: ["PANC"], roles: ["alimento"], fit: 0,
    ecology: "Cacto trepador nativo das Américas. As flores e os frutos alimentam polinizadores e aves, e a cerca viva espinhosa abriga fauna.",
    culture: "Uma das PANCs mais conhecidas do país. As folhas são ricas em proteína e em mucilagem.",
    seed: ["Multiplica-se bem por estaca. A propagação por sementes é menos comum."],
    bomb: "Fica fora da bomba como semente. Entra no experimento por outro caminho: a mucilagem das folhas é uma hipótese de aglutinante natural, testada na formulação F4.",
    caution: "Tem espinhos. Use luvas."
  },
  {
    id: "taioba", name: "Taioba", sci: "Xanthosoma sagittifolium", family: "Araceae",
    tags: ["PANC"], roles: ["alimento"], fit: 0,
    ecology: "Cobre o solo úmido de quintais e beiras de córrego.",
    culture: "As folhas cozidas são consumidas em várias regiões do país.",
    seed: ["Multiplica-se por rizoma, não por semente."],
    bomb: "Fora da bomba. Entra nas orientações de plantio comunitário em áreas úmidas.",
    caution: "Coma somente cozida: a folha crua contém oxalato de cálcio."
  },
  {
    id: "paubrasil", name: "Pau-brasil", sci: "Paubrasilia echinata", family: "Fabaceae",
    tags: ["Restinga e Mata"], roles: ["conservacao", "fauna"], fit: 2, flags: ["fresca"],
    ecology: "Árvore da Mata Atlântica ameaçada de extinção. A exploração do pau-brasil marcou o início da degradação do bioma.",
    culture: "Dá nome ao país. A madeira teve valor tintorial e, depois, serviu para arcos de violino.",
    seed: ["Sementes de viabilidade curta: semeie frescas."],
    bomb: "Use com sementes frescas e bombas semeadas logo.",
    caution: ""
  }
];


/* ---------- 2. PAPÉIS ECOLÓGICOS E APTIDÃO ---------- */
const ROLE_LABELS = {
  cobertura: "Cobre o solo rápido",
  solo: "Melhora o solo (fixa nitrogênio)",
  fauna: "Alimenta a fauna",
  alimento: "Alimenta pessoas",
  conservacao: "Conserva espécie ameaçada"
};
const MAIN_ROLES = ["cobertura", "solo", "fauna", "alimento"];

const FIT_LABELS = ["Fora da bomba", "Só semente fresca", "Exige cuidado", "Boa candidata"];
const TAGS = ["Todas", "Pioneira", "Restinga e Mata", "Frutífera nativa", "PANC"];


/* ---------- 3. FORMULAÇÕES ----------
   parts: proporção em volume (mesmo copo medidor).
   Água entra até a massa ficar moldável.
   São propostas de partida: os testes dizem qual funciona melhor.
   tests: quais ensaios se aplicam à formulação.
------------------------------------------- */
const FORMULATIONS = [
  {
    id: "F0", short: "Controle", name: "Controle: semente sem revestimento",
    parts: [], tests: ["ger"],
    desc: "Sementes semeadas direto no mesmo substrato, sem bomba. É a base de comparação da germinação."
  },
  {
    id: "F1", short: "Argila + terra", name: "Argila e terra local",
    parts: [["Argila", 3], ["Terra local", 1]], tests: ["res", "ret", "ger"],
    desc: "A formulação mais simples. Mostra o que a argila sozinha já entrega."
  },
  {
    id: "F2", short: "+ Húmus", name: "Argila e húmus",
    parts: [["Argila", 3], ["Húmus ou composto", 1]], tests: ["res", "ret", "ger"],
    desc: "Troca a terra por húmus para dar nutrientes e microrganismos à plântula."
  },
  {
    id: "F3", short: "+ Biochar", name: "Argila, húmus e biochar",
    parts: [["Argila", 3], ["Húmus ou composto", 1], ["Biochar moído", 0.5]], tests: ["res", "ret", "ger"],
    desc: "O carvão vegetal moído tem poros que guardam água e nutrientes. Inspirado na terra preta de índio, da Amazônia."
  },
  {
    id: "F4", short: "+ Mucilagem", name: "F3 com mucilagem vegetal",
    parts: [["Argila", 3], ["Húmus ou composto", 1], ["Biochar moído", 0.5]], liquid: "Mucilagem de ora-pro-nóbis no lugar da água pura", tests: ["res", "ret", "ger"],
    desc: "A mucilagem, um gel natural das folhas de ora-pro-nóbis, pode colar a mistura e segurar água. A concentração também é uma variável a testar."
  },
  {
    id: "F5", short: "+ Inóculo", name: "F4 com inóculo microbiano",
    parts: [["Argila", 3], ["Húmus ou composto", 1], ["Biochar moído", 0.5]], liquid: "Mucilagem de ora-pro-nóbis", extra: "Inóculo microbiano: defina com o professor",
    tests: ["res", "ret", "ger"],
    desc: "Acrescenta a parte microbiológica. Exemplos: rizóbios para leguminosas que formam nódulos, como o ingá, ou o fungo Trichoderma, que protege contra fungos de solo. Use apenas produtos registrados e com orientação."
  }
];


/* ---------- 4. CAMADAS DO DIAGRAMA ---------- */
const LAYERS = {
  argila: {
    title: "Casca de argila",
    text: "Protege a semente de formigas, aves e chuva forte, e do sol enquanto ela espera a chuva. A argila também segura umidade ao redor da semente.",
    test: "Testado em: resistência mecânica e retenção hídrica."
  },
  humus: {
    title: "Húmus e composto",
    text: "Dão nutrientes e microrganismos para a plântula nos primeiros dias de vida.",
    test: "Testado em: germinação."
  },
  biochar: {
    title: "Biochar (carvão vegetal moído)",
    text: "Tem poros que guardam água e nutrientes. A inspiração é a terra preta de índio, solo rico em carvão documentado na Amazônia. A ligação com o litoral baiano é uma inspiração, não uma equivalência.",
    test: "Testado em: retenção hídrica."
  },
  mucilagem: {
    title: "Mucilagem vegetal",
    text: "Gel natural, como o das folhas de ora-pro-nóbis, que pode colar a mistura e segurar mais água. É uma hipótese para testar na formulação F4, não um resultado.",
    test: "Testado em: resistência mecânica e retenção hídrica."
  },
  semente: {
    title: "Semente e inóculo microbiano",
    text: "Semente de espécie nativa de matriz local, pré-tratada se precisar. O inóculo é a parte microbiológica do produto: bactérias fixadoras de nitrogênio para leguminosas, ou fungos protetores.",
    test: "Testado em: germinação (F5 compara com e sem inóculo)."
  }
};


/* ---------- 5. PASSO A PASSO ---------- */
const BOMB_STEPS = [
  { title: "Colher com critério", text: "Colha frutos maduros de várias árvores locais da mesma espécie, de preferência saudáveis e próximas da área a restaurar. Isso mantém a diversidade genética e a adaptação ao lugar. Anote data, local e árvore-matriz." },
  { title: "Limpar e escolher", text: "Retire a polpa, lave e descarte sementes furadas, chochas ou mofadas. Em algumas espécies, as que boiam em água costumam estar vazias. Confira isso espécie por espécie." },
  { title: "Quebrar a dormência quando precisar", text: "Algumas espécies têm semente de casca dura. A Embrapa descreve a imersão em água quente (80 a 100 °C, deixando esfriar por até 24 horas), a escarificação mecânica com lixa e a escarificação ácida. O ácido não é para uso escolar; peça orientação ao professor para a água quente." },
  { title: "Preparar a argila", text: "Peneire para tirar pedras e raízes e deixe de molho até virar uma massa lisa. Misture os componentes da formulação em partes de volume, sempre com o mesmo copo medidor." },
  { title: "Moldar esferas padronizadas", text: "Envolva as sementes na massa e modele esferas do mesmo tamanho (por exemplo, 3 cm de diâmetro). Padronizar o tamanho é o que permite comparar as formulações." },
  { title: "Secar à sombra", text: "Deixe secar em local arejado, protegido do sol direto, virando as bombas. Sol forte racha a casca. Registre quantas horas levou: o tempo de secagem entra nos seus dados." },
  { title: "Etiquetar e guardar", text: "Etiquete cada lote com formulação, espécies e data. Guarde em local seco e fresco. Sementes recalcitrantes não podem ser guardadas: use no mesmo dia." },
  { title: "Registrar", text: "Fotografe o lote e pese uma amostra. Esses números entram no laboratório." }
];


/* ---------- 6. ESPÉCIES SELECIONADAS, RESULTADOS E REGISTROS ----------
   SELECTED: espécies escolhidas para o ensaio (aparecem marcadas no guia).
             Padrão: as de aptidão 3. Ajuste conforme a escolha da equipe.
   RESULTS:  medidas dos ensaios, publicadas para todos os visitantes.
             Comece vazio. Quando houver dados, digite-os na "Área da equipe"
             da página Resultados, clique em "Copiar dados para publicar" e
             cole aqui no lugar de [].
   TESTIMONIES: registros feitos com as comunidades, SOMENTE com autorização.
             Formato: { name: "", community: "", practice: "", text: "" }
------------------------------------------- */
const SELECTED = ["aroeira", "embauba", "mulungu", "araca", "jurubeba"];

const RESULTS = [];

const TESTIMONIES = [];


/* ---------- 7. EQUIPE ----------
   Preencha para aparecer na página Projeto. */
const TEAM = {
  turmas: "",
  orientadores: [],
  integrantes: []
};


/* ---------- 8. FONTES ----------
   read:    fontes que foram abertas e lidas para montar este guia.
   consult: referências para você consultar e citar no artigo. */
const SOURCES = {
  read: [
    { t: "Lélia, a amefricana (Jornal da USP)", u: "https://jornal.usp.br/?p=785360", n: "Conceito de Amefricanidade, cunhado em 1980." },
    { t: "Junho Ambiental: avanço das cidades ameaça a conservação da Mata Atlântica (MPF, 26/06/2026)", u: "https://www.mpf.mp.br/o-mpf/unidades/procuradoria-geral-da-republica-pgr/noticias/junho-ambiental-avanco-das-cidades-ameaca-a-conservacao-da-mata-atlantica", n: "Restam 24% da vegetação nativa; a expansão urbana desordenada fragmentou o bioma." },
    { t: "Bombas de sementes de castanha-do-Brasil (repositório do IFAP)", u: "https://repositorio.ifap.edu.br/bitstreams/5c5cd744-9d8d-42d4-b835-e3feb48ef839/download", n: "Desenho experimental com 3 tratamentos e 16 repetições. Germinação de 75%, 50% e 44%, sem diferença significativa (p = 0,177)." },
    { t: "Superação de dormência de sementes florestais (Embrapa, capítulo 5)", u: "https://www.alice.cnptia.embrapa.br/alice/bitstream/doc/299616/1/cap5SuperacaoDormencia0001.pdf", n: "Métodos de escarificação, água quente e imersão." },
    { t: "Restinga em Praia do Forte, Litoral Norte da Bahia (Revista Biotemas, 2012)", u: "https://periodicos.ufsc.br/index.php/biotemas/article/download/2175-7925.2012v25n1p31/20873/74801", n: "Espécies dominantes da restinga, incluindo Byrsonima blanchetiana. Famílias mais ricas: Myrtaceae, Rubiaceae e Malpighiaceae." },
    { t: "Mata Atlântica na APA do Pratigi, Bahia (repositório da UFRB)", u: "https://ri.ufrb.edu.br/handle/123456789/2717", n: "342 espécies arbóreas em 162 hectares; Myrtaceae é a família mais rica." }
  ],
  consult: [
    { t: "Flora e Funga do Brasil", u: "https://floradobrasil.jbrj.gov.br", n: "Confirme a origem e a ocorrência de cada espécie na Bahia." },
    { t: "speciesLink", u: "https://specieslink.net", n: "Registros de coleta por município: use para checar Camaçari." },
    { t: "Kinupp e Lorenzi (2014). Plantas Alimentícias Não Convencionais (PANC) no Brasil", u: "", n: "Guia de identificação e usos das PANCs." },
    { t: "Lei nº 13.123/2015 (Lei da Biodiversidade)", u: "", n: "Regras para acesso ao conhecimento tradicional associado. Converse com o professor antes de registrar saberes." },
    { t: "INMET", u: "https://portal.inmet.gov.br", n: "Séries de chuva para definir a época de dispersão." }
  ]
};
