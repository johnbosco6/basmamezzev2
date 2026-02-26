import Link from "next/link"
import { ArrowLeft, Phone, Mail, MapPin } from "lucide-react"
import { Archivo } from "next/font/google"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { HoursWidget } from "@/components/hours-widget"

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["200", "400", "600", "700"],
  display: "swap",
})

const faqData = [
  {
    category: "Rezerwacje",
    questions: [
      {
        question: "Jak mogę dokonać rezerwacji?",
        answer:
          "Rezerwacji można dokonać telefonicznie pod numerem +48 574 933 988 lub osobiście w restauracji. Zalecamy rezerwację z wyprzedzeniem, szczególnie w weekendy i dni świąteczne.",
      },
      {
        question: "Czy mogę anulować lub zmienić rezerwację?",
        answer:
          "Tak, rezerwację można anulować lub zmienić dzwoniąc do nas przynajmniej 2 godziny przed planowaną wizytą. Prosimy o kontakt telefoniczny w celu dokonania zmian.",
      },
      {
        question: "Czy przyjmujecie rezerwacje na większe grupy?",
        answer:
          "Tak, przyjmujemy rezerwacje na grupy do 20 osób. Dla większych grup prosimy o kontakt z wyprzedzeniem, abyśmy mogli przygotować odpowiednie miejsce i menu.",
      },
    ],
  },
  {
    category: "Menu i Jedzenie",
    questions: [
      {
        question: "Czy oferujecie dania wegetariańskie i wegańskie?",
        answer:
          "Tak, nasze menu zawiera szeroki wybór dań wegetariańskich i wegańskich. Wiele naszych mezze to naturalne opcje roślinne, a także oferujemy specjalne dania główne dla wegetarian i wegan.",
      },
      {
        question: "Czy mogę zamówić jedzenie na wynos?",
        answer:
          "Tak, oferujemy możliwość zamówienia jedzenia na wynos. Prosimy o kontakt telefoniczny z wyprzedzeniem, aby przygotować zamówienie.",
      },
      {
        question: "Jakie są wasze specjalności?",
        answer:
          "Nasze specjalności to autentyczne dania bliskowschodnie, w tym mezze, grillowane mięsa, świeże sałatki i tradycyjne desery. Szczególnie polecamy nasze autorskie dania 'by BASMA' oraz tradycyjne kebaby i falafel.",
      },
      {
        question: "Czy oferujecie menu dla dzieci?",
        answer:
          "Tak, mamy specjalne opcje dla dzieci, w tym łagodniejsze wersje naszych dań głównych oraz proste, smaczne potrawy, które przypadną do gustu młodszym gościom.",
      },
    ],
  },
  {
    category: "Alergeny i Diety",
    questions: [
      {
        question: "Jak mogę dowiedzieć się o alergenach w daniach?",
        answer:
          "Wszystkie informacje o alergenach są dostępne w naszym menu oraz na stronie internetowej w sekcji 'Alergeny'. Nasz personel jest również przeszkolony w zakresie składników dań i chętnie udzieli szczegółowych informacji.",
      },
      {
        question: "Czy oferujecie dania bezglutenowe?",
        answer:
          "Tak, mamy kilka opcji bezglutenowych w naszym menu. Prosimy o poinformowanie obsługi o nietolerancji glutenu przy składaniu zamówienia, abyśmy mogli zapewnić bezpieczne przygotowanie posiłku.",
      },
      {
        question: "Czy mogę dostosować danie do moich potrzeb dietetycznych?",
        answer:
          "Tak, w miarę możliwości staramy się dostosować nasze dania do indywidualnych potrzeb dietetycznych. Prosimy o wcześniejsze poinformowanie nas o szczególnych wymaganiach.",
      },
    ],
  },
  {
    category: "Godziny i Lokalizacja",
    questions: [
      {
        question: "Jakie są wasze godziny otwarcia?",
        answer:
          "Restauracja jest otwarta: Poniedziałek-Czwartek 12:00-23:00, Piątek 12:00-00:00, Sobota 10:00-00:00, Niedziela 10:00-23:00. Szczegółowe informacje o aktualnym statusie znajdziesz na naszej stronie.",
      },
      {
        question: "Gdzie się znajdujecie?",
        answer: "Znajdujemy się przy ul. Krakowskie Przedmieście 3 w Lublinie.",
      },
      {
        question: "Czy macie parking?",
        answer:
          "W bezpośrednim sąsiedztwie restauracji dostępne są miejsca parkingowe płatne oraz bezpłatne po określonych godzinach. Szczegółowe informacje o parkowaniu udzielimy telefonicznie.",
      },
    ],
  },
  {
    category: "Płatności i Inne",
    questions: [
      {
        question: "Jakie formy płatności przyjmujecie?",
        answer:
          "Przyjmujemy płatności gotówką oraz kartami płatniczymi (Visa, Mastercard, BLIK). Akceptujemy również płatności mobilne.",
      },
      {
        question: "Czy oferujecie catering?",
        answer:
          "Tak, oferujemy usługi cateringowe na różne okazje. Prosimy o kontakt z wyprzedzeniem, aby omówić szczegóły menu i logistykę.",
      },
      {
        question: "Czy macie Wi-Fi dla gości?",
        answer: "Tak, oferujemy bezpłatne Wi-Fi dla wszystkich naszych gości. Hasło dostępne jest u obsługi.",
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#597FB1] via-[#326096] to-[#2B2B2B]">
      {/* Header */}
      <header className="bg-[#2B2B2B]/80 backdrop-blur-md border-b border-[#BA9D76]/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-white hover:text-[#BA9D76] hover:bg-white/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Powrót do strony głównej
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className={`text-4xl md:text-5xl font-semibold text-white mb-4 ${archivo.className}`}>
              Często Zadawane Pytania
            </h1>
            <p className={`text-xl text-white/80 max-w-2xl mx-auto font-light ${archivo.className}`}>
              Znajdź odpowiedzi na najczęściej zadawane pytania dotyczące naszej restauracji, menu i usług
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* FAQ Content */}
            <div className="lg:col-span-2 space-y-8">
              {faqData.map((category, categoryIndex) => (
                <Card key={categoryIndex} className="bg-white/10 backdrop-blur-lg border-[#BA9D76]/25 shadow-2xl">
                  <CardHeader>
                    <CardTitle className={`text-2xl text-white ${archivo.className}`}>{category.category}</CardTitle>
                    <CardDescription className={`text-white/70 font-light ${archivo.className}`}>
                      Odpowiedzi na pytania dotyczące {category.category.toLowerCase()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="space-y-2">
                      {category.questions.map((faq, faqIndex) => (
                        <AccordionItem
                          key={faqIndex}
                          value={`${categoryIndex}-${faqIndex}`}
                          className="border-[#BA9D76]/20"
                        >
                          <AccordionTrigger
                            className={`text-white hover:text-[#BA9D76] text-left font-light ${archivo.className}`}
                          >
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className={`text-white/80 leading-relaxed font-light ${archivo.className}`}>
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Hours Widget */}
              <HoursWidget />

              {/* Quick Contact */}
              <Card className="bg-white/10 backdrop-blur-lg border-[#BA9D76]/25 shadow-2xl">
                <CardHeader>
                  <CardTitle className={`text-xl text-white ${archivo.className}`}>Szybki Kontakt</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className={`flex items-center gap-3 text-white/80 font-light ${archivo.className}`}>
                    <Phone className="h-5 w-5 text-[#BA9D76]" />
                    <div>
                      <p className="font-medium text-white">Telefon</p>
                      <p className="text-sm"> +48 574 933 988</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-3 text-white/80 font-light ${archivo.className}`}>
                    <Mail className="h-5 w-5 text-[#BA9D76]" />
                    <div>
                      <p className="font-medium text-white">Email</p>
                      <p className="text-sm">basmalublin@gmail.com</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-3 text-white/80 font-light ${archivo.className}`}>
                    <MapPin className="h-5 w-5 text-[#BA9D76]" />
                    <div>
                      <p className="font-medium text-white">Adres</p>
                      <p className="text-sm">
                        Krakowskie Przedmieście 3
                        <br />
                        20-002 Lublin
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Help */}
              <Card className="bg-white/10 backdrop-blur-lg border-[#BA9D76]/25 shadow-2xl">
                <CardHeader>
                  <CardTitle className={`text-xl text-white ${archivo.className}`}>Potrzebujesz Pomocy?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className={`text-white/80 text-sm font-light ${archivo.className}`}>
                    Nie znalazłeś odpowiedzi na swoje pytanie? Skontaktuj się z nami bezpośrednio.
                  </p>
                  <div className="space-y-2">
                    <Link href="tel:+48574933988">
                      <Button className="w-full bg-[#BA9D76]/80 hover:bg-[#BA9D76] text-white border border-[#BA9D76]/50">
                        <Phone className="h-4 w-4 mr-2" />
                        Zadzwoń Teraz
                      </Button>
                    </Link>
                    <Link href="/#contact">
                      <Button
                        variant="outline"
                        className="w-full border-[#BA9D76]/60 text-white hover:bg-[#BA9D76]/20 bg-transparent"
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Formularz Kontaktowy
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
