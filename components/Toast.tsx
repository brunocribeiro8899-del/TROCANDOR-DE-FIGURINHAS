import type { ToastData } from '../types'

interface ToastContainerProps {
  toasts: ToastData[]
  onRemover: (id: string) => void
}

const ESTILOS: Record<ToastData['tipo'], string> = {
  sucesso: 'bg-green-600 text-white',
  erro:    'bg-red-600 text-white',
  aviso:   'bg-yellow-500 text-white',
  info:    'bg-blue-600 text-white',
}

const ICONES: Record<ToastData['tipo'], string> = {
  sucesso: '✓',
  erro:    '✕',
  aviso:   '⚠',
  info:    'ℹ',
}

export function ToastContainer({ toasts, onRemover }: ToastContainerProps) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg animate-slide-down cursor-pointer ${ESTILOS[toast.tipo]}`}
          onClick={() => onRemover(toast.id)}
        >
          <span className="font-bold text-sm mt-0.5 shrink-0">{ICONES[toast.tipo]}</span>
          <p className="text-sm font-medium leading-snug">{toast.mensagem}</p>
        </div>
      ))}
    </div>
  )
}
