/**
 * Página de detalhes de um livro específico - Corrigida tipagem
 */

"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Heart, BookOpen, Star, Edit, Trash2, Calendar, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useBook, useBooks } from "@/hooks/use-books"
 import { toast } from "sonner"
import { useRouter } from "next/navigation"
import type { BookOwnership, ReadingStatus } from "@/types/book"
import Image from "next/image"

interface BookPageProps {
  params: {
    id: any
  }
}

const ownershipLabels: Record<BookOwnership, string> = {
  want_to_have: "Quero ter",
  owned: "Já tenho",
}

const readingStatusLabels: Record<ReadingStatus, string> = {
  want_to_read: "Quero ler",
  currently_reading: "Lendo agora",
  read: "Já li",
}

const ownershipColors: Record<BookOwnership, string> = {
  want_to_have: "bg-blue-100 text-blue-700 border-blue-200",
  owned: "bg-green-100 text-green-700 border-green-200",
}

const readingStatusColors: Record<ReadingStatus, string> = {
  want_to_read: "bg-orange-100 text-orange-700 border-orange-200",
  currently_reading: "bg-purple-100 text-purple-700 border-purple-200",
  read: "bg-emerald-100 text-emerald-700 border-emerald-200",
}

export default function BookPage({ params }: any) {
  const book = useBook(params.id)
  const {
    updateBook,
    deleteBook,
    toggleFavorite,
    updateBookOwnership,
    updateReadingStatus,
    updateReadingProgress,
    getRelatedBooks,
    readingLists,
    addBookToReadingList,
  } = useBooks()
 
  const router = useRouter()

  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    currentPage: book?.currentPage || 0,
    rating: book?.rating || 0,
    notes: book?.notes || "",
  })

  const relatedBooks = book ? getRelatedBooks(book.id) : []

  if (!book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Livro não encontrado</h2>
          <Button onClick={() => router.push("/app")} variant="outline">
            Voltar ao início
          </Button>
        </div>
      </div>
    )
  }

  const handleSaveEdit = () => {
    updateBook(book.id, editData)
    setIsEditing(false)
    toast("Alterações salvas!",{
      description: "As informações do livro foram atualizadas.",
    })
  }

  const handleOwnershipChange = (newOwnership: BookOwnership) => {
    updateBookOwnership(book.id, newOwnership)
    toast("Status atualizado!",{
      description: `Livro marcado como "${ownershipLabels[newOwnership]}".`,
    })
  }

  const handleReadingStatusChange = (newStatus: ReadingStatus) => {
    updateReadingStatus(book.id, newStatus)
    toast("Status de leitura atualizado!",{
      description: `Livro marcado como "${readingStatusLabels[newStatus]}".`,
    })
  }

  const handleProgressUpdate = (newPage: number) => {
    updateReadingProgress(book.id, newPage)
    setEditData((prev) => ({ ...prev, currentPage: newPage }))
    toast("Progresso atualizado!",{
      description: `Página atual: ${newPage}`,
    })
  }

  const handleDelete = () => {
    if (confirm("Tem certeza que deseja remover este livro?")) {
      deleteBook(book.id)
      toast("Livro removido!",{
        description: "O livro foi removido da sua biblioteca.",
      })
      router.push("/app")
    }
  }

  const handleAddToReadingList = (listId: string) => {
    addBookToReadingList(listId, book.id)
    toast("Livro adicionado!",{
      description: "Livro foi adicionado à lista de leitura.",
    })
  }

  const progressPercentage =
    book.pageCount && book.currentPage ? Math.round((book.currentPage / book.pageCount) * 100) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-6"
        >
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-gray-900 flex-1">Detalhes do Livro</h1>
          <Button variant="ghost" size="icon" onClick={() => toggleFavorite(book.id)}>
            <Heart className={`w-5 h-5 ${book.isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
          </Button>
        </motion.div>

        {/* Informações principais */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex gap-6">
                {/* Capa */}
                <div className="flex-shrink-0">
                  <div className="w-32 h-40 bg-gray-200 rounded-lg overflow-hidden shadow-md">
                    {book.thumbnail ? (
                      <Image
                        src={book.thumbnail || "/placeholder.svg"}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Informações */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{book.title}</h2>
                  <p className="text-lg text-gray-600 mb-4">{book.authors.join(", ")}</p>

                  {/* Status de propriedade */}
                  <div className="mb-4">
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Propriedade</label>
                    <Select value={book.ownership} onValueChange={handleOwnershipChange}>
                      <SelectTrigger className={`w-fit ${ownershipColors[book.ownership]}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.entries(ownershipLabels) as [BookOwnership, string][]).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Status de leitura (apenas se owned) */}
                  {book.ownership === "owned" && (
                    <div className="mb-4">
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Status de leitura</label>
                      <Select value={book.readingStatus || ""} onValueChange={handleReadingStatusChange}>
                        <SelectTrigger
                          className={`w-fit ${book.readingStatus ? readingStatusColors[book.readingStatus] : ""}`}
                        >
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          {(Object.entries(readingStatusLabels) as [ReadingStatus, string][]).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Metadados */}
                  <div className="space-y-2 text-sm text-gray-600">
                    {book.publishedDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Publicado em {book.publishedDate}</span>
                      </div>
                    )}
                    {book.pageCount && (
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        <span>{book.pageCount} páginas</span>
                      </div>
                    )}
                    {book.categories && book.categories.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {book.categories.slice(0, 3).map((category, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                            {category}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Adicionar à lista de leitura */}
        {book.ownership === "owned" && readingLists.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Adicionar à Lista de Leitura</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  {readingLists
                    .filter((list) => !list.books.includes(book.id))
                    .map((list) => (
                      <div key={list.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{list.name}</div>
                          <div className="text-sm text-gray-600">{list.books.length} livros</div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleAddToReadingList(list.id)}>
                          <Plus className="w-4 h-4 mr-1" />
                          Adicionar
                        </Button>
                      </div>
                    ))}
                  {readingLists.every((list) => list.books.includes(book.id)) && (
                    <p className="text-gray-500 text-sm">Este livro já está em todas as suas listas.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Progresso de leitura */}
        {book.readingStatus === "currently_reading" && book.pageCount && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Progresso de Leitura</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Página atual</span>
                    <span>{progressPercentage}% concluído</span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-green-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Input
                      type="number"
                      min="0"
                      max={book.pageCount}
                      value={editData.currentPage}
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          currentPage: Number.parseInt(e.target.value) || 0,
                        }))
                      }
                      className="flex-1"
                    />
                    <Button onClick={() => handleProgressUpdate(editData.currentPage)} variant="outline">
                      Atualizar
                    </Button>
                  </div>

                  <p className="text-sm text-gray-500">
                    {editData.currentPage} de {book.pageCount} páginas
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Avaliação (para livros lidos) */}
        {book.readingStatus === "read" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Sua Avaliação</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => {
                        const newRating = star === book.rating ? 0 : star
                        updateBook(book.id, { rating: newRating })
                        toast("Avaliação feita!", {
                          description: `Você deu ${newRating} estrela${newRating !== 1 ? "s" : ""} para este livro.`,
                        })
                      }}
                      className="p-1"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= (book.rating || 0)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300 hover:text-yellow-400"
                        } transition-colors`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  {book.rating ? `${book.rating} de 5 estrelas` : "Clique para avaliar"}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Descrição */}
        {book.description && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Sinopse</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{book.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Notas pessoais */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                Suas Notas
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(!isEditing)}>
                  <Edit className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  <Textarea
                    placeholder="Adicione suas anotações sobre este livro..."
                    value={editData.notes}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                    rows={4}
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleSaveEdit} size="sm">
                      Salvar
                    </Button>
                    <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  {book.notes ? (
                    <p className="text-gray-700 whitespace-pre-wrap">{book.notes}</p>
                  ) : (
                    <p className="text-gray-500 italic">
                      Nenhuma anotação ainda. Clique no ícone de edição para adicionar.
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Livros relacionados */}
        {relatedBooks.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Livros Relacionados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {relatedBooks.map((relatedBook) => (
                    <div
                      key={relatedBook.id}
                      className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => router.push(`/book/${relatedBook.id}`)}
                    >
                      <div className="w-12 h-16 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                        {relatedBook.thumbnail ? (
                          <Image
                            src={relatedBook.thumbnail || "/placeholder.svg"}
                            alt={relatedBook.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <BookOpen className="w-4 h-4 text-gray-500" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-gray-900 truncate">{relatedBook.title}</h4>
                        <p className="text-xs text-gray-600 truncate">{relatedBook.authors.join(", ")}</p>
                        <div className="flex gap-2 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs ${ownershipColors[relatedBook.ownership]}`}>
                            {ownershipLabels[relatedBook.ownership]}
                          </span>
                          {relatedBook.readingStatus && (
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${readingStatusColors[relatedBook.readingStatus]}`}
                            >
                              {readingStatusLabels[relatedBook.readingStatus]}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Ações */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex gap-4 pb-20"
        >
          <Button onClick={handleDelete} variant="destructive" className="flex-1">
            <Trash2 className="w-4 h-4 mr-2" />
            Remover Livro
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
