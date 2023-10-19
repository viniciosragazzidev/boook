import type { Metadata } from "next";

const metadata: Metadata = {
  title: "Entre no Boook",
  description: "Ficamos feliz por ter você conosco.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body>{children}</body>
    </html>
  );
}
