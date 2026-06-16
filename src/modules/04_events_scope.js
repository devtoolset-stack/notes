const obsidianDefaultI18nKebabCase = (function updateConfigName(data, callback) {
  const updated = {};
  for (var key in data)
    if (data.hasOwnProperty(key)) {
      const keyKebabCase = callback(key);
      const value = data[key];
      updated[keyKebabCase] = String.isString(value) ? value : updateConfigName(value, callback);
    }
  return updated;
})(OBSIDIAN_DEFAULT_I18N, toKebabCase);
function addI18nextResourceBundle() {
  i18next.addResourceBundle(fallbackLng, defaultNS, obsidianDefaultI18nKebabCase);
}
isDev ? window.setTimeout(addI18nextResourceBundle) : addI18nextResourceBundle();
let prepare = Promise.resolve();
const languageConfig = localStorage.getItem(languageLiteral);
if (languageConfig) {
  prepare = (async () => {
    try {
      if (languageConfig.contains("/") || languageConfig.contains("\\")) {
        const e = JSON.parse(window.require("original-fs").readFileSync(languageConfig, "utf8"));
        i18next.addResourceBundle("dev", defaultNS, e);
        await i18next.changeLanguage("dev");
      } else {
        const t = JSON.parse(
          await ajaxPromise({
            url: "/i18n/" + languageConfig + ".json",
          }),
        );
        i18next.addResourceBundle(languageConfig, defaultNS, t);
        await i18next.changeLanguage(languageConfig);
      }
    } catch (err) {
      console.error("Failed to load language pack.", err);
    }
  })();
  try {
    const language = languageConfig.toLowerCase();
    languageSpecialAlias.hasOwnProperty(language) && (language = languageSpecialAlias[language]);
    window.moment.locale(language);
  } catch (error) {}
}
window.selectLanguageFileLocation = function () {
  if (Platform.isDesktopApp) {
    var e = electron.remote.dialog.showOpenDialogSync({
      title: "Pick location of translation file",
      filters: [
        {
          name: "Translation file",
          extensions: ["json"],
        },
      ],
      properties: ["openFile", "dontAddToRecent"],
    });
    if (e.length > 0) {
      var t = e[0];
      localStorage.setItem(languageLiteral, t);
      location.reload();
    }
  }
};
isDev &&
  ((window.i18nResetStaleKey = function (e) {
    if (Platform.isDesktopApp) {
      var t = window.require("original-fs"),
        n = electron.ipcRenderer.sendSync("resources");
      for (var i in languageSupported)
        if (languageSupported.hasOwnProperty(i)) {
          var r = n + "/i18n/" + i + ".json";
          try {
            if (t.existsSync(r)) {
              for (
                var o = t.readFileSync(r, "utf8"),
                  a = JSON.parse(o),
                  s = a,
                  l = e.split("."),
                  c = l.pop(),
                  u = obsidianDefaultI18nKebabCase,
                  h = 0,
                  p = l;
                h < p.length;
                h++
              ) {
                var d = p[h];
                if (!s.hasOwnProperty(d)) throw new Error('Key "'.concat(e, '" not found in ').concat(r));
                s = s[d];
                u = u[d];
              }
              if (!s || !s.hasOwnProperty(c)) throw new Error('Key "'.concat(e, '" not found in ').concat(r));
              s[c] = u[c];
              var f = JSON.stringify(a, null, "\t");
              t.writeFileSync(r, f, "utf8");
              console.log("Saved bundle for", i);
            }
          } catch (e) {
            console.error("Failed to process translation for", i, e);
          }
        }
    }
  }),
  (window.i18nFindStaleValues = function () {
    if (Platform.isDesktopApp) {
      var e = window.require("original-fs"),
        t = electron.ipcRenderer.sendSync("resources") + "/i18n/en.json";
      if (e.existsSync(t)) {
        var n = [];
        try {
          var i = e.readFileSync(t, "utf8"),
            r = JSON.parse(i),
            o = function (e, t, i) {
              for (var r in t)
                if (t.hasOwnProperty(r)) {
                  var a = e ? e + "." + r : r,
                    oldValue = t[r],
                    newValue = i[r];
                  String.isString(newValue) && String.isString(oldValue)
                    ? oldValue !== newValue &&
                      (console.log("found mismatch", {
                        key: a,
                        oldValue: oldValue,
                        newValue: newValue,
                      }),
                      n.push(a))
                    : typeof oldValue == "object" && o(a, oldValue, newValue);
                }
            };
          o("", r, obsidianDefaultI18nKebabCase);
        } catch (e) {
          return void console.log("failed:", e);
        }
        console.log("mismatches", n.length);
      } else console.error("en.json does not exist");
    }
  }),
  (window.i18nGenBundles = function () {
    if (Platform.isDesktopApp) {
      var e = window.require("original-fs"),
        t = electron.ipcRenderer.sendSync("resources");
      for (var n in (delete obsidianDefaultI18nKebabCase.setting.integrations,
      delete obsidianDefaultI18nKebabCase.formulas.funcs,
      languageSupported))
        if (languageSupported.hasOwnProperty(n)) {
          var i = t + "/i18n/" + n + ".json";
          try {
            if (e.existsSync(i)) {
              var r = undefined;
              if (n === "en") r = obsidianDefaultI18nKebabCase;
              else {
                var o = e.readFileSync(i, "utf8"),
                  a = JSON.parse(o);
                r = mergeConfig(obsidianDefaultI18nKebabCase, a);
              }
              var s = JSON.stringify(r, null, "\t");
              e.writeFileSync(i, s, "utf8");
              console.log("Saved bundle for", n);
            }
          } catch (e) {
            console.error("Failed to process translation for", n, e);
          }
        }
    }
  }));
