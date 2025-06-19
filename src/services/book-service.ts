/**
 * Serviço para integração com Google Books API
 */

import type { GoogleBooksResponse, GoogleBookItem, Book } from "@/types/book"

const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes"

export class BookService {
  /**
   * Busca livros na API do Google Books
   */
  static async searchBooks(query: string, maxResults = 20): Promise<GoogleBookItem[]> {
    try {
      const response = await fetch(
        `${GOOGLE_BOOKS_API}?q=${encodeURIComponent(query)}&maxResults=${maxResults}&printType=books`,
      )

      if (!response.ok) {
        throw new Error("Erro na busca de livros")
      }

      const data: GoogleBooksResponse = await response.json()
      return data.items || []
    } catch (error) {
      console.error("Erro ao buscar livros:", error)
      return []
    }
  }

  /**
   * Busca detalhes de um livro específico
   */
  static async getBookDetails(bookId: string): Promise<GoogleBookItem | null> {
    try {
      const response = await fetch(`${GOOGLE_BOOKS_API}/${bookId}`)

      if (!response.ok) {
        throw new Error("Erro ao buscar detalhes do livro")
      }

      return await response.json()
    } catch (error) {
      console.error("Erro ao buscar detalhes do livro:", error)
      return null
    }
  }

  /**
   * Converte item da API Google Books para formato interno
   */
  static convertGoogleBookToBook(
    googleBook: GoogleBookItem,
    ownership: Book["ownership"] = "want_to_have",
    readingStatus?: Book["readingStatus"],
  ): Omit<Book, "id" | "dateAdded"> {
    const { volumeInfo } = googleBook

    return {
      title: volumeInfo.title || "Título não disponível",
      authors: volumeInfo.authors || ["Autor desconhecido"],
      description: volumeInfo.description,
      thumbnail: volumeInfo.imageLinks?.thumbnail?.replace("http:", "https:"),
      publishedDate: volumeInfo.publishedDate,
      pageCount: volumeInfo.pageCount,
      categories: volumeInfo.categories,
      isbn: volumeInfo.industryIdentifiers?.find((id) => id.type === "ISBN_13")?.identifier,
      ownership,
      readingStatus,
      isFavorite: false,
      currentPage: 0,
    }
  }
}
