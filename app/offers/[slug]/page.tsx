import { client } from "@/lib/sanity"
import { urlFor } from "@/lib/sanity"
import Image from "next/image"
import { PortableText } from "@portabletext/react"
import Link from "next/link"
import { ArrowLeft, Home, BookOpen, MessageCircle, Megaphone, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Archivo } from "next/font/google"

const archivo = Archivo({ subsets: ["latin"], weight: ["200", "400", "600", "700"], display: "swap" })

export const dynamic = "force-dynamic"
export const revalidate = 0

async function getOffer(slug: string) {
    const query = `*[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    publishedAt,
    image,
    body
  }`
    return client.fetch(query, { slug }, { cache: "no-store" })
}

export default async function OfferPage({ params }: { params: { slug: string } }) {
    const offer = await getOffer(params.slug)

    if (!offer) {
        return (
            <div className="container mx-auto py-12 px-4 text-center">
                <h1 className="text-2xl font-bold mb-4">Oferta nie znaleziona</h1>
                <Link href="/offers">
                    <Button variant="outline">Wróć do ofert</Button>
                </Link>
            </div>
        )
    }

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
                        <Link href="/newsletter" className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 -translate-y-1 bg-white/20 shadow-lg text-[#BA9D76] group">
                            <Megaphone className="h-4 w-4 transition-colors duration-300" />
                            <span className={`text-xs font-light ${archivo.className}`}>Oferty</span>
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

            <div className="container mx-auto py-12 px-4 max-w-4xl">
                <Link href="/offers" className="inline-block mb-6">
                    <Button variant="ghost" className="pl-0 hover:pl-0 hover:bg-transparent text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Wróć do wszystkich ofert
                    </Button>
                </Link>

                <article className="bg-white dark:bg-zinc-900 rounded-lg overflow-hidden shadow-sm">
                    {offer.image && (
                        <div className="relative h-[400px] w-full">
                            <Image
                                src={urlFor(offer.image).url()}
                                alt={offer.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    )}

                    <div className="p-8 md:p-12">
                        <header className="mb-8">
                            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">{offer.title}</h1>
                            <time className="text-muted-foreground">
                                {new Date(offer.publishedAt).toLocaleDateString("pl-PL", {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </time>
                        </header>

                        <div className="prose prose-lg dark:prose-invert max-w-none">
                            {offer.body && <PortableText value={offer.body} />}
                        </div>
                    </div>
                </article>
            </div>
        </div>
    )
}
