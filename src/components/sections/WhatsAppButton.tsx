import Link from 'next/link'

export function WhatsAppButton() {
  return (
    <Link
      href="https://wa.me/5511999999999"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
      className="fixed bottom-6 right-6 z-[1000] bg-[#25D366] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(37,211,102,0.4)] text-2xl hover:scale-110 transition-transform"
    >
      💬
    </Link>
  )
}
