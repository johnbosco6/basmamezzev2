"use client"

import { useState } from "react"
import { Archivo } from "next/font/google"
import { motion } from "framer-motion"
import { User, Mail, Phone, MessageSquare, Send, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

const archivo = Archivo({ subsets: ["latin"], weight: ["200", "400", "600", "700"], display: "swap" })

export function PartyBoxContact() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: "Chciałbym zapytać o dostępność Party Boxa."
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            // Reusing the special-events API since it's already set up to handle inquiries
            const response = await fetch("/api/special-events", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    eventType: "Party Box Inquiry"
                })
            })

            if (response.ok) {
                setIsSuccess(true)
                toast.success("Zapytanie zostało wysłane!")
            } else {
                toast.error("Błąd podczas wysyłania zapytania.")
            }
        } catch (error) {
            toast.error("Błąd połączenia.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <section id="party-box-contact" className="py-20 bg-gray-50/50 rounded-[3rem] border border-gray-100">
            <div className="max-w-4xl mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className={`text-3xl md:text-4xl font-semibold text-gray-900 mb-4 ${archivo.className}`}>
                        Zapytaj o swój Party Box
                    </h2>
                    <p className={`text-gray-600 max-w-2xl mx-auto ${archivo.className}`}>
                        Wypełnij formularz, zadzwoń lub napisz do nas. Odpowiemy tak szybko, jak to możliwe.
                    </p>
                </div>

                <div className="grid md:grid-cols-5 gap-12 items-start">
                    {/* Contact Info */}
                    <div className="md:col-span-2 space-y-8">
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 group">
                                <div className="h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#BA9D76] group-hover:scale-110 transition-transform">
                                    <Phone className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Zadzwoń</p>
                                    <a href="tel:+48574933988" className={`text-lg font-semibold text-gray-900 hover:text-[#BA9D76] transition-colors ${archivo.className}`}>
                                        +48 574 933 988
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 group">
                                <div className="h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#BA9D76] group-hover:scale-110 transition-transform">
                                    <Mail className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Napisz</p>
                                    <a href="mailto:basmalublin@gmail.com" className={`text-lg font-semibold text-gray-900 hover:text-[#BA9D76] transition-colors ${archivo.className}`}>
                                        basmalublin@gmail.com
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-[#BA9D76]/5 rounded-2xl border border-[#BA9D76]/10">
                            <p className={`text-sm text-[#BA9D76] leading-relaxed italic ${archivo.className}`}>
                                "Nasze Party Boxy to gwarancja świeżości i autentycznego smaku Bliskiego Wschodu na Twoim stole."
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="md:col-span-3">
                        {isSuccess ? (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-10 bg-white rounded-3xl border border-green-100 shadow-xl text-center space-y-4"
                            >
                                <div className="h-16 w-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto">
                                    <CheckCircle2 className="h-10 w-10" />
                                </div>
                                <h3 className={`text-2xl font-bold text-gray-900 ${archivo.className}`}>Wysłano!</h3>
                                <p className="text-gray-600">Dziękujemy za zapytanie. Skontaktujemy się z Tobą wkrótce.</p>
                                <Button 
                                    variant="outline" 
                                    onClick={() => setIsSuccess(false)}
                                    className="mt-4 rounded-full px-8"
                                >
                                    Wyślij nowe zapytanie
                                </Button>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="ml-1 text-gray-700">Imię</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input 
                                                id="name" 
                                                name="name" 
                                                required 
                                                placeholder="Twoje imię" 
                                                className="pl-10 py-6 rounded-xl border-gray-100 bg-white"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className="ml-1 text-gray-700">Telefon</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input 
                                                id="phone" 
                                                name="phone" 
                                                required 
                                                type="tel"
                                                placeholder="Nr telefonu" 
                                                className="pl-10 py-6 rounded-xl border-gray-100 bg-white"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="ml-1 text-gray-700">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input 
                                            id="email" 
                                            name="email" 
                                            required 
                                            type="email"
                                            placeholder="kontakt@twojmail.pl" 
                                            className="pl-10 py-6 rounded-xl border-gray-100 bg-white"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="message" className="ml-1 text-gray-700">Wiadomość</Label>
                                    <div className="relative">
                                        <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Textarea 
                                            id="message" 
                                            name="message" 
                                            required 
                                            placeholder="Opisz swoje potrzeby..." 
                                            className="pl-10 py-3 rounded-xl border-gray-100 bg-white min-h-[100px]"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>

                                <Button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                    className="w-full py-7 h-auto text-lg rounded-xl bg-[#BA9D76] hover:bg-[#BA9D76]/90 text-white font-semibold shadow-lg transition-all"
                                >
                                    {isSubmitting ? "Wysyłanie..." : "Wyślij Zapytanie"}
                                    {!isSubmitting && <Send className="ml-2 h-5 w-5" />}
                                </Button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}
