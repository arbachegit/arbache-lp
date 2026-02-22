'use client'

import { useReveal } from '@/hooks/useReveal'
import { cn } from '@/lib/utils'

const colabs = [
  {
    icon: '🌿',
    iconBg: '#2D6A4F',
    name: 'Resorts Brasil',
    desc: 'Programa de Formação de Talentos ESG para Hotelaria. Co-criação e coordenação de trilhas de sustentabilidade para o setor.',
  },
  {
    icon: '🎓',
    iconBg: '#3B82F6',
    name: 'Escola Brasileira de Etiqueta',
    desc: 'Certificação Nacional e Internacional em Liderança Feminina e presença executiva em contextos complexos e sofisticados.',
  },
  {
    icon: '🏫',
    iconBg: '#DC2626',
    name: 'Senac',
    desc: 'Criação e desenvolvimento do Programa ESG para gestão em negócios de hospitalidade.',
  },
  {
    icon: '🔬',
    iconBg: '#0A0A0A',
    name: 'MIT Professional Education',
    desc: 'Programas internacionais de liderança e inovação. Colaboração educacional de uma década.',
  },
  {
    icon: '📰',
    iconBg: '#9333EA',
    name: 'Hotelier News',
    desc: 'Co-criação e curadoria do evento Hotel Trends ESG.',
  },
  {
    icon: '📚',
    iconBg: '#EAB308',
    name: 'Audens Edu',
    desc: 'Curadoria técnica na Escola de Negócios. Senior Advisor independente em educação corporativa.',
  },
]

export function CoLabs() {
  const { ref: titleRef, isVisible: titleVisible } = useReveal<HTMLDivElement>()

  return (
    <section id="colabs" className="py-[100px] bg-[#EDE3DA]">
      <div className="max-w-[1200px] mx-auto px-6 text-center">
        <div ref={titleRef}>
          <h2
            className={cn(
              'font-section text-[clamp(1.8rem,3.5vw,2.8rem)] mb-4 reveal',
              titleVisible && 'visible'
            )}
          >
            Nossos Co-Labs Parceiros
          </h2>
          <p
            className={cn(
              'font-tagline text-[clamp(1rem,2vw,1.25rem)] text-[#808080] max-w-[650px] mx-auto mb-[60px] reveal reveal-delay-1',
              titleVisible && 'visible'
            )}
          >
            Parcerias estratégicas que ampliam nosso impacto
          </p>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6">
          {colabs.map((colab, index) => {
            const { ref, isVisible } = useReveal<HTMLDivElement>()
            return (
              <div
                key={colab.name}
                ref={ref}
                className={cn(
                  'bg-white rounded-xl p-8 flex gap-5 items-start transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] reveal',
                  isVisible && 'visible',
                  index > 0 && `reveal-delay-${Math.min(index, 3)}`
                )}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 text-[1.3rem]"
                  style={{ background: colab.iconBg }}
                >
                  {colab.icon}
                </div>
                <div className="text-left">
                  <h3 className="font-section text-[1rem] mb-1.5">{colab.name}</h3>
                  <p className="text-[0.85rem] text-[#808080]">{colab.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
