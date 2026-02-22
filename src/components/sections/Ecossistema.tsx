'use client'

import { useState, useCallback, useEffect } from 'react'
import { useReveal } from '@/hooks/useReveal'
import { cn } from '@/lib/utils'
import './ecosystem.css'

// ===================================
// NODE DATA (6 orbital nodes + hub)
// ===================================

interface NodeData {
  id: string
  title: string
  description: string
  label: string[]
}

const nodesData: Record<string, NodeData> = {
  'hub': {
    id: 'hub',
    title: 'Arbache Consulting',
    description: 'Núcleo central do ecossistema, integrando todas as competências e conexões para entregar soluções transformadoras.',
    label: ['ARBACHE', 'CONSULTING']
  },
  'node-01': {
    id: 'node-01',
    title: 'Educação e Educação Corporativa',
    description: 'Programas de desenvolvimento e educação corporativa personalizados para líderes e equipes.',
    label: ['Educação e', 'Ed. Corporativa']
  },
  'node-02': {
    id: 'node-02',
    title: 'Liderança e Gestão de Equipes',
    description: 'Desenvolvimento de lideranças inovadoras e gestão de alta performance.',
    label: ['Liderança e', 'Gestão de Equipes']
  },
  'node-03': {
    id: 'node-03',
    title: 'Gestão de Carreira e Posicionamento',
    description: 'Mentoria e estratégias para desenvolvimento de carreira e posicionamento profissional.',
    label: ['Gestão de Carreira', 'e Posicionamento']
  },
  'node-04': {
    id: 'node-04',
    title: 'Recursos Humanos e Gestão de Pessoas',
    description: 'Soluções estratégicas para RH e desenvolvimento organizacional.',
    label: ['Recursos Humanos', 'e Gestão de Pessoas']
  },
  'node-05': {
    id: 'node-05',
    title: 'Inovação, Tecnologia e IA',
    description: 'Integração de tecnologia e inteligência artificial nos processos de aprendizagem.',
    label: ['Inovação,', 'Tecnologia e IA']
  },
  'node-06': {
    id: 'node-06',
    title: 'Sustentabilidade e ESG',
    description: 'Estratégias de ESG e práticas sustentáveis para negócios conscientes.',
    label: ['Sustentabilidade', 'e ESG']
  }
}

// ===================================
// GEOMETRY (deterministic positions)
// ===================================

const HUB = { cx: 400, cy: 300, r: 78 }

// Symmetric distribution: 6 nodes at 60° intervals (360/6)
// ViewBox: 800x600, Hub center: (400, 300), Radius = 200
// Angles: -90°, -30°, 30°, 90°, 150°, 210° (clockwise from top)
// x = 400 + 200*cos(angle), y = 300 + 200*sin(angle)
const orbitalNodes = [
  { id: 'node-01', cx: 400, cy: 100, r: 70 },  // -90° (top)
  { id: 'node-02', cx: 573, cy: 200, r: 70 },  // -30° (upper-right)
  { id: 'node-03', cx: 573, cy: 400, r: 70 },  // +30° (lower-right)
  { id: 'node-04', cx: 400, cy: 500, r: 70 },  // +90° (bottom)
  { id: 'node-05', cx: 227, cy: 400, r: 70 },  // +150° (lower-left)
  { id: 'node-06', cx: 227, cy: 200, r: 70 },  // +210° (upper-left)
]

// ===================================
// HELPER: Calculate shortened line endpoint
// ===================================

function getShortenedLineEnd(
  x1: number, y1: number,
  x2: number, y2: number,
  shortenBy: number
): { x: number; y: number } {
  const dx = x2 - x1
  const dy = y2 - y1
  const length = Math.sqrt(dx * dx + dy * dy)
  const ratio = (length - shortenBy) / length
  return {
    x: x1 + dx * ratio,
    y: y1 + dy * ratio
  }
}

// ===================================
// COMPONENT
// ===================================

