'use client'

import { useReveal } from '@/hooks/useReveal'
import { cn } from '@/lib/utils'

// Sophisticated SVG icons - elegant and minimal
const LeafIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
    <path d="M12 3c4.97 0 9 4.03 9 9-4.97 0-9-4.03-9-9z" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M12 3c-4.97 0-9 4.03-9 9 4.97 0 9-4.03 9-9z" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M12 12v9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M9 18c1.5-1 4.5-1 6 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const GraduationIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
    <path d="M12 4L2 9l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M6 11.5v5c0 2 3 4 6 4s6-2 6-4v-5" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M20 9v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const BuildingIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
    <rect x="4" y="4" width="16" height="16" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M9 8h2M13 8h2M9 12h2M13 12h2M9 16h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const AtomIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
    <circle cx="12" cy="12" r="2" fill="currentColor" />
    <ellipse cx="12" cy="12" rx="9" ry="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <ellipse cx="12" cy="12" rx="9" ry="4" stroke="currentColor" strokeWidth="1.5" fill="none" transform="rotate(60 12 12)" />
    <ellipse cx="12" cy="12" rx="9" ry="4" stroke="currentColor" strokeWidth="1.5" fill="none" transform="rotate(-60 12 12)" />
  </svg>
)

const NewsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
    <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M7 8h4v4H7zM13 8h4M13 11h4M7 14h10M7 17h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const BookIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
    <path d="M4 4h6c2 0 2 1 2 2v14c0-1-1-2-2-2H4V4z" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M20 4h-6c-2 0-2 1-2 2v14c0-1 1-2 2-2h6V4z" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M7 8h2M15 8h2M7 11h2M15 11h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const colabs = [
  {
    Icon: LeafIcon,
    name: 'Resorts Brasil',
    desc: 'Programa de Formação de Talentos ESG para Hotelaria. Co-criação e coordenação de trilhas de sustentabilidade para o setor.',
  },
  {
    Icon: GraduationIcon,
    name: 'Escola Brasileira de Etiqueta',
    desc: 'Certificação Nacional e Internacional em Liderança Feminina e presença executiva em contextos complexos e sofisticados.',
  },
  {
    Icon: BuildingIcon,
    name: 'Senac',
    desc: 'Criação e desenvolvimento do Programa ESG para gestão em negócios de hospitalidade.',
  },
  {
    Icon: AtomIcon,
    name: 'MIT Professional Education',
    desc: 'Programas internacionais de liderança e inovação. Colaboração educacional de uma década.',
  },
  {
    Icon: NewsIcon,
    name: 'Hotelier News',
    desc: 'Co-criação e curadoria do evento Hotel Trends ESG.',
  },
  {
    Icon: BookIcon,
    name: 'Audens Edu',
    desc: 'Curadoria técnica na Escola de Negócios. Senior Advisor independente em educação corporativa.',
  },
]

export function CoLabs() {
  const { ref: titleRef, isVisible: titleVisible } = useReveal<HTMLDivElement>()

  return (
    <section
      id="colabs"
      className="py-[100px] relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #1a1a1a, #0d0d0d)' }}
    >
      {/* Subtle pattern */}
      <div
        className="absolute inset-0"
        style={{
          background: `url("data:image/svg+xml,%3Csvg width='80' height='80' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='40' cy='40' r='1' fill='%23fff' opacity='.03'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-[1200px] mx-auto px-6 text-center relative z-10">
        <div ref={titleRef}>
          <h2
            className={cn(
              'font-section text-[clamp(1.8rem,3.5vw,2.8rem)] mb-4 text-[#E6E6E6] reveal',
              titleVisible && 'visible'
            )}
          >
            Nossos Co-Labs Parceiros
          </h2>
          <p
            className={cn(
              'font-tagline text-[clamp(1rem,2vw,1.25rem)] text-white/60 max-w-[650px] mx-auto mb-[60px] reveal reveal-delay-1',
              titleVisible && 'visible'
            )}
          >
            Parcerias estratégicas que ampliam nosso impacto
          </p>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6">
          {colabs.map((colab, index) => {
            const { ref, isVisible } = useReveal<HTMLDivElement>()
            const { Icon } = colab
            return (
              <div
                key={colab.name}
                ref={ref}
                className={cn(
                  'bg-[#1E1E22] border border-[#2A2A2E] rounded-xl p-8 flex gap-5 items-start reveal',
                  'transition-all duration-500 cursor-pointer',
                  'hover:bg-[#252529] hover:border-[#3A3A3E] hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.3)]',
                  isVisible && 'visible',
                  index > 0 && `reveal-delay-${Math.min(index, 3)}`
                )}
              >
                <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 bg-[#2A2A2E] text-[#E6E6E6] border border-[#3A3A3E]">
                  <Icon />
                </div>
                <div className="text-left">
                  <h3 className="font-section text-[1rem] mb-1.5 text-[#E6E6E6]">{colab.name}</h3>
                  <p className="text-[0.85rem] text-[#808080] leading-relaxed">{colab.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
