import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Mail, Users, Clock, Heart } from "lucide-react"
import { Archivo } from "next/font/google"
import { MainNavbar } from "@/components/main-navbar"
import { MainFooter } from "@/components/main-footer"
import { Button } from "@/components/ui/button"

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["200", "400", "600", "700"],
  display: "swap",
})

export default function KarieraPage() {
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
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('/images/basma-bar-staff.jpeg')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#2B2B2B]/70 via-[#326096]/60 to-[#2B2B2B]/70"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <div className="mb-8">
              <Image
                src="/images/basma-blue-logo.png"
                alt="Basma Mezze & Grill"
                width={200}
                height={100}
                className="object-contain drop-shadow-lg"
                priority
              />
            </div>
            <h1 className={`text-4xl md:text-6xl font-bold mb-6 text-white ${archivo.className}`}>Pracuj z Nami</h1>
            <p
              className={`text-lg md:text-xl mb-10 text-white/95 drop-shadow-md font-light backdrop-blur-lg bg-gradient-to-r from-[#BA9D76]/20 via-white/10 to-[#597FB1]/20 border border-[#BA9D76]/40 rounded-2xl px-8 py-4 shadow-2xl max-w-3xl ${archivo.className}`}
            >
              Dołącz do naszego zespołu i stań się częścią wyjątkowej rodziny Basma, gdzie tradycja spotyka się z
              nowoczesnością
            </p>
          </div>
        </div>
      </section>

      {/* Why Work With Us */}
      <section className="py-20 bg-gradient-to-r from-[#2B2B2B]/20 via-transparent to-[#326096]/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-semibold mb-4 text-white ${archivo.className}`}>
              Dlaczego Basma?
            </h2>
            <p className={`text-xl text-white/90 max-w-2xl mx-auto font-light ${archivo.className}`}>
              Odkryj, dlaczego praca w Basmie to więcej niż tylko zawód - to pasja i rodzina
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Team Culture */}
            <div className="backdrop-blur-lg bg-white/10 border border-white/20 p-8 rounded-2xl shadow-2xl hover:bg-white/15 transition-all duration-500 hover:scale-105">
              <div className="flex items-center justify-center w-16 h-16 bg-[#BA9D76]/20 rounded-full mb-6 mx-auto">
                <Users className="h-8 w-8 text-[#BA9D76]" />
              </div>
              <h3 className={`text-xl font-semibold text-white mb-4 text-center ${archivo.className}`}>
                Zespołowa Kultura
              </h3>
              <p className={`text-white/90 text-center font-light leading-relaxed ${archivo.className}`}>
                Pracuj w przyjaznym środowisku, gdzie każdy członek zespołu jest szanowany i wspierany w rozwoju
                zawodowym.
              </p>
            </div>

            {/* Flexible Hours */}
            <div className="backdrop-blur-lg bg-white/10 border border-white/20 p-8 rounded-2xl shadow-2xl hover:bg-white/15 transition-all duration-500 hover:scale-105">
              <div className="flex items-center justify-center w-16 h-16 bg-[#BA9D76]/20 rounded-full mb-6 mx-auto">
                <Clock className="h-8 w-8 text-[#BA9D76]" />
              </div>
              <h3 className={`text-xl font-semibold text-white mb-4 text-center ${archivo.className}`}>
                Elastyczne Godziny
              </h3>
              <p className={`text-white/90 text-center font-light leading-relaxed ${archivo.className}`}>
                Oferujemy elastyczne grafiki pracy, które pozwalają na zachowanie równowagi między życiem zawodowym a
                prywatnym.
              </p>
            </div>

            {/* Growth Opportunities */}
            <div className="backdrop-blur-lg bg-white/10 border border-white/20 p-8 rounded-2xl shadow-2xl hover:bg-white/15 transition-all duration-500 hover:scale-105">
              <div className="flex items-center justify-center w-16 h-16 bg-[#BA9D76]/20 rounded-full mb-6 mx-auto">
                <Heart className="h-8 w-8 text-[#BA9D76]" />
              </div>
              <h3 className={`text-xl font-semibold text-white mb-4 text-center ${archivo.className}`}>
                Rozwój Zawodowy
              </h3>
              <p className={`text-white/90 text-center font-light leading-relaxed ${archivo.className}`}>
                Inwestujemy w naszych pracowników poprzez szkolenia, kursy i możliwości awansu w dynamicznie
                rozwijającej się restauracji.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Application Section */}
      <section className="py-20 bg-gradient-to-r from-[#2B2B2B]/30 via-transparent to-[#326096]/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="backdrop-blur-lg bg-white/10 border border-[#BA9D76]/25 p-8 md:p-12 rounded-2xl shadow-2xl text-center">
              <div className="flex items-center justify-center w-20 h-20 bg-[#BA9D76]/20 rounded-full mb-8 mx-auto">
                <Mail className="h-10 w-10 text-[#BA9D76]" />
              </div>

              <h2 className={`text-3xl md:text-4xl font-semibold mb-6 text-white ${archivo.className}`}>
                Gotowy na Dołączenie?
              </h2>

              <p className={`text-lg md:text-xl text-white/90 mb-8 font-light leading-relaxed ${archivo.className}`}>
                Jeśli chcesz być częścią naszego zespołu i dzielić pasję do autentycznej kuchni bliskowschodniej, wyślij
                nam swoje CV już dziś!
              </p>

              <div className="space-y-6">
                <div className="backdrop-blur-md bg-[#2B2B2B]/40 p-6 rounded-xl border border-[#BA9D76]/30">
                  <h3 className={`text-xl font-semibold text-white mb-4 ${archivo.className}`}>Jak aplikować?</h3>
                  <div className={`space-y-3 text-white/90 font-light ${archivo.className}`}>
                    <p>1. Przygotuj swoje CV w formacie PDF</p>
                    <p>2. Napisz krótki list motywacyjny</p>
                    <p>3. Wyślij dokumenty na nasz adres email</p>
                    <p>4. Czekaj na naszą odpowiedź!</p>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-4">
                  <p className={`text-lg text-white/90 font-light ${archivo.className}`}>Wyślij swoje CV na:</p>
                  <div className="flex items-center gap-3 bg-[#BA9D76]/20 px-6 py-3 rounded-full border border-[#BA9D76]/40">
                    <Mail className="h-5 w-5 text-[#BA9D76]" />
                    <span className={`text-lg font-semibold text-white ${archivo.className}`}>
                      basmalublin@gmail.com
                    </span>
                  </div>

                  <a
                    href="mailto:basmalublin@gmail.com?subject=Aplikacja o pracę - CV&body=Dzień dobry,%0D%0A%0D%0AChciałbym/Chciałabym aplikować o pracę w restauracji Basma.%0D%0A%0D%0AW załączniku przesyłam swoje CV.%0D%0A%0D%0APozdrawiam"
                    className="mt-4"
                  >
                    <Button className="bg-[#BA9D76]/80 backdrop-blur-lg border border-[#BA9D76]/50 hover:bg-[#BA9D76] text-white px-8 py-4 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                      Wyślij CV Teraz
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MainFooter />
    </div>
  )
}
