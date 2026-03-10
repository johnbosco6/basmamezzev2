import { MainNavbar } from "@/components/main-navbar"
import { Archivo } from "next/font/google"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const archivo = Archivo({
    subsets: ["latin"],
    weight: ["200", "400", "600", "700"],
    display: "swap",
})

export default function PolitykaZwrotowPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#597FB1] via-[#326096] to-[#2B2B2B] text-white">
            <MainNavbar />

            {/* Hero Section */}
            <section className="relative py-16 overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className={`text-4xl md:text-5xl font-semibold mb-6 text-white drop-shadow-lg ${archivo.className}`}>
                            Polityka Zwrotów
                        </h1>
                        <p className={`text-xl text-white/90 drop-shadow-md font-light ${archivo.className}`}>
                            Zasady zwrotów i odstąpienia od umowy w restauracji Basma Mezze & Grill
                        </p>
                    </div>
                </div>
            </section>

            {/* Content */}
            <main className="py-12">
                <div className="container mx-auto px-4 max-w-4xl">
                    <Card className="backdrop-blur-lg bg-white/10 border border-[#BA9D76]/20 shadow-xl">
                        <CardHeader>
                            <CardTitle className={`text-2xl text-white ${archivo.className}`}>Polityka Zwrotów i Reklamacji</CardTitle>
                            <p className="text-white/80 text-sm">Ostatnia aktualizacja: {new Date().toLocaleDateString("pl-PL")}</p>
                        </CardHeader>
                        <CardContent className="space-y-8 text-white/90">
                            <section>
                                <h2 className={`text-xl font-semibold mb-4 text-[#BA9D76] ${archivo.className}`}>
                                    1. Informacje o firmie
                                </h2>
                                <div className={`space-y-3 text-sm leading-relaxed font-light ${archivo.className}`}>
                                    <p>
                                        Właścicielem restauracji Basma Mezze & Grill jest:
                                        <br />
                                        <strong>Basma Mezze & Grill</strong>
                                        <br />
                                        ul. Krakowskie Przedmieście 3
                                        <br />
                                        20-002 Lublin, Polska
                                        <br />
                                        NIP: 714 185 55 52
                                        <br />
                                        E-mail: basmalublin@gmail.com
                                        <br />
                                        Tel: +48 574 933 988
                                    </p>
                                </div>
                            </section>

                            <section>
                                <h2 className={`text-xl font-semibold mb-4 text-[#BA9D76] ${archivo.className}`}>
                                    2. Odstąpienie od umowy (Zwroty)
                                </h2>
                                <div className={`space-y-3 text-sm leading-relaxed font-light ${archivo.className}`}>
                                    <p>
                                        Zgodnie z polskim prawem (Ustawa o prawach konsumenta), prawo do odstąpienia od umowy zawartej na
                                        odległość w ciągu 14 dni nie przysługuje w przypadku:
                                    </p>
                                    <ul className="ml-6 space-y-1">
                                        <li>
                                            • Produktów ulegających szybkiemu zepsuciu lub mających krótki termin przydatności (wszystkie
                                            potrawy i napoje przygotowywane w Restauracji).
                                        </li>
                                        <li>
                                            • Usług gastronomicznych, jeżeli Restauracja wykonała w pełni usługę za wyraźną zgodą konsumenta.
                                        </li>
                                        <li>
                                            • Produktów dostarczanych w zapieczętowanym opakowaniu, których po otwarciu nie można zwrócić ze
                                            względów higienicznych.
                                        </li>
                                    </ul>
                                    <p className="mt-4">
                                        W przypadku produktów innych niż żywność (np. karty upominkowe zakupione online), mają Państwo prawo
                                        odstąpić od umowy w terminie 14 dni bez podania przyczyny.
                                    </p>
                                </div>
                            </section>

                            <section>
                                <h2 className={`text-xl font-semibold mb-4 text-[#BA9D76] ${archivo.className}`}>3. Reklamacje</h2>
                                <div className={`space-y-3 text-sm leading-relaxed font-light ${archivo.className}`}>
                                    <p>
                                        Zależy nam na najwyższej jakości naszych usług. Jeśli są Państwo niezadowoleni z otrzymanego
                                        posiłku, prosimy o:
                                    </p>
                                    <ul className="ml-6 space-y-1">
                                        <li>• Bezzwłoczne zgłoszenie zastrzeżeń personelowi Restauracji (w przypadku konsumpcji na miejscu).</li>
                                        <li>• Kontakt telefoniczny pod numerem +48 574 933 988 (w przypadku zamówień z dostawą/odbiorem).</li>
                                    </ul>
                                    <p>
                                        Reklamacja powinna zawierać opis problemu oraz (jeśli to możliwe) zdjęcie produktu. Restauracja rozpatrzy
                                        reklamację niezwłocznie, nie później niż w ciągu 14 dni.
                                    </p>
                                </div>
                            </section>

                            <section>
                                <h2 className={`text-xl font-semibold mb-4 text-[#BA9D76] ${archivo.className}`}>4. Zwrot płatności</h2>
                                <div className={`space-y-3 text-sm leading-relaxed font-light ${archivo.className}`}>
                                    <p>
                                        W przypadku uznania reklamacji lub skutecznego odstąpienia od umowy (tam gdzie jest to możliwe):
                                    </p>
                                    <ul className="ml-6 space-y-1">
                                        <li>• Zwrot środków nastąpi przy użyciu takiego samego sposobu płatności, jakiego użyli Państwo w pierwotnej transakcji.</li>
                                        <li>• Czas przetwarzania zwrotu zależy od banku lub dostawcy płatności i zazwyczaj wynosi od 3 do 7 dni roboczych.</li>
                                    </ul>
                                </div>
                            </section>

                            <section>
                                <h2 className={`text-xl font-semibold mb-4 text-[#BA9D76] ${archivo.className}`}>5. Rezerwacje</h2>
                                <div className={`space-y-3 text-sm leading-relaxed font-light ${archivo.className}`}>
                                    <p>
                                        Prosimy o anulowanie rezerwacji stolików z co najmniej 2-godzinnym wyprzedzeniem. W przypadku
                                        rezerwacji grupowych (powyżej 8 osób) mogą obowiązywać indywidualne zasady dotyczące zadatku, o których
                                        zostaną Państwo poinformowani podczas dokonywania rezerwacji.
                                    </p>
                                </div>
                            </section>

                            <div className="mt-8 p-6 bg-[#BA9D76]/20 rounded-lg border border-[#BA9D76]/30 flex items-start gap-4">
                                <RefreshCw className="h-6 w-6 text-[#BA9D76] flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className={`text-lg font-semibold text-white mb-2 ${archivo.className}`}>Masz pytania?</h3>
                                    <p className={`text-sm text-white/90 font-light ${archivo.className}`}>
                                        Jeśli potrzebujesz pomocy w sprawie zwrotu lub reklamacji, skontaktuj się z nami bezpośrednio:
                                        <br />
                                        <strong>Email:</strong> basmalublin@gmail.com
                                        <br />
                                        <strong>Tel:</strong> +48 574 933 988
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}
