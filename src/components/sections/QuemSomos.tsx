'use client'

import { useReveal } from '@/hooks/useReveal'
import { cn } from '@/lib/utils'

const team = [
  {
    name: 'Ana Paula Arbache',
    role: 'CEO & Fundadora · PhD · SDG Pioneer UN',
    quote: 'Eu sou educadora de formação e acredito que a evolução humana é decorrente da relação mútua entre o conhecimento e os seres humanos.',
    gradient: 'linear-gradient(135deg, #DAC6B5, #c4a68f)',
    emoji: '👩‍💼',
  },
  {
    name: 'Fernando Arbache',
    role: 'Inovação · Tecnologia · IA · Ciência de Dados',
    quote: 'Aplico o poder da IA e da Ciência de Dados para transformar conhecimento em inovação.',
    gradient: 'linear-gradient(135deg, #4a6fa5, #2c4a7c)',
    emoji: '👨‍💻',
  },
  {
    name: 'Alexandre Vieira',
    role: 'Gestão de Pessoas · RH · Educação Corporativa',
    quote: 'Quando você muda sua forma de pensar, você muda tudo.',
    gradient: 'linear-gradient(135deg, #6b8e6b, #4a6b4a)',
    emoji: '👨‍🏫',
  },
  {
    name: 'Fernando Bastos',
    role: 'Tecnologia · Inovação · Auditoria',
    quote: 'Integrando conhecimento e tecnologia para gerar resultados reais e duradouros.',
    gradient: 'linear-gradient(135deg, #8b7355, #6b5544)',
    emoji: '👨‍💻',
  },
]

export function QuemSomos() {
  const { ref: titleRef, isVisible: titleVisible } = useReveal<HTMLDivElement>()

  return (
    <section id="quem-somos" className="py-[100px] bg-white">
      <div className="max-w-[1200px] mx-auto px-6 text-center">
        <div ref={titleRef}>
          <h2
            className={cn(
              'font-section text-[clamp(1.8rem,3.5vw,2.8rem)] mb-4 reveal',
              titleVisible && 'visible'
            )}
          >
            Quem Somos
          </h2>
          <p
            className={cn(
              'font-tagline text-[clamp(1rem,2vw,1.25rem)] text-[#808080] max-w-[650px] mx-auto mb-[60px] reveal reveal-delay-1',
              titleVisible && 'visible'
            )}
          >
            Educação, inovação e sustentabilidade reunidas em uma equipe de excelência
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => {
            const { ref, isVisible } = useReveal<HTMLDivElement>()
            return (
              <div
                key={member.name}
                ref={ref}
                className={cn(
                  'bg-[#EDE3DA] rounded-xl overflow-hidden transition-all duration-300 cursor-pointer hover:-translate-y-1.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)] reveal',
                  isVisible && 'visible',
                  index > 0 && `reveal-delay-${index}`
                )}
              >
                <div
                  className="h-[280px] flex items-center justify-center text-5xl text-white"
                  style={{ background: member.gradient }}
                >
                  {member.emoji}
                </div>
                <div className="p-6">
                  <h3 className="font-section text-[1.15rem] mb-1">{member.name}</h3>
                  <div className="font-[Montserrat] text-[0.7rem] tracking-[0.08em] uppercase text-[#808080] mb-3">
                    {member.role}
                  </div>
                  <p className="font-tagline text-[0.95rem] text-[#555]">&ldquo;{member.quote}&rdquo;</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
