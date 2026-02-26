"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Clock, MapPin, Phone, Mail, FileText, Shield, ChevronRight, Home, BookOpen, MessageCircle } from "lucide-react"
import { Archivo } from "next/font/google"

import { Button } from "@/components/ui/button"
import { HoursWidget } from "@/components/hours-widget"
import { HeaderHoursWidget } from "@/components/header-hours-widget"
import { FloatingChefBot } from "@/components/floating-chef-bot"

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["200", "400", "600", "700"],
  display: "swap",
})

export default function HomePage() {
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null)

  // Add this function after the useState declaration
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  // Add this useEffect to handle hash navigation
  useEffect(() => {
    const hash = window.location.hash
    if (hash) {
      const sectionId = hash.replace("#", "")
      setTimeout(() => scrollToSection(sectionId), 100)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#597FB1] via-[#326096] to-[#2B2B2B] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#597FB1]/80 border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex-1 flex justify-start"></div>
          <nav className="flex-1 flex items-center justify-center gap-8 backdrop-blur-md bg-white/15 border border-white/25 rounded-full px-6 py-3 shadow-lg">
            <Link
              href="#home"
              className="flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/20 hover:shadow-lg text-white/80 hover:text-[#BA9D76] group"
            >
              <Home className="h-5 w-5 transition-colors duration-300" />
              <span className={`text-xs font-light ${archivo.className}`}>Strona Główna</span>
            </Link>
            <Link
              href="/menu"
              className="flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/20 hover:shadow-lg text-white/80 hover:text-[#BA9D76] group"
            >
              <BookOpen className="h-5 w-5 transition-colors duration-300" />
              <span className={`text-xs font-light ${archivo.className}`}>Menu</span>
            </Link>
            <Link
              href="#visit-us"
              className="flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/20 hover:shadow-lg text-white/80 hover:text-[#BA9D76] group"
            >
              <MessageCircle className="h-5 w-5 transition-colors duration-300" />
              <span className={`text-xs font-light ${archivo.className}`}>Kontakt</span>
            </Link>
          </nav>
          <div className="flex-1 flex justify-end">
            {/* Placeholder for potential right-aligned content, like a button */}
          </div>
        </div>

        {/* Hours Widget Below Navigation */}
        <div className="container mx-auto px-4 pb-4 flex justify-center">
          <HeaderHoursWidget />
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative py-20 md:py-32 overflow-hidden min-h-[80vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('/images/basma-evening-exterior.jpeg')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#2B2B2B]/60 via-[#326096]/50 to-[#2B2B2B]/60"></div>
        </div>

        {/* Small Logo positioned at the top of hero */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20">
          <Image
            src="/images/basma-blue-logo.png"
            alt="Basma Mezze & Grill"
            width={150}
            height={75}
            className="object-contain drop-shadow-lg"
            priority
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <p
              className={`text-lg md:text-xl mb-10 text-white/95 drop-shadow-md font-light backdrop-blur-lg bg-gradient-to-r from-[#BA9D76]/20 via-white/10 to-[#597FB1]/20 border border-[#BA9D76]/40 rounded-2xl px-8 py-4 shadow-2xl hover:shadow-[0_0_30px_rgba(186,157,118,0.3)] transition-all duration-300 hover:scale-105 relative overflow-hidden ${archivo.className}`}
            >
              <span className="relative z-10">Autentyczna restauracja z kuchnią bliskowschodnią w sercu Lublina</span>
              <div className="absolute inset-0 bg-gradient-to-br from-[#597FB1]/10 via-transparent to-[#326096]/10 rounded-2xl"></div>
            </p>
            <div className="flex justify-center">
              <Link href="/menu">
                <Button className="bg-[#BA9D76]/80 backdrop-blur-lg border border-[#BA9D76]/50 hover:bg-[#BA9D76] text-white px-8 py-4 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  Zobacz Nasze Menu
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Restaurant Experience Gallery */}
      <section className="py-20 bg-gradient-to-r from-[#2B2B2B]/20 via-transparent to-[#326096]/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-semibold mb-4 text-white ${archivo.className}`}>
              Skosztuj Basmy
            </h2>
            <p className={`text-xl text-white/90 max-w-2xl mx-auto font-light ${archivo.className}`}>
              Od naszej wyjątkowej kuchni prosto do Twojego stołu - odkryj serce bliskowschodniej gościnności
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Cocktail Experience */}
            <div className="group relative overflow-hidden rounded-2xl backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-500 hover:scale-105">
              <div className="relative h-80">
                <Image
                  src="/images/cocktail-preparation.jpeg"
                  alt="Ekspert barman przygotowujący autorskie koktajle"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2B2B2B]/80 via-transparent to-transparent"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="backdrop-blur-md bg-[#2B2B2B]/60 rounded-xl p-4 border border-[#BA9D76]/30">
                  <h3 className={`text-xl font-semibold text-white mb-2 ${archivo.className}`}>Autorskie Koktajle</h3>
                  <p className={`text-white/90 text-sm font-light ${archivo.className}`}>
                    Mistrzowsko przygotowane drinki z bliskowschodnim akcentem
                  </p>
                </div>
              </div>
            </div>

            {/* Dining Atmosphere */}
            <div className="group relative overflow-hidden rounded-2xl backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-500 hover:scale-105">
              <div className="relative h-80">
                <Image
                  src="/images/dining-atmosphere.jpeg"
                  alt="Elegancka atmosfera jadalni w restauracji Basma"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2B2B2B]/80 via-transparent to-transparent"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="backdrop-blur-md bg-[#2B2B2B]/60 rounded-xl p-4 border border-[#BA9D76]/30">
                  <h3 className={`text-xl font-semibold text-white mb-2 ${archivo.className}`}>Kameralna Atmosfera</h3>
                  <p className={`text-white/90 text-sm font-light ${archivo.className}`}>
                    Ciepła atmosfera idealna na każdą okazję
                  </p>
                </div>
              </div>
            </div>

            {/* Outdoor Service */}
            <div className="group relative overflow-hidden rounded-2xl backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-500 hover:scale-105">
              <div className="relative h-80">
                <Image
                  src="/images/outdoor-service.jpeg"
                  alt="Troskliwa obsługa na naszym pięknym tarasie"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2B2B2B]/80 via-transparent to-transparent"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="backdrop-blur-md bg-[#2B2B2B]/60 rounded-xl p-4 border border-[#BA9D76]/30">
                  <h3 className={`text-xl font-semibold text-white mb-2 ${archivo.className}`}>Ogródek letni</h3>
                  <p className={`text-white/90 text-sm font-light ${archivo.className}`}>
                    Jedzenie na świeżym powietrzu w sercu Lublina
                  </p>
                </div>
              </div>
            </div>

            {/* Authentic Cuisine */}
            <div className="group relative overflow-hidden rounded-2xl backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-500 hover:scale-105">
              <div className="relative h-80">
                <Image
                  src="/images/mezze-platter.jpeg"
                  alt="Tradycyjny talerz mezze z autentycznymi bliskowschodnimi potrawami"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2B2B2B]/80 via-transparent to-transparent"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="backdrop-blur-md bg-[#2B2B2B]/60 rounded-xl p-4 border border-[#BA9D76]/30">
                  <h3 className={`text-xl font-semibold text-white mb-2 ${archivo.className}`}>Autentyczne Mezze</h3>
                  <p className={`text-white/90 text-sm font-light ${archivo.className}`}>
                    Tradycyjne przepisy przekazywane przez pokolenia
                  </p>
                </div>
              </div>
            </div>

            {/* Restaurant Entrance */}
            <div className="group relative overflow-hidden rounded-2xl backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-500 hover:scale-105">
              <div className="relative h-80">
                <Image
                  src="/images/restaurant-entrance.jpeg"
                  alt="Witamy w Basmie - nasze eleganckie wejście"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2B2B2B]/80 via-transparent to-transparent"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="backdrop-blur-md bg-[#2B2B2B]/60 rounded-xl p-4 border border-[#BA9D76]/30">
                  <h3 className={`text-xl font-semibold text-white mb-2 ${archivo.className}`}>Witamy w Domu</h3>
                  <p className={`text-white/90 text-sm font-light ${archivo.className}`}>
                    Wejdź do naszego świata bliskowschodniej gościnności
                  </p>
                </div>
              </div>
            </div>

            {/* Kitchen Excellence */}
            <div className="group relative overflow-hidden rounded-2xl backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-500 hover:scale-105">
              <div className="relative h-80">
                <Image
                  src="/images/kitchen-grilling.jpeg"
                  alt="Mistrz kucharz grillujący świeże składniki na otwartym ogniu"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2B2B2B]/80 via-transparent to-transparent"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="backdrop-blur-md bg-[#2B2B2B]/60 rounded-xl p-4 border border-[#BA9D76]/30">
                  <h3 className={`text-xl font-semibold text-white mb-2 ${archivo.className}`}>
                    Grillowanie na Lava Grill
                  </h3>
                  <p className={`text-white/90 text-sm font-light ${archivo.className}`}>
                    Świeże składniki grillowane do perfekcji
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gradient-to-l from-white via-white to-[#597FB1]/20">
        <div className="container mx-auto px-4">
          <div className="relative rounded-2xl overflow-hidden h-[500px] md:h-[600px] shadow-2xl group">
            <Image
              src="/images/chef-grilling-tradition.jpeg"
              alt="Szef kuchni grillujący tradycyjne bliskowschodnie jedzenie na lava grill"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2B2B2B]/70 via-[#326096]/40 to-transparent flex items-center justify-center p-4 md:p-8">
              <div className="backdrop-blur-lg bg-[#2B2B2B]/60 p-6 md:p-10 rounded-xl text-center max-w-2xl border border-[#BA9D76]/30">
                <h2 className={`text-2xl md:text-3xl font-semibold mb-6 text-white ${archivo.className}`}>
                  Smak Tradycji
                </h2>
                <p className={`text-lg md:text-xl text-white/90 leading-relaxed font-light ${archivo.className}`}>
                  Wyrusz w kulinarną podróż przez Bliski Wschód, gdzie tradycyjne receptury i ciepłe przyprawy tworzą
                  niezapomniane smaki.
                </p>
                <p className={`text-lg md:text-xl text-white/90 leading-relaxed mt-4 font-light ${archivo.className}`}>
                  Celebruj każdą chwilę przy stole w towarzystwie swoich przyjaciół
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Dishes - Updated with same styling as Skosztuj Basmy section */}
      <section id="menu" className="py-20 bg-gradient-to-br from-[#2B2B2B] via-[#326096] to-[#597FB1]">
        <div className="container mx-auto px-4">
          <h2 className={`text-3xl font-semibold mb-2 text-center text-white ${archivo.className}`}>
            Nasze Wyjątkowe Dania
          </h2>
          <p className={`text-center mb-12 max-w-2xl mx-auto text-white/90 font-light ${archivo.className}`}>
            Doświadcz najlepszej kuchni bliskowschodniej z naszym starannie przygotowanym menu zawierającym tradycyjne
            mezze i grillowane specjały
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Karmelowy Kurczak by BASMA",
                description:
                  "Słodko-pikantny kurczak z wodą pomarańczową i orzechową dukkah - nasze autorskie połączenie smaków Bliskiego Wschodu",
                price: "39 PLN",
                image: "/images/menu/caramel-chicken.jpeg",
              },
              {
                name: "Kalafior z Labneh",
                description:
                  "Grillowany kalafior podany z kremowym labneh, posypany świeżymi ziołami i orzechami - połączenie tradycji z nowoczesnością",
                price: "49 PLN",
                image: "/images/menu/cauliflower-labneh.jpeg",
              },
              {
                name: "Dubajski Sen",
                description:
                  "Ciasto czekoladowe podane na chrupiącym kataifi z gałką lodów pistacjowych i sosem czekoladowym",
                price: "29 PLN",
                image: "/images/menu/dubai-dream.jpeg",
              },
            ].map((dish, index) => (
              <Link href="/menu#featured-dishes" key={index}>
                <div className="group relative overflow-hidden rounded-2xl backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-500 hover:scale-105 cursor-pointer">
                  <div className="relative h-80">
                    <Image
                      src={dish.image || "/placeholder.svg"}
                      alt={dish.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110 cursor-pointer"
                      onClick={() => setSelectedImage({ src: dish.image || "/placeholder.svg", alt: dish.name })}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2B2B2B]/80 via-transparent to-transparent"></div>
                    {/* Click indicator */}
                    <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M15 3h6v6"></path>
                        <path d="M10 14 21 3"></path>
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="backdrop-blur-md bg-[#2B2B2B]/60 rounded-xl p-4 border border-[#BA9D76]/30">
                      <h3 className={`text-xl font-semibold text-white mb-2 ${archivo.className}`}>{dish.name}</h3>
                      <p className={`text-white/90 text-sm font-light mb-2 ${archivo.className}`}>{dish.description}</p>
                      <div className="flex justify-center items-center">
                        <p className={`text-xl font-semibold text-[#BA9D76] ${archivo.className}`}>{dish.price}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/menu">
              <Button className="bg-[#BA9D76]/80 backdrop-blur-lg border border-[#BA9D76]/50 hover:bg-[#BA9D76] text-white px-8 py-6 text-lg shadow-xl">
                Zobacz Pełne Menu
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact & Reservation */}
      <section id="contact" className="py-20 bg-gradient-to-bl from-[#597FB1] to-[#2B2B2B]">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Image Side */}
            <div className="relative overflow-hidden rounded-2xl shadow-2xl group">
              <Image
                src="/images/basma-interior-dining.jpg"
                alt="Eleganckie wnętrze restauracji Basma z ciepłymi beżowymi tonami i tradycyjną architekturą bliskowschodnią"
                width={600}
                height={400}
                className="object-cover w-full h-[500px] group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2B2B2B]/30 via-transparent to-transparent"></div>
            </div>

            {/* Content Side */}
            <div className="space-y-8">
              {/* Hours Widget */}
              <HoursWidget />

              <div className="backdrop-blur-lg bg-white/10 border border-[#BA9D76]/25 p-8 rounded-2xl shadow-2xl">
                <h2 className={`text-3xl md:text-4xl font-semibold mb-6 text-white ${archivo.className}`}>
                  Filozofia Wnętrza
                </h2>
                <div className={`space-y-6 text-white/90 leading-relaxed font-light ${archivo.className}`}>
                  <p className="text-lg">
                    Jasne odcienie beżu zastosowane na ścianach i w elementach wystroju wnętrza tworzą harmonijną i
                    ciepłą bazę, która jest równoważona głębią koloru ceglanego, przydymionego brązu oraz ciemnego
                    grafitu.
                  </p>
                  <p className="text-lg">
                    Ta starannie dobrana paleta barw buduje elegancki i wyważony kontrast, łącząc naturalną{" "}
                    <span className="text-[#BA9D76] font-semibold">subtelność</span> z{" "}
                    <span className="text-[#BA9D76] font-semibold">wyrazistymi akcentami</span> inspirowanymi tradycyjną
                    architekturą Bliskiego Wschodu.
                  </p>
                </div>
              </div>

              {/* Contact Information */}
              <div
                id="visit-us"
                className="backdrop-blur-lg bg-white/10 border border-[#BA9D76]/25 p-8 rounded-2xl shadow-2xl"
              >
                <h3 className={`text-2xl font-semibold mb-6 text-white ${archivo.className}`}>Odwiedź Nas</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <MapPin className="h-6 w-6 mt-1 flex-shrink-0 text-[#BA9D76]" />
                    <div>
                      <h4 className={`font-semibold text-lg text-white ${archivo.className}`}>Lokalizacja</h4>
                      <a
                        href="https://www.google.com/maps/dir//Krakowskie+Przedmie%C5%9Bcie+3,+20-002+Lublin/@51.2476527,22.4823717,12z/data=!4m8!4m7!1m0!1m5!1m1!1s0x4722578b335bb407:0x1cda20df03762b0a!2m2!1d22.5647719!2d51.2476816?entry=ttu&g_ep=EgoyMDI1MDYzMC4wIKXMDSoASAFQAw%3D%3D&q=BASMA+Mezze+%26+Grill+Opinie&sa=X&ved=2ahUKEwjbl43C1aqOAxVeIxAIHepIBXAQ0bkNegQIIRAD&biw=1536&bih=738&dpr=1.25"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-white/90 hover:text-[#BA9D76] transition-colors duration-300 font-light cursor-pointer hover:underline ${archivo.className}`}
                      >
                        ul. Krakowskie Przedmieście 3
                        <br />
                        20-002 Lublin, Polska
                      </a>
                      <p className={`text-xs text-white/70 mt-1 font-light ${archivo.className}`}>
                        Kliknij aby otworzyć w Google Maps
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Clock className="h-6 w-6 mt-1 flex-shrink-0 text-[#BA9D76]" />
                    <div>
                      <h4 className={`font-semibold text-lg text-white ${archivo.className}`}>Godziny Otwarcia</h4>
                      <div className={`text-white/90 space-y-1 font-light ${archivo.className}`}>
                        <p className="font-medium text-[#BA9D76]">Godziny Otwarcia:</p>
                        <p>Poniedziałek - Czwartek: 12:00 - 23:00</p>
                        <p>Piątek: 12:00 - 00:00</p>
                        <p>Sobota: 10:00 - 00:00</p>
                        <p>Niedziela: 10:00 - 23:00</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Phone className="h-6 w-6 mt-1 flex-shrink-0 text-[#BA9D76]" />
                    <div>
                      <h4 className={`font-semibold text-lg text-white ${archivo.className}`}>Kontakt</h4>
                      <p className={`text-white/90 font-light ${archivo.className}`}>
                        +48 574 933 988
                        <br />
                        basmalublin@gmail.com
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Interactive Footer */}
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
                    href="#"
                    className="h-10 w-10 rounded-full flex items-center justify-center bg-[#BA9D76]/20 hover:bg-[#BA9D76]/40 backdrop-blur-sm border border-[#BA9D76]/30 hover:border-[#BA9D76]/50 transition-all duration-300 hover:scale-110 text-white"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </a>
                  <a
                    href="https://www.instagram.com/basma.mezze/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 w-10 rounded-full flex items-center justify-center bg-[#BA9D76]/20 hover:bg-[#BA9D76]/40 backdrop-blur-sm border border-[#BA9D76]/30 hover:border-[#BA9D76]/50 transition-all duration-300 hover:scale-110 text-white"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
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
                <h4
                  className={`text-lg font-semibold text-white border-b border-[#BA9D76]/30 pb-2 ${archivo.className}`}
                >
                  Szybkie Linki
                </h4>
                <div className="space-y-3">
                  {[
                    { name: "Strona Główna", href: "#home", icon: "🏠" },
                    { name: "Pełne Menu", href: "/menu", icon: "📋" },
                    { name: "Rezerwacje", href: "#contact", icon: "📅" },
                    { name: "O Nas", href: "#about", icon: "ℹ️" },
                    { name: "FAQ", href: "/faq", icon: "❓" },
                    { name: "Kontakt", href: "#visit-us", icon: "📞", onClick: () => scrollToSection("visit-us") },
                  ].map((link, index) => (
                    <Link
                      key={index}
                      href={link.href}
                      onClick={(e) => {
                        if (link.href.startsWith("#")) {
                          e.preventDefault()
                          scrollToSection(link.href.replace("#", ""))
                        }
                      }}
                      className="flex items-center gap-3 text-white/80 hover:text-[#BA9D76] transition-colors duration-300 group"
                    >
                      <span className="text-sm">{link.icon}</span>
                      <span
                        className={`text-sm group-hover:translate-x-1 transition-transform duration-300 font-light ${archivo.className}`}
                      >
                        {link.name}
                      </span>
                      <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Newsletter & Contact */}
              <div className="space-y-6">
                <h4
                  className={`text-lg font-semibold text-white border-b border-[#BA9D76]/30 pb-2 ${archivo.className}`}
                >
                  Bądź w Kontakcie
                </h4>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <p className={`text-sm text-white/80 font-light ${archivo.className}`}>
                      Zapisz się na ekskluzywne oferty i aktualności
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        placeholder="Twój email"
                        className={`flex-1 px-3 py-2 text-sm rounded-lg bg-white/20 border border-[#BA9D76]/30 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-[#BA9D76]/50 font-light ${archivo.className}`}
                      />
                      <Button
                        size="sm"
                        className="bg-[#BA9D76]/80 hover:bg-[#BA9D76] border border-[#BA9D76]/50 text-white"
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className={`flex items-center gap-2 text-sm text-white/80 font-light ${archivo.className}`}>
                      <Phone className="h-4 w-4 text-[#BA9D76]" />
                      <span>+48 574 933 988</span>
                    </div>
                    <div className={`flex items-center gap-2 text-sm text-white/80 font-light ${archivo.className}`}>
                      <Mail className="h-4 w-4 text-[#BA9D76]" />
                      <span>basmalublin@gmail.com</span>
                    </div>
                    <div className={`flex items-center gap-2 text-sm text-white/80 font-light ${archivo.className}`}>
                      <MapPin className="h-4 w-4 text-[#BA9D76]" />
                      <a
                        href="https://www.google.com/maps/dir//Krakowskie+Przedmie%C5%9Bcie+3,+20-002+Lublin/@51.2476527,22.4823717,12z/data=!4m8!4m7!1m0!1m5!1m1!1s0x4722578b335bb407:0x1cda20df03762b0a!2m2!1d22.5647719!2d51.2476816?entry=ttu&g_ep=EgoyMDI1MDYzMC4wIKXMDSoASAFQAw%3D%3D"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#BA9D76] transition-colors duration-300 hover:underline"
                      >
                        Krakowskie Przedmieście 3
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Google Reviews Button Section */}
            <div className="col-span-full flex justify-center mt-8 mb-4">
              <a
                href="https://www.google.com/search?sca_esv=873f597c83ac3191&si=AMgyJEtREmoPL4P1I5IDCfuA8gybfVI2d5Uj7QMwYCZHKDZ-E4O3nGmL_JyCV1ZXOc_6Rl_PSHIFhJuc-vZsRzj1YA_HP6yqZTPM9LIfcTxeOYPckrC0II4uaIrku0NboGgXwy40eNRjPGfoi9PnlLpnPQ8dXhsXJQ%3D%3D&q=BASMA+Mezze+%26+Grill+Opinie&sa=X&ved=2ahUKEwjbl43C1aqOAxVeIxAIHepIBXAQ0bkNegQIIRAD&biw=1536&bih=738&dpr=1.25"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#BA9D76]/80 hover:bg-[#BA9D76] text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg backdrop-blur-sm border border-[#BA9D76]/50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                Zostaw Opinię
              </a>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-[#BA9D76]/30 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex flex-wrap gap-6 text-sm text-white/70">
                <Link
                  href="/regulamin"
                  className="hover:text-[#BA9D76] transition-colors duration-300 flex items-center gap-1"
                >
                  <FileText className="h-3 w-3" />
                  Regulamin
                </Link>
                <Link
                  href="/polityka-prywatnosci"
                  className="hover:text-[#BA9D76] transition-colors duration-300 flex items-center gap-1"
                >
                  <Shield className="h-3 w-3" />
                  Polityka Prywatności
                </Link>
                <Link href="/alergeny" className="hover:text-[#BA9D76] transition-colors duration-300">
                  Informacje o Alergenach
                </Link>
                <Link
                  href="/kariera"
                  className="hover:text-[#BA9D76] transition-colors duration-300 flex items-center gap-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  Kariera
                </Link>
              </div>
              <div className={`text-sm text-white/70 font-light ${archivo.className}`}>
                © {new Date().getFullYear()} Basma Mezze i Grill. Wszelkie prawa zastrzeżone.
              </div>
            </div>
          </div>
        </div>
      </footer>
      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <Image
              src={selectedImage.src || "/placeholder.svg"}
              alt={selectedImage.alt}
              width={800}
              height={600}
              className="object-contain max-w-full max-h-full rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full p-2 text-white transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18"></path>
                <path d="M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Floating Chef Bot - Only on Home Page */}
      <FloatingChefBot />
    </div>
  )
}
