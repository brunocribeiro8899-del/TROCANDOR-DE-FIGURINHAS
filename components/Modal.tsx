import { useEffect, useCallback } from 'react'

interface ModalProps {
  aberto: boolean
  onFechar: () => void
  titulo?: string
  children: React.ReactNode
  largura?: 'sm' | 'md' | 'lg' | 'xl'
}

const LARGURAS = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
}

export function Modal({ aberto, onFechar, titulo, children, largura = 'md' }: ModalProps) {
  const handleEsc = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onFechar()
  }, [onFechar])

  useEffect(() => {
    if (aberto) {
      document.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
    }
  }, [aberto, handleEsc])

  if (!aberto) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onFechar}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div
        className={`relative w-full ${LARGURAS[largura]} bg-white rounded-2xl shadow-modal animate-slide-up`}
        onClick={(e) => e.stopPropagation()}
      >
        {titulo && (
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">{titulo}</h2>
            <button
              onClick={onFechar}
              className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
