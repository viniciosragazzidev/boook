/**
 * Componente de navegação inferior fixa - Atualizado com Workbench
 */

"use client"

import { usePathname, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Home, Plus, Settings, Target } from "lucide-react"

const navigationItems = [
  {
    label: "Início",
    icon: Home,
    href: "/app",
  },
  {
    label: "Adicionar",
    icon: Plus,
    href: "/add",
  },
  {
    label: "Workbench",
    icon: Target,
    href: "/workbench",
  },
  {
    label: "Configurações",
    icon: Settings,
    href: "/settings",
  },
]

export default function BottomNavigation() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50"
    >
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className="flex flex-col items-center py-2 px-3 relative"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-purple-100 rounded-lg"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}

              <div className="relative z-10 flex flex-col items-center">
                <Icon className={`w-5 h-5 mb-1 transition-colors ${isActive ? "text-purple-600" : "text-gray-500"}`} />
                <span
                  className={`text-xs transition-colors ${isActive ? "text-purple-600 font-medium" : "text-gray-500"}`}
                >
                  {item.label}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </motion.nav>
  )
}
