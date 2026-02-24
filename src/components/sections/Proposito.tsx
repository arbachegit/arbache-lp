'use client'

import { useState } from 'react'
import { useReveal } from '@/hooks/useReveal'
import { useCounterAnimation } from '@/hooks/useCounterAnimation'
import { cn } from '@/lib/utils'

// ─── Icons ───────────────────────────────────────────────

const MissaoIcon = () => (
  <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7">
    <circle cx="14" cy="14" r="12" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <circle cx="14" cy="14" r="7" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <circle cx="14" cy="14" r="2.5" fill="currentColor" />
    <path d="M14 2v4M14 22v4M2 14h4M22 14h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const VisaoIcon = () => (
  <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7">
    <path d="M2 14s4.5-9 12-9 12 9 12 9-4.5 9-12 9-12-9-12-9z" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <circle cx="14" cy="14" r="4.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <circle cx="14" cy="14" r="1.8" fill="currentColor" />
  </svg>
)

const ExcelenciaIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6L12 2z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
  </svg>
)

const PersonalizacaoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M16 3l2 2-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const EticaIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
    <path d="M12 3v18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M3 7h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M6 7l-2 8c0 1.5 2 3 4.5 3s4.5-1.5 4.5-3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M18 7l-2 8c0 1.5-2 3-4.5 3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
  </svg>
)

const CompartilhadoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
    <circle cx="8" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <circle cx="16" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M2 20c0-3 2.5-5.5 6-5.5 1.2 0 2.3.3 3.2.8" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M22 20c0-3-2.5-5.5-6-5.5-1.2 0-2.3.3-3.2.8" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
  </svg>
)

const InovacaoPropositoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
    <circle cx="12" cy="10" r="6" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M10 16v3a2 2 0 004 0v-3" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M12 4V2M18 10h2M4 10H2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="12" cy="10" r="2" fill="currentColor" opacity="0.4" />
  </svg>
)

const MercadoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M12 3c2 3 3 6 3 9s-1 6-3 9M12 3c-2 3-3 6-3 9s1 6 3 9" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M3 12h18" stroke="currentColor" strokeWidth="1.5" />
  </svg>
)

const AprendizadoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
    <path d="M4 19V5a2 2 0 012-2h12a2 2 0 012 2v14" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M4 19a2 2 0 012-2h12a2 2 0 012 2" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M9 7h6M9 11h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M12 15l3-3M12 15l-3-3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
  </svg>
)

const KendallIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
    <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M7 10h2v4H7zM11 9h2v5h-2zM15 11h2v3h-2z" fill="currentColor" opacity="0.5" />
    <circle cx="12" cy="4" r="1.5" stroke="currentColor" strokeWidth="1" fill="none" />
    <path d="M12 5.5V6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
  </svg>
)

const AIFirstIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M12 7v2M12 15v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M8 9.5c0-1 1-2 2.5-2h3c1.5 0 2.5 1 2.5 2s-1 2-2.5 2h-1c-1.5 0-2.5 1-2.5 2s1 2 2.5 2h3c1.5 0 2.5-1 2.5-2" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <circle cx="7" cy="12" r="1" fill="currentColor" />
    <circle cx="17" cy="12" r="1" fill="currentColor" />
  </svg>
)

// ─── Mapa Kendall Square ─────────────────────────────────

