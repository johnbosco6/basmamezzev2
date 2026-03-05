import { client } from "@/lib/sanity"
import { urlFor } from "@/lib/sanity"
import Image from "next/image"
import Link from "next/link"
import { PortableText } from "@portabletext/react"
import { Home, BookOpen, MessageCircle, ShoppingBag, Calendar, Phone } from "lucide-react"
import { Archivo } from "next/font/google"

const archivo = Archivo({ subsets: ["latin"], weight: ["200", "400", "600", "700"], display: "swap" })

// Always fetch fresh from Sanity — never use cached/stale data
export const dynamic = "force-dynamic"
export const revalidate = 0

async function getOffers() {
    const query = `*[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    image,
    body
  }`
    return client.fetch(query, {}, { cache: "no-store" })
}

export default async function OffersPage() {
    const offers = await getOffers()

    return (
        <div className="min-h-screen bg-white text-gray-900">
            {/* Header */}
            <header className="sticky top-0 z-50 backdrop-blur-md bg-[#597FB1]/80 border-b border-white/10">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex-1 flex justify-start"></div>
                    <nav className="flex-1 flex items-center justify-center gap-2 md:gap-6 backdrop-blur-md bg-white/15 border border-white/25 rounded-full px-2 md:px-6 py-3 shadow-lg">
                        <Link href="/" className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/20 hover:shadow-lg text-white/80 hover:text-[#BA9D76] group">
                            <Home className="h-4 w-4 transition-colors duration-300" />
                            <span className={`text-xs font-light ${archivo.className}`}>Strona Główna</span>
                        </Link>
                        <Link href="/menu" className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/20 hover:shadow-lg text-white/80 hover:text-[#BA9D76] group">
                            <BookOpen className="h-4 w-4 transition-colors duration-300" />
                            <span className={`text-xs font-light ${archivo.className}`}>Menu</span>
                        </Link>
                        <Link href="/order" className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/20 hover:shadow-lg text-white/80 hover:text-[#BA9D76] group">
                            <ShoppingBag className="h-4 w-4 transition-colors duration-300" />
                            <span className={`text-xs font-light ${archivo.className}`}>Zamów Online</span>
                        </Link>
                        <Link href="/special-events" className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/20 hover:shadow-lg text-white/80 hover:text-[#BA9D76] group">
                            <Calendar className="h-4 w-4 transition-colors duration-300" />
                            <span className={`text-xs font-light ${archivo.className}`}>Eventy</span>
                        </Link>
                        <Link href="/faq" className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/20 hover:shadow-lg text-white/80 hover:text-[#BA9D76] group">
                            <MessageCircle className="h-4 w-4 transition-colors duration-300" />
                            <span className={`text-xs font-light ${archivo.className}`}>FAQ</span>
                        </Link>
                        <Link href="/#contact" className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/20 hover:shadow-lg text-white/80 hover:text-[#BA9D76] group">
                            <Phone className="h-4 w-4 transition-colors duration-300" />
                            <span className={`text-xs font-light ${archivo.className}`}>Kontakt</span>
                        </Link>
                    </nav>
                    <div className="flex-1 flex justify-end"></div>
                </div>
            </header>

            <div className="container mx-auto py-12 px-4">
                <h1 className="text-4xl font-bold mb-8 text-center text-primary">Aktualne Oferty i Nowości</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {offers.length > 0 ? (
                        offers.map((offer: any) => (
                            <Link href={`/offers/${offer.slug.current}`} key={offer._id} className="block group">
                                <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow dark:bg-zinc-900 bg-white h-full">
                                    {offer.image && (
                                        <div className="relative h-64 w-full">
                                            <Image
                                                src={urlFor(offer.image).url()}
                                                alt={offer.title}
                                                fill
                                                className="object-cover transition-transform group-hover:scale-105"
                                            />
                                        </div>
                                    )}
                                    <div className="p-6">
                                        <h2 className="text-2xl font-semibold mb-2 group-hover:text-primary transition-colors">{offer.title}</h2>
                                        <div className="text-muted-foreground text-sm mb-4">
                                            {new Date(offer.publishedAt).toLocaleDateString("pl-PL")}
                                        </div>
                                        <div className="prose dark:prose-invert max-w-none line-clamp-3">
                                            {offer.body && <PortableText value={offer.body} />}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12 text-muted-foreground">
                            <p className="text-xl">Brak aktualnych ofert w tej chwili.</p>
                            <p className="mt-2">Odwiedź nasze Studio (/studio), aby dodać nowe.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
