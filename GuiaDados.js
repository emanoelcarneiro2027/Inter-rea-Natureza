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
   origin: nativa | introduzida (a maioria é nativa; maxixe e língua-de-vaca são
          introduzidas, estão aqui por terem sido usadas nos ensaios, e não devem
          ser espalhadas em vegetação nativa)
          · originNote: texto da origem, com a fonte
   tags:  Pioneira | Restinga e Mata | Frutífera nativa | PANC | Uso tradicional
          (a origem aparece na ficha; "Nativa" e "Introduzida" podem voltar a TAGS)
   Os textos são resumos para estudo. Confirme cada dado nas
   fontes (seção 8) antes de citá-lo no artigo.
------------------------------------------- */
const SPECIES = [
  {
    id: "aroeira", name: "Aroeira-vermelha", sci: "Schinus terebinthifolia Raddi", family: "Anacardiaceae",
    origin: "nativa",
    originNote: "Nativa do Brasil, do Rio Grande do Norte ao Rio Grande do Sul, segundo a Embrapa. Aparece em listas de plantas da restinga da Bahia.",
    tags: ["Pioneira", "Restinga e Mata", "PANC"], roles: ["cobertura", "fauna"], fit: 3,
    ecology: "Pioneira ou secundária inicial, que ocupa terrenos abandonados e beiras de estrada. Abelhas e outros insetos visitam as flores, e aves comem os frutos e levam as sementes para longe.",
    culture: "Os frutos vermelhos são a pimenta-rosa, e um estudo de PANCs da restinga de Maraú (BA) lista o fruto como condimento. A madeira vira lenha e moirão, e a planta já foi usada em curtume e perfumaria.",
    seed: ["Retirar a polpa do fruto costuma ajudar na germinação. Confirme no seu teste.", "Sementes pequenas, fáceis de envolver na argila."],
    bomb: "Boa candidata: é pioneira e a Embrapa aponta a recuperação de áreas degradadas como seu uso principal.",
    caution: "Há relatos de dermatite em pessoas sensíveis: use luvas. Fora da área natural ela pode virar invasora."
  },
  {
    id: "mangaba", name: "Mangaba", sci: "Hancornia speciosa Gomes", family: "Apocynaceae",
    origin: "nativa",
    originNote: "Nativa do Brasil. A Embrapa registra ocorrência natural na Bahia, em campo de restinga, mata de tabuleiro e dunas.",
    tags: ["Frutífera nativa", "Restinga e Mata"], roles: ["fauna", "alimento"], fit: 1, flags: ["fresca"],
    ecology: "Cresce em solos arenosos, ácidos e pobres, como os da restinga e do tabuleiro. A área natural sofre pressão da cana, do eucalipto e do setor imobiliário.",
    culture: "O fruto vira suco, sorvete, geleia, doce e licor. As catadoras de mangaba, em geral mulheres, são reconhecidas como grupo cultural diferenciado em Sergipe, e o produto está na lista da sociobiodiversidade da Conab.",
    seed: ["Sementes recalcitrantes: perdem rápido a capacidade de germinar.", "Para chegar a cerca de 90%, a Embrapa indica semear em até 4 dias depois de extrair e lavar, sem deixar secar. A emergência começa em cerca de 21 dias."],
    bomb: "Só com semente fresca, em bomba semeada logo. Respeite o extrativismo: pegue frutos caídos e deixe parte para a fauna e para as catadoras.",
    caution: ""
  },
  {
    id: "murici", name: "Murici", sci: "Byrsonima blanchetiana Miq.", family: "Malpighiaceae",
    origin: "nativa",
    originNote: "Espécie da restinga. Está entre as de maior importância na restinga em moitas de Praia do Forte, no Litoral Norte da Bahia, segundo a Revista Biotemas (2012).",
    tags: ["Restinga e Mata", "Frutífera nativa"], roles: ["fauna", "alimento"], fit: 2,
    ecology: "Praia do Forte fica ao lado de Camaçari e tem restinga parecida. O murici é uma das espécies que mais pesam na estrutura dessa vegetação.",
    culture: "As espécies de Byrsonima são chamadas de muricis, e seus frutos são consumidos no Nordeste.",
    seed: ["Endocarpo duro e germinação lenta e irregular são relatados em espécies do gênero.", "Há pouca informação específica para esta espécie."],
    bomb: "Bom tema de experimento: use sementes bem limpas e reserve mais tempo de observação.",
    caution: ""
  },
  {
    id: "cambui", name: "Cambuí", sci: "Myrciaria floribunda (H.West ex Willd.) O.Berg", family: "Myrtaceae",
    origin: "nativa",
    originNote: "Nativa. A Embrapa registra ocorrência na Bahia, em restinga e na transição para a Mata Atlântica. Está entre as espécies de maior importância na restinga de Praia do Forte (Revista Biotemas, 2012), vizinha de Camaçari.",
    tags: ["Restinga e Mata", "Frutífera nativa"], roles: ["fauna", "alimento"], fit: 2, flags: ["fresca"],
    ecology: "Aves e primatas comem o fruto e espalham as sementes. Abelhas visitam as flores. Na restinga de Praia do Forte, é uma das espécies que mais pesam na estrutura da mata.",
    culture: "O fruto maduro é comido ao natural e vira licor, suco, refresco, geleia e sorvete. Segundo a Embrapa, é rico em pró-vitamina A.",
    seed: ["Lave as sementes para tirar a mucilagem.", "Recém-colhidas, germinam em 20 a 30 dias. Guardadas, podem levar de 180 a 365 dias. Em um estudo, tirar o tegumento subiu a germinação de 30% para 70%."],
    bomb: "Exige cuidado: use semente fresca, confirme a germinação do lote e reserve tempo longo de observação.",
    caution: ""
  },
  {
    id: "pitanga", name: "Pitanga", sci: "Eugenia uniflora L.", family: "Myrtaceae",
    origin: "nativa",
    originNote: "Nativa do Brasil. A Embrapa lista a Bahia entre os 13 estados de ocorrência natural. Myrtaceae é a família mais rica nas florestas e restingas da Bahia estudadas.",
    tags: ["Frutífera nativa"], roles: ["fauna", "alimento"], fit: 1, flags: ["fresca"],
    ecology: "Ocorre em várias formações da Mata Atlântica e pode ser plantada a pleno sol, em plantio puro ou misto. Rebrota pelos rizomas e forma touceiras. Aves e mamíferos comem o fruto e espalham as sementes.",
    culture: "O fruto, muito apreciado, é comido ao natural ou em suco. O Nordeste é um dos maiores produtores do suco industrializado.",
    seed: ["Sementes recalcitrantes: começam a perder a germinação de 15 a 20 dias depois da colheita.", "Não precisam de tratamento. A germinação chega a 87% e a emergência leva de 18 a 34 dias, segundo a Embrapa."],
    bomb: "Só com semente fresca, em bomba semeada logo depois da colheita.",
    caution: ""
  },
  {
    id: "araca", name: "Araçá", sci: "Psidium guineense Sw.", family: "Myrtaceae",
    origin: "nativa",
    originNote: "Nativa da América do Sul. A Embrapa cita a Bahia na distribuição e aponta restingas, tabuleiros e capoeiras como habitat, no litoral e na Zona da Mata do Nordeste.",
    tags: ["Frutífera nativa", "Restinga e Mata"], roles: ["fauna", "alimento"], fit: 3,
    ecology: "Abelhas polinizam as flores, que oferecem pólen. Mamíferos como quati e cachorro-do-mato comem o fruto e espalham as sementes. Moscas-das-frutas costumam atacar o fruto.",
    culture: "O fruto é comido ao natural e vira araçazada, doce, suco, sorvete, licor e geleia.",
    seed: ["Cada fruto tem de 22 a 100 sementes (às vezes até 250), de casca dura.", "Extraia de frutos maduros, lave, peneire e seque à sombra. Em geral, germinam em 10 a 15 dias, segundo a Embrapa."],
    bomb: "Boa candidata: muitas sementes pequenas, fáceis de padronizar, e fruto que atrai fauna.",
    caution: ""
  },
  {
    id: "mulungu", name: "Mulungu", sci: "Erythrina velutina Willd.", family: "Fabaceae",
    origin: "nativa",
    originNote: "Nativa do Brasil. A Embrapa lista a Bahia, incluindo o sertão de Canudos, na Caatinga, e também brejos de altitude da Mata Atlântica. A Embrapa não cita restinga.",
    tags: ["Pioneira"], roles: ["cobertura", "solo", "fauna"], fit: 3, flags: ["dormencia"],
    ecology: "Pioneira que gosta de sol e forma nódulos com bactérias fixadoras de nitrogênio. A Embrapa recomenda para plantios mistos em áreas degradadas. Abelhas e mamangavas visitam as flores, e as aves ajudam a espalhar as sementes.",
    culture: "A casca e os frutos têm uso popular no Nordeste, mas a eficácia e a segurança não foram comprovadas. As flores são comestíveis e as sementes viram colares e pulseiras.",
    seed: ["A semente tem dormência: o tegumento não deixa passar água.", "Depois de superada, a germinação leva de 7 a 16 dias e varia de 19% a 87%, segundo a Embrapa."],
    bomb: "Boa candidata, depois de quebrar a dormência. Faça isso antes de moldar a bomba.",
    caution: "As sementes e a casca têm alcaloide e são venenosas. Mantenha longe de crianças e animais, e não faça colares com elas sem cuidado."
  },
  {
    id: "inga", name: "Ingá-feijão", sci: "Inga laurina (Sw.) Willd.", family: "Fabaceae",
    origin: "nativa",
    originNote: "Nativa. Uma tabela da Embrapa lista Inga laurina com ocorrência na Bahia e registro de nodulação, e inclui outras espécies de ingá baianas.",
    tags: ["Frutífera nativa"], roles: ["solo", "fauna", "alimento"], fit: 2,
    ecology: "Leguminosa que forma nódulos com bactérias fixadoras de nitrogênio, o que melhora o solo. A Embrapa vê potencial das leguminosas para plantios de restauração.",
    culture: "O fruto, a vagem, tem polpa branca e doce que é comida ao natural. É comum em quintais.",
    seed: ["As sementes de muitas espécies de ingá não aceitam secagem. Confirme no seu lote.", "Faça um teste de germinação antes de contar as sementes por bomba."],
    bomb: "Exige cuidado: use semente recém-tirada do fruto. Por ser leguminosa, associa-se a bactérias fixadoras de nitrogênio, o que pode ser testado em etapa futura.",
    caution: ""
  },
  {
    id: "oranobis", name: "Ora-pro-nóbis", sci: "Pereskia aculeata Mill.", family: "Cactaceae",
    origin: "nativa",
    originNote: "Nativa do Brasil, mas não endêmica. A Embrapa lista a Bahia, em florestas ciliares, restingas e Mata Atlântica.",
    tags: ["PANC", "Restinga e Mata"], roles: ["alimento"], fit: 0,
    ecology: "Cacto trepador de florestas ciliares, restingas e afloramentos rochosos. Prefere terras de áridas a levemente áridas.",
    culture: "É uma PANC conhecida como \"carne vegetal\", e aparece entre as mais consumidas nos estudos de restinga de Maraú e de Jandaíra, na Bahia. As folhas têm de 17,4% a 25,4% de proteína bruta na massa seca, e a planta tem mucilagem. Em Sabará (MG) há um festival anual desde 1997.",
    seed: ["A propagação mais usada é por estacas de 20 a 30 cm, com cerca de 2/3 enterradas.", "Também pode ser por semente, mas é menos comum."],
    bomb: "Fica fora da bomba como semente. Propaga-se por estacas.",
    caution: "Tem espinhos nos ramos: use luvas na colheita."
  },
  {
    id: "garu", name: "Garu", sci: "Cereus fernambucensis Lem.", family: "Cactaceae",
    origin: "nativa",
    originNote: "Nativa e endêmica da Mata Atlântica, segundo um estudo de PANCs da restinga de Maraú (BA). Esse estudo mistura dois nomes científicos para o garu: confirme a identificação com o professor e na Flora e Funga do Brasil.",
    tags: ["PANC", "Restinga e Mata"], roles: ["alimento"], fit: 2,
    ecology: "Cacto da restinga baiana. Os estudos consultados não detalham o papel ecológico da espécie.",
    culture: "Moradores de Maraú e de Jandaíra, na Bahia, comem o fruto, chamado de garu ou girá. Em Jandaíra, ele é consumido com frequência.",
    seed: ["Não achei dados de germinação nas fontes lidas.", "Faça o seu próprio teste de germinação antes de montar as bombas."],
    bomb: "Exige cuidado: trate como espécie a testar. Pode virar tema da pesquisa.",
    caution: "Cactos têm espinhos: use luvas. Confirme a identificação antes de comer qualquer fruto."
  },
  {
    id: "maxixe", name: "Maxixe", sci: "Cucumis anguria L.", family: "Cucurbitaceae",
    origin: "introduzida",
    originNote: "Cultura de origem africana (Embrapa), muito cultivada no Norte e no Nordeste do Brasil. Confirme o status no Brasil na Flora e Funga do Brasil.",
    tags: ["PANC", "Uso tradicional"], roles: ["alimento"], fit: 0,
    ecology: "Trepadeira anual de cultivo, que cresce em hortas e roçados. Não é espécie nativa da vegetação do município e não foi escolhida para restaurar áreas degradadas.",
    culture: "O fruto é ingrediente da culinária nordestina, como na maxixada, e pode ser comido cru em salada no lugar do pepino. Segundo a Embrapa, é uma hortaliça pouco conhecida fora das regiões onde é tradicional.",
    seed: ["Em estudo da Embrapa com 23 acessos de bancos de germoplasma, a germinação começou entre 4 e 66 dias após elevar a temperatura a 26 °C, e em 42,8% dos casos já na primeira semana.", "As sementes têm dormência fisiológica sensível à luz e à temperatura (Yokoyama e Silva Júnior, 1988, citados pela Embrapa)."],
    bomb: "Semente-modelo dos ensaios da equipe, escolhida para testar a estrutura da bomba. Como é introduzida, fica fora do montador de mistura para áreas degradadas.",
    caution: "Cite sempre o nome científico, pois há outras cucurbitáceas chamadas de maxixe."
  },
  {
    id: "linguadevaca", name: "Língua-de-vaca", sci: "Rumex obtusifolius L.", family: "Polygonaceae",
    origin: "introduzida",
    originNote: "Espécie de origem europeia, hoje espalhada pelo mundo. Confirme a origem e o status no Brasil na Flora e Funga do Brasil.",
    tags: ["PANC"], roles: ["alimento"], fit: 0,
    ecology: "Erva perene de áreas perturbadas e pastos. Cada planta pode produzir dezenas de milhares de sementes, que ficam dormentes no solo por anos. Por isso é tratada como planta invasora.",
    culture: "Folhas jovens de azedas do gênero Rumex são comidas como hortaliça em várias culturas, e a planta aparece em usos populares de remédio caseiro. Pergunte à comunidade como ela é usada aqui.",
    seed: ["Produz sementes pequenas em quantidade enorme.", "A dormência no solo é longa: outro motivo para não espalhar."],
    bomb: "Semente-modelo dos ensaios da equipe, com sementes pequenas. Por ser introduzida e invasora, fica fora do montador: espalhar as sementes em área degradada pode piorar o problema.",
    caution: "As folhas têm oxalato: com problema nos rins, evite. Cite sempre o nome científico, porque \"língua-de-vaca\" também é nome popular de outras plantas, como a Chaptalia nutans."
  },
  {
    id: "jenipapo", name: "Jenipapo", sci: "Genipa americana L.", family: "Rubiaceae",
    origin: "nativa",
    originNote: "Nativa do Brasil. A Embrapa registra ocorrência natural em vários estados, entre eles a Bahia, em mata ciliar e áreas úmidas.",
    tags: ["Frutífera nativa", "Uso tradicional"], roles: ["fauna", "alimento"], fit: 1, flags: ["fresca"],
    ecology: "Árvore de mata ciliar e de áreas úmidas. Tolera alagamento temporário, o que a torna útil na recuperação de áreas degradadas.",
    culture: "O fruto vira refresco, compota, licor e vinho. Povos indígenas usam o corante do fruto na pintura do corpo e em tatuagens.",
    seed: ["Sementes recalcitrantes: não suportam secagem e perdem a germinação no armazenamento.", "Sem dormência. Segundo a Embrapa, 48 horas na água aceleram a germinação, que varia de 30% a 95%."],
    bomb: "Só com semente recém-lavada e bomba semeada logo. Serve para áreas úmidas.",
    caution: "O suco do fruto verde mancha a pele por dias."
  },
  {
    id: "caja", name: "Cajá", sci: "Spondias mombin L.", family: "Anacardiaceae",
    origin: "nativa",
    originNote: "Nativa do Brasil. A Embrapa registra ocorrência natural na Bahia, inclusive no sul e no oeste do estado, na Mata Atlântica.",
    tags: ["Frutífera nativa"], roles: ["fauna", "alimento"], fit: 1, flags: ["fresca", "grande"],
    ecology: "Árvore de sol e de terreno úmido, comum em mata secundária. As flores são visitadas por abelhas, e a espécie é usada na recuperação de áreas degradadas e de beira de rio.",
    culture: "O cajá, também chamado de cajá-da-mata ou taperebá, vira suco, sorvete, doce, geleia e vinho.",
    seed: ["O caroço tem endocarpo duro e fibroso, e a semente é recalcitrante: a viabilidade é menor que 3 meses.", "A emergência leva de 25 a 240 dias e fica perto de 50%, segundo a Embrapa."],
    bomb: "Caroço grande e semente que não se guarda: plante direto ou use bomba maior, logo depois da colheita.",
    caution: ""
  },
  {
    id: "pitomba", name: "Pitomba", sci: "Talisia esculenta (A.St.-Hil.) Radlk.", family: "Sapindaceae",
    origin: "nativa",
    originNote: "Nativa do Brasil, possivelmente originária da Amazônia ocidental. Um artigo de revisão cita ocorrência na Bahia.",
    tags: ["Frutífera nativa"], roles: ["fauna", "alimento"], fit: 2, flags: ["grande"],
    ecology: "Árvore de matas e capoeiras, indicada para plantio em áreas degradadas.",
    culture: "O fruto, de polpa agridoce, é vendido principalmente no Norte e no Nordeste. Chás de folha e de semente têm uso popular, mas não foram comprovados no artigo consultado.",
    seed: ["Semente grande e oblonga, coberta por uma polpa mucilaginosa.", "Num estudo de 2009, fermentar para tirar a polpa levou a germinação até 93% (em cerca de 76 horas). A germinação média levou de 15 a 27 dias."],
    bomb: "Semente grande: faça a bomba maior ou plante direto. Tire a polpa antes.",
    caution: ""
  },
  {
    id: "caju", name: "Cajueiro", sci: "Anacardium occidentale L.", family: "Anacardiaceae",
    origin: "nativa",
    originNote: "Nativa do Brasil, comum no litoral do Nordeste. Uma publicação consultada lista a origem como nativa, com a Bahia entre os estados do Nordeste. Confirme na Flora e Funga do Brasil.",
    tags: ["Frutífera nativa", "Restinga e Mata"], roles: ["fauna", "alimento"], fit: 2, flags: ["grande"],
    ecology: "Árvore de restinga e dunas, que aguenta solo arenoso e pobre. O pedúnculo (o \"caju\") é comido por vários animais.",
    culture: "O pedúnculo é consumido in natura, em suco e em doce, e a castanha é muito apreciada. O nome vem do tupi.",
    seed: ["A semente é a castanha, de casca dura. Use castanhas de frutos maduros.", "É grande: não cabe em bomba pequena."],
    bomb: "Faça a bomba maior ou plante a castanha direto no solo.",
    caution: "A casca da castanha tem óleo cáustico que queima a pele. Use luvas e não quebre a casca com a mão."
  },
  {
    id: "maracujacaatinga", name: "Maracujá-da-caatinga", sci: "Passiflora cincinnata Mast.", family: "Passifloraceae",
    origin: "nativa",
    originNote: "Nativa do Brasil e da Caatinga. Segundo a Embrapa, ocorre em todos os estados do Nordeste, inclusive a Bahia. Não é espécie de restinga nem de Mata Atlântica.",
    tags: ["Frutífera nativa", "PANC"], roles: ["fauna", "alimento"], fit: 2,
    ecology: "Trepadeira de áreas abertas. As flores grandes costumam ser visitadas por abelhas grandes, como as mamangavas.",
    culture: "O fruto é apreciado pelas populações do semiárido e é colhido principalmente na natureza, em extrativismo.",
    seed: ["Muitas sementes por fruto, cobertas por uma polpa que precisa ser lavada.", "Sementes de maracujá costumam ter germinação lenta e irregular."],
    bomb: "Sementes pequenas, de bom encaixe. Reserve mais tempo de observação no experimento.",
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
   Coloque as fotos na pasta img/ (ao lado do Guia.html) e preencha aqui.
   Se a foto não existir ou não carregar, o cartão volta ao desenho com a letra.
   Use só fotos suas ou com licença livre (ex.: Wikimedia Commons, CC BY / CC BY-SA)
   e SEMPRE escreva o crédito: autor, licença e link da página da foto.
   Exemplo:
     aroeira: { src: "img/aroeira.jpg", alt: "Frutos da aroeira-vermelha",
                credit: "Foto: Fulano, CC BY-SA 4.0, via Wikimedia Commons" },
   Ids: aroeira, mangaba, murici, cambui, pitanga, araca, mulungu, inga, oranobis,
        garu, maxixe, linguadevaca, jenipapo, caja, pitomba, caju, maracujacaatinga
------------------------------------------- */
const PHOTOS = {
  /* ---- Espécies atuais do guia (preencha o src e o credit de cada uma) ---- */
  aroeira:          { 
    src: "https://www.floralondrina.com.br/img/products/muda-de-aroeira-pimenteira-schinus-terebinthifolius_1_1200.jpg", 
    alt: "Frutos da aroeira-vermelha",        
    credit: "" },

  mangaba:          {
     src: "https://www.correiobraziliense.com.br/cbradar/wp-content/uploads/2025/12/Gemini_Generated_Image_pco1vdpco1vdpco1-2.png", 
     alt: "Frutos da mangaba",                 
     credit: "" },

  murici:           {
     src: "https://www.shutterstock.com/image-photo/murici-byrsonima-verbascifolia-rare-littleknown-260nw-2732446009.jpg", 
     alt: "Frutos do murici",                  
     credit: "" },

  cambui:           {
     src: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRPhNdAVMP0X82V11wJSPp_BtsZtadiwDO2t-MPE5ZpAFUP_tWK", 
     alt: "Frutos do cambuí",                  
     credit: "" },

  pitanga:          {
    src: "https://cdn.awsli.com.br/2772/2772039/produto/331426805/pitanga-vermelha-37qok77v6p.jpg", 
    alt: "Frutos da pitanga",                 
    credit: "" },
    
  araca:            {
     src: "https://www.colecionandofrutas.com.br/psidiumguineense_arquivos/image005.jpg", 
     alt: "Frutos do araçá",                   
     credit: "" },

  mulungu:          {
     src: "https://appverde.wordpress.com/wp-content/uploads/2015/09/dsc06212.jpg",
     alt: "Flores do mulungu",                 
     credit: "" },

  inga:             {
     src: "https://www.floralondrina.com.br/img/products/muda-de-inga-branco-inga-laurina_1_1200.jpg",
     alt: "Vagens do ingá-feijão",             
     credit: "" },

  oranobis:         {
     src: "https://www.unirio.br/ccbs/ibio/herbariohuni/imagens/copy_of_PereskiaaculeataAlexandreMachado.jpg", 
     alt: "Folhas da ora-pro-nóbis",           
     credit: "" },

  garu:             {
     src: "https://tudosobreplantas.com.br/wp-content/uploads/sistsp/cereus-fernambucensis_tudosobreplantas_1.jpg", 
     alt: "Fruto do garu",                     
     credit: "" },

  jenipapo:         {
     src: "https://cdn.awsli.com.br/2500x2500/2772/2772039/produto/371887799/jenipapo-0qgjzpjn8s.jpg", 
     alt: "Fruto do jenipapo",                 
     credit: "" },

  caja:             {
     src: "https://www.sitiodamata.com.br/media/catalog/product/cache/bd7e41e8357e6ae06c7d33758afd4978/s/e/sementes-caja-mirim-spondias-mombin_2nd.jpg", 
     alt: "Frutos do cajá",                    
     credit: "" },

  pitomba:          {
     src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_KMJzpIb8JBgUsHH06FeKHq5aXBBlF_kUXlPBG23p1sJvOTyF", 
     alt: "Frutos da pitomba",                 
     credit: "" },

  caju:             {
     src: "https://www.cerratinga.org.br/wp-content/uploads/2021/09/caju-frutos-dodesign-s.jpg", 
     alt: "Cajueiro com caju e castanha",      
     credit: "" },

  maracujacaatinga: { 
    src: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTbpsuRuBiljJ0uoTyftsq851BF2-TmhoLJ8jrFnycxBa8B8zEl", 
    alt: "Fruto do maracujá-da-caatinga",     
    credit: "" },

  maxixe: {
    src: "https://www.sitiodamata.com.br/media/catalog/product/cache/bd7e41e8357e6ae06c7d33758afd4978/s/e/sementes-maxixe-cucumis-anguria_2nd.jpg",
    alt: "Frutos de maxixe",
    credit: ""
  },
  linguadevaca: {   // foto que você escolheu antes
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyKqPpPBk2PMG9rLMwjHt4xPHn-IRBZn8eJ5riWutEMW6c_eExYC3WZffJ&s=10",
    alt: "Língua-de-vaca",
    credit: ""
  },
};
  
  
const ORIGIN_LABELS = { nativa: "Nativa", introduzida: "Introduzida" };


/* ---------- 2b. O BIOMA ----------
   Caracterização do ambiente. Cada dado tem a fonte ao lado (seção 8).
   Edite os textos aqui; o site monta a seção sozinho. */
const BIOMA = {
  titulo: "Mata Atlântica e restinga no litoral norte de Salvador",
  resumo: "Camaçari fica no litoral da Bahia, na Região Metropolitana de Salvador, dentro do bioma Mata Atlântica. Na faixa costeira desse bioma ocorrem as restingas, formações que crescem sobre areia e são conhecidas pela fragilidade.",
  fatos: [
    { rotulo: "Localização", valor: "12°41′ S, 38°19′ O", nota: "Região Metropolitana de Salvador, altitude de 36 m" },
    { rotulo: "Área do município", valor: "784,7 km²", nota: "Segundo a Wikipedia" },
    { rotulo: "Temperatura média anual", valor: "24,8 °C", nota: "Máxima média de 29,6 °C e mínima média de 21,0 °C (INMET, 1981 a 2010)" },
    { rotulo: "Chuva por ano", valor: "1.736,6 mm", nota: "Cerca de 152 dias com chuva (INMET, 1981 a 2010)" },
    { rotulo: "Mês mais chuvoso", valor: "Maio", nota: "244,4 mm em média" },
    { rotulo: "Mês mais seco", valor: "Dezembro", nota: "74,9 mm em média" },
    { rotulo: "Umidade relativa do ar", valor: "81,1 %", nota: "Média anual (INMET, 1981 a 2010)" }
  ],
  ambientes: [
    { nome: "A restinga", texto: "É uma ecorregião da Mata Atlântica que ocupa a costa atlântica do Nordeste ao Sudeste. Cresce sobre solo arenoso, ácido e pobre em nutrientes, com árvores e arbustos de porte médio adaptados à seca e à falta de nutrientes. Há enclaves de restinga ao norte e ao sul de Salvador." },
    { nome: "Fisionomias da restinga vizinha", texto: "Num levantamento em Praia do Forte (Mata de São João, no mesmo litoral norte), foram encontradas 68 espécies. As famílias com mais espécies foram Myrtaceae, Rubiaceae e Malpighiaceae. Duas comunidades se distinguiram: a restinga em moitas e a mata de restinga. Os solos vêm da Formação Barreiras e as chuvas somam cerca de 2.000 mm por ano, com maior concentração de março a agosto." }
  ],
  ameacas: "A restinga é frágil e sofre com o desmatamento. A retirada da camada superficial do solo pode retardar a sucessão natural por longos períodos. A ecorregião das restingas da costa atlântica está classificada como em estado crítico, com cerca de 14% de sua área protegida. No litoral norte, a ocupação se intensificou com o turismo depois da Linha Verde (BA-099).",
  implicacao: "Para a bomba de sementes, isso indica três cuidados: usar espécies da restinga e da Mata Atlântica, esperar o período chuvoso e proteger o solo, porque a camada superficial é difícil de recuperar. Em Camaçari, a chuva é mais forte em maio e mais fraca em dezembro. Confira a série do INMET antes de escolher a data.",
  limite: "As fontes consultadas dão o clima e a localização de Camaçari, mas os estudos de vegetação encontrados são de Praia do Forte, no município vizinho de Mata de São João. A vegetação específica de Camaçari, como dunas, manguezais e unidades de conservação do município, deve ser conferida com o INEMA e a prefeitura."
};


/* ---------- 3. FORMULAÇÕES TESTADAS (metodologia da equipe) ----------
   parts: [material, quantidade por bomba]
   status: "selecionada" | "descartada" | "" (aparece como etiqueta)
------------------------------------------- */
const FORMULATIONS = [
  {
    id: "F1", short: "Somente argila", name: "Bomba somente de argila",
    parts: [["Argila", "20 g"], ["Sementes", "cerca de 4"]],
    status: "descartada", statusNote: "Descartada no teste de pH",
    desc: "Camada fina de argila na palma da mão, com as sementes dentro. A argila é moldada ao redor delas."
  },
  {
    id: "F2", short: "Argila com terra no interior", name: "Bomba de argila com terra no interior",
    parts: [["Argila", "30 g"], ["Terra no interior", "10 g"], ["Sementes", "dentro da terra"]],
    status: "selecionada", statusNote: "Formulação selecionada",
    desc: "A argila envolve a terra e as sementes, e é boleada até formar a bomba."
  },
  {
    id: "F3", short: "Terra misturada à argila", name: "Bomba com terra misturada à argila",
    parts: [["Terra", "140 g para 6 bombas (≈ 23,33 g cada)"], ["Argila", "70 g para 6 bombas (≈ 11,67 g cada)"], ["Sementes", "na superfície"]],
    status: "", statusNote: "",
    desc: "Terra e argila são misturadas até a massa ficar homogênea, divididas em 6 porções iguais e boleadas. Quando necessário, usa-se um pouco de água nas mãos."
  }
];

/* ---------- 3b. METODOLOGIA E RESULTADOS DA EQUIPE ----------
   Texto resumido da metodologia. Os números abaixo são os medidos pela equipe. */
const METODO = {
  intro: "A pesquisa combinou fundamentação teórica e uma etapa prática. A fundamentação reuniu revisão bibliográfica narrativa e levantamento de dados ambientais em sites oficiais, com descritores sobre restauração ecológica e tecnologias sociais. A etapa prática desenvolveu e avaliou bombas de sementes.",
  sementes: "Para padronizar os ensaios e verificar a integridade estrutural das bombas, usaram-se primeiro sementes de feijão (Phaseolus vulgaris), de germinação rápida e vigorosa. Em seguida, foram substituídas por sementes de maxixe (Cucumis anguria) e de língua-de-vaca (Rumex obtusifolius).",
  materiais: "Argila natural comum e substrato orgânico comercial. As proporções continuam sendo ajustadas conforme as características físicas e o tamanho de cada semente.",
  secagem: "As bombas secaram à temperatura ambiente (24 a 27 °C), sobre caixa de ovos de polpa de papel.",
  analise: "Os dados foram analisados de forma descritiva, para comparar o desempenho estrutural e germinativo das bombas e selecionar a de melhor qualidade."
};

/* Teste de pH: amostras de cerca de 4 g */
const PH_FAIXA = "6,0 a 6,5";
const RESULT_PH = [
  { amostra: "Terra, amostra 1", ph: 6.47 },
  { amostra: "Terra, amostra 2", ph: 6.64 },
  { amostra: "Argila isolada", ph: 5.72 },
  { amostra: "Mistura de terra e argila", ph: 6.54 }
];
const PH_TEXTO = "A terra ficou próxima da faixa levemente ácida recomendada para a germinação (6,0 a 6,5). A argila isolada foi mais ácida (5,72), o que poderia limitar o desenvolvimento inicial das plantas. Por isso a formulação somente de argila (F1) foi descartada, e a mistura com terra garantiu um pH equilibrado.";

/* Teste de resistência hídrica: imersão em 200 mL de água por 5 minutos.
   O site calcula sozinho a variação (depois − antes). */
const RESULT_AGUA = [
  { formulacao: "F1", antes: 22.30, depois: 19.90 },
  { formulacao: "F2", antes: 36.55, depois: 28.48 },
  { formulacao: "F3", antes: 22.20, depois: 24.80 }
];
const AGUA_TEXTO = "As formulações compostas (F2 e F3) mostraram boa capacidade de retenção de água. Observou-se a dissolução parcial das bombas, o que é positivo: facilita a abertura gradual da estrutura e a liberação das sementes no solo.";

/* Germinação: bombas em recipientes com 150 g de terra, irrigadas com borrifador uma vez ao dia, por 1 semana */
const GERM_TEXTO = "As duas formulações que seguiram para o ensaio (F2 e F3) apresentaram germinação satisfatória em uma semana, com destaque para a bomba de argila com terra no interior (F2).";
const FORMULACAO_SELECIONADA = "F2";


/* ---------- 3c. FOTOS DA BOMBA (carrossel na página Resultados) ----------
   Uma linha por imagem da bomba de sementes pronta. As setas do site passam
   de uma para a outra.
     src:     "img/bomba1.jpg"  (ou "https://...")
     legenda: texto curto que aparece embaixo da foto
     credito: opcional, por exemplo "Foto: equipe do projeto"
   Enquanto o src estiver vazio, aparece uma moldura reservada.
   Para ter mais imagens, copie uma linha; para ter menos, apague.
   Cada linha termina com vírgula.
------------------------------------------- */
const FOTOS_PROJETO = [
  { src: "https://cdnstatic.tencentcs.com/edgeone/pages/assets/1793833707069-ozFk.png", 
    alt: "Bomba de sementes pronta (F2)",        
    credit: "Equipe Interárea Natureza" },

  { src: "https://cdnstatic.tencentcs.com/edgeone/pages/assets/1793833243202-BQCQ.png", 
    alt: "Bomba de sementes pronta, outro ângulo", 
    credit: "" },

  { src: "https://cdnstatic.tencentcs.com/edgeone/pages/assets/1793833363227-Ap1W.png", 
    alt: "Bomba de sementes pronta, em detalhe",   
    credit: "" }
];

/* ---------- 4. CAMADAS DO DIAGRAMA (formulação selecionada, F2) ---------- */
const LAYERS = {
  argila: {
    title: "Casca de argila",
    text: "30 g de argila natural comum. Protege a semente de formigas, aves e chuva forte, e segura umidade ao redor dela. Na imersão, parte da casca se dissolve, o que ajuda a liberar as sementes.",
    test: "Entra em: F1, F2 e F3. O pH da argila isolada foi 5,72."
  },
  humus: {
    title: "Terra no interior",
    text: "10 g de terra, com pH de 6,47 e 6,64 nas duas amostras, perto da faixa recomendada para a germinação. A terra no interior corrige a acidez da argila e dá substrato às sementes.",
    test: "Entra em: F2 (no interior) e F3 (misturada à argila)."
  },
  semente: {
    title: "Sementes",
    text: "Cerca de 4 sementes por bomba, colocadas dentro da terra. Nos ensaios foram usadas sementes de feijão (padronização), maxixe e língua-de-vaca.",
    test: "Entra em: todas as formulações."
  }
};


/* ---------- 5. PASSO A PASSO ---------- */
const BOMB_STEPS = [
  { title: "Colher com critério", text: "Colha frutos maduros de várias árvores locais da mesma espécie, de preferência saudáveis e próximas da área a restaurar. Isso mantém a diversidade genética e a adaptação ao lugar. Anote data, local e árvore-matriz." },
  { title: "Limpar e escolher", text: "Retire a polpa, lave e descarte sementes furadas, chochas ou mofadas. Em algumas espécies, as que boiam em água costumam estar vazias. Confira isso espécie por espécie." },
  { title: "Quebrar a dormência quando precisar", text: "Algumas espécies têm semente de casca dura. A Embrapa descreve a imersão em água quente (80 a 100 °C, deixando esfriar por até 24 horas), a escarificação mecânica com lixa e a escarificação ácida. O ácido não é para uso escolar; peça orientação ao professor para a água quente." },
  { title: "Separar e pesar os materiais", text: "Use argila natural comum e terra ou substrato orgânico. Na formulação selecionada (F2), pese 30 g de argila e 10 g de terra por bomba. Tire pedras e raízes da argila." },
  { title: "Moldar a bomba", text: "Faça uma camada fina de argila na palma da mão, acrescente a terra e coloque cerca de 4 sementes dentro. Bole a argila até envolver a terra e as sementes. Use esferas do mesmo tamanho para poder comparar os lotes." },
  { title: "Secar", text: "Deixe secar à temperatura ambiente (24 a 27 °C), em local arejado, sobre uma caixa de ovos de polpa de papel. Evite sol direto, que racha a casca. Registre quanto tempo levou." },
  { title: "Etiquetar e guardar", text: "Etiquete cada lote com formulação, espécies e data. Guarde em local seco e fresco. Sementes recalcitrantes não podem ser guardadas: use no mesmo dia." },
  { title: "Registrar", text: "Fotografe o lote e pese uma amostra. Esses dados permitem comparar os lotes e acompanhar o desempenho." }
];


/* ---------- 6. ESPÉCIES SELECIONADAS E CONTAGEM DE GERMINAÇÃO ----------
   SELECTED:   espécies usadas nos ensaios da equipe (aparecem marcadas no guia).
   GERMINACAO: OPCIONAL. Se a equipe tiver a contagem de sementes, acrescente
               uma linha por formulação e espécie:
                 { formulacao: "F2", especie: "maxixe", semeadas: 20, germinadas: 12 },
               formulacao: F1, F2 ou F3
               especie:    id da espécie (por exemplo maxixe, linguadevaca)
               semeadas:   quantas sementes foram semeadas
               germinadas: quantas germinaram (nunca mais que as semeadas)
               O site calcula sozinho a porcentagem (germinadas ÷ semeadas × 100).
               Sem linhas aqui, o site mostra só o resultado descritivo (GERM_TEXTO).
------------------------------------------- */
const SELECTED = ["maxixe", "linguadevaca"];

const GERMINACAO = [
  // { formulacao: "F2", especie: "maxixe", semeadas: 20, germinadas: 12 },
];



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
    { t: "Camaçari (Wikipedia, dados do INMET 1981 a 2010)", u: "https://en.wikipedia.org/wiki/Cama%C3%A7ari", n: "Coordenadas, área, altitude, temperatura, chuva e umidade do município." },
    { t: "Restingas da Costa Atlântica (Wikipedia)", u: "https://en.wikipedia.org/wiki/Atlantic_Coast_restingas", n: "Restinga como ecorregião da Mata Atlântica, solo arenoso e ácido, enclaves ao norte e ao sul de Salvador, estado crítico e 14% protegido." },
    { t: "Lélia, a amefricana (Jornal da USP)", u: "https://jornal.usp.br/?p=785360", n: "Conceito de Amefricanidade, cunhado em 1980." },
    { t: "Junho Ambiental: avanço das cidades ameaça a conservação da Mata Atlântica (MPF, 26/06/2026)", u: "https://www.mpf.mp.br/o-mpf/unidades/procuradoria-geral-da-republica-pgr/noticias/junho-ambiental-avanco-das-cidades-ameaca-a-conservacao-da-mata-atlantica", n: "Restam 24% da vegetação nativa; a expansão urbana desordenada fragmentou o bioma." },
    { t: "Bombas de sementes de castanha-do-Brasil (repositório do IFAP)", u: "https://repositorio.ifap.edu.br/bitstreams/5c5cd744-9d8d-42d4-b835-e3feb48ef839/download", n: "Desenho experimental com 3 tratamentos e 16 repetições. Germinação de 75%, 50% e 44%, sem diferença significativa (p = 0,177)." },
    { t: "Superação de dormência de sementes florestais (Embrapa, capítulo 5)", u: "https://www.alice.cnptia.embrapa.br/alice/bitstream/doc/299616/1/cap5SuperacaoDormencia0001.pdf", n: "Métodos de escarificação, água quente e imersão." },
    { t: "Restinga em Praia do Forte, Litoral Norte da Bahia (Revista Biotemas, 2012)", u: "https://periodicos.ufsc.br/index.php/biotemas/article/download/2175-7925.2012v25n1p31/20873/74801", n: "Espécies dominantes da restinga, incluindo Byrsonima blanchetiana. Famílias mais ricas: Myrtaceae, Rubiaceae e Malpighiaceae." },
    { t: "Jenipapeiro, Espécies Arbóreas Brasileiras (Embrapa)", u: "https://www.alice.cnptia.embrapa.br/alice/bitstream/doc/1140091/1/Especies-Arboreas-Brasileiras-vol-1-Jenipapeiro.pdf", n: "Ocorrência natural (inclui a Bahia), sementes recalcitrantes, germinação de 30% a 95% e uso indígena do corante." },
    { t: "Cajá-da-mata, Espécies Arbóreas Brasileiras (Embrapa)", u: "https://www.alice.cnptia.embrapa.br/alice/bitstream/doc/1140734/1/Especies-Arboreas-Brasileiras-vol-2-Caja-da-Mata.pdf", n: "Spondias mombin nativa, com ocorrência na Bahia. Semente recalcitrante e emergência de 25 a 240 dias." },
    { t: "Aroeira-vermelha (Embrapa)", u: "https://www.infoteca.cnptia.embrapa.br/infoteca/bitstream/doc/862171/1/Aroeira.Vermelha.pdf", n: "Nativa do Rio Grande do Norte ao Rio Grande do Sul. Uso em recuperação de áreas degradadas e relatos de dermatite." },
    { t: "Mangaba (Embrapa)", u: "https://www.infoteca.cnptia.embrapa.br/infoteca/bitstream/doc/1104669/1/Mangaba.pdf", n: "Ocorrência natural na Bahia, em restinga, tabuleiro e dunas. Semente recalcitrante: semear em até 4 dias." },
    { t: "Sabiá, Espécies Arbóreas Brasileiras (Embrapa)", u: "https://www.alice.cnptia.embrapa.br/alice/bitstream/doc/1140790/1/Especies-Arboreas-Brasileiras-vol-2-Sabia.pdf", n: "Nativo do Nordeste, mas na Bahia só é conhecido como cultivado. Por isso saiu da lista de nativas." },
    { t: "Florística em fitofisionomias de restinga na Bahia (estudo em Jaguaripe)", u: "https://revistas.ufg.br/RBN/article/download/53845/26493", n: "Lista de plantas de restinga da Bahia, com aroeira e murici, e plantas exóticas e invasoras como a casuarina." },
    { t: "Pitomba, Talisia esculenta (Redalyc)", u: "https://www.redalyc.org/pdf/4457/445744094003.pdf", n: "Nativa do Brasil, com registro na Bahia. Fermentação para tirar a polpa elevou a germinação a 93%." },
    { t: "Maracujá-da-caatinga (Embrapa)", u: "https://www.alice.cnptia.embrapa.br/alice/bitstream/doc/1073293/1/Artigo27.pdf", n: "Passiflora cincinnata, nativa da Caatinga, com ocorrência em todos os estados do Nordeste." },
    { t: "Ora-pro-nóbis, Plantas para o Futuro (Embrapa)", u: "https://www.alice.cnptia.embrapa.br/alice/bitstream/doc/1073444/1/regio-centro-oeste-26-07-20171-281-290.pdf", n: "Pereskia aculeata nativa, com ocorrência na Bahia e em restingas. Propagação por estacas, proteína e mucilagem." },
    { t: "Araçá, Plantas para o Futuro (Embrapa)", u: "https://www.infoteca.cnptia.embrapa.br/infoteca/bitstream/doc/1073409/1/Araca.pdf", n: "Psidium guineense: restingas e tabuleiros, Bahia na distribuição, germinação em 10 a 15 dias." },
    { t: "Pitangueira, Espécies Arbóreas Brasileiras (Embrapa)", u: "https://www.alice.cnptia.embrapa.br/alice/bitstream/doc/1140887/1/Especies-Arboreas-Brasileiras-vol-2-Pitangueira.pdf", n: "Nativa, com Bahia entre as UFs. Sementes recalcitrantes, germinação de até 87%." },
    { t: "Mulungu, Espécies Arbóreas Brasileiras (Embrapa)", u: "https://www.alice.cnptia.embrapa.br/alice/bitstream/doc/1136647/1/Especies-Arboreas-Brasileiras-vol-3-Mulungu.pdf", n: "Nativo, com ocorrência na Bahia. Dormência do tegumento, fixação de nitrogênio e sementes venenosas." },
    { t: "Leguminosas florestais da Mata Atlântica (Embrapa, COT 144)", u: "https://www.infoteca.cnptia.embrapa.br/infoteca/bitstream/doc/1090428/1/COT144LeguminosasflorestaisdaMataAtlantica.pdf", n: "Espécies de ingá com ocorrência na Bahia e registro de nodulação." },
    { t: "Cambuí, Plantas para o Futuro (Embrapa)", u: "https://www.infoteca.cnptia.embrapa.br/infoteca/bitstream/doc/1104673/1/Cambui.pdf", n: "Myrciaria floribunda: ocorrência na Bahia, em restinga. Germinação, tegumento e uso do fruto." },
    { t: "PANC da restinga: ocorrência e uso em Maraú, Bahia (ESCAS)", u: "https://www.escas.org.br/wp-content/uploads/2023/09/PLANTAS-ALIMENTICIAS-NAO-CONVENCIONAIS-DA-RESTINGA-Ocorrencia-e-uso-no-Municipio-de-Marau-Bahia-Brasil.pdf", n: "10 PANCs de restinga citadas por moradores, entre elas aroeira, ora-pro-nóbis e o cacto garu." },
    { t: "PANC da restinga: estudo em Jandaíra, Bahia (Even3)", u: "https://www.even3.com.br/anais/vsfdrfceudpdr2021/337182-plantas-alimenticias-nao-convencionais-da-restinga--um-estudo-no-municipio-de-jandaira-na-bahia/", n: "Cinco PANCs do Litoral Norte da Bahia, entre elas ora-pro-nóbis e garu." },
    { t: "Língua-de-vaca (Agrolink)", u: "https://www.agrolink.com.br/problema/lingua-de-vaca_348.html", n: "Rumex obtusifolius como planta invasora, com até 60 mil sementes por planta e dormência de anos." },
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
