const nationalities = [
    {
        "id": 1,
        "nationalite": "afghane",
        "libelle": "Afghanistan"
    },
    {
        "id": 2,
        "nationalite": "sudafricaine",
        "libelle": "Afrique du Sud"
    },
    {
        "id": 3,
        "nationalite": "albanaise",
        "libelle": "Albanie"
    },
    {
        "id": 4,
        "nationalite": "algérienne",
        "libelle": "Algérie"
    },
    {
        "id": 5,
        "nationalite": "allemande",
        "libelle": "Allemagne"
    },
    {
        "id": 6,
        "nationalite": "andorrane",
        "libelle": "Andorre"
    },
    {
        "id": 7,
        "nationalite": "angolaise",
        "libelle": "Angola"
    },
    {
        "id": 8,
        "nationalite": "antiguayenne",
        "libelle": "Antigua-et-Barbuda"
    },
    {
        "id": 9,
        "nationalite": "saoudienne",
        "libelle": "Arabie saoudite"
    },
    {
        "id": 10,
        "nationalite": "argentine",
        "libelle": "Argentine"
    },
    {
        "id": 11,
        "nationalite": "arménienne",
        "libelle": "Arménie"
    },
    {
        "id": 12,
        "nationalite": "australienne",
        "libelle": "Australie"
    },
    {
        "id": 13,
        "nationalite": "autrichienne",
        "libelle": "Autriche"
    },
    {
        "id": 14,
        "nationalite": "azerbaïdjanaise",
        "libelle": "Azerbaïdjan"
    },
    {
        "id": 15,
        "nationalite": "bahaméenne",
        "libelle": "Bahamas"
    },
    {
        "id": 16,
        "nationalite": "bahreïnienne",
        "libelle": "Bahreïn"
    },
    {
        "id": 17,
        "nationalite": "bangladaise",
        "libelle": "Bangladesh"
    },
    {
        "id": 18,
        "nationalite": "barbadienne",
        "libelle": "Barbade"
    },
    {
        "id": 19,
        "nationalite": "belge",
        "libelle": "Belgique"
    },
    {
        "id": 20,
        "nationalite": "bélizienne",
        "libelle": "Belize"
    },
    {
        "id": 22,
        "nationalite": "bhoutanaise",
        "libelle": "Bhoutan"
    },
    {
        "id": 24,
        "nationalite": "birmane",
        "libelle": "Birmanie"
    },
    {
        "id": 23,
        "nationalite": "biélorusse",
        "libelle": "Biélorussie"
    },
    {
        "id": 25,
        "nationalite": "bolivienne",
        "libelle": "Bolivie"
    },
    {
        "id": 26,
        "nationalite": "bosnienne",
        "libelle": "Bosnie-Herzégovine"
    },
    {
        "id": 27,
        "nationalite": "botswanaise",
        "libelle": "Botswana"
    },
    {
        "id": 29,
        "nationalite": "brunéienne",
        "libelle": "Brunei"
    },
    {
        "id": 28,
        "nationalite": "brésilienne",
        "libelle": "Brésil"
    },
    {
        "id": 30,
        "nationalite": "bulgare",
        "libelle": "Bulgarie"
    },
    {
        "id": 31,
        "nationalite": "burkinabé",
        "libelle": "Burkina"
    },
    {
        "id": 32,
        "nationalite": "burundaise",
        "libelle": "Burundi"
    },
    {
        "id": 21,
        "nationalite": "béninoise",
        "libelle": "Bénin"
    },
    {
        "id": 33,
        "nationalite": "cambodgienne",
        "libelle": "Cambodge"
    },
    {
        "id": 34,
        "nationalite": "camerounaise",
        "libelle": "Cameroun"
    },
    {
        "id": 35,
        "nationalite": "canadienne",
        "libelle": "Canada"
    },
    {
        "id": 36,
        "nationalite": "cap-verdienne",
        "libelle": "Cap-Vert"
    },
    {
        "id": 144,
        "nationalite": "centrafricaine",
        "libelle": "Centrafrique"
    },
    {
        "id": 37,
        "nationalite": "chilienne",
        "libelle": "Chili"
    },
    {
        "id": 38,
        "nationalite": "chinoise",
        "libelle": "Chine"
    },
    {
        "id": 39,
        "nationalite": "chypriote",
        "libelle": "Chypre"
    },
    {
        "id": 40,
        "nationalite": "colombienne",
        "libelle": "Colombie"
    },
    {
        "id": 41,
        "nationalite": "comorienne",
        "libelle": "Comores"
    },
    {
        "id": 42,
        "nationalite": "congolaise",
        "libelle": "Congo"
    },
    {
        "id": 43,
        "nationalite": "nord-coréenne",
        "libelle": "Corée du Nord"
    },
    {
        "id": 44,
        "nationalite": "sud-coréenne",
        "libelle": "Corée du Sud"
    },
    {
        "id": 45,
        "nationalite": "costaricienne",
        "libelle": "Costa Rica"
    },
    {
        "id": 47,
        "nationalite": "croate",
        "libelle": "Croatie"
    },
    {
        "id": 48,
        "nationalite": "cubaine",
        "libelle": "Cuba"
    },
    {
        "id": 46,
        "nationalite": "ivoirienne",
        "libelle": "Côte d'Ivoire"
    },
    {
        "id": 49,
        "nationalite": "danoise",
        "libelle": "Danemark"
    },
    {
        "id": 50,
        "nationalite": "djiboutienne",
        "libelle": "Djibouti"
    },
    {
        "id": 51,
        "nationalite": "dominiquaise",
        "libelle": "Dominique"
    },
    {
        "id": 52,
        "nationalite": "egyptienne",
        "libelle": "Egypte"
    },
    {
        "id": 53,
        "nationalite": "emirienne",
        "libelle": "Emirats arabes unis"
    },
    {
        "id": 54,
        "nationalite": "equatorienne",
        "libelle": "Equateur"
    },
    {
        "id": 55,
        "nationalite": "erythréenne",
        "libelle": "Erythrée"
    },
    {
        "id": 56,
        "nationalite": "espagnole",
        "libelle": "Espagne"
    },
    {
        "id": 57,
        "nationalite": "estonienne",
        "libelle": "Estonie"
    },
    {
        "id": 58,
        "nationalite": "américaine",
        "libelle": "Etats-Unis"
    },
    {
        "id": 59,
        "nationalite": "ethiopienne",
        "libelle": "Ethiopie"
    },
    {
        "id": 60,
        "nationalite": "fidjienne",
        "libelle": "Fidji"
    },
    {
        "id": 61,
        "nationalite": "finlandaise",
        "libelle": "Finlande"
    },
    {
        "id": 62,
        "nationalite": "française",
        "libelle": "France"
    },
    {
        "id": 63,
        "nationalite": "gabonaise",
        "libelle": "Gabon"
    },
    {
        "id": 64,
        "nationalite": "gambienne",
        "libelle": "Gambie"
    },
    {
        "id": 66,
        "nationalite": "ghanéenne",
        "libelle": "Ghana"
    },
    {
        "id": 68,
        "nationalite": "grenadienne",
        "libelle": "Grenade"
    },
    {
        "id": 67,
        "nationalite": "grecque",
        "libelle": "Grèce"
    },
    {
        "id": 69,
        "nationalite": "guatémaltèque",
        "libelle": "Guatemala"
    },
    {
        "id": 70,
        "nationalite": "guinéenne",
        "libelle": "Guinée"
    },
    {
        "id": 71,
        "nationalite": "equatoguinéenne",
        "libelle": "Guinée équatoriale"
    },
    {
        "id": 72,
        "nationalite": "bissaoguinéenne",
        "libelle": "Guinée-Bissao"
    },
    {
        "id": 73,
        "nationalite": "guyanienne",
        "libelle": "Guyana"
    },
    {
        "id": 65,
        "nationalite": "géorgienne",
        "libelle": "Géorgie"
    },
    {
        "id": 74,
        "nationalite": "haïtienne",
        "libelle": "Haïti"
    },
    {
        "id": 75,
        "nationalite": "hondurienne",
        "libelle": "Honduras"
    },
    {
        "id": 77,
        "nationalite": "hongroise",
        "libelle": "Hongrie"
    },
    {
        "id": 79,
        "nationalite": "indienne",
        "libelle": "Inde"
    },
    {
        "id": 80,
        "nationalite": "indonésienne",
        "libelle": "Indonésie"
    },
    {
        "id": 81,
        "nationalite": "irakienne",
        "libelle": "Irak"
    },
    {
        "id": 82,
        "nationalite": "iranienne",
        "libelle": "Iran"
    },
    {
        "id": 83,
        "nationalite": "irlandaise",
        "libelle": "Irlande"
    },
    {
        "id": 84,
        "nationalite": "islandaise",
        "libelle": "Islande"
    },
    {
        "id": 85,
        "nationalite": "israélienne",
        "libelle": "Israël"
    },
    {
        "id": 86,
        "nationalite": "italienne",
        "libelle": "Italie"
    },
    {
        "id": 87,
        "nationalite": "jamaïquaine",
        "libelle": "Jamaïque"
    },
    {
        "id": 88,
        "nationalite": "japonaise",
        "libelle": "Japon"
    },
    {
        "id": 90,
        "nationalite": "jordanienne",
        "libelle": "Jordanie"
    },
    {
        "id": 89,
        "nationalite": "palestinienne",
        "libelle": "Jérusalem - Territoires palestiniens"
    },
    {
        "id": 91,
        "nationalite": "kazakhstanais",
        "libelle": "Kazakhstan"
    },
    {
        "id": 92,
        "nationalite": "kényane",
        "libelle": "Kenya"
    },
    {
        "id": 93,
        "nationalite": "kirghize",
        "libelle": "Kirghizstan"
    },
    {
        "id": 94,
        "nationalite": "kiribatienne",
        "libelle": "Kiribati"
    },
    {
        "id": 198,
        "nationalite": "kosovare",
        "libelle": "Kosovo"
    },
    {
        "id": 95,
        "nationalite": "koweïtienne",
        "libelle": "Koweït"
    },
    {
        "id": 96,
        "nationalite": "laotienne",
        "libelle": "Laos"
    },
    {
        "id": 97,
        "nationalite": "lesothienne",
        "libelle": "Lesotho"
    },
    {
        "id": 98,
        "nationalite": "lettone",
        "libelle": "Lettonie"
    },
    {
        "id": 99,
        "nationalite": "libanaise",
        "libelle": "Liban"
    },
    {
        "id": 100,
        "nationalite": "libérienne",
        "libelle": "Liberia"
    },
    {
        "id": 101,
        "nationalite": "libyenne",
        "libelle": "Libye"
    },
    {
        "id": 102,
        "nationalite": "liechtensteinoise",
        "libelle": "Liechtenstein"
    },
    {
        "id": 103,
        "nationalite": "lituanienne",
        "libelle": "Lituanie"
    },
    {
        "id": 104,
        "nationalite": "luxembourgeoise",
        "libelle": "Luxembourg"
    },
    {
        "id": 105,
        "nationalite": "macédonienne",
        "libelle": "Macédoine"
    },
    {
        "id": 106,
        "nationalite": "malgache",
        "libelle": "Madagascar"
    },
    {
        "id": 107,
        "nationalite": "malaisienne",
        "libelle": "Malaisie"
    },
    {
        "id": 108,
        "nationalite": "malawienne",
        "libelle": "Malawi"
    },
    {
        "id": 109,
        "nationalite": "maldivienne",
        "libelle": "Maldives"
    },
    {
        "id": 110,
        "nationalite": "malienne",
        "libelle": "Mali"
    },
    {
        "id": 111,
        "nationalite": "maltaise",
        "libelle": "Malte"
    },
    {
        "id": 112,
        "nationalite": "marocaine",
        "libelle": "Maroc"
    },
    {
        "id": 113,
        "nationalite": "marshallaise",
        "libelle": "Marshall"
    },
    {
        "id": 114,
        "nationalite": "mauricienne",
        "libelle": "Maurice"
    },
    {
        "id": 115,
        "nationalite": "mauritanienne",
        "libelle": "Mauritanie"
    },
    {
        "id": 116,
        "nationalite": "mexicaine",
        "libelle": "Mexique"
    },
    {
        "id": 117,
        "nationalite": "micronésienne",
        "libelle": "Micronésie"
    },
    {
        "id": 118,
        "nationalite": "moldave",
        "libelle": "Moldavie"
    },
    {
        "id": 119,
        "nationalite": "monégasque",
        "libelle": "Monaco"
    },
    {
        "id": 120,
        "nationalite": "mongole",
        "libelle": "Mongolie"
    },
    {
        "id": 197,
        "nationalite": "monténégrine",
        "libelle": "Monténégro"
    },
    {
        "id": 121,
        "nationalite": "mozambicaine",
        "libelle": "Mozambique"
    },
    {
        "id": 122,
        "nationalite": "namibienne",
        "libelle": "Namibie"
    },
    {
        "id": 123,
        "nationalite": "nauruane",
        "libelle": "Nauru"
    },
    {
        "id": 125,
        "nationalite": "nicaraguayenne",
        "libelle": "Nicaragua"
    },
    {
        "id": 126,
        "nationalite": "nigérienne",
        "libelle": "Niger"
    },
    {
        "id": 127,
        "nationalite": "nigériane",
        "libelle": "Nigeria"
    },
    {
        "id": 128,
        "nationalite": "norvégienne",
        "libelle": "Norvège"
    },
    {
        "id": 129,
        "nationalite": "néo-zélandaise",
        "libelle": "Nouvelle-Zélande"
    },
    {
        "id": 124,
        "nationalite": "népalaise",
        "libelle": "Népal"
    },
    {
        "id": 130,
        "nationalite": "omanaise",
        "libelle": "Oman"
    },
    {
        "id": 131,
        "nationalite": "ougandaise",
        "libelle": "Ouganda"
    },
    {
        "id": 132,
        "nationalite": "ouzbèke",
        "libelle": "Ouzbékistan"
    },
    {
        "id": 133,
        "nationalite": "pakistanaise",
        "libelle": "Pakistan"
    },
    {
        "id": 134,
        "nationalite": "palaoise",
        "libelle": "Palaos"
    },
    {
        "id": 135,
        "nationalite": "panaméenne",
        "libelle": "Panama"
    },
    {
        "id": 136,
        "nationalite": "papouasienne",
        "libelle": "Papouasie-Nouvelle-Guinée"
    },
    {
        "id": 137,
        "nationalite": "paraguayenne",
        "libelle": "Paraguay"
    },
    {
        "id": 138,
        "nationalite": "néerlandaise",
        "libelle": "Pays-Bas"
    },
    {
        "id": 140,
        "nationalite": "philippine",
        "libelle": "Philippines"
    },
    {
        "id": 141,
        "nationalite": "polonaise",
        "libelle": "Pologne"
    },
    {
        "id": 142,
        "nationalite": "portugaise",
        "libelle": "Portugal"
    },
    {
        "id": 139,
        "nationalite": "péruvienne",
        "libelle": "Pérou"
    },
    {
        "id": 143,
        "nationalite": "qatarienne",
        "libelle": "Qatar"
    },
    {
        "id": 148,
        "nationalite": "roumaine",
        "libelle": "Roumanie"
    },
    {
        "id": 149,
        "nationalite": "britannique",
        "libelle": "Royaume-Uni"
    },
    {
        "id": 150,
        "nationalite": "russe",
        "libelle": "Russie"
    },
    {
        "id": 151,
        "nationalite": "rwandaise",
        "libelle": "Rwanda"
    },
    {
        "id": 146,
        "nationalite": "dominicaine",
        "libelle": "République dominicaine"
    },
    {
        "id": 145,
        "nationalite": "congolaise (RDC)",
        "libelle": "République démocratique du Congo"
    },
    {
        "id": 147,
        "nationalite": "tchèque",
        "libelle": "République tchèque"
    },
    {
        "id": 152,
        "nationalite": "christophienne",
        "libelle": "Saint-Christophe-et-Niévès"
    },
    {
        "id": 154,
        "nationalite": "marinaise",
        "libelle": "Saint-Marin"
    },
    {
        "id": 155,
        "nationalite": null,
        "libelle": "Saint-Siège"
    },
    {
        "id": 156,
        "nationalite": "vincentaise",
        "libelle": "Saint-Vincent-et-les Grenadines"
    },
    {
        "id": 153,
        "nationalite": "lucienne",
        "libelle": "Sainte-Lucie"
    },
    {
        "id": 157,
        "nationalite": "salomonaise",
        "libelle": "Salomon"
    },
    {
        "id": 158,
        "nationalite": "salvadorienne",
        "libelle": "Salvador"
    },
    {
        "id": 159,
        "nationalite": "samoene",
        "libelle": "Samoa"
    },
    {
        "id": 160,
        "nationalite": "santoméenne",
        "libelle": "Sao Tomé-et-Principe"
    },
    {
        "id": 162,
        "nationalite": "serbe",
        "libelle": "Serbie"
    },
    {
        "id": 163,
        "nationalite": "seychelloise",
        "libelle": "Seychelles"
    },
    {
        "id": 164,
        "nationalite": "sierraléonaise",
        "libelle": "Sierra Leone"
    },
    {
        "id": 165,
        "nationalite": "singapourienne",
        "libelle": "Singapour"
    },
    {
        "id": 166,
        "nationalite": "slovaque",
        "libelle": "Slovaquie"
    },
    {
        "id": 167,
        "nationalite": "slovène",
        "libelle": "Slovénie"
    },
    {
        "id": 168,
        "nationalite": "somalienne",
        "libelle": "Somalie"
    },
    {
        "id": 169,
        "nationalite": "soudanaise",
        "libelle": "Soudan"
    },
    {
        "id": 170,
        "nationalite": "srilankaise",
        "libelle": "Sri Lanka"
    },
    {
        "id": 172,
        "nationalite": "suisse",
        "libelle": "Suisse"
    },
    {
        "id": 173,
        "nationalite": "surinamaise",
        "libelle": "Suriname"
    },
    {
        "id": 171,
        "nationalite": "suédoise",
        "libelle": "Suède"
    },
    {
        "id": 174,
        "nationalite": "swazie",
        "libelle": "Swaziland"
    },
    {
        "id": 175,
        "nationalite": "syrienne",
        "libelle": "Syrie"
    },
    {
        "id": 161,
        "nationalite": "sénégalaise",
        "libelle": "Sénégal"
    },
    {
        "id": 176,
        "nationalite": "tadjike",
        "libelle": "Tadjikistan"
    },
    {
        "id": 178,
        "nationalite": "tanzanienne",
        "libelle": "Tanzanie"
    },
    {
        "id": 177,
        "nationalite": "taïwanaise",
        "libelle": "Taïwan"
    },
    {
        "id": 179,
        "nationalite": "tchadienne",
        "libelle": "Tchad"
    },
    {
        "id": 180,
        "nationalite": "thaïlandaise",
        "libelle": "Thaïlande"
    },
    {
        "id": 181,
        "nationalite": "timoraise",
        "libelle": "Timor oriental"
    },
    {
        "id": 182,
        "nationalite": "togolaise",
        "libelle": "Togo"
    },
    {
        "id": 183,
        "nationalite": "tongienne",
        "libelle": "Tonga"
    },
    {
        "id": 184,
        "nationalite": "trinidadienne",
        "libelle": "Trinité-et-Tobago"
    },
    {
        "id": 185,
        "nationalite": "tunisienne",
        "libelle": "Tunisie"
    },
    {
        "id": 186,
        "nationalite": "turkmène",
        "libelle": "Turkménistan"
    },
    {
        "id": 187,
        "nationalite": "turque",
        "libelle": "Turquie"
    },
    {
        "id": 188,
        "nationalite": "tuvaluane",
        "libelle": "Tuvalu"
    },
    {
        "id": 189,
        "nationalite": "ukrainienne",
        "libelle": "Ukraine"
    },
    {
        "id": 190,
        "nationalite": "uruguayenne",
        "libelle": "Uruguay"
    },
    {
        "id": 191,
        "nationalite": "vanuataise",
        "libelle": "Vanuatu"
    },
    {
        "id": 192,
        "nationalite": "vénézuélienne",
        "libelle": "Venezuela"
    },
    {
        "id": 193,
        "nationalite": "vietnamienne",
        "libelle": "Viêt Nam"
    },
    {
        "id": 194,
        "nationalite": "yéménite",
        "libelle": "Yémen"
    },
    {
        "id": 195,
        "nationalite": "zambienne",
        "libelle": "Zambie"
    },
    {
        "id": 196,
        "nationalite": "zimbabwéenne",
        "libelle": "Zimbabwe"
    }
]
export default nationalities;