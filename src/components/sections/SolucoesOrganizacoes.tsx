'use client'

import { useState } from 'react'
import { useReveal } from '@/hooks/useReveal'
import { cn } from '@/lib/utils'

const nodes = [
  { cx: 480, cy: 110, r: 45, fill: '#DC2626', label1: 'Trilhas e Programas', label2: 'Educacionais', tip: 'Trilhas e programas educacionais personalizados e master classes' },
  { cx: 200, cy: 140, r: 48, fill: '#2D6A4F', label1: 'Curadoria de', label2: 'Produtos e', label3: 'Certificações', tip: 'Criação, curadoria de produtos e infoprodutos, certificações educacionais' },
  { cx: 760, cy: 140, r: 48, fill: '#3B82F6', label1: 'Formação de', label2: 'Lideranças', label3: 'ESG · Feminina · Inovadora', tip: 'Formação de lideranças em ESG, liderança feminina e gestão de equipes' },
  { cx: 860, cy: 280, r: 44, fill: '#EAB308', textColor: '#000', label1: 'Assessment', label2: 'Soft Skills + IA', tip: 'Mapeamento de Competências – Soft Skills – por meio de Assessment inovador com uso de IA' },
  { cx: 100, cy: 340, r: 48, fill: '#2D6A4F', label1: 'Senior Advisor', label2: 'Sustentabilidade', label3: 'e ESG', tip: 'Senior Advisor em Gestão Estratégica de Sustentabilidade e ESG' },
  { cx: 860, cy: 420, r: 44, fill: '#9333EA', label1: 'Mentoria de', label2: 'Alto Impacto', tip: 'Programa Personalizado de Mentoria de Alto Impacto – Carreira, ESG, IA, Tecnologia e RH' },
  { cx: 100, cy: 500, r: 44, fill: '#F97316', label1: 'Auditorias e', label2: 'Relatórios Técnicos', tip: 'Auditorias, pareceres e relatórios técnicos em ESG, Sustentabilidade, Educação, IA e Tecnologia' },
  { cx: 300, cy: 580, r: 44, fill: '#F97316', label1: 'Missões e', label2: 'Imersões Técnicas', tip: 'Missões e imersões técnicas nacionais e internacionais' },
  { cx: 480, cy: 600, r: 40, fill: '#22C55E', label1: 'Redes e', label2: 'Networking', tip: 'Gestão de redes conectivas e eventos para networking' },
  { cx: 660, cy: 580, r: 44, fill: '#3B82F6', label1: 'Processos de', label2: 'RH e Gestão', tip: 'Criação e gestão de processos de RH e Gestão de Pessoas' },
  { cx: 860, cy: 560, r: 40, fill: '#DC2626', label1: 'Palestras e', label2: 'Painéis', tip: 'Palestras, painéis, mesas redondas, focus groups, roundtables' },
]

