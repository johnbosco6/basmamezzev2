"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

export function PasswordInput() {
    const [showPassword, setShowPassword] = useState(false)

    return (
        <div className="relative">
            <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                required
                autoFocus
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#BA9D76]/50 transition-all"
                placeholder="Wprowadź hasło administratora"
            />
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors p-1"
                tabIndex={-1}
            >
                {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                ) : (
                    <Eye className="h-5 w-5" />
                )}
            </button>
        </div>
    )
}
