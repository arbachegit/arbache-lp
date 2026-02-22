'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import { useReveal } from '@/hooks/useReveal'
import { cn } from '@/lib/utils'
import './solucoes.css'

// ===================================
// NODE DATA (11 orbital nodes + hub)
// Com ícones e descrições detalhadas
// ===================================

interface NodeData {
  id: string
  title: string
  description: string
  label: string[]
  icon: string
  details: string
}

const nodesData: Record<string, NodeData> = {
  'hub': {
    id: 'hub',
    title: 'Arbache Consulting',
    description: 'Soluções integradas para organizações que buscam excelência em educação corporativa, liderança e sustentabilidade.',
    label: ['ARBACHE', 'CONSULTING', 'ORGANIZAÇÕES'],
    icon: '◆',
    details: 'A Arbache Consulting oferece um ecossistema completo de soluções para organizações que buscam transformação sustentável. Integramos educação corporativa, desenvolvimento de lideranças e práticas ESG em uma abordagem única e personalizada.'
  },
  'node-01': {
    id: 'node-01',
    title: 'Trilhas e Programas Educacionais',
    description: 'Desenvolva competências estratégicas com trilhas personalizadas e master classes exclusivas.',
    label: ['Trilhas e', 'Programas'],
    icon: '▣',
    details: 'Criamos trilhas de aprendizagem personalizadas que combinam teoria e prática em formatos envolventes. Nossos programas incluem master classes, workshops imersivos e jornadas de desenvolvimento contínuo, sempre alinhados aos objetivos estratégicos da sua organização. Utilizamos metodologias ativas e cases reais para garantir aplicação imediata do conhecimento.'
  },
  'node-02': {
    id: 'node-02',
    title: 'Curadoria de Produtos e Certificações',
    description: 'Selecione produtos e certificações de excelência com nossa curadoria especializada.',
    label: ['Curadoria e', 'Certificações'],
    icon: '★',
    details: 'Nossa curadoria especializada seleciona os melhores produtos educacionais e certificações do mercado. Desenvolvemos infoprodutos exclusivos e programas de certificação que validam competências essenciais. Cada produto passa por rigorosa avaliação de qualidade e relevância para garantir resultados tangíveis para profissionais e organizações.'
  },
  'node-03': {
    id: 'node-03',
    title: 'Formação de Lideranças',
    description: 'Forme líderes preparados para os desafios contemporâneos com foco em ESG e inclusão.',
    label: ['Formação de', 'Lideranças'],
    icon: '◈',
    details: 'Desenvolvemos líderes preparados para navegar em cenários complexos e liderar com propósito. Nossos programas abordam liderança sustentável, gestão de equipes diversas, liderança feminina e competências ESG. Formamos líderes que inspiram, engajam e geram resultados sustentáveis, criando culturas organizacionais mais inclusivas e inovadoras.'
  },
  'node-04': {
    id: 'node-04',
    title: 'Assessment Soft Skills + IA',
    description: 'Mapeie competências comportamentais com precisão usando inteligência artificial.',
    label: ['Assessment', 'Soft Skills'],
    icon: '◉',
    details: 'Nossa metodologia inovadora combina inteligência artificial com expertise humana para mapear competências comportamentais com precisão. Identificamos talentos, pontos de desenvolvimento e potencial de liderança, fornecendo insights acionáveis para decisões estratégicas de RH. O assessment gera relatórios detalhados com planos de desenvolvimento personalizados.'
  },
  'node-05': {
    id: 'node-05',
    title: 'Senior Advisor Sustentabilidade e ESG',
    description: 'Conte com expertise sênior em sustentabilidade corporativa e práticas ESG.',
    label: ['Senior Advisor', 'ESG'],
    icon: '⬡',
    details: 'Oferecemos consultoria sênior em sustentabilidade e ESG para organizações em diferentes estágios de maturidade. Nossa orientação estratégica ajuda a integrar práticas ambientais, sociais e de governança ao core business, gerando valor para stakeholders e sociedade. Acompanhamos desde o diagnóstico até a implementação e mensuração de resultados.'
  },
  'node-06': {
    id: 'node-06',
    title: 'Mentoria de Alto Impacto',
    description: 'Acelere sua trajetória profissional com mentoria personalizada e metodologia comprovada.',
    label: ['Mentoria de', 'Alto Impacto'],
    icon: '▲',
    details: 'Mentoria executiva personalizada para profissionais que buscam acelerar sua trajetória. Oferecemos acompanhamento individual em temas como carreira, liderança, ESG, IA e gestão de pessoas. Nossa metodologia comprovada combina sessões estruturadas, ferramentas práticas e accountability para garantir evolução consistente e resultados mensuráveis.'
  },
  'node-07': {
    id: 'node-07',
    title: 'Auditorias e Relatórios Técnicos',
    description: 'Obtenha diagnósticos precisos e documentação técnica especializada.',
    label: ['Auditorias e', 'Relatórios'],
    icon: '▤',
    details: 'Realizamos auditorias especializadas e produzimos relatórios técnicos de alta qualidade em ESG, sustentabilidade, educação corporativa e tecnologia. Nossa documentação segue padrões internacionais e fornece diagnósticos precisos, recomendações acionáveis e roadmaps de implementação para embasar decisões corporativas estratégicas.'
  },
  'node-08': {
    id: 'node-08',
    title: 'Missões e Imersões Técnicas',
    description: 'Expanda horizontes com experiências de aprendizado internacionais.',
    label: ['Missões e', 'Imersões'],
    icon: '◐',
    details: 'Organizamos missões técnicas e imersões internacionais que conectam sua equipe às melhores práticas globais. Visitamos centros de excelência, participamos de conferências e realizamos benchmarking com organizações líderes. Cada missão é desenhada para gerar insights aplicáveis e expandir a visão estratégica dos participantes.'
  },
  'node-09': {
    id: 'node-09',
    title: 'Redes e Networking',
    description: 'Construa conexões estratégicas que impulsionam negócios.',
    label: ['Redes e', 'Networking'],
    icon: '⬢',
    details: 'Facilitamos a construção de redes de relacionamento estratégicas entre líderes e executivos. Organizamos eventos exclusivos, grupos de discussão e encontros de networking qualificado. Nossas redes conectam profissionais com interesses comuns, gerando oportunidades de negócios, parcerias e troca de conhecimentos de alto valor.'
  },
  'node-10': {
    id: 'node-10',
    title: 'Processos de RH e Gestão',
    description: 'Estruture processos de RH eficientes e humanizados.',
    label: ['Processos', 'RH e Gestão'],
    icon: '⚙',
    details: 'Desenhamos e implementamos processos de RH modernos, eficientes e centrados nas pessoas. Atuamos em recrutamento e seleção, onboarding, avaliação de desempenho, gestão de clima e planos de carreira. Nossa abordagem equilibra eficiência operacional com experiência do colaborador, transformando RH em parceiro estratégico do negócio.'
  },
  'node-11': {
    id: 'node-11',
    title: 'Palestras e Painéis',
    description: 'Inspire sua audiência com apresentações de alto impacto.',
    label: ['Palestras e', 'Painéis'],
    icon: '◎',
    details: 'Oferecemos palestras, painéis e mesas redondas conduzidas por especialistas reconhecidos no mercado. Nossos conteúdos abordam liderança, inovação, ESG, transformação digital e tendências de gestão. Cada apresentação é customizada para o contexto do evento e desenhada para inspirar, provocar reflexão e gerar ação na audiência.'
  }
}

