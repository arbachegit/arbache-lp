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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Lato:wght@300;400;700&family=Montserrat:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  )
}
