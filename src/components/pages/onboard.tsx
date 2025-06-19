"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Logo from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Heart, Sparkles, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

interface OnboardingStep {
  id: number
  title: string
  subtitle: string
  content: React.ReactNode
}

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0)
  const [userName, setUserName] = useState("")
  const [isComplete, setIsComplete] = useState(false)

  // Save user name to localStorage
  const saveUserName = (name: string) => {
    localStorage.setItem("boook_user_name", name)
    localStorage.setItem("boook_onboarding_complete", "true")
  }

  // Check if onboarding is already complete
  useEffect(() => {
    const onboardingComplete = localStorage.getItem("boook_onboarding_complete")
    const savedName = localStorage.getItem("boook_user_name")

    if (onboardingComplete && savedName) {
      setIsComplete(true)
      setUserName(savedName)
      router.push("/app")
    }
  }, [])

  const handleNext = () => {
    if (currentStep === 1 && userName.trim()) {
      saveUserName(userName.trim())
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setIsComplete(true)
    }
  }

  const handleSkip = () => {
    setCurrentStep(steps.length - 1)
  }
  const router = useRouter()
  const steps: OnboardingStep[] = [
    {
      id: 0,
      title: "Bem-vindo ao boook! 👻",
      subtitle: "Sua biblioteca pessoal assombrantemente organizada",
      content: (
        <div className="text-center space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center"
          >
            <BookOpen className="w-12 h-12 text-purple-600" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-slate-600 leading-relaxed"
          >
            Organize seus livros, acompanhe suas leituras e descubra novas histórias de forma simples e intuitiva.
          </motion.p>
        </div>
      ),
    },
    {
      id: 1,
      title: "Como podemos te chamar?",
      subtitle: "Vamos personalizar sua experiência.",
      content: (
        <div className="space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center"
          >
            <Heart className="w-12 h-12 text-green-600" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <Input
              type="text"
              placeholder="Digite seu nome"
              value={userName}
              onChange={(e: any) => setUserName(e.target.value)}
              className="text-center text-lg"
              autoFocus
            />
            <p className="text-sm text-slate-500 text-center">Seus dados ficam salvos localmente no seu dispositivo</p>
          </motion.div>
        </div>
      ),
    },
    {
      id: 2,
      title: `Ótimo, ${userName || "leitor"}! ✨`,
      subtitle: "Veja o que você pode fazer no boook",
      content: (
        <div className="space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto w-24 h-24 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center"
          >
            <Sparkles className="w-12 h-12 text-yellow-600" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-2 text-sm"
          >
            {[
              "📚 Organize sua biblioteca pessoal",
              "📖 Acompanhe seu progresso de leitura",
              "⭐ Avalie e comente seus livros",
              "🎯 Defina metas de leitura",
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-center space-x-3 p-3 bg-white/50 rounded-lg"
              >
                <span className="text-lg">{feature}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      ),
    },
    {
      id: 3,
      title: "Tudo pronto! 🎉",
      subtitle: "Sua jornada literária começa agora",
      content: (
        <div className="text-center space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto w-24 h-24 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center"
          >
            <CheckCircle className="w-12 h-12 text-emerald-600" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <p className="text-slate-600 leading-relaxed">
              {userName ? `${userName}, s` : "S"}ua biblioteca está pronta para receber seus livros favoritos!
            </p>
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
              <CardContent className="p-4">
                <p className="text-sm text-purple-700">
                  💡 <strong>Dica:</strong> No futuro, você poderá sincronizar seus dados com uma conta Google para
                  acessá-los em outros dispositivos.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      ),
    },
  ]

  if (isComplete) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center flex justify-center flex-col gap-4  items-center space-y-6"
        >
            <div className="flex justify-center  items-center">
          <Logo />

            </div>
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-slate-800">Tudo certo {userName}!! 👻</h1>
            <p className="text-slate-600">Sua biblioteca está te esperando!...</p>
            <Button
              onClick={() => {
                router.push("/app")
              }} 
              variant="outline"
            >
              Começar agora!
            </Button>
          </div>
        </motion.div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Progress Bar */}
        <motion.div className="mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-500">
              Passo {currentStep + 1} de {steps.length}
            </span>
            {currentStep < steps.length - 1 && (
              <button onClick={handleSkip} className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
                Pular
              </button>
            )}
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
        </motion.div>

        {/* Logo */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Logo />
        </motion.div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="space-y-8"
          >
            {/* Step Header */}
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold text-slate-800">{steps[currentStep].title}</h1>
              <p className="text-slate-600">{steps[currentStep].subtitle}</p>
            </div>

            {/* Step Content */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">{steps[currentStep].content}</CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <Button
                variant="ghost"
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="text-slate-500"
              >
                Voltar
              </Button>

              <Button
                onClick={handleNext}
                disabled={currentStep === 1 && !userName.trim()}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {currentStep === steps.length - 1 ? "Começar!" : "Próximo"}
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        <motion.div
          className="text-center pt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-xs text-slate-400">Seus dados são salvos localmente no seu dispositivo</p>
        </motion.div>
      </div>
    </main>
  )
}
