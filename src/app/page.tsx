'use client'
import Logo from "@/components/logo"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { BsGoogle } from "react-icons/bs"
import { IoPerson } from "react-icons/io5"

export default function Home() {
  const router = useRouter()
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 flex flex-col justify-center ">
        {/* Logo Section */}
        <div className="text-center self-center">
          <Logo />
        </div>

        {/* Login Options */}
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-slate-600 text-sm">Selecione abaixo a opção de login:</p>
          </div>

          {/* Google Login Button */}
          <Button className="w-full" variant={"outline"}>
            <BsGoogle className=" text-xl group-hover:scale-110 transition-transform" />
            <span className="">Entrar com Google</span>
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gradient-to-br from-slate-50 to-slate-100 text-gray-500 font-medium">Ou</span>
            </div>
          </div>

          {/* Local Account Section */}
          <div className="space-y-4">
            <Button  onClick={() => router.push("/onboard")} className="w-full" variant={"default"}>
              <IoPerson className="text-xl group-hover:scale-110 transition-transform" />
              <span className="font-semibold">Entrar com uma conta local</span>
            </Button>

            <div className="bg-card/50 border-border rounded-lg p-4">
              <p className="text-xs text-slate-600 text-center leading-relaxed">
                💡 <strong>Dica:</strong> Para acessar seus dados em outros dispositivos, recomendamos utilizar uma
                conta Google
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-6">
          <p className="text-xs text-slate-400">Ao continuar, você concorda com nossos termos de uso</p>
        </div>
      </div>
    </main>
  )
}
