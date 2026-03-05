export interface MenuItem {
  id: string
  name: string
  description: string
  price: string
  image?: string
  allergens?: number[]
  subItems?: Array<{
    name: string
    price: string
  }>
}

export interface PackageGroup {
  packageId: string
  packageName: string
  packagePrice: string
  packageDescription?: string
  packageImage?: string
  categories: Array<{
    categoryName: string
    items: MenuItem[]
    notes?: string
  }>
}

export interface MenuCategory {
  id: string
  sectionTitle: string
  isPackageSection?: boolean
  packages?: PackageGroup[]
  categories: Array<{
    categoryName: string
    items: MenuItem[]
    notes?: string
  }>
}

export const menuData: MenuCategory[] = [
  {
    id: "sniadania",
    sectionTitle: "Śniadania",
    categories: [
      {
        categoryName: "Śniadania Bliskowschodnie",
        items: [
          {
            id: "szakszuka-kofta",
            name: "Szakszuka z Grillowaną Koftą Jagnięcą",
            description:
              "Pomidory, cebula, czosnek, sumak, zatar, pikle, labneh, jajka, kofta jagnięca, serwowana z wypiekaną na miejscu pitą",
            price: "49 zł",
            image: "/images/menu/shakshuka-lamb-kofta-premium.jpeg",
            allergens: [1, 3, 7, 10, 11],
          },
          {
            id: "szakszuka-falafel",
            name: "Szakszuka z Falafelem",
            description:
              "Pomidory, cebula, czosnek, sumak, zatar, pikle, labneh, jajka, falafel, serwowana z wypiekaną na miejscu pitą",
            price: "39 zł",
            image: "/images/menu/shakshuka-falafel-breakfast-updated.jpeg",
            allergens: [1, 3, 7, 10, 11],
          },
          {
            id: "turkish-eggs",
            name: "Jajka po Turecku",
            description:
              "Jajka, labneh, palone masło, sos zhoug, harissa, ciecierzyca, serwowane z wypiekanej na miejscu picie",
            price: "39 zł",
            image: "/images/menu/turkish-eggs-breakfast-updated.jpeg",
            allergens: [1, 3, 7, 10, 11],
          },
          {
            id: "jajecznica-bliskowschodnia",
            name: "Jajecznica Bliskowschodnia",
            description: "3 jajka, pomidory, cebula, czosnek, oliwa, serwowana z wypiekaną na miejscu pitą",
            price: "29 zł",
            image: "/images/menu/scrambled-eggs-middle-eastern-new.jpeg",
            allergens: [1, 3],
          },
          {
            id: "sabich",
            name: "Sabich",
            description:
              "Grillowany bakłażan, jajko, świeże warzywa, hummus, pietruszka, mięta, sosy: pilpelchuma i amba, podane na wypiekanej na miejscu picie",
            price: "39 zł",
            image: "/images/menu/sabich-dish-new.jpeg",
            allergens: [1, 3, 7, 11],
          },
          {
            id: "arabic-sandwich",
            name: "Kanapka Arabska",
            description:
              "Wypiekany na miejscu turecki bajgiel - simit, z szarpaną jagnięciną, harissą aioli, piklowaną kapustą i ogórkiem, pietruszką i miętą",
            price: "44 zł",
            image: "/images/menu/arabic-sandwich-breakfast-updated.jpeg",
            allergens: [1, 3, 7, 10, 11],
          },
          {
            id: "syrian-sandwich",
            name: "Kanapka Syryjska",
            description:
              "Wypiekany na miejscu turecki bajgiel - simit, z pikantnym kurczakiem taouk, harissą, ubijaną fetą, piklowaną kapustą, pietruszką, miętą i cebulą",
            price: "36 zł",
            image: "/images/menu/syrian-sandwich-breakfast-updated.jpeg",
            allergens: [1, 3, 7, 10, 11],
          },
          {
            id: "greek-sandwich",
            name: "Kanapka Grecka",
            description:
              "Falafel, ubita feta, oliwki, cebula, sos pilpelchuma, tahini, chilli, podawane na chlebie pita",
            price: "29 zł",
            image: "/images/menu/greek-sandwich-new.jpeg",
            allergens: [1, 7, 10, 11],
          },

        ],
      },
    ],
  },
  {
    id: "zupy",
    sectionTitle: "Zupy",
    categories: [
      {
        categoryName: "Zupy Sezonowe",
        items: [
          {
            id: "seasonal-soup-vege",
            name: "Zupa Sezonowa Wegetariańska",
            description:
              "W ofercie restauracji znajdują się sezonowa zupa mięsna i sezonowa zupa wegetariańska. O aktualną dostępność zapytaj obsługę",
            price: "25 zł",
            image: "/images/menu/seasonal-soup.jpg",
          },
          {
            id: "seasonal-soup-meat",
            name: "Zupa Sezonowa Mięsna",
            description:
              "W ofercie restauracji znajdują się sezonowa zupa mięsna i sezonowa zupa wegetariańska. O aktualną dostępność zapytaj obsługę",
            price: "25 zł",
            image: "/images/menu/seasonal-soup.jpg",
          },
        ],
      },
    ],
  },
  {
    id: "mezze-talerzyki",
    sectionTitle: "Talerzyki Mezze",
    categories: [
      {
        categoryName: "Małe Talerzyki",
        items: [
          {
            id: "falafel",
            name: "Falafel",
            description: "Smażona kulka z ciecierzycy z przyprawami",
            price: "6 zł",
            image: "/images/menu/falafel-mezze.jpeg",
            allergens: [11],
          },
          {
            id: "hummus-classic",
            name: "Hummus",
            description: "Pasta z ciecierzycy i masła sezamowego z przyprawami",
            price: "7 zł",
            image: "/images/menu/hummus-mezze.jpeg",
            allergens: [11],
          },

          {
            id: "tzatziki",
            name: "Tzatziki",
            description: "Gęsty jogurt z ogórkiem i czosnkiem",
            price: "7 zł",
            image: "/images/menu/tzatziki-mezze.jpeg",
            allergens: [7],
          },
          {
            id: "hummus-white-bean",
            name: "Hummus z Białej Fasoli",
            description: "Pasta z białej fasoli i masła sezamowego z przyprawami",
            price: "9 zł",
            image: "/images/menu/hummus-white-bean.jpg",
            allergens: [1, 11],
          },
          {
            id: "mix-pikli",
            name: "Mix Pikli",
            description: "Chrupiące warzywa w aromatycznej zalewie octowej",
            price: "9 zł",
            image: "/images/menu/mixed-pickles-mezze.jpeg",
            allergens: [10],
          },
          {
            id: "labneh",
            name: "Labneh",
            description: "Kremowy serek z dodatkiem konfitowanego czosnku, oliwy i zataru",
            price: "9 zł",
            image: "/images/menu/labneh-mezze.jpeg",
            allergens: [7, 11],
          },
          {
            id: "labneh-sweet",
            name: "Labneh na Słodko",
            description: "Kremowy serek z dodatkiem miodu i pistacji",
            price: "9 zł",
            image: "/images/menu/sweet-labneh-new.jpeg",
            allergens: [7, 8, 11],
          },
          {
            id: "marinated-olives",
            name: "Marynowane Oliwki",
            description: "Z sumakiem, kiszoną cytryną, zatarem i sezamem",
            price: "10 zł",
            image: "/images/menu/marinated-olives-mezze.jpeg",
            allergens: [11],
          },
          {
            id: "tabbouleh",
            name: "Tabbouleh",
            description: "Sałatka z kaszą bulgur, pietruszką, miętą, koperkiem, ogórkiem i czerwoną cebulą",
            price: "11 zł",
            image: "/images/menu/tabbouleh-new.jpeg",
            allergens: [1, 10],
          },
          {
            id: "kibbeh",
            name: "Kibbeh",
            description: "Smażona kulka z kaszy bulgur z jagnięciną, cebulą i przyprawami",
            price: "11 zł",
            image: "/images/menu/kibbeh.jpg",
            allergens: [1],
          },
          {
            id: "tabbouleh-basma",
            name: "Tabbouleh by BASMA",
            description: "Sałatka z kaszą bulgur, suszoną morelą, migdałami, miodem i wodą z kwiatów pomarańczy",
            price: "12 zł",
            image: "/images/menu/tabbouleh-basma-mezze.jpeg",
            allergens: [1, 8, 10],
          },
          {
            id: "muhammara",
            name: "Muhammara",
            description: "Pasta z pieczonej papryki, melasy z granatu i orzechów włoskich",
            price: "12 zł",
            image: "/images/menu/muhammara-mezze.jpeg",
            allergens: [8],
          },
          {
            id: "baba-ganoush",
            name: "Baba Ghanoush",
            description: "Pasta z pieczonego bakłażana z jogurtem, sumakiem, pastą sezamową i granatem",
            price: "12 zł",
            image: "/images/menu/baba-ganoush-mezze.jpeg",
            allergens: [7, 11],
          },
          {
            id: "grilled-pepper-labneh",
            name: "Grillowana Papryka na Labneh",
            description: "Grillowana papryka podana na labneh",
            price: "12 zł",
            image: "/images/menu/grilled-pepper-labneh.jpg",
            allergens: [7],
          },
          {
            id: "labneh-basma",
            name: "Labneh by BASMA",
            description: "Kremowy serek z konfitowanym czosnkiem, natką pietruszki i prażonym sezamem",
            price: "12 zł",
            image: "/images/menu/labneh-basma.jpg",
          },
          {
            id: "ubijana-feta",
            name: "Ubijana Feta",
            description: "Pasta z serem feta, jogurtem greckim, czosnkiem, cytryną i słodką papryką",
            price: "15 zł",
            image: "/images/menu/whipped-feta-mezze.jpeg",
            allergens: [7],
          },
          {
            id: "all-mezze-set",
            name: "Zestaw Wszystkich Mezze z 4 Falafelami",
            description: "Kompletny zestaw wszystkich mezze z dodatkiem 4 falafelów",
            price: "159 zł",
            allergens: [1, 4, 7, 8, 10, 11],
          },
        ],
      },
    ],
  },
  {
    id: "mezze-talerze",
    sectionTitle: "Talerze Mezze",
    categories: [
      {
        categoryName: "Duże Talerze",
        items: [

          {
            id: "basma-talerz",
            name: "Basma",
            description: "3x falafel, hummus, labneh, grillowany bakłażan, mix pikli, pita",
            price: "45 zł",
            image: "/images/menu/mezze-platter-basma-premium.jpeg",
            allergens: [3, 7],
          },
          {
            id: "arabski-talerz",
            name: "Arabski",
            description: "Hummus, labneh, tabbouleh, muhammara, mix pikli, pita",
            price: "45 zł",
            image: "/images/menu/mezze-platter-arabic-premium.jpeg",
            allergens: [1, 7, 11, 12],
          },
          {
            id: "jerozolimski-talerz",
            name: "Jerozolimski",
            description: "3x falafel, baba ghanoush, tabbouleh by BASMA, muhammara, mix pikli, pita",
            price: "45 zł",
            image: "/images/menu/mezze-platter-jerusalem.jpeg",
            allergens: [1, 7, 8, 10, 11],
          },
          {
            id: "grecki-talerz",
            name: "Grecki",
            description: "2x falafel, grillowany bakłażan, oliwki, tzatziki, ubita feta, mix pikli, pita",
            price: "45 zł",
            image: "/images/menu/mezze-platter-greek.jpeg",
            allergens: [1, 7, 10, 11],
          },
          {
            id: "weganski-talerz",
            name: "Wegański",
            description: "3x falafel, hummus, tabbouleh, muhammara, mix pikli, pita",
            price: "45 zł",
            image: "/images/menu/mezze-platter-basma-premium.jpeg",
            allergens: [1, 8, 11, 12],
          },
        ],
      },
    ],
  },
  {
    id: "grill",
    sectionTitle: "Dania z Grilla",
    categories: [
      {
        categoryName: "Mięsa z Grilla",
        items: [
          {
            id: "chicken-joojeh",
            name: "Kurczak Joojeh",
            description: "Cytrynowy kurczak z szafranem i sosem zhoug",
            price: "39 zł",
            image: "/images/menu/chicken-joojeh.jpeg",
            allergens: [7, 10],
          },
          {
            id: "caramel-chicken",
            name: "Karmelowy Kurczak by BASMA",
            description: "Słodko-pikantny kurczak z wodą pomarańczową i orzechową dukkah",
            price: "39 zł",
            image: "/images/menu/caramel-chicken.jpeg",
            allergens: [8, 11],
          },
          {
            id: "chicken-taouk",
            name: "Kurczak Shish Taouk",
            description: "Aromatyczny kurczak z harissą",
            price: "39 zł",
            image: "/images/menu/chicken-shish-taouk-new.jpeg",
            allergens: [7, 10],
          },
          {
            id: "adana-kebap",
            name: "Adana Kebap Barani",
            description: "Z sosami toum i pilpelchuma, piklami i natką pietruszki",
            price: "59 zł",
            image: "/images/menu/adana-mutton-kebab-new.jpeg",
            allergens: [3, 10],
          },
          {
            id: "kofty-jagniece",
            name: "Kofty Jagnięce",
            description: "Z sosami zhoug i harissa, piklami, natką pietruszki i cebulą z sumakiem",
            price: "69 zł",
            image: "/images/menu/lamb-kofta-with-sauces-new.jpeg",
            allergens: [7, 10],
          },
          {
            id: "szarpana-jagniecina",
            name: "Szarpana Jagnięcina",
            description: "Z hummusem, sosami harissa i toum, piklowaną kapustą, natką pietruszki, cebulą z sumakiem",
            price: "89 zł",
            image: "/images/menu/pulled-smoked-lamb-new.jpeg",
            allergens: [10, 11],
          },
          {
            id: "lamb-chops",
            name: "Lamb Chops",
            description: "Comber jagnięcy z labneh, orzechami pinii, piklami, natką pietruszki, cebulą i czarnuszką",
            price: "129 zł",
            image: "/images/menu/lamb-chops-with-labneh-new.jpeg",
            allergens: [7, 8, 10],
          },
          {
            id: "meat-platter-2",
            name: "Talerz Mięs dla Dwóch Osób",
            description:
              "Adana kebab 1/2, kofta jagnięca 1/2, lamb chops 1/2, kurczak joojeh, kurczak taouk, sosy: zhoug, toum, harissa, pilpelchuma, 2x pita, ryż, frytki z sumakiem, mix pikli",
            price: "199 zł",
            image: "/images/menu/meat-platter-for-two-new.jpeg",
            allergens: [1, 3, 7, 8, 10, 11],
          },
          {
            id: "meat-platter-4",
            name: "Talerz Mięs dla Czterech Osób",
            description:
              "Lamb chops, adana kebap, kofty jagnięce, kurczak joojeh, kurczak taouk, sosy: zhoug, toum, harissa, pilpelchuma, 4x pita, ryż, frytki z sumakiem, mix pikli",
            price: "389 zł",
            image: "/images/menu/meat-platter-for-four-new.jpeg",
            allergens: [1, 3, 7, 8, 10, 11],
          },
        ],
      },
      {
        categoryName: "Vege Grill",
        items: [
          {
            id: "grilled-aubergine",
            name: "Grillowany Bakłażan",
            description:
              "Grillowany bakłażan z hummusem z białej fasoli, tabbouleh, rodzynkami i migdałami",
            price: "39 zł",
            image: "/images/menu/grilled-aubergine-new.jpg",
            allergens: [1, 8, 11],
          },
          {
            id: "cauliflower-labneh",
            name: "Kalafior z Labneh",
            description: "Melasą z granatów, pastą sezamową, orzechową dukkah, płatkami róży i granatem",
            price: "49 zł",
            image: "/images/menu/cauliflower-labneh.jpeg",
            allergens: [7, 8, 11],
          },
        ],
      },
      {
        categoryName: "Dla Dzieci",
        items: [
          {
            id: "pearl-couscous-lamb",
            name: "Kuskus Perlowy z Mieloną Jagnięciną",
            description: "Kuskus perlowy z mieloną jagnięciną w sosie pomidorowym",
            price: "29 zł",
          },
          {
            id: "explorer-plate",
            name: "Talerz Odkrywcy",
            description: "Nuggety z piersi kurczaka, frytki, tzatziki, labneh, ogórek, pomidor",
            price: "36 zł",
            image: "/images/menu/explorer-plate.jpg",
            allergens: [1, 3, 7],
          },
        ],
      },
    ],
  },
  {
    id: "salatki",
    sectionTitle: "Sałatki",
    categories: [
      {
        categoryName: "Świeże Sałatki",
        items: [
          {
            id: "syrian-salad-basma",
            name: "Sałatka Syryjska by BASMA",
            description:
              "Kasza bulgur, ogórek, pomidor, czerwona cebula, natka pietruszki, mięta, oliwa, sok z cytryny, melasa z granatu",
            price: "38 zł",
            image: "/images/menu/syrian-salad-basma.jpg",
            allergens: [1],
          },
          {
            id: "fattoush",
            name: "Fattoush",
            description:
              "Ubijana feta, sałata rzymska, ogórek, pomidor, granat, cebula, natka pietruszki, zatar, sumak, oliwa, smażona pita",
            price: "47 zł",
            image: "/images/menu/fattoush-salad.jpeg",
            allergens: [1, 7, 11],
          },
        ],
      },
    ],
  },
  {
    id: "desery",
    sectionTitle: "Desery",
    categories: [
      {
        categoryName: "Słodkości Bliskowschodnie",
        items: [
          {
            id: "kunafa",
            name: "Kunafa",
            description: "Ciasto kataifi, mozzarella, syrop cukrowy, woda różana",
            price: "25 zł",
            image: "/images/menu/kunafa.jpg",
            allergens: [1, 7],
          },
          {
            id: "sekerpare",
            name: "Sekerpare",
            description: "2 x ciasteczko z orzechem laskowym, nasączone syropem",
            price: "9 zł",
            image: "/images/menu/sekerpare.jpg",
          },
          {
            id: "baked-figs",
            name: "Pieczone Figi",
            description: "Figi, orzechy włoskie, miód, ciasto kataifi, labneh",
            price: "35 zł",
            image: "/images/menu/baked-figs.jpg",
            allergens: [1, 7, 8, 12],
          },
          {
            id: "dubai-dream",
            name: "Dubajski Sen",
            description:
              "Ciasto czekoladowe podane na chrupiącym kataifi z gałką lodów pistacjowych i sosem czekoladowym",
            price: "29 zł",
            image: "/images/menu/dubai-dream.jpeg",
            allergens: [1, 3, 7, 8],
          },
          {
            id: "creme-brulee-basma",
            name: "Crème Brûlée by BASMA",
            description: "Autorska wersja klasycznego deseru",
            price: "35 zł",
            image: "/images/menu/creme-brulee.jpeg",
            allergens: [3, 7, 8],
          },
          {
            id: "labneh-cheesecake",
            name: "Sernik z Labneh",
            description: "Sernik z labneh podawany z melasą z daktyli",
            price: "22 zł",
            allergens: [3, 7, 12],
          },
          {
            id: "warm-apple-pie",
            name: "Ciepła Szarlotka z Lodami",
            description:
              "Jabłka, gruszki, rodzynki, kruszonka, krem tahini, lody waniliowe",
            price: "29 zł",
            allergens: [1, 3, 8, 11],
          },
        ],
      },
    ],
  },
  {
    id: "dodatki",
    sectionTitle: "Dodatki i Sosy",
    categories: [
      {
        categoryName: "Dodatki",
        items: [
          {
            id: "pita",
            name: "Pita",
            description: "Świeżo wypiekana pita",
            price: "6 zł",
            image: "/images/menu/pita-bread-fresh.jpeg",
            allergens: [1],
          },
          {
            id: "basmati-rice",
            name: "Ryż Basmati",
            description: "Z pomidorami i aromatycznymi przyprawami",
            price: "10 zł",
            image: "/images/menu/basmati-rice.jpeg",
            allergens: [],
          },
          {
            id: "arabic-salad",
            name: "Sałatka Arabska",
            description: "Świeże warzywa z miętą, cytryną i oliwą",
            price: "12 zł",
            image: "/images/menu/arabic-salad.jpeg",
            allergens: [],
          },
          {
            id: "sumac-fries",
            name: "Frytki z Sumakiem",
            description: "Chrupiące frytki z aromatycznym sumakiem",
            price: "13 zł",
            image: "/images/menu/sumac-fries.jpeg",
            allergens: [],
          },
          {
            id: "ayran",
            name: "Ayran",
            description: "Orzeźwiający napój jogurtowy domowej roboty",
            price: "8 zł",
            image: "/images/menu/ayran-fresh.jpeg",
            allergens: [7],
          },
        ],
      },
      {
        categoryName: "Sosy",
        items: [
          {
            id: "toum",
            name: "Toum",
            description: "Kremowy sos czosnkowy",
            price: "6 zł",
            image: "/images/menu/toum-sauce.jpeg",
            allergens: [3],
          },
          {
            id: "pilpelchuma",
            name: "Pilpelchuma",
            description: "Pikantny sos z papryki",
            price: "6 zł",
            image: "/images/menu/pilpelchuma-sauce.jpeg",
            allergens: [],
          },
          {
            id: "harissa",
            name: "Harissa",
            description: "Ostra pasta z chili",
            price: "6 zł",
            image: "/images/menu/harissa-sauce.jpeg",
            allergens: [],
          },
          {
            id: "zhoug",
            name: "Zhoug",
            description: "Zielony sos z ziół i chili",
            price: "6 zł",
            image: "/images/menu/zhoug-sauce.jpeg",
            allergens: [],
          },
        ],
      },
    ],
  },
  {
    id: "napoje",
    sectionTitle: "Napoje",
    categories: [
      {
        categoryName: "Kawa i Herbata",
        items: [
          {
            id: "arabic-tea",
            name: "Herbata Arabska z Kardamonem",
            description: "Aromatyczna herbata z tradycyjnymi przyprawami",
            price: "8 zł",
            allergens: [],
          },
          {
            id: "autumn-tea",
            name: "Herbata Jesienna",
            description: "Herbata arabska, syrop z bzu, miód, woda z kwiatów pomarańczy",
            price: "18 zł",
          },
          {
            id: "autumn-coffee",
            name: "Kawa Jesienna",
            description: "Espresso, adriatico, syrop cynamonowy, mleko",
            price: "18 zł",
          },
          {
            id: "espresso",
            name: "Espresso",
            description: "Klasyczne espresso",
            price: "10 zł",
            allergens: [],
          },
          {
            id: "espresso-doppio",
            name: "Espresso Doppio",
            description: "Podwójne espresso",
            price: "12 zł",
            allergens: [],
          },
          {
            id: "americano",
            name: "Americano",
            description: "Espresso z gorącą wodą",
            price: "12 zł",
            allergens: [],
          },
          {
            id: "coffee-milk",
            name: "Kawa z Mlekiem",
            description: "Klasyczna kawa z mlekiem",
            price: "14 zł",
            allergens: [7],
          },
          {
            id: "cappuccino",
            name: "Cappuccino",
            description: "Espresso z spienioną pianką mleczną",
            price: "16 zł",
            allergens: [7],
          },
          {
            id: "flat-white",
            name: "Flat White",
            description: "Espresso z mikrospienioną pianką",
            price: "17 zł",
            allergens: [7],
          },
          {
            id: "caffe-latte",
            name: "Caffe Latte",
            description: "Espresso z dużą ilością mleka",
            price: "18 zł",
            allergens: [7],
          },
          {
            id: "iced-coffee",
            name: "Kawa Mrożona",
            description: "Orzeźwiająca kawa na lodzie",
            price: "18 zł",
            allergens: [7],
          },
          {
            id: "tonic-espresso",
            name: "Tonic Espresso",
            description: "Espresso z tonikiem",
            price: "18 zł",
            allergens: [],
          },
          {
            id: "seasonal-tea",
            name: "Herbata Sezonowa",
            description: "Zapytaj obsługę o dostępny smak",
            price: "18 zł",
          },
        ],
      },
      {
        categoryName: "Grzańce",
        items: [
          {
            id: "mulled-white-wine",
            name: "Grzaniec z Białym Winem",
            description: "Białe wino, syrop waniliowy, miód, korzenne przyprawy, pomarańcza",
            price: "25 zł",
          },
          {
            id: "mulled-red-wine",
            name: "Grzaniec z Czerwonym Winem",
            description: "Czerwone wino, sok pomarańczowy, syrop waniliowy, korzenne przyprawy, pomarańcza",
            price: "25 zł",
          },
          {
            id: "mulled-aperol",
            name: "Grzaniec z Aperolem",
            description: "Aperol, białe wino, sok jabłkowy, syrop brzoskwiniowy, korzenne przyprawy, pomarańcza",
            price: "28 zł",
          },
          {
            id: "mulled-nonalcoholic",
            name: "Grzaniec Bezalkoholowy",
            description: "Syrop ruby grape, sok z granatu, adriatico, korzenne przyprawy, pomarańcza",
            price: "29 zł",
          },
        ],
      },
      {
        categoryName: "Napoje Zimne",
        items: [
          {
            id: "water",
            name: "Woda",
            description: "Gazowana / niegazowana 0,3L",
            price: "5 zł",
            allergens: [],
          },
          {
            id: "flavored-water",
            name: "Woda z Miętą i Cytryną",
            description: "Gazowana / niegazowana 0,9L",
            price: "12 zł",
            allergens: [],
          },
          {
            id: "soft-drinks",
            name: "Cola / Cola Zero / Fanta / Sprite",
            description: "0,25L",
            price: "12 zł",
            allergens: [],
          },
          {
            id: "juice-small",
            name: "Sok",
            description: "Pomarańczowy / grejpfrutowy / jabłkowy 0,3L",
            price: "8 zł",
            allergens: [],
          },
          {
            id: "juice-large",
            name: "Sok",
            description: "Pomarańczowy / grejpfrutowy / mix 1L",
            price: "18 zł",
            allergens: [],
          },
          {
            id: "fresh-juice",
            name: "Sok Świeżo Wyciskany",
            description: "Pomarańczowy / grejpfrutowy / mix 0,3L",
            price: "22 zł",
            allergens: [],
          },
        ],
      },
      {
        categoryName: "Koktajle Bezalkoholowe",
        items: [
          {
            id: "jallab-lemonade",
            name: "Jallab Lemonade",
            description: "Jallab / prażone migdały / mięta / sok cytrynowy / woda gazowana",
            price: "25 zł",
            allergens: [8],
          },
          {
            id: "zatar-lemonade",
            name: "Zatar Lemonade",
            description: "Zatar / miód / sok z cytryny / woda gazowana",
            price: "25 zł",
            allergens: [],
          },
          {
            id: "basma-sour-lemonade",
            name: "Basma Sour Lemonade",
            description: "Sok z granatu / woda różana / sok z cytryny / mięta",
            price: "25 zł",
            allergens: [],
          },
          {
            id: "yaffa-lemonade",
            name: "Yaffa Lemonade",
            description: "Sok jabłkowy / sok z granatu / syrop cynamonowy / sok z cytryny",
            price: "25 zł",
          },
          {
            id: "milk-dactyl",
            name: "Milk Dactyl",
            description: "Napój owsiany / jallab / kardamon / cynamon",
            price: "25 zł",
            allergens: [1],
          },
          {
            id: "orange-spritz-free",
            name: "Orange Spritz Free",
            description: "Sprissetto / prosecco zero / woda gazowana / pomarańcza",
            price: "25 zł",
            allergens: [],
          },
          {
            id: "limoncello-free",
            name: "Limoncello Free",
            description: "Limoncello zero / prosecco zero / woda gazowana",
            price: "25 zł",
            allergens: [],
          },
          {
            id: "orange-rosemary",
            name: "Orange Rosemary",
            description: "Tonik / woda z kwiatów pomarańczy / rozmaryn / syrop cukrowy / sok z cytryny / woda gazowana",
            price: "25 zł",
            allergens: [],
          },
          {
            id: "amaretto-sour-na",
            name: "Amaretto Sour",
            description: "Adriatico / sok z cytryny / syrop cukrowy / białko",
            price: "25 zł",
            allergens: [3],
          },
        ],
      },
    ],
  },
  {
    id: "alkohole",
    sectionTitle: "Alkohole",
    categories: [
      {
        categoryName: "Piwo i Wino",
        items: [
          {
            id: "craft-beer",
            name: "Piwo Butelkowe",
            description: "Szeroki wybór piw kraftowych - zapytaj obsługę o aktualną ofertę",
            price: "20 zł",
            allergens: [1, 12],
          },
          {
            id: "house-wine-glass",
            name: "Wino Domowe - Kieliszek",
            description: "Wytrawne, białe/czerwone (150 ml)",
            price: "19 zł",
            allergens: [12],
          },
          {
            id: "house-wine-carafe-small",
            name: "Wino Domowe - Karafka 0,5L",
            description: "Wytrawne, białe/czerwone",
            price: "49 zł",
            allergens: [12],
          },
          {
            id: "house-wine-carafe-large",
            name: "Wino Domowe - Karafka 1L",
            description: "Wytrawne, białe/czerwone",
            price: "79 zł",
            allergens: [12],
          },
          {
            id: "prosecco-glass",
            name: "Prosecco",
            description: "150 ml",
            price: "19 zł",
            allergens: [12],
          },
          {
            id: "prosecco-free-glass",
            name: "Prosecco Free",
            description: "Kieliszek (150 ml)",
            price: "19 zł",
            allergens: [],
          },
        ],
        notes: "W ofercie posiadamy szeroki wybór win butelkowych - zapytaj obsługę o aktualną ofertę",
      },
      {
        categoryName: "Alkohole Mocne (40ml)",
        items: [
          {
            id: "vodka-distil",
            name: "Wódka Distil No.9",
            description: "Premium wódka",
            price: "12 zł",
            allergens: [],
          },
          {
            id: "vodka-ostoya",
            name: "Wódka Ostoya",
            description: "Polska wódka premium",
            price: "16 zł",
            allergens: [],
          },
          {
            id: "whisky-bushmills",
            name: "Whisky Bushmills Original",
            description: "Irlandzka whisky",
            price: "18 zł",
            allergens: [],
          },
          {
            id: "whisky-glenmoray-12",
            name: "Whisky Glenmoray Single Malt 12 YO",
            description: "Szkocka whisky single malt",
            price: "22 zł",
            allergens: [],
          },
          {
            id: "whisky-glenmoray-15",
            name: "Whisky Glenmoray Single Malt 15 YO",
            description: "Szkocka whisky single malt",
            price: "29 zł",
            allergens: [],
          },
          {
            id: "whisky-nikka",
            name: "Nikka Coffey Grain Whisky",
            description: "Japońska whisky",
            price: "35 zł",
            allergens: [],
          },
          {
            id: "rum-planteray",
            name: "Rum Planteray Dark",
            description: "Ciemny rum",
            price: "20 zł",
            allergens: [],
          },
          {
            id: "rum-kraken",
            name: "Kraken Black Spiced",
            description: "Korzenny rum",
            price: "24 zł",
            allergens: [],
          },
          {
            id: "gin-whitley",
            name: "Gin Whitley Neill Distiller's Cut London Dry",
            description: "London Dry Gin",
            price: "18 zł",
            allergens: [],
          },
          {
            id: "gin-bombay",
            name: "Bombay Sapphire London Dry",
            description: "Premium London Dry Gin",
            price: "24 zł",
            allergens: [],
          },
          {
            id: "gin-drumshanbo",
            name: "Drumshanbo Gunpowder Irish Citrus",
            description: "Irlandzki gin z cytrusami",
            price: "29 zł",
            allergens: [],
          },
          {
            id: "tequila-silver",
            name: "Jose Cuervo Silver",
            description: "Srebrna tequila",
            price: "16 zł",
            allergens: [],
          },
          {
            id: "tequila-reposado",
            name: "Jose Cuervo Reposado",
            description: "Leżakowana tequila",
            price: "16 zł",
            allergens: [],
          },
          {
            id: "cognac-gautier",
            name: "Cognac Gautier",
            description: "Francuski koniak",
            price: "26 zł",
            allergens: [],
          },
          {
            id: "cognac-hennessy",
            name: "Hennessy VS",
            description: "Premium koniak",
            price: "39 zł",
            allergens: [],
          },
        ],
      },
      {
        categoryName: "Koktajle",
        items: [
          {
            id: "porn-star-martini",
            name: "Porn Star Martini",
            description: "Distil No.9 / prosecco / puree marakuja / syrop waniliowy / sok z cytryny",
            price: "37 zł",
            allergens: [1, 12],
          },
          {
            id: "negroni",
            name: "Negroni",
            description: "Whitley Neill gin London dry / Martini rosso / Campari",
            price: "35 zł",
            allergens: [12],
          },
          {
            id: "arabian-nights-sour",
            name: "Arabian Nights Sour",
            description: "Bushmills original / wino czerwone / syrop cukrowy / białko / sok z cytryny / angostura",
            price: "35 zł",
            allergens: [3, 12],
          },
          {
            id: "aperol-spritz",
            name: "Aperol Spritz",
            description: "Aperol / prosecco / woda gazowana / pomarańcza",
            price: "35 zł",
            allergens: [12],
          },
          {
            id: "mojito",
            name: "Mojito",
            description: "Planteray dark / cukier trzcinowy / limonka / mięta / woda gazowana",
            price: "35 zł",
            allergens: [],
          },
          {
            id: "mango-frizz",
            name: "Mango Frizz",
            description: "Prosecco / syrop mango / woda z kwiatów pomarańczy / woda gazowana",
            price: "35 zł",
            allergens: [12],
          },
          {
            id: "sweet-sahara",
            name: "Sweet Sahara",
            description:
              "Likier melon / puree marakuja / woda z kwiatów pomarańczy / sok z cytryny / syrop cukrowy / białko",
            price: "35 zł",
            allergens: [3],
          },
          {
            id: "asmar",
            name: "Asmar",
            description:
              "Jagermeister / czerwone wino / sok jabłkowy / puree z gruszki / sok z cytryny / melasa z daktyli",
            price: "34 zł",
          },
          {
            id: "whisky-sour-basma",
            name: "Whisky Sour by BASMA",
            description: "Bushmills original / syrop z granatu / białko / angostura / sok z cytryny",
            price: "32 zł",
            allergens: [3],
          },
          {
            id: "saffron-rum",
            name: "Saffron Rum",
            description: "Planteray dark / szafran / syrop cukrowy / sok grejpfrutowy",
            price: "32 zł",
            allergens: [],
          },
          {
            id: "basma-martini",
            name: "Basma Martini",
            description: "Distil No.9 / puree lychee / sok z cytryny / syrop różany",
            price: "32 zł",
            allergens: [],
          },
          {
            id: "nour",
            name: "Nour",
            description: "Martini bianco / puree z gruszki / syrop waniliowy / kardamon",
            price: "29 zł",
          },
          {
            id: "ginger-girl",
            name: "Ginger Girl",
            description:
              "Whitley Neill gin London dry / woda z kwiatów pomarańczy / syrop waniliowy / sok z cytryny / imbir / woda gazowana",
            price: "29 zł",
            allergens: [12],
          },
        ],
      },
    ],
  },
]

