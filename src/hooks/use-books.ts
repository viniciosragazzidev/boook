"use client"

/**
 * Hook personalizado para facilitar o uso do store de livros
 */

import { useEffect } from "react"
import { useBookStore } from "@/stores/book-store"
import type { Book } from "@/types/book"

export const useBooks = () => {
  const store = useBookStore()

  // Carrega livros na inicialização - usando useEffect com dependência vazia
  useEffect(() => {
    store.loadBooks()
  }, []) // Removido store da dependência para evitar loop infinito

  return {
    // Estado
    books: store.books,
    filteredBooks: store.getFilteredBooks(),
    isLoading: store.isLoading,
    filters: store.filters,
    stats: store.getStats(),
    readingGoals: store.readingGoals,
    readingLists: store.readingLists,

    // Ações para livros
    addBook: store.addBook,
    updateBook: store.updateBook,
    deleteBook: store.deleteBook,
    toggleFavorite: store.toggleFavorite,
    updateBookOwnership: store.updateBookOwnership,
    updateReadingStatus: store.updateReadingStatus,
    updateReadingProgress: store.updateReadingProgress,

    // Ações para filtros
    setFilters: store.setFilters,
    clearFilters: store.clearFilters,

    // Ações para metas
    addReadingGoal: store.addReadingGoal,
    updateReadingGoal: store.updateReadingGoal,
    deleteReadingGoal: store.deleteReadingGoal,

    // Ações para listas de leitura
    createReadingList: store.createReadingList,
    updateReadingList: store.updateReadingList,
    deleteReadingList: store.deleteReadingList,
    addBookToReadingList: store.addBookToReadingList,
    removeBookFromReadingList: store.removeBookFromReadingList,
    reorderReadingList: store.reorderReadingList,

    // Utilitários
    getBooksByOwnership: store.getBooksByOwnership,
    getBooksByReadingStatus: store.getBooksByReadingStatus,
    getRelatedBooks: store.getRelatedBooks,
  }
}

/**
 * Hook para buscar um livro específico por ID
 */
export const useBook = (id: string): Book | undefined => {
  const books = useBookStore((state) => state.books)
  return books.find((book) => book.id === id)
}