export function Ecossistema() {
  const { ref: titleRef, isVisible: titleVisible } = useReveal<HTMLDivElement>()
  const { ref: svgRef, isVisible: svgVisible } = useReveal<HTMLDivElement>()
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  const handleNodeClick = useCallback((id: string) => {
    setSelectedNode(prev => prev === id ? null : id)
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleNodeClick(id)
    }
  }, [handleNodeClick])

  const getNodeState = (id: string) => {
    const isSelected = selectedNode === id
    const isHovered = hoveredNode === id
    return { isSelected, isHovered, isActive: isSelected || isHovered }
  }

  const selectedNodeData = selectedNode ? nodesData[selectedNode] : null

  return (
    <section id="nosso-ecossistema" className="ecosystem">
      <div className="ecosystem__container">
        <div ref={titleRef}>
          <h2
            className={cn(
              'ecosystem__title reveal',
              titleVisible && 'visible'
            )}
          >
            Nosso Ecossistema
          </h2>
          <p
            className={cn(
              'ecosystem__subtitle reveal reveal-delay-1',
              titleVisible && 'visible'
            )}
          >
            Uma rede integrada de competências, conexões e propósito
          </p>
        </div>

        <div
          ref={svgRef}
          className={cn('ecosystem__viz reveal reveal-delay-2', svgVisible && 'visible')}
        >
          <svg
            id="ecosystem-svg"
            className="ecosystem__svg"
            viewBox="0 0 800 600"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Visualização do Nosso Ecossistema"
          >
            <defs>
              {/* Arc Loader Gradient using --ring0 and --ring1 */}
              <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--ring0)" />
                <stop offset="100%" stopColor="var(--ring1)" />
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

            {/* Connection Lines Group */}
            <g id="ecosystem-links" className="ecosystem__links">
              {orbitalNodes.map((node) => {
                const end = getShortenedLineEnd(HUB.cx, HUB.cy, node.cx, node.cy, 40)
                return (
                  <line
                    key={`link-${node.id}`}
                    className="ecosystem__link"
                    x1={HUB.cx}
                    y1={HUB.cy}
                    x2={end.x}
                    y2={end.y}
                  />
                )
              })}
            </g>

            {/* Hub (Center) */}
            <g
              id="node-hub"
              className={cn(
                'ecosystem__node ecosystem__hub',
                !reducedMotion && 'ecosystem__hub--pulse',
                getNodeState('hub').isActive && 'ecosystem__node--active',
                getNodeState('hub').isSelected && 'ecosystem__node--selected'
              )}
              data-node-id="hub"
              tabIndex={0}
              role="button"
              aria-label="Núcleo do ecossistema"
              aria-pressed={selectedNode === 'hub'}
              onClick={() => handleNodeClick('hub')}
              onKeyDown={(e) => handleKeyDown(e, 'hub')}
              onMouseEnter={() => setHoveredNode('hub')}
              onMouseLeave={() => setHoveredNode(null)}
              onFocus={() => setHoveredNode('hub')}
              onBlur={() => setHoveredNode(null)}
              style={{ transformOrigin: `${HUB.cx}px ${HUB.cy}px` }}
            >
              {/* Hub base circle */}
              <circle
                className="node__base node__base--hub"
                cx={HUB.cx}
                cy={HUB.cy}
                r={HUB.r}
              />
              {/* Hub outer ring */}
              <circle
                className="node__ring"
                cx={HUB.cx}
                cy={HUB.cy}
                r={HUB.r + 10}
                fill="none"
                strokeWidth="2"
              />
              {/* Hub label */}
              <text
                className="node__label node__label--hub-main"
                x={HUB.cx}
                y={HUB.cy - 8}
                textAnchor="middle"
                dominantBaseline="middle"
              >
                ARBACHE
              </text>
              <text
                className="node__label node__label--hub-sub"
                x={HUB.cx}
                y={HUB.cy + 14}
                textAnchor="middle"
                dominantBaseline="middle"
              >
                CONSULTING
              </text>
            </g>

            {/* Orbital Nodes */}
            {orbitalNodes.map((node) => {
              const { isActive, isSelected } = getNodeState(node.id)
              const data = nodesData[node.id]
              const arcRadius = node.r + 14
              const animDuration = isActive ? '2.4s' : '3.6s'

              return (
                <g
                  key={node.id}
                  id={node.id}
                  className={cn(
                    'ecosystem__node',
                    isActive && 'ecosystem__node--active',
                    isSelected && 'ecosystem__node--selected'
                  )}
                  data-node-id={node.id}
                  tabIndex={0}
                  role="button"
                  aria-label={data.title}
                  aria-pressed={isSelected}
                  onClick={() => handleNodeClick(node.id)}
                  onKeyDown={(e) => handleKeyDown(e, node.id)}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onFocus={() => setHoveredNode(node.id)}
                  onBlur={() => setHoveredNode(null)}
                  style={{ transformOrigin: `${node.cx}px ${node.cy}px` }}
                >
                  {/* Node base circle */}
                  <circle
                    className="node__base"
                    cx={node.cx}
                    cy={node.cy}
                    r={node.r}
                  />

                  {/* Arc loader ring */}
                  <circle
                    className={cn(
                      'node__arc',
                      !reducedMotion && 'node__arc--animated'
                    )}
                    cx={node.cx}
                    cy={node.cy}
                    r={arcRadius}
                    fill="none"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="90 999"
                    style={{ transformOrigin: `${node.cx}px ${node.cy}px` }}
                  />

                  {/* Dot with animateMotion */}
                  <circle className="node__dot" r="4" fill="var(--dotHex)">
                    {!reducedMotion && (
                      <animateMotion
                        dur={animDuration}
                        repeatCount="indefinite"
                        path={`M ${node.cx} ${node.cy - arcRadius} A ${arcRadius} ${arcRadius} 0 1 1 ${node.cx - 0.001} ${node.cy - arcRadius}`}
                      />
                    )}
                  </circle>

                  {/* Node labels */}
                  {data.label.map((line, i) => (
                    <text
                      key={i}
                      className="node__label"
                      x={node.cx}
                      y={node.cy + (i - (data.label.length - 1) / 2) * 16}
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

        {/* Details Panel */}
        <div
          id="ecosystem-details"
          className={cn(
            'ecosystem__details',
            selectedNodeData && 'ecosystem__details--visible'
          )}
          aria-live="polite"
        >
          {selectedNodeData ? (
            <>
              <h3 className="ecosystem__details-title">
                {selectedNodeData.title}
              </h3>
              <p className="ecosystem__details-desc">
                {selectedNodeData.description}
              </p>
              <button
                className="ecosystem__details-close"
                onClick={() => setSelectedNode(null)}
                aria-label="Fechar detalhes"
              >
                Fechar
              </button>
            </>
          ) : (
            <p className="ecosystem__details-placeholder">
              Selecione um item do ecossistema para ver detalhes.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
