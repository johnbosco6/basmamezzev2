import { client } from "@/lib/sanity"
import { urlFor } from "@/lib/sanity"
import Image from "next/image"
import Link from "next/link"
import { PortableText } from "@portabletext/react"

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
    )
}