const KendallMap = () => (
  <svg viewBox="0 0 800 400" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <style>{`
        @keyframes kendall-radar {
          0% { r: 3; opacity: 0.9; }
          100% { r: 14; opacity: 0; }
        }
      `}</style>
    </defs>
    {/* Americas */}
    <path d="M150,80 L160,70 L175,75 L185,85 L180,100 L190,110 L185,125 L175,130 L170,145 L165,155 L160,170 L155,185 L160,200 L170,215 L175,230 L180,250 L175,265 L165,275 L155,290 L150,305 L155,320 L160,335 L155,345 L145,340 L140,325 L130,310 L125,295 L128,280 L135,265 L130,250 L125,235 L120,220 L115,205 L118,190 L122,175 L125,160 L120,145 L115,130 L110,115 L115,100 L120,90 L130,80 L140,75 Z" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
    {/* South America */}
    <path d="M185,215 L195,210 L210,215 L220,225 L225,240 L230,260 L225,280 L215,300 L205,315 L195,325 L185,330 L180,320 L175,305 L178,290 L182,275 L185,260 L182,245 L180,230 Z" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
    {/* Europe */}
    <path d="M365,65 L375,60 L390,55 L400,60 L410,65 L420,60 L425,70 L430,80 L425,90 L420,100 L410,105 L400,110 L390,115 L380,110 L370,105 L365,95 L360,85 L362,75 Z" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
    {/* Africa */}
    <path d="M385,140 L400,135 L415,140 L425,150 L430,165 L435,185 L432,205 L425,225 L415,245 L405,260 L395,270 L385,265 L378,250 L375,235 L372,220 L370,200 L372,180 L375,165 L380,150 Z" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
    {/* Asia */}
    <path d="M440,50 L460,45 L480,40 L510,45 L540,50 L570,55 L600,50 L625,55 L640,65 L650,80 L660,95 L655,110 L645,120 L630,125 L615,130 L600,135 L580,130 L560,125 L540,130 L525,140 L510,150 L500,160 L485,155 L475,145 L465,135 L455,120 L445,105 L438,90 L435,75 L437,60 Z" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
    {/* India */}
    <path d="M530,155 L545,150 L555,160 L560,175 L555,195 L545,210 L535,205 L525,195 L520,180 L522,165 Z" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
    {/* Australia */}
    <path d="M620,260 L640,255 L660,260 L675,270 L680,285 L675,300 L660,310 L645,312 L630,305 L620,295 L615,280 L618,268 Z" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
    {/* Kendall Square / CIC - Cambridge, MA */}
    <circle cx="213" cy="92" r="3" fill="none" stroke="rgba(220,60,60,0.9)" strokeWidth="1.5" style={{ animation: 'kendall-radar 2s ease-out infinite' }} />
    <circle cx="213" cy="92" r="3" fill="none" stroke="rgba(220,60,60,0.9)" strokeWidth="1.5" style={{ animation: 'kendall-radar 2s ease-out infinite', animationDelay: '0.7s' }} />
    <circle cx="213" cy="92" r="3" fill="none" stroke="rgba(220,60,60,0.9)" strokeWidth="1.5" style={{ animation: 'kendall-radar 2s ease-out infinite', animationDelay: '1.4s' }} />
    <circle cx="213" cy="92" r="3.5" fill="rgba(220,60,60,1)" />
    {/* Label */}
    <text x="225" y="89" fill="rgba(255,255,255,0.7)" fontSize="9" fontFamily="Lato, sans-serif" fontWeight="400">Kendall Square</text>
    <text x="225" y="100" fill="rgba(255,255,255,0.5)" fontSize="8" fontFamily="Lato, sans-serif">Cambridge, MA</text>
  </svg>
)

// ─── Dados dos cartões ──────────────────────────────────

