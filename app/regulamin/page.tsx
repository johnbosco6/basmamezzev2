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

export default function RegulaminPage() {
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

              <section>
                <h2 className={`text-xl font-semibold mb-4 text-[#BA9D76] ${archivo.className}`}>
                  §9. Zwroty i odstąpienie od umowy
                </h2>
                <div className="space-y-3 text-sm leading-relaxed font-light">
                  <p className={`font-light ${archivo.className}`}>
                    1. Zgodnie z art. 38 pkt 4 i 6 ustawy o prawach konsumenta, prawo do odstąpienia od umowy zawartej na
                    odległość nie przysługuje konsumentowi w odniesieniu do umów, w których przedmiotem świadczenia jest
                    rzecz ulegająca szybkiemu zepsuciu lub mająca krótki termin przydatności do użycia oraz w których
                    przedmiotem świadczenia jest rzecz dostarczana w zapieczętowanym opakowaniu, której po otwarciu
                    opakowania nie można zwrócić ze względu na ochronę zdrowia lub ze względów higienicznych, jeżeli
                    opakowanie zostało otwarte po dostarczeniu.
                  </p>
                  <p className={`font-light ${archivo.className}`}>
                    2. W przypadku produktów niebędących żywnością (np. vouchery podarunkowe), konsumentowi przysługuje
                    prawo do odstąpienia od umowy w terminie 14 dni bez podania przyczyny.
                  </p>
                  <p className={`font-light ${archivo.className}`}>
                    3. Szczegółowe zasady dotyczące zwrotów i reklamacji określa dokument "Polityka Zwrotów" dostępny na
                    stronie internetowej.
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
                  NIP: 714 185 55 52
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
      <MainFooter />
    </div>
  )
}
