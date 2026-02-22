'use client'

import { useState } from 'react'
import { useReveal } from '@/hooks/useReveal'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { z } from 'zod'

const contatoSchema = z.object({
  nome: z.string().min(2, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  telefone: z.string().optional(),
  solucao: z.string().min(1, 'Selecione uma solução'),
  mensagem: z.string().optional(),
})

const solucoes = [
  'Educação Corporativa',
  'Liderança e Gestão de Equipes',
  'ESG e Sustentabilidade',
  'Assessment e People Analytics',
  'Mentoria de Carreira',
  'Liderança Feminina',
  'Palestras e Keynotes',
  'Missões Internacionais',
  'Outro',
]

export function Contato() {
  const { ref: titleRef, isVisible: titleVisible } = useReveal<HTMLDivElement>()
  const { ref: formRef, isVisible: formVisible } = useReveal<HTMLFormElement>()
  const { ref: infoRef, isVisible: infoVisible } = useReveal<HTMLDivElement>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      nome: formData.get('nome') as string,
      email: formData.get('email') as string,
      telefone: formData.get('telefone') as string,
      solucao: formData.get('solucao') as string,
      mensagem: formData.get('mensagem') as string,
    }

    try {
      contatoSchema.parse(data)
      // Here you would send to your API
      alert('Mensagem enviada com sucesso!')
      e.currentTarget.reset()
    } catch (error) {
      if (error instanceof z.ZodError) {
        alert(error.issues.map((e) => e.message).join('\n'))
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contato" className="py-[100px] bg-[#0A0A0A] text-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div ref={titleRef} className="text-center mb-[60px]">
          <h2
            className={cn(
              'font-section text-[clamp(1.8rem,3.5vw,2.8rem)] mb-4 text-white reveal',
              titleVisible && 'visible'
            )}
          >
            Fale Conosco
          </h2>
          <p
            className={cn(
              'font-tagline text-[clamp(1rem,2vw,1.25rem)] text-white/60 max-w-[650px] mx-auto reveal reveal-delay-1',
              titleVisible && 'visible'
            )}
          >
            Descubra a solução ideal para você e sua organização
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[60px]">
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className={cn('reveal', formVisible && 'visible')}
          >
            <div className="mb-5">
              <label className="block font-[Montserrat] text-[0.7rem] tracking-[0.08em] uppercase text-white/60 mb-2">
                Nome completo
              </label>
              <Input
                name="nome"
                placeholder="Seu nome"
                required
                className="bg-white/[0.06] border-white/[0.12] text-white placeholder:text-white/40 focus:border-[#DAC6B5]"
              />
            </div>

            <div className="mb-5">
              <label className="block font-[Montserrat] text-[0.7rem] tracking-[0.08em] uppercase text-white/60 mb-2">
                E-mail corporativo
              </label>
              <Input
                name="email"
                type="email"
                placeholder="seu@email.com"
                required
                className="bg-white/[0.06] border-white/[0.12] text-white placeholder:text-white/40 focus:border-[#DAC6B5]"
              />
            </div>

            <div className="mb-5">
              <label className="block font-[Montserrat] text-[0.7rem] tracking-[0.08em] uppercase text-white/60 mb-2">
                Telefone / WhatsApp
              </label>
              <Input
                name="telefone"
                type="tel"
                placeholder="(11) 99999-9999"
                className="bg-white/[0.06] border-white/[0.12] text-white placeholder:text-white/40 focus:border-[#DAC6B5]"
              />
            </div>

            <div className="mb-5">
              <label className="block font-[Montserrat] text-[0.7rem] tracking-[0.08em] uppercase text-white/60 mb-2">
                Solução de interesse
              </label>
              <Select name="solucao" required>
                <SelectTrigger className="bg-white/[0.06] border-white/[0.12] text-white focus:border-[#DAC6B5]">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent className="bg-[#0A0A0A] border-white/[0.12]">
                  {solucoes.map((sol) => (
                    <SelectItem
                      key={sol}
                      value={sol}
                      className="text-white hover:bg-white/10 focus:bg-white/10"
                    >
                      {sol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="mb-5">
              <label className="block font-[Montserrat] text-[0.7rem] tracking-[0.08em] uppercase text-white/60 mb-2">
                Mensagem
              </label>
              <Textarea
                name="mensagem"
                placeholder="Como podemos ajudar?"
                className="bg-white/[0.06] border-white/[0.12] text-white placeholder:text-white/40 focus:border-[#DAC6B5] min-h-[100px]"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#DAC6B5] text-black hover:bg-[#c4a68f] font-[Montserrat] tracking-[0.08em] uppercase"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
            </Button>
          </form>

          <div ref={infoRef} className={cn('reveal reveal-delay-1', infoVisible && 'visible')}>
            <h3 className="font-section text-[1.3rem] mb-5">Arbache Consulting</h3>
            <p className="text-white/70 mb-4 text-[0.95rem]">
              R. Manuel Guedes, 504
              <br />
              Itaim Bibi — São Paulo/SP
            </p>
            <p className="text-white/70 mb-4 text-[0.95rem]">
              📧{' '}
              <a href="mailto:contato@arbache.com" className="text-[#DAC6B5] no-underline hover:underline">
                contato@arbache.com
              </a>
            </p>
            <p className="text-white/70 mb-4 text-[0.95rem]">
              📱{' '}
              <a href="https://wa.me/5511999999999" className="text-[#DAC6B5] no-underline hover:underline">
                WhatsApp
              </a>
            </p>
            <p className="mt-8">
              <a
                href="https://linkedin.com/in/anapaulaarbache"
                className="text-[#DAC6B5] no-underline hover:underline mr-4"
              >
                LinkedIn Ana Paula
              </a>
              <a
                href="https://linkedin.com/in/arbache"
                className="text-[#DAC6B5] no-underline hover:underline"
              >
                LinkedIn Fernando
              </a>
            </p>

            <div className="mt-12 p-6 bg-white/[0.06] rounded-lg border-l-[3px] border-[#DAC6B5]">
              <p className="font-tagline text-[1.1rem] text-white/80">
                &ldquo;Vem mudar o mundo por meio da educação!&rdquo;
              </p>
              <p className="text-[0.85rem] mt-2 text-[#DAC6B5]">— Ana Paula Arbache</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
