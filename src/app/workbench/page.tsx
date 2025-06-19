/**
 * Página Workbench - Metas e Listas de Leitura - Corrigida Hydratação
 */

"use client"

import { useState, useEffect } from "react"
import { Target, Plus, BookOpen, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import BottomNavigation from "@/components/ui/bottom-navigation"
import Logo from "@/components/logo"
import { useBooks } from "@/hooks/use-books"
import { toast } from "sonner"
export default function WorkbenchPage() {
  const [isMounted, setIsMounted] = useState(false)
  const [showGoalForm, setShowGoalForm] = useState(false)
  const [showListForm, setShowListForm] = useState(false)
  const [newGoal, setNewGoal] = useState({ year: 2024, targetBooks: 12 })
  const [newListName, setNewListName] = useState("")

  const {
    books,
    readingGoals,
    readingLists,
    addReadingGoal,
    updateReadingGoal,
    deleteReadingGoal,
    createReadingList,
    updateReadingList,
    deleteReadingList,
    addBookToReadingList,
    removeBookFromReadingList,
    getBooksByOwnership,
  } = useBooks()


  // Aguarda hidratação completa
  useEffect(() => {
    setIsMounted(true)
    // Inicializa o ano atual apenas no cliente
    setNewGoal((prev) => ({ ...prev, year: new Date().getFullYear() }))
  }, [])

  // Loading state durante hidratação
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-20">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                boook
              </div>
              <div className="ml-2 text-2xl">👻</div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mt-4 mb-2">Workbench</h1>
            <p className="text-slate-600">Carregando...</p>
          </div>

          {/* Skeleton loading */}
          <div className="space-y-6">
            <Card className="mb-8">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-20 bg-gray-100 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-100 rounded animate-pulse"></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-40 bg-gray-100 rounded animate-pulse"></div>
              </CardContent>
            </Card>
          </div>
        </div>
        <BottomNavigation />
      </div>
    )
  }

  // Valores calculados apenas após hidratação
  const ownedBooks = getBooksByOwnership("owned")
  const currentYear = new Date().getFullYear()
  const currentYearGoal = readingGoals.find((g) => g.year === currentYear)
  const booksReadThisYear = books.filter(
    (b) => b.readingStatus === "read" && b.dateFinished && new Date(b.dateFinished).getFullYear() === currentYear,
  ).length
const handleCreateGoal = () => {
  if (readingGoals.some((g) => g.year === newGoal.year)) {
    toast.error("Meta já existe", {
      description: `Já existe uma meta para o ano ${newGoal.year}.`,
    })
    return
  }

  addReadingGoal({
    year: newGoal.year,
    targetBooks: newGoal.targetBooks,
    currentBooks: newGoal.year === currentYear ? booksReadThisYear : 0,
    createdAt: new Date().toISOString(),
  })

  toast.success("Meta criada!", {
    description: `Meta de ${newGoal.targetBooks} livros para ${newGoal.year} foi criada.`,
  })

  setShowGoalForm(false)
  setNewGoal({ year: currentYear + 1, targetBooks: 12 })
}

const handleCreateList = () => {
  if (!newListName.trim()) {
    toast.error("Nome obrigatório", {
      description: "Por favor, insira um nome para a lista.",
    })
    return
  }

  createReadingList(newListName.trim())

  toast.success("Lista criada!", {
    description: `Lista "${newListName}" foi criada.`,
  })

  setShowListForm(false)
  setNewListName("")
}

const handleAddBookToList = (listId: string, bookId: string) => {
  addBookToReadingList(listId, bookId)
  toast.success("Livro adicionado!", {
    description: "Livro foi adicionado à lista de leitura.",
  })
}

