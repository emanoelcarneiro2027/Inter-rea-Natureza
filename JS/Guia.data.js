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
   origin: nativa | introduzida (diga sempre a origem; espécie introduzida
          não deve ser espalhada em vegetação nativa) · originNote: texto da origem
   tags:  Pioneira | Restinga e Mata | Frutífera nativa | PANC | Uso tradicional
          (Nativa e Introduzida vêm do campo origin e aparecem como filtro)
   Os textos são resumos para estudo. Confirme cada dado nas
   fontes (seção 8) antes de citá-lo no artigo.
------------------------------------------- */
const SPECIES = [
  {
    id: "caupi", name: "Feijão-caupi", sci: "Vigna unguiculata (L.) Walp.", family: "Fabaceae",
    origin: "introduzida",
    originNote: "Veio da África. Segundo a Embrapa, chegou ao Brasil na segunda metade do século XVI, pela Bahia, e dali se espalhou pelo país.",
    tags: ["Uso tradicional"], roles: ["cobertura", "solo", "alimento"], fit: 3,
    ecology: "Leguminosa que se associa a bactérias do solo e fixa nitrogênio. Cresce em solos pobres e aguenta falta de água, por isso é muito usada para cobrir e melhorar a terra.",
    culture: "É o feijão-de-corda, feijão-macassar ou feijão-fradinho. O fradinho é a base do acarajé, e o Ofício das Baianas de Acarajé foi registrado pelo Iphan como patrimônio imaterial em 2005.",
    seed: ["Semente grande e uniforme, fácil de contar e de envolver.", "Costuma germinar em poucos dias. Confirme no seu próprio teste de germinação."],
    bomb: "Boa candidata para o primeiro ensaio: com ela dá para comparar as formulações em pouco tempo. É anual, então serve mais para cobrir o solo e melhorar a terra do que para restaurar mata.",
    caution: "Não consuma o feijão cru: ele precisa de cozimento."
  },
  {
    id: "maxixe", name: "Maxixe", sci: "Cucumis anguria L.", family: "Cucurbitaceae",
    origin: "introduzida",
    originNote: "Originário da África tropical, segundo a Embrapa. Hoje é um alimento de regiões de forte influência africana no Brasil, como o Nordeste.",
    tags: ["PANC"], roles: ["cobertura", "alimento"], fit: 2,
    ecology: "Trepadeira rasteira, anual, que cobre o solo com rapidez. É rústica e tolera calor e chuva forte. As flores recebem visita de abelhas.",
    culture: "O fruto, verde e com espinhos macios, é comido cozido, cru em salada ou em conserva. Está na mesa de muitas famílias do Nordeste.",
    seed: ["Sementes achatadas, em grande número dentro do fruto.", "O fruto fica pronto para colher uns 55 a 65 dias depois da semeadura."],
    bomb: "Funciona melhor em horta comunitária do que em restauração de mata. As sementes cabem na bomba, mas teste o encaixe e o tamanho da esfera.",
    caution: "É espécie introduzida: não espalhe em restinga ou mata nativa preservada."
  },
  {
    id: "linguadevaca", name: "Língua-de-vaca", sci: "Rumex obtusifolius L.", family: "Polygonaceae",
    origin: "introduzida",
    originNote: "Espécie de origem europeia, hoje espalhada pelo mundo. Confirme a origem e o status no Brasil na Flora e Funga do Brasil.",
    tags: ["PANC"], roles: ["alimento"], fit: 0,
    ecology: "Erva perene de áreas perturbadas e pastos. Cada planta pode produzir dezenas de milhares de sementes, que ficam dormentes no solo por anos. Por isso é tratada como planta invasora.",
    culture: "Folhas jovens de azedas do gênero Rumex são comidas como hortaliça em várias culturas, e a planta aparece em usos populares de remédio caseiro. Pergunte à comunidade como ela é usada aqui.",
    seed: ["Produz sementes pequenas em quantidade enorme.", "A dormência no solo é longa: outro motivo para não espalhar."],
    bomb: "Fica fora da bomba. É introduzida e invasora, e espalhar as sementes em área degradada pode piorar o problema. No guia, ela mostra por que a origem da espécie importa.",
    caution: "As folhas têm oxalato: com problema nos rins, evite. Cite sempre o nome científico, porque \"língua-de-vaca\" também é nome popular de outras plantas, como a Chaptalia nutans."
  },
  {
    id: "urucum", name: "Urucum", sci: "Bixa orellana L.", family: "Bixaceae",
    origin: "nativa",
    originNote: "Nativa da América tropical. É cultivada e usada por povos indígenas do Brasil.",
    tags: ["Uso tradicional"], roles: ["cobertura", "fauna"], fit: 3,
    ecology: "Arbusto de crescimento rápido que se dá bem em áreas abertas. As flores costumam receber abelhas.",
    culture: "As sementes são cobertas por uma tinta vermelha, usada por povos indígenas na pintura do corpo e no preparo de alimentos. O colorau da cozinha brasileira é feito com ela.",
    seed: ["Sementes pequenas e numerosas, fáceis de tirar das cápsulas secas.", "Teste a germinação do lote antes de contar as sementes por bomba."],
    bomb: "Boa candidata: sementes pequenas, fáceis de padronizar.",
    caution: "A tinta mancha mãos e roupas. Use luvas."
  },
  {
    id: "jenipapo", name: "Jenipapo", sci: "Genipa americana L.", family: "Rubiaceae",
    origin: "nativa",
    originNote: "Nativa do Brasil, com ocorrência em várias regiões. Confirme os registros na Bahia na Flora e Funga do Brasil.",
    tags: ["Frutífera nativa", "Uso tradicional"], roles: ["fauna", "alimento"], fit: 2,
    ecology: "Árvore de beira de rio e de matas úmidas. Os frutos carnosos são comidos por animais, que levam as sementes para longe.",
    culture: "O fruto vira licor e doce. O suco do fruto verde tinge de azul-escuro a preto e é usado por povos indígenas na pintura do corpo.",
    seed: ["Muitas sementes por fruto, que precisam ser lavadas para tirar a polpa.", "Alguns trabalhos relatam perda de viabilidade no armazenamento: faça teste de germinação antes."],
    bomb: "Exige cuidado: use sementes recém-lavadas e confirme a germinação do lote. Vale pela importância cultural ligada ao saber indígena.",
    caution: "O suco do fruto verde mancha a pele por dias."
  },
  {
    id: "caju", name: "Cajueiro", sci: "Anacardium occidentale L.", family: "Anacardiaceae",
    origin: "nativa",
    originNote: "Nativa do Brasil, comum no litoral do Nordeste, inclusive em restingas.",
    tags: ["Frutífera nativa", "Restinga e Mata"], roles: ["fauna", "alimento"], fit: 2, flags: ["grande"],
    ecology: "Árvore de restinga e dunas, que aguenta solo arenoso e pobre. O pedúnculo (o \"caju\") é comido por vários animais.",
    culture: "O pedúnculo é consumido in natura, em suco e em doce, e a castanha é muito apreciada. O nome vem do tupi.",
    seed: ["A semente é a castanha, de casca dura. Use castanhas de frutos maduros.", "É grande: não cabe em bomba pequena."],
    bomb: "Faça a bomba maior ou plante a castanha direto no solo.",
    caution: "A casca da castanha tem óleo cáustico que queima a pele. Use luvas e não quebre a casca com a mão."
  },
  {
    id: "caja", name: "Cajá", sci: "Spondias mombin L.", family: "Anacardiaceae",
    origin: "nativa",
    originNote: "Nativa do Brasil. Confirme a ocorrência na Bahia na Flora e Funga do Brasil.",
    tags: ["Frutífera nativa"], roles: ["fauna", "alimento"], fit: 2, flags: ["grande"],
    ecology: "Árvore grande, que costuma perder folhas na seca. Os frutos amarelos alimentam muitos animais.",
    culture: "O cajá, também chamado de taperebá, é muito usado em suco, sorvete e polpa no Nordeste.",
    seed: ["A semente fica dentro de um caroço duro e fibroso.", "A germinação costuma ser lenta e irregular: confirme tratamentos na literatura."],
    bomb: "Caroço grande: faça a bomba maior ou plante direto.",
    caution: ""
  },
  {
    id: "sabia", name: "Sabiá", sci: "Mimosa caesalpiniifolia Benth.", family: "Fabaceae",
    origin: "nativa",
    originNote: "Nativa do Nordeste do Brasil, típica da Caatinga. Confirme se ocorre em Camaçari antes de usar na área.",
    tags: ["Pioneira"], roles: ["cobertura", "solo", "fauna"], fit: 3, flags: ["dormencia"],
    ecology: "Leguminosa de crescimento rápido, que fixa nitrogênio e cresce em solo pobre. É usada para recuperar áreas degradadas. As flores atraem abelhas.",
    culture: "A madeira serve para estacas e lenha, e as folhas são forragem na seca do sertão.",
    seed: ["Tegumento duro: trabalhos com a espécie recomendam quebrar a dormência, com água quente ou escarificação."],
    bomb: "Boa candidata, depois de quebrar a dormência. Faça isso antes de moldar a bomba.",
    caution: "Os ramos têm espinhos. Use luvas."
  },
  {
    id: "maracujacaatinga", name: "Maracujá-da-caatinga", sci: "Passiflora cincinnata Mast.", family: "Passifloraceae",
    origin: "nativa",
    originNote: "Nativa do Brasil, típica da Caatinga e do semiárido. Não é espécie de restinga.",
    tags: ["Frutífera nativa", "PANC"], roles: ["fauna", "alimento"], fit: 2,
    ecology: "Trepadeira de áreas abertas. As flores grandes costumam ser visitadas por abelhas grandes, como as mamangavas.",
    culture: "O fruto é comido in natura e em suco, e é colhido por comunidades do semiárido.",
    seed: ["Muitas sementes por fruto, cobertas por uma polpa que precisa ser lavada.", "Sementes de maracujá costumam ter germinação lenta e irregular."],
    bomb: "Sementes pequenas, de bom encaixe. Reserve mais tempo de observação no ensaio.",
    caution: ""
  },
  {
    id: "pitomba", name: "Pitomba", sci: "Talisia esculenta (A.St.-Hil.) Radlk.", family: "Sapindaceae",
    origin: "nativa",
    originNote: "Nativa do Brasil, comum em quintais do Nordeste. Confirme a ocorrência na Bahia na Flora e Funga do Brasil.",
    tags: ["Frutífera nativa"], roles: ["fauna", "alimento"], fit: 1, flags: ["fresca", "grande"],
    ecology: "Árvore de porte médio. O fruto é comido por aves e mamíferos.",
    culture: "O fruto, de polpa gelatinosa e agridoce, é comum em quintais e feiras do Nordeste.",
    seed: ["Semente grande. Estudos indicam que as sementes do gênero perdem a viabilidade rápido.", "Semeie logo depois de tirar a polpa."],
    bomb: "Só com semente fresca, e em bomba grande ou plantio direto.",
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
const TAGS = ["Todas", "Nativa", "Introduzida", "Pioneira", "Restinga e Mata", "Frutífera nativa", "PANC", "Uso tradicional"];
/* ---------- FOTOS DAS ESPÉCIES ----------
   Coloque as fotos na pasta img/ (ao lado do index.html) e preencha aqui.
   Se a foto não existir ou não carregar, o cartão volta ao desenho com a letra.
   Use só fotos suas ou com licença livre (ex.: Wikimedia Commons, CC BY / CC BY-SA)
   e SEMPRE escreva o crédito: autor, licença e link da página da foto.
   Exemplo:
     caupi: { src: "img/caupi.jpg", alt: "Vagens e flor do feijão-caupi",
              credit: "Foto: Fulano, CC BY-SA 4.0, via Wikimedia Commons" },
   Ids: caupi, maxixe, linguadevaca, urucum, jenipapo, caju, caja, sabia,
        maracujacaatinga, pitomba
------------------------------------------- */
const PHOTOS = {
  caupi: {
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdev8CQWx7L0MLVdPe4KAYwJQEY2gG3fhEM_ZmcaK2scGBJtFdk1G3BbsYggfr3RaEDO9navY6yhrhTCwGBOsMA97bGKdEhHlZwS6Ngxk&s=10",
    alt: "Feijão-caupi (Vigna unguiculata)",
    credit: "Foto: [MyGardenLife], [licença]"
  }
};

const ORIGIN_LABELS = { nativa: "Nativa", introduzida: "Introduzida" };


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
    desc: "Acrescenta a parte microbiológica. Exemplos: rizóbios para leguminosas que formam nódulos, como o caupi e o sabiá, ou o fungo Trichoderma, que protege contra fungos de solo. Use apenas produtos registrados e com orientação."
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
             Sugestão inicial: ajuste conforme a escolha da equipe.
   RESULTS:  medidas dos ensaios, publicadas para todos os visitantes.
             Comece vazio. Quando houver dados, digite-os na "Área da equipe"
             da página Resultados, clique em "Copiar dados para publicar" e
             cole aqui no lugar de [].
   TESTIMONIES: registros feitos com as comunidades, SOMENTE com autorização.
             Formato: { name: "", community: "", practice: "", text: "" }
------------------------------------------- */
const SELECTED = ["caupi", "maxixe", "urucum", "sabia"];

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
    { t: "Feijão-caupi no Brasil (Embrapa)", u: "https://www.alice.cnptia.embrapa.br/alice/bitstream/doc/974091/1/FRIJOLCAUPIBRASIL.pdf", n: "Origem africana, chegada ao Brasil pela Bahia no século XVI, fixação de nitrogênio e tolerância à seca." },
    { t: "Maxixe, Horticultura Brasileira (Embrapa)", u: "https://www.alice.cnptia.embrapa.br/alice/bitstream/doc/133010/1/HorticulturaBrasileirav.16n.2p.1671711998.pdf", n: "Origem na África tropical, uso culinário e hábito da planta." },
    { t: "Língua-de-vaca (Agrolink)", u: "https://www.agrolink.com.br/problema/lingua-de-vaca_348.html", n: "Rumex obtusifolius como planta invasora, com até 60 mil sementes por planta e dormência de anos." },
    { t: "Mata Atlântica na APA do Pratigi, Bahia (repositório da UFRB)", u: "https://ri.ufrb.edu.br/handle/123456789/2717", n: "342 espécies arbóreas em 162 hectares; Myrtaceae é a família mais rica." }
  ],
  consult: [
    { t: "Flora e Funga do Brasil", u: "https://floradobrasil.jbrj.gov.br", n: "Confirme a origem e a ocorrência de cada espécie na Bahia." },
    { t: "speciesLink", u: "https://specieslink.net", n: "Registros de coleta por município: use para checar Camaçari." },
    { t: "Kinupp e Lorenzi (2014). Plantas Alimentícias Não Convencionais (PANC) no Brasil", u: "", n: "Guia de identificação e usos das PANCs." },
    { t: "Lei nº 13.123/2015 (Lei da Biodiversidade)", u: "", n: "Regras para acesso ao conhecimento tradicional associado. Converse com o professor antes de registrar saberes." },
    { t: "Iphan: Ofício das Baianas de Acarajé", u: "http://portal.iphan.gov.br", n: "Registro como patrimônio imaterial (2005). Confira o dossiê para citar." },
    { t: "INMET", u: "https://portal.inmet.gov.br", n: "Séries de chuva para definir a época de dispersão." }
  ]
};