// ===================================
// GEOMETRY - Órbita circular única com 11 nós
// ===================================

const HUB = { cx: 400, cy: 300, r: 44 }

// Configuração de expansão - dois ghosts para estabilidade do hover
const EXPAND_SCALE = 1.5   // 50% maior (melhor leitura)

// Ghost 1: branco, visível - âncora visual
const GHOST_1_RADIUS = 10
// Ghost 2: cor do fundo (#141418), 4x maior - área de hover ainda mais estável
const GHOST_2_RADIUS = GHOST_1_RADIUS * 4  // 40px

// Órbita única
const ORBIT_RADIUS = 175
const NODE_RADIUS = 32

// Calcula afastamento para ghost 1 ficar tangente ao círculo expandido
const EXPANDED_RADIUS = NODE_RADIUS * EXPAND_SCALE
const EXPAND_DISTANCE = EXPANDED_RADIUS + GHOST_1_RADIUS + 2 // ~60px
const TOTAL_NODES = 11

// Função para calcular posição em órbita circular
function orbitPosition(
  hubCx: number, hubCy: number,
  radius: number,
  index: number,
  total: number,
  startAngle: number = -90 // Começa no topo
): { cx: number; cy: number } {
  const angle = startAngle + (360 / total) * index
  const radians = (angle * Math.PI) / 180
  return {
    cx: Math.round(hubCx + radius * Math.cos(radians)),
    cy: Math.round(hubCy + radius * Math.sin(radians))
  }
}

