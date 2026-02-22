import Link from 'next/link'

const links = [
  { href: '#proposito', label: 'Propósito' },
  { href: '#quem-somos', label: 'Equipe' },
  { href: '#solucoes-org', label: 'Soluções' },
  { href: '#esg', label: 'ESG' },
  { href: '#contato', label: 'Contato' },
]

export function Footer() {
  return (
    <footer className="bg-black text-white/50 py-10 text-center">
      <Link
        href="#"
        className="block mb-4 font-[Cinzel] text-[0.9rem] tracking-[0.2em] text-white no-underline"
      >
        ARBACHE CONSULTING
      </Link>

      <div className="flex gap-6 justify-center my-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-white/40 text-[0.75rem] no-underline font-[Montserrat] tracking-[0.06em] uppercase hover:text-[#DAC6B5] transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </div>

      <p className="text-[0.8rem]">&copy; 2026 Arbache Consulting. Todos os direitos reservados.</p>
    </footer>
  )
}