const i18nProxy = (function createTranslationProxy(prefix, baseTranslator) {
  var cache = {};
  return new Proxy(baseTranslator, {
    get: function (target, key) {
      if (cache.hasOwnProperty(key)) {
        return cache[key];
      }

      const currentKey = prefix + toKebabCase(key);
      const nextPrefix = currentKey + ".";
      cache[key] = createTranslationProxy(nextPrefix, function (keyOrOptions, options) {
        return String.isString(keyOrOptions)
          ? i18next.t(nextPrefix + keyOrOptions, options)
          : i18next.t(currentKey, keyOrOptions);
      });
      return cache[key];
    },
  });
})("", i18next.t.bind(i18next));
function om(e) {
  if (!e) return "";
  var t = e.split("-"),
    n = {
      aa: "Afar",
      ab: "Abkhaz",
      ae: "Avestan",
      af: "Afrikaans",
      ak: "Akan",
      am: "Amharic",
      an: "Aragonese",
      ar: "Arabic",
      as: "Assamese",
      av: "Avaric",
      ay: "Aymara",
      az: "Azerbaijani",
      ba: "Bashkir",
      be: "Belarusian",
      bg: "Bulgarian",
      bi: "Bislama",
      bm: "Bambara",
      bn: "Bengali",
      bo: "Tibetan",
      br: "Breton",
      bs: "Bosnian",
      ca: "Catalan",
      ce: "Chechen",
      ch: "Chamorro",
      co: "Corsican",
      cr: "Cree",
      cs: "Czech",
      cu: "Old Church Slavonic",
      cv: "Chuvash",
      cy: "Welsh",
      da: "Danish",
      de: "German",
      dv: "Divehi",
      dz: "Dzongkha",
      ee: "Ewe",
      el: "Greek",
      en: "English",
      eo: "Esperanto",
      es: "Spanish",
      et: "Estonian",
      eu: "Basque",
      fa: "Persian",
      ff: "Fula",
      fi: "Finnish",
      fj: "Fijian",
      fo: "Faroese",
      fr: "French",
      fy: "Western Frisian",
      ga: "Irish",
      gd: "Scottish Gaelic",
      gl: "Galician",
      gn: "Guaraní",
      gu: "Gujarati",
      gv: "Manx",
      ha: "Hausa",
      he: "Hebrew",
      hi: "Hindi",
      ho: "Hiri Motu",
      hr: "Croatian",
      ht: "Haitian",
      hu: "Hungarian",
      hy: "Armenian",
      hz: "Herero",
      ia: "Interlingua",
      id: "Indonesian",
      ie: "Interlingue",
      ig: "Igbo",
      ii: "Nuosu",
      ik: "Inupiaq",
      io: "Ido",
      is: "Icelandic",
      it: "Italian",
      iu: "Inuktitut",
      ja: "Japanese",
      jv: "Javanese",
      ka: "Georgian",
      kg: "Kongo",
      ki: "Kikuyu",
      kj: "Kwanyama",
      kk: "Kazakh",
      kl: "Kalaallisut",
      km: "Khmer",
      kn: "Kannada",
      ko: "Korean",
      kr: "Kanuri",
      ks: "Kashmiri",
      ku: "Kurdish",
      kv: "Komi",
      kw: "Cornish",
      ky: "Kyrgyz",
      la: "Latin",
      lb: "Luxembourgish",
      lg: "Ganda",
      li: "Limburgish",
      ln: "Lingala",
      lo: "Lao",
      lt: "Lithuanian",
      lu: "Luba-Katanga",
      lv: "Latvian",
      mg: "Malagasy",
      mh: "Marshallese",
      mi: "Māori",
      mk: "Macedonian",
      ml: "Malayalam",
      mn: "Mongolian",
      mr: "Marathi",
      ms: "Malay",
      mt: "Maltese",
      my: "Burmese",
      na: "Nauru",
      nb: "Norwegian Bokmål",
      nd: "Northern Ndebele",
      ne: "Nepali",
      ng: "Ndonga",
      nl: "Dutch",
      nn: "Norwegian Nynorsk",
      no: "Norwegian",
      nr: "Southern Ndebele",
      nv: "Navajo",
      ny: "Chichewa",
      oc: "Occitan",
      oj: "Ojibwe",
      om: "Oromo",
      or: "Oriya",
      os: "Ossetian",
      pa: "Panjabi",
      pi: "Pāli",
      pl: "Polish",
      ps: "Pashto",
      pt: "Portuguese",
      qu: "Quechua",
      rm: "Romansh",
      rn: "Kirundi",
      ro: "Romanian",
      ru: "Russian",
      rw: "Kinyarwanda",
      sa: "Sanskrit",
      sc: "Sardinian",
      sd: "Sindhi",
      se: "Northern Sami",
      sg: "Sango",
      sh: "Serbo-Croatian",
      si: "Sinhala",
      sk: "Slovak",
      sl: "Slovenian",
      sm: "Samoan",
      sn: "Shona",
      so: "Somali",
      sq: "Albanian",
      sr: "Serbian",
      ss: "Swati",
      st: "Southern Sotho",
      su: "Sundanese",
      sv: "Swedish",
      sw: "Swahili",
      ta: "Tamil",
      te: "Telugu",
      tg: "Tajik",
      th: "Thai",
      ti: "Tigrinya",
      tk: "Turkmen",
      tl: "Tagalog",
      tn: "Tswana",
      to: "Tonga",
      tr: "Turkish",
      ts: "Tsonga",
      tt: "Tatar",
      tw: "Twi",
      ty: "Tahitian",
      ug: "Uyghur",
      uk: "Ukrainian",
      ur: "Urdu",
      uz: "Uzbek",
      ve: "Venda",
      vi: "Vietnamese",
      vo: "Volapük",
      wa: "Walloon",
      wo: "Wolof",
      xh: "Xhosa",
      yi: "Yiddish",
      yo: "Yoruba",
      za: "Zhuang",
      zh: "Chinese",
      zu: "Zulu",
    },
    i = {
      aar: "Afar",
      abk: "Abkhaz",
      ace: "Achinese",
      ach: "Acoli",
      ada: "Adangme",
      ady: "Adyghe; Adygei",
      afa: "Afro-Asiatic languages",
      afh: "Afrihili",
      afr: "Afrikaans",
      ain: "Ainu",
      aka: "Akan",
      akk: "Akkadian",
      alb: "Albanian",
      ale: "Aleut",
      alg: "Algonquian languages",
      alt: "Southern Altai",
      amh: "Amharic",
      ang: "English, Old (ca.450-1100)",
      anp: "Angika",
      apa: "Apache languages",
      ara: "Arabic",
      arc: "Official Aramaic (700-300 BCE); Imperial Aramaic (700-300 BCE)",
      arg: "Aragonese",
      arm: "Armenian",
      arn: "Mapudungun; Mapuche",
      arp: "Arapaho",
      art: "Artificial languages",
      arw: "Arawak",
      asm: "Assamese",
      ast: "Asturian; Bable; Leonese; Asturleonese",
      ath: "Athapascan languages",
      aus: "Australian languages",
      ava: "Avaric",
      ave: "Avestan",
      awa: "Awadhi",
      aym: "Aymara",
      aze: "Azerbaijani",
      bad: "Banda languages",
      bai: "Bamileke languages",
      bak: "Bashkir",
      bal: "Baluchi",
      bam: "Bambara",
      ban: "Balinese",
      baq: "Basque",
      bas: "Basa",
      bat: "Baltic languages",
      bej: "Beja; Bedawiyet",
      bel: "Belarusian",
      bem: "Bemba",
      ben: "Bengali",
      ber: "Berber languages",
      bho: "Bhojpuri",
      bik: "Bikol",
      bin: "Bini; Edo",
      bis: "Bislama",
      bla: "Siksika",
      bnt: "Bantu languages",
      bos: "Bosnian",
      bra: "Braj",
      bre: "Breton",
      btk: "Batak languages",
      bua: "Buriat",
      bug: "Buginese",
      bul: "Bulgarian",
      bur: "Burmese",
      byn: "Blin; Bilin",
      cad: "Caddo",
      cai: "Central American Indian languages",
      car: "Galibi Carib",
      cat: "Catalan",
      cau: "Caucasian languages",
      ceb: "Cebuano",
      cel: "Celtic languages",
      cha: "Chamorro",
      chb: "Chibcha",
      che: "Chechen",
      chg: "Chagatai",
      chi: "Chinese",
      chk: "Chuukese",
      chm: "Mari",
      chn: "Chinook jargon",
      cho: "Choctaw",
      chp: "Chipewyan; Dene Suline",
      chr: "Cherokee",
      chu: "Old Church Slavonic",
      chv: "Chuvash",
      chy: "Cheyenne",
      cmc: "Chamic languages",
      cnr: "Montenegrin",
      cop: "Coptic",
      cor: "Cornish",
      cos: "Corsican",
      cpe: "Creoles and pidgins, English based",
      cpf: "Creoles and pidgins, French-based",
      cpp: "Creoles and pidgins, Portuguese-based",
      cre: "Cree",
      crh: "Crimean Tatar; Crimean Turkish",
      crp: "Creoles and pidgins",
      csb: "Kashubian",
      cus: "Cushitic languages",
      cze: "Czech",
      dak: "Dakota",
      dan: "Danish",
      dar: "Dargwa",
      day: "Land Dayak languages",
      del: "Delaware",
      den: "Slave (Athapascan)",
      dgr: "Dogrib",
      din: "Dinka",
      div: "Divehi",
      doi: "Dogri",
      dra: "Dravidian languages",
      dsb: "Lower Sorbian",
      dua: "Duala",
      dum: "Dutch, Middle (ca.1050-1350)",
      dut: "Dutch",
      dyu: "Dyula",
      dzo: "Dzongkha",
      efi: "Efik",
      egy: "Egyptian (Ancient)",
      eka: "Ekajuk",
      elx: "Elamite",
      eng: "English",
      enm: "English, Middle (1100-1500)",
      epo: "Esperanto",
      est: "Estonian",
      ewe: "Ewe",
      ewo: "Ewondo",
      fan: "Fang",
      fao: "Faroese",
      fat: "Fanti",
      fij: "Fijian",
      fil: "Filipino; Pilipino",
      fin: "Finnish",
      fiu: "Finno-Ugrian languages",
      fon: "Fon",
      fre: "French",
      frm: "French, Middle (ca.1400-1600)",
      fro: "French, Old (842-ca.1400)",
      frr: "Northern Frisian",
      frs: "Eastern Frisian",
      fry: "Western Frisian",
      ful: "Fula",
      fur: "Friulian",
      gaa: "Ga",
      gay: "Gayo",
      gba: "Gbaya",
      gem: "Germanic languages",
      geo: "Georgian",
      ger: "German",
      gez: "Geez",
      gil: "Gilbertese",
      gla: "Scottish Gaelic",
      gle: "Irish",
      glg: "Galician",
      glv: "Manx",
      gmh: "German, Middle High (ca.1050-1500)",
      goh: "German, Old High (ca.750-1050)",
      gon: "Gondi",
      gor: "Gorontalo",
      got: "Gothic",
      grb: "Grebo",
      grc: "Greek, Ancient (to 1453)",
      gre: "Greek",
      grn: "Guaraní",
      gsw: "Swiss German; Alemannic; Alsatian",
      guj: "Gujarati",
      gwi: "Gwich'in",
      hai: "Haida",
      hat: "Haitian",
      hau: "Hausa",
      haw: "Hawaiian",
      heb: "Hebrew",
      her: "Herero",
      hil: "Hiligaynon",
      him: "Himachali languages; Western Pahari languages",
      hin: "Hindi",
      hit: "Hittite",
      hmn: "Hmong; Mong",
      hmo: "Hiri Motu",
      hrv: "Croatian",
      hsb: "Upper Sorbian",
      hun: "Hungarian",
      hup: "Hupa",
      iba: "Iban",
      ibo: "Igbo",
      ice: "Icelandic",
      ido: "Ido",
      iii: "Nuosu",
      ijo: "Ijo languages",
      iku: "Inuktitut",
      ile: "Interlingue",
      ilo: "Iloko",
      ina: "Interlingua",
      inc: "Indic languages",
      ind: "Indonesian",
      ine: "Indo-European languages",
      inh: "Ingush",
      ipk: "Inupiaq",
      ira: "Iranian languages",
      iro: "Iroquoian languages",
      ita: "Italian",
      jav: "Javanese",
      jbo: "Lojban",
      jpn: "Japanese",
      jpr: "Judeo-Persian",
      jrb: "Judeo-Arabic",
      kaa: "Kara-Kalpak",
      kab: "Kabyle",
      kac: "Kachin; Jingpho",
      kal: "Kalaallisut",
      kam: "Kamba",
      kan: "Kannada",
      kar: "Karen languages",
      kas: "Kashmiri",
      kau: "Kanuri",
      kaw: "Kawi",
      kaz: "Kazakh",
      kbd: "Kabardian",
      kha: "Khasi",
      khi: "Khoisan languages",
      khm: "Khmer",
      kho: "Khotanese; Sakan",
      kik: "Kikuyu",
      kin: "Kinyarwanda",
      kir: "Kyrgyz",
      kmb: "Kimbundu",
      kok: "Konkani",
      kom: "Komi",
      kon: "Kongo",
      kor: "Korean",
      kos: "Kosraean",
      kpe: "Kpelle",
      krc: "Karachay-Balkar",
      krl: "Karelian",
      kro: "Kru languages",
      kru: "Kurukh",
      kua: "Kwanyama",
      kum: "Kumyk",
      kur: "Kurdish",
      kut: "Kutenai",
      lad: "Ladino",
      lah: "Lahnda",
      lam: "Lamba",
      lao: "Lao",
      lat: "Latin",
      lav: "Latvian",
      lez: "Lezghian",
      lim: "Limburgish",
      lin: "Lingala",
      lit: "Lithuanian",
      lol: "Mongo",
      loz: "Lozi",
      ltz: "Luxembourgish",
      lua: "Luba-Lulua",
      lub: "Luba-Katanga",
      lug: "Ganda",
      lui: "Luiseno",
      lun: "Lunda",
      luo: "Luo (Kenya and Tanzania)",
      lus: "Lushai",
      mac: "Macedonian",
      mad: "Madurese",
      mag: "Magahi",
      mah: "Marshallese",
      mai: "Maithili",
      mak: "Makasar",
      mal: "Malayalam",
      man: "Mandingo",
      mao: "Māori",
      map: "Austronesian languages",
      mar: "Marathi",
      mas: "Masai",
      may: "Malay",
      mdf: "Moksha",
      mdr: "Mandar",
      men: "Mende",
      mga: "Irish, Middle (900-1200)",
      mic: "Mi'kmaq; Micmac",
      min: "Minangkabau",
      mis: "Uncoded languages",
      mkh: "Mon-Khmer languages",
      mlg: "Malagasy",
      mlt: "Maltese",
      mnc: "Manchu",
      mni: "Manipuri",
      mno: "Manobo languages",
      moh: "Mohawk",
      mon: "Mongolian",
      mos: "Mossi",
      mul: "Multiple languages",
      mun: "Munda languages",
      mus: "Creek",
      mwl: "Mirandese",
      mwr: "Marwari",
      myn: "Mayan languages",
      myv: "Erzya",
      nah: "Nahuatl languages",
      nai: "North American Indian languages",
      nap: "Neapolitan",
      nau: "Nauru",
      nav: "Navajo",
      nbl: "Southern Ndebele",
      nde: "Northern Ndebele",
      ndo: "Ndonga",
      nds: "Low German; Low Saxon; German, Low; Saxon, Low",
      nep: "Nepali",
      new: "Nepal Bhasa; Newari",
      nia: "Nias",
      nic: "Niger-Kordofanian languages",
      niu: "Niuean",
      nno: "Norwegian Nynorsk",
      nob: "Norwegian Bokmål",
      nog: "Nogai",
      non: "Norse, Old",
      nor: "Norwegian",
      nqo: "N'Ko",
      nso: "Pedi; Sepedi; Northern Sotho",
      nub: "Nubian languages",
      nwc: "Classical Newari; Old Newari; Classical Nepal Bhasa",
      nya: "Chichewa",
      nym: "Nyamwezi",
      nyn: "Nyankole",
      nyo: "Nyoro",
      nzi: "Nzima",
      oci: "Occitan",
      oji: "Ojibwe",
      ori: "Oriya",
      orm: "Oromo",
      osa: "Osage",
      oss: "Ossetian",
      ota: "Turkish, Ottoman (1500-1928)",
      oto: "Otomian languages",
      paa: "Papuan languages",
      pag: "Pangasinan",
      pal: "Pahlavi",
      pam: "Pampanga; Kapampangan",
      pan: "Panjabi",
      pap: "Papiamento",
      pau: "Palauan",
      peo: "Persian, Old (ca.600-400 B.C.)",
      per: "Persian",
      phi: "Philippine languages",
      phn: "Phoenician",
      pli: "Pāli",
      pol: "Polish",
      pon: "Pohnpeian",
      por: "Portuguese",
      pra: "Prakrit languages",
      pro: "Provençal, Old (to 1500); Occitan, Old (to 1500)",
      pus: "Pashto",
      "qaa-qtz": "Reserved for local use",
      que: "Quechua",
      raj: "Rajasthani",
      rap: "Rapanui",
      rar: "Rarotongan; Cook Islands Maori",
      roa: "Romance languages",
      roh: "Romansh",
      rom: "Romany",
      rum: "Romanian",
      run: "Kirundi",
      rup: "Aromanian; Arumanian; Macedo-Romanian",
      rus: "Russian",
      sad: "Sandawe",
      sag: "Sango",
      sah: "Yakut",
      sai: "South American Indian languages",
      sal: "Salishan languages",
      sam: "Samaritan Aramaic",
      san: "Sanskrit",
      sas: "Sasak",
      sat: "Santali",
      scn: "Sicilian",
      sco: "Scots",
      sel: "Selkup",
      sem: "Semitic languages",
      sga: "Irish, Old (to 900)",
      sgn: "Sign Languages",
      shn: "Shan",
      sid: "Sidamo",
      sin: "Sinhala",
      sio: "Siouan languages",
      sit: "Sino-Tibetan languages",
      sla: "Slavic languages",
      slo: "Slovak",
      slv: "Slovenian",
      sma: "Southern Sami",
      sme: "Northern Sami",
      smi: "Sami languages",
      smj: "Lule Sami",
      smn: "Inari Sami",
      smo: "Samoan",
      sms: "Skolt Sami",
      sna: "Shona",
      snd: "Sindhi",
      snk: "Soninke",
      sog: "Sogdian",
      som: "Somali",
      son: "Songhai languages",
      sot: "Southern Sotho",
      spa: "Spanish",
      srd: "Sardinian",
      srn: "Sranan Tongo",
      srp: "Serbian",
      srr: "Serer",
      ssa: "Nilo-Saharan languages",
      ssw: "Swati",
      suk: "Sukuma",
      sun: "Sundanese",
      sus: "Susu",
      sux: "Sumerian",
      swa: "Swahili",
      swe: "Swedish",
      syc: "Classical Syriac",
      syr: "Syriac",
      tah: "Tahitian",
      tai: "Tai languages",
      tam: "Tamil",
      tat: "Tatar",
      tel: "Telugu",
      tem: "Timne",
      ter: "Tereno",
      tet: "Tetum",
      tgk: "Tajik",
      tgl: "Tagalog",
      tha: "Thai",
      tib: "Tibetan",
      tig: "Tigre",
      tir: "Tigrinya",
      tiv: "Tiv",
      tkl: "Tokelau",
      tlh: "Klingon; tlhIngan-Hol",
      tli: "Tlingit",
      tmh: "Tamashek",
      tog: "Tonga (Nyasa)",
      ton: "Tonga",
      tpi: "Tok Pisin",
      tsi: "Tsimshian",
      tsn: "Tswana",
      tso: "Tsonga",
      tuk: "Turkmen",
      tum: "Tumbuka",
      tup: "Tupi languages",
      tur: "Turkish",
      tut: "Altaic languages",
      tvl: "Tuvalu",
      twi: "Twi",
      tyv: "Tuvinian",
      udm: "Udmurt",
      uga: "Ugaritic",
      uig: "Uyghur",
      ukr: "Ukrainian",
      umb: "Umbundu",
      und: "Undetermined",
      urd: "Urdu",
      uzb: "Uzbek",
      vai: "Vai",
      ven: "Venda",
      vie: "Vietnamese",
      vol: "Volapük",
      vot: "Votic",
      wak: "Wakashan languages",
      wal: "Wolaitta; Wolaytta",
      war: "Waray",
      was: "Washo",
      wel: "Welsh",
      wen: "Sorbian languages",
      wln: "Walloon",
      wol: "Wolof",
      xal: "Kalmyk; Oirat",
      xho: "Xhosa",
      yao: "Yao",
      yap: "Yapese",
      yid: "Yiddish",
      yor: "Yoruba",
      ypk: "Yupik languages",
      zap: "Zapotec",
      zbl: "Blissymbols; Blissymbolics; Bliss",
      zen: "Zenaga",
      zgh: "Standard Moroccan Tamazight",
      zha: "Zhuang",
      znd: "Zande languages",
      zul: "Zulu",
      zun: "Zuni",
      zxx: "No linguistic content; Not applicable",
      zza: "Zaza; Dimili; Dimli; Kirdki; Kirmanjki; Zazaki",
    },
    r = {
      AF: "Afghanistan",
      AX: "Åland Islands",
      AL: "Albania",
      DZ: "Algeria",
      AS: "American Samoa",
      AD: "Andorra",
      AO: "Angola",
      AI: "Anguilla",
      AQ: "Antarctica",
      AG: "Antigua and Barbuda",
      AR: "Argentina",
      AM: "Armenia",
      AW: "Aruba",
      AU: "Australia",
      AT: "Austria",
      AZ: "Azerbaijan",
      BS: "Bahamas",
      BH: "Bahrain",
      BD: "Bangladesh",
      BB: "Barbados",
      BY: "Belarus",
      BE: "Belgium",
      BZ: "Belize",
      BJ: "Benin",
      BM: "Bermuda",
      BT: "Bhutan",
      BO: "Bolivia, Plurinational State of",
      BQ: "Bonaire, Sint Eustatius and Saba",
      BA: "Bosnia and Herzegovina",
      BW: "Botswana",
      BV: "Bouvet Island",
      BR: "Brazil",
      IO: "British Indian Ocean Territory",
      BN: "Brunei Darussalam",
      BG: "Bulgaria",
      BF: "Burkina Faso",
      BI: "Burundi",
      KH: "Cambodia",
      CM: "Cameroon",
      CA: "Canada",
      CV: "Cape Verde",
      KY: "Cayman Islands",
      CF: "Central African Republic",
      TD: "Chad",
      CL: "Chile",
      CN: "China",
      CX: "Christmas Island",
      CC: "Cocos (Keeling) Islands",
      CO: "Colombia",
      KM: "Comoros",
      CG: "Congo",
      CD: "Congo, the Democratic Republic of the",
      CK: "Cook Islands",
      CR: "Costa Rica",
      CI: "Côte d'Ivoire",
      HR: "Croatia",
      CU: "Cuba",
      CW: "Curaçao",
      CY: "Cyprus",
      CZ: "Czech Republic",
      DK: "Denmark",
      DJ: "Djibouti",
      DM: "Dominica",
      DO: "Dominican Republic",
      EC: "Ecuador",
      EG: "Egypt",
      SV: "El Salvador",
      GQ: "Equatorial Guinea",
      ER: "Eritrea",
      EE: "Estonia",
      ET: "Ethiopia",
      FK: "Falkland Islands (Malvinas)",
      FO: "Faroe Islands",
      FJ: "Fiji",
      FI: "Finland",
      FR: "France",
      GF: "French Guiana",
      PF: "French Polynesia",
      TF: "French Southern Territories",
      GA: "Gabon",
      GM: "Gambia",
      GE: "Georgia",
      DE: "Germany",
      GH: "Ghana",
      GI: "Gibraltar",
      GR: "Greece",
      GL: "Greenland",
      GD: "Grenada",
      GP: "Guadeloupe",
      GU: "Guam",
      GT: "Guatemala",
      GG: "Guernsey",
      GN: "Guinea",
      GW: "Guinea-Bissau",
      GY: "Guyana",
      HT: "Haiti",
      HM: "Heard Island and McDonald Islands",
      VA: "Holy See (Vatican City State)",
      HN: "Honduras",
      HK: "Hong Kong",
      HU: "Hungary",
      IS: "Iceland",
      IN: "India",
      ID: "Indonesia",
      IR: "Iran, Islamic Republic of",
      IQ: "Iraq",
      IE: "Ireland",
      IM: "Isle of Man",
      IL: "Israel",
      IT: "Italy",
      JM: "Jamaica",
      JP: "Japan",
      JE: "Jersey",
      JO: "Jordan",
      KZ: "Kazakhstan",
      KE: "Kenya",
      KI: "Kiribati",
      KP: "Korea, Democratic People's Republic of",
      KR: "Korea, Republic of",
      KW: "Kuwait",
      KG: "Kyrgyzstan",
      LA: "Lao People's Democratic Republic",
      LV: "Latvia",
      LB: "Lebanon",
      LS: "Lesotho",
      LR: "Liberia",
      LY: "Libya",
      LI: "Liechtenstein",
      LT: "Lithuania",
      LU: "Luxembourg",
      MO: "Macao",
      MK: "Macedonia, the Former Yugoslav Republic of",
      MG: "Madagascar",
      MW: "Malawi",
      MY: "Malaysia",
      MV: "Maldives",
      ML: "Mali",
      MT: "Malta",
      MH: "Marshall Islands",
      MQ: "Martinique",
      MR: "Mauritania",
      MU: "Mauritius",
      YT: "Mayotte",
      MX: "Mexico",
      FM: "Micronesia, Federated States of",
      MD: "Moldova, Republic of",
      MC: "Monaco",
      MN: "Mongolia",
      ME: "Montenegro",
      MS: "Montserrat",
      MA: "Morocco",
      MZ: "Mozambique",
      MM: "Myanmar",
      NA: "Namibia",
      NR: "Nauru",
      NP: "Nepal",
      NL: "Netherlands",
      NC: "New Caledonia",
      NZ: "New Zealand",
      NI: "Nicaragua",
      NE: "Niger",
      NG: "Nigeria",
      NU: "Niue",
      NF: "Norfolk Island",
      MP: "Northern Mariana Islands",
      NO: "Norway",
      OM: "Oman",
      PK: "Pakistan",
      PW: "Palau",
      PS: "Palestine, State of",
      PA: "Panama",
      PG: "Papua New Guinea",
      PY: "Paraguay",
      PE: "Peru",
      PH: "Philippines",
      PN: "Pitcairn",
      PL: "Poland",
      PT: "Portugal",
      PR: "Puerto Rico",
      QA: "Qatar",
      RE: "Réunion",
      RO: "Romania",
      RU: "Russian Federation",
      RW: "Rwanda",
      BL: "Saint Barthélemy",
      SH: "Saint Helena, Ascension and Tristan da Cunha",
      KN: "Saint Kitts and Nevis",
      LC: "Saint Lucia",
      MF: "Saint Martin (French part)",
      PM: "Saint Pierre and Miquelon",
      VC: "Saint Vincent and the Grenadines",
      WS: "Samoa",
      SM: "San Marino",
      ST: "Sao Tome and Principe",
      SA: "Saudi Arabia",
      SN: "Senegal",
      RS: "Serbia",
      SC: "Seychelles",
      SL: "Sierra Leone",
      SG: "Singapore",
      SX: "Sint Maarten (Dutch part)",
      SK: "Slovakia",
      SI: "Slovenia",
      SB: "Solomon Islands",
      SO: "Somalia",
      ZA: "South Africa",
      GS: "South Georgia and the South Sandwich Islands",
      SS: "South Sudan",
      ES: "Spain",
      LK: "Sri Lanka",
      SD: "Sudan",
      SR: "Suriname",
      SJ: "Svalbard and Jan Mayen",
      SZ: "Swaziland",
      SE: "Sweden",
      CH: "Switzerland",
      SY: "Syrian Arab Republic",
      TW: "Taiwan",
      TJ: "Tajikistan",
      TZ: "Tanzania, United Republic of",
      TH: "Thailand",
      TL: "Timor-Leste",
      TG: "Togo",
      TK: "Tokelau",
      TO: "Tonga",
      TT: "Trinidad and Tobago",
      TN: "Tunisia",
      TR: "Turkey",
      TM: "Turkmenistan",
      TC: "Turks and Caicos Islands",
      TV: "Tuvalu",
      UG: "Uganda",
      UA: "Ukraine",
      AE: "United Arab Emirates",
      GB: "United Kingdom",
      US: "United States",
      UM: "United States Minor Outlying Islands",
      UY: "Uruguay",
      UZ: "Uzbekistan",
      VU: "Vanuatu",
      VE: "Venezuela, Bolivarian Republic of",
      VN: "Viet Nam",
      VG: "Virgin Islands, British",
      VI: "Virgin Islands, U.S.",
      WF: "Wallis and Futuna",
      EH: "Western Sahara",
      YE: "Yemen",
      ZM: "Zambia",
      ZW: "Zimbabwe",
    };
  return t.length > 1
    ? (n[t[0]] || i[t[0]] || t[0]) +
        " (" +
        (r[t[1]] || t[1]) +
        ")" +
        t
          .slice(2)
          .map(function (e) {
            return "(".concat(e, ")");
          })
          .join("")
    : t.length > 0
      ? n[t[0]] || i[t[0]] || r[t[0]] || t[0]
      : "";
}
function getLanguage() {
  return localStorage.getItem(languageLiteral) || fallbackLng;
}
function sm(e) {
  var lang = getLanguage();
  ["ar", "dv", "fa", "ff", "he", "ks", "ku", "ur", "wo", "yi"].contains(lang) && e.body.addClass("mod-rtl");
  e.documentElement.lang = lang;
}
function lm(e) {
  var t = getLanguage();
  return new Intl.NumberFormat(t, e);
}
const cm = StateEffect.define();
const um = StateEffect.define();
const hm = new Map();
const pm = StateField.define({
  create: function () {
    return Decoration.none;
  },
  update: function (e, t) {
    e = e.map(t.changes);
    for (var n = 0, i = t.effects; n < i.length; n++) {
      var r = i[n];
      r.is(cm)
        ? (e = e.update({
            add: r.value,
            sort: true,
          }))
        : r.is(um) &&
          (e = e.update({
            filter: r.value,
          }));
    }
    return e;
  },
  provide: function (e) {
    return EditorView.decorations.from(e);
  },
});
var dm = StateEffect.define(),
  fm = EditorView.inputHandler.of(function (e, t, n, i) {
    if (i !== "-") return !1;
    var r = e.state.selection.main;
    if (t != r.from || n != r.to) return !1;
    var o = e.state.doc.lineAt(t);
    if (o.from > 0) return !1;
    if (/^--$/.test(o.text)) {
      e.dispatch({
        changes: [
          {
            insert: "-\n\n---\n",
            from: o.to,
          },
        ],
        selection: {
          anchor: t + 2,
        },
        effects: [dm.of()],
        userEvent: "input.type",
      });
      return !0;
    }
    return !1;
  }),
  mm = Annotation.define();
