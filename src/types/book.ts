/**
 * Tipos principais para o sistema de livros
 */

export interface Book {
  id: string // UUID local ou ID da API
  title: string
  authors: string[]
  description?: string
  thumbnail?: string
  publishedDate?: string
  pageCount?: number
  categories?: string[]
  isbn?: string
  // Estados do usuário - Nova lógica hierárquica
  ownership: BookOwnership // Se tem o livro ou não
  readingStatus?: ReadingStatus // Status de leitura (apenas se owned = true)
  isFavorite: boolean
  currentPage?: number
  rating?: number
  notes?: string
  dateAdded: string
  dateStarted?: string
  dateFinished?: string
  // Nova funcionalidade - Lista de leitura
  readingOrder?: number // Posição na lista de leitura
}

export type BookOwnership = "want_to_have" | "owned"
export type ReadingStatus = "want_to_read" | "currently_reading" | "read"

export interface BookFilters {
  ownership?: BookOwnership
  readingStatus?: ReadingStatus
  search?: string
  category?: string
  favorite?: boolean
}

export interface ReadingGoal {
  id: string
  year: number
  targetBooks: number
  currentBooks: number
  createdAt: string
}

export interface ReadingList {
  id: string
  name: string
  books: string[] // Array de book IDs em ordem
  createdAt: string
  updatedAt: string
}

export interface GoogleBookItem {
  id: string
  volumeInfo: {
    title: string
    authors?: string[]
    description?: string
    imageLinks?: {
      thumbnail?: string
      smallThumbnail?: string
    }
    publishedDate?: string
    pageCount?: number
    categories?: string[]
    industryIdentifiers?: Array<{
      type: string
      identifier: string
    }>
  }
}

export interface GoogleBooksResponse {
  items?: GoogleBookItem[]
  totalItems: number
}
