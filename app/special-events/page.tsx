"use client"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Utensils, Phone, Mail, User, Calendar as CalendarIcon, Users, MessageSquare, Send, CheckCircle2 } from "lucide-react"
import { Archivo } from "next/font/google"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { MainNavbar } from "@/components/main-navbar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const archivo = Archivo({
    subsets: ["latin"],
    weight: ["200", "400", "600", "700"],
    display: "swap",
})

export default function SpecialEventsPage() {
    const [mounted, setMounted] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        eventType: "",
        date: "",
        guests: "",
        message: ""
    })

    useEffect(() => { setMounted(true) }, [])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSelectChange = (value: string) => {
        setFormData(prev => ({ ...prev, eventType: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const response = await fetch("/api/special-events", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })

            if (response.ok) {
                setIsSuccess(true)
                toast.success("Zapytanie zostało wysłane pomyślnie!")
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    eventType: "",
                    date: "",
                    guests: "",
                    message: ""
                })
            } else {
                toast.error("Wystąpił błąd podczas wysyłania zapytania.")
            }
        } catch (error) {
            toast.error("Wystąpił błąd połączenia.")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!mounted) return null

    return (
        <div className="min-h-screen bg-white text-gray-900 pt-[240px] md:pt-[200px]">
            <MainNavbar />

            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden bg-gradient-to-r from-[#597FB1] to-[#BA9D76]">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-black/20" />
                </div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center max-w-4xl mx-auto">
                        <h1 className={`text-4xl md:text-7xl font-semibold mb-6 text-white tracking-tight ${archivo.className}`}>
                            Imprezy Okolicznościowe
                        </h1>
                        <p className={`text-xl md:text-2xl text-white/90 font-light leading-relaxed mb-10 max-w-3xl mx-auto ${archivo.className}`}>
                            Zorganizuj niezapomniane wydarzenie w Basma Mezze & Grill. Oferujemy dedykowane pakiety menu dla grup i na specjalne okazje. 
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Button 
                                size="lg" 
                                onClick={() => document.getElementById('event-form')?.scrollIntoView({ behavior: 'smooth' })}
                                className="bg-white text-[#597FB1] hover:bg-white/90 px-8 py-7 h-auto text-lg rounded-full shadow-xl transition-all hover:scale-105 active:scale-95 border-none font-medium"
                            >
                                <Mail className="mr-2 h-5 w-5" />
                                Zorganizuj Wydarzenie
                            </Button>
                            <Link href="tel:+48574933988">
                                <Button 
                                    size="lg" 
                                    variant="outline"
                                    className="border-white/30 text-white hover:bg-white/10 px-8 py-7 h-auto text-lg rounded-full bg-transparent shadow-lg transition-all hover:scale-105 active:scale-95 font-medium"
                                >
                                    <Phone className="mr-2 h-5 w-5" />
                                    Zadzwoń Teraz
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Form Section */}
            <main className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="grid lg:grid-cols-5 gap-16">
                            {/* Left Side: Info */}
                            <div className="lg:col-span-2 space-y-10">
                                <div>
                                    <h2 className={`text-3xl font-semibold mb-6 text-gray-900 ${archivo.className}`}>Zaplanuj Swoje Wydarzenie</h2>
                                    <p className={`text-gray-600 leading-relaxed font-light ${archivo.className}`}>
                                        Od urodzin po imprezy firmowe — sprawimy, że Twój wieczór będzie wyjątkowy. Wypełnij formularz, a nasz zespół skontaktuje się z Tobą w ciągu 24 godzin.
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 transition-colors hover:bg-[#BA9D76]/5">
                                        <div className="h-10 w-10 rounded-full bg-[#BA9D76]/10 flex items-center justify-center flex-shrink-0">
                                            <Phone className="h-5 w-5 text-[#BA9D76]" />
                                        </div>
                                        <div>
                                            <p className={`text-sm text-gray-400 font-medium uppercase tracking-wider ${archivo.className}`}>Telefon</p>
                                            <p className={`text-lg text-gray-900 font-medium ${archivo.className}`}>+48 574 933 988</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 transition-colors hover:bg-[#597FB1]/5">
                                        <div className="h-10 w-10 rounded-full bg-[#597FB1]/10 flex items-center justify-center flex-shrink-0">
                                            <Mail className="h-5 w-5 text-[#597FB1]" />
                                        </div>
                                        <div>
                                            <p className={`text-sm text-gray-400 font-medium uppercase tracking-wider ${archivo.className}`}>Email</p>
                                            <p className={`text-lg text-gray-900 font-medium ${archivo.className}`}>basmalublin@gmail.com</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: Form */}
                            <div id="event-form" className="lg:col-span-3">
                                {isSuccess ? (
                                    <div className="p-12 text-center bg-green-50 border border-green-100 rounded-[2.5rem] space-y-6 animate-in fade-in zoom-in duration-500">
                                        <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                                            <CheckCircle2 className="h-10 w-10 text-green-600" />
                                        </div>
                                        <h3 className={`text-2xl font-semibold text-gray-900 ${archivo.className}`}>Wysłano Zapytanie!</h3>
                                        <p className={`text-gray-600 font-light ${archivo.className}`}>
                                            Dziękujemy. Nasz zespół skontaktuje się z Tobą tak szybko, jak to możliwe.
                                        </p>
                                        <Button 
                                            onClick={() => setIsSuccess(false)}
                                            variant="outline"
                                            className="rounded-full px-8 py-6 h-auto text-lg border-green-200 text-green-700 hover:bg-green-100"
                                        >
                                            Wyślij kolejną wiadomość
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="p-8 md:p-10 rounded-[2.5rem] bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="name" className="text-gray-700 font-medium ml-1">Imię i Nazwisko</Label>
                                                <div className="relative">
                                                    <User className="absolute left-4 top-3 h-4 w-4 text-gray-400" />
                                                    <Input 
                                                        id="name" 
                                                        name="name"
                                                        placeholder="np. Jan Kowalski" 
                                                        className="pl-11 py-6 bg-gray-50/50 border-gray-100 focus:bg-white transition-all rounded-xl h-auto"
                                                        required
                                                        value={formData.name}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label htmlFor="email" className="text-gray-700 font-medium ml-1">Adres Email</Label>
                                                    <div className="relative">
                                                        <Mail className="absolute left-4 top-3 h-4 w-4 text-gray-400" />
                                                        <Input 
                                                            id="email" 
                                                            name="email"
                                                            type="email" 
                                                            placeholder="kontakt@twojmail.pl" 
                                                            className="pl-11 py-6 bg-gray-50/50 border-gray-100 focus:bg-white transition-all rounded-xl h-auto"
                                                            required
                                                            value={formData.email}
                                                            onChange={handleInputChange}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="phone" className="text-gray-700 font-medium ml-1">Numer Telefonu</Label>
                                                    <div className="relative">
                                                        <Phone className="absolute left-4 top-3 h-4 w-4 text-gray-400" />
                                                        <Input 
                                                            id="phone" 
                                                            name="phone"
                                                            type="tel" 
                                                            placeholder="+48 123 456 789" 
                                                            className="pl-11 py-6 bg-gray-50/50 border-gray-100 focus:bg-white transition-all rounded-xl h-auto"
                                                            required
                                                            value={formData.phone}
                                                            onChange={handleInputChange}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="eventType" className="text-gray-700 font-medium ml-1">Typ Wydarzenia</Label>
                                                <Select onValueChange={handleSelectChange} required>
                                                    <SelectTrigger className="py-6 bg-gray-50/50 border-gray-100 focus:bg-white transition-all rounded-xl h-auto text-gray-500">
                                                        <SelectValue placeholder="Wybierz rodzaj imprezy" />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                                                        <SelectItem value="urodziny">Urodziny</SelectItem>
                                                        <SelectItem value="firmowa">Impreza Firmowa</SelectItem>
                                                        <SelectItem value="wesele">Przyjęcie Weselne</SelectItem>
                                                        <SelectItem value="inne">Inne Wydarzenie</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label htmlFor="date" className="text-gray-700 font-medium ml-1">Data</Label>
                                                    <div className="relative">
                                                        <CalendarIcon className="absolute left-4 top-3 h-4 w-4 text-gray-400" />
                                                        <Input 
                                                            id="date" 
                                                            name="date"
                                                            type="date" 
                                                            className="pl-11 py-6 bg-gray-50/50 border-gray-100 focus:bg-white transition-all rounded-xl h-auto block w-full"
                                                            required
                                                            value={formData.date}
                                                            onChange={handleInputChange}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="guests" className="text-gray-700 font-medium ml-1">Liczba Gości</Label>
                                                    <div className="relative">
                                                        <Users className="absolute left-4 top-3 h-4 w-4 text-gray-400" />
                                                        <Input 
                                                            id="guests" 
                                                            name="guests"
                                                            type="number" 
                                                            placeholder="Liczba osób" 
                                                            className="pl-11 py-6 bg-gray-50/50 border-gray-100 focus:bg-white transition-all rounded-xl h-auto"
                                                            required
                                                            value={formData.guests}
                                                            onChange={handleInputChange}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="message" className="text-gray-700 font-medium ml-1">Dodatkowe Uwagi</Label>
                                                <div className="relative">
                                                    <MessageSquare className="absolute left-4 top-3 h-4 w-4 text-gray-400" />
                                                    <Textarea 
                                                        id="message" 
                                                        name="message"
                                                        placeholder="Napisz nam o swoich preferencjach..." 
                                                        className="pl-11 py-4 bg-gray-50/50 border-gray-100 focus:bg-white transition-all rounded-xl min-h-[120px]"
                                                        value={formData.message}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>
                                            </div>

                                            <Button 
                                                type="submit" 
                                                disabled={isSubmitting}
                                                className="w-full bg-[#BA9D76] hover:bg-[#BA9D76]/90 text-white border-none py-7 h-auto text-xl rounded-xl shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] mt-4 font-semibold"
                                            >
                                                {isSubmitting ? (
                                                    <span className="flex items-center gap-2">
                                                        <div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                                        Wysyłanie...
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-2">
                                                        Wyślij Zapytanie
                                                        <Send className="h-5 w-5" />
                                                    </span>
                                                )}
                                            </Button>
                                        </form>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer link back to home */}
            <footer className="py-12 bg-gray-50 border-t border-gray-100 flex justify-center">
                <Link
                    href="/"
                    className={`text-[#597FB1] hover:text-[#BA9D76] transition-all flex items-center gap-2 text-lg font-light group ${archivo.className}`}
                >
                    <Utensils className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
                    <span>Powrót do strony głównej</span>
                </Link>
            </footer>
        </div>
    )
}
