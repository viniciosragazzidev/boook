/**
 * Página para adicionar novos livros com busca em tempo real
 */

"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, BookOpen, Plus, Loader2, Edit } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import BottomNavigation from "@/components/ui/bottom-navigation"
import Logo from "@/components/logo"
import { BookService } from "@/services/book-service"
import { useBooks } from "@/hooks/use-books"
import { toast } from  "sonner"
import type { GoogleBookItem, BookOwnership, ReadingStatus } from "@/types/book"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function AddBookPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<GoogleBookItem[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedOwnership, setSelectedOwnership] = useState<BookOwnership>("want_to_have")
  const [selectedReadingStatus, setSelectedReadingStatus] = useState<ReadingStatus | undefined>(undefined)
  const [showManualForm, setShowManualForm] = useState(false)

  // Manual book form
  const [manualBook, setManualBook] = useState({
    title: "",
    authors: "",
    description: "",
    pageCount: "",
    publishedDate: "",
  })

  const { addBook } = useBooks()
 
  const router = useRouter()

  // Debounced search
  const debouncedSearchQuery = useMemo(() => {
    const handler = setTimeout(() => {
      if (searchQuery.trim().length > 2) {
        performSearch(searchQuery)
      } else {
        setSearchResults([])
      }
    }, 500)

    return () => clearTimeout(handler)
  }, [searchQuery])

  useEffect(() => {
    return debouncedSearchQuery
  }, [debouncedSearchQuery])

  const performSearch = async (query: string) => {
    setIsSearching(true)
    try {
      const results = await BookService.searchBooks(query)
      setSearchResults(results)
    } catch (error) {
      console.error("Erro na busca:", error)
 
      toast.error("Erro na busca. Tente novamente.", {
        description: "Ocorreu um erro ao buscar livros.",
      })
    } finally {
      setIsSearching(false)
    }
  }

  const handleAddBook = (googleBook: GoogleBookItem) => {
    const bookData = BookService.convertGoogleBookToBook(googleBook, selectedOwnership)
    addBook(bookData)

 
 toast("Livro adicionado com sucesso!", {
   description:`"${googleBook.volumeInfo.title}" foi adicionado à sua biblioteca.`
 })
    router.push("/app")
  }

  const handleAddManualBook = () => {
    if (!manualBook.title.trim()) {
      toast.error("Titulo do livro obrigatorio", {
        description: "Por favor, insira o titulo do livro.",
        
      })
      return
    }

    const bookData = {
      title: manualBook.title,
      authors: manualBook.authors
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean) || ["Autor desconhecido"],
      description: manualBook.description || undefined,
      pageCount: manualBook.pageCount ? Number.parseInt(manualBook.pageCount) : undefined,
      publishedDate: manualBook.publishedDate || undefined,
      ownership: selectedOwnership,
      readingStatus: selectedReadingStatus,
      isFavorite: false,
      currentPage: 0,
    }

    addBook(bookData)
 
    toast("Livro adicionado com sucesso!", {
      description:`"${manualBook.title}" foi adicionado à sua biblioteca.`
    })
    // Reset form
    setManualBook({
      title: "",
      authors: "",
      description: "",
      pageCount: "",
      publishedDate: "",
    })
    setShowManualForm(false)

    router.push("/app")
  }

  const ownershipOptions = [
    { value: "want_to_have", label: "Quero ter" },
    { value: "owned", label: "Já tenho" },
  ]

  const readingStatusOptions = [
    { value: "want_to_read", label: "Quero ler" },
    { value: "currently_reading", label: "Estou lendo" },
    { value: "read", label: "Já li" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-20">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <Logo />
          <h1 className="text-2xl font-bold text-gray-900 mt-4 mb-2">Adicionar Livro</h1>
          <p className="text-slate-600">Busque por título, autor ou ISBN</p>
        </motion.div>

        {/* Formulário de busca */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4 mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Digite o nome do livro ou autor..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                  {isSearching && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Propriedade</label>
                    <Select
                      value={selectedOwnership}
                      onValueChange={(value: BookOwnership) => setSelectedOwnership(value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ownershipOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedOwnership === "owned" && (
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Status de leitura</label>
                      <Select
                        value={selectedReadingStatus || ""}
                        onValueChange={(value: ReadingStatus) => setSelectedReadingStatus(value || undefined)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          {readingStatusOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <div className="flex justify-center">
                  <Dialog open={showManualForm} onOpenChange={setShowManualForm}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        <Edit className="w-4 h-4 mr-2" />
                        Adicionar manualmente
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Adicionar livro manualmente</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1 block">Título *</label>
                          <Input
                            value={manualBook.title}
                            onChange={(e) => setManualBook((prev) => ({ ...prev, title: e.target.value }))}
                            placeholder="Título do livro"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1 block">Autores</label>
                          <Input
                            value={manualBook.authors}
                            onChange={(e) => setManualBook((prev) => ({ ...prev, authors: e.target.value }))}
                            placeholder="Separados por vírgula"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1 block">Descrição</label>
                          <Textarea
                            value={manualBook.description}
                            onChange={(e) => setManualBook((prev) => ({ ...prev, description: e.target.value }))}
                            placeholder="Sinopse do livro"
                            rows={3}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Páginas</label>
                            <Input
                              type="number"
                              value={manualBook.pageCount}
                              onChange={(e) => setManualBook((prev) => ({ ...prev, pageCount: e.target.value }))}
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Ano</label>
                            <Input
                              value={manualBook.publishedDate}
                              onChange={(e) => setManualBook((prev) => ({ ...prev, publishedDate: e.target.value }))}
                              placeholder="2024"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2 pt-4">
                          <Button onClick={handleAddManualBook} className="flex-1">
                            Adicionar
                          </Button>
                          <Button variant="outline" onClick={() => setShowManualForm(false)}>
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Resultados da busca */}
        <AnimatePresence>
          {searchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Resultados da busca ({searchResults.length})</h2>

              {searchResults.map((book, index) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        {/* Capa */}
                        <div className="flex-shrink-0">
                          <div className="w-16 h-20 bg-gray-200 rounded overflow-hidden">
                            {book.volumeInfo.imageLinks?.thumbnail ? (
                              <Image
                                src={
                                  book.volumeInfo.imageLinks.thumbnail.replace("http:", "https:") || "/placeholder.svg"
                                }
                                alt={book.volumeInfo.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <BookOpen className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Informações */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 mb-1">{book.volumeInfo.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {book.volumeInfo.authors?.join(", ") || "Autor desconhecido"}
                          </p>

                          {book.volumeInfo.publishedDate && (
                            <p className="text-xs text-gray-500 mb-2">Publicado em {book.volumeInfo.publishedDate}</p>
                          )}

                          {book.volumeInfo.description && (
                            <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                              {book.volumeInfo.description.substring(0, 150)}...
                            </p>
                          )}

                          <Button
                            onClick={() => handleAddBook(book)}
                            size="sm"
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Adicionar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Estado vazio */}
        {!isSearching && searchResults.length === 0 && searchQuery.length > 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum resultado encontrado</h3>
            <p className="text-gray-500 mb-4">Tente buscar com termos diferentes ou verifique a ortografia</p>
            <Button variant="outline" onClick={() => setShowManualForm(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Adicionar manualmente
            </Button>
          </motion.div>
        )}
      </div>

      <BottomNavigation />
    </div>
  )
}