function gm(e) {
  return e.annotation(Transaction.userEvent) !== "set";
}
function vm(e) {
  return e.isUserEvent("input") || e.isUserEvent("delete");
}
function ym(e, t) {
  if (t.line < 0) return 0;
  var n = t.line + 1;
  if (n > e.lines) return e.length;
  var i = e.line(n);
  return isFinite(t.ch) ? (t.ch < 0 ? i.from + Math.max(0, i.length + t.ch) : i.from + t.ch) : i.to;
}
function bm(e, t) {
  t = Math.clamp(t, 0, e.length);
  var n = e.lineAt(t);
  return {
    line: n.number - 1,
    ch: t - n.from,
  };
}
function wm(e, t, n) {
  return e.from <= n && e.to >= t;
}
function km(e, t, n) {
  for (var i = 0, r = e; i < r.length; i++) {
    if (wm(r[i], t, n)) return !0;
  }
  return !1;
}
function Cm(e, t, n, i) {
  var r = false;
  e.between(n, i, function (e, n, i) {
    if (i === t) {
      r = true;
      return !1;
    }
  });
  return r;
}
var Em = StateEffect.define();
function Sm(e, t) {
  return e.some(function (e) {
    return e.effects.some(function (e) {
      return e.is(t);
    });
  });
}
function Mm(e, t) {
  return EditorSelection.create(
    e.ranges.map((range) => {
      const { anchor, head, goalColumn, bidiLevel } = range;
      return EditorSelection.range(anchor + t, head + t, goalColumn, bidiLevel);
    }),
    e.mainIndex,
  );
}
function xm(e, t, n) {
  return EditorSelection.create(
    e.ranges.map(function (e) {
      var i = e.anchor,
        r = e.head,
        o = e.goalColumn,
        a = e.bidiLevel;
      return EditorSelection.range(Math.clamp(i, t, n), Math.clamp(r, t, n), o, a);
    }),
    e.mainIndex,
  );
}
function Tm(result) {
  for (
    var t = [], n = 0, i = result.length, r = 0, o = Array.from(result.matchAll(/(\r?\n|\\*\|)/g));
    r < o.length;
    r++
  ) {
    var a = o[r],
      s = a[1],
      from = a.index,
      c = s.length,
      u = s[c - 1] === "|";
    if (u) {
      var h = s.match(/^(\\+)/);
      if (h && h[1].length % 2 == 1) continue;
      if (h) {
        from = from + c - 1;
        c = 1;
      }
    }
    var insert = u ? "\\|" : "<br>",
      d = from + n;
    result = result.substring(0, d) + insert + result.substring(d + c);
    n -= c - insert.length;
    t.push({
      from: from,
      to: from + c,
      insert: insert,
    });
  }
  return {
    result: result,
    changes: ChangeSet.of(t, i),
  };
}
function Dm(result) {
  for (
    var t = [], n = 0, i = result.length, r = 0, o = Array.from(result.matchAll(/(\\+\||<br>)/gi));
    r < o.length;
    r++
  ) {
    var a = o[r],
      s = a[1],
      from = a.index,
      c = s.length,
      u = s.toLowerCase() !== "<br>";
    if (u) {
      var h = s.match(/^(\\+)/);
      if (h && h[1].length % 2 == 0) continue;
      if (h) {
        from = from + c - 2;
        c = 2;
      }
    }
    var insert = u ? "|" : "\n",
      d = from + n;
    result = result.substring(0, d) + insert + result.substring(d + c);
    n -= c - insert.length;
    t.push({
      from: from,
      to: from + c,
      insert: insert,
    });
  }
  return {
    result: result,
    changes: ChangeSet.of(t, i),
  };
}
function Am(e, t, n) {
  return e.anchor >= e.head
    ? EditorSelection.range(n, t, e.goalColumn, e.bidiLevel)
    : EditorSelection.range(t, n, e.goalColumn, e.bidiLevel);
}
var Pm = /^\s{0,3}>(\s*)/;
function Lm(e) {
  var t = e.match(Pm);
  if (!t) return 0;
  for (var n = t[0].length - t[1].length, i = t[1]; i.startsWith("    "); ) i = i.substring(4);
  return i.startsWith(" ") ? n + 1 : n;
}
const { parseDocument, stringify } = require("yaml");
function parseYaml(e) {
  return parseDocument(e, null, {});
}
function stringifyYaml(e) {
  return stringify(e, null, {
    nullStr: "",
    lineWidth: 0,
    aliasDuplicateObjects: false,
  });
  /*return (function (value, replacer, options) {
    let _replacer = null;
    if (
      ("function" == typeof replacer || Array.isArray(replacer)
        ? (_replacer = replacer)
        : undefined === options && replacer && (options = replacer),
      "string" == typeof options && (options = options.length),
      "number" == typeof options)
    ) {
      const e = Math.round(options);
      options = e < 1 ? undefined : e > 8 ? { indent: 8 } : { indent: e };
    }
    if (undefined === value) {
      const { keepUndefined: e } = options ?? replacer ?? {};
      if (!e) return;
    }
    return isDocument(value) && !_replacer ? value.toString(options) : new Document(value, _replacer, options).toString(options);
  })(e, null, { nullStr: "", lineWidth: 0, aliasDuplicateObjects: false });*/
}
const moment = window.moment;
const { u: UnistBuilder } = require("unist-builder");
const { visit } = require("unist-util-visit");
const { Parser: remarkParser } = require("remark-parse");
const unistBuilder = UnistBuilder();
const TransformerCache = (function () {
  function e() {
    this.transformers = [];
  }
  e.prototype.addTransformer = function (e) {
    this.transformers.push(e);
  };
  e.prototype.removeTransformer = function (e) {
    for (var t = this.transformers, n = 0; n < t.length; ) t[n] === e ? t.splice(n, 1) : n++;
  };
  return e;
})();
function registerInlineTokenizer(parser, type, after, tokenizer, locator) {
  tokenizer.locator = locator;
  const tokenizers = parser.prototype.inlineTokenizers;
  const methods = parser.prototype.inlineMethods;
  tokenizers[type] = tokenizer;
  methods.splice(methods.indexOf(after), 0, type);
}
function registerBlockTokenizer(parser, type, after, tokenizer, locator) {
  tokenizer.locator = locator;
  const tokenizers = parser.prototype.blockTokenizers;
  const methods = parser.prototype.blockMethods;
  tokenizers[type] = tokenizer;
  methods.splice(methods.indexOf(after), 0, type);
}
function registerAfter(cache, expect, value) {
  for (var i = 0; i < cache.length && cache[i][0] !== expect; i++);
  cache.splice(i + 1, 0, [value]);
}

function substringWithOption(value, option) {
  var start = option.position.end;
  var end = option.position.end;
  var children = option.children;
  if (children.length > 0) {
    start = children[0].position.start;
    end = children[children.length - 1].position.end;
  }
  return value.substring(start.offset, end.offset).trim();
}
var hb = /^#[^\u2000-\u206F\u2E00-\u2E7F'!"#$%&()*+,.:;<=>?@^`{|}~\[\]\\\s]+/;
function pb(e, t, n) {
  var i = e.metadataCache.getFileCache(t);
  if (!i || !i.headings) return null;
  for (var r = null, o = 0, a = i.headings; o < a.length; o++) {
    var s = a[o];
    if (s.position.start.line > n.line) break;
    r = s;
  }
  return r;
}
function db(e, t) {
  var n = e.content,
    i = e.node,
    blockStart = i.position.start.offset,
    blockEnd = i.position.end.offset,
    newlines = 0,
    s = i.type === "paragraph" || i.type === "listItem",
    addition = "^" + t;
  if (s) {
    if (((addition = " " + addition), i.type === "listItem")) {
      var c = i.children;
      if (c && c.length > 1) {
        var u = c[c.length - 1],
          h = c[c.length - 2];
        if (u.type === "list") {
          blockEnd = h.position.end.offset;
        }
      }
    }
  } else {
    addition = "\n\n" + addition;
    newlines = 2;
  }
  s || (n.charAt(blockEnd) === "\n" && n.charAt(blockEnd + 1) === "\n") || ((addition += "\n"), newlines++);
  return {
    blockStart: blockStart,
    blockEnd: blockEnd,
    addition: addition,
    newlines: newlines,
  };
}
var fb = new RegExp(hb.source + "$"),
  mb = /^#\d+$/;
function gb(e) {
  return !!e && fb.test(e) && !mb.test(e);
}
var vb = Decoration.mark({
    class: "is-invalid",
  }),
  yb = Decoration.replace({
    block: !0,
  });
function bb(e, t) {
  var n = e.coordsAtPos(t);
  if (!n) return !1;
  var i = e.coordsAtPos(wb(e.state.doc) + 1);
  return !!i && i.top === n.top;
}
function wb(e) {
  var t = -1;
  if (e.line(1).text === "---")
    for (var n = 2; n <= e.lines; n++) {
      var i = e.line(n);
      if (i.text === "---") {
        t = i.to;
        break;
      }
    }
  return t;
}
function kb(e, t) {
  var n = e.cm,
    i = "",
    r = null;
  function o(e) {
    if (e !== i) {
      i = e;
      try {
        !(function (e) {
          var t,
            n = (t = parseYaml(e)) !== null && undefined !== t ? t : {};
          if (typeof n != "object" || Array.isArray(n))
            throw new YAMLParseError([0, 0], "BAD_COLLECTION_TYPE", "Frontmatter must be a valid object!");
        })(e);
        r = null;
      } catch (e) {
        r = e;
      }
    }
    return r;
  }
  var a = StateField.define({
      create: function () {
        return Decoration.none;
      },
      update: function (t, n) {
        var i = [],
          r = n.newDoc,
          a = wb(n.newDoc),
          s = -1 !== a && e.app.vault.getConfig("propertiesInDocument") !== "source";
        if (-1 !== a) {
          var l = o(r.sliceString(3, a - 3));
          if (l) {
            s = false;
            i.push(vb.range(0, a));
            var c = Math.clamp(l.pos[0] + 3, 4, a - 3);
            i.push(
              Decoration.mark({
                class: "error-marker",
                attributes: {
                  "aria-label": i18nProxy.properties.labelInvalidYamlMarker(),
                },
              }).range(c, c + 1),
            );
          }
        }
        s && i.push(yb.range(0, a));
        return Decoration.set(i, !0);
      },
      provide: function (e) {
        return EditorView.decorations.from(e);
      },
    }),
    s = EditorState.transactionFilter.of(function (t) {
      if (n.composing || !gm(t)) return t;
      if (e.app.vault.getConfig("propertiesInDocument") === "source") return t;
      if (Sm([t], dm)) {
        n.dom.win.setTimeout(function () {
          e.app.commands.executeCommandById("markdown:add-metadata-property");
        }, 30);
        return t;
      }
      var i = t.startState.doc,
        r = wb(i);
      if (-1 === r) return t;
      if (o(i.sliceString(3, r - 3))) return t;
      var changes = undefined,
        s = t.newDoc,
        from = wb(s),
        c = s.length;
      if (c === from) {
        c++;
        changes = [
          {
            insert: "\n",
            from: from,
          },
        ];
      }
      var u = t.newSelection;
      if (
        u.ranges.some(function (e) {
          var t = e.from,
            n = e.to;
          return t <= r || n <= r;
        })
      ) {
        var h = false;
        if (
          (t.changes.iterChangedRanges(function (e, t, n, i) {
            e >= 3 && t < r - 1 && (h = true);
            n === i && t <= r + 1 && (h = true);
          }, !0),
          h)
        )
          return [];
        var p = function (e) {
            return Math.clamp(e, r + 1, c);
          },
          selection = EditorSelection.create(
            u.ranges.map(function (e) {
              return EditorSelection.range(p(e.anchor), p(e.head));
            }),
            u.mainIndex,
          );
        return [
          t,
          {
            changes: changes,
            selection: selection,
            sequential: !0,
          },
        ];
      }
      return t;
    });
  return [a, s];
}
var Cb = new Intl.Collator(undefined, {
    usage: "sort",
    sensitivity: "base",
    numeric: true,
  }).compare,
  Eb = Cb,
  Sb = function (e, t) {
    return -Cb(e, t);
  },
  Mb = function (e, t) {
    return e - t;
  };
