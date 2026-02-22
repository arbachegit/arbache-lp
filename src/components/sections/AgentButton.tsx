'use client'

import { useState, useEffect } from 'react'

// Agent icon - minimal chat bubble
const AgentIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
    <path
      d="M12 21c5.523 0 10-4.477 10-10S17.523 1 12 1 2 5.477 2 11c0 1.89.525 3.66 1.438 5.168L2 21l4.832-1.438A9.955 9.955 0 0012 21z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    {/* Three dots for typing indicator */}
    <circle cx="8" cy="11" r="1" fill="currentColor" />
    <circle cx="12" cy="11" r="1" fill="currentColor" />
    <circle cx="16" cy="11" r="1" fill="currentColor" />
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
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  const handleSend = async () => {
    if (!message.trim()) return

    const userMessage = message.trim()

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setMessage('')
    setIsTyping(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
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
      console.error('Chat error:', error)
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
      {/* Floating Agent Button with Radar Effect */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Abrir agente de chat"
        className="fixed bottom-6 right-6 z-[1000] group"
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
            <AgentIcon />
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
        <div className="fixed bottom-6 right-6 z-[1001] w-[380px] h-[520px] flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-[#2a2a30]"
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
                <p className="text-gray-500 text-xs">Online</p>
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
        </div>
      )}

      {/* CSS para animações do radar */}
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
      `}</style>
    </>
  )
}
