'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { SECTIONS, getSection, matchFAQ, type SectionContent } from '@/lib/agent-content'
import { curateResponse, truncateToLines } from '@/lib/agent-curate'

// ===================================
// CONFIG
// ===================================

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.arbache.com'

// ===================================
// TYPES
// ===================================

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface V2Response {
  response: string
  badges: string[]
  suggestions: string[]
  request_id: string
}

// ===================================
// SECTION IDS — ordered as they appear on the page
// ===================================

const SECTION_IDS = [
  'hero',
  'proposito',
  'quem-somos',
  'nosso-ecossistema',
  'solucoes-org',
  'colabs',
  'esg',
  'contato',
]

// ===================================
// COMPONENT
// ===================================

export default function AgentButton() {
  // State
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentSection, setCurrentSection] = useState<string>('hero')
  const [sectionContent, setSectionContent] = useState<SectionContent>(SECTIONS.hero)
  const [dynamicSuggestions, setDynamicSuggestions] = useState<string[]>([])
  const [showCallout, setShowCallout] = useState(false)
  const [calloutText, setCalloutText] = useState<[string, string, string]>(['', '', ''])
  const [isVisible, setIsVisible] = useState(false)

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const lastSectionRef = useRef<string>('hero')

  // ===================================
  // SCROLL-BASED SECTION DETECTION
  // ===================================

  useEffect(() => {
    const detect = () => {
      const midY = window.innerHeight / 2
      let found = 'hero'

      for (const id of SECTION_IDS) {
        const el = document.getElementById(id)
        if (!el) continue
        const rect = el.getBoundingClientRect()
        if (rect.top <= midY && rect.bottom > midY) {
          found = id
          break
        }
      }

      if (found !== lastSectionRef.current) {
        lastSectionRef.current = found
        setCurrentSection(found)
        const content = getSection(found)
        setSectionContent(content)
        setDynamicSuggestions([])

        // Show callout on section change
        setCalloutText(content.callout)
        setShowCallout(true)
        setTimeout(() => setShowCallout(false), 4000)
      }
    }

    // Initial detection
    detect()

    // Show button after small delay
    const showTimer = setTimeout(() => setIsVisible(true), 1500)

    window.addEventListener('scroll', detect, { passive: true })
    return () => {
      window.removeEventListener('scroll', detect)
      clearTimeout(showTimer)
    }
  }, [])

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200)
    }
  }, [isOpen])

  // ===================================
  // SEND MESSAGE
  // ===================================

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || isLoading) return

      setInput('')

      // Add user message
      const userMessage: Message = { role: 'user', content: trimmed }
      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)
      setDynamicSuggestions([])

      // 1. Check local FAQ first
      const faqAnswer = matchFAQ(trimmed)
      if (faqAnswer) {
        setMessages((prev) => [...prev, { role: 'assistant', content: faqAnswer }])
        setIsLoading(false)
        return
      }

      // 2. Call API v2
      try {
        // Build conversation history (last 3 pairs = 6 messages)
        const history = messages.slice(-6).map((m) => ({
          role: m.role,
          content: m.content,
        }))

        const res = await fetch(`${API_URL}/v2/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: trimmed,
            section: currentSection,
            sectionContext: sectionContent.summary,
            conversationHistory: history.length > 0 ? history : undefined,
          }),
        })

        if (!res.ok) {
          if (res.status === 429) {
            setMessages((prev) => [
              ...prev,
              { role: 'assistant', content: 'Muitas perguntas em pouco tempo. Aguarde um momento e tente novamente.' },
            ])
            setIsLoading(false)
            return
          }
          throw new Error(`HTTP ${res.status}`)
        }

        const data: V2Response = await res.json()

        // Curate client-side (second layer)
        let cleaned = curateResponse(data.response)
        cleaned = truncateToLines(cleaned, 5)

        setMessages((prev) => [...prev, { role: 'assistant', content: cleaned }])

        // Update suggestions from API
        if (data.suggestions?.length > 0) {
          setDynamicSuggestions(data.suggestions)
        }
      } catch (err) {
        console.error('Agent API error:', err)
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content:
              'Desculpe, não consegui processar sua mensagem. Tente novamente ou entre em contato pelo formulário abaixo.',
          },
        ])
      } finally {
        setIsLoading(false)
      }
    },
    [isLoading, messages, currentSection, sectionContent],
  )

  // ===================================
  // SUGGESTION CLICK
  // ===================================

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
    sendMessage(suggestion)
  }

  // ===================================
  // KEY HANDLER
  // ===================================

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  // ===================================
  // CURRENT SUGGESTIONS
  // ===================================

  const suggestions =
    dynamicSuggestions.length > 0 ? dynamicSuggestions : sectionContent.suggestions
  const badges = sectionContent.badges

  // ===================================
  // RENDER
  // ===================================

  if (!isVisible) return null

  return (
    <>
      {/* ---- FLOATING BUTTON ---- */}
      <div style={{ position: 'fixed', bottom: 32, right: 32, zIndex: 9999 }}>
        {/* Callout */}
        {showCallout && !isOpen && (
          <div
            style={{
              position: 'absolute',
              bottom: 72,
              right: 0,
              background: 'rgba(0,0,0,0.85)',
              backdropFilter: 'blur(8px)',
              borderRadius: 12,
              padding: '12px 18px',
              minWidth: 200,
              maxWidth: 260,
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              animation: 'fadeInUp 0.4s ease-out',
              pointerEvents: 'none',
            }}
          >
            <div style={{ color: '#c9a84c', fontFamily: 'Cinzel, serif', fontSize: 13, fontWeight: 600 }}>
              {calloutText[0]}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 2 }}>
              {calloutText[1]}{' '}
              <span style={{ color: '#c9a84c' }}>{calloutText[2]}</span>
            </div>
            {/* Arrow */}
            <div
              style={{
                position: 'absolute',
                bottom: -6,
                right: 24,
                width: 12,
                height: 12,
                background: 'rgba(0,0,0,0.85)',
                transform: 'rotate(45deg)',
              }}
            />
          </div>
        )}

        {/* Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Assistente Arbache"
          style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            border: '2px solid #c9a84c',
            background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(201,168,76,0.3)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            position: 'relative',
            overflow: 'hidden',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.08)'
            e.currentTarget.style.boxShadow = '0 6px 28px rgba(201,168,76,0.45)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(201,168,76,0.3)'
          }}
        >
          {/* Radar sweep animation */}
          <svg width="56" height="56" viewBox="0 0 56 56" style={{ position: 'absolute' }}>
            <circle cx="28" cy="28" r="26" fill="none" stroke="rgba(201,168,76,0.15)" strokeWidth="1" />
            <circle cx="28" cy="28" r="18" fill="none" stroke="rgba(201,168,76,0.1)" strokeWidth="0.5" />
            {!isOpen && (
              <g style={{ transformOrigin: '28px 28px', animation: 'radarSweep 3s linear infinite' }}>
                <line x1="28" y1="28" x2="28" y2="2" stroke="rgba(201,168,76,0.6)" strokeWidth="1" />
                <path
                  d="M28,28 L28,2 A26,26 0 0,1 50,16 Z"
                  fill="url(#sweepGrad)"
                  opacity="0.3"
                />
              </g>
            )}
            <defs>
              <radialGradient id="sweepGrad" cx="50%" cy="50%">
                <stop offset="0%" stopColor="rgba(201,168,76,0.4)" />
                <stop offset="100%" stopColor="rgba(201,168,76,0)" />
              </radialGradient>
            </defs>
          </svg>
          {/* Icon */}
          <span style={{ fontSize: 22, zIndex: 1, color: isOpen ? '#fff' : '#c9a84c' }}>
            {isOpen ? '✕' : '✦'}
          </span>
        </button>
      </div>

      {/* ---- CHAT WINDOW ---- */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: 104,
            right: 32,
            width: 380,
            maxWidth: 'calc(100vw - 40px)',
            height: 520,
            maxHeight: 'calc(100vh - 140px)',
            background: 'linear-gradient(180deg, #0d0d1a, #1a1a2e)',
            borderRadius: 16,
            border: '1px solid rgba(201,168,76,0.25)',
            boxShadow: '0 12px 48px rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 9998,
            animation: 'fadeInUp 0.3s ease-out',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '14px 18px',
              borderBottom: '1px solid rgba(201,168,76,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(201,168,76,0.05)',
            }}
          >
            <div>
              <div style={{ color: '#c9a84c', fontSize: 15, fontWeight: 600, fontFamily: 'Cinzel, serif' }}>
                Assistente Arbache
              </div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 2 }}>
                {sectionContent.title}
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Fechar chat"
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.5)',
                fontSize: 18,
                cursor: 'pointer',
                padding: 4,
              }}
            >
              ✕
            </button>
          </div>

          {/* Badges */}
          <div
            style={{
              padding: '8px 16px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: 6,
              borderBottom: '1px solid rgba(201,168,76,0.08)',
            }}
          >
            {badges.map((badge) => (
              <span
                key={badge}
                style={{
                  background: 'rgba(201,168,76,0.12)',
                  color: '#c9a84c',
                  fontSize: 11,
                  padding: '3px 10px',
                  borderRadius: 12,
                  border: '1px solid rgba(201,168,76,0.2)',
                  whiteSpace: 'nowrap',
                }}
              >
                {badge}
              </span>
            ))}
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', padding: '24px 12px' }}>
                <div style={{ color: '#c9a84c', fontSize: 28, marginBottom: 8 }}>✦</div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 1.5 }}>
                  Olá! Sou o assistente da Arbache Consulting.
                  <br />
                  Como posso ajudar?
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    maxWidth: '85%',
                    padding: '10px 14px',
                    borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                    background:
                      msg.role === 'user'
                        ? 'linear-gradient(135deg, rgba(201,168,76,0.25), rgba(201,168,76,0.15))'
                        : 'rgba(255,255,255,0.06)',
                    color: msg.role === 'user' ? '#e8d9a0' : 'rgba(255,255,255,0.85)',
                    fontSize: 13,
                    lineHeight: 1.5,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    border:
                      msg.role === 'user'
                        ? '1px solid rgba(201,168,76,0.2)'
                        : '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Loading */}
            {isLoading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: '14px 14px 14px 4px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                    <span style={{ animation: 'typingDot 1.4s infinite', animationDelay: '0s' }}>
                      <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#c9a84c' }} />
                    </span>
                    <span style={{ animation: 'typingDot 1.4s infinite', animationDelay: '0.2s' }}>
                      <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#c9a84c' }} />
                    </span>
                    <span style={{ animation: 'typingDot 1.4s infinite', animationDelay: '0.4s' }}>
                      <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#c9a84c' }} />
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && !isLoading && (
            <div
              style={{
                padding: '8px 14px',
                display: 'flex',
                flexWrap: 'wrap',
                gap: 6,
                borderTop: '1px solid rgba(201,168,76,0.08)',
              }}
            >
              {suggestions.slice(0, 3).map((s) => (
                <button
                  key={s}
                  onClick={() => handleSuggestionClick(s)}
                  style={{
                    background: 'rgba(201,168,76,0.08)',
                    border: '1px solid rgba(201,168,76,0.2)',
                    borderRadius: 16,
                    padding: '5px 12px',
                    color: 'rgba(201,168,76,0.8)',
                    fontSize: 11,
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                    whiteSpace: 'nowrap',
                    maxWidth: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(201,168,76,0.18)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(201,168,76,0.08)'
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input area */}
          <div
            style={{
              padding: '12px 14px',
              borderTop: '1px solid rgba(201,168,76,0.15)',
              display: 'flex',
              gap: 8,
              alignItems: 'center',
              background: 'rgba(0,0,0,0.2)',
            }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite sua mensagem..."
              disabled={isLoading}
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(201,168,76,0.15)',
                borderRadius: 10,
                padding: '10px 14px',
                color: 'rgba(255,255,255,0.9)',
                fontSize: 13,
                outline: 'none',
              }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={isLoading || !input.trim()}
              aria-label="Enviar mensagem"
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                border: 'none',
                background:
                  input.trim() && !isLoading
                    ? 'linear-gradient(135deg, #c9a84c, #a88a3a)'
                    : 'rgba(201,168,76,0.15)',
                color: input.trim() && !isLoading ? '#fff' : 'rgba(255,255,255,0.3)',
                cursor: input.trim() && !isLoading ? 'pointer' : 'default',
                fontSize: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s',
                flexShrink: 0,
              }}
            >
              ▶
            </button>
          </div>

          {/* Footer branding */}
          <div
            style={{
              textAlign: 'center',
              padding: '4px 0 8px',
              color: 'rgba(255,255,255,0.2)',
              fontSize: 10,
            }}
          >
            powered by IconsAI
          </div>
        </div>
      )}

      {/* ---- GLOBAL STYLES ---- */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes radarSweep {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes typingDot {
          0%,
          80%,
          100% {
            opacity: 0.3;
            transform: scale(0.8);
          }
          40% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </>
  )
}
