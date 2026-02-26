import { client } from "@/lib/sanity"
import { urlFor } from "@/lib/sanity"
import Image from "next/image"
import { PortableText } from "@portabletext/react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

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
    )
}
