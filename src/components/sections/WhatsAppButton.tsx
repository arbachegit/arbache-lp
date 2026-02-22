'use client'

import Link from 'next/link'

// Chat bubble icon - minimal and elegant
const ChatIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
    <path
      d="M12 21c5.523 0 10-4.477 10-10S17.523 1 12 1 2 5.477 2 11c0 1.89.525 3.66 1.438 5.168L2 21l4.832-1.438A9.955 9.955 0 0012 21z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
)

export function WhatsAppButton() {
  return (
    <Link
      href="https://wa.me/5511999999999"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
      className="fixed bottom-6 right-6 z-[1000] group"
    >
      {/* Outer dark ring with glow */}
      <div className="relative w-16 h-16 flex items-center justify-center">
        {/* Background rings */}
        <div className="absolute inset-0 rounded-full bg-[#0a0a0f] opacity-90" />
        <div className="absolute inset-[3px] rounded-full bg-[#12121a] opacity-80" />
        <div className="absolute inset-[6px] rounded-full bg-[#1a1a24] opacity-70" />

        {/* Gradient center circle */}
        <div
          className="relative w-10 h-10 rounded-full flex items-center justify-center text-white transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(99,179,237,0.4)]"
          style={{
            background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #a78bfa 100%)',
          }}
        >
          <ChatIcon />
        </div>

        {/* Subtle outer glow on hover */}
        <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            boxShadow: '0 0 30px rgba(99,179,237,0.2), inset 0 0 20px rgba(99,179,237,0.1)',
          }}
        />
      </div>
    </Link>
  )
}
