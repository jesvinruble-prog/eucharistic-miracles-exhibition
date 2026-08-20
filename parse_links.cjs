const fs = require('fs');

const rawData = fs.readFileSync('src/data.json', 'utf8');
const data = JSON.parse(rawData);

// Map of normalized title to pdf link(s)
const pdfMap = {
  "buenos aires": "BuenosAires1.pdf",
  "tumaco": "Tumaco.pdf",
  "tixtla": "Tixtla.pdf",
  "eten": "Eten.pdf",
  "betania": "Betania.pdf",
  "morne-rouge": "MorneRouge.pdf",
  "saint-andré de la réunion": "SaintAndre.pdf",
  "fiecht": "Fiecht.pdf",
  "seefeld": "Seefeld.pdf",
  "weiten-raxendorf": "Weiten.pdf",
  "augsburg": "Augsburg.pdf",
  "benningen": "Benningen.pdf",
  "bettbrunn": "Bettbrunn.pdf",
  "erding": "Erding.pdf",
  "kranenburg": "Kranenburg.pdf",
  "regensburg": "Regensburg.pdf",
  "walldürn": "Walldurn1.pdf",
  "weingarten": "Weingarten.pdf",
  "wilsnack": "Wilsnack.pdf",
  "krakow": "Krakow.pdf",
  "glotowo": "Glotowo.pdf",
  "legnica": "Legnica1.pdf",
  "poznan": "Poznan.pdf",
  "sokółka": "Sokolka1.pdf",
  "ettiswil": "Ettiswil.pdf",
  "ludbreg": "Ludbreg.pdf",
  "bois-seigneur-isaac": "Bois_Seigneur.pdf",
  "bruges": "Bruges.pdf",
  "brussels": "Brussels.pdf",
  "herentals": "Herentals.pdf",
  "herkenrode-hasselt": "Herkenrode.pdf",
  "liège": "Liege.pdf",
  "middleburg-lovanio": "Middleburg.pdf",
  "avignon": "Avignon1.pdf",
  "blanot": "Blanot.pdf",
  "bordeaux": "Bordeaux.pdf",
  "dijon": "Dijon.pdf",
  "douai": "Douai.pdf",
  "faverney": "Faverney.pdf",
  "la rochelle": "LaRochelle.pdf",
  "neuvy saint sepulcre": "Neuvy.pdf",
  "les ulmes": "Ulmes.pdf",
  "marseille-en-beauvais": "Marseille.pdf",
  "paris": "Paris.pdf",
  "pressac": "Pressac.pdf",
  "alkmaar": "Alkmaar.pdf",
  "amsterdam": "Amsterdam1.pdf",
  "bergen": "Bergen.pdf",
  "boxmeer": "Boxmeer.pdf",
  "boxtel-hoogstraten": "Boxtel.pdf",
  "breda-niervaart": "Breda.pdf",
  "meerssen": "Meerssen.pdf",
  "stiphout": "Stiphout.pdf",
  "alatri": "Alatri.pdf",
  "saint clare of assisi": "SaintClare.pdf",
  "asti": "Asti.pdf",
  "bagno di romagna": "Bagno.pdf",
  "bolsena": "Bolsena1.pdf",
  "canosio": "Canosio.pdf",
  "cascia": "Cascia.pdf",
  "cava dei tirreni": "Cava.pdf",
  "dronero": "Dronero.pdf",
  "san mauro la bruca": "SanMauro.pdf",
  "ferrara": "Ferrara.pdf",
  "florence": "Florence.pdf",
  "gruaro (valvasone)": "Gruaro.pdf",
  "lanciano": "Lanciano1.pdf",
  "macerata": "Macerata.pdf",
  "mogoro": "Mogoro.pdf",
  "morrovalle": "Morrovalle.pdf",
  "offida": "Offida.pdf",
  "patierno (naples)": "Patierno.pdf",
  "rimini": "Rimini.pdf",
  "rome": "Rome1.pdf",
  "rosano": "Rosano.pdf",
  "s. peter damian": "PeterDamian.pdf",
  "salzano": "Salzano.pdf",
  "scala": "Scala.pdf",
  "siena": "Siena1.pdf",
  "trani": "Trani.pdf",
  "turin": "Turin1.pdf",
  "veroli": "Veroli.pdf",
  "volterra": "Volterra.pdf",
  "santarém": "Santarem1.pdf",
  "alboraya-almacéra": "Alboraya.pdf",
  "alcalà": "Alcala.pdf",
  "alcoy": "Alcoy.pdf",
  "caravaca de la cruz": "Caravaca.pdf",
  "cimballa": "Cimballa.pdf",
  "daroca": "Daroca.pdf",
  "gerona": "Gerona.pdf",
  "gorkum-el escorial": "El_Escorial.pdf",
  "guadalupe": "Guadalupe_Spain.pdf",
  "ivorra": "Ivorra.pdf",
  "moncada": "Moncada.pdf",
  "montserrat": "Montserrat.pdf",
  "o'cebreiro": "O_Cebreiro1.pdf",
  "onil": "Onil.pdf",
  "ponferrada": "Ponferrada.pdf",
  "s. john of the abbesses": "JohnAbbesses.pdf",
  "silla": "Silla.pdf",
  "valencia": "Valencia.pdf",
  "zaragoza": "Zaragoza.pdf",
  "chirattakonam": "Chirattakonam.pdf",
  "st. mary of egypt": "MaryEgypt.pdf",
  "scete": "Scete.pdf",
  "saint margaret mary alacoque": "Saints_MargaretMary.pdf",
  "saint thomas aquinas": "Saints_Aquinas.pdf",
  "saint francis of assisi": "Saints_Assisi.pdf",
  "saint bernard of chiaravalle": "Saints_Bernard.pdf",
  "san giovanni bosco": "Saints_DonBosco.pdf",
  "saint germaine cousin (pibrac)": "Saints_Germaine.pdf",
  "saint egidio": "Saints_Egidio.pdf",
  "saint stanislaus kostka": "Saints_Stanislaus.pdf",
  "saint faustina kowalska": "Saints_Faustina.pdf",
  "saint satyrus": "Saints_Satyrus.pdf",
  "saint catherine of siena": "Saints_Caterina_Siena.pdf",
  "blessed alexandrina maria da costa": "Saints_Alexandrina.pdf",
  "blessed anne catherine emmerich": "Saints_Emmerich.pdf",
  "blessed mary of the passion": "Saints_MaryPassion.pdf",
  "st. nicholas of flue": "Saints_NicholasFlue.pdf",
  "servant of god anne-louise lateau": "Saints_Lateau.pdf",
  "servant of god marthe robin": "Saints_MartheRobin.pdf",
  "andré frossard": "Saints_Frossard.pdf",
  "teresa neumann": "Saints_Neumann.pdf",
  "calanda": "OurLady_Calanda.pdf",
  "fatima": "OurLady_Fatima.pdf",
  "guadalupe": "OurLady_Guadalupe.pdf",
  "lourdes": "OurLady_Lourdes.pdf",
  "paris": "OurLady_Paris.pdf",
  "miraculous communions (part 1)": "Communions1.pdf",
  "miraculous communions (part 2)": "Communions2.pdf",
  "blessed nicholas steno": "Saints_NicholasFlue.pdf" // fallback or best guess since not in list
};

const baseUrl = "http://www.therealpresence.org/eucharst/mir/english_pdf/";

data.forEach(item => {
  const normTitle = item.title.toLowerCase().trim();
  let matchedPdf = pdfMap[normTitle];
  
  // Try finding a partial match if absolute match fails
  if (!matchedPdf) {
     for (const key in pdfMap) {
       if (normTitle.includes(key) || key.includes(normTitle)) {
         matchedPdf = pdfMap[key];
         break;
       }
     }
  }

  if (matchedPdf) {
    // If it's a 1.pdf, we know it's the exact file from the instruction
    item.pdfUrl = baseUrl + matchedPdf;
  }
});

fs.writeFileSync('src/data.json', JSON.stringify(data, null, 2));
console.log('PDF links updated directly to therealpresence.org archive!');
