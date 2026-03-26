import { MainNavbar } from "@/components/main-navbar"
import { MainFooter } from "@/components/main-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Archivo } from "next/font/google"

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["200", "400", "600", "700"],
  display: "swap",
})

export default function AlergenyPage() {
  const allergenList = [
    { number: 1, name: "GLUTEN" },
    { number: 2, name: "SKORUPIAKI i produkty pochodne" },
    { number: 3, name: "JAJA i produkty pochodne" },
    { number: 4, name: "RYBY i produkty pochodne" },
    { number: 5, name: "ORZESZKI ZIEMNE (arachidowe) i produkty pochodne" },
    { number: 6, name: "SOJA i produkty pochodne" },
    { number: 7, name: "MLEKO i produkty pochodne (łącznie z laktozą)" },
    { number: 8, name: "ORZECHY" },
    { number: 9, name: "SELER i produkty pochodne" },
    { number: 10, name: "GORCZYCA i produkty pochodne" },
    { number: 11, name: "NASIONA SEZAMU i produkty pochodne" },
    { number: 12, name: "DWUTLENEK SIARKI" },
    { number: 13, name: "ŁUBIN i produkty pochodne" },
    { number: 14, name: "MIĘCZAKI i produkty pochodne" },
  ]

  const menuAllergens = {
    ŚNIADANIA: [
      { name: "Szakszuka z grillowaną koftą jagnięcą", allergens: [1, 3, 7, 10, 11] },
      { name: "Szakszuka z falafelem", allergens: [1, 3, 7, 10, 11] },
      { name: "Sabich", allergens: [1, 3, 7, 10, 11] },
      { name: "Jajka po turecku", allergens: [1, 3, 7, 10, 11] },
      { name: "Kanapka Syryjska", allergens: [1, 7, 10, 11] },
      { name: "Kanapka Arabska", allergens: [1, 3, 11] },
      { name: "Kanapka Grecka", allergens: [1, 7, 10, 11, 12] },
    ],
    "TALERZYKI MEZZE": [
      { name: "Falafel", allergens: [11] },
      { name: "Hummus", allergens: [11] },
      { name: "Mix Pikli", allergens: [10, 12] },
      { name: "Tzatziki", allergens: [7] },
      { name: "Marynowane oliwki", allergens: [11] },
      { name: "Labneh", allergens: [7, 11] },
      { name: "Labneh na słodko", allergens: [7, 8, 11, 12] },
      { name: "Tabbouleh", allergens: [1, 10] },
      { name: "Tabbouleh by BASMA", allergens: [1, 8, 10, 12] },
      { name: "Muhammara", allergens: [8] },
      { name: "Baba ghanoush", allergens: [7, 11] },
      { name: "Grillowana papryka na labneh", allergens: [7, 11] },
      { name: "Ubijana feta", allergens: [7] },
      { name: "Labneh miętowy", allergens: [7] },
      { name: "Hummus biała fasola", allergens: [7, 11] },
      { name: "Kibbeh", allergens: [1, 8] },
      { name: "Labneh by Basma", allergens: [7, 11] },
    ],
    "TALERZE MEZZE": [
      { name: "BASMA", allergens: [1, 7, 10, 11, 12] },
      { name: "LIBAŃSKI", allergens: [1, 3, 7, 8, 10, 11, 12] },
      { name: "ARABSKI", allergens: [1, 7, 10, 11, 12] },
      { name: "JEROZOLIMSKI", allergens: [1, 7, 8, 10, 11, 12] },
      { name: "GRECKI", allergens: [1, 7, 10, 11, 12] },
      { name: "WEGAŃSKI", allergens: [1, 8, 10, 11, 12] },
    ],
    GRILL: [
      { name: "Kurczak Shish Joojeh", allergens: [7, 10] },
      { name: "Karmelowy kurczak by BASMA", allergens: [8, 11] },
      { name: "Kurczak Shish Taouk", allergens: [7, 10] },
      { name: "Adana Kebab", allergens: [3, 10, 12] },
      { name: "Kofty Jagnięce", allergens: [7, 10, 12] },
      { name: "Lamb Chops", allergens: [7, 8, 10, 12] },
      { name: "Talerz mięs dla dwóch/czterech osób", allergens: [1, 3, 7, 8, 10, 11, 12] },
    ],
    "WEGE GRILL": [
      { name: "KALAFIOR", allergens: [7, 8, 11] },
      { name: "BAKŁAŻAN", allergens: [7, 11] },
      { name: "HALLOUMI", allergens: [7, 8, 12] },
    ],
    SAŁATKI: [
      { name: "FATTOUSH", allergens: [1, 7, 11] },
      { name: "GRECKA", allergens: [1, 7] },
      { name: "HALLOUMI", allergens: [1, 7] },
    ],
    "DLA DZIECI": [{ name: "TALERZ ODKRYWCY", allergens: [1, 3, 7] }],
    DESERY: [
      { name: "SEKERPARE", allergens: [1, 8] },
      { name: "SERNIK", allergens: [7] },
      { name: "CREME BRULEE", allergens: [3, 7] },
      { name: "SZARLOTKA", allergens: [1, 7, 11] },
    ],
    DODATKI: [
      { name: "Pita", allergens: [1] },
      { name: "Ryż BASMATI", allergens: [1] },
      { name: "Frytki z sumakiem", allergens: [1] },
      { name: "Ayran", allergens: [7] },
    ],
    SOSY: [
      { name: "TOUM", allergens: [3] },
      { name: "PILPELHUMA", allergens: [] },
      { name: "HARISSA", allergens: [] },
      { name: "ZHOUG", allergens: [] },
      { name: "BASMA", allergens: [3] },
    ],
    NAPOJE: [
      { name: "Kawa z mlekiem", allergens: [7] },
      { name: "Cappuccino", allergens: [7] },
      { name: "Flat white", allergens: [7] },
      { name: "Caffè Latte", allergens: [7] },
      { name: "Kawa mrożona", allergens: [7] },
      { name: "Piwo butelkowe", allergens: [1, 12] },
      { name: "Wino domowe", allergens: [12] },
      { name: "Wino butelkowe", allergens: [12] },
    ],
    KOKTAJLE: [
      { name: "Porn Star Martini", allergens: [12] },
      { name: "Negroni", allergens: [12] },
      { name: "Arabian Nights Sour", allergens: [3, 12] },
      { name: "Aperol Spritz", allergens: [12] },
      { name: "Mojito", allergens: [12] },
      { name: "Mango Frizz", allergens: [12] },
      { name: "Sweet Sahara", allergens: [3, 12] },
      { name: "Asmar", allergens: [12] },
      { name: "Whisky Sour by BASMA", allergens: [3, 12] },
      { name: "Basma Martini", allergens: [12] },
      { name: "Ginger Girl", allergens: [12] },
      { name: "Nour", allergens: [12] },
    ],
    "KOKTAJLE BEZALKOHOLOWE": [
      { name: "Jallab Lemonade", allergens: [8, 12] },
      { name: "Basma Sour Lemonade", allergens: [1, 12] },
      { name: "Milk Dactyl", allergens: [1] },
      { name: "Orange Spritz Free", allergens: [12] },
      { name: "Limoncello Free", allergens: [12] },
      { name: "Orange Rosemary", allergens: [12] },
      { name: "Amaretto Sour", allergens: [3, 12] },
    ],
    "PARTY BOX": [
      { name: "Labneh by BASMA", allergens: [7, 11] },
      { name: "Tabbouleh", allergens: [1, 10] },
      { name: "Hummus", allergens: [11] },
      { name: "Oliwki marynowane", allergens: [11] },
      { name: "Pikle", allergens: [10] },
      { name: "Hummus z fasoli", allergens: [1, 11] },
      { name: "Tabbouleh by BASMA", allergens: [1, 8, 10] },
      { name: "Baba Ghanoush", allergens: [7, 11] },
      { name: "Muhammara", allergens: [8] },
      { name: "Sałatka fattoush", allergens: [1, 7, 11] },
      { name: "Mini Wrapy z falafelem", allergens: [1, 11] },
      { name: "Mini Wrapy z bakłażanem", allergens: [1, 11] },
      { name: "Simit z kurczakiem taouk", allergens: [1, 3, 7, 10, 11] },
      { name: "Paluchy chlebowe", allergens: [1] },
    ],
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#597FB1] via-[#326096] to-[#2B2B2B] text-white">
      <MainNavbar />

      {/* Back Navigation */}
      <div className="container mx-auto px-4 pt-6 relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/70 hover:text-[#BA9D76] transition-colors duration-300 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className={`text-sm font-light ${archivo.className}`}>Wróć na stronę główną</span>
        </Link>
      </div>

      {/* Main Content */}
      <main className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-[#BA9D76] mb-4">Informacje o Alergenach</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Poniżej znajdziesz szczegółowe informacje o alergenach zawartych w naszych daniach. Jeśli masz
              jakiekolwiek pytania dotyczące składników, skontaktuj się z naszą obsługą.
            </p>
          </div>

          {/* Allergen Legend */}
          <Card className="mb-8 shadow-lg border-[#BA9D76]/20">
            <CardHeader className="bg-gradient-to-r from-[#BA9D76]/10 to-[#597FB1]/10">
              <CardTitle className="text-2xl text-[#BA9D76] text-center">Wykaz Alergenów</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allergenList.map((allergen) => (
                  <div key={allergen.number} className="flex items-center space-x-3">
                    <Badge variant="outline" className="min-w-[2rem] justify-center border-[#BA9D76] text-[#BA9D76]">
                      {allergen.number}
                    </Badge>
                    <span className="text-sm text-gray-700">{allergen.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Menu Categories with Allergens */}
          <div className="grid gap-6">
            {Object.entries(menuAllergens).map(([category, items]) => (
              <Card key={category} className="shadow-lg border-[#BA9D76]/20">
                <CardHeader className="bg-gradient-to-r from-[#BA9D76]/5 to-[#597FB1]/5">
                  <CardTitle className="text-xl text-[#BA9D76]">{category}</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {items.map((item, index) => (
                      <div key={index}>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-medium text-gray-800 flex-1">{item.name}</span>
                          <div className="flex flex-wrap gap-1">
                            {item.allergens.length > 0 ? (
                              item.allergens.map((allergenNum) => (
                                <Badge
                                  key={allergenNum}
                                  variant="secondary"
                                  className="bg-[#BA9D76]/10 text-[#BA9D76] hover:bg-[#BA9D76]/20 border-[#BA9D76]/30"
                                >
                                  {allergenNum}
                                </Badge>
                              ))
                            ) : (
                              <Badge variant="outline" className="text-green-600 border-green-600">
                                Brak alergenów
                              </Badge>
                            )}
                          </div>
                        </div>
                        {index < items.length - 1 && <Separator className="mt-4 border-gray-200" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Card className="bg-gradient-to-r from-[#BA9D76]/5 to-[#597FB1]/5 border-[#BA9D76]/20">
              <CardContent className="pt-6">
                <p className="text-[#BA9D76] font-medium mb-2">Ważne informacje</p>
                <p className="text-sm text-gray-600">
                  Wszystkie nasze dania są przygotowywane w kuchni, gdzie używane są różne alergeny. Jeśli masz poważne
                  alergie pokarmowe, poinformuj o tym naszą obsługę przed złożeniem zamówienia.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <MainFooter />
    </div>
  )
}