export const specialOccasionsData: MenuCategory = {
  id: "specjalne-okazje",
  sectionTitle: "Menu na Specjalne Okazje",
  isPackageSection: true,
  packages: [
    {
      packageId: "party-box",
      packageName: "PARTY BOX (dla 4 osób)",
      packagePrice: "299 zł",
      packageImage: "/images/menu/party-box.jpg",
      categories: [
        {
          categoryName: "Zawartość Party Boxa",
          items: [
            { id: "pb-labneh-basma", name: "Labneh by BASMA", description: "", price: "", allergens: [7, 11] },
            { id: "pb-tabbouleh", name: "Tabbouleh", description: "", price: "", allergens: [1, 10] },
            { id: "pb-hummus", name: "Hummus", description: "", price: "", allergens: [11] },
            { id: "pb-olives", name: "Oliwki marynowane", description: "", price: "", allergens: [11] },
            { id: "pb-pickles", name: "Pikle", description: "", price: "", allergens: [10] },
            { id: "pb-hummus-bean", name: "Hummus z fasoli", description: "", price: "", allergens: [1, 11] },
            { id: "pb-tabbouleh-basma", name: "Tabbouleh by BASMA", description: "", price: "", allergens: [1, 8, 10] },
            { id: "pb-baba-ghanoush", name: "Baba Ghanoush", description: "", price: "", allergens: [7, 11] },
            { id: "pb-muhammara", name: "Muhammara", description: "", price: "", allergens: [8] },
            { id: "pb-fattoush", name: "Sałatka fattoush", description: "", price: "", allergens: [1, 7, 11] },
            { id: "pb-wrap-falafel", name: "Mini Wrapy z falafelem 4x", description: "", price: "", allergens: [1, 11] },
            { id: "pb-wrap-eggplant", name: "Mini Wrapy z bakłażanem 4x", description: "", price: "", allergens: [1, 11] },
            { id: "pb-simit-chicken", name: "Simit z kurczakiem taouk 4x", description: "", price: "", allergens: [1, 3, 7, 10, 11] },
            { id: "pb-bread-sticks", name: "Paluchy chlebowe 4x", description: "", price: "", allergens: [1] },
          ],
        },
      ],
    },
    {
      packageId: "package-1",
      packageName: "MEZZE & GRILL - PAKIET 1",
      packagePrice: "159 zł / osoba",
      packageDescription: "Cena: 159 ZŁ / OSOBA",
      categories: [
        {
          categoryName: "Przystawki (Serwowane z pitą, do wyboru 5)",
          items: [
            { id: "p1-hummus", name: "HUMMUS", description: "", price: "" },
            { id: "p1-tzatziki", name: "TZATZIKI", description: "", price: "" },
            { id: "p1-labneh", name: "LABNEH", description: "", price: "" },
            { id: "p1-labneh-sweet", name: "LABNEH NA SŁODKO", description: "", price: "" },
            { id: "p1-hummus-white-bean", name: "HUMMUS Z BIAŁEJ FASOLI", description: "", price: "" },
            { id: "p1-olives", name: "MARYNOWANE OLIWKI", description: "", price: "" },
            { id: "p1-tabbouleh", name: "TABBOULEH", description: "", price: "" },
            { id: "p1-grilled-pepper", name: "GRILLOWANA PAPRYKA NA LABNEH", description: "", price: "" },
            { id: "p1-labneh-basma", name: "LABNEH BY BASMA", description: "", price: "" },
            { id: "p1-muhammara", name: "MUHAMMARA", description: "", price: "" },
            { id: "p1-baba-ghanoush", name: "BABA GHANOUSH", description: "", price: "" },
            { id: "p1-whipped-feta", name: "UBIJANA FETA", description: "", price: "" },
          ],
        },
        {
          categoryName: "Zupa (Do wyboru 1)",
          items: [
            { id: "p1-soup-header-meat", name: "Mięsne:", description: "", price: "" },
            { id: "p1-shorbat-kibbeh", name: "SHORBAT KIBBEH", description: "Rosół wołowy z pulpecikami", price: "" },
            { id: "p1-harira", name: "HARIRA", description: "Zupa z wołowiną, cieciorką i pomidorami", price: "" },
            { id: "p1-hafira", name: "HAFIRA", description: "Arabska zupa z kurczakiem i ciecierzycą", price: "" },
            { id: "p1-soup-header-veg", name: "Wegetariańskie:", description: "", price: "" },
            { id: "p1-pumpkin-cream", name: "KREM DYNIOWY Z TAHINI I HARISSĄ", description: "", price: "" },
            { id: "p1-sweet-potato-cream", name: "KREM Z BATATA", description: "", price: "" },
          ],
        },
        {
          categoryName: "Dania (Do wyboru 1 mięsne lub 1 wegetariańskie na osobę)",
          items: [
            { id: "p1-main-header-meat", name: "Mięsne:", description: "", price: "" },
            { id: "p1-adana-kebab", name: "ADANA KEBAB", description: "Serwowany na picie, z ryżem, sałatką arabską i labneh", price: "" },
            { id: "p1-chicken-touk", name: "KURCZAK TOUK Z HARISSĄ", description: "Podawany z ryżem basmati z pomidorami lub frytkami z sumakiem, cytryną kiszoną oraz sałatką arabską lub mixem pikli", price: "" },
            { id: "p1-chicken-joojeh", name: "KURCZAK SHISH JOOJEH", description: "Podawany z ryżem basmati z pomidorami lub frytkami z sumakiem oraz z sałatką arabską lub mixem pikli", price: "" },
            { id: "p1-main-header-veg", name: "Wegetariańskie:", description: "", price: "" },
            { id: "p1-cauliflower", name: "KALAFIOR PANIEROWANY", description: "Polany sosem tahini i pilpelchuma, podawany z bulgurem z warzywami oraz piklowanym kalafiorem", price: "" },
            { id: "p1-grilled-aubergine", name: "GRILLOWANY BAKŁAŻAN", description: "Serwowany na hummusie z fasoli", price: "" },
          ],
        },
        {
          categoryName: "Deser",
          items: [
            { id: "p1-dubai-dream", name: "DUBAJSKI SEN", description: "Ciasto czekoladowe podane na chrupiącym kataifi, z gałką lodów pistacjowych i sosem czekoladowym", price: "" },
            { id: "p1-cheesecake", name: "SERNIK Z LABNEH", description: "Serwowany z melasą daktylową", price: "" },
            { id: "p1-date-cake", name: "CIASTO DAKTYLOWE", description: "Podawane ze śmietanką tahini, lodami waniliowymi i chipsem z ciasta filo", price: "" },
            { id: "p1-ice-cream-duo", name: "LODY DUO (PISTACJA, WANILIA)", description: "W polewie z belgijskiej czekolady, z konfiturą z pomarańczy i ciastem kataifi", price: "" },
          ],
        },
      ],
    },
    {
      packageId: "package-2",
      packageName: "MEZZE & GRILL - PAKIET 2",
      packagePrice: "299 zł / osoba",
      packageDescription: "Cena: 299 ZŁ / OSOBA",
      categories: [
        {
          categoryName: "Przystawki (Serwowane z pitą, do wyboru 7)",
          items: [
            { id: "p2-hummus", name: "HUMMUS", description: "", price: "" },
            { id: "p2-tzatziki", name: "TZATZIKI", description: "", price: "" },
            { id: "p2-labneh", name: "LABNEH", description: "", price: "" },
            { id: "p2-labneh-sweet", name: "LABNEH NA SŁODKO", description: "", price: "" },
            { id: "p2-hummus-white-bean", name: "HUMMUS Z BIAŁEJ FASOLI", description: "", price: "" },
            { id: "p2-olives", name: "MARYNOWANE OLIWKI", description: "", price: "" },
            { id: "p2-tabbouleh", name: "TABBOULEH", description: "", price: "" },
            { id: "p2-grilled-pepper", name: "GRILLOWANA PAPRYKA NA LABNEH", description: "", price: "" },
            { id: "p2-labneh-basma", name: "LABNEH BY BASMA", description: "", price: "" },
            { id: "p2-muhammara", name: "MUHAMMARA", description: "", price: "" },
            { id: "p2-baba-ghanoush", name: "BABA GHANOUSH", description: "", price: "" },
            { id: "p2-whipped-feta", name: "UBIJANA FETA", description: "", price: "" },
            { id: "p2-pita", name: "PITA", description: "", price: "" },
          ],
        },
        {
          categoryName: "Zupa (Do wyboru 1)",
          items: [
            { id: "p2-soup-header-meat", name: "Mięsne:", description: "", price: "" },
            { id: "p2-shorbat-kibbeh", name: "SHORBAT KIBBEH", description: "Rosół wołowy z pulpecikami", price: "" },
            { id: "p2-harira", name: "HARIRA", description: "Zupa z wołowiną, cieciorką i pomidorami", price: "" },
            { id: "p2-hafira", name: "HAFIRA", description: "Arabska zupa z kurczakiem i ciecierzycą", price: "" },
            { id: "p2-soup-header-veg", name: "Wegetariańskie:", description: "", price: "" },
            { id: "p2-pumpkin-cream", name: "KREM DYNIOWY Z TAHINI I HARISSĄ", description: "", price: "" },
            { id: "p2-sweet-potato-cream", name: "KREM Z BATATA", description: "", price: "" },
          ],
        },
        {
          categoryName: "Przystawka Serwowana (Do wyboru 1 mięsna lub 1 wegetariańska na osobę)",
          items: [
            { id: "p2-served-header-meat", name: "Mięsna:", description: "", price: "" },
            { id: "p2-carpaccio-beef", name: "CARPACCIO WOŁOWE", description: "Podawane z labneh, orzeszkami pini, okrą, oliwą ziołową i smażoną pitą", price: "" },
            { id: "p2-beef-tartare", name: "TATAR Z POLĘDWICY WOŁOWEJ", description: "Serwowany z żółtkiem, cebulą, piklowanym ogórkiem, skórką z cytryny i pomarańczy, labneh oraz smażoną pitą", price: "" },
            { id: "p2-served-header-veg", name: "Wegetariańska:", description: "", price: "" },
            { id: "p2-carpaccio-beet", name: "CARPACCIO Z PIECZONEGO W SOLI BURAKA", description: "Podawane z labneh, orzechową dukkah, melasą z granatu, miodem i ziołową sałatką", price: "" },
            { id: "p2-aubergine-rolls", name: "ROLADKI Z GRILLOWANEGO BAKŁAŻANA I RUKOLA", description: "Serwowane z labneh orzechowym z czosnkiem confit", price: "" },
          ],
        },
        {
          categoryName: "Dania (Do wyboru 1 mięsne lub 1 wegetariańskie na osobę)",
          items: [
            { id: "p2-main-header-meat", name: "Mięsne:", description: "", price: "" },
            { id: "p2-lamb-comber", name: "COMBER JAGNIĘCY", description: "Serwowany z ryżem oraz sałatką ziołową z fenkułem i granatem", price: "" },
            { id: "p2-beef-steak", name: "STEK Z POLĘDWICY WOŁOWEJ", description: "Podawany z ziemniakami latkes, szaszłykiem warzywnym, labneh i sosem zoug", price: "" },
            { id: "p2-meat-trio", name: "TRIO MIĘS (ADANA KEBAB, KOFTA JAGNIĘCA, KURCZAK)", description: "Podawane z pieczonym ziemniakiem z zatarem i sumakiem, oraz piklowaną kapustą i ogórkiem", price: "" },
            { id: "p2-main-header-veg", name: "Wegetariańskie:", description: "", price: "" },
            { id: "p2-cauliflower", name: "KALAFIOR PANIEROWANY", description: "Polany sosem tahini i pilpelchuma, podawany z bulgurem z warzywami oraz piklowanym kalafiorem", price: "" },
            { id: "p2-grilled-aubergine", name: "GRILLOWANY BAKŁAŻAN", description: "Serwowany na hummusie z fasoli", price: "" },
          ],
        },
        {
          categoryName: "Deser",
          items: [
            { id: "p2-dubai-dream", name: "DUBAJSKI SEN", description: "Ciasto czekoladowe podane na chrupiącym kataifi, z gałką lodów pistacjowych i sosem czekoladowym", price: "" },
            { id: "p2-cheesecake", name: "SERNIK Z LABNEH", description: "Serwowany z melasą daktylową", price: "" },
            { id: "p2-date-cake", name: "CIASTO DAKTYLOWE", description: "Podawane ze śmietanką tahini, lodami waniliowymi i chipsem z ciasta filo", price: "" },
            { id: "p2-ice-cream-duo", name: "LODY DUO (PISTACJA, WANILIA)", description: "W polewie z belgijskiej czekolady, z konfiturą z pomarańczy i ciastem kataifi", price: "" },
          ],
        },
      ],
    },
  ],
  categories: [
    {
      categoryName: "Napoje - Opcjonalny Pakiet Wybranych Napojów Bezalkoholowych",
      items: [
        { id: "drinks-soft", name: "Pakiet Napojów Bezalkoholowych", description: "Woda gazowana/niegazowana z miętą i cytryną - bez limitu • Lemoniada homemade - bez limitu • Cola 1L / Sprite 1L - bez limitu • Kawa / Herbata - bez limitu", price: "49 zł / osoba" },
      ],
    },
    {
      categoryName: "Napoje - Opcjonalny Pakiet Soft Open Bar",
      items: [
        { id: "drinks-soft-bar", name: "Pakiet Soft Open Bar", description: "Woda gazowana/niegazowana z miętą i cytryną - bez limitu • Lemoniada homemade - bez limitu • Cola 1L / Sprite 1L - bez limitu • Kawa / Herbata - bez limitu • Piwo rzemieślnicze - bez limitu • Wino domu białe / czerwone w karafkach - bez limitu", price: "139 zł / osoba" },
      ],
    },
    {
      categoryName: "Napoje - Opcjonalny Pakiet Open Bar",
      items: [
        { id: "drinks-open-bar", name: "Pakiet Open Bar", description: "Woda gazowana/niegazowana z miętą i cytryną - bez limitu • Lemoniada homemade - bez limitu • Cola 1L / Sprite 1L - bez limitu • Kawa / Herbata - bez limitu • Wszystkie alkohole - bez limitu", price: "249 zł / osoba" },
      ],
    },
    {
      categoryName: "Uwagi",
      items: [
        { id: "notes-deposit", name: "Zaliczka", description: "Warunkiem potwierdzenia rezerwacji jest wpłacenie zaliczki w kwocie 50% wartości zamówienia", price: "" },
        { id: "notes-service", name: "Opłata Serwisowa", description: "Do grup od 10 osób doliczamy opłatę za serwis w wysokości 10 zł/os netto (plus VAT 23%)", price: "" },
      ],
    },
  ],
}

export const allergenMap: { [key: number]: string } = {
  1: "Gluten",
  2: "Skorupiaki",
  3: "Jaja",
  4: "Ryby",
  5: "Orzeszki ziemne",
  6: "Soja",
  7: "Mleko",
  8: "Orzechy",
  9: "Seler",
  10: "Gorczyca",
  11: "Sezam",
  12: "Dwutlenek siarki",
  13: "Łubin",
  14: "Mięczaki",
}

// Helper function to get allergen names
export const getAllergenNames = (allergenNumbers: number[]): string[] => {
  return allergenNumbers.map((num) => allergenMap[num]).filter(Boolean)
}
