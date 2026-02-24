'use client'

import { useReveal } from '@/hooks/useReveal'
import { cn } from '@/lib/utils'

// Sophisticated SVG icons
const LeadershipIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
    <circle cx="24" cy="14" r="8" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M12 38c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M24 10v-4M20 12l-2-3M28 12l2-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const InnovationIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
    <circle cx="24" cy="20" r="10" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M20 30v6a4 4 0 008 0v-6" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M24 6v4M36 20h4M8 20h4M32 12l3-3M16 12l-3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="24" cy="20" r="3" fill="currentColor" opacity="0.3" />
  </svg>
)

const EducationIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
    <path d="M24 8L4 18l20 10 20-10L24 8z" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M10 22v12c0 4 6 8 14 8s14-4 14-8V22" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M40 18v16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="40" cy="36" r="2" fill="currentColor" />
  </svg>
)

const TechIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
    <rect x="8" y="10" width="32" height="24" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M16 38h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M24 34v4" stroke="currentColor" strokeWidth="1.5" />
    <path d="M16 18l4 4-4 4M26 26h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const team = [
  {
    name: 'Ana Paula Arbache',
    role: 'CEO & Fundadora · PhD · SDG Pioneer UN',
    quote: 'Eu sou educadora de formação e acredito que a evolução humana é decorrente da relação mútua entre o conhecimento e os seres humanos.',
    gradient: 'linear-gradient(135deg, #3A3A3E, #2A2A2E)',
    Icon: LeadershipIcon,
  },
  {
    name: 'Fernando Arbache',
    role: 'Inovação · Tecnologia · IA · Ciência de Dados',
    quote: 'Aplico o poder da IA e da Ciência de Dados para transformar conhecimento em inovação.',
    gradient: 'linear-gradient(135deg, #4A4A4E, #3A3A3E)',
    Icon: InnovationIcon,
  },
  {
    name: 'Alexandre Vieira',
    role: 'Gestão de Pessoas · RH · Educação Corporativa',
    quote: 'Quando você muda sua forma de pensar, você muda tudo.',
    gradient: 'linear-gradient(135deg, #5A5A5E, #4A4A4E)',
    Icon: EducationIcon,
  },
  {
    name: 'Fernando Bastos',
    role: 'Tecnologia · Inovação · Auditoria',
    quote: 'Integrando conhecimento e tecnologia para gerar resultados reais e duradouros.',
    gradient: 'linear-gradient(135deg, #4A4A4E, #3A3A3E)',
    Icon: TechIcon,
  },
]

function TeamCard({ member, index }: { member: (typeof team)[number]; index: number }) {
  const { ref, isVisible } = useReveal<HTMLDivElement>()
  const { Icon } = member
  return (
    <div
      ref={ref}
      className={cn(
        'bg-white rounded-xl overflow-hidden transition-all duration-500 cursor-pointer border border-[#E0E0E0] reveal',
        'hover:-translate-y-2 hover:shadow-[0_16px_48px_rgba(0,0,0,0.12)] hover:border-[#B9B9B9]',
        isVisible && 'visible',
        index > 0 && `reveal-delay-${index}`
      )}
    >
      <div
        className="h-[260px] flex items-center justify-center text-[#E6E6E6]"
        style={{ background: member.gradient }}
      >
        <div className="transform transition-transform duration-500 hover:scale-110">
          <Icon />
        </div>
      </div>
      <div className="p-6 bg-white">
        <h3 className="font-section text-[1.15rem] mb-1 text-[#1a1a1a]">{member.name}</h3>
        <div className="font-[Montserrat] text-[0.65rem] tracking-[0.1em] uppercase text-[#808080] mb-3">
          {member.role}
        </div>
        <p className="font-tagline text-[0.9rem] text-[#555] leading-relaxed">
          &ldquo;{member.quote}&rdquo;
        </p>
      </div>
    </div>
  )
}

export function QuemSomos() {
  const { ref: titleRef, isVisible: titleVisible } = useReveal<HTMLDivElement>()

  return (
    <section
      id="quem-somos"
      className="py-[100px] relative overflow-hidden"
      style={{ background: '#212121' }}
    >
      {/* Subtle pattern */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='0.5' fill='%23fff' opacity='.15'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-[1200px] mx-auto px-6 text-center relative z-10">
        <div ref={titleRef}>
          <h2
            className={cn(
              'font-section text-[clamp(1.8rem,3.5vw,2.8rem)] mb-4 text-white reveal',
              titleVisible && 'visible'
            )}
          >
            Quem Somos
          </h2>
          <p
            className={cn(
              'font-tagline text-[clamp(1rem,2vw,1.25rem)] text-[#999] max-w-[650px] mx-auto mb-[60px] reveal reveal-delay-1',
              titleVisible && 'visible'
            )}
          >
            Educação, inovação e sustentabilidade reunidas em uma equipe de excelência
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <TeamCard key={member.name} member={member} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