// Todos os 11 nós em uma única órbita circular (a cada ~32.7°)
const orbitNodes = [
  { id: 'node-01', ...orbitPosition(HUB.cx, HUB.cy, ORBIT_RADIUS, 0, TOTAL_NODES), r: NODE_RADIUS },
  { id: 'node-02', ...orbitPosition(HUB.cx, HUB.cy, ORBIT_RADIUS, 1, TOTAL_NODES), r: NODE_RADIUS },
  { id: 'node-03', ...orbitPosition(HUB.cx, HUB.cy, ORBIT_RADIUS, 2, TOTAL_NODES), r: NODE_RADIUS },
  { id: 'node-04', ...orbitPosition(HUB.cx, HUB.cy, ORBIT_RADIUS, 3, TOTAL_NODES), r: NODE_RADIUS },
  { id: 'node-05', ...orbitPosition(HUB.cx, HUB.cy, ORBIT_RADIUS, 4, TOTAL_NODES), r: NODE_RADIUS },
  { id: 'node-06', ...orbitPosition(HUB.cx, HUB.cy, ORBIT_RADIUS, 5, TOTAL_NODES), r: NODE_RADIUS },
  { id: 'node-07', ...orbitPosition(HUB.cx, HUB.cy, ORBIT_RADIUS, 6, TOTAL_NODES), r: NODE_RADIUS },
  { id: 'node-08', ...orbitPosition(HUB.cx, HUB.cy, ORBIT_RADIUS, 7, TOTAL_NODES), r: NODE_RADIUS },
  { id: 'node-09', ...orbitPosition(HUB.cx, HUB.cy, ORBIT_RADIUS, 8, TOTAL_NODES), r: NODE_RADIUS },
  { id: 'node-10', ...orbitPosition(HUB.cx, HUB.cy, ORBIT_RADIUS, 9, TOTAL_NODES), r: NODE_RADIUS },
  { id: 'node-11', ...orbitPosition(HUB.cx, HUB.cy, ORBIT_RADIUS, 10, TOTAL_NODES), r: NODE_RADIUS },
]

// Mantém compatibilidade com o resto do código
const outerOrbit = orbitNodes
const innerOrbit: typeof orbitNodes = []

const allNodes = [...outerOrbit, ...innerOrbit]

// ===================================
// HELPERS
// ===================================

function getExpandedPosition(
  nodeCx: number,
  nodeCy: number,
  hubCx: number,
  hubCy: number,
  distance: number
): { cx: number; cy: number } {
  // Calcula direção radial (oposta ao hub)
  const dx = nodeCx - hubCx
  const dy = nodeCy - hubCy
  const length = Math.sqrt(dx * dx + dy * dy)

  // Normaliza e multiplica pela distância
  const nx = dx / length
  const ny = dy / length

  return {
    cx: nodeCx + nx * distance,
    cy: nodeCy + ny * distance
  }
}

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

