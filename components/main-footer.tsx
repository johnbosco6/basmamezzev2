import Image from "next/image"
import Link from "next/link"
import { Phone, Mail, MapPin, FileText, Shield, RefreshCw, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Archivo } from "next/font/google"

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["200", "400", "600", "700"],
  display: "swap",
})

export function MainFooter() {
  return (
    <footer className="relative py-20 text-white overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/basma-bar-staff.jpeg"
          alt="Professional bartenders at Basma restaurant preparing cocktails"
          fill
          className="object-cover opacity-60"
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2B2B2B]/85 via-[#326096]/60 to-[#2B2B2B]/50"></div>
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Restaurant Info */}
            <div className="space-y-6">
              <div className="flex items-center justify-center gap-3">
                <Image
                  src="/images/basma-blue-logo.png"
                  alt="Basma Mezze i Grill"
                  width={120}
                  height={60}
                  className="object-contain"
                />
              </div>
              <p className={`text-white/90 text-sm leading-relaxed font-light ${archivo.className}`}>
                Autentyczna kuchnia bliskowschodnia w sercu Lublina. Doświadcz tradycyjnych smaków z nowoczesną
                gościnnością.
              </p>
              <div className="flex gap-3">
                <a
                  href="https://www.facebook.com/Basmamezze"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-full flex items-center justify-center bg-[#BA9D76]/20 hover:bg-[#BA9D76]/40 backdrop-blur-sm border border-[#BA9D76]/30 hover:border-[#BA9D76]/50 transition-all duration-300 hover:scale-110 text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/basma.mezze/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-full flex items-center justify-center bg-[#BA9D76]/20 hover:bg-[#BA9D76]/40 backdrop-blur-sm border border-[#BA9D76]/30 hover:border-[#BA9D76]/50 transition-all duration-300 hover:scale-110 text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <a
                  href="https://www.tiktok.com/discover/basmalublin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-full flex items-center justify-center bg-[#BA9D76]/20 hover:bg-[#BA9D76]/40 backdrop-blur-sm border border-[#BA9D76]/30 hover:border-[#BA9D76]/50 transition-all duration-300 hover:scale-110 text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
                  </svg>
                </a>
                <a
                  href="tel:+48574933988"
                  className="h-10 w-10 rounded-full flex items-center justify-center bg-[#BA9D76]/20 hover:bg-[#BA9D76]/40 backdrop-blur-sm border border-[#BA9D76]/30 hover:border-[#BA9D76]/50 transition-all duration-300 hover:scale-110 text-white"
                >
                  <Phone className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h4 className={`text-lg font-semibold text-white border-b border-[#BA9D76]/30 pb-2 ${archivo.className}`}>
                Szybkie Linki
              </h4>
              <div className="space-y-3">
                {[
                  { name: "Strona Główna", href: "/", icon: "🏠" },
                  { name: "Pełne Menu", href: "/menu", icon: "📋" },
                  { name: "Zamów Online", href: "/order", icon: "🛒" },
                  { name: "FAQ", href: "/faq", icon: "❓" },
                  { name: "Kariera", href: "/kariera", icon: "💼" },
                ].map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    className="flex items-center gap-3 text-white/80 hover:text-[#BA9D76] transition-colors duration-300 group"
                  >
                    <span className="text-sm">{link.icon}</span>
                    <span className={`text-sm group-hover:translate-x-1 transition-transform duration-300 font-light ${archivo.className}`}>
                      {link.name}
                    </span>
                    <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="space-y-6">
              <h4 className={`text-lg font-semibold text-white border-b border-[#BA9D76]/30 pb-2 ${archivo.className}`}>
                Bądź w Kontakcie
              </h4>
              <div className="space-y-3">
                <div className={`flex items-center gap-2 text-sm text-white/80 font-light ${archivo.className}`}>
                  <Phone className="h-4 w-4 text-[#BA9D76]" />
                  <span>+48 574 933 988</span>
                </div>
                <div className={`flex items-center gap-2 text-sm text-white/80 font-light ${archivo.className}`}>
                  <Mail className="h-4 w-4 text-[#BA9D76]" />
                  <span>basmalublin@gmail.com</span>
                </div>
                <div className={`flex items-start gap-2 text-sm text-white/80 font-light ${archivo.className}`}>
                  <MapPin className="h-4 w-4 text-[#BA9D76] mt-1" />
                  <div>
                    <a
                      href="https://www.google.com/maps/dir//Krakowskie+Przedmie%C5%9Bcie+3,+20-002+Lublin/@51.2476527,22.4823717,12z"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#BA9D76] transition-colors duration-300 hover:underline block mb-3"
                    >
                      Krakowskie Przedmieście 3<br />
                      20-002 Lublin
                    </a>
                    <div className="text-white/60 text-xs space-y-1 mt-2 p-3 bg-white/5 rounded-lg border border-white/10">
                      <p className="text-[#BA9D76] font-medium mb-1">Dane firmowe:</p>
                      <p>Jakub Wiśniewski Browar Dziki Wschód</p>
                      <p>ul. Krakowskie Przedmieście 3</p>
                      <p>20-002 Lublin</p>
                      <p>NIP: 714 185 55 52</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Google Reviews Button */}
          <div className="flex justify-center mt-4 mb-8">
            <a
              href="https://www.google.com/search?q=BASMA+Mezze+%26+Grill+Opinie"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#BA9D76]/80 hover:bg-[#BA9D76] text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg backdrop-blur-sm border border-[#BA9D76]/50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              Zostaw Opinię
            </a>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-[#BA9D76]/30 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex flex-wrap gap-6 text-sm text-white/70">
                <Link href="/regulamin" className="hover:text-[#BA9D76] transition-colors duration-300 flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  Regulamin
                </Link>
                <Link href="/polityka-prywatnosci" className="hover:text-[#BA9D76] transition-colors duration-300 flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  Polityka Prywatności
                </Link>
                <Link href="/polityka-zwrotow" className="hover:text-[#BA9D76] transition-colors duration-300 flex items-center gap-1">
                  <RefreshCw className="h-3 w-3" />
                  Polityka Zwrotów
                </Link>
                <Link href="/alergeny" className="hover:text-[#BA9D76] transition-colors duration-300">
                  Informacje o Alergenach
                </Link>
                <Link href="/kariera" className="hover:text-[#BA9D76] transition-colors duration-300">
                  Kariera
                </Link>
              </div>
              <div className={`text-sm text-white/70 font-light ${archivo.className}`}>
                © {new Date().getFullYear()} Basma Mezze i Grill. Wszelkie prawa zastrzeżone.
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
