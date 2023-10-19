import { twMerge } from "tailwind-merge";
import { clsx, ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function converteNota0a10To0a5(nota: number): number {
  // Garante que a nota esteja no intervalo de 0 a 10
  const notaClamp = Math.min(Math.max(nota, 0), 10);

  // Converte a nota de 0 a 10 para 0 a 5
  const notaConvertida = notaClamp / 2;

  return notaConvertida;
}

// Exemplo de uso:
