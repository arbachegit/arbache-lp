'use client'

import { useState, useEffect, useRef, useCallback, useSyncExternalStore } from 'react'

// ===================================
// SECTION DATA MAP
// ===================================

interface SectionInfo {
  callout: [string, string, string]
  context: string
  title: string
}

const SECTION_DATA: Record<string, SectionInfo> = {
  hero: {
    callout: ['Tem dúvidas?', 'Pergunte a', 'nossa IA'],
    context: 'Página inicial',
    title: 'Hero',
  },
  proposito: {
    callout: ['Nosso Propósito', 'Pergunte a', 'nossa IA'],
    context: 'Missão, visão e valores',
    title: 'Propósito',
  },
  'quem-somos': {
    callout: ['Quem Somos', 'Pergunte a', 'nossa IA'],
    context: 'Equipe Arbache',
    title: 'Quem Somos',
  },
  'nosso-ecossistema': {
    callout: ['Nosso Ecossistema', 'Pergunte a', 'nossa IA'],
    context: 'Ecossistema de soluções',
    title: 'Nosso Ecossistema',
  },
  'solucoes-org': {
    callout: ['Nossas Soluções', 'Pergunte a', 'nossa IA'],
    context: 'Programas para organizações',
    title: 'Soluções para Organizações',
  },
  colabs: {
    callout: ['Nossos Parceiros', 'Pergunte a', 'nossa IA'],
    context: 'Co-Labs parceiros',
    title: 'Co-Labs',
  },
  esg: {
    callout: ['Nosso ESG', 'Pergunte a', 'nossa IA'],
    context: 'Sustentabilidade',
    title: 'ESG',
  },
  contato: {
    callout: ['Dúvidas?', 'Pergunte a', 'nossa IA'],
    context: 'Contato',
    title: 'Contato',
  },
}

const DEFAULT_SECTION: SectionInfo = {
  callout: ['Tem dúvidas?', 'Pergunte a', 'nossa IA'],
  context: 'Página inicial',
  title: 'Início',
}

// ===================================
// SECTION CONTEXT CAPTURE
// ===================================

interface SectionContextPayload {
  sectionId: string
  sectionTitle: string
  route: string
  timestamp: string
  filters: Record<string, unknown>
  visibleContent: string
  dataPreview: Record<string, unknown>
  userAction: 'section_activated' | 'section_changed'
}

function captureSectionContext(sectionId: string, action: 'section_activated' | 'section_changed'): SectionContextPayload {
  const info = SECTION_DATA[sectionId] ?? DEFAULT_SECTION
  const el = document.getElementById(sectionId)

  // Extract visible text (first 500 chars of section content)
  let visibleContent = ''
  if (el) {
    const headings = el.querySelectorAll('h1, h2, h3, p')
    const texts: string[] = []
    headings.forEach(node => {
      const text = node.textContent?.trim()
      if (text) texts.push(text)
    })
    visibleContent = texts.join(' | ').slice(0, 500)
  }

  return {
    sectionId,
    sectionTitle: info.title,
    route: typeof window !== 'undefined' ? window.location.pathname : '/',
    timestamp: new Date().toISOString(),
    filters: {},
    visibleContent,
    dataPreview: { context: info.context },
    userAction: action,
  }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.arbache.com'

// Agent icon - minimal chat bubble (without dots)
const AgentIcon = ({ isPulsing = false }: { isPulsing?: boolean }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
    <path
      d="M12 21c5.523 0 10-4.477 10-10S17.523 1 12 1 2 5.477 2 11c0 1.89.525 3.66 1.438 5.168L2 21l4.832-1.438A9.955 9.955 0 0012 21z"
      stroke={isPulsing ? "rgba(205, 92, 92, 1)" : "currentColor"}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={isPulsing ? "rgba(205, 92, 92, 0.2)" : "none"}
      className={isPulsing ? "transition-all duration-300" : ""}
    />
  </svg>
)

// Close icon
const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
    <path
      d="M18 6L6 18M6 6l12 12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

// Send icon
const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
    <path
      d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export function AgentButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'agent'; content: string }>>([])
  const [isTyping, setIsTyping] = useState(false)
  const [showCallout, setShowCallout] = useState(false)
  const [currentSection, setCurrentSection] = useState<string | null>(null)
  const [phraseKey, setPhraseKey] = useState(0)
  const [contextError, setContextError] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const prevSectionRef = useRef<string | null>(null)
  const lastContextRef = useRef<SectionContextPayload | null>(null)

  // reducedMotion via useSyncExternalStore (no setState-in-effect)
  const reducedMotion = useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
      mq.addEventListener('change', cb)
      return () => mq.removeEventListener('change', cb)
    },
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    () => false
  )

  // Current section info for callout text and context
  const sectionInfo = currentSection ? (SECTION_DATA[currentSection] ?? DEFAULT_SECTION) : DEFAULT_SECTION

  // Send section context to agent (proactive, on section change)
  const sendContextToAgent = useCallback(async (payload: SectionContextPayload) => {
    lastContextRef.current = payload
    setContextError(false)

    console.log('[AgentContext] Section activated:', {
      sectionId: payload.sectionId,
      sectionTitle: payload.sectionTitle,
      timestamp: payload.timestamp,
      visibleContent: payload.visibleContent.slice(0, 100) + '...',
    })

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)

      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          message: `[CONTEXT] Usuário navegou para: ${payload.sectionTitle}`,
          section: payload.sectionId,
          sectionContext: `${payload.sectionTitle} — ${payload.visibleContent.slice(0, 180)}`,
        }),
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`Context send failed: ${response.status}`)
      }

      console.log('[AgentContext] Context sent successfully for:', payload.sectionId)
    } catch (err) {
      // Context send is best-effort — log but don't block UI
      console.warn('[AgentContext] Failed to send context:', err)
      setContextError(true)
    }
  }, [])

  // Section detection via scroll handler — checks every frame which section
  // contains the viewport midpoint. O(8) per scroll = trivially fast.
  useEffect(() => {
    if (isOpen) {
      setShowCallout(false)
      if (timerRef.current) clearTimeout(timerRef.current)
      return
    }

    const sectionIds = Object.keys(SECTION_DATA)

    const detectSection = () => {
      const midY = window.innerHeight * 0.5
      let found: string | null = null

      for (const id of sectionIds) {
        const el = document.getElementById(id)
        if (!el) continue
        const rect = el.getBoundingClientRect()
        if (rect.top <= midY && rect.bottom > midY) {
          found = id
          break // sections don't overlap — first match is enough
        }
      }

      if (found && found !== prevSectionRef.current) {
        const isFirstActivation = prevSectionRef.current === null
        prevSectionRef.current = found
        if (timerRef.current) clearTimeout(timerRef.current)

        setCurrentSection(found)
        setPhraseKey(k => k + 1)
        setShowCallout(true)

        // Capture and send context to agent
        const payload = captureSectionContext(
          found,
          isFirstActivation ? 'section_activated' : 'section_changed',
        )
        sendContextToAgent(payload)

        // Auto-hide after 5s
        timerRef.current = setTimeout(() => {
          setShowCallout(false)
        }, 5000)
      }
    }

    window.addEventListener('scroll', detectSection, { passive: true })
    // Run once on mount so hero section triggers immediately
    detectSection()

    return () => {
      window.removeEventListener('scroll', detectSection)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [isOpen, sendContextToAgent])

  const handleSend = async () => {
    if (!message.trim()) return

    const userMessage = message.trim()

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setMessage('')
    setIsTyping(true)

    // Build enriched sectionContext from last captured payload
    const ctx = lastContextRef.current
    const enrichedContext = ctx
      ? `${ctx.sectionTitle} — ${ctx.visibleContent.slice(0, 180)}`
      : sectionInfo.context

    console.log('[AgentChat] Sending message with context:', {
      section: currentSection,
      sectionContext: enrichedContext,
    })

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          ...(currentSection && {
            section: currentSection,
            sectionContext: enrichedContext,
          }),
        }),
      })

      if (!response.ok) {
        throw new Error('Erro na API')
      }

      const data = await response.json()

      setMessages(prev => [
        ...prev,
        {
          role: 'agent',
          content: data.response || 'Desculpe, não consegui processar sua mensagem. Tente novamente.'
        }
      ])
    } catch (error) {
      console.error('[AgentChat] Error:', error)
      setMessages(prev => [
        ...prev,
        {
          role: 'agent',
          content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente em alguns instantes.'
        }
      ])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <>
      {/* Callout - dynamic phrase per section */}
      <div
        className={`fixed z-[999] ${
          showCallout && !isOpen ? 'agent-callout--visible' : 'agent-callout--hidden'
        }`}
        style={{
          right: 'calc(24px + 64px + 60px)',
          bottom: '24px',
        }}
      >
        <div className="flex items-center gap-4">
          {/* Text - key forces re-mount for animation restart */}
          <div
            key={phraseKey}
            className={`agent-callout-text ${showCallout && !isOpen ? 'agent-callout-text--fadein' : 'agent-callout-text--fadeout'}`}
            style={{
              fontFamily: 'Cinzel, serif',
              fontSize: '25px',
              fontWeight: 'bold',
              color: '#ffffff',
              textAlign: 'right',
              lineHeight: '1.3',
            }}
          >
            <span style={{ display: 'block' }}>{sectionInfo.callout[0]}</span>
            <span style={{ display: 'block' }}>{sectionInfo.callout[1]}</span>
            <span style={{ display: 'block' }}>{sectionInfo.callout[2]}</span>
            {/* "ou entre em contato" link */}
            <a
              href="#contato"
              style={{
                display: 'block',
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '11px',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: '#ffffff',
                opacity: 0.5,
                textDecoration: 'none',
                marginTop: '6px',
              }}
            >
              ou entre em contato
            </a>
          </div>

          {/* Horizontal arrow pointing to agent */}
          <div className={`agent-callout-arrow ${showCallout && !isOpen ? 'agent-callout-arrow--fadein' : 'agent-callout-arrow--fadeout'}`}>
            <svg
              width="40"
              height="24"
              viewBox="0 0 40 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 12 L30 12 M24 6 L30 12 L24 18"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="agent-arrow-path"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Floating Agent Button with Radar Effect */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Abrir agente de chat"
        className={`agent-button-container fixed bottom-6 right-6 z-[1000] group ${showCallout && !isOpen ? 'agent-button--pulsing' : ''}`}
        style={{ display: isOpen ? 'none' : 'block' }}
      >
        <div className="relative w-16 h-16 flex items-center justify-center">
          {/* Radar Effect - Pulsing circles */}
          {!reducedMotion && (
            <>
              {/* Radar pulse 1 */}
              <div
                className="absolute inset-0 rounded-full border border-gray-500/30 animate-[radar-pulse_3s_ease-out_infinite]"
                style={{ animationDelay: '0s' }}
              />
              {/* Radar pulse 2 */}
              <div
                className="absolute inset-0 rounded-full border border-gray-500/30 animate-[radar-pulse_3s_ease-out_infinite]"
                style={{ animationDelay: '1s' }}
              />
              {/* Radar pulse 3 */}
              <div
                className="absolute inset-0 rounded-full border border-gray-500/30 animate-[radar-pulse_3s_ease-out_infinite]"
                style={{ animationDelay: '2s' }}
              />
            </>
          )}

          {/* SVG com efeito radar sweep */}
          <svg
            viewBox="0 0 64 64"
            className="absolute inset-0 w-full h-full"
          >
            <defs>
              {/* Radar sweep gradient */}
              <linearGradient id="radarSweepGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="50%" stopColor="#4a4a52" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>

              {/* Radar glow */}
              <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#505058" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#141418" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Outer ring - static */}
            <circle
              cx="32"
              cy="32"
              r="30"
              fill="none"
              stroke="#1a1a1f"
              strokeWidth="2"
            />

            {/* Middle ring */}
            <circle
              cx="32"
              cy="32"
              r="26"
              fill="none"
              stroke="#2a2a30"
              strokeWidth="1.5"
            />

            {/* Inner ring */}
            <circle
              cx="32"
              cy="32"
              r="22"
              fill="none"
              stroke="#333338"
              strokeWidth="1"
            />

            {/* Radar sweep line */}
            {!reducedMotion && (
              <g style={{ transformOrigin: '32px 32px' }} className="animate-[radar-sweep_4s_linear_infinite]">
                <line
                  x1="32"
                  y1="32"
                  x2="32"
                  y2="2"
                  stroke="url(#radarSweepGradient)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                {/* Sweep trail */}
                <path
                  d="M32,32 L32,2 A30,30 0 0,1 52,8 Z"
                  fill="#4a4a52"
                  opacity="0.15"
                />
              </g>
            )}

            {/* Radar blip dots */}
            {!reducedMotion && (
              <>
                <circle cx="38" cy="18" r="1.5" fill="#606068" className="animate-[radar-blip_4s_ease-in-out_infinite]" style={{ animationDelay: '0.5s' }} />
                <circle cx="45" cy="26" r="1" fill="#505058" className="animate-[radar-blip_4s_ease-in-out_infinite]" style={{ animationDelay: '1.5s' }} />
                <circle cx="24" cy="22" r="1.2" fill="#606068" className="animate-[radar-blip_4s_ease-in-out_infinite]" style={{ animationDelay: '2.5s' }} />
              </>
            )}
          </svg>

          {/* Background base - preto/cinza */}
          <div className="absolute inset-[8px] rounded-full bg-[#141418]" />

          {/* Gradient center circle - preto/cinza */}
          <div
            className="relative w-9 h-9 rounded-full flex items-center justify-center text-gray-300 transition-all duration-300 group-hover:scale-110 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]"
            style={{
              background: 'linear-gradient(135deg, #2a2a30 0%, #404048 50%, #505058 100%)',
            }}
          >
            <AgentIcon isPulsing={showCallout && !isOpen} />
          </div>

          {/* Red notification dot with radar effect - top right quadrant */}
          <div className="absolute" style={{ top: '2px', right: '2px' }}>
            {/* Radar pulses */}
            {!reducedMotion && (
              <>
                <div className="absolute inset-0 w-3 h-3 rounded-full border border-red-400/60 animate-[notif-radar_2s_ease-out_infinite]" />
                <div className="absolute inset-0 w-3 h-3 rounded-full border border-red-400/60 animate-[notif-radar_2s_ease-out_infinite]" style={{ animationDelay: '0.7s' }} />
              </>
            )}
            {/* Solid red dot */}
            <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.8)]" />
          </div>

          {/* Subtle outer glow on hover */}
          <div
            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              boxShadow: '0 0 30px rgba(255,255,255,0.1), inset 0 0 20px rgba(255,255,255,0.05)',
            }}
          />
        </div>
      </button>

      {/* Agent Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-[1001] w-[800px] h-[500px] flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-[#2a2a30]"
          style={{ background: '#141418' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#2a2a30]"
            style={{ background: 'linear-gradient(135deg, #1a1a1f 0%, #2a2a30 100%)' }}
          >
            <div className="flex items-center gap-3">
              {/* Mini agent icon com radar effect */}
              <div className="relative w-10 h-10">
                <svg viewBox="0 0 40 40" className="absolute inset-0 w-full h-full">
                  <circle
                    cx="20"
                    cy="20"
                    r="18"
                    fill="none"
                    stroke="#333338"
                    strokeWidth="1.5"
                  />
                  <circle
                    cx="20"
                    cy="20"
                    r="14"
                    fill="#1a1a1f"
                  />
                  {/* Mini radar sweep */}
                  {!reducedMotion && (
                    <g style={{ transformOrigin: '20px 20px' }} className="animate-[radar-sweep_4s_linear_infinite]">
                      <line
                        x1="20"
                        y1="20"
                        x2="20"
                        y2="4"
                        stroke="#4a4a52"
                        strokeWidth="1"
                        opacity="0.5"
                      />
                    </g>
                  )}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                  <AgentIcon />
                </div>
              </div>
              <div>
                <h3 className="text-white font-medium text-sm">Assistente Arbache</h3>
                <div className="flex items-center gap-2">
                  <p className="text-gray-500 text-xs">Online</p>
                  {currentSection && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#2a2a30] text-gray-400">
                      {sectionInfo.title}
                    </span>
                  )}
                  {contextError && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-900/30 text-red-400">
                      ctx err
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-[#2a2a30] transition-colors"
              aria-label="Fechar chat"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Welcome message */}
            {messages.length === 0 && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[#2a2a30] flex items-center justify-center flex-shrink-0">
                  <AgentIcon />
                </div>
                <div className="bg-[#1a1a1f] rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%]">
                  <p className="text-gray-300 text-sm">
                    Olá! Sou o assistente virtual da Arbache Consulting. Como posso ajudá-lo hoje?
                  </p>
                </div>
              </div>
            )}

            {/* Chat messages */}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {msg.role === 'agent' && (
                  <div className="w-8 h-8 rounded-full bg-[#2a2a30] flex items-center justify-center flex-shrink-0">
                    <AgentIcon />
                  </div>
                )}
                <div
                  className={`rounded-2xl px-4 py-3 max-w-[80%] ${
                    msg.role === 'user'
                      ? 'bg-[#2a2a30] rounded-tr-sm text-white'
                      : 'bg-[#1a1a1f] rounded-tl-sm text-gray-300'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[#2a2a30] flex items-center justify-center flex-shrink-0">
                  <AgentIcon />
                </div>
                <div className="bg-[#1a1a1f] rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-[#2a2a30]">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Digite sua mensagem..."
                className="flex-1 bg-[#1a1a1f] border border-[#2a2a30] rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-[#404048] transition-colors"
              />
              <button
                onClick={handleSend}
                disabled={!message.trim()}
                className="w-11 h-11 flex items-center justify-center rounded-xl bg-[#2a2a30] text-gray-400 hover:text-white hover:bg-[#3a3a40] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Enviar mensagem"
              >
                <SendIcon />
              </button>
            </div>
          </div>

          {/* Footer - Powered by IconsAI */}
          <div className="px-4 py-2 border-t border-[#2a2a30] flex items-center justify-center gap-2">
            <span className="text-gray-500 text-xs">powered by</span>
            <img
              src="/images/iconsai-logo.png"
              alt="IconsAI"
              style={{ height: '22px', width: 'auto' }}
            />
          </div>
        </div>
      )}

      {/* CSS para animações do radar e callout */}
      <style jsx global>{`
        @keyframes radar-sweep {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes radar-pulse {
          0% {
            transform: scale(1);
            opacity: 0.6;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        @keyframes radar-blip {
          0%, 100% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
        }

        /* Callout visibility - transição suave do container */
        .agent-callout--visible {
          opacity: 1;
          pointer-events: auto;
          transition: opacity 0.5s ease-out;
        }

        .agent-callout--hidden {
          opacity: 0;
          pointer-events: none;
          transition: opacity 1.5s ease-in-out;
        }

        /* Smooth fade in/out animation for callout text */
        .agent-callout-text {
          opacity: 0;
        }

        .agent-callout-text--fadein {
          animation: smoothFadeIn 1.5s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
        }

        .agent-callout-text--fadeout {
          animation: smoothFadeOut 4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        @keyframes smoothFadeIn {
          0% {
            opacity: 0;
            transform: translateX(15px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes smoothFadeOut {
          0% {
            opacity: 1;
            transform: translateX(0);
          }
          30% {
            opacity: 0.9;
            transform: translateX(2px);
          }
          60% {
            opacity: 0.6;
            transform: translateX(6px);
          }
          100% {
            opacity: 0;
            transform: translateX(15px);
          }
        }

        /* Red notification dot radar effect */
        @keyframes notif-radar {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          100% {
            transform: scale(3);
            opacity: 0;
          }
        }

        /* Arrow animation - horizontal bounce pointing to agent */
        .agent-callout-arrow {
          opacity: 0;
        }

        .agent-callout-arrow--fadein {
          opacity: 1;
          animation: arrowBounceHorizontal 1s ease-in-out infinite, arrowFadeIn 1.5s ease-out forwards;
        }

        .agent-callout-arrow--fadeout {
          animation: arrowFadeOut 4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        @keyframes arrowFadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        @keyframes arrowFadeOut {
          0% {
            opacity: 1;
          }
          30% {
            opacity: 0.9;
          }
          60% {
            opacity: 0.5;
          }
          100% {
            opacity: 0;
          }
        }

        @keyframes arrowBounceHorizontal {
          0%, 100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(10px);
          }
        }

        .agent-arrow-path {
          stroke-dasharray: 60;
          stroke-dashoffset: 0;
          animation: arrowDrawHorizontal 1.5s ease-in-out infinite;
        }

        @keyframes arrowDrawHorizontal {
          0%, 100% {
            stroke-dashoffset: 0;
            opacity: 1;
          }
          50% {
            stroke-dashoffset: 30;
            opacity: 0.6;
          }
        }

        /* Agent button pulsing red effect */
        .agent-button--pulsing {
          animation: agentPulseRed 1.5s ease-in-out infinite;
        }

        .agent-button--pulsing::before {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 2px solid rgba(205, 92, 92, 0.8);
          animation: agentRadarPulse 2s ease-out infinite;
        }

        .agent-button--pulsing::after {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 2px solid rgba(205, 92, 92, 0.8);
          animation: agentRadarPulse 2s ease-out infinite;
          animation-delay: 1s;
        }

        @keyframes agentPulseRed {
          0%, 100% {
            filter: drop-shadow(0 0 8px rgba(205, 92, 92, 0.4));
          }
          50% {
            filter: drop-shadow(0 0 20px rgba(205, 92, 92, 0.8));
          }
        }

        @keyframes agentRadarPulse {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </>
  )
}
