import Link from "next/link"
import { ArrowLeft, Home, BookOpen, MessageCircle } from "lucide-react"
import { Archivo } from "next/font/google"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["200", "400", "600", "700"],
  display: "swap",
})

export default function RegulaminPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#597FB1] via-[#326096] to-[#2B2B2B] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#597FB1]/80 border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex-1 flex justify-start">
            <Link href="/">
              <Button variant="ghost" className="text-white hover:text-[#BA9D76] hover:bg-white/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Powrót
              </Button>
            </Link>
          </div>
          <nav className="flex-1 flex items-center justify-center gap-8 backdrop-blur-md bg-white/15 border border-white/25 rounded-full px-6 py-3 shadow-lg">
            <Link
              href="/"
              className="flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/20 hover:shadow-lg text-white/80 hover:text-[#BA9D76] group"
            >
              <Home className="h-5 w-5 transition-colors duration-300" />
              <span className={`text-xs font-light ${archivo.className}`}>Dom</span>
            </Link>
            <Link
              href="/menu"
              className="flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/20 hover:shadow-lg text-white/80 hover:text-[#BA9D76] group"
            >
              <BookOpen className="h-5 w-5 transition-colors duration-300" />
              <span className={`text-xs font-light ${archivo.className}`}>Menu</span>
            </Link>
            <Link
              href="/#contact"
              className="flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/20 hover:shadow-lg text-white/80 hover:text-[#BA9D76] group"
            >
              <MessageCircle className="h-5 w-5 transition-colors duration-300" />
              <span className={`text-xs font-light ${archivo.className}`}>Kontakt</span>
            </Link>
          </nav>
          <div className="flex-1 flex justify-end"></div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#2B2B2B]/60 via-[#326096]/40 to-[#2B2B2B]/60"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className={`text-4xl md:text-5xl font-semibold mb-6 text-white drop-shadow-lg ${archivo.className}`}>
              Regulamin
            </h1>
            <p className={`text-xl text-white/90 drop-shadow-md font-light ${archivo.className}`}>
              Zasady korzystania z usług restauracji Basma Mezze & Grill
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="backdrop-blur-lg bg-white/10 border border-[#BA9D76]/20 shadow-xl">
            <CardHeader>
              <CardTitle className={`text-2xl text-white ${archivo.className}`}>
                Regulamin Restauracji Basma Mezze & Grill
              </CardTitle>
              <p className="text-white/80 text-sm">Ostatnia aktualizacja: {new Date().toLocaleDateString("pl-PL")}</p>
            </CardHeader>
            <CardContent className="space-y-8 text-white/90">
              <section>
                <h2 className={`text-xl font-semibold mb-4 text-[#BA9D76] ${archivo.className}`}>
                  §1. Postanowienia ogólne
                </h2>
                <div className="space-y-3 text-sm leading-relaxed font-light">
                  <p className={`font-light ${archivo.className}`}>
                    1. Niniejszy regulamin określa zasady korzystania z usług świadczonych przez restaurację Basma Mezze
                    & Grill, zwaną dalej "Restauracją".
                  </p>
                  <p className={`font-light ${archivo.className}`}>
                    2. Restauracja mieści się przy ul. Krakowskie Przedmieście 3, 20-002 Lublin.
                  </p>
                  <p className={`font-light ${archivo.className}`}>
                    3. Korzystanie z usług Restauracji oznacza akceptację niniejszego regulaminu.
                  </p>
                </div>
              </section>

              <section>
                <h2 className={`text-xl font-semibold mb-4 text-[#BA9D76] ${archivo.className}`}>
                  §2. Godziny otwarcia
                </h2>
                <div className="space-y-3 text-sm leading-relaxed font-light">
                  <p className={`font-light ${archivo.className}`}>1. Restauracja jest czynna:</p>
                  <ul className="ml-6 space-y-1">
                    <li className={`font-light ${archivo.className}`}>• Poniedziałek - Czwartek: 12:00 - 23:00</li>
                    <li className={`font-light ${archivo.className}`}>• Piątek: 12:00 - 00:00</li>
                    <li className={`font-light ${archivo.className}`}>• Sobota: 10:00 - 00:00</li>
                    <li className={`font-light ${archivo.className}`}>• Niedziela: 10:00 - 23:00</li>
                  </ul>
                  <p className={`font-light ${archivo.className}`}>
                    2. Restauracja zastrzega sobie prawo do zmiany godzin otwarcia w dni świąteczne.
                  </p>
                </div>
              </section>

              <section>
                <h2 className={`text-xl font-semibold mb-4 text-[#BA9D76] ${archivo.className}`}>§3. Rezerwacje</h2>
                <div className="space-y-3 text-sm leading-relaxed font-light">
                  <p className={`font-light ${archivo.className}`}>
                    1. Rezerwacji stolików można dokonać telefonicznie pod numerem +48 574 933 988 lub osobiście w
                    Restauracji.
                  </p>
                  <p className={`font-light ${archivo.className}`}>
                    2. Rezerwacja jest ważna przez 15 minut od umówionej godziny, po tym czasie stolik może zostać
                    udostępniony innym gościom.
                  </p>
                  <p className={`font-light ${archivo.className}`}>
                    3. W przypadku niemożności przybycia prosimy o wcześniejsze anulowanie rezerwacji.
                  </p>
                </div>
              </section>

              <section>
                <h2 className={`text-xl font-semibold mb-4 text-[#BA9D76] ${archivo.className}`}>
                  §4. Zasady zachowania
                </h2>
                <div className="space-y-3 text-sm leading-relaxed font-light">
                  <p className={`font-light ${archivo.className}`}>
                    1. Goście zobowiązani są do kulturalnego zachowania i poszanowania innych gości oraz personelu.
                  </p>
                  <p className={`font-light ${archivo.className}`}>
                    2. Zabrania się wnoszenia własnych napojów alkoholowych.
                  </p>
                  <p className={`font-light ${archivo.className}`}>
                    3. Zabrania się palenia tytoniu i e-papierosów w pomieszczeniach Restauracji.
                  </p>
                  <p className={`font-light ${archivo.className}`}>
                    4. Restauracja zastrzega sobie prawo do odmowy obsługi lub prośby o opuszczenie lokalu w przypadku
                    naruszenia zasad kulturalnego zachowania.
                  </p>
                </div>
              </section>

              <section>
                <h2 className={`text-xl font-semibold mb-4 text-[#BA9D76] ${archivo.className}`}>§5. Płatności</h2>
                <div className="space-y-3 text-sm leading-relaxed font-light">
                  <p className={`font-light ${archivo.className}`}>
                    1. Płatności można dokonywać gotówką lub kartą płatniczą.
                  </p>
                  <p className={`font-light ${archivo.className}`}>2. Ceny zawarte w menu zawierają podatek VAT.</p>
                  <p className={`font-light ${archivo.className}`}>
                    3. Napiwek nie jest obowiązkowy, ale jest mile widziany jako wyraz zadowolenia z obsługi.
                  </p>
                </div>
              </section>

              <section>
                <h2 className={`text-xl font-semibold mb-4 text-[#BA9D76] ${archivo.className}`}>
                  §6. Odpowiedzialność
                </h2>
                <div className="space-y-3 text-sm leading-relaxed font-light">
                  <p className={`font-light ${archivo.className}`}>
                    1. Restauracja nie ponosi odpowiedzialności za rzeczy pozostawione przez gości.
                  </p>
                  <p className={`font-light ${archivo.className}`}>
                    2. Goście korzystają z usług Restauracji na własną odpowiedzialność.
                  </p>
                  <p className={`font-light ${archivo.className}`}>
                    3. W przypadku problemów zdrowotnych związanych z alergiami prosimy o wcześniejsze poinformowanie
                    personelu.
                  </p>
                </div>
              </section>

              <section>
                <h2 className={`text-xl font-semibold mb-4 text-[#BA9D76] ${archivo.className}`}>§7. Reklamacje</h2>
                <div className="space-y-3 text-sm leading-relaxed font-light">
                  <p className={`font-light ${archivo.className}`}>
                    1. Reklamacje dotyczące jakości potraw należy zgłaszać niezwłocznie podczas pobytu w Restauracji.
                  </p>
                  <p className={`font-light ${archivo.className}`}>
                    2. Reklamacje można składać osobiście, telefonicznie lub mailowo na adres: basmalublin@gmail.com
                  </p>
                  <p className={`font-light ${archivo.className}`}>
                    3. Restauracja zobowiązuje się do rozpatrzenia reklamacji w terminie 14 dni roboczych.
                  </p>
                </div>
              </section>

              <section>
                <h2 className={`text-xl font-semibold mb-4 text-[#BA9D76] ${archivo.className}`}>
                  §8. Postanowienia końcowe
                </h2>
                <div className="space-y-3 text-sm leading-relaxed font-light">
                  <p className={`font-light ${archivo.className}`}>
                    1. Restauracja zastrzega sobie prawo do zmiany niniejszego regulaminu.
                  </p>
                  <p className={`font-light ${archivo.className}`}>
                    2. Aktualna wersja regulaminu jest dostępna w Restauracji oraz na stronie internetowej.
                  </p>
                  <p className={`font-light ${archivo.className}`}>
                    3. W sprawach nieuregulowanych niniejszym regulaminem zastosowanie mają przepisy prawa polskiego.
                  </p>
                </div>
              </section>

              <div className="mt-8 p-4 bg-[#BA9D76]/20 rounded-lg border border-[#BA9D76]/30">
                <p className="text-sm text-white/90 font-light">
                  <strong>Kontakt:</strong>
                  <br />
                  Basma Mezze & Grill
                  <br />
                  ul. Krakowskie Przedmieście 3
                  <br />
                  20-002 Lublin
                  <br />
                  Tel: +48 574 933 988
                  <br />
                  Email: basmalublin@gmail.com
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
