import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import Image from "next/image"
import { Phone, MapPin, Clock, Facebook, Instagram } from "lucide-react"

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
      { name: "Jajka po turecku", allergens: [1, 3, 7, 10, 11] },
      { name: "Jajecznica bliskowschodnia", allergens: [1, 3] },
      { name: "Sabich", allergens: [1, 3, 7, 11] },
      { name: "Kanapka arabska", allergens: [1, 3, 7, 10, 11] },
      { name: "Kanapka syryjska", allergens: [1, 3, 7, 10, 11] },
      { name: "Kanapka grecka", allergens: [1, 7, 10, 11] },
      { name: "Słodkie powitanie", allergens: [1, 7, 8, 11, 12] },
    ],
    "TALERZYKI MEZZE": [
      { name: "Falafel", allergens: [11] },
      { name: "Hummus", allergens: [11] },
      { name: "Kisir", allergens: [1, 8] },
      { name: "Tzatziki", allergens: [7] },
      { name: "Mix pikli", allergens: [10] },
      { name: "Labneh", allergens: [7, 11] },
      { name: "Labneh na słodko", allergens: [7, 8, 11] },
      { name: "Buraczki", allergens: [7, 8, 11] },
      { name: "Marynowane oliwki", allergens: [11] },
      { name: "Tabbouleh", allergens: [1, 10] },
      { name: "Tabbouleh by BASMA", allergens: [1, 8, 10] },
      { name: "Muhammara", allergens: [8] },
      { name: "Baba Ghanoush", allergens: [7, 11] },
      { name: "Ubijana feta", allergens: [7] },
      { name: "Grillowane marchewki", allergens: [7, 10] },
      { name: "Grillowana sałata rzymska", allergens: [1, 4, 7] },
    ],
    "TALERZE MEZZE": [
      { name: "BASMA", allergens: [1, 10, 11] },
      { name: "LIBAŃSKI", allergens: [1, 3, 4, 7, 10, 11] },
      { name: "ARABSKI", allergens: [1, 7, 8, 10, 11] },
      { name: "JEROZOLIMSKI", allergens: [1, 7, 8, 10, 11] },
      { name: "GRECKI", allergens: [1, 7, 10, 11] },
    ],
    GRILL: [
      { name: "Kurczak Joojeh", allergens: [7, 10] },
      { name: "Karmelowy kurczak by BASMA", allergens: [8, 11] },
      { name: "Kurczak Taouk", allergens: [7, 10] },
      { name: "Adana Kebab barani", allergens: [3, 10] },
      { name: "Kofty jagnięce", allergens: [7, 10] },
      { name: "Szarpana jagnięcina", allergens: [10, 11] },
      { name: "Lamb Chops", allergens: [7, 8, 10] },
      { name: "Talerz mięs dla dwóch osób", allergens: [1, 3, 7, 8, 10, 11] },
      { name: "Talerz mięs dla czterech osób", allergens: [1, 3, 7, 8, 10, 11] },
    ],
    "WEGE GRILL": [
      { name: "Bakłażan", allergens: [1, 7, 8, 10, 11] },
      { name: "Kalafior z labneh", allergens: [7, 8, 11] },
    ],
    SAŁATKI: [
      { name: "Grillowany fenkuł", allergens: [7, 8] },
      { name: "Fattoush", allergens: [1, 7, 11] },
    ],
    "DLA DZIECI": [{ name: "Chrupiące kawałki piersi kurczaka", allergens: [1, 3, 7] }],
    DESERY: [
      { name: "Baklawa", allergens: [1, 7, 8, 11] },
      { name: "Quatayf", allergens: [1, 7, 8, 11] },
      { name: "Dubajski sen", allergens: [1, 3, 7, 8] },
      { name: "Crème brûlée", allergens: [3, 7, 8] },
    ],
    DODATKI: [
      { name: "Pita", allergens: [1] },
      { name: "Ryż basmati", allergens: [] },
      { name: "Frytki z sumakiem", allergens: [] },
      { name: "Ayran", allergens: [7] },
    ],
    SOSY: [
      { name: "Toum", allergens: [3] },
      { name: "Pilpelchuma", allergens: [] },
      { name: "Harissa", allergens: [] },
      { name: "Zhoug", allergens: [] },
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
      { name: "Porn Star Martini", allergens: [1, 12] },
      { name: "Negroni", allergens: [12] },
      { name: "Arabian Nights Sour", allergens: [3, 12] },
      { name: "Aperol Spritz", allergens: [12] },
      { name: "Mojito", allergens: [] },
      { name: "Mango Frizz", allergens: [12] },
      { name: "Sweet Sahara", allergens: [3] },
      { name: "Whisky Sour by BASMA", allergens: [3] },
      { name: "Joshua Tree", allergens: [1] },
      { name: "Saffron Rum", allergens: [] },
      { name: "BASMA Martini", allergens: [] },
      { name: "Ginger Girl", allergens: [12] },
    ],
    "KOKTAJLE BEZALKOHOLOWE": [
      { name: "Jallab Lemonade", allergens: [8] },
      { name: "Zatar Lemonade", allergens: [] },
      { name: "BASMA Lemonade", allergens: [] },
      { name: "Milk Dactyl", allergens: [1] },
      { name: "Orange Spritz Free", allergens: [] },
      { name: "Limoncello Free", allergens: [] },
      { name: "Orange Rosemary", allergens: [] },
      { name: "Amaretto Sour", allergens: [3] },
    ],
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/basma-new-logo.png"
                alt="BASMA Restaurant"
                width={120}
                height={60}
                className="h-12 w-auto"
              />
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-[#BA9D76] transition-colors">
                Strona główna
              </Link>
              <Link href="/menu" className="text-gray-700 hover:text-[#BA9D76] transition-colors">
                Menu
              </Link>
              <Link href="/alergeny" className="text-[#BA9D76] font-medium">
                Alergeny
              </Link>
              <Link href="/faq" className="text-gray-700 hover:text-[#BA9D76] transition-colors">
                FAQ
              </Link>
              <Link href="/kariera" className="text-gray-700 hover:text-[#BA9D76] transition-colors">
                Kariera
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <div className="hidden lg:flex items-center text-sm text-gray-600">
                <Phone className="h-4 w-4 mr-1" />
                <span>+48 12 345 67 89</span>
              </div>
            </div>
          </div>
        </div>
      </header>

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

      {/* Footer */}
      <footer className="relative bg-gray-900 text-white">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: "url('/images/footer-bg-full.jpeg')",
          }}
        />
        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Logo and Description */}
            <div className="lg:col-span-2">
              <Image
                src="/images/basma-full-logo.png"
                alt="BASMA Restaurant"
                width={200}
                height={100}
                className="h-16 w-auto mb-4"
              />
              <p className="text-gray-300 mb-6 max-w-md">
                Odkryj autentyczne smaki Bliskiego Wschodu w sercu miasta. BASMA to miejsce, gdzie tradycja spotyka się
                z nowoczesnością.
              </p>
              <div className="flex space-x-4">
                <Link href="#" className="text-gray-300 hover:text-[#BA9D76] transition-colors">
                  <Facebook className="h-6 w-6" />
                </Link>
                <Link href="#" className="text-gray-300 hover:text-[#BA9D76] transition-colors">
                  <Instagram className="h-6 w-6" />
                </Link>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-[#BA9D76]">Kontakt</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-2 mt-0.5 text-[#BA9D76]" />
                  <div>
                    <p className="text-gray-300">ul. Przykładowa 123</p>
                    <p className="text-gray-300">31-000 Kraków</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 mr-2 text-[#BA9D76]" />
                  <p className="text-gray-300">+48 12 345 67 89</p>
                </div>
              </div>
            </div>

            {/* Opening Hours */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-[#BA9D76]">Godziny otwarcia</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-[#BA9D76]" />
                  <div>
                    <p className="text-gray-300 text-sm">Pon-Czw: 12:00-23:00</p>
                    <p className="text-gray-300 text-sm">Pt: 12:00-00:00</p>
                    <p className="text-gray-300 text-sm">Sob: 10:00-00:00</p>
                    <p className="text-gray-300 text-sm">Nie: 10:00-23:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">© 2024 BASMA Restaurant. Wszystkie prawa zastrzeżone.</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <Link href="/regulamin" className="text-gray-400 hover:text-[#BA9D76] text-sm transition-colors">
                  Regulamin
                </Link>
                <Link
                  href="/polityka-prywatnosci"
                  className="text-gray-400 hover:text-[#BA9D76] text-sm transition-colors"
                >
                  Polityka prywatności
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
