import { loginAdmin } from '@/app/actions/auth-actions'
import { Archivo } from 'next/font/google'
import Image from 'next/image'
import { PasswordInput } from './password-input'

const archivo = Archivo({
    subsets: ["latin"],
    weight: ["200", "400", "600", "700"],
    display: "swap",
})

export const dynamic = 'force-dynamic'

export default async function AdminLoginPage() {
    return (
        <div className={`min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2d2d2d] to-[#1a1a1a] flex items-center justify-center p-4 ${archivo.className}`}>
            <div className="w-full max-w-md">
                {/* Login Card */}
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
                    {/* Logo */}
                    <div className="flex justify-center mb-8">
                        <div className="relative w-32 h-16">
                            <Image
                                src="/images/basma-blue-logo.png"
                                alt="Basma Mezze & Grill"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </div>

                    {/* Title */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-[#BA9D76] mb-2">Panel Administracyjny</h1>
                        <p className="text-white/40 text-sm uppercase tracking-widest font-bold">Zaloguj się</p>
                    </div>

                    {/* Login Form */}
                    <form action={async (formData: FormData) => {
                        "use server"
                        await loginAdmin(formData)
                    }} className="space-y-6">
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-white/60 mb-2">
                                Hasło
                            </label>
                            <PasswordInput />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-[#BA9D76] to-[#8B7355] hover:from-[#8B7355] hover:to-[#BA9D76] text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        >
                            Zaloguj się
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <p className="text-white/20 text-xs">
                            © 2024 Basma Mezze & Grill • Lublin
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
