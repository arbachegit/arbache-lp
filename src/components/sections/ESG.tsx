'use client'

import { useReveal } from '@/hooks/useReveal'
import { cn } from '@/lib/utils'

// Sophisticated icons for awards - elegant and minimal
const TrophyIcon = () => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
    <path d="M10 6h12v10c0 3.3-2.7 6-6 6s-6-2.7-6-6V6z" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M10 8H6c0 3 2 5 4 5" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M22 8h4c0 3-2 5-4 5" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M16 22v4M12 26h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const MedalIcon = () => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
    <circle cx="16" cy="20" r="8" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M12 4l4 8M20 4l-4 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="16" cy="20" r="4" stroke="currentColor" strokeWidth="1" opacity="0.5" fill="none" />
  </svg>
)

const BadgeIcon = () => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
    <path d="M16 4l3 6 6 1-4 4 1 6-6-3-6 3 1-6-4-4 6-1 3-6z" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <circle cx="16" cy="16" r="3" fill="currentColor" opacity="0.3" />
  </svg>
)

const AwardIcon = () => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
    <rect x="8" y="4" width="16" height="20" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M12 28l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="16" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M12 20h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const esgCards = [
  {
    name: 'Coletivo HubMulher',
    period: 'Ana Paula Arbache — Fundadora e Presidente do Conselho · 2017–atual',
    desc: 'Coletivo de mulheres focado em carreira feminina: mentoria, networking, formação continuada, liderança feminina, diversidade e inclusão. Realiza o HubMulher Summit e reúne "Hubers" — executivas, empreendedoras e especialistas em D&I.',
  },
  {
    name: 'Knowledge Hub',
    period: 'Fernando Arbache (Fundador/Embaixador) + Ana Paula (Co-fundadora/Presidente) · 2015–atual',
    desc: 'Comunidade de lideranças inovadoras atuando globalmente em prol da inovação no Brasil. Voluntariado conectando executivos e empreendedores.',
  },
  {
    name: 'Aliança ESG para a Hospitalidade',
    period: 'Ana Paula Arbache — Fundadora e Gestora · 2025–atual',
    desc: 'Coalizão de profissionais e empresas comprometidos com ESG no setor de hospitalidade, viagens e eventos corporativos.',
  },
]

const premios = [
  { Icon: TrophyIcon, title: 'SDG Pioneer Global', subtitle: 'ONU · Nova York · Set/2023' },
  { Icon: TrophyIcon, title: 'SDG Pioneer Nacional', subtitle: 'Pacto Global Brasil · Jun/2023' },
  { Icon: MedalIcon, title: 'Selo Diversidade SP', subtitle: 'Prefeitura SP · 2022, 2023' },
  { Icon: BadgeIcon, title: 'Menção Honrosa', subtitle: 'Rede Governança Brasil · 2023' },
]

export function ESG() {
  const { ref: titleRef, isVisible: titleVisible } = useReveal<HTMLDivElement>()
  const { ref: cardsRef, isVisible: cardsVisible } = useReveal<HTMLDivElement>()
  const { ref: premiosRef, isVisible: premiosVisible } = useReveal<HTMLDivElement>()

  return (
    <section
      id="esg"
      className="py-[100px] relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #F5F5F5, #E8E8E8)' }}
    >
      {/* Subtle pattern */}
      <div
        className="absolute inset-0 opacity-50"
        style={{
          background: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='30' cy='30' r='0.5' fill='%23999' opacity='.1'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <div ref={titleRef} className="text-center">
          <h2
            className={cn(
              'font-section text-[clamp(1.8rem,3.5vw,2.8rem)] mb-4 text-[#1a1a1a] reveal',
              titleVisible && 'visible'
            )}
          >
            Nossas Ações em ESG Corporativo
          </h2>
          <p
            className={cn(
              'font-tagline text-[clamp(1rem,2vw,1.25rem)] text-[#666] max-w-[650px] mx-auto mb-[60px] reveal reveal-delay-1',
              titleVisible && 'visible'
            )}
          >
            Liderança e gestão de voluntariado nas redes
          </p>
        </div>

        <div
          ref={cardsRef}
          className={cn(
            'grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-7 reveal reveal-delay-2',
            cardsVisible && 'visible'
          )}
        >
          {esgCards.map((card) => (
            <div
              key={card.name}
              className="bg-white border border-[#E0E0E0] rounded-xl p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:border-[#B9B9B9]"
            >
              <h3 className="font-section text-[1.1rem] text-[#1a1a1a] mb-2">{card.name}</h3>
              <div className="font-[Montserrat] text-[0.65rem] tracking-[0.1em] uppercase text-[#808080] mb-3">
                {card.period}
              </div>
              <p className="text-[0.9rem] text-[#555] leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>

        <div
          ref={premiosRef}
          className={cn(
            'flex flex-wrap gap-4 mt-12 justify-center reveal',
            premiosVisible && 'visible'
          )}
        >
          {premios.map((premio, index) => {
            const { Icon } = premio
            return (
              <div
                key={premio.title}
                className={cn(
                  'bg-[#2A2A2E] border border-[#3A3A3E] rounded-lg py-5 px-6 text-center min-w-[200px]',
                  'transition-all duration-500 hover:-translate-y-1 hover:bg-[#333338] hover:border-[#4A4A4E]',
                  `reveal-delay-${index + 1}`
                )}
              >
                <div className="flex justify-center mb-2 text-[#E6E6E6]">
                  <Icon />
                </div>
                <h4 className="font-[Montserrat] text-[0.7rem] tracking-[0.08em] uppercase text-[#E6E6E6]">
                  {premio.title}
                </h4>
                <p className="text-[0.75rem] text-[#808080] mt-1">{premio.subtitle}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
