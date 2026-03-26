"use server"

export async function validatePromoCode(code: string) {
    // Hardcoded environmental variable lookup
    const validCode = process.env.PROMO_CODE
    
    // In actual deployment, validCode will be "hellobasma10"
    if (!validCode) {
        // If not set in ENV, fallback for testing or just error out. 
        // We'll allow the env var to drive it.
        return { valid: false, message: "Błąd konfiguracji promocji na serwerze." }
    }

    if (code.toLowerCase().trim() === validCode.toLowerCase().trim()) {
        // 10% discount
        return { valid: true, discountPercent: 10 }
    }

    return { valid: false, message: "Nieprawidłowy kod promocyjny." }
}