export function SolucoesOrganizacoes() {
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

  // Pré-calcula posições expandidas
  const expandedPositions = useMemo(() => {
    const positions: Record<string, { cx: number; cy: number }> = {}
    allNodes.forEach(node => {
      positions[node.id] = getExpandedPosition(
        node.cx, node.cy,
        HUB.cx, HUB.cy,
        EXPAND_DISTANCE
      )
    })
    return positions
  }, [])

  const hoveredNodeData = hoveredNode && hoveredNode !== 'hub' ? nodesData[hoveredNode] : null

  return (
    <section id="solucoes-org" className="solucoes">
      <div className="solucoes__container">
        <div ref={titleRef}>
          <h2
            className={cn(
              'solucoes__title reveal',
              titleVisible && 'visible'
            )}
          >
            Soluções para Organizações
          </h2>
          <p
            className={cn(
              'solucoes__subtitle reveal reveal-delay-1',
              titleVisible && 'visible'
            )}
          >
            Conheça nosso ecossistema de soluções integradas
          </p>
        </div>

        {/* Grid: 1/5 painel | 3/5 diagrama | 1/5 vazio */}
        <div className="solucoes__grid">
          {/* Coluna 1: Painel de Explicação (1/5) */}
          <div className={cn('solucoes__panel', hoveredNodeData && 'solucoes__panel--visible')}>
            {hoveredNodeData ? (
              <>
                <div className="solucoes__panel-header">
                  <h3 className="solucoes__panel-title">{hoveredNodeData.title}</h3>
                  <span className="solucoes__panel-icon">{hoveredNodeData.icon}</span>
                </div>
                <div className="solucoes__panel-body">
                  <p className="solucoes__panel-details">{hoveredNodeData.details}</p>
                </div>
              </>
            ) : (
              <p className="solucoes__panel-placeholder">
                Passe o mouse sobre uma solução para ver detalhes.
              </p>
            )}
          </div>

          {/* Coluna 2: Diagrama (3/5) */}
          <div
            ref={svgRef}
            className={cn('solucoes__viz reveal reveal-delay-2', svgVisible && 'visible')}
          >
          <svg
            id="solucoes-svg"
            className="solucoes__svg"
            viewBox="0 0 800 600"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Visualização das Soluções para Organizações"
          >
            <defs>
              <linearGradient id="arcGradientSolucoes" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--ring0)" />
                <stop offset="100%" stopColor="var(--ring1)" />
              </linearGradient>
              <filter id="glowFilterSolucoes" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Ghost 2 Buffer - renderizado ANTES das linhas (fica atrás) */}
            {allNodes.map((node) => {
              const isExpanded = hoveredNode === node.id
              if (!isExpanded) return null

              return (
                <circle
                  key={`ghost2-${node.id}`}
                  className="solucoes__ghost solucoes__ghost--buffer"
                  cx={node.cx}
                  cy={node.cy}
                  r={GHOST_2_RADIUS}
                  fill="#141418"
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                />
              )
            })}

            {/* Connection Lines */}
            <g id="solucoes-links" className="solucoes__links">
              {allNodes.map((node) => {
                const isExpanded = hoveredNode === node.id
                const targetPos = isExpanded
                  ? expandedPositions[node.id]
                  : { cx: node.cx, cy: node.cy }
                const end = getShortenedLineEnd(HUB.cx, HUB.cy, targetPos.cx, targetPos.cy, 20)

                return (
                  <line
                    key={`link-${node.id}`}
                    className={cn(
                      'solucoes__link',
                      isExpanded && 'solucoes__link--expanded'
                    )}
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
              id="node-hub-solucoes"
              className={cn(
                'solucoes__node solucoes__hub',
                !reducedMotion && 'solucoes__hub--pulse',
                (hoveredNode === 'hub' || selectedNode === 'hub') && 'solucoes__node--active'
              )}
              data-node-id="hub"
              tabIndex={0}
              role="button"
              aria-label="Núcleo das soluções"
              aria-pressed={selectedNode === 'hub'}
              onClick={() => handleNodeClick('hub')}
              onKeyDown={(e) => handleKeyDown(e, 'hub')}
              onMouseEnter={() => setHoveredNode('hub')}
              onMouseLeave={() => setHoveredNode(null)}
              onFocus={() => setHoveredNode('hub')}
              onBlur={() => setHoveredNode(null)}
              style={{ transformOrigin: `${HUB.cx}px ${HUB.cy}px` }}
            >
              <circle
                className="node__base node__base--hub"
                cx={HUB.cx}
                cy={HUB.cy}
                r={HUB.r}
              />
              <circle
                className="node__ring"
                cx={HUB.cx}
                cy={HUB.cy}
                r={HUB.r + 6}
                fill="none"
                strokeWidth="1.5"
              />
              <text
                className="node__label node__label--hub-main"
                x={HUB.cx}
                y={HUB.cy - 10}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ fontSize: '11px' }}
              >
                ARBACHE
              </text>
              <text
                className="node__label node__label--hub-sub"
                x={HUB.cx}
                y={HUB.cy + 3}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ fontSize: '8px' }}
              >
                CONSULTING
              </text>
              <text
                className="node__label node__label--hub-terceiro"
                x={HUB.cx}
                y={HUB.cy + 14}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ fontSize: '6px' }}
              >
                ORGANIZAÇÕES
              </text>
            </g>

            {/* Ghost 1 Anchor (âncora branca visível) - na frente da linha */}
            {allNodes.map((node) => {
              const isExpanded = hoveredNode === node.id
              if (!isExpanded) return null

              return (
                <circle
                  key={`ghost1-${node.id}`}
                  className="solucoes__ghost solucoes__ghost--anchor"
                  cx={node.cx}
                  cy={node.cy}
                  r={GHOST_1_RADIUS}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                />
              )
            })}

            {/* All 11 Orbital Nodes */}
            {allNodes.map((node) => {
              const isExpanded = hoveredNode === node.id
              const isSelected = selectedNode === node.id
              const isActive = isExpanded || isSelected
              const data = nodesData[node.id]

              // Posições: original ou expandida
              const currentPos = isExpanded
                ? expandedPositions[node.id]
                : { cx: node.cx, cy: node.cy }

              // Tamanhos: normal ou expandido
              const currentR = isExpanded ? node.r * EXPAND_SCALE : node.r
              const arcRadius = currentR + 6

              // Fonte proporcional ao raio do círculo (garante texto dentro)
              // Regra: fontSize ≈ raio * 0.28, lineHeight ≈ raio * 0.35
              const fontSize = Math.round(currentR * 0.28)
              const lineHeight = Math.round(currentR * 0.35)

              const animDuration = isActive ? '2.4s' : '3.6s'

              return (
                <g
                  key={node.id}
                  id={`${node.id}-solucoes`}
                  className={cn(
                    'solucoes__node',
                    isExpanded && 'solucoes__node--expanded',
                    isActive && 'solucoes__node--active',
                    isSelected && 'solucoes__node--selected'
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
                >
                  {/* Node base circle */}
                  <circle
                    className="node__base"
                    cx={currentPos.cx}
                    cy={currentPos.cy}
                    r={currentR}
                  />

                  {/* Arc loader ring */}
                  <circle
                    className={cn(
                      'node__arc',
                      !reducedMotion && 'node__arc--animated'
                    )}
                    cx={currentPos.cx}
                    cy={currentPos.cy}
                    r={arcRadius}
                    fill="none"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray="50 999"
                    style={{ transformOrigin: `${currentPos.cx}px ${currentPos.cy}px` }}
                  />

                  {/* Dot - posição explícita para quando reducedMotion está ativo */}
                  <circle
                    className="node__dot"
                    cx={reducedMotion ? currentPos.cx : undefined}
                    cy={reducedMotion ? currentPos.cy - arcRadius : undefined}
                    r="2.5"
                    fill="var(--dotHex)"
                  >
                    {!reducedMotion && (
                      <animateMotion
                        dur={animDuration}
                        repeatCount="indefinite"
                        path={`M ${currentPos.cx} ${currentPos.cy - arcRadius} A ${arcRadius} ${arcRadius} 0 1 1 ${currentPos.cx - 0.001} ${currentPos.cy - arcRadius}`}
                      />
                    )}
                  </circle>

                  {/* Node labels */}
                  {data.label.map((line, i) => (
                    <text
                      key={i}
                      className="node__label"
                      x={currentPos.cx}
                      y={currentPos.cy + (i - (data.label.length - 1) / 2) * lineHeight}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      style={{ fontSize: `${fontSize}px` }}
                    >
                      {line}
                    </text>
                  ))}
                </g>
              )
            })}
          </svg>
        </div>
        {/* Coluna 3: Vazio (1/5) */}
        <div className="solucoes__spacer" />
      </div>
      </div>
    </section>
  )
}
