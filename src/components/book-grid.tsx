/**
 * Componente para exibir grid de livros com filtros
 */

"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Filter, Grid, List } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import BookCard from "./book-card"
import { useBooks } from "@/hooks/use-books"
import type { BookOwnership, ReadingStatus } from "@/types/book"

type ViewMode = "grid" | "list"

const ownershipOptions: { value: BookOwnership | "all"; label: string }[] = [
  { value: "all", label: "Todos os livros" },
  { value: "want_to_have", label: "Quero ter" },
  { value: "owned", label: "Já tenho" },
]

const readingStatusOptions: { value: ReadingStatus | "all"; label: string }[] = [
  { value: "all", label: "Todos os status" },
  { value: "want_to_read", label: "Quero ler" },
  { value: "currently_reading", label: "Lendo agora" },
  { value: "read", label: "Já li" },
]

export default function BookGrid() {
  const { filteredBooks, filters, setFilters, clearFilters } = useBooks()
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [showFilters, setShowFilters] = useState(false)

  const handleSearchChange = (value: string) => {
    setFilters({ search: value || undefined })
  }

  const handleOwnershipFilter = (value: string) => {
    setFilters({
      ownership: value === "all" ? undefined : (value as BookOwnership),
    })
  }

  const handleReadingStatusFilter = (value: string) => {
    setFilters({
      readingStatus: value === "all" ? undefined : (value as ReadingStatus),
    })
  }

  const hasActiveFilters = Object.keys(filters).length > 0

  return (
    <div className="space-y-4">
      {/* Barra de pesquisa e controles */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar por título ou autor..."
            value={filters.search || ""}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowFilters(!showFilters)}
          className={hasActiveFilters ? "bg-purple-50 border-purple-200" : ""}
        >
          <Filter className="w-4 h-4" />
        </Button>

        <Button variant="outline" size="icon" onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}>
          {viewMode === "grid" ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
        </Button>
      </div>

      {/* Filtros expandidos */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3 p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Propriedade</label>
                <Select value={filters.ownership || "all"} onValueChange={handleOwnershipFilter}>
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

              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Status de Leitura</label>
                <Select value={filters.readingStatus || "all"} onValueChange={handleReadingStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
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

              <div className="flex items-end">
                <Button variant="outline" onClick={clearFilters} disabled={!hasActiveFilters}>
                  Limpar filtros
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Resultados */}
      <div className="space-y-4">
        {filteredBooks.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum livro encontrado</h3>
            <p className="text-gray-500">
              {hasActiveFilters
                ? "Tente ajustar os filtros ou adicionar novos livros"
                : "Comece adicionando seus primeiros livros!"}
            </p>
          </motion.div>
        ) : (
          <div
            className={`grid gap-4 ${
              viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
            }`}
          >
            {filteredBooks.map((book, index) => (
              <BookCard key={book.id} book={book} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
