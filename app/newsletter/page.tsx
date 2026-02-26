"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { client, urlFor } from "@/lib/sanity"
import { PortableText } from "@portabletext/react"
import { Home, BookOpen, MessageCircle, Megaphone } from "lucide-react"
import { Archivo } from "next/font/google"
import { Card, CardContent } from "@/components/ui/card"

const archivo = Archivo({ subsets: ["latin"], weight: ["200", "400", "600", "700"], display: "swap" })

interface Post {
    _id: string
    title: string
    slug: { current: string }
    publishedAt: string
    image?: any
    body?: any[]
}

export default function NewsletterPage() {
    const [posts, setPosts] = useState<Post[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const query = `*[_type == "post"] | order(publishedAt desc) {
                    _id, title, slug, publishedAt, image, body
                }`
                const data = await client.fetch(query)
                setPosts(data)
            } catch (error) {
                console.error("Error fetching posts:", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchPosts()
    }, [])

    return (
        <div className="min-h-screen bg-white text-gray-900">
            {/* Header */}
            <header className="sticky top-0 z-50 backdrop-blur-md bg-[#597FB1]/80 border-b border-white/10">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex-1 flex justify-start"></div>
                    <nav className="flex-1 flex items-center justify-center gap-6 backdrop-blur-md bg-white/15 border border-white/25 rounded-full px-6 py-3 shadow-lg">
                        <Link href="/" className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/20 hover:shadow-lg text-white/80 hover:text-[#BA9D76] group">
                            <Home className="h-4 w-4 transition-colors duration-300" />
                            <span className={`text-xs font-light ${archivo.className}`}>Strona Główna</span>
                        </Link>
                        <Link href="/menu" className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/20 hover:shadow-lg text-white/80 hover:text-[#BA9D76] group">
                            <BookOpen className="h-4 w-4 transition-colors duration-300" />
                            <span className={`text-xs font-light ${archivo.className}`}>Menu</span>
                        </Link>
                        <Link href="/faq" className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/20 hover:shadow-lg text-white/80 hover:text-[#BA9D76] group">
                            <MessageCircle className="h-4 w-4 transition-colors duration-300" />
                            <span className={`text-xs font-light ${archivo.className}`}>FAQ</span>
                        </Link>
                        <Link href="/#contact" className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/20 hover:shadow-lg text-white/80 hover:text-[#BA9D76] group">
                            <MessageCircle className="h-4 w-4 transition-colors duration-300" />
                            <span className={`text-xs font-light ${archivo.className}`}>Kontakt</span>
                        </Link>
                        <Link href="/newsletter" className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 -translate-y-1 bg-white/20 shadow-lg text-[#BA9D76] group">
                            <Megaphone className="h-4 w-4 transition-colors duration-300" />
                            <span className={`text-xs font-light ${archivo.className}`}>Oferty</span>
                        </Link>
                    </nav>
                    <div className="flex-1 flex justify-end"></div>
                </div>
            </header>

            {/* Hero */}
            <section className="relative py-16 overflow-hidden bg-gradient-to-r from-[#BA9D76]/10 to-[#597FB1]/10">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto">
                        <Megaphone className="h-16 w-16 mx-auto mb-6 text-[#BA9D76]" />
                        <h1 className={`text-4xl md:text-5xl font-semibold mb-6 text-gray-900 ${archivo.className}`}>
                            Aktualności i Oferty
                        </h1>
                        <p className={`text-xl text-gray-700 font-light ${archivo.className}`}>
                            Bądź na bieżąco z najnowszymi promocjami i wydarzeniami w Basma
                        </p>
                    </div>
                </div>
            </section>

            {/* Posts Grid */}
            <main className="py-12 bg-white">
                <div className="container mx-auto px-4">
                    {isLoading ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="rounded-2xl bg-gray-100 animate-pulse h-72" />
                            ))}
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="text-center py-16">
                            <Megaphone className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                            <p className={`text-gray-500 text-lg ${archivo.className}`}>
                                Brak aktualnych ofert. Wróć wkrótce!
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                            {posts.map((post) => (
                                <Link href={`/offers/${post.slug.current}`} key={post._id} className="group block">
                                    <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 rounded-2xl">
                                        {post.image && (
                                            <div className="relative h-52 w-full overflow-hidden">
                                                <Image
                                                    src={urlFor(post.image).width(600).url()}
                                                    alt={post.title}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                                            </div>
                                        )}
                                        <CardContent className="p-6">
                                            <p className={`text-xs text-[#BA9D76] font-medium mb-2 uppercase tracking-wider ${archivo.className}`}>
                                                {new Date(post.publishedAt).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </p>
                                            <h3 className={`text-xl font-semibold mb-3 text-gray-900 group-hover:text-[#597FB1] transition-colors duration-200 ${archivo.className}`}>
                                                {post.title}
                                            </h3>
                                            {post.body && (
                                                <div className={`text-gray-500 text-sm font-light line-clamp-2 ${archivo.className}`}>
                                                    <PortableText value={post.body} />
                                                </div>
                                            )}
                                            <span className={`inline-block mt-4 text-sm font-medium text-[#BA9D76] group-hover:text-[#597FB1] transition-colors ${archivo.className}`}>
                                                Czytaj więcej →
                                            </span>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
