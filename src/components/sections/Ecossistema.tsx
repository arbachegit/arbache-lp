'use client'

import { useReveal } from '@/hooks/useReveal'
import { cn } from '@/lib/utils'

export function Ecossistema() {
  const { ref: titleRef, isVisible: titleVisible } = useReveal<HTMLDivElement>()
  const { ref: svgRef, isVisible: svgVisible } = useReveal<HTMLDivElement>()

  return (
    <section id="ecossistema" className="py-[100px] bg-[#EDE3DA]">
      <div className="max-w-[1200px] mx-auto px-6 text-center">
        <div ref={titleRef}>
          <h2
            className={cn(
              'font-section text-[clamp(1.8rem,3.5vw,2.8rem)] mb-4 reveal',
              titleVisible && 'visible'
            )}
          >
            Nosso Ecossistema
          </h2>
          <p
            className={cn(
              'font-tagline text-[clamp(1rem,2vw,1.25rem)] text-[#808080] max-w-[650px] mx-auto mb-[60px] reveal reveal-delay-1',
              titleVisible && 'visible'
            )}
          >
            Uma rede integrada de competências, conexões e propósito
          </p>
        </div>

        <div
          ref={svgRef}
          className={cn('max-w-[900px] mx-auto reveal reveal-delay-2', svgVisible && 'visible')}
        >
          <svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            {/* Connection lines */}
            <line className="eco-line eco-line-anim" x1="400" y1="300" x2="400" y2="100" />
            <line className="eco-line eco-line-anim" x1="400" y1="300" x2="160" y2="160" />
            <line className="eco-line eco-line-anim" x1="400" y1="300" x2="640" y2="160" />
            <line className="eco-line eco-line-anim" x1="400" y1="300" x2="100" y2="340" />
            <line className="eco-line eco-line-anim" x1="400" y1="300" x2="700" y2="340" />
            <line className="eco-line eco-line-anim" x1="400" y1="300" x2="220" y2="500" />
            <line className="eco-line eco-line-anim" x1="400" y1="300" x2="400" y2="510" />
            <line className="eco-line eco-line-anim" x1="400" y1="300" x2="580" y2="500" />

            {/* Center node */}
            <g className="cursor-pointer transition-transform duration-300 hover:scale-[1.08]">
              <circle cx="400" cy="300" r="55" fill="#0A0A0A" stroke="#DAC6B5" strokeWidth="2.5">
                <animate attributeName="r" values="55;58;55" dur="3s" repeatCount="indefinite" />
              </circle>
              <text
                className="fill-white text-center text-[13px] font-[Cinzel] font-semibold tracking-[1px]"
                x="400"
                y="296"
                textAnchor="middle"
              >
                ARBACHE
              </text>
              <text
                className="fill-white text-center text-[10px] font-[Cinzel] font-semibold tracking-[1px] opacity-70"
                x="400"
                y="312"
                textAnchor="middle"
              >
                CONSULTING
              </text>
            </g>

            {/* Educação */}
            <g className="cursor-pointer transition-transform duration-300 hover:scale-[1.08]">
              <circle cx="400" cy="100" r="48" fill="#3B82F6" opacity="0.85" stroke="#2563EB" strokeWidth="1.5">
                <animate attributeName="opacity" values="0.85;1;0.85" dur="4s" repeatCount="indefinite" />
              </circle>
              <text className="fill-white text-center text-[11px] font-[Lato] font-bold" x="400" y="96" textAnchor="middle">
                Educação e
              </text>
              <text className="fill-white text-center text-[11px] font-[Lato]" x="400" y="110" textAnchor="middle">
                Ed. Corporativa
              </text>
            </g>

            {/* Sustentabilidade */}
            <g className="cursor-pointer transition-transform duration-300 hover:scale-[1.08]">
              <circle cx="160" cy="160" r="48" fill="#2D6A4F" opacity="0.85" stroke="#1B4332" strokeWidth="1.5">
                <animate attributeName="opacity" values="0.85;1;0.85" dur="4.5s" repeatCount="indefinite" />
              </circle>
              <text className="fill-white text-center text-[11px] font-[Lato] font-bold" x="160" y="156" textAnchor="middle">
                Sustentabilidade
              </text>
              <text className="fill-white text-center text-[11px] font-[Lato]" x="160" y="170" textAnchor="middle">
                e ESG
              </text>
            </g>

            {/* Liderança */}
            <g className="cursor-pointer transition-transform duration-300 hover:scale-[1.08]">
              <circle cx="640" cy="160" r="48" fill="#DC2626" opacity="0.85" stroke="#991B1B" strokeWidth="1.5">
                <animate attributeName="opacity" values="0.85;1;0.85" dur="3.5s" repeatCount="indefinite" />
              </circle>
              <text className="fill-white text-center text-[11px] font-[Lato] font-bold" x="640" y="152" textAnchor="middle">
                Liderança e
              </text>
              <text className="fill-white text-center text-[11px] font-[Lato]" x="640" y="164" textAnchor="middle">
                Gestão de Equipes
              </text>
              <text className="fill-white text-center text-[9px] font-[Lato]" x="640" y="176" textAnchor="middle">
                Liderança Inovadora
              </text>
            </g>

            {/* Inovação */}
            <g className="cursor-pointer transition-transform duration-300 hover:scale-[1.08]">
              <circle cx="100" cy="340" r="48" fill="#9333EA" opacity="0.85" stroke="#6B21A8" strokeWidth="1.5">
                <animate attributeName="opacity" values="0.85;1;0.85" dur="5s" repeatCount="indefinite" />
              </circle>
              <text className="fill-white text-center text-[11px] font-[Lato] font-bold" x="100" y="336" textAnchor="middle">
                Inovação
              </text>
              <text className="fill-white text-center text-[11px] font-[Lato]" x="100" y="350" textAnchor="middle">
                Tecnologia e IA
              </text>
            </g>

            {/* Gestão de Carreira */}
            <g className="cursor-pointer transition-transform duration-300 hover:scale-[1.08]">
              <circle cx="700" cy="340" r="48" fill="#EAB308" opacity="0.85" stroke="#A16207" strokeWidth="1.5">
                <animate attributeName="opacity" values="0.85;1;0.85" dur="4.2s" repeatCount="indefinite" />
              </circle>
              <text className="fill-black text-center text-[11px] font-[Lato] font-bold" x="700" y="330" textAnchor="middle">
                Gestão de Carreira
              </text>
              <text className="fill-black text-center text-[11px] font-[Lato]" x="700" y="343" textAnchor="middle">
                Carreira da Mulher
              </text>
              <text className="fill-black text-center text-[9px] font-[Lato]" x="700" y="356" textAnchor="middle">
                e Posicionamento
              </text>
            </g>

            {/* Experiências */}
            <g className="cursor-pointer transition-transform duration-300 hover:scale-[1.08]">
              <circle cx="220" cy="500" r="48" fill="#F97316" opacity="0.85" stroke="#C2410C" strokeWidth="1.5">
                <animate attributeName="opacity" values="0.85;1;0.85" dur="4.8s" repeatCount="indefinite" />
              </circle>
              <text className="fill-white text-center text-[11px] font-[Lato] font-bold" x="220" y="496" textAnchor="middle">
                Experiências e
              </text>
              <text className="fill-white text-center text-[11px] font-[Lato]" x="220" y="510" textAnchor="middle">
                Missões Interculturais
              </text>
            </g>

            {/* Voluntariado */}
            <g className="cursor-pointer transition-transform duration-300 hover:scale-[1.08]">
              <circle cx="400" cy="510" r="42" fill="#22C55E" opacity="0.85" stroke="#15803D" strokeWidth="1.5">
                <animate attributeName="opacity" values="0.85;1;0.85" dur="3.8s" repeatCount="indefinite" />
              </circle>
              <text className="fill-white text-center text-[11px] font-[Lato] font-bold" x="400" y="506" textAnchor="middle">
                Voluntariado
              </text>
              <text className="fill-white text-center text-[11px] font-[Lato]" x="400" y="520" textAnchor="middle">
                Redes e Comunidades
              </text>
            </g>

            {/* RH */}
            <g className="cursor-pointer transition-transform duration-300 hover:scale-[1.08]">
              <circle cx="580" cy="500" r="48" fill="#3B82F6" opacity="0.85" stroke="#1D4ED8" strokeWidth="1.5">
                <animate attributeName="opacity" values="0.85;1;0.85" dur="4.3s" repeatCount="indefinite" />
              </circle>
              <text className="fill-white text-center text-[11px] font-[Lato] font-bold" x="580" y="496" textAnchor="middle">
                Recursos Humanos
              </text>
              <text className="fill-white text-center text-[11px] font-[Lato]" x="580" y="510" textAnchor="middle">
                e Gestão de Pessoas
              </text>
            </g>
          </svg>
        </div>
      </div>
    </section>
  )
}