export function SolucoesOrganizacoes() {
  const { ref: titleRef, isVisible: titleVisible } = useReveal<HTMLDivElement>()
  const { ref: svgRef, isVisible: svgVisible } = useReveal<HTMLDivElement>()
  const [tooltip, setTooltip] = useState<{ show: boolean; text: string; x: number; y: number }>({
    show: false,
    text: '',
    x: 0,
    y: 0,
  })

  return (
    <section id="solucoes-org" className="py-[100px] bg-[#0A0A0A] text-white">
      <div className="max-w-[1200px] mx-auto px-6 text-center">
        <div ref={titleRef}>
          <h2
            className={cn(
              'font-section text-[clamp(1.8rem,3.5vw,2.8rem)] mb-4 text-white reveal',
              titleVisible && 'visible'
            )}
          >
            Soluções para Organizações
          </h2>
          <p
            className={cn(
              'font-tagline text-[clamp(1rem,2vw,1.25rem)] text-white/60 max-w-[650px] mx-auto mb-[60px] reveal reveal-delay-1',
              titleVisible && 'visible'
            )}
          >
            Conheça nosso ecossistema de soluções integradas
          </p>
        </div>

        <div
          ref={svgRef}
          className={cn('max-w-[1000px] mx-auto relative reveal reveal-delay-2', svgVisible && 'visible')}
        >
          <svg viewBox="0 0 960 700" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            {/* Lines from center */}
            {[
              [480, 350, 480, 110],
              [480, 350, 200, 140],
              [480, 350, 760, 140],
              [480, 350, 860, 280],
              [480, 350, 100, 340],
              [480, 350, 860, 420],
              [480, 350, 100, 500],
              [480, 350, 300, 580],
              [480, 350, 480, 600],
              [480, 350, 660, 580],
              [480, 350, 860, 560],
            ].map(([x1, y1, x2, y2], i) => (
              <line key={i} className="eco-line eco-line-anim" x1={x1} y1={y1} x2={x2} y2={y2} />
            ))}

            {/* Center */}
            <g className="cursor-pointer transition-transform duration-300 hover:scale-[1.08]">
              <circle cx="480" cy="350" r="60" fill="#0A0A0A" stroke="#DAC6B5" strokeWidth="3">
                <animate attributeName="r" values="60;64;60" dur="3s" repeatCount="indefinite" />
              </circle>
              <text className="fill-white text-[12px] font-[Cinzel] font-semibold" x="480" y="342" textAnchor="middle">
                ARBACHE
              </text>
              <text className="fill-white text-[10px] font-[Cinzel] font-semibold opacity-80" x="480" y="358" textAnchor="middle">
                CONSULTING
              </text>
              <text className="fill-white text-[9px] font-[Cinzel] font-semibold opacity-60" x="480" y="372" textAnchor="middle">
                ORGANIZAÇÕES
              </text>
            </g>

            {/* Nodes */}
            {nodes.map((node, i) => (
              <g
                key={i}
                className="cursor-pointer transition-all duration-300 hover:brightness-[1.15]"
                onMouseEnter={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect()
                  setTooltip({
                    show: true,
                    text: node.tip,
                    x: rect.left + rect.width / 2,
                    y: rect.top,
                  })
                }}
                onMouseLeave={() => setTooltip({ ...tooltip, show: false })}
              >
                <circle cx={node.cx} cy={node.cy} r={node.r} fill={node.fill} opacity="0.85">
                  <animate attributeName="opacity" values="0.85;1;0.85" dur={`${3 + i * 0.3}s`} repeatCount="indefinite" />
                </circle>
                <text
                  className={cn('text-[11px] font-[Lato] font-bold', node.textColor === '#000' ? 'fill-black' : 'fill-white')}
                  x={node.cx}
                  y={node.cy - (node.label3 ? 6 : 0)}
                  textAnchor="middle"
                >
                  {node.label1}
                </text>
                <text
                  className={cn('text-[11px] font-[Lato]', node.textColor === '#000' ? 'fill-black' : 'fill-white')}
                  x={node.cx}
                  y={node.cy + (node.label3 ? 6 : 12)}
                  textAnchor="middle"
                >
                  {node.label2}
                </text>
                {node.label3 && (
                  <text
                    className={cn('text-[9px] font-[Lato]', node.textColor === '#000' ? 'fill-black' : 'fill-white')}
                    x={node.cx}
                    y={node.cy + 20}
                    textAnchor="middle"
                  >
                    {node.label3}
                  </text>
                )}
              </g>
            ))}
          </svg>

          {/* Tooltip */}
          {tooltip.show && (
            <div
              className="fixed bg-black text-white px-4 py-3 rounded-lg text-[0.85rem] max-w-[280px] z-50 pointer-events-none transform -translate-x-1/2 -translate-y-full -mt-2"
              style={{ left: tooltip.x, top: tooltip.y }}
            >
              {tooltip.text}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
