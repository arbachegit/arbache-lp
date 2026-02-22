'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useScrollHeader } from '@/hooks/useScrollHeader'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '#proposito', label: 'Propósito' },
  { href: '#quem-somos', label: 'Quem Somos' },
  { href: '#ecossistema', label: 'Ecossistema' },
  { href: '#solucoes-org', label: 'Soluções' },
  { href: '#esg', label: 'ESG' },
  { href: '#contato', label: 'Contato' },
]

export function Header() {
  const isScrolled = useScrollHeader()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 py-5 transition-all duration-400',
        isScrolled && 'bg-[#0a0a0a]/95 backdrop-blur-[10px] py-3'
      )}
    >
      <div className="max-w-[1200px] mx-auto px-6 flex justify-between items-center">
        <Link
          href="#"
          className="font-[Cinzel] text-[1.1rem] tracking-[0.2em] text-white font-semibold no-underline"
        >
          ARBACHE CONSULTING
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-7 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-[Montserrat] text-[0.75rem] tracking-[0.1em] uppercase text-white/80 no-underline hover:text-[#DAC6B5] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden bg-transparent border-none cursor-pointer"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Menu"
        >
          <span className="block w-6 h-0.5 bg-white my-1.5 transition-all" />
          <span className="block w-6 h-0.5 bg-white my-1.5 transition-all" />
          <span className="block w-6 h-0.5 bg-white my-1.5 transition-all" />
        </button>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <nav className="md:hidden fixed inset-0 bg-black/97 flex flex-col justify-center items-center gap-8 z-50">
          <button
            className="absolute top-5 right-6 text-white text-2xl bg-transparent border-none cursor-pointer"
            onClick={() => setIsMenuOpen(false)}
          >
            ×
          </button>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-[Montserrat] text-[1.1rem] tracking-[0.1em] uppercase text-white/80 no-underline hover:text-[#DAC6B5] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
