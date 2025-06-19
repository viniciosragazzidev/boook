/**
 * Página de configurações do app
 */

"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, User, Download, Upload, Trash2, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import BottomNavigation from "@/components/ui/bottom-navigation"
import Logo from "@/components/logo"
import { useBooks } from "@/hooks/use-books"
import { storage } from "@/utils/storage"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
  const { books, stats } = useBooks()
  const router = useRouter()
  const [userName, setUserName] = useState(() => storage.get("boook_user_name", ""))

  const handleSaveName = () => {
    storage.set("boook_user_name", userName)
    alert("Nome salvo com sucesso!")
  }

  const handleExportData = () => {
    const data = {
      books,
      userName,
      exportDate: new Date().toISOString(),
      version: "1.0",
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `boook-backup-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)

        if (data.books && Array.isArray(data.books)) {
          storage.set("boook_books", data.books)
          if (data.userName) {
            storage.set("boook_user_name", data.userName)
            setUserName(data.userName)
          }
          alert("Dados importados com sucesso! Recarregue a página para ver as alterações.")
        } else {
          alert("Arquivo inválido. Verifique se é um backup válido do boook.")
        }
      } catch (error) {
        alert("Erro ao importar dados. Verifique se o arquivo está correto.")
      }
    }
    reader.readAsText(file)
  }

  const handleClearAllData = () => {
    if (
      confirm(
        "⚠️ ATENÇÃO: Esta ação irá apagar TODOS os seus dados (livros, configurações, etc.) e não pode ser desfeita. Tem certeza?",
      )
    ) {
      if (confirm("Última confirmação: Todos os dados serão perdidos permanentemente. Continuar?")) {
        storage.remove("boook_books")
        storage.remove("boook_user_name")
        storage.remove("boook_onboarding_complete")
        alert("Todos os dados foram apagados. Redirecionando...")
        router.push("/")
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-20">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <Logo />
            <h1 className="text-xl font-bold text-gray-900 mt-2">Configurações</h1>
          </div>
        </motion.div>

        {/* Estatísticas */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5" />
                Estatísticas da Biblioteca
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                  <div className="text-sm text-blue-700">Total de livros</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{stats.read}</div>
                  <div className="text-sm text-green-700">Livros lidos</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{stats.reading}</div>
                  <div className="text-sm text-purple-700">Lendo agora</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{stats.wantToRead}</div>
                  <div className="text-sm text-orange-700">Quero ler</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Perfil do usuário */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Perfil
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Seu nome</label>
                  <div className="flex gap-2">
                    <Input
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Digite seu nome"
                      className="flex-1"
                    />
                    <Button onClick={handleSaveName} variant="outline">
                      Salvar
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Backup e Restauração */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Backup e Restauração</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Exportar dados</h4>
                  <p className="text-sm text-gray-600 mb-3">Faça backup de todos os seus livros e configurações</p>
                  <Button onClick={handleExportData} variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Baixar Backup
                  </Button>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Importar dados</h4>
                  <p className="text-sm text-gray-600 mb-3">Restaure seus dados de um backup anterior</p>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportData}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Button variant="outline" className="w-full">
                      <Upload className="w-4 h-4 mr-2" />
                      Selecionar Arquivo
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Zona de perigo */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-700">Zona de Perigo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-red-900 mb-2">Apagar todos os dados</h4>
                  <p className="text-sm text-red-600 mb-3">
                    Esta ação não pode ser desfeita. Todos os livros e configurações serão perdidos.
                  </p>
                  <Button onClick={handleClearAllData} variant="destructive" className="w-full">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Apagar Tudo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Informações do app */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm text-gray-500 mt-8"
        >
          <p>boook v1.0 👻</p>
          <p>Sua biblioteca pessoal assombrantemente organizada</p>
        </motion.div>
      </div>

      <BottomNavigation />
    </div>
  )
}