function xb(line, t) {
  undefined === t && (t = 0);
  return {
    line: line,
    ch: t,
  };
}
function Tb(e, t) {
  return {
    line: e.line,
    ch: e.ch + t,
  };
}
function Db(e, t) {
  return e.line === t.line && e.ch === t.ch;
}
var Ab = /^([>\s]*)(([*+-] |(\d+)([.)] ))(?:\[(.)\] )?)?/,
  Pb = /^([>\s]*)(#{1,6} )?(.*)/,
  Lb = [
    {
      regex: /(！)?【【$/,
      replace: function (e) {
        return e[1] ? "![[" : "[[";
      },
    },
    {
      regex: /】】$/,
      replace: function () {
        return "]]";
      },
    },
    {
      regex: /【【$/,
      replace: function () {
        return "[[";
      },
    },
  ],
  Editor = (function () {
    function e() {}
    e.prototype.getDoc = function () {
      return this;
    };
    e.prototype.setLine = function (e, t) {
      this.replaceRange(t, xb(e, 0), xb(e, this.getLine(e).length));
    };
    e.prototype.somethingSelected = function () {
      return !!this.getSelection();
    };
    e.prototype.setCursor = function (line, t) {
      return Number.isNumber(line)
        ? this.setSelection({
            line: line,
            ch: t,
          })
        : this.setSelection(line);
    };
    e.prototype.posAtMouse = function (e) {
      return this.posAtCoords(e.clientX, e.clientY);
    };
    e.prototype.insertText = function (e) {
      var t = this.lineCount() - 1,
        n = xb(t, this.getLine(t).length);
      this.replaceRange(e, n);
      n = xb((t = this.lineCount() - 1), this.getLine(t).length);
      this.setSelection(n);
    };
    e.prototype.processLines = function (e, t, n) {
      if (undefined === n) {
        n = true;
      }
      for (
        var i = this.listSelections(),
          r = (function (e) {
            for (var t = [], n = 0, i = e; n < i.length; n++)
              for (
                var r = i[n], o = Math.min(r.anchor.line, r.head.line), a = Math.max(r.anchor.line, r.head.line), s = o;
                s <= a;
                s++
              )
                t.push(s);
            return ec(t).sort(Mb);
          })(i),
          o = [],
          a = 0,
          s = r;
        a < s.length;
        a++
      ) {
        var l = s[a],
          c = this.getLine(l);
        if (n && r.length > 1 && !c.trim()) o.push(null);
        else {
          var u = e(l, c);
          o.push(u);
        }
      }
      for (var changes = [], p = 0; p < r.length; p++) {
        l = r[p];
        u = o[p];
        if (!n || u !== null)
          if ((d = t(l, (c = this.getLine(l)), u))) {
            changes.push(d);
          }
      }
      if (changes.length !== 0) {
        if (i.length === 1) {
          var d = changes[0],
            f = i[0],
            from = f.anchor;
          if (from.ch === 0 && Db(from, f.head) && from.line === d.from.line) {
            var g = d.text.length - (d.to ? d.to.ch - d.from.ch : 0);
            from.ch += g;
            from.ch < 0 && (from.ch = 0);
            return void this.transaction({
              changes: changes,
              selection: {
                from: from,
              },
            });
          }
        }
        this.transaction({
          changes: changes,
        });
      }
    };
    e.prototype.setHeading = function (e) {
      this.processLines(
        function (e, t) {
          return t.match(Pb);
        },
        function (t, n, i) {
          var text = e === 0 ? "" : Array(e).fill("#").join("") + " ";
          return {
            from: xb(t, i[1].length),
            to: xb(t, n.length - i[3].length),
            text: text,
          };
        },
      );
    };
    e.prototype.toggleBlockquote = function () {
      var e = false;
      this.processLines(
        function (t, n) {
          var i = Lm(n);
          i === 0 && (e = true);
          return i;
        },
        function (t, n, i) {
          var r = i;
          return e && r === 0
            ? {
                from: xb(t, 0),
                text: "> ",
              }
            : e
              ? undefined
              : {
                  from: xb(t, 0),
                  to: xb(t, r),
                  text: "",
                };
        },
        !1,
      );
    };
    e.prototype.toggleBulletList = function () {
      var e = false;
      this.processLines(
        function (t, n) {
          var i = n.match(Ab);
          (!i[3] || i[4] || i[6]) && (e = true);
          return i;
        },
        function (t, n, i) {
          return i
            ? {
                from: xb(t, 0),
                to: xb(t, i[0].length),
                text: i[1] + (e ? "- " : ""),
              }
            : null;
        },
      );
    };
    e.prototype.toggleNumberList = function () {
      var e = false;
      this.processLines(
        function (t, n) {
          var i = n.match(Ab);
          i[4] || (e = true);
          return i;
        },
        function (t, n, i) {
          return i
            ? {
                from: xb(t, 0),
                to: xb(t, i[0].length),
                text: i[1] + (e ? "1. " : ""),
              }
            : null;
        },
      );
    };
    e.prototype.toggleCheckList = function (e) {
      var t = 3;
      this.processLines(
        function (n, i) {
          var r = i.match(Ab);
          t > 2 && r[6] === " " && (t = 2);
          t > 1 && !r[6] && (t = 1);
          e && t > 0 && !r[3] && (t = 0);
          return r;
        },
        function (n, i, r) {
          if (!r) return null;
          var o = r[0],
            a = r[1],
            s = r[3],
            l = {
              from: xb(n, 0),
              to: xb(n, o.length),
              text: i.substr(0, o.length),
            },
            text = a + (s || "- ");
          l.text = text;
          t === 1
            ? r[6] || (l.text = text + "[ ] ")
            : t === 2
              ? (l.text = text + "[x] ")
              : t === 3 && (l.text = e ? text : text + "[ ] ");
          return l;
        },
      );
    };
    e.prototype.insertCallout = function () {
      var from = this.getCursor("from"),
        t = this.getCursor("to");
      if (!Db(from, t) || this.getLine(from.line).substring(0, from.ch).trim()) {
        var changes = [],
          text = "> [!NOTE]\n> ",
          selection = {
            from: xb(from.line, 4),
            to: xb(from.line, 8),
          };
        from.line > 0 &&
          this.getLine(from.line - 1) &&
          ((text = "\n" + text), (selection.from.line += 1), (selection.to.line += 1));
        changes.push({
          from: xb(from.line, 0),
          text: text,
        });
        for (var o = from.line + 1; o <= t.line; o++)
          changes.push({
            from: xb(o, 0),
            text: "> ",
          });
        t.line < this.lineCount() - 1 &&
          this.getLine(t.line + 1) &&
          changes.push({
            from: xb(t.line + 1, 0),
            text: "\n",
          });
        this.transaction({
          changes: changes,
          selection: selection,
        });
      } else
        this.transaction({
          changes: [
            {
              from: from,
              to: t,
              text: "\n> [!NOTE] Title\n> Contents\n",
            },
          ],
          selection: {
            from: xb(from.line + 1, 4),
            to: xb(from.line + 1, 8),
          },
        });
    };
    e.prototype.insertCodeblock = function () {
      this.insertBlock("```", "```");
    };
    e.prototype.insertMathBlock = function () {
      this.insertBlock("$$", "$$");
    };
    e.prototype.indentList = function () {
      this.exec("indentMore");
    };
    e.prototype.unindentList = function () {
      this.exec("indentLess");
    };
    e.prototype.newlineAndIndentContinueMarkdownList = function () {
      for (
        var e = this,
          t = this.listSelections(),
          changes = [],
          i = function (t) {
            var from = t.head;
            if (t.head.line !== t.anchor.line || t.head.ch !== t.anchor.ch) return !1;
            var r = e.getLine(from.line),
              o = Ab.exec(r);
            if (!o || !o[0]) return !1;
            var a = o[0],
              s = o[1],
              l = o[2],
              c = o[3],
              u = o[4],
              h = o[5],
              p = o[6],
              d = a.length;
            if (from.ch < a.length || (!l && !s)) return !1;
            if (!l)
              for (var f = from.line - 1; f >= 0; f--) {
                var m = e.getLine(f),
                  g = Ab.exec(m);
                if (g[2] && g[0].length === d) {
                  a = g[0];
                  s = g[1];
                  l = g[2];
                  c = g[3];
                  u = g[4];
                  h = g[5];
                  p = g[6];
                  break;
                }
                if (g[0].length < d) break;
              }
            if (r.substr(a.length).trim() === "") {
              if (!s) {
                changes.push({
                  text: "",
                  from: xb(from.line),
                  to: from,
                });
                return !0;
              }
              if (s.endsWith(">") || s.endsWith("> ")) {
                if (l) {
                  changes.push({
                    text: "",
                    from: xb(from.line, s.length),
                    to: from,
                  });
                  return !0;
                }
                var v = s.endsWith(">") ? 1 : 2;
                if (from.line > 0)
                  if (e.getLine(from.line - 1) === s) {
                    changes.push(
                      {
                        text: "",
                        from: xb(from.line - 1, s.length - v),
                        to: xb(from.line - 1, s.length),
                      },
                      {
                        text: "",
                        from: xb(from.line, s.length - v),
                        to: xb(from.line, s.length),
                      },
                    );
                    return !0;
                  }
                var y = s.substr(0, s.length - v);
                changes.push({
                  text: "\n" + y,
                  from: xb(from.line, s.length - v),
                  to: xb(from.line, s.length),
                });
                return !0;
              }
              if (s.endsWith("\t")) {
                changes.push({
                  text: "",
                  from: xb(from.line, s.length - 1),
                  to: xb(from.line, s.length),
                });
                return !0;
              }
              for (var b = 0; b < 4 && s.charAt(s.length - b - 1) === " "; b++);
              return b > 0
                ? (changes.push({
                    text: "",
                    from: xb(from.line, s.length - b),
                    to: xb(from.line, s.length),
                  }),
                  !0)
                : (changes.push({
                    text: "",
                    from: xb(from.line),
                    to: xb(from.line, s.length),
                  }),
                  !0);
            }
            if (!l) {
              changes.push({
                text: r.charAt(from.ch - 1) + "\n" + s,
                from: xb(from.line, from.ch - 1),
                to: from,
              });
              return !0;
            }
            var w = c;
            u && (w = parseInt(u, 10) + 1 + h);
            p && (w += "[ ] ");
            var k = Ab.exec(r.substring(from.ch));
            k && k[3] && (w = "");
            changes.push({
              text: r.charAt(from.ch - 1) + "\n" + s + w,
              from: xb(from.line, from.ch - 1),
              to: from,
            });
            k &&
              k[1] &&
              changes.push({
                text: "",
                from: from,
                to: xb(from.line, from.ch + k[1].length),
              });
            return !0;
          },
          r = 0,
          o = t;
        r < o.length;
        r++
      ) {
        if (!i(o[r])) return this.exec("newlineAndIndent");
      }
      this.transaction(
        {
          changes: changes,
        },
        "input.type",
      );
    };
    e.prototype.newlineAndIndentOnly = function () {
      for (
        var e = this,
          t = this.listSelections(),
          changes = [],
          i = function (t) {
            var i = t.head;
            if (t.head.line !== t.anchor.line || t.head.ch !== t.anchor.ch) return !1;
            var r = e.getLine(i.line),
              o = Ab.exec(r);
            if (!o || !o[0]) return !1;
            var a = o[0],
              s = o[1],
              l = o[2];
            return (
              !(i.ch < a.length) &&
              (changes.push({
                text: r.charAt(i.ch - 1) + "\n" + s + (l ? l.replace(/\t/g, "    ").replace(/./g, " ") : ""),
                from: xb(i.line, i.ch - 1),
                to: i,
              }),
              !0)
            );
          },
          r = 0,
          o = t;
        r < o.length;
        r++
      ) {
        if (!i(o[r])) return this.newlineOnly();
      }
      this.transaction({
        changes: changes,
      });
    };
    e.prototype.newlineOnly = function () {
      this.transaction({
        replaceSelection: "\n",
      });
    };
    e.prototype.expandText = function () {
      var e = this.getCursor("anchor"),
        t = this.getCursor("head");
      if (e.line === t.line && e.ch === t.ch)
        for (var n = this.getLine(e.line).substr(0, e.ch), i = 0, r = Lb; i < r.length; i++) {
          var o = r[i],
            a = n.match(o.regex);
          if (a) {
            var s = a[0].length,
              l = o.replace(a);
            this.replaceRange(l, Tb(e, -s), e);
            break;
          }
        }
    };
    return e;
  })();
function Ob(e, t) {
  for (var line = 0, i = 0, r = e.indexOf("\n"), o = [], a = 0, s = t; a < s.length; a++) {
    for (var l = s[a]; r < l; ) {
      if (-1 === r) {
        r = e.length;
        break;
      }
      line++;
      i = r + 1;
      r = e.indexOf("\n", i);
    }
    o.push({
      line: line,
      ch: l - i,
    });
  }
  return o;
}
var Fb = new window.TurndownService({
  headingStyle: "atx",
  hr: "---",
  bulletListMarker: "-",
  codeBlockStyle: "fenced",
  fence: "```",
  linkStyle: "inlined",
});
function Nb(e) {
  return e ? e.replace(/(\n+\s*)+/g, "\n") : "";
}
Fb.remove(["script", "style", "title"]);
Fb.addRule("strikethrough", {
  filter: ["del", "s"],
  replacement: function (e) {
    return "~~" + e + "~~";
  },
});
Fb.addRule("highlight", {
  filter: ["mark"],
  replacement: function (e) {
    return "==" + e + "==";
  },
});
Fb.addRule("link", {
  filter: function (e, t) {
    return t.linkStyle === "inlined" && e.nodeName === "A" && !!e.getAttribute("href");
  },
  replacement: function (e, t) {
    if (!t.instanceOf(Element)) return e;
    var n = t.getAttribute("href");
    if (n) {
      n = n.replace(/ /g, "%20").replace(/([()])/g, "\\$1");
    }
    var i = Nb(t.getAttribute("title"));
    i && (i = ' "' + i.replace(/"/g, '\\"') + '"');
    return "[" + e + "](" + n + i + ")";
  },
});
Fb.addRule("media", {
  filter: ["img"],
  replacement: function (e, t) {
    if (!t.instanceOf(Element)) return e;
    var n = Nb(t.getAttribute("alt")),
      i = t.getAttribute("src") || "";
    if (i) {
      i = i.replace(/ /g, "%20").replace(/([()])/g, "\\$1");
    }
    var r = Nb(t.getAttribute("title"));
    r && (r = ' "' + r.replace(/"/g, '\\"') + '"');
    return i ? "![" + n + "](" + i + r + ")" : "";
  },
});
var Rb = /highlight-(?:text|source)-([a-z0-9]+)/;
Fb.addRule("highlightedCodeBlock", {
  filter: function (e) {
    var t = e.firstChild;
    return e.nodeName === "DIV" && Rb.test(e.className) && t && t.nodeName === "PRE";
  },
  replacement: function (e, t, n) {
    var i = ((t.className || "").match(Rb) || [null, ""])[1];
    return "\n\n" + n.fence + i + "\n" + t.firstChild.textContent + "\n" + n.fence + "\n\n";
  },
});
Fb.addRule("listItem", {
  filter: "li",
  replacement: function (e, t, n) {
    e = e.replace(/^\n+/, "").replace(/\n+$/, "\n").replace(/\n/gm, "\n    ");
    var i = n.bulletListMarker + " ",
      r = t.parentNode;
    if (r.nodeName === "OL") {
      var o = r.getAttr("start"),
        a = Array.prototype.indexOf.call(r.children, t);
      i = (o ? Number(o) + a : a + 1) + ". ";
    }
    return i + e + (t.nextSibling && !/\n$/.test(e) ? "\n" : "");
  },
});
Fb.addRule("taskListItems", {
  filter: function (e) {
    return e.instanceOf(HTMLInputElement) && e.type === "checkbox" && e.parentNode.nodeName === "LI";
  },
  replacement: function (e, t) {
    return t.checked ? "[x] " : "[ ] ";
  },
});
Fb.addRule("tableCell", {
  filter: ["th", "td"],
  replacement: function (e, t) {
    return (
      (Array.prototype.indexOf.call(t.parentNode.childNodes, t) === 0 ? "|" : "") +
      (function (e) {
        e = e.trim().replace(/\|+/g, "\\|").replace(/\n\r?/g, "<br>");
        return e + "|";
      })(e) +
      zb(t, "   |")
    );
  },
});
var Bb = {
  left: ":--",
  right: "--:",
  center: ":-:",
};
function Vb(e) {
  if (!e) return !1;
  var t,
    n,
    i = e.parentNode;
  return (
    i.nodeName === "THEAD" ||
    (i.firstChild === e &&
      (i.nodeName === "TABLE" ||
        ((n = (t = i).previousSibling),
        t.nodeName === "TBODY" && (!n || (n.nodeName === "THEAD" && /^\s*$/i.test(n.textContent))))) &&
      Array.prototype.every.call(e.childNodes, function (e) {
        return e.nodeName === "TH";
      }))
  );
}
function Hb(e) {
  var t = e.getAttribute("colspan");
  if (!t) return 0;
  var n = parseInt(t);
  return isNaN(n) ? 0 : Math.max(0, n - 1);
}
function zb(e, t) {
  return t.repeat(Hb(e));
}
function htmlToMarkdown(e) {
  return Fb.turndown(e);
}
Fb.addRule("tableRow", {
  filter: "tr",
  replacement: function (e, t) {
    var n = "";
    if (Vb(t))
      for (var i = 0; i < t.cells.length; i++) {
        var r = t.cells[i],
          o = (r.getAttribute("align") || "").toLowerCase(),
          a = Bb[o] || "---";
        n += (i === 0 ? "|" : "") + a + "|" + zb(r, a + "|");
      }
    return "\n" + e + (n ? "\n" + n : "");
  },
});
Fb.addRule("table", {
  filter: "table",
  replacement: function (e, t) {
    var n = t.rows[0];
    if (!Vb(n)) {
      for (var i = n.cells.length, r = 0; r < n.cells.length; r++) i += Hb(n.cells[r]);
      e = "|" + "   |".repeat(i) + "\n|" + "---|".repeat(i) + "\n" + e.replace(/^[\r\n]+/, "");
    }
    return "\n\n" + (e = e.replace(/[\r\n]+/g, "\n")) + "\n\n";
  },
});
Fb.addRule("tableSection", {
  filter: ["thead", "tbody", "tfoot"],
  replacement: function (e) {
    return e;
  },
});
Fb.escape = function (e) {
  return e;
};
var Wb = [
    "accentColor",
    "theme",
    "cssTheme",
    "enabledCssSnippets",
    "showViewHeader",
    "showRibbon",
    "nativeMenus",
    "translucency",
    "textFontFamily",
    "interfaceFontFamily",
    "monospaceFontFamily",
    "baseFontSize",
    "baseFontSizeAction",
  ],
  Ub = {
    alwaysUpdateLinks: false,
    spellcheck: true,
    spellcheckLanguages: null,
    readableLineLength: true,
    strictLineBreaks: false,
    propertiesInDocument: "visible",
    showInlineTitle: true,
    showViewHeader: true,
    showRibbon: true,
    mobileQuickRibbonItem: "",
    useMarkdownLinks: false,
    showUnsupportedFiles: false,
    autoPairBrackets: true,
    autoPairMarkdown: true,
    smartIndentList: true,
    foldHeading: true,
    foldIndent: true,
    showLineNumber: false,
    showIndentGuide: true,
    useTab: true,
    tabSize: 4,
    rightToLeft: false,
    autoConvertHtml: true,
    vimMode: false,
    livePreview: true,
    nativeMenus: null,
    attachmentFolderPath: "/",
    newFileLocation: "root",
    newFileFolderPath: "/",
    newLinkFormat: "shortest",
    userIgnoreFilters: null,
    focusNewTab: true,
    defaultViewMode: "source",
    promptDelete: true,
    trashOption: "system",
    pdfExportSettings: {
      pageSize: "Letter",
      landscape: false,
      margin: "0",
      downscalePercent: 100,
    },
    uriCallbacks: false,
    mobilePullAction: "command-palette:open",
    mobileToolbarCommands: [
      "editor:undo",
      "editor:redo",
      "editor:insert-wikilink",
      "editor:insert-embed",
      "editor:insert-tag",
      "editor:attach-file",
      "editor:set-heading",
      "editor:toggle-bold",
      "editor:toggle-italics",
      "editor:toggle-strikethrough",
      "editor:toggle-highlight",
      "editor:toggle-code",
      "editor:toggle-blockquote",
      "editor:toggle-comment",
      "editor:insert-link",
      "editor:toggle-bullet-list",
      "editor:toggle-numbered-list",
      "editor:toggle-checklist-status",
      "editor:indent-list",
      "editor:unindent-list",
      "editor:configure-toolbar",
    ],
    hotkeys: {},
    theme: "system",
    accentColor: "",
    cssTheme: "",
    enabledCssSnippets: [],
    translucency: false,
    textFontFamily: "",
    interfaceFontFamily: "",
    monospaceFontFamily: "",
    baseFontSize: 16,
    baseFontSizeAction: false,
    types: {},
  },
  Events = (function () {
    function e() {
      this._ = {};
    }
    e.prototype.on = function (name, t, n) {
      var i = this._,
        r = i[name];
      if (!r) {
        i[name] = r = [];
      }
      var o = {
        e: this,
        name: name,
        fn: t,
        ctx: n,
      };
      r.push(o);
      return o;
    };
    e.prototype.off = function (e, t) {
      var n = this._,
        i = n[e],
        r = [];
      if (i && t)
        for (var o = 0; o < i.length; o++)
          if (i[o].fn !== t) {
            r.push(i[o]);
          }
      r.length > 0 ? (n[e] = r) : delete n[e];
    };
    e.prototype.offref = function (e) {
      if (e) {
        var t = e.name,
          n = this._,
          i = n[t],
          r = [];
        if (i && e)
          for (var o = 0; o < i.length; o++)
            if (i[o] !== e) {
              r.push(i[o]);
            }
        r.length ? (n[t] = r) : delete n[t];
      }
    };
    e.prototype.trigger = function (e) {
      for (var t = [], n = 1; n < arguments.length; n++) t[n - 1] = arguments[n];
      var i = this._[e];
      if (i) {
        i = i.slice();
        for (var r = 0; r < i.length; r++) this.tryTrigger(i[r], t);
      }
    };
    e.prototype.tryTrigger = function (e, t) {
      try {
        e.fn.apply(e.ctx, t);
      } catch (e) {
        setTimeout(function () {
          throw e;
        }, 0);
      }
    };
    return e;
  })(),
  jb = "#^[]|",
  Gb = isWin ? '*"\\/<>:|?' : "\\/:" + (_l ? '*?<>"' : ""),
  Kb = Gb.split("").join(" "),
  Yb = jb.split("").join(" "),
  Zb = new RegExp("[" + Jl(Gb) + "]"),
  Xb = new RegExp("[" + Jl(jb) + "]"),
  Qb = /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i;
function $b(e) {
  try {
    Jb(e);
    return !0;
  } catch (e) {
    return !1;
  }
}
function Jb(e) {
  if (isWin) {
    var t = e.charAt(e.length - 1);
    if (t === "." || t === " ") throw new Error("File names cannot end with a dot or a space.");
    var n = Qc(e);
    if (Qb.test(n)) throw new Error("File name is forbidden: " + n);
  }
  if (
    e.split("/").some(function (e) {
      return Zb.test(e);
    })
  )
    throw new Error("File name cannot contain any of the following characters: " + Kb);
}
var configDir = ".obsidian",
  TAbstractFile = (function () {
    function e(vault, t) {
      this.parent = null;
      this.deleted = false;
      this.vault = vault;
      this.setPath(t);
    }
    e.prototype.setPath = function (path) {
      this.path = path;
      this.name = getFilename(path);
    };
    e.prototype.getNewPathAfterRename = function (e) {
      e = e.replace(/[\x00-\x1F]/g, " ").trim();
      return this.parent ? (this.parent.isRoot() ? e : this.parent.path + "/" + e) : "";
    };
    return e;
  })(),
  nw = new WeakMap(),
  TFile = (function (e) {
    function t(t, n) {
      var i = e.call(this, t, n) || this;
      i.saving = false;
      i.stat = null;
      return i;
    }
    __extends(t, e);
    t.prototype.setPath = function (t) {
      e.prototype.setPath.call(this, t);
      this.basename = Qc(this.name);
      this.extension = getExtension(this.name);
    };
    t.prototype.getShortName = function () {
      return this.extension === "md" ? this.basename : this.name;
    };
    t.prototype.getNewPathAfterRename = function (t) {
      return e.prototype.getNewPathAfterRename.call(this, eu(t, this.extension));
    };
    t.prototype.cache = function (e) {
      if (e != null) {
        var t = this.vault.cacheLimit;
        e.length <= t ? nw.set(this, e) : nw.delete(this);
      } else nw.delete(this);
    };
    t.prototype.updateCacheLimit = function () {
      var e = this.vault.cacheLimit;
      if (nw.has(this) && nw.get(this).length > e) {
        nw.delete(this);
      }
    };
    t.prototype.toString = function () {
      return this.path;
    };
    return t;
  })(TAbstractFile),
  TFolder = (function (e) {
    function t(t, n) {
      var i = e.call(this, t, n) || this;
      i.children = [];
      return i;
    }
    __extends(t, e);
    t.prototype.isRoot = function () {
      return this.path === "/";
    };
    t.prototype.getParentPrefix = function () {
      return this.isRoot() ? "" : this.path + "/";
    };
    t.prototype.getFileCount = function () {
      for (var e = 0, n = 0, i = this.children; n < i.length; n++) {
        var r = i[n];
        e += r instanceof t ? r.getFileCount() : 1;
      }
      return e;
    };
    t.prototype.getFolderCount = function () {
      for (var e = 0, n = 0, i = this.children; n < i.length; n++) {
        var r = i[n];
        if (r instanceof t) {
          e += 1 + r.getFolderCount();
        }
      }
      return e;
    };
    return t;
  })(TAbstractFile);
class Vault extends Events {
  constructor(adapter) {
    super();
    this.fileMap = {};
    this.config = {};
    this.configTs = 0;
    this.configDir = configDir;
    this.requestSaveConfig = debounce(this.saveConfig.bind(this), 1000, true);
    this.cacheLimit = 65536;
    this.reloadConfig = debounce(
      async () => {
        const appFile = this.getConfigFile("app");
        const appearanceFile = this.getConfigFile("appearance");
        let changed = false;

        try {
          const stat = await this.adapter.stat(appFile);
          if (stat.mtime > this.configTs) changed = true;
        } catch {
          changed = true;
        }

        // 检查 appearance 是否更新
        try {
          const stat = await this.adapter.stat(appearanceFile);
          if (stat.mtime > this.configTs) changed = true;
        } catch {
          changed = true;
        }

        if (changed) {
          this.configTs = Date.now();
          const appConfig = await this.readConfigJson("app");
          const appearanceConfig = await this.readConfigJson("appearance");
          const newConfig = Object.assign({}, appearanceConfig, appConfig);
          const current = this.config;

          // 应用新增/修改的配置项
          for (const key in newConfig) {
            if (Object.hasOwn(newConfig, key)) {
              if (!Object.hasOwn(current, key) || JSON.stringify(current[key]) !== JSON.stringify(newConfig[key])) {
                current[key] = newConfig[key];
                this.trigger("config-changed", key);
              }
            }
          }

          // 移除已删除的配置项
          for (const key in current) {
            if (Object.hasOwn(current, key) && !Object.hasOwn(newConfig, key)) {
              delete current[key];
              this.trigger("config-changed", key);
            }
          }
        }
      },
      500,
      true,
    );

    this.adapter = adapter;
    // 创建根文件夹
    this.root = new TFolder(this, "");
    this.onChange("folder-created", "/");
    this.root = this.fileMap["/"];
  }

  getName() {
    return this.adapter.getName();
  }

  setFileCacheLimit(cacheLimit) {
    this.cacheLimit = cacheLimit;
    const fileMap = this.fileMap;
    for (const path in this.fileMap) {
      if (fileMap.hasOwnProperty(path)) {
        const file = fileMap[path];
        if (file instanceof TFile) {
          file.updateCacheLimit();
        }
      }
    }
  }

  static validateConfigDir(dir) {
    return dir !== "." && dir.startsWith(".") && !Zb.test(dir);
  }

  setConfigDir(configDir) {
    if (!Vault.validateConfigDir(configDir)) {
      configDir = configDir; // 外部全局常量
    }
    this.configDir = configDir;
  }

  async setupConfig() {
    const adapter = this.adapter;
    const configDir = this.configDir;

    // 确保配置目录存在
    if (!(await adapter.exists(configDir))) {
      await adapter.mkdir(configDir);
    }

    this.configTs = Date.now();
    const appConfig = await this.readConfigJson("app");
    const appearanceConfig = await this.readConfigJson("appearance");

    // 合并配置
    this.config = Object.assign({}, appearanceConfig, appConfig);

    // 迁移旧配置键名 (例如 editorFontFamily -> textFontFamily)
    const keyMap = { editorFontFamily: "textFontFamily" };
    for (const oldKey in keyMap) {
      if (keyMap.hasOwnProperty(oldKey) && this.config.hasOwnProperty(oldKey)) {
        const newKey = keyMap[oldKey];
        const value = this.config[oldKey];
        delete this.config[oldKey];
        if (!Object.hasOwn(this.config, newKey) && value) {
          this.config[newKey] = value;
        }
      }
    }

    this.requestSaveConfig();
  }

  async saveConfig() {
    const adapter = this.adapter;
    const configDir = this.configDir;

    if (!(await adapter.exists(configDir))) {
      await adapter.mkdir(configDir);
    }

    const appConfig = {};
    const appearanceConfig = {};

    // 将配置拆分为两个文件
    for (const key in this.config) {
      if (Object.hasOwn(this.config, key)) {
        if (Wb.contains(key)) {
          appearanceConfig[key] = this.config[key];
        } else {
          appConfig[key] = this.config[key];
        }
      }
    }

    await this.writeConfigJson("app", appConfig);
    await this.writeConfigJson("appearance", appearanceConfig);
    this.configTs = Date.now();
  }

  getConfig(key) {
    let value = this.config[key];
    if (value === undefined) {
      value = Ub[key];
    }
    // 深度复制对象和数组
    if (Array.isArray(value) || (value && typeof value === "object")) {
      return JSON.parse(JSON.stringify(value));
    }
    return value;
  }

  setConfig(key, value) {
    if (this.config[key] !== value) {
      if (value !== undefined) {
        this.config[key] = value;
      } else {
        delete this.config[key];
      }
      this.requestSaveConfig();
      this.trigger("config-changed", key);
    }
  }

  async readPluginData(pluginId) {
    const path = normalizePath(pluginId + "/data.json");
    return this.readJson(path);
  }

  writePluginData(pluginId, data, options) {
    const path = normalizePath(pluginId + "/data.json");
    return this.writeJson(path, data, options);
  }

  getConfigFile(name) {
    return this.configDir + "/" + name + ".json";
  }

  readConfigJson(name) {
    return this.readJson(this.getConfigFile(name));
  }

  writeConfigJson(name, data, options) {
    return this.writeJson(this.getConfigFile(name), data, options);
  }

  deleteConfigJson(name) {
    const path = normalizePath(this.configDir + "/" + name + ".json");
    return this.adapter.remove(path);
  }

  async readJson(file) {
    const normalizedPath = normalizePath(file);
    try {
      const content = await this.adapter.read(normalizedPath);
      return JSON.parse(content);
    } catch (error) {
      if (error.code === "ENOENT") {
        return null;
      }
      console.error("failed to read JSON", file, error);
      return undefined;
    }
  }

  async writeJson(file, data, options) {
    const normalizedPath = normalizePath(file);
    try {
      await this.adapter.write(normalizedPath, JSON.stringify(data, undefined, 2), options);
    } catch (error) {
      // 静默失败
    }
  }

  async load() {
    await this.adapter.watch(this.onChange.bind(this));
    if (this.adapter instanceof FileSystemAdapter) {
      await this.adapter.watchHiddenRecursive(this.configDir);
    }
  }

  getFileByPath(path) {
    const file = this.fileMap[path];
    return file instanceof TFile ? file : null;
  }

  getFolderByPath(path) {
    const file = this.fileMap[path];
    return file instanceof TFolder ? file : null;
  }

  getAbstractFileByPath(path) {
    return this.fileMap[path] || null;
  }

  getAbstractFileByPathInsensitive(path) {
    const map = this.fileMap;
    if (Object.hasOwn(map, path)) return map[path];

    const lowerPath = path.toLowerCase();
    for (const key in map) {
      if (Object.hasOwn(map, key) && key.length === lowerPath.length && key.toLowerCase() === lowerPath) {
        return map[key];
      }
    }
    return null;
  }

  isEmpty() {
    return Object.keys(this.fileMap).length === 1;
  }

  getRoot() {
    return this.root;
  }

  checkForDuplicate(file, newPath) {
    const candidate = file.getNewPathAfterRename(newPath);
    const existing = this.fileMap[candidate];
    return existing && existing !== file;
  }

  checkPath(path) {
    Jb(path);
  }

  // 处理文件/文件夹变化事件
  onChange(eventType, path, oldPath, stat) {
    switch (eventType) {
      case "folder-created": {
        const folder = new TFolder(this, path);
        this.fileMap[path] = folder;
        this.addChild(folder);
        this.trigger("create", folder);
        break;
      }
      case "file-created": {
        const file = new TFile(this, path);
        file.stat = stat;
        this.fileMap[path] = file;
        this.addChild(file);
        this.trigger("create", file);
        break;
      }
      case "modified": {
        if (!Object.hasOwn(this.fileMap, path)) return;
        const file = this.fileMap[path];
        if (file instanceof TFile) {
          file.stat = stat;
          if (!file.saving) {
            file.cache(null);
          }
        }
        this.trigger("modify", file);
        break;
      }
      case "file-removed":
      case "folder-removed": {
        if (Object.hasOwn(this.fileMap, path)) {
          const file = this.fileMap[path];
          this.removeChild(file);
          delete this.fileMap[path];
          file.deleted = true;
          this.trigger("delete", file);
        }
        break;
      }
      case "renamed": {
        if (Object.hasOwn(this.fileMap, oldPath)) {
          const file = this.fileMap[oldPath];
          this.removeChild(file);
          file.setPath(path);
          this.addChild(file);
          this.fileMap[path] = file;
          delete this.fileMap[oldPath];
          this.trigger("rename", file, oldPath);
        }
        break;
      }
      case "closed":
        this.trigger("closed");
        break;
      case "raw":
        this.trigger("raw", path);
        // 配置目录下的隐藏文件也需要监视
        if (path.startsWith(this.configDir + "/") && this.adapter instanceof FileSystemAdapter) {
          this.adapter.watchHiddenRecursive(path);
        }
        // 配置文件变化时自动重新加载
        if (path !== this.getConfigFile("app") && path !== this.getConfigFile("appearance")) {
          this.reloadConfig();
        }
        break;
    }
  }

  getDirectParent(child) {
    const childPath = child.path;
    const lastSlash = childPath.lastIndexOf("/");
    if (lastSlash === -1) {
      return this.fileMap["/"];
    }
    const parentPath = childPath.slice(0, lastSlash);
    const parent = this.fileMap[parentPath];
    return parent instanceof TFolder ? parent : null;
  }

  addChild(file) {
    const currentParent = file.parent;
    const correctParent = this.getDirectParent(file);
    if (correctParent && correctParent !== currentParent) {
      if (currentParent) {
        currentParent.children.remove(file);
      }
      correctParent.children.push(file);
      file.parent = correctParent;
    }
  }

  removeChild(file) {
    const parent = file.parent;
    if (parent) {
      parent.children.remove(file);
      file.parent = null;
    }
  }

  async exists(path, sensitive) {
    const normalizedPath = normalizePath(path);
    return this.adapter.exists(normalizedPath, sensitive);
  }

  async create(path, data, options) {
    const normalizedPath = normalizePath(path);
    this.checkPath(normalizedPath);

    if (await this.adapter.exists(normalizedPath)) {
      throw new Error("File already exists.");
    }

    await this.adapter.write(normalizedPath, data, options);
    const file = this.getAbstractFileByPath(normalizedPath);
    return file instanceof TFile ? file : null;
  }

  async createBinary(path, data, options) {
    const normalizedPath = normalizePath(path);
    this.checkPath(normalizedPath);

    if (await this.adapter.exists(normalizedPath)) {
      throw new Error("File already exists.");
    }

    await this.adapter.writeBinary(normalizedPath, data, options);
    const file = this.getAbstractFileByPath(normalizedPath);
    return file instanceof TFile ? file : null;
  }

  async createFolder(path) {
    const normalizedPath = normalizePath(path);
    this.checkPath(normalizedPath);

    if (await this.adapter.exists(normalizedPath)) {
      throw new Error("Folder already exists.");
    }

    await this.adapter.mkdir(normalizedPath);
    const folder = this.getAbstractFileByPath(normalizedPath);
    return folder instanceof TFolder ? folder : null;
  }

  async read(file) {
    let content = await this.adapter.read(file.path);
    // 移除 BOM
    if (content.charCodeAt(0) === 0xfeff) {
      content = content.substring(1);
    }
    file.cache(content);
    return content;
  }

  async cachedRead(file) {
    if (nw.has(file)) {
      return nw.get(file);
    }
    return this.read(file);
  }

  async readBinary(file) {
    const buffer = await this.adapter.readBinary(file.path);
    try {
      if (file.extension === "md" && buffer.byteLength <= this.cacheLimit) {
        file.cache(new TextDecoder().decode(buffer));
      }
    } catch (e) {
      // 缓存失败不中断
    }
    return buffer;
  }

  async readRaw(path) {
    const normalizedPath = normalizePath(path);
    return this.adapter.read(normalizedPath);
  }

  getResourcePath(file) {
    return this.adapter.getResourcePath(file.path);
  }

  async delete(file, force = false) {
    if (!file || file === this.root) return;

    if (file instanceof TFile) {
      await this.adapter.remove(file.path);
    } else if (file instanceof TFolder) {
      await this.adapter.rmdir(file.path, force);
    }
  }

  async trash(file, system) {
    if (!file || file === this.root) return;

    if (system) {
      const result = await this.adapter.trashSystem(file.path);
      if (result) return; // 系统回收站成功则结束
    }

    await this.adapter.trashLocal(file.path);
  }

  async rename(file, newPath) {
    const normalizedPath = normalizePath(newPath);
    if (file.path === normalizedPath) return;

    this.checkPath(normalizedPath);
    await this.adapter.rename(file.path, normalizedPath);
  }

  async modify(file, data, options) {
    const previousSaving = file.saving;
    file.saving = true;
    try {
      options = options || {};
      options.immediate = () => file.cache(data);
      await this.adapter.write(file.path, data, options);
    } catch (error) {
      file.cache(null);
      throw error;
    } finally {
      file.saving = previousSaving;
    }
  }

  async modifyBinary(file, data, options) {
    const previousSaving = file.saving;
    file.saving = true;
    try {
      options = options || {};
      options.immediate = () => file.cache(null);
      await this.adapter.writeBinary(file.path, data, options);
    } finally {
      file.saving = previousSaving;
    }
  }

  async append(file, data, options) {
    const previousSaving = file.saving;
    file.saving = true;
    try {
      options = options || {};
      options.immediate = () => file.cache(null);
      await this.adapter.append(file.path, data, options);
    } finally {
      file.saving = previousSaving;
    }
  }

  async process(file, fn, options) {
    const previousSaving = file.saving;
    file.saving = true;
    try {
      options = options || {};
      options.immediate = () => file.cache(null);
      const result = await this.adapter.process(file.path, fn, options);
      file.cache(result);
      return result;
    } finally {
      file.saving = previousSaving;
    }
  }

  async copy(file, newPath) {
    let normalizedPath = normalizePath(newPath).normalize("NFC");
    this.checkPath(normalizedPath);
    await this.adapter.copy(file.path, normalizedPath);
    return this.getAbstractFileByPath(normalizedPath);
  }

  getAllLoadedFiles() {
    const files = [];
    for (const path in this.fileMap) {
      if (Object.hasOwn(this.fileMap, path)) {
        files.push(this.fileMap[path]);
      }
    }
    return files;
  }

  getAllFolders(includeRoot = false) {
    const folders = [];
    for (const path in this.fileMap) {
      if (Object.hasOwn(this.fileMap, path)) {
        const file = this.fileMap[path];
        if (file instanceof TFolder) {
          if (!includeRoot && file.isRoot()) continue;
          folders.push(file);
        }
      }
    }
    return folders;
  }

  getAvailablePath(filename, extension) {
    let candidate = eu(filename, extension);
    let counter = 1;
    while (this.getAbstractFileByPathInsensitive(candidate)) {
      candidate = eu(filename + " " + counter, extension);
      counter++;
    }
    return candidate;
  }

  async getAvailablePathForAttachments(filename, extension, currentFile) {
    let attachmentPath = this.getConfig("attachmentFolderPath");
    const isRelative = attachmentPath === "." || attachmentPath === "./";
    let subFolder = null;
    if (attachmentPath.startsWith("./")) {
      subFolder = attachmentPath.slice(2);
    }

    // 计算附件存储目录
    if (isRelative) {
      attachmentPath = currentFile ? currentFile.parent.path : "";
    } else if (subFolder) {
      attachmentPath = (currentFile ? currentFile.parent.getParentPrefix() : "") + subFolder;
    }
    attachmentPath = normalizePath(attachmentPath);
    const cleanFilename = normalizePath(filename);

    let folder = this.getAbstractFileByPathInsensitive(attachmentPath);
    if (!folder) {
      folder = await this.createFolder(attachmentPath);
    }

    if (folder instanceof TFolder) {
      return this.getAvailablePath(folder.getParentPrefix() + cleanFilename, extension);
    }
    return this.getAvailablePath(cleanFilename, extension);
  }

  resolveFileUrl(url) {
    if (Platform.isDesktopApp) {
      // 处理资源路径前缀
      if (url.startsWith(Platform.resourcePathPrefix)) {
        url = "file:///" + url.substring(Platform.resourcePathPrefix.length).split("?")[0];
      }
      const urlModule = loadModule("url");
      if (urlModule && url.startsWith("file://")) {
        const filePath = urlModule.fileURLToPath(url);
        return this.resolveFilePath(filePath);
      }
    }
    return null;
  }

  resolveFilePath(filePath) {
    const adapter = this.adapter;
    if (Platform.isDesktopApp && adapter instanceof FileSystemAdapter) {
      const basePath = adapter.getBasePath();
      if (filePath.startsWith(basePath)) {
        const vaultPath = normalizePath(filePath.substring(basePath.length));
        const file = this.getAbstractFileByPath(vaultPath);
        if (file instanceof TFile) return file;
      }
    }
    return null;
  }

  static recurseChildren(root, callback) {
    const stack = [root];
    while (stack.length > 0) {
      const file = stack.pop();
      if (!file) continue;
      callback(file);
      if (file instanceof TFolder) {
        stack.push(...file.children);
      }
    }
  }

  getMarkdownFiles() {
    const files = [];
    Vault.recurseChildren(this.getRoot(), (file) => {
      if (file instanceof TFile && file.extension === "md") {
        files.push(file);
      }
    });
    return files;
  }

  getFiles() {
    const files = [];
    Vault.recurseChildren(this.getRoot(), (file) => {
      if (file instanceof TFile) {
        files.push(file);
      }
    });
    return files;
  }

  async *iterateFiles(files, cached) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      let content = "";
      if (file.extension !== "md") {
        // 非 Markdown 文件不读取内容
      } else {
        content = cached ? await this.cachedRead(file) : await this.read(file);
      }
      yield { file, content };
    }
  }

  async *generateFiles(files, cached) {
    try {
      for await (const file of files) {
        let content = "";
        if (file.extension !== "md" && file.extension !== "canvas") {
          // 非 md/canvas 文件不读取内容
        } else {
          content = cached ? await this.cachedRead(file) : await this.read(file);
        }
        yield { file, content };
      }
    } catch (error) {
      yield { error };
    }
  }

  // 事件转发，保持与父类一致
  trigger(name, ...args) {
    super.trigger(name, ...args);
  }

  on(name, callback, ctx) {
    return super.on(name, callback, ctx);
  }
}
function detectTextDirection(e) {
  var t = e.match(
    /(?:([\u200F\p{sc=Arabic}\p{sc=Hebrew}\p{sc=Syriac}\p{sc=Thaana}])|([\u200E\p{sc=Armenian}\p{sc=Bengali}\p{sc=Bopomofo}\p{sc=Braille}\p{sc=Buhid}\p{sc=Canadian_Aboriginal}\p{sc=Cherokee}\p{sc=Cyrillic}\p{sc=Devanagari}\p{sc=Ethiopic}\p{sc=Georgian}\p{sc=Greek}\p{sc=Gujarati}\p{sc=Gurmukhi}\p{sc=Han}\p{sc=Hangul}\p{sc=Hanunoo}\p{sc=Hiragana}\p{sc=Kannada}\p{sc=Katakana}\p{sc=Khmer}\p{sc=Lao}\p{sc=Latin}\p{sc=Limbu}\p{sc=Malayalam}\p{sc=Mongolian}\p{sc=Myanmar}\p{sc=Ogham}\p{sc=Oriya}\p{sc=Runic}\p{sc=Sinhala}\p{sc=Tagalog}\p{sc=Tagbanwa}\p{sc=Tamil}\p{sc=Telugu}\p{sc=Thai}\p{sc=Tibetan}\p{sc=Yi}]))/u,
  );
  if (t) {
    if (t[1]) return "rtl";
    if (t[2]) return "ltr";
  }
  return "auto";
}
function getLineBoundaries(e, t) {
  for (var n = -1, i = 0; i < t; i++) n = e.indexOf("\n", n + 1);
  var start = n + 1,
    o = e.indexOf("\n", start);
  return {
    start: start,
    end: -1 !== o ? o : e.length,
  };
}
function focusAndSelectContent(e, t) {
  e.focus({
    preventScroll: !0,
  });
  var n = e.win,
    i = n.document.createRange();
  i.selectNodeContents(e);
  isBoolean(t) && i.collapse(t);
  var r = n.getSelection();
  if (r) {
    r.removeAllRanges();
    r.addRange(i);
    Platform.isMobile &&
      xl(function () {
        e.scrollIntoView({
          block: "nearest",
        });
      });
  }
}
function focusAndSelectOnPhysicalKeyboard(e) {
  if (Platform.hasPhysicalKeyboard) {
    executeWhenShown(e, function () {
      e.focus();
      e.select();
    });
  }
}
function clearFocusAndSelection(e) {
  if (!e) {
    e = activeWindow;
  }
  var t = e.document.activeElement;
  if (t && t.instanceOf(HTMLElement)) {
    t.blur();
  }
  var n = e.getSelection();
  if (n) {
    n.removeAllRanges();
  }
}
function flashElement(e) {
  e.addClass("is-flashing");
  e.win.setTimeout(function () {
    return e.removeClass("is-flashing");
  }, 750);
}
function isElementContainedInDocumentBody(e, t) {
  for (var n = e.document.body; t.win.frameElement; ) t = t.win.frameElement;
  return n.contains(t);
}
function parseComputedStylePixelValue(e, t) {
  var n = getComputedStyle(e).getPropertyValue(t);
  if (n) {
    var i = parseInt(n);
    if (Number.isNumber(i) && !Number.isNaN(i)) return i;
  }
  return 0;
}
function positionFloatingElement(e, t, n) {
  var i, r, o;
  n = n || {};
  t.show();
  var a = t.doc,
    s = t.win,
    l = (i = n.gap) !== null && undefined !== i ? i : 0,
    c = t.offsetParent || a.documentElement,
    u = (r = n.horizontalAlignment) !== null && undefined !== r ? r : "left",
    h = (o = n.preventOverlap) !== null && undefined !== o && o;
  if (h) {
    t.style.maxHeight = "";
  }
  var p = parseComputedStylePixelValue(c, "--safe-area-inset-top"),
    d = parseComputedStylePixelValue(c, "--safe-area-inset-bottom"),
    f = parseComputedStylePixelValue(c, "--safe-area-inset-left"),
    m = parseComputedStylePixelValue(c, "--safe-area-inset-right"),
    g = c.getBoundingClientRect(),
    v = c.scrollTop + c.clientHeight,
    y = c.scrollTop + 10,
    b = v - 10;
  p > g.top && (y += p - g.top);
  d > window.innerHeight - g.bottom && (b -= d - (window.innerHeight - g.bottom));
  var w = Math.min(e.top, b),
    k = Math.max(e.bottom, y),
    C = t.offsetHeight,
    E = e.top - y,
    S = b - e.bottom,
    M = E >= C + l,
    x = S >= C + l,
    T = null,
    D = null;
  x ? (T = k + l) : M || (h && E > S) ? (D = v - (w - l)) : (T = h ? k + l : c.clientHeight < C + l ? y : b - C);
  var A = c.scrollLeft + 10,
    P = c.scrollLeft + c.clientWidth - 10;
  f > g.left && (A += f - g.left);
  m > s.innerWidth - g.right && (P -= m - (s.innerWidth - g.right));
  var L = t.offsetWidth;
  if (u === "left") {
    (I = e.left) < A ? (I = A) : I + L > P && (I = P - L);
    t.style.left = "".concat(I, "px");
    t.style.right = "";
  } else if (u === "center") {
    var I;
    (I = e.left + (e.right - e.left) / 2) < A ? (I = A) : I + L / 2 > P && (I = P - L);
    t.style.left = "".concat(I, "px");
    t.style.right = "";
  } else {
    var O = e.right;
    O > P ? (O = P) : O - L < A && (O = A + L);
    t.style.left = "";
    t.style.right = "".concat(c.clientWidth - O, "px");
  }
  t.style.top = T !== null ? "".concat(T, "px") : "";
  t.style.bottom = D !== null ? "".concat(D, "px") : "";
  M || x || !h || (t.style.maxHeight = "".concat(E > S ? E - l : S - l, "px"));
}
function waitForElementHidden(e, t, n) {
  var i = setInterval(function () {
    if (!e.isShown()) {
      clearInterval(i);
      n();
    }
  }, t);
  return function () {
    clearInterval(i);
  };
}
function applyScrollFadeEffect(e, t) {
  e.addClass("mod-fade");
  var n = function () {
    var n = t.scrollLeft,
      i = t.scrollWidth,
      r = t.offsetWidth;
    e.toggleClass("mod-at-start", n === 0);
    e.toggleClass("mod-at-end", Math.ceil(n) >= i - r);
  };
  t.addEventListener("scroll", debounce(n, 10));
  n();
}
function isPointInElementRect(e, t) {
  var n = e.clientX,
    i = e.clientY,
    r = t.getBoundingClientRect();
  return n >= r.x && n <= r.x + r.width && i >= r.y && i <= r.y + r.height;
}
function getRelativeOffset(e, t) {
  for (var n = e.offsetWidth, i = n, r = 0, left = 0, a = t ? t.offsetParent : null; e && e !== t && e !== a; ) {
    r += e.offsetTop;
    left += e.offsetLeft;
    for (var s = e.offsetParent, l = e.parentElement; l && l !== s; ) {
      r -= l.scrollTop;
      left -= l.scrollLeft;
      l = l.parentElement;
    }
    s && s !== a && ((i = s.offsetWidth), s !== t && ((r -= s.scrollTop), (left -= s.scrollLeft)));
    e = s;
  }
  return {
    top: r,
    left: left,
    right: i - left - n,
  };
}
function lazyLoadScript(e, t) {
  var n = false,
    i = null;
  return {
    get loaded() {
      return n;
    },
    get promise() {
      if (n) return Promise.resolve();
      if (!i) {
        if (t && t.before) {
          t.before();
        }
        var r = (function (src, type) {
          undefined === type && (type = "text/javascript");
          return new Promise(function (n, i) {
            var r = document.createElement("script");
            r.type = type;
            r.src = src;
            r.addEventListener("load", function () {
              return n(r);
            });
            r.addEventListener("error", function (e) {
              return i(e);
            });
            document.body.appendChild(r);
          });
        })(e, t == null ? undefined : t.type);
        r.catch(function (e) {
          e.detach();
          i = null;
        });
        i = r.then(function () {
          n = true;
          i = null;
          t && t.after && t.after();
        });
      }
      return i;
    },
    then: function (e) {
      return n ? Promise.resolve(e()) : this.promise.then(e);
    },
  };
}
function collectTextNodes(e, t) {
  if (e.nodeType !== 3)
    for (var n = e.firstChild; n; ) {
      collectTextNodes(n, t);
      n = n.nextSibling;
    }
  else t.push(e);
}
function createTextRange(e, t, n) {
  var i = [];
  collectTextNodes(e, i);
  var r = i.map(function (e) {
    return e.textContent || "";
  });
  return createRangeFromCharOffsets(i, r, t, n);
}
function createRangeFromCharOffsets(e, t, n, i) {
  for (var r = 0, o = null, a = -1, s = null, l = -1, c = 0; c < t.length; c++) {
    var u = r + t[c].length;
    if ((r <= n && n <= u && ((o = e[c]), (a = n - r)), r <= i && i <= u)) {
      s = e[c];
      l = i - r;
      break;
    }
    r = u;
  }
  if (o && s) {
    var h = document.createRange();
    h.setStart(o, a);
    h.setEnd(s, l);
    return h;
  }
  return null;
}
async function withLoadingClass(e, t) {
  e.addClass("is-loading");
  try {
    return await t();
  } finally {
    e.removeClass("is-loading");
  }
}
async function withModLoadingClass(e, t) {
  e.addClass("mod-loading");
  try {
    return await t();
  } finally {
    e.removeClass("mod-loading");
  }
}
function attachAutoScrollOnHover(e) {
  e.addEventListener("mousemove", function (t) {
    var n = e.clientHeight,
      i = e.scrollHeight;
    if (i > n) {
      var r = (t.clientY - e.getBoundingClientRect().y - 30) / (n - 60);
      e.scrollTop = (i - n) * Math.clamp(r, 0, 1);
    }
  });
}
for (
  var inlineElementMap = new Map(),
    Dw = 0,
    inlineTags =
      "a abbr acronym b bdi bdo big br button canvas cite code data del dfn em embed i iframe img input ins kbd label map mark meter noscript object outputpicture progress q ruby s samp select small span strong sub sup svg textarea time u tt var video wbr".split(
        " ",
      );
  Dw < inlineTags.length;
  Dw++
) {
  var Pw = inlineTags[Dw];
  inlineElementMap.set(Pw, true);
}
for (
  var Lw = 0,
    blockTags =
      "address article aside blockquote details dialog dd div dl dt fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 header hgroup hr li main nav ol p pre ul".split(
        " ",
      );
  Lw < blockTags.length;
  Lw++
) {
  Pw = blockTags[Lw];
  inlineElementMap.set(Pw, !1);
}
function isInlineElement(e) {
  if (!e || !/^[a-z]+$/i.test(e)) return !1;
  if (inlineElementMap.has(e)) return inlineElementMap.get(e);
  var t, n;
  try {
    t = document.createElement(e);
    document.body.appendChild(t);
    n = getComputedStyle(t).display;
  } catch (e) {}
  if (t) {
    document.body.removeChild(t);
  }
  var i = !!n && n.startsWith("inline");
  inlineElementMap.set(e, i);
  return i;
}
function findAndFocusFirstFocusable(e, t) {
  var n = e.querySelector(
    [
      "a[href]",
      "button",
      "input",
      "select",
      "textarea",
      '[contenteditable]:not([contenteditable="false"])',
      "[tabindex]",
    ]
      .map(function (e) {
        return e + ':not([disabled]):not([tabindex="-1"])';
      })
      .join(","),
  );
  return n && (n.instanceOf(HTMLElement) || n.instanceOf(SVGElement)) ? (n.focus(t), n) : null;
}
function focusOrBlurOnPhysicalKeyboard(e, t) {
  Platform.hasPhysicalKeyboard ? e.focus(t) : e.blur();
}
var savedScrollPositions = new WeakMap();
function walkDOM(e, t) {
  for (var n = [e]; n.length; ) {
    var i = n.pop();
    if (!0 !== t(i))
      for (var r = i.firstElementChild; r; ) {
        n.push(r);
        r = r.nextElementSibling;
      }
  }
}
function checkVisibilityAndScrollability(e) {
  if (isInlineElement(e.tagName.toLowerCase())) return !0;
  var t = getComputedStyle(e);
  return (
    !(t.display !== "none" && !t.display.startsWith("inline")) ||
    ((t.overflowY === "auto" || t.overflowY === "scroll") && e.scrollTop > 0
      ? savedScrollPositions.set(e, e.scrollTop)
      : savedScrollPositions.delete(e),
    !1)
  );
}
function saveScrollPositions(e) {
  walkDOM(e, checkVisibilityAndScrollability);
}
function restoreScrollPosition(e) {
  var scrollTop = savedScrollPositions.get(e);
  scrollTop && ((e.scrollTop = scrollTop), savedScrollPositions.delete(e));
  return !1;
}
function restoreScrollPositionsWalk(e) {
  walkDOM(e, restoreScrollPosition);
}
function preserveScrollPositionOnInsert(e) {
  var scrollLeft = 0,
    scrollTop = 0;
  e.addEventListener(
    "scroll",
    function () {
      scrollLeft = e.scrollLeft;
      scrollTop = e.scrollTop;
    },
    {
      passive: !0,
    },
  );
  e.onNodeInserted(function () {
    if (!((!scrollTop && !scrollLeft) || e.scrollLeft || e.scrollTop)) {
      e.scrollLeft = scrollLeft;
      e.scrollTop = scrollTop;
    }
  });
}
function hasScrollableAncestor(e, t, n) {
  for (var i = e.targetNode; i && i !== t; ) {
    if (i.instanceOf(Element) && (i.scrollHeight > i.clientHeight || (n && i.scrollWidth > i.clientWidth))) {
      var r = getComputedStyle(i),
        o = r.overflowY;
      if (o === "auto" || o === "scroll") return !0;
      if (n) {
        var a = r.overflowX;
        if (a === "auto" || a === "scroll") return !0;
      }
    }
    i = i.parentNode;
  }
  return !1;
}
function getFrameTransform(e) {
  var t = e.frameElement;
  if (!t) return null;
  for (
    var n = {
      x: 0,
      y: 0,
      scale: 1,
      win: e,
    };
    t !== null;
  ) {
    var i = t.getBoundingClientRect(),
      scale = i.width / t.clientWidth;
    n.scale *= scale;
    n.x = n.x * scale + i.x;
    n.y = n.y * scale + i.y;
    n.win = t.win;
    t = t.win.frameElement;
  }
  return n;
}
function transformRectToTopWindow(rect, t) {
  var n = getFrameTransform(t);
  if (n) {
    var i = n.scale,
      r = n.x,
      o = n.y;
    return {
      rect: {
        left: rect.left * i + r,
        right: rect.right * i + r,
        top: rect.top * i + o,
        bottom: rect.bottom * i + o,
      },
      win: n.win,
    };
  }
  return {
    rect: rect,
    win: t,
  };
}
function handleTextSelectionClick(e, t) {
  var n = 0,
    i = e.win;
  e.addEventListener("mousedown", function (e) {
    if (e.detail > 1) {
      i.clearTimeout(n);
    }
  });
  e.addEventListener("click", function (r) {
    if (!(r.defaultPrevented || r.detail > 1 || r.shiftKey)) {
      var o = (i = e.win).getSelection();
      if (o && o.rangeCount > 0)
        for (var a = 0; a < o.rangeCount; a++) {
          if (
            ((d = o.getRangeAt(a)).startContainer !== d.endContainer || d.startOffset !== d.endOffset) &&
            (e.contains(d.startContainer) || e.contains(d.endContainer))
          )
            return;
        }
      var s = i.document.activeElement;
      if (e === s || !e.contains(s)) {
        var l = false,
          c = r.targetNode;
        if (c && c.instanceOf(Element)) {
          if (c.matchParent(".interactive-child")) return;
          var u = r.clientX,
            h = r.clientY;
          for (a = 0; a < c.childNodes.length; a++) {
            var p = c.childNodes[a];
            if (p.nodeType === Node.TEXT_NODE) {
              var d;
              (d = new Range()).setStart(p, 0);
              d.setEnd(p, p.textContent.length);
              for (var f = d.getClientRects(), m = 0; m < f.length; m++) {
                var g = f[m];
                if (g.x <= u && u <= g.x + g.width && g.y <= h && h <= g.y + g.height) {
                  l = true;
                  break;
                }
              }
              if (l) break;
            }
          }
        }
        i = r.win;
        n = i.setTimeout(
          function () {
            if (!r.defaultPrevented) {
              r.preventDefault();
              t(r);
            }
          },
          l ? 150 : 10,
        );
      }
    }
  });
}
function focusAndSelectRange(e, t) {
  var n;
  e.focus();
  var i = e.win,
    r = createTextRange(e, t.from, (n = t.to) !== null && undefined !== n ? n : t.from),
    o = i.getSelection();
  if (o) {
    o.removeAllRanges();
    o.addRange(r);
  }
}
function normalizeElementText(e, t) {
  var n;
  if (
    (undefined === t && (t = false),
    e.normalize(),
    e.childNodes.length !== 1 ||
      ((n = e.firstChild) === null || undefined === n ? undefined : n.nodeType) !== Node.TEXT_NODE)
  ) {
    var textContent = t ? e.textContent : e.getText();
    e.textContent = textContent;
    e.isActiveElement() && focusAndSelectContent(e, !1);
  }
}
function handlePasteText(e, t) {
  var n, i;
  t.preventDefault();
  var r =
      (i = (n = t.clipboardData) === null || undefined === n ? undefined : n.getData("text/plain")) !== null &&
      undefined !== i
        ? i
        : "",
    o = e.doc;
  if (o.queryCommandSupported("insertText")) o.execCommand("insertText", !1, r);
  else {
    var a = window.getSelection();
    if (!a) return;
    var s = a.getRangeAt(0);
    if (!e.contains(s.commonAncestorContainer)) return;
    s.deleteContents();
    var l = document.createTextNode(r);
    s.insertNode(l);
    s.selectNodeContents(l);
    s.collapse(!1);
    a.removeAllRanges();
    a.addRange(s);
  }
  e.normalize();
}
function executeWhenShown(e, t) {
  e.isShown() ? t() : e.onNodeInserted(t, !0);
}
function isContentEditable(e) {
  return !!e && (e.nodeName === "INPUT" || !(!e.instanceOf(HTMLElement) || e.contentEditable !== "true"));
}
var AUTO_SCROLL_THRESHOLD = 16 * devicePixelRatio;
function autoScrollOnDrag(e, t, n, i) {
  if (undefined === i) {
    i = 2;
  }
  var r = e.getBoundingClientRect(),
    o = Math.min(r.height / 3, AUTO_SCROLL_THRESHOLD),
    a = Math.min(r.width / 3, AUTO_SCROLL_THRESHOLD),
    s = false,
    l = t.y;
  l < r.top + o
    ? ((e.scrollTop -= (i * n * (r.top + o - l)) / o), (s = true))
    : l > r.bottom - o && ((e.scrollTop += (i * n * (l - (r.bottom - o))) / o), (s = true));
  var c = t.x;
  c < r.left + a
    ? ((e.scrollLeft -= (i * n * (r.left + a - c)) / a), (s = true))
    : c > r.right - a && ((e.scrollLeft += (i * n * (c - (r.right - a))) / a), (s = true));
  return s;
}
const emptyFunction = function () {};
function setupPointerDragHandler(e, t, n) {
  if ((undefined === n && (n = 5), !e.isPrimary)) return emptyFunction;
  var i = null;
  if (n === 0 && !(i = t())) return emptyFunction;
  var r = e.view,
    o = Ll(e),
    a = function (r) {
      if (r.pointerId === e.pointerId) {
        if (!i) {
          if (Fl(o, Ll(r)) < n) return;
          if (!(i = t())) return void d();
        }
        if (i && i.move) {
          i.move(r);
        }
      }
    },
    s = function (t) {
      if (t.button === e.button && t.pointerId === e.pointerId) {
        d();
        i && i.end && i.end(t);
      }
    },
    l = function (t) {
      if (t.button === e.button && t.pointerId === e.pointerId) {
        d();
        i && i.cancel && i.cancel();
      }
    },
    c = function (e) {
      d();
      i && i.end && i.end(e);
    },
    u = function () {
      d();
      i && i.cancel && i.cancel();
    },
    h = function (e) {
      e.key === "Escape" && (d(), i && i.cancel && i.cancel());
      i && i.keydown && i.keydown(e);
    },
    p = function (e) {
      if (i && i.keyup) {
        i.keyup(e);
      }
    },
    d = function () {
      r.removeEventListener("pointermove", a);
      r.removeEventListener("pointerup", s);
      r.removeEventListener("pointercancel", l);
      r.removeEventListener("dragstart", c);
      r.removeEventListener("drop", c);
      r.removeEventListener("contextmenu", u);
      window.removeEventListener("keydown", h);
      window.removeEventListener("keyup", p);
      i && i.cleanup && i.cleanup();
    };
  r.addEventListener("pointermove", a);
  r.addEventListener("pointerup", s);
  r.addEventListener("pointercancel", l);
  r.addEventListener("dragstart", c);
  r.addEventListener("drop", c);
  r.addEventListener("contextmenu", u);
  window.addEventListener("keydown", h);
  window.addEventListener("keyup", p);
  return d;
}
function temporarilyPreventEvent(e, t) {
  var n = e.win,
    i = function (e) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    },
    r = n.setTimeout(function () {
      e.removeEventListener(t, i, {
        capture: !0,
      });
      n.clearTimeout(r);
    }, 0);
  e.addEventListener(t, i, {
    capture: !0,
  });
}
function detectTextDirectionInNode(e) {
  for (var t, n = e.doc.createNodeIterator(e, NodeFilter.SHOW_TEXT); (t = n.nextNode()); ) {
    var i = detectTextDirection(t.nodeValue);
    if (i !== "auto") return i;
  }
  return "auto";
}
function createTemplateCache(e) {
  var t = null;
  return function () {
    t || ((t = e()), (e = null));
    return t.cloneNode(!0);
  };
}
function isElementLTR(e) {
  return getComputedStyle(e).direction !== "rtl";
}
for (
  var keyCodeNameMap = {
      3: "Cancel",
      6: "Help",
      8: "Backspace",
      9: "Tab",
      12: "Clear",
      13: "Enter",
      16: "Shift",
      17: "Control",
      18: "Alt",
      19: "Pause",
      20: "CapsLock",
      27: "Escape",
      28: "Convert",
      29: "NonConvert",
      30: "Accept",
      31: "ModeChange",
      32: " ",
      33: "PageUp",
      34: "PageDown",
      35: "End",
      36: "Home",
      37: "ArrowLeft",
      38: "ArrowUp",
      39: "ArrowRight",
      40: "ArrowDown",
      41: "Select",
      42: "Print",
      43: "Execute",
      44: "PrintScreen",
      45: "Insert",
      46: "Delete",
      48: "0",
      49: "1",
      50: "2",
      51: "3",
      52: "4",
      53: "5",
      54: "6",
      55: "7",
      56: "8",
      57: "9",
      91: "OS",
      93: "ContextMenu",
      95: "Sleep",
      106: "*",
      107: "+",
      109: "-",
      110: ".",
      111: "/",
      144: "NumLock",
      145: "ScrollLock",
      181: "VolumeMute",
      182: "VolumeDown",
      183: "VolumeUp",
      186: ";",
      187: "=",
      188: ",",
      189: "-",
      190: ".",
      191: "/",
      192: "`",
      219: "[",
      220: "\\",
      221: "]",
      222: "'",
      224: "Meta",
      225: "AltGraph",
      246: "Attn",
      247: "CrSel",
      248: "ExSel",
      249: "EraseEof",
      250: "Play",
      251: "ZoomOut",
    },
    lk = 1;
  lk < 25;
  lk++
)
  keyCodeNameMap[111 + lk] = "F" + lk;
for (lk = 65; lk < 91; lk++) {
  var character = String.fromCharCode(lk);
  keyCodeNameMap[lk] = character.toUpperCase();
}
for (lk = 96; lk < 106; lk++) keyCodeNameMap[lk] = "Numpad" + String.fromCharCode(lk - 48);
var specialKeyDisplay = {
  ArrowLeft: "←",
  ArrowRight: "→",
  ArrowUp: "↑",
  ArrowDown: "↓",
  " ": "Space",
};
function getKeyName(e) {
  var t = e.key;
  if (!t) {
    var n = e.which || e.keyCode;
    t = keyCodeNameMap[n];
  }
  return t;
}
function getVirtualKey(e) {
  var t = e.which || e.keyCode;
  return keyCodeNameMap[t] || "Key" + t;
}
var modifierDisplayMap = isMacOS
    ? {
        Mod: "⌘",
        Ctrl: "⌃",
        Meta: "⌘",
        Alt: "⌥",
        Shift: "⇧",
      }
    : {
        Mod: "Ctrl",
        Ctrl: "Ctrl",
        Meta: "Win",
        Alt: "Alt",
        Shift: "Shift",
      },
  modifierPriorityOrder = ["Mod", "Ctrl", "Meta", "Alt", "Shift"];

// 作用域类，管理快捷键注册与匹配
class Scope {
  constructor(parent) {
    this.tabFocusContainerEl = null;
    this.keys = [];
    this.parent = parent;
  }
  register(modifiers, key, func) {
    var i = {
      scope: this,
      modifiers: modifiers ? Keymap.compileModifiers(modifiers) : null,
      key: key,
      func: func,
    };
    this.keys.push(i);
    return i;
  }
  unregister(binding) {
    this.keys.remove(binding);
  }
  setTabFocusContainerEl(tabFocusContainerEl) {
    this.tabFocusContainerEl = tabFocusContainerEl;
  }
  handleKey(event, keyInfo) {
    for (var n = 0, i = this.keys; n < i.length; n++) {
      var r = i[n];
      if (Keymap.isMatch(r, keyInfo)) {
        var o = r.func(event, keyInfo);
        if (undefined !== o) return o;
        if (r.key !== null || r.modifiers !== null) return o;
      }
    }
    if (this.parent) return this.parent.handleKey(event, keyInfo);
  }
}

// 动态作用域，其实际作用域由回调函数返回
class DynamicScope extends Scope {
  constructor(parent, callback) {
    super(parent);
    this.cb = callback;
  }
  handleKey(event, keyInfo) {
    var scope = this.cb();
    return scope ? scope.handleKey(event, keyInfo) : super.handleKey(event, keyInfo);
  }
}

// 键盘映射管理器
class Keymap {
  constructor() {
    this.modifiers = "";
    this.rootScope = new Scope();
    this.scope = this.rootScope;
    this.prevScopes = [];
    window.addEventListener("keydown", this.onKeyEvent.bind(this), !0);
    window.addEventListener("focusin", this.onFocusIn.bind(this));
  }
  static init() {
    Keymap.global || (Keymap.global = new Keymap());
    return Keymap.global;
  }
  getRootScope() {
    return this.rootScope;
  }
  pushScope(scope) {
    if (this.scope !== scope) {
      this.prevScopes.push(this.scope);
      this.scope = scope;
    }
  }
  popScope(scope) {
    if (scope !== this.rootScope) {
      this.scope === scope ? (this.scope = this.prevScopes.pop() || this.rootScope) : this.prevScopes.remove(scope);
    }
  }
  onKeyEvent(event) {
    this.updateModifiers(event);
    var scope = this.scope;
    if (scope) {
      var keyName = getKeyName(event);
      if (!Keymap.isModifierKey(keyName)) {
        var vkey = getVirtualKey(event);
        if (event.which === 54 && event.key == "^" && event.code === "KeyI") {
          vkey = "KeyI";
        }
        var keyInfo = {
          modifiers: this.modifiers,
          key: keyName,
          vkey: vkey,
        };
        return !1 === scope.handleKey(event, keyInfo)
          ? (event.preventDefault(), event.stopPropagation(), !1)
          : undefined;
      }
    }
  }
  onFocusIn(event) {
    var self = this,
      scope = this.scope;
    if (scope && scope.tabFocusContainerEl) {
      var container = scope.tabFocusContainerEl,
        target = event.targetNode;
      if (target && target !== activeDocument.body && target.instanceOf(Element) && !container.contains(target)) {
        setTimeout(function () {
          if (
            self.scope === scope &&
            !findAndFocusFirstFocusable(container, {
              preventScroll: !0,
            })
          ) {
            var activeEl = activeDocument.activeElement;
            activeEl && activeEl.instanceOf(HTMLElement) && activeEl.blur();
          }
        }, 0);
      }
    }
  }
  updateModifiers(event) {
    this.modifiers = Keymap.getModifiers(event);
  }
  static getModifiers(event) {
    var modifiers = [];
    event.ctrlKey && modifiers.push("Ctrl");
    event.metaKey && modifiers.push("Meta");
    event.altKey && modifiers.push("Alt");
    event.shiftKey && modifiers.push("Shift");
    return Keymap.compileModifiers(modifiers);
  }
  static compileModifiers(modifiers) {
    return modifiers
      .map(function (m) {
        return m === "Mod" ? (Bl === "macOS" ? "Meta" : "Ctrl") : m;
      })
      .sort()
      .join(",");
  }
  static decompileModifiers(modifiersStr) {
    return modifiersStr
      .split(",")
      .map(function (m) {
        return (Bl === "macOS" && m === "Meta") || (Bl !== "macOS" && m === "Ctrl") ? "Mod" : m;
      })
      .filter(function (m) {
        return m;
      });
  }
  static isModifierKey(key) {
    return key === "Control" || key === "Alt" || key === "Shift" || key === "OS" || key === "Meta";
  }
  matchModifiers(modifiers) {
    return this.modifiers === modifiers;
  }
  hasModifier(modifier) {
    return Keymap.decompileModifiers(this.modifiers).contains(modifier);
  }
  static isModifier(event, modifier) {
    return modifier === "Ctrl"
      ? event.ctrlKey
      : modifier === "Meta"
        ? event.metaKey
        : modifier === "Alt"
          ? event.altKey
          : modifier === "Shift"
            ? event.shiftKey
            : modifier === "Mod" && (Bl === "macOS" ? event.metaKey : event.ctrlKey);
  }
  static isMatch(binding, keyInfo) {
    var modifiers = binding.modifiers,
      key = binding.key;
    return (
      (modifiers === null || modifiers === keyInfo.modifiers) &&
      (!key || key === keyInfo.vkey || !(!keyInfo.key || key.toLowerCase() !== keyInfo.key.toLowerCase()))
    );
  }
  static isModEvent(event) {
    return (
      !!event &&
      ((function (e) {
        return (e.instanceOf(MouseEvent) || e.instanceOf(PointerEvent)) && e.button === 1;
      })(event)
        ? "tab"
        : !!Keymap.isModifier(event, "Mod") &&
          (Keymap.isModifier(event, "Alt") ? (Keymap.isModifier(event, "Shift") ? "window" : "split") : "tab"))
    );
  }
}

// 创建模拟的 KeyboardEvent
function createKeyboardEvent(e, t) {
  undefined === t && (t = {});
  return new KeyboardEvent(
    e.type,
    Object.assign(
      {
        key: e.key,
        code: e.code,
        location: e.location,
        repeat: e.repeat,
        isComposing: e.isComposing,
        ctrlKey: e.ctrlKey,
        shiftKey: e.shiftKey,
        altKey: e.altKey,
        metaKey: e.metaKey,
        bubbles: e.bubbles,
        cancelable: e.cancelable,
        composed: e.composed,
      },
      t,
    ),
  );
}
function setDragText(e, t) {
  e.setData("text/plain", t);
}
function setDragTextAndURL(e, t) {
  e.setData("text/plain", t);
  e.setData("text/uri-list", t);
}
function hasFilesInDragData(e) {
  for (var t = 0; t < e.items.length; t++) {
    if (e.items[t].kind === "file") return !0;
  }
  return !(!Platform.isIosApp || -1 === e.types.indexOf("Files"));
}
function extractFilesFromDataTransfer(e, t, n) {
  for (var files = [], r = 0, o = Array.from(e.items); r < o.length; r++) {
    var item = o[r];
    if (item.kind === "file")
      if ((file = item.getAsFile())) {
        var filepath = file.path || "",
          name = file.name,
          extension = getExtension(name),
          baseName = Qc(name),
          data = null;
        if (
          (Platform.isDesktopApp && electron.webUtils && (filepath = electron.webUtils.getPathForFile(file)), !filepath)
        ) {
          var type = file.type;
          type === "image/png"
            ? ((extension = "png"), (baseName = "Pasted image"))
            : type === "image/jpeg" && ((extension = "jpg"), (baseName = "Pasted image"));
        }
        n && (data = filepath ? readFileIfExists(filepath) : getBlobArrayBuffer(file));
        files.push({
          name: baseName,
          filepath: filepath,
          extension: extension,
          data: data,
        });
      }
  }
  if (
    t === "clipboard" &&
    files.length === 0 &&
    Platform.isDesktopApp &&
    !e.getData("text/plain") &&
    !Keymap.global.hasModifier("Shift")
  ) {
    var file = (function () {
      var electronModule = loadModule("electron");
      if (!electronModule) return null;
      var clipboard = electronModule.remote.clipboard,
        image = clipboard.readImage();
      if (image && !image.isEmpty()) {
        var buffer = pf(image.toPNG());
        return {
          name: "Pasted image",
          extension: "png",
          data: Promise.resolve(buffer),
        };
      }
      var filePath = "";
      if (
        (Bl === "Windows"
          ? (filePath = clipboard.readBuffer("FileNameW").toString("ucs2").replace("\0", ""))
          : Bl === "macOS" &&
            (filePath = clipboard.read("public.file-url")) &&
            ((filePath = filePath.replace("file://", "")), (filePath = decodeURI(filePath))),
        !filePath)
      )
        return null;
      var fullName = getFilename(normalizePath(filePath)),
        ext = getExtension(fullName);
      return {
        filepath: filePath,
        name: Qc(fullName),
        extension: ext,
        data: readFileIfExists(filePath),
      };
    })();
    if (file) {
      files.push(file);
    }
  }
  return files;
}
function isRelativePath(e) {
  return !(!e.startsWith("./") && !e.startsWith("../")) || -1 === e.indexOf(":");
}
function normalizeURL(e) {
  try {
    return new URL(e).toString();
  } catch (e) {
    console.log(e);
  }
  try {
    return encodeURI(decodeURI(e));
  } catch (e) {}
  return "";
}
function extractTagName(e) {
  if ((e = e.trim()).startsWith("<")) {
    var t = e.indexOf(">");
    if (-1 !== t) return e.substring(1, t);
  }
  var n = /\s/.exec(e);
  return n ? e.substring(0, n.index) : e;
}