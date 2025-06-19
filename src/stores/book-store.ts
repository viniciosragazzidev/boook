/**
 * Store principal para gerenciamento de estado dos livros usando Zustand
 */

import { create } from "zustand"
import { devtools } from "zustand/middleware"
import type { Book, BookOwnership, ReadingStatus, BookFilters, ReadingGoal, ReadingList } from "@/types/book"
import { storage, generateId } from "@/utils/storage"

interface BookStore {
  // Estado
  books: Book[]
  filters: BookFilters
  isLoading: boolean
  readingGoals: ReadingGoal[]
  readingLists: ReadingList[]
  isInitialized: boolean // Novo flag para evitar múltiplas inicializações

  // Ações para livros
  addBook: (book: Omit<Book, "id" | "dateAdded">) => void
  updateBook: (id: string, updates: Partial<Book>) => void
  deleteBook: (id: string) => void
  toggleFavorite: (id: string) => void
  updateBookOwnership: (id: string, ownership: BookOwnership) => void
  updateReadingStatus: (id: string, status: ReadingStatus) => void
  updateReadingProgress: (id: string, currentPage: number) => void

  // Ações para filtros
  setFilters: (filters: Partial<BookFilters>) => void
  clearFilters: () => void

  // Ações para metas
  addReadingGoal: (goal: Omit<ReadingGoal, "id">) => void
  updateReadingGoal: (id: string, updates: Partial<ReadingGoal>) => void
  deleteReadingGoal: (id: string) => void

  // Ações para listas de leitura
  createReadingList: (name: string) => void
  updateReadingList: (id: string, updates: Partial<ReadingList>) => void
  deleteReadingList: (id: string) => void
  addBookToReadingList: (listId: string, bookId: string) => void
  removeBookFromReadingList: (listId: string, bookId: string) => void
  reorderReadingList: (listId: string, bookIds: string[]) => void

  // Ações utilitárias
  loadBooks: () => void
  saveBooks: () => void
  getBooksByOwnership: (ownership: BookOwnership) => Book[]
  getBooksByReadingStatus: (status: ReadingStatus) => Book[]
  getFilteredBooks: () => Book[]
  getRelatedBooks: (bookId: string) => Book[]

  // Estatísticas
  getStats: () => {
    total: number
    owned: number
    wantToHave: number
    read: number
    reading: number
    wantToRead: number
  }
}

const STORAGE_KEY = "boook_books"
const GOALS_STORAGE_KEY = "boook_reading_goals"
const LISTS_STORAGE_KEY = "boook_reading_lists"

export const useBookStore = create<BookStore>()(
  devtools(
    (set, get) => ({
      // Estado inicial
      books: [],
      filters: {},
      isLoading: false,
      readingGoals: [],
      readingLists: [],
      isInitialized: false,

      // Adiciona um novo livro
      addBook: (bookData) => {
        const newBook: Book = {
          ...bookData,
          id: generateId(),
          dateAdded: new Date().toISOString(),
        }

        set((state) => ({
          books: [...state.books, newBook],
        }))

        get().saveBooks()
      },

      // Atualiza um livro existente
      updateBook: (id, updates) => {
        set((state) => ({
          books: state.books.map((book) => (book.id === id ? { ...book, ...updates } : book)),
        }))

        get().saveBooks()
      },

      // Remove um livro
      deleteBook: (id) => {
        set((state) => ({
          books: state.books.filter((book) => book.id !== id),
        }))

        get().saveBooks()
      },

      // Alterna favorito
      toggleFavorite: (id) => {
        set((state) => ({
          books: state.books.map((book) => (book.id === id ? { ...book, isFavorite: !book.isFavorite } : book)),
        }))

        get().saveBooks()
      },

      // Atualiza propriedade do livro
      updateBookOwnership: (id, ownership) => {
        const updates: Partial<Book> = { ownership }

        // Se mudou para "want_to_have", remove status de leitura
        if (ownership === "want_to_have") {
          updates.readingStatus = undefined
          updates.currentPage = undefined
          updates.dateStarted = undefined
          updates.dateFinished = undefined
        }

        get().updateBook(id, updates)
      },

      // Atualiza status de leitura
      updateReadingStatus: (id, status) => {
        const updates: Partial<Book> = { readingStatus: status }

        // Adiciona timestamps baseado no status
        if (status === "currently_reading" && !get().books.find((b) => b.id === id)?.dateStarted) {
          updates.dateStarted = new Date().toISOString()
        } else if (status === "read") {
          updates.dateFinished = new Date().toISOString()
        }

        get().updateBook(id, updates)
      },

      // Atualiza progresso de leitura
      updateReadingProgress: (id, currentPage) => {
        const book = get().books.find((b) => b.id === id)
        if (!book) return

        const updates: Partial<Book> = { currentPage }

        // Se chegou ao final, marca como lido
        if (book.pageCount && currentPage >= book.pageCount) {
          updates.readingStatus = "read"
          updates.dateFinished = new Date().toISOString()
        }

        get().updateBook(id, updates)
      },

      // Define filtros
      setFilters: (newFilters) => {
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        }))
      },

      // Limpa filtros
      clearFilters: () => {
        set({ filters: {} })
      },

      // Metas de leitura
      addReadingGoal: (goalData) => {
        const newGoal: ReadingGoal = {
          ...goalData,
          id: generateId(),
        }

        set((state) => ({
          readingGoals: [...state.readingGoals, newGoal],
        }))

        storage.set(GOALS_STORAGE_KEY, get().readingGoals)
      },

      updateReadingGoal: (id, updates) => {
        set((state) => ({
          readingGoals: state.readingGoals.map((goal) => (goal.id === id ? { ...goal, ...updates } : goal)),
        }))

        storage.set(GOALS_STORAGE_KEY, get().readingGoals)
      },

      deleteReadingGoal: (id) => {
        set((state) => ({
          readingGoals: state.readingGoals.filter((goal) => goal.id !== id),
        }))

        storage.set(GOALS_STORAGE_KEY, get().readingGoals)
      },

      // Listas de leitura
      createReadingList: (name) => {
        const newList: ReadingList = {
          id: generateId(),
          name,
          books: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        set((state) => ({
          readingLists: [...state.readingLists, newList],
        }))

        storage.set(LISTS_STORAGE_KEY, get().readingLists)
      },

      updateReadingList: (id, updates) => {
        set((state) => ({
          readingLists: state.readingLists.map((list) =>
            list.id === id ? { ...list, ...updates, updatedAt: new Date().toISOString() } : list,
          ),
        }))

        storage.set(LISTS_STORAGE_KEY, get().readingLists)
      },

      deleteReadingList: (id) => {
        set((state) => ({
          readingLists: state.readingLists.filter((list) => list.id !== id),
        }))

        storage.set(LISTS_STORAGE_KEY, get().readingLists)
      },

      addBookToReadingList: (listId, bookId) => {
        set((state) => ({
          readingLists: state.readingLists.map((list) =>
            list.id === listId
              ? {
                  ...list,
                  books: [...list.books, bookId],
                  updatedAt: new Date().toISOString(),
                }
              : list,
          ),
        }))

        storage.set(LISTS_STORAGE_KEY, get().readingLists)
      },

      removeBookFromReadingList: (listId, bookId) => {
        set((state) => ({
          readingLists: state.readingLists.map((list) =>
            list.id === listId
              ? {
                  ...list,
                  books: list.books.filter((id) => id !== bookId),
                  updatedAt: new Date().toISOString(),
                }
              : list,
          ),
        }))

        storage.set(LISTS_STORAGE_KEY, get().readingLists)
      },

      reorderReadingList: (listId, bookIds) => {
        set((state) => ({
          readingLists: state.readingLists.map((list) =>
            list.id === listId
              ? {
                  ...list,
                  books: bookIds,
                  updatedAt: new Date().toISOString(),
                }
              : list,
          ),
        }))

        storage.set(LISTS_STORAGE_KEY, get().readingLists)
      },

      // Carrega livros do localStorage - com proteção contra múltiplas execuções
      loadBooks: () => {
        const state = get()
        if (state.isInitialized) return // Evita múltiplas inicializações

        set({ isLoading: true })

        try {
          // Verifica se está no cliente antes de acessar localStorage
          if (typeof window !== "undefined") {
            const savedBooks = storage.get<Book[]>(STORAGE_KEY, [])
            const savedGoals = storage.get<ReadingGoal[]>(GOALS_STORAGE_KEY, [])
            const savedLists = storage.get<ReadingList[]>(LISTS_STORAGE_KEY, [])

            set({
              books: savedBooks,
              readingGoals: savedGoals,
              readingLists: savedLists,
              isLoading: false,
              isInitialized: true,
            })
          } else {
            set({
              isLoading: false,
              isInitialized: true,
            })
          }
        } catch (error) {
          console.error("Erro ao carregar dados:", error)
          set({
            isLoading: false,
            isInitialized: true,
          })
        }
      },

      // Salva livros no localStorage
      saveBooks: () => {
        if (typeof window !== "undefined") {
          storage.set(STORAGE_KEY, get().books)
        }
      },

      // Retorna livros por propriedade
      getBooksByOwnership: (ownership) => {
        return get().books.filter((book) => book.ownership === ownership)
      },

      // Retorna livros por status de leitura
      getBooksByReadingStatus: (status) => {
        return get().books.filter((book) => book.readingStatus === status)
      },

      // Retorna livros filtrados
      getFilteredBooks: () => {
        const { books, filters } = get()

        return books.filter((book) => {
          if (filters.ownership && book.ownership !== filters.ownership) return false
          if (filters.readingStatus && book.readingStatus !== filters.readingStatus) return false
          if (filters.favorite && !book.isFavorite) return false
          if (filters.search) {
            const searchLower = filters.search.toLowerCase()
            const matchesTitle = book.title.toLowerCase().includes(searchLower)
            const matchesAuthor = book.authors.some((author) => author.toLowerCase().includes(searchLower))
            if (!matchesTitle && !matchesAuthor) return false
          }
          if (filters.category) {
            if (!book.categories?.some((cat) => cat.toLowerCase().includes(filters.category!.toLowerCase())))
              return false
          }

          return true
        })
      },

      // Retorna livros relacionados
      getRelatedBooks: (bookId) => {
        const book = get().books.find((b) => b.id === bookId)
        if (!book) return []

        const { books } = get()

        return books
          .filter((b) => {
            if (b.id === bookId) return false

            // Mesmo autor
            const sameAuthor = b.authors.some((author) => book.authors.includes(author))
            if (sameAuthor) return true

            // Mesma categoria
            const sameCategory = b.categories?.some((cat) => book.categories?.includes(cat))
            if (sameCategory) return true

            return false
          })
          .slice(0, 6)
      },

      // Retorna estatísticas
      getStats: () => {
        const books = get().books

        return {
          total: books.length,
          owned: books.filter((b) => b.ownership === "owned").length,
          wantToHave: books.filter((b) => b.ownership === "want_to_have").length,
          read: books.filter((b) => b.readingStatus === "read").length,
          reading: books.filter((b) => b.readingStatus === "currently_reading").length,
          wantToRead: books.filter((b) => b.readingStatus === "want_to_read").length,
        }
      },
    }),
    {
      name: "book-store",
    },
  ),
)
