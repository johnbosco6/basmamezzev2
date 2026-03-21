import { MainNavbar } from "@/components/main-navbar"
import { MainFooter } from "@/components/main-footer"
import { Archivo } from "next/font/google"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["200", "400", "600", "700"],
  display: "swap",
})

export default function PolitykaPrywatnosciPage() {
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

      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className={`text-4xl md:text-5xl font-semibold mb-6 text-white drop-shadow-lg ${archivo.className}`}>
              Polityka Prywatności
            </h1>
            <p className={`text-xl text-white/90 drop-shadow-md font-light ${archivo.className}`}>
              Informacje o przetwarzaniu danych osobowych w restauracji Basma Mezze & Grill
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="backdrop-blur-lg bg-white/10 border border-[#BA9D76]/20 shadow-xl">
            <CardHeader>
              <CardTitle className={`text-2xl text-white ${archivo.className}`}>Polityka Prywatności</CardTitle>
              <p className="text-white/80 text-sm">Ostatnia aktualizacja: {new Date().toLocaleDateString("pl-PL")}</p>
            </CardHeader>
            <CardContent className="space-y-8 text-white/90">
              <section>
                <h2 className={`text-xl font-semibold mb-4 text-[#BA9D76] ${archivo.className}`}>
                  1. Administrator danych
                </h2>
                <div className={`space-y-3 text-sm leading-relaxed font-light ${archivo.className}`}>
                  <p>
                    Administratorem Państwa danych osobowych jest restauracja Basma Mezze & Grill z siedzibą przy ul.
                    Krakowskie Przedmieście 3, 20-002 Lublin.
                  </p>
                  <p>Kontakt z administratorem: basmalublin@gmail.com, tel. +48 574 933 988</p>
                </div>
              </section>

              <section>
                <h2 className={`text-xl font-semibold mb-4 text-[#BA9D76] ${archivo.className}`}>
                  2. Podstawa prawna przetwarzania
                </h2>
                <div className={`space-y-3 text-sm leading-relaxed font-light ${archivo.className}`}>
                  <p>Przetwarzamy Państwa dane osobowe na podstawie:</p>
                  <ul className="ml-6 space-y-1">
                    <li>• Art. 6 ust. 1 lit. b RODO - wykonanie umowy (realizacja zamówienia, rezerwacja)</li>
                    <li>• Art. 6 ust. 1 lit. c RODO - wypełnienie obowiązku prawnego (dokumentacja księgowa)</li>
                    <li>• Art. 6 ust. 1 lit. f RODO - prawnie uzasadniony interes (marketing, bezpieczeństwo)</li>
                    <li>• Art. 6 ust. 1 lit. a RODO - zgoda (newsletter, marketing)</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className={`text-xl font-semibold mb-4 text-[#BA9D76] ${archivo.className}`}>
                  3. Cele przetwarzania danych
                </h2>
                <div className={`space-y-3 text-sm leading-relaxed font-light ${archivo.className}`}>
                  <p>Przetwarzamy dane osobowe w następujących celach:</p>
                  <ul className="ml-6 space-y-1">
                    <li>• Realizacja zamówień i świadczenie usług gastronomicznych</li>
                    <li>• Obsługa rezerwacji stolików</li>
                    <li>• Wystawienie dokumentów księgowych (paragon, faktura)</li>
                    <li>• Kontakt z klientami</li>
                    <li>• Wysyłka newslettera (za zgodą)</li>
                    <li>• Zapewnienie bezpieczeństwa (monitoring)</li>
                    <li>• Rozpatrywanie reklamacji</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className={`text-xl font-semibold mb-4 text-[#BA9D76] ${archivo.className}`}>
                  4. Kategorie przetwarzanych danych
                </h2>
                <div className={`space-y-3 text-sm leading-relaxed font-light ${archivo.className}`}>
                  <p>Przetwarzamy następujące kategorie danych osobowych:</p>
                  <ul className="ml-6 space-y-1">
                    <li>• Dane identyfikacyjne (imię, nazwisko)</li>
                    <li>• Dane kontaktowe (numer telefonu, adres e-mail)</li>
                    <li>• Dane dotyczące preferencji żywieniowych i alergii</li>
                    <li>• Dane z monitoringu (wizerunek)</li>
                    <li>• Dane dotyczące zamówień i historii wizyt</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className={`text-xl font-semibold mb-4 text-[#BA9D76] ${archivo.className}`}>
                  5. Okres przechowywania danych
                </h2>
                <div className={`space-y-3 text-sm leading-relaxed font-light ${archivo.className}`}>
                  <p>Dane osobowe przechowujemy przez okres:</p>
                  <ul className="ml-6 space-y-1">
                    <li>• Dokumenty księgowe - 5 lat od końca roku podatkowego</li>
                    <li>• Dane do kontaktu - do momentu wycofania zgody lub sprzeciwu</li>
                    <li>• Nagrania z monitoringu - 30 dni</li>
                    <li>• Dane dotyczące reklamacji - do czasu przedawnienia roszczeń</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className={`text-xl font-semibold mb-4 text-[#BA9D76] ${archivo.className}`}>6. Odbiorcy danych</h2>
                <div className={`space-y-3 text-sm leading-relaxed font-light ${archivo.className}`}>
                  <p>Dane osobowe mogą być przekazywane:</p>
                  <ul className="ml-6 space-y-1">
                    <li>• Biuru rachunkowemu</li>
                    <li>• Firmom świadczącym usługi IT</li>
                    <li>• Organom państwowym (na żądanie)</li>
                    <li>• Dostawcom systemów płatności</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className={`text-xl font-semibold mb-4 text-[#BA9D76] ${archivo.className}`}>
                  7. Prawa osób, których dane dotyczą
                </h2>
                <div className={`space-y-3 text-sm leading-relaxed font-light ${archivo.className}`}>
                  <p>Przysługują Państwu następujące prawa:</p>
                  <ul className="ml-6 space-y-1">
                    <li>• Prawo dostępu do danych</li>
                    <li>• Prawo do sprostowania danych</li>
                    <li>• Prawo do usunięcia danych</li>
                    <li>• Prawo do ograniczenia przetwarzania</li>
                    <li>• Prawo do przenoszenia danych</li>
                    <li>• Prawo sprzeciwu wobec przetwarzania</li>
                    <li>• Prawo do wycofania zgody</li>
                    <li>• Prawo do wniesienia skargi do UODO</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className={`text-xl font-semibold mb-4 text-[#BA9D76] ${archivo.className}`}>
                  8. Pliki cookies - szczegółowe informacje
                </h2>
                <div className="space-y-4 text-sm leading-relaxed">
                  <p className={`font-light ${archivo.className}`}>
                    Nasza strona internetowa wykorzystuje pliki cookies w celu:
                  </p>
                  <ul className="ml-6 space-y-1">
                    <li>• Zapewnienia prawidłowego funkcjonowania strony</li>
                    <li>• Analizy ruchu na stronie</li>
                    <li>• Personalizacji treści</li>
                    <li>• Zapamiętywania preferencji użytkownika</li>
                  </ul>

                  <div className="mt-6 space-y-4">
                    <h3 className={`text-lg font-semibold text-[#BA9D76] ${archivo.className}`}>
                      Rodzaje plików cookies:
                    </h3>

                    <div className="bg-[#BA9D76]/10 p-4 rounded-lg border border-[#BA9D76]/20">
                      <h4 className={`font-semibold text-white mb-2 ${archivo.className}`}>Niezbędne pliki cookies</h4>
                      <p className={`text-white/80 text-sm mb-2 font-light ${archivo.className}`}>
                        Te pliki są niezbędne do prawidłowego funkcjonowania strony i nie można ich wyłączyć.
                      </p>
                      <ul className="text-xs text-white/70 ml-4 space-y-1">
                        <li>• Sesja użytkownika</li>
                        <li>• Preferencje językowe</li>
                        <li>• Bezpieczeństwo i uwierzytelnianie</li>
                        <li>• Funkcjonalność formularzy</li>
                      </ul>
                    </div>

                    <div className="bg-[#BA9D76]/10 p-4 rounded-lg border border-[#BA9D76]/20">
                      <h4 className={`font-semibold text-white mb-2 ${archivo.className}`}>
                        Analityczne pliki cookies
                      </h4>
                      <p className={`text-white/80 text-sm mb-2 font-light ${archivo.className}`}>
                        Pomagają nam zrozumieć, jak odwiedzający korzystają z naszej strony.
                      </p>
                      <ul className="text-xs text-white/70 ml-4 space-y-1">
                        <li>• Google Analytics (_ga, _gid, _gat)</li>
                        <li>• Statystyki odwiedzin</li>
                        <li>• Analiza zachowań użytkowników</li>
                        <li>• Optymalizacja wydajności strony</li>
                      </ul>
                    </div>

                    <div className="bg-[#BA9D76]/10 p-4 rounded-lg border border-[#BA9D76]/20">
                      <h4 className={`font-semibold text-white mb-2 ${archivo.className}`}>
                        Marketingowe pliki cookies
                      </h4>
                      <p className={`text-white/80 text-sm mb-2 font-light ${archivo.className}`}>
                        Służą do wyświetlania spersonalizowanych reklam i treści.
                      </p>
                      <ul className="text-xs text-white/70 ml-4 space-y-1">
                        <li>• Facebook Pixel</li>
                        <li>• Google Ads</li>
                        <li>• Remarketing</li>
                        <li>• Personalizacja reklam</li>
                      </ul>
                    </div>

                    <div className="bg-[#BA9D76]/10 p-4 rounded-lg border border-[#BA9D76]/20">
                      <h4 className={`font-semibold text-white mb-2 ${archivo.className}`}>
                        Funkcjonalne pliki cookies
                      </h4>
                      <p className={`text-white/80 text-sm mb-2 font-light ${archivo.className}`}>
                        Umożliwiają zapamiętywanie preferencji i ustawień.
                      </p>
                      <ul className="text-xs text-white/70 ml-4 space-y-1">
                        <li>• Preferencje językowe</li>
                        <li>• Ustawienia motywu</li>
                        <li>• Zapamiętane formularze</li>
                        <li>• Personalizacja interfejsu</li>
                      </ul>
                    </div>
                  </div>

                  <p className={`mt-4 font-light ${archivo.className}`}>
                    Można zarządzać plikami cookies poprzez ustawienia przeglądarki internetowej lub korzystając z
                    naszego centrum preferencji cookies dostępnego na stronie.
                  </p>
                </div>
              </section>

              <section>
                <h2 className={`text-xl font-semibold mb-4 text-[#BA9D76] ${archivo.className}`}>
                  9. Bezpieczeństwo danych
                </h2>
                <div className={`space-y-3 text-sm leading-relaxed font-light ${archivo.className}`}>
                  <p>Stosujemy odpowiednie środki techniczne i organizacyjne w celu ochrony danych osobowych przed:</p>
                  <ul className="ml-6 space-y-1">
                    <li>• Nieuprawnionym dostępem</li>
                    <li>• Przypadkową utratą</li>
                    <li>• Zniszczeniem lub uszkodzeniem</li>
                    <li>• Nieuprawnionym ujawnieniem lub przekazaniem</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className={`text-xl font-semibold mb-4 text-[#BA9D76] ${archivo.className}`}>
                  10. Zmiany w polityce prywatności
                </h2>
                <div className={`space-y-3 text-sm leading-relaxed font-light ${archivo.className}`}>
                  <p>
                    Zastrzegamy sobie prawo do wprowadzania zmian w niniejszej polityce prywatności. O wszelkich
                    istotnych zmianach będziemy informować poprzez publikację zaktualizowanej wersji na naszej stronie
                    internetowej.
                  </p>
                </div>
              </section>

              <div className="mt-8 p-4 bg-[#BA9D76]/20 rounded-lg border border-[#BA9D76]/30">
                <p className={`text-sm text-white/90 font-light ${archivo.className}`}>
                  <strong>Kontakt w sprawach ochrony danych:</strong>
                  <br />
                  Email: basmalublin@gmail.com
                  <br />
                  Tel: +48 574 933 988
                  <br />
                  Adres: Krakowskie Przedmieście 3, 20-002 Lublin
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <MainFooter />
    </div>
  )
}
