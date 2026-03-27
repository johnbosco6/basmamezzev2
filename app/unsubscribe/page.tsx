"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { MainNavbar } from "@/components/main-navbar"
import { MainFooter } from "@/components/main-footer"
import { Archivo } from "next/font/google"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, AlertCircle, Loader2, UserX } from "lucide-react"

const archivo = Archivo({
    subsets: ["latin"],
    weight: ["200", "400", "600", "700"],
    display: "swap",
})

function UnsubscribeContent() {
    const searchParams = useSearchParams()
    const email = searchParams.get("email")
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
    const [message, setMessage] = useState("")

    const handleUnsubscribe = async () => {
        if (!email) return

        setStatus("loading")
        try {
            const res = await fetch("/api/unsubscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            })

            if (res.ok) {
                setStatus("success")
                setMessage("Twoje dane zostały pomyślnie usunięte z naszej bazy marketingowej.")
            } else {
                setStatus("error")
                setMessage("Wystąpił błąd podczas usuwania danych. Spróbuj ponownie później lub skontaktuj się z nami bezpośrednio.")
            }
        } catch (err) {
            setStatus("error")
            setMessage("Błąd połączenia. Sprawdź swoje połączenie internetowe i spróbuj ponownie.")
        }
    }

    if (!email) {
        return (
            <Card className="backdrop-blur-lg bg-white/10 border border-red-500/20 shadow-xl max-w-md mx-auto">
                <CardContent className="pt-8 pb-8 text-center">
                    <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                    <h2 className={`text-xl font-semibold text-white mb-2 ${archivo.className}`}>Nieprawidłowy link</h2>
                    <p className="text-white/70 text-sm">Nie znaleziono adresu email w linku. Jeśli chcesz usunąć swoje dane, skontaktuj się z nami pod adresem basmalublin@gmail.com.</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="backdrop-blur-lg bg-white/10 border border-[#BA9D76]/20 shadow-xl max-w-lg mx-auto overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-[#597FB1] to-[#326096] border-b border-[#BA9D76]/20">
                <CardTitle className={`text-xl text-white flex items-center gap-2 ${archivo.className}`}>
                    <UserX className="h-5 w-5 text-[#BA9D76]" />
                    Zarządzanie Danymi Osobowymi
                </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
                {status === "idle" && (
                    <div className="text-center space-y-6">
                        <div className="space-y-2">
                            <p className="text-white font-medium">Czy na pewno chcesz usunąć swoje dane?</p>
                            <p className="text-white/60 text-sm leading-relaxed">
                                Operacja ta spowoduje trwałe usunięcie adresu <span className="text-[#BA9D76] font-semibold">{email}</span> oraz powiązanego numeru telefonu z naszej bazy marketingowej. 
                                Nie będziesz już otrzymywać od nas powiadomień o promocjach i ofertach specjalnych.
                            </p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Button 
                                onClick={handleUnsubscribe}
                                className="bg-red-500 hover:bg-red-600 text-white font-bold h-12 rounded-xl shadow-lg transition-all"
                            >
                                Potwierdzam usunięcie moich danych
                            </Button>
                            <Button 
                                variant="ghost" 
                                onClick={() => window.location.href = '/'}
                                className="text-white/60 hover:text-white hover:bg-white/10"
                            >
                                Anuluj i wróć do strony głównej
                            </Button>
                        </div>
                    </div>
                )}

                {status === "loading" && (
                    <div className="py-12 text-center space-y-4">
                        <Loader2 className="h-12 w-12 text-[#BA9D76] animate-spin mx-auto" />
                        <p className="text-white/80 animate-pulse">Przetwarzanie Twojej prośby...</p>
                    </div>
                )}

                {status === "success" && (
                    <div className="py-8 text-center space-y-6 animate-in fade-in zoom-in duration-300">
                        <CheckCircle2 className="h-16 w-16 text-green-400 mx-auto" />
                        <div className="space-y-2">
                            <h2 className={`text-2xl font-bold text-white ${archivo.className}`}>Gotowe!</h2>
                            <p className="text-white/70">{message}</p>
                        </div>
                        <Button 
                            onClick={() => window.location.href = '/'}
                            className="bg-[#BA9D76] hover:bg-[#BA9D76]/90 text-white px-8 h-12 rounded-xl"
                        >
                            Wróć do strony głównej
                        </Button>
                    </div>
                )}

                {status === "error" && (
                    <div className="py-8 text-center space-y-6 animate-in fade-in zoom-in duration-300">
                        <AlertCircle className="h-16 w-16 text-red-400 mx-auto" />
                        <div className="space-y-2">
                            <h2 className={`text-2xl font-bold text-white ${archivo.className}`}>Wystąpił błąd</h2>
                            <p className="text-white/70">{message}</p>
                        </div>
                        <Button 
                            onClick={() => setStatus("idle")}
                            variant="outline"
                            className="border-[#BA9D76] text-[#BA9D76] hover:bg-[#BA9D76]/10 px-8 h-12 rounded-xl"
                        >
                            Spróbuj ponownie
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default function UnsubscribePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#597FB1] via-[#326096] to-[#2B2B2B] text-white">
            <MainNavbar />
            <main className="container mx-auto px-4 py-24">
                <Suspense fallback={
                    <div className="flex items-center justify-center p-20">
                        <Loader2 className="h-12 w-12 text-[#BA9D76] animate-spin" />
                    </div>
                }>
                    <UnsubscribeContent />
                </Suspense>
            </main>
            <MainFooter />
        </div>
    )
}
