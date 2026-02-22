'use client'

import Link from 'next/link'
import { useReveal } from '@/hooks/useReveal'
import { cn } from '@/lib/utils'

const badges = [
  'MIT Professional Education',
  'FGV/IDE',
  'SDG Pioneer ONU 2023',
  'PUC-SP',
]

export function Hero() {
  const { ref: contentRef, isVisible: contentVisible } = useReveal<HTMLDivElement>()

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center relative"
      style={{
        background: `linear-gradient(135deg, rgba(0,0,0,0.78), rgba(26,26,26,0.55)), url('https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1920&q=80') center/cover no-repeat`,
      }}
    >
      <div
        ref={contentRef}
        className="text-center max-w-[900px] px-6"
      >
        <h1
          className={cn(
            'font-hero text-[clamp(2rem,5vw,3.8rem)] text-white leading-[1.2] mb-6 reveal',
            contentVisible && 'visible'
          )}
        >
          Transformando o mundo, os negócios e as pessoas por meio da educação
        </h1>

        <p
          className={cn(
            'font-tagline text-[clamp(1rem,2.5vw,1.4rem)] text-white/85 mb-10 max-w-[700px] mx-auto reveal reveal-delay-1',
            contentVisible && 'visible'
          )}
        >
          Educação de excelência, liderança consciente e sustentabilidade para gerar
          resultados de alto desempenho
        </p>

        <div
          className={cn(
            'flex gap-4 justify-center flex-wrap mb-12 reveal reveal-delay-2',
            contentVisible && 'visible'
          )}
        >
          <Link
            href="#solucoes-org"
            className="inline-block px-9 py-3.5 rounded bg-black text-white font-[Montserrat] text-[0.85rem] font-medium tracking-[0.08em] uppercase no-underline hover:bg-[#333] hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(0,0,0,0.2)] transition-all"
          >
            Conheça Nossas Soluções
          </Link>
          <Link
            href="#contato"
            className="inline-block px-9 py-3.5 rounded bg-transparent text-white border-2 border-white/30 font-[Montserrat] text-[0.85rem] font-medium tracking-[0.08em] uppercase no-underline hover:bg-[#DAC6B5] hover:text-black hover:border-[#DAC6B5] transition-all"
          >
            Fale Conosco
          </Link>
        </div>

        <div
          className={cn(
            'flex gap-5 justify-center flex-wrap reveal reveal-delay-3',
            contentVisible && 'visible'
          )}
        >
          {badges.map((badge) => (
            <span
              key={badge}
              className="font-[Montserrat] text-[0.65rem] tracking-[0.12em] uppercase text-white/60 py-2 px-4 border border-white/15 rounded-[20px]"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