const handleRemoveBookFromList = (listId: string, bookId: string) => {
  removeBookFromReadingList(listId, bookId)
  toast.success("Livro removido!", {
    description: "Livro foi removido da lista de leitura.",
  })
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-20">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        < div className="text-center mb-8">
          <Logo />
          <h1 className="text-2xl font-bold text-gray-900 mt-4 mb-2">Workbench</h1>
          <p className="text-slate-600">Metas e listas de leitura</p>
        </ div>

        {/* Metas de Leitura */}
        <div  >
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-600" />
                  Metas de Leitura
                </CardTitle>
                <Dialog open={showGoalForm} onOpenChange={setShowGoalForm}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-1" />
                      Nova Meta
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Criar Meta de Leitura</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Ano</label>
                        <Input
                          type="number"
                          value={newGoal.year}
                          onChange={(e) =>
                            setNewGoal((prev) => ({ ...prev, year: Number.parseInt(e.target.value) || currentYear }))
                          }
                          min={currentYear}
                          max={currentYear + 10}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Meta de livros</label>
                        <Input
                          type="number"
                          value={newGoal.targetBooks}
                          onChange={(e) =>
                            setNewGoal((prev) => ({ ...prev, targetBooks: Number.parseInt(e.target.value) || 1 }))
                          }
                          min={1}
                          max={365}
                        />
                      </div>
                      <div className="flex gap-2 pt-4">
                        <Button onClick={handleCreateGoal} className="flex-1">
                          Criar Meta
                        </Button>
                        <Button variant="outline" onClick={() => setShowGoalForm(false)}>
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {currentYearGoal ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {booksReadThisYear} / {currentYearGoal.targetBooks}
                    </div>
                    <p className="text-gray-600">Livros lidos em {currentYear}</p>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-purple-500 h-4 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((booksReadThisYear / currentYearGoal.targetBooks) * 100, 100)}%` }}
                    />
                  </div>

                  <div className="text-center text-sm text-gray-600">
                    {Math.round((booksReadThisYear / currentYearGoal.targetBooks) * 100)}% da meta alcançada
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma meta para {currentYear}</h3>
                  <p className="text-gray-500 mb-4">Crie uma meta de leitura para acompanhar seu progresso</p>
                  <Button onClick={() => setShowGoalForm(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Meta
                  </Button>
                </div>
              )}

              {/* Outras metas */}
              {readingGoals.filter((g) => g.year !== currentYear).length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-medium text-gray-900 mb-4">Outras metas</h4>
                  <div className="grid gap-4">
                    {readingGoals
                      .filter((g) => g.year !== currentYear)
                      .sort((a, b) => b.year - a.year)
                      .map((goal) => (
                        <div key={goal.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium">{goal.year}</div>
                            <div className="text-sm text-gray-600">
                              {goal.currentBooks} / {goal.targetBooks} livros
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              deleteReadingGoal(goal.id)
                              toast("Meta removida!", {
                                description: `Meta de ${goal.year} foi removida.`,
                              })
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Listas de Leitura */}
        <div >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  Listas de Leitura
                </CardTitle>
                <Dialog open={showListForm} onOpenChange={setShowListForm}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-1" />
                      Nova Lista
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Criar Lista de Leitura</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Nome da lista</label>
                        <Input
                          value={newListName}
                          onChange={(e) => setNewListName(e.target.value)}
                          placeholder="Ex: Clássicos para ler"
                        />
                      </div>
                      <div className="flex gap-2 pt-4">
                        <Button onClick={handleCreateList} className="flex-1">
                          Criar Lista
                        </Button>
                        <Button variant="outline" onClick={() => setShowListForm(false)}>
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {readingLists.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma lista criada</h3>
                  <p className="text-gray-500 mb-4">Organize seus livros em listas de leitura personalizadas</p>
                  <Button onClick={() => setShowListForm(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Lista
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {readingLists.map((list) => (
                    <div key={list.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-gray-900">{list.name}</h4>
                        <div className="flex gap-2">
                          <span className="text-sm text-gray-500">{list.books.length} livros</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              deleteReadingList(list.id)
                              toast("Lista removida!", {
                                description: `Lista "${list.name}" foi removida.`,
                              })
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Livros na lista */}
                      {list.books.length > 0 ? (
                        <div className="space-y-2 mb-4">
                          {list.books.map((bookId, index) => {
                            const book = books.find((b) => b.id === bookId)
                            if (!book) return null

                            return (
                              <div key={bookId} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                                <span className="text-sm text-gray-500 w-6">{index + 1}.</span>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-sm truncate">{book.title}</div>
                                  <div className="text-xs text-gray-600 truncate">{book.authors.join(", ")}</div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveBookFromList(list.id, bookId)}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            )
                          })}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm mb-4">Nenhum livro na lista</p>
                      )}

                      {/* Adicionar livros */}
                      {ownedBooks.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Adicionar livros que você tem:</h5>
                          <div className="grid gap-2 max-h-40 overflow-y-auto">
                            {ownedBooks
                              .filter((book) => !list.books.includes(book.id))
                              .map((book) => (
                                <div key={book.id} className="flex items-center justify-between p-2 border rounded">
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-sm truncate">{book.title}</div>
                                    <div className="text-xs text-gray-600 truncate">{book.authors.join(", ")}</div>
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleAddBookToList(list.id, book.id)}
                                  >
                                    <Plus className="w-3 h-3" />
                                  </Button>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}
