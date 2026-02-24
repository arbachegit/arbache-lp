'use client'

import { useReveal } from '@/hooks/useReveal'
import { useCounterAnimation } from '@/hooks/useCounterAnimation'
import { cn } from '@/lib/utils'

const valores = [
  { title: 'Excelência', desc: 'Padrões elevados em conteúdo acadêmico, experiência de mercado e parcerias internacionais.' },
  { title: 'Personalização', desc: 'Experiências de aprendizagem e iniciativas educacionais inovadoras e sob medida.' },
  { title: 'Consciência Ética', desc: 'Relações sólidas baseadas em valores éticos e compartilhamento de propósito.' },
  { title: 'Valor Compartilhado', desc: 'Parceiros na formação de líderes responsáveis com compromisso social.' },
  { title: 'Inovação com Propósito', desc: 'Tecnologia e IA para gerar impacto real e sustentável.' },
  { title: 'Conexão com o Mercado', desc: 'Integração com executivos e desafios reais dos negócios.' },
  { title: 'Aprendizado Contínuo', desc: 'Desenvolvimento permanente como base da alta performance.' },
]

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

export function Proposito() {
  const { ref: titleRef, isVisible: titleVisible } = useReveal<HTMLDivElement>()
  const { ref: mvvRef, isVisible: mvvVisible } = useReveal<HTMLDivElement>()
  const { ref: valoresRef, isVisible: valoresVisible } = useReveal<HTMLDivElement>()

  return (
    <section
      id="proposito"
      className="py-[100px] relative overflow-hidden text-white"
      style={{
        background: '#141414',
      }}
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
          <div className="bg-white/8 rounded-xl p-9 border border-white/10 backdrop-blur-[4px]">
            <h3 className="font-section text-[1.3rem] mb-3 text-[#E6E6E6]">Missão</h3>
            <p className="text-white/80 text-[0.95rem]">
              Promover educação de excelência e personalizada para negócios, lideranças e talentos,
              integrando rigor acadêmico, práticas de mercado, inovação tecnológica, conexões e
              sustentabilidade, para desenvolver lideranças conscientes e gerar resultados de alto
              desempenho.
            </p>
          </div>
          <div className="bg-white/8 rounded-xl p-9 border border-white/10 backdrop-blur-[4px]">
            <h3 className="font-section text-[1.3rem] mb-3 text-[#E6E6E6]">Visão</h3>
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
          {valores.map((valor) => (
            <div
              key={valor.title}
              className="bg-white/6 rounded-lg p-6 border-l-[3px] border-[#E6E6E6] text-left"
            >
              <strong className="text-[#E6E6E6]">{valor.title}</strong>
              <span className="text-white/80"> — {valor.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
