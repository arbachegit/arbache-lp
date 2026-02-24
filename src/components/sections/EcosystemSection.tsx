'use client'

import { useState, useCallback, useSyncExternalStore } from 'react'
import { useReveal } from '@/hooks/useReveal'
import { cn } from '@/lib/utils'
import './ecosystem.css'

interface EcosystemNode {
  id: string
  label: string[]
  description: string
  cx: number
  cy: number
  r: number
}

const ecosystemNodes: EcosystemNode[] = [
  {
    id: 'educacao',
    label: ['Educação e', 'Ed. Corporativa'],
    description: 'Programas de desenvolvimento e educação corporativa personalizados para líderes e equipes.',
    cx: 400,
    cy: 95,
    r: 52,
  },
  {
    id: 'sustentabilidade',
    label: ['Sustentabilidade', 'e ESG'],
    description: 'Estratégias de ESG e práticas sustentáveis para negócios conscientes.',
    cx: 150,
    cy: 170,
    r: 52,
  },
  {
    id: 'lideranca',
    label: ['Liderança e', 'Gestão de Equipes'],
    description: 'Desenvolvimento de lideranças inovadoras e gestão de alta performance.',
    cx: 650,
    cy: 170,
    r: 52,
  },
  {
    id: 'inovacao',
    label: ['Inovação', 'Tecnologia e IA'],
    description: 'Integração de tecnologia e inteligência artificial nos processos de aprendizagem.',
    cx: 90,
    cy: 350,
    r: 52,
  },
  {
    id: 'carreira',
    label: ['Gestão de Carreira', 'e Posicionamento'],
    description: 'Mentoria e estratégias para desenvolvimento de carreira e posicionamento profissional.',
    cx: 710,
    cy: 350,
    r: 52,
  },
  {
    id: 'experiencias',
    label: ['Experiências e', 'Missões Interculturais'],
    description: 'Programas de imersão e experiências internacionais para ampliação de visão.',
    cx: 200,
    cy: 520,
    r: 52,
  },
  {
    id: 'voluntariado',
    label: ['Voluntariado', 'Redes e Comunidades'],
    description: 'Conexão com causas sociais e redes de impacto positivo.',
    cx: 400,
    cy: 540,
    r: 46,
  },
  {
    id: 'rh',
    label: ['Recursos Humanos', 'e Gestão de Pessoas'],
    description: 'Soluções estratégicas para RH e desenvolvimento organizacional.',
    cx: 600,
    cy: 520,
    r: 52,
  },
]

const CENTER = { cx: 400, cy: 310, r: 60 }