const valores = [
  {
    title: 'Excelência',
    desc: 'Padrões elevados em conteúdo acadêmico e parcerias internacionais.',
    Icon: ExcelenciaIcon,
    gradient: 'linear-gradient(135deg, #1e1e1e, #2a2a2a)',
    modalTitle: 'Excelência',
    modalDesc: 'Nosso compromisso com a excelência se traduz em conteúdos desenvolvidos com rigor acadêmico de instituições como MIT Professional Education e FGV, aliados à vivência prática de executivos que atuam nos maiores mercados do mundo. Cada programa é construído para entregar o mais alto nível de qualidade, com metodologias validadas internacionalmente e resultados mensuráveis para lideranças e organizações.',
  },
  {
    title: 'Personalização',
    desc: 'Experiências de aprendizagem inovadoras e sob medida.',
    Icon: PersonalizacaoIcon,
    gradient: 'linear-gradient(135deg, #222222, #2e2e2e)',
    modalTitle: 'Personalização',
    modalDesc: 'Acreditamos que cada organização possui desafios únicos. Por isso, desenhamos trilhas de aprendizagem sob medida, adaptadas à cultura, ao momento estratégico e aos objetivos de cada cliente. Da análise diagnóstica à entrega final, cada etapa é customizada para maximizar a absorção de conhecimento e a aplicabilidade prática dos conteúdos, gerando transformação real e duradoura.',
  },
  {
    title: 'Consciência Ética',
    desc: 'Relações baseadas em valores éticos e propósito compartilhado.',
    Icon: EticaIcon,
    gradient: 'linear-gradient(135deg, #252525, #323232)',
    modalTitle: 'Consciência Ética',
    modalDesc: 'A ética é o alicerce de tudo o que fazemos. Cultivamos relações de confiança com clientes, parceiros e comunidades, pautadas pela transparência, integridade e responsabilidade social. Nossos programas formam líderes que compreendem que resultados sustentáveis só são possíveis quando construídos sobre uma base ética sólida, respeitando pessoas, sociedade e meio ambiente.',
  },
  {
    title: 'Valor Compartilhado',
    desc: 'Parceiros na formação de líderes responsáveis.',
    Icon: CompartilhadoIcon,
    gradient: 'linear-gradient(135deg, #1c1c1c, #282828)',
    modalTitle: 'Valor Compartilhado',
    modalDesc: 'Operamos na interseção entre geração de valor econômico e impacto social positivo. Nossos programas são projetados para que cada investimento em desenvolvimento de talentos gere retorno tangível para a organização e, simultaneamente, contribua para o fortalecimento das comunidades e da sociedade. Formamos líderes que entendem que prosperidade genuína é sempre compartilhada.',
  },
  {
    title: 'Inovação com Propósito',
    desc: 'Tecnologia e IA para gerar impacto real e sustentável.',
    Icon: InovacaoPropositoIcon,
    gradient: 'linear-gradient(135deg, #202020, #2c2c2c)',
    modalTitle: 'Inovação com Propósito',
    modalDesc: 'A inovação na Arbache não é um fim em si mesma — é um meio para amplificar o impacto humano. Utilizamos inteligência artificial, ciência de dados e metodologias de ponta para criar experiências de aprendizagem mais eficientes, acessíveis e transformadoras. Cada tecnologia implementada serve a um propósito claro: potencializar o desenvolvimento de pessoas e organizações.',
  },
  {
    title: 'Conexão com o Mercado',
    desc: 'Integração com executivos e desafios reais dos negócios.',
    Icon: MercadoIcon,
    gradient: 'linear-gradient(135deg, #242424, #303030)',
    modalTitle: 'Conexão com o Mercado',
    modalDesc: 'Nossos programas são desenvolvidos em parceria direta com executivos e organizações que enfrentam os desafios mais complexos do mercado global. Essa conexão permanente garante que cada conteúdo, caso prático e simulação reflita a realidade contemporânea dos negócios, preparando lideranças para tomar decisões estratégicas com confiança e visão sistêmica.',
  },
  {
    title: 'Aprendizado Contínuo',
    desc: 'Desenvolvimento permanente como base da alta performance.',
    Icon: AprendizadoIcon,
    gradient: 'linear-gradient(135deg, #1e1e1e, #2a2a2a)',
    modalTitle: 'Aprendizado Contínuo',
    modalDesc: 'Em um mundo que se transforma em velocidade exponencial, o aprendizado contínuo é a competência mais estratégica de uma organização. Criamos ecossistemas de desenvolvimento que acompanham líderes e equipes ao longo de toda a jornada profissional, com conteúdos atualizados, mentorias recorrentes e comunidades de prática que mantêm o conhecimento vivo e aplicável.',
  },
  {
    title: 'Conexão com a Inovação',
    desc: 'Conectados às maiores tecnologias produzidas em Kendall Square.',
    Icon: KendallIcon,
    gradient: 'linear-gradient(135deg, #1a1a1e, #262630)',
    modalTitle: 'Conexão com a Inovação',
    modalDesc: 'KENDALL_SQUARE',
  },
  {
    title: 'AI First',
    desc: 'Empresa administrada por IA na busca de precisão e qualidade.',
    Icon: AIFirstIcon,
    gradient: 'linear-gradient(135deg, #1c1c22, #28282e)',
    modalTitle: 'AI First',
    modalDesc: 'Somos uma empresa AI First — a inteligência artificial não é apenas uma ferramenta, é parte estrutural da nossa operação. Da curadoria de conteúdos à análise de dados de performance, da personalização de trilhas de aprendizagem à gestão operacional, a IA permeia cada processo com o objetivo de alcançar máxima precisão, eficiência e qualidade. Essa abordagem nos permite entregar experiências educacionais hiperpersonalizadas, escalar com consistência e antecipar tendências do mercado. Acreditamos que a combinação entre inteligência artificial e inteligência humana é o caminho para resultados extraordinários.',
  },
]

// ─── Close icon ──────────────────────────────────────────

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// ─── Modal Component ─────────────────────────────────────

