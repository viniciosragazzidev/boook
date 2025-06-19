/**
 * Página principal do app - Dashboard com livros organizados
 */

"use client"

import { motion } from "framer-motion"
import { BookOpen, Heart, TrendingUp } from "lucide-react"
import Logo from "@/components/logo"
import BookGrid from "@/components/book-grid"
import BottomNavigation from "@/components/ui/bottom-navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useBooks } from "@/hooks/use-books"
import Image from "next/image"

export default function AppPage() {
  const { stats, getBooksByReadingStatus } = useBooks()
  const currentlyReading = getBooksByReadingStatus("currently_reading")

  const statsCards = [
    {
      title: "Total de livros",
      value: stats.total,
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Já tenho",
      value: stats.owned,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Lendo agora",
      value: stats.reading,
      icon: Heart,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-20">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <Logo />
          <p className="text-slate-600 mt-2">Sua biblioteca pessoal</p>
        </motion.div>

        {/* Estatísticas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          {statsCards.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={stat.title} className="text-center">
                <CardContent className="p-4">
                  <div
                    className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center mx-auto mb-2`}
                  >
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs text-gray-600">{stat.title}</div>
                </CardContent>
              </Card>
            )
          })}
        </motion.div>

        {/* Lendo atualmente - Seção destacada */}
        {currentlyReading.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                  Lendo agora
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {currentlyReading.slice(0, 2).map((book, index) => (
                    <div key={book.id} className="flex items-center gap-3 p-3 bg-white rounded-lg">
                      <div className="w-12 h-16 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                        {book.thumbnail ? (
                          <Image
                            src={book.thumbnail || "/placeholder.svg"}
                            alt={book.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <BookOpen className="w-4 h-4 text-gray-500" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-gray-900 truncate">{book.title}</h4>
                        <p className="text-xs text-gray-600 truncate">{book.authors.join(", ")}</p>
                        {book.pageCount && (
                          <div className="mt-2">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                              <span>
                                {book.currentPage || 0} / {book.pageCount} páginas
                              </span>
                              <span>{Math.round(((book.currentPage || 0) / book.pageCount) * 100)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1">
                              <div
                                className="bg-purple-500 h-1 rounded-full transition-all duration-300"
                                style={{ width: `${((book.currentPage || 0) / book.pageCount) * 100}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Grid principal de livros */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <BookGrid />
        </motion.div>
      </div>

      <BottomNavigation />
    </div>
  )
}