export function EcosystemSection() {
  const { ref: titleRef, isVisible: titleVisible } = useReveal<HTMLDivElement>()
  const { ref: svgRef, isVisible: svgVisible } = useReveal<HTMLDivElement>()
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const reducedMotion = useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
      mq.addEventListener('change', cb)
      return () => mq.removeEventListener('change', cb)
    },
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    () => false
  )

  const handleNodeClick = useCallback((id: string) => {
    setSelectedNode(prev => prev === id ? null : id)
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleNodeClick(id)
    }
  }, [handleNodeClick])

  const selectedNodeData = ecosystemNodes.find(n => n.id === selectedNode)

  return (
    <section id="ecossistema" className="eco-section">
      <div className="eco-container">
        <div ref={titleRef}>
          <h2
            className={cn(
              'eco-title reveal',
              titleVisible && 'visible'
            )}
          >
            Nosso Ecossistema
          </h2>
          <p
            className={cn(
              'eco-subtitle reveal reveal-delay-1',
              titleVisible && 'visible'
            )}
          >
            Uma rede integrada de competências, conexões e propósito
          </p>
        </div>

        <div
          ref={svgRef}
          className={cn('eco-svg-wrapper reveal reveal-delay-2', svgVisible && 'visible')}
        >
          <svg
            viewBox="0 0 800 620"
            xmlns="http://www.w3.org/2000/svg"
            className="eco-svg"
            role="img"
            aria-label="Diagrama do Ecossistema Arbache Consulting"
          >
            <defs>
              {/* Arc Loader Gradient */}
              <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--eco-line)" />
                <stop offset="100%" stopColor="var(--eco-text)" />
              </linearGradient>

              {/* Glow filter for focus states */}
              <filter id="glowFilter" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Connection lines */}
            {ecosystemNodes.map((node) => (
              <line
                key={`line-${node.id}`}
                className="eco-connection-line"
                x1={CENTER.cx}
                y1={CENTER.cy}
                x2={node.cx}
                y2={node.cy}
              />
            ))}

            {/* Center node (Hub) - with pulse animation */}
            <g className={cn('eco-hub', !reducedMotion && 'eco-hub-pulse')}>
              <circle
                cx={CENTER.cx}
                cy={CENTER.cy}
                r={CENTER.r}
                className="eco-hub-circle"
              />
              <circle
                cx={CENTER.cx}
                cy={CENTER.cy}
                r={CENTER.r + 8}
                className="eco-hub-ring"
                fill="none"
                strokeWidth="2"
              />
              <text
                className="eco-hub-text"
                x={CENTER.cx}
                y={CENTER.cy - 6}
                textAnchor="middle"
              >
                ARBACHE
              </text>
              <text
                className="eco-hub-text-sub"
                x={CENTER.cx}
                y={CENTER.cy + 12}
                textAnchor="middle"
              >
                CONSULTING
              </text>
            </g>

            {/* Ecosystem nodes */}
            {ecosystemNodes.map((node) => {
              const isSelected = selectedNode === node.id
              const isHovered = hoveredNode === node.id
              const isActive = isSelected || isHovered

              return (
                <g
                  key={node.id}
                  className={cn(
                    'eco-node',
                    isActive && 'eco-node-active',
                    isSelected && 'eco-node-selected'
                  )}
                  tabIndex={0}
                  role="button"
                  aria-label={node.label.join(' ')}
                  aria-pressed={isSelected}
                  onClick={() => handleNodeClick(node.id)}
                  onKeyDown={(e) => handleKeyDown(e, node.id)}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onFocus={() => setHoveredNode(node.id)}
                  onBlur={() => setHoveredNode(null)}
                  style={{
                    transformOrigin: `${node.cx}px ${node.cy}px`,
                  }}
                >
                  {/* Arc loader ring */}
                  <circle
                    cx={node.cx}
                    cy={node.cy}
                    r={node.r + 6}
                    className={cn(
                      'eco-arc-ring',
                      !reducedMotion && 'eco-arc-ring-animated',
                      isActive && 'eco-arc-ring-fast'
                    )}
                    fill="none"
                    strokeWidth="2"
                  />

                  {/* Arc dot */}
                  <circle
                    cx={node.cx}
                    cy={node.cy - node.r - 6}
                    r="4"
                    className={cn(
                      'eco-arc-dot',
                      !reducedMotion && 'eco-arc-dot-animated'
                    )}
                    style={{
                      transformOrigin: `${node.cx}px ${node.cy}px`,
                    }}
                  />

                  {/* Main circle */}
                  <circle
                    cx={node.cx}
                    cy={node.cy}
                    r={node.r}
                    className="eco-node-circle"
                  />

                  {/* Node labels */}
                  {node.label.map((line, i) => (
                    <text
                      key={i}
                      className="eco-node-text"
                      x={node.cx}
                      y={node.cy + (i - (node.label.length - 1) / 2) * 14}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {line}
                    </text>
                  ))}
                </g>
              )
            })}
          </svg>
        </div>

        {/* Detail panel */}
        <div
          className={cn(
            'eco-detail-panel',
            selectedNodeData && 'eco-detail-panel-visible'
          )}
          aria-live="polite"
        >
          {selectedNodeData && (
            <>
              <h3 className="eco-detail-title">
                {selectedNodeData.label.join(' ')}
              </h3>
              <p className="eco-detail-desc">
                {selectedNodeData.description}
              </p>
              <button
                className="eco-detail-close"
                onClick={() => setSelectedNode(null)}
                aria-label="Fechar detalhes"
              >
                Fechar
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
