import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import Providers from "./tools/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Boook App - Bem Vindo",
  description:
    "Bem vindo ao Boook, onde você encontra a comunidade que você precisa.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body className={`${inter.className}  bg-cBlueDark min-h-screen`}>
        <Providers>
          {" "}
          <Sidebar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
