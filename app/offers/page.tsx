import { client } from "@/lib/sanity"
import { urlFor } from "@/lib/sanity"
import Image from "next/image"
import Link from "next/link"
import { PortableText } from "@portabletext/react"
import { MainNavbar } from "@/components/main-navbar"
import { Archivo } from "next/font/google"
import { specialOccasionsData } from "../menu/menu-data"
import { Badge } from "@/components/ui/badge"
import { Check, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"

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
    const partyBox = specialOccasionsData.packages?.find(pkg => pkg.packageId === "party-box")

    return (
        <div className="min-h-screen bg-white text-gray-900 pt-[240px] md:pt-[200px]">
            <MainNavbar />

            <div className="container mx-auto py-12 px-4 max-w-6xl">
                <h1 className={`text-4xl md:text-5xl font-semibold mb-12 text-center text-gray-900 ${archivo.className}`}>Aktualne Oferty i Nowości</h1>

                {/* Featured Party Box Offer */}
                {partyBox && (
                    <div className="mb-20 overflow-hidden rounded-[2.5rem] border border-gray-100 shadow-2xl bg-white group">
                        <div className="flex flex-col lg:flex-row">
                            <div className="relative w-full lg:w-1/2 h-[400px] lg:h-auto overflow-hidden">
                                <Image
                                    src={partyBox.packageImage || "/placeholder.svg"}
                                    alt={partyBox.packageName}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/40 to-transparent"></div>
                                <div className="absolute top-6 left-6">
                                    <Badge className="bg-[#BA9D76] text-white px-4 py-1.5 rounded-full text-sm font-medium border-none shadow-lg">
                                        Bestseller
                                    </Badge>
                                </div>
                            </div>
                            <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-gray-50/50">
                                <h2 className={`text-3xl md:text-4xl font-semibold text-gray-900 mb-2 ${archivo.className}`}>
                                    {partyBox.packageName}
                                </h2>
                                <p className={`text-3xl text-[#BA9D76] font-semibold mb-6 ${archivo.className}`}>
                                    {partyBox.packagePrice}
                                </p>
                                
                                <div className="space-y-4 mb-8">
                                    <p className={`text-gray-600 font-light leading-relaxed ${archivo.className}`}>
                                        Idealny zestaw na spotkanie z przyjaciółmi lub rodziną. Zawiera bogaty wybór naszych najlepszych mezze i przekąsek.
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {partyBox.categories[0].items.slice(0, 8).map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                                                <div className="h-5 w-5 rounded-full bg-[#BA9D76]/10 flex items-center justify-center flex-shrink-0">
                                                    <Check className="h-3 w-3 text-[#BA9D76]" />
                                                </div>
                                                <span className={archivo.className}>{item.name}</span>
                                            </div>
                                        ))}
                                        <div className="flex items-center gap-2 text-sm text-[#BA9D76] font-medium">
                                            <span className={archivo.className}>...i wiele więcej!</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-4 mt-4">
                                    <Link href="/order" className="w-full sm:w-auto">
                                        <Button size="lg" className="bg-[#BA9D76] hover:bg-[#BA9D76]/90 text-white border-none px-8 py-6 h-auto text-lg rounded-full shadow-lg transition-all hover:scale-105 w-full">
                                            <ShoppingBag className="h-5 w-5 mr-2" />
                                            Zamów Online
                                        </Button>
                                    </Link>
                                    <Link href="/#contact" className="w-full sm:w-auto">
                                        <Button size="lg" variant="outline" className="border-gray-200 text-gray-700 hover:bg-white px-8 py-6 h-auto text-lg rounded-full bg-transparent w-full">
                                            Zapytaj o szczegóły
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="w-full h-px bg-gray-100 mb-16"></div>
                <h3 className={`text-2xl font-semibold mb-8 text-gray-900 ${archivo.className}`}>Więcej Aktualności</h3>

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