function ValorModal({ valor, onClose }: { valor: typeof valores[number]; onClose: () => void }) {
  const isKendall = valor.modalDesc === 'KENDALL_SQUARE'

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-[640px] max-h-[85vh] overflow-y-auto rounded-2xl p-8 md:p-10"
        style={{ background: '#141414', boxShadow: '0 24px 80px rgba(0,0,0,0.8)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Fechar"
        >
          <CloseIcon />
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/8 text-[#E6E6E6] border border-white/10">
            <valor.Icon />
          </div>
          <h3 className="font-section text-[1.5rem] text-[#E6E6E6]">{valor.modalTitle}</h3>
        </div>

        {isKendall ? (
          <>
            <p className="text-white/80 text-[0.95rem] leading-relaxed mb-6">
              Mantemos conexão direta com o ecossistema de inovação mais denso do planeta: Kendall Square, em Cambridge, Massachusetts. Este quilômetro quadrado concentra mais inovação por metro quadrado do que qualquer outro lugar do mundo, reunindo as maiores universidades, centros de pesquisa e empresas de tecnologia globais.
            </p>

            {/* Map */}
            <div className="mb-6 rounded-xl overflow-hidden border border-white/10 bg-black/30 p-4">
              <KendallMap />
            </div>

            <div className="mb-6">
              <h4 className="font-[Montserrat] text-[0.7rem] tracking-[0.15em] uppercase text-white/50 mb-4">Universidades</h4>
              <div className="flex flex-wrap gap-2 mb-6">
                {['MIT', 'Harvard University', 'Boston University', 'Tufts University'].map((name) => (
                  <span key={name} className="font-[Lato,sans-serif] text-[0.85rem] text-white/80 bg-white/6 px-3 py-1.5 rounded-lg border border-white/10">{name}</span>
                ))}
              </div>

              <h4 className="font-[Montserrat] text-[0.7rem] tracking-[0.15em] uppercase text-white/50 mb-4">Empresas e Centros de Pesquisa</h4>
              <div className="flex flex-wrap gap-2 mb-6">
                {[
                  'Google', 'Amazon', 'Microsoft', 'Meta', 'Apple',
                  'IBM', 'Moderna', 'Novartis', 'Pfizer', 'Sanofi',
                  'Akamai Technologies', 'Biogen', 'Broad Institute',
                ].map((name) => (
                  <span key={name} className="font-[Lato,sans-serif] text-[0.85rem] text-white/80 bg-white/6 px-3 py-1.5 rounded-lg border border-white/10">{name}</span>
                ))}
              </div>
            </div>

            <div className="border-t border-white/10 pt-5">
              <p className="font-[Lato,sans-serif] text-[0.95rem] text-white/90 font-medium">
                Presença permanente no Cambridge Innovation Center (CIC)
              </p>
              <p className="font-[Lato,sans-serif] text-[0.82rem] text-white/50 mt-1">
                O maior hub de inovação e empreendedorismo do mundo, localizado no coração de Kendall Square.
              </p>
            </div>
          </>
        ) : (
          <p className="text-white/80 text-[0.95rem] leading-relaxed">{valor.modalDesc}</p>
        )}
      </div>
    </div>
  )
}

// ─── Counter ─────────────────────────────────────────────

function Counter({ target, label, isYear = false }: { target: number; label: string; isYear?: boolean }) {
  const { ref, isVisible } = useReveal<HTMLDivElement>()
  const count = useCounterAnimation(target, isVisible)

  const formatNumber = (num: number) => {
    if (isYear) return num.toString()
    if (num >= 1000) return `+${num.toLocaleString('pt-BR')}`
    return `${num}+`
  }

  return (
    <div ref={ref} className="text-center">
      <div className="font-[Cinzel] text-[2.8rem] font-bold text-[#E6E6E6]">
        {isVisible ? formatNumber(count) : '—'}
      </div>
      <div className="font-[Montserrat] text-[0.7rem] tracking-[0.12em] uppercase text-white/60 mt-1">
        {label}
      </div>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────

export function Proposito() {
  const { ref: titleRef, isVisible: titleVisible } = useReveal<HTMLDivElement>()
  const { ref: mvvRef, isVisible: mvvVisible } = useReveal<HTMLDivElement>()
  const { ref: valoresRef, isVisible: valoresVisible } = useReveal<HTMLDivElement>()
  const [activeModal, setActiveModal] = useState<number | null>(null)

  return (
    <section
      id="proposito"
      className="py-[100px] relative overflow-hidden text-white"
      style={{ background: '#141414' }}
    >
      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.35] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '256px 256px',
        }}
      />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10 text-center">
        <div ref={titleRef}>
          <h2
            className={cn(
              'font-section text-[clamp(1.8rem,3.5vw,2.8rem)] mb-4 text-[#E6E6E6] reveal',
              titleVisible && 'visible'
            )}
          >
            Nosso Propósito
          </h2>
          <p
            className={cn(
              'font-tagline text-[1.5rem] text-white/85 max-w-[650px] mx-auto mb-[60px] reveal reveal-delay-1',
              titleVisible && 'visible'
            )}
          >
            &ldquo;Mudar o mundo por meio da educação, transformando conhecimento em resultados!&rdquo;
          </p>
        </div>

        <div
          ref={mvvRef}
          className={cn(
            'grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-10 mb-[60px] reveal reveal-delay-2',
            mvvVisible && 'visible'
          )}
        >
          <div
            className="rounded-2xl p-9 cursor-pointer transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-[1.02]"
            style={{
              background: '#1a1a1a',
              boxShadow: '8px 8px 20px rgba(0,0,0,0.6), -8px -8px 20px rgba(255,255,255,0.04)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '12px 12px 30px rgba(0,0,0,0.8), -6px -6px 16px rgba(255,255,255,0.06), 0 0 40px rgba(255,255,255,0.03)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '8px 8px 20px rgba(0,0,0,0.6), -8px -8px 20px rgba(255,255,255,0.04)'
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="text-[#E6E6E6]"><MissaoIcon /></div>
              <h3 className="font-section text-[1.3rem] text-[#E6E6E6]">Missão</h3>
            </div>
            <p className="text-white/80 text-[0.95rem]">
              Promover educação de excelência e personalizada para negócios, lideranças e talentos,
              integrando rigor acadêmico, práticas de mercado, inovação tecnológica, conexões e
              sustentabilidade, para desenvolver lideranças conscientes e gerar resultados de alto
              desempenho.
            </p>
          </div>
          <div
            className="rounded-2xl p-9 cursor-pointer transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-[1.02]"
            style={{
              background: '#1a1a1a',
              boxShadow: '8px 8px 20px rgba(0,0,0,0.6), -8px -8px 20px rgba(255,255,255,0.04)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '12px 12px 30px rgba(0,0,0,0.8), -6px -6px 16px rgba(255,255,255,0.06), 0 0 40px rgba(255,255,255,0.03)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '8px 8px 20px rgba(0,0,0,0.6), -8px -8px 20px rgba(255,255,255,0.04)'
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="text-[#E6E6E6]"><VisaoIcon /></div>
              <h3 className="font-section text-[1.3rem] text-[#E6E6E6]">Visão</h3>
            </div>
            <p className="text-white/80 text-[0.95rem]">
              Ser referência em educação em negócios, reconhecida pela excelência e personalização
              na formação de lideranças e talentos conscientes e inovadores, que geram resultados de
              alto desempenho.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-8 mb-12">
          <Counter target={4000} label="Líderes Desenvolvidos" />
          <Counter target={20} label="Anos de Docência" />
          <Counter target={11} label="Livros Publicados" />
          <Counter target={2023} label="SDG Pioneer ONU" isYear />
        </div>

        <div
          ref={valoresRef}
          className={cn(
            'grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5 mt-12 reveal reveal-delay-4',
            valoresVisible && 'visible'
          )}
        >
          {valores.map((valor, index) => (
            <div
              key={valor.title}
              onClick={() => setActiveModal(index)}
              className="rounded-xl p-6 border-l-[3px] border-[#555] text-left cursor-pointer transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-[1.03] hover:border-[#888] group"
              style={{
                background: valor.gradient,
                boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.6), 0 0 20px rgba(255,255,255,0.03)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)'
              }}
            >
              <div className="flex items-center gap-2.5 mb-2">
                <div className="text-[#999] group-hover:text-[#E6E6E6] transition-colors">
                  <valor.Icon />
                </div>
                <strong className="text-[#E6E6E6]">{valor.title}</strong>
              </div>
              <p className="text-white/60 text-[0.85rem] leading-relaxed mb-3">{valor.desc}</p>
              <span className="inline-block font-[Montserrat] text-[0.65rem] tracking-[0.1em] uppercase text-white/40 border border-white/15 rounded-[20px] px-3 py-1 group-hover:text-white/70 group-hover:border-white/30 transition-colors">
                Saiba mais
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {activeModal !== null && (
        <ValorModal
          valor={valores[activeModal]}
          onClose={() => setActiveModal(null)}
        />
      )}
    </section>
  )
}
