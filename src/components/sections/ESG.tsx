'use client'

import { useReveal } from '@/hooks/useReveal'
import { cn } from '@/lib/utils'

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
  { icon: '🏆', title: 'SDG Pioneer Global', subtitle: 'ONU · Nova York · Set/2023' },
  { icon: '🏆', title: 'SDG Pioneer Nacional', subtitle: 'Pacto Global Brasil · Jun/2023' },
  { icon: '🏅', title: 'Selo Diversidade SP', subtitle: 'Prefeitura SP · 2022, 2023' },
  { icon: '🎖️', title: 'Menção Honrosa', subtitle: 'Rede Governança Brasil · 2023' },
]

export function ESG() {
  const { ref: titleRef, isVisible: titleVisible } = useReveal<HTMLDivElement>()
  const { ref: cardsRef, isVisible: cardsVisible } = useReveal<HTMLDivElement>()
  const { ref: premiosRef, isVisible: premiosVisible } = useReveal<HTMLDivElement>()

  return (
    <section id="esg" className="py-[100px] bg-white relative">
      <div className="max-w-[1200px] mx-auto px-6">
        <div ref={titleRef} className="text-center">
          <h2
            className={cn(
              'font-section text-[clamp(1.8rem,3.5vw,2.8rem)] mb-4 reveal',
              titleVisible && 'visible'
            )}
          >
            Nossas Ações em ESG Corporativo
          </h2>
          <p
            className={cn(
              'font-tagline text-[clamp(1rem,2vw,1.25rem)] text-[#808080] max-w-[650px] mx-auto mb-[60px] reveal reveal-delay-1',
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
              className="bg-gradient-to-br from-[#f0fdf4] to-white border border-[#d1fae5] rounded-xl p-8"
            >
              <h3 className="font-section text-[1.1rem] text-[#2D6A4F] mb-2">{card.name}</h3>
              <div className="font-[Montserrat] text-[0.7rem] tracking-[0.08em] uppercase text-[#808080] mb-3">
                {card.period}
              </div>
              <p className="text-[0.9rem] text-[#444]">{card.desc}</p>
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
          {premios.map((premio) => (
            <div
              key={premio.title}
              className="bg-gradient-to-br from-[#fef9c3] to-[#fefce8] border border-[#fde68a] rounded-lg py-4 px-6 text-center min-w-[200px]"
            >
              <div className="text-2xl mb-1.5">{premio.icon}</div>
              <h4 className="font-[Montserrat] text-[0.7rem] tracking-[0.06em] uppercase text-[#B8860B]">
                {premio.title}
              </h4>
              <p className="text-[0.75rem] text-[#808080] mt-1">{premio.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
