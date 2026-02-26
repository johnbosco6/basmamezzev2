import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Archivo } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"

import { ThemeProvider } from "@/components/theme-provider"
import { CookieConsent } from "@/components/cookie-consent"
import { CookieSettingsButton } from "@/components/cookie-settings-button"
import StyledComponentsRegistry from "@/lib/registry"
import { CartProvider } from "@/context/cart-context"

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["200", "400", "600", "700"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Basma Mezze i Grill - Autentyczna Kuchnia Bliskowschodnia w Lublinie",
  description:
    "Doświadcz autentycznych smaków Bliskiego Wschodu w restauracji Basma Mezze i Grill w Lublinie. Ciesz się naszymi talerzami mezze, grillowanymi specjałami i tradycyjnymi deserami w eleganckim otoczeniu.",
  generator: "v0.dev",
  verification: {
    google: "kMHJYqdKMSr_OQns84feU7o55nGSXYggxQwvsdBNXZE",
  },
  icons: {
    icon: "/images/basma-blue-logo.png",
    apple: "/images/basma-blue-logo.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pl">
      <head>
        <meta name="google-site-verification" content="kMHJYqdKMSr_OQns84feU7o55nGSXYggxQwvsdBNXZE" />
      </head>
      <body className={archivo.className}>
        <StyledComponentsRegistry>
          <CartProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              <Suspense fallback={null}>
                {children}
                <CookieConsent />
                <CookieSettingsButton />
                <Analytics />
              </Suspense>
            </ThemeProvider>
          </CartProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}
