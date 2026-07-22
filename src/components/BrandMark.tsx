interface BrandMarkProps {
  size?: number
  className?: string
}

export function BrandMark({ size = 40, className }: BrandMarkProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 88 88" fill="none" role="img" aria-label="Hapag bowl logo">
      <rect x="5" y="6" width="78" height="78" rx="23" fill="#087F8C" />
      <path d="M20 76H68" stroke="#F4B942" strokeWidth="6" strokeLinecap="round" />
      <path d="M25 52H63C62.1 67 55.5 74 44 74C32.5 74 25.9 67 25 52Z" fill="#F4B942" stroke="#18323A" strokeWidth="3" strokeLinejoin="round" />
      <path d="M23 50C23 45.6 32.4 42 44 42C55.6 42 65 45.6 65 50C65 54.4 55.6 58 44 58C32.4 58 23 54.4 23 50Z" fill="#FFFDF5" stroke="#18323A" strokeWidth="3" />
      <path d="M32 48C34 46 37 45 40 45" stroke="#4F8A5B" strokeWidth="3" strokeLinecap="round" />
      <circle cx="53" cy="49" r="4" fill="#4F8A5B" />
      <path d="M35 36C31 31 35 27 35 23C35 19 32 17 30 15" stroke="#FFFDF5" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M51 36C47 31 51 27 51 23C51 19 48 17 46 15" stroke="#FFFDF5" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  )
}
