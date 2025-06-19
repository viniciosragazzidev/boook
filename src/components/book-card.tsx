/**
 * Componente para exibir um livro em formato de card
 */

"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Heart, BookOpen, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Book } from "@/types/book"
import { useBooks } from "@/hooks/use-books"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface BookCardProps {
  book: Book
  index?: number
}

const ownershipLabels = {
  want_to_have: "Quero ter",
  owned: "Já tenho",
}

const readingStatusLabels = {
  want_to_read: "Quero ler",
  currently_reading: "Lendo",
  read: "Lido",
}

const ownershipColors = {
  want_to_have: "bg-blue-100 text-blue-700",
  owned: "bg-green-100 text-green-700",
}

const readingStatusColors = {
  want_to_read: "bg-orange-100 text-orange-700",
  currently_reading: "bg-purple-100 text-purple-700",
  read: "bg-emerald-100 text-emerald-700",
}

export default function BookCard({ book, index = 0 }: BookCardProps) {
  const { toggleFavorite } = useBooks()
  const router = useRouter()

  const handleCardClick = () => {
    router.push(`/book/${book.id}`)
  }

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleFavorite(book.id)
  }

  const progressPercentage =
    book.pageCount && book.currentPage ? Math.round((book.currentPage / book.pageCount) * 100) : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200" onClick={handleCardClick}>
        <CardContent className="p-4">
          <div className="flex gap-3">
            {/* Capa do livro */}
            <div className="flex-shrink-0">
              <div className="w-16 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-md overflow-hidden">
                {book.thumbnail ? (
                  <Image
                    src={book.thumbnail || "/placeholder.svg"}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-gray-500" />
                  </div>
                )}
              </div>
            </div>

            {/* Informações do livro */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-gray-900 truncate">{book.title}</h3>
                  <p className="text-xs text-gray-600 truncate">{book.authors.join(", ")}</p>
                </div>

                <Button variant="ghost" size="sm" className="p-1 h-auto" onClick={handleFavoriteClick}>
                  <Heart className={`w-4 h-4 ${book.isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                </Button>
              </div>

              {/* Status e progresso */}
              <div className="space-y-2">
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${ownershipColors[book.ownership]}`}
                >
                  {ownershipLabels[book.ownership]}
                </span>

                {book.readingStatus && (
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ml-1 ${readingStatusColors[book.readingStatus]}`}
                  >
                    {readingStatusLabels[book.readingStatus]}
                  </span>
                )}

                {/* Barra de progresso para livros sendo lidos */}
                {book.readingStatus === "currently_reading" && book.pageCount && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Progresso</span>
                      <span>{progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-purple-500 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      {book.currentPage || 0} de {book.pageCount} páginas
                    </p>
                  </div>
                )}

                {/* Rating para livros lidos */}
                {book.readingStatus === "read" && book.rating && (
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i < book.rating! ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
