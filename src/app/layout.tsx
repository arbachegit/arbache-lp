import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Arbache Consulting | Transformando o mundo por meio da educação',
  description:
    'Transformando organizações e líderes por meio da educação. Soluções em Liderança, ESG, Sustentabilidade e Inovação. Ana Paula Arbache — PhD, SDG Pioneer ONU.',
  keywords: [
    'educação corporativa',
    'liderança',
    'ESG',
    'sustentabilidade',
    'consultoria',
    'inovação',
    'desenvolvimento de líderes',
  ],
  authors: [{ name: 'Arbache Consulting' }],
  openGraph: {
    title: 'Arbache Consulting | Transformando o mundo por meio da educação',
    description:
      'Educação de excelência, liderança consciente e sustentabilidade para gerar resultados de alto desempenho.',
    type: 'website',
    locale: 'pt_BR',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  )
}
