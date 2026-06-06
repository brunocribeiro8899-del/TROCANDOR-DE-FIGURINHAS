import { clsx } from 'clsx'

interface BadgeProps {
  variante?: 'verde' | 'azul' | 'amarelo' | 'vermelho' | 'cinza' | 'roxo'
  children: React.ReactNode
  className?: string
}

const VARIANTES = {
  verde:    'bg-green-100 text-green-800',
  azul:     'bg-blue-100 text-blue-800',
  amarelo:  'bg-yellow-100 text-yellow-800',
  vermelho: 'bg-red-100 text-red-800',
  cinza:    'bg-gray-100 text-gray-700',
  roxo:     'bg-purple-100 text-purple-800',
}

export function Badge({ variante = 'cinza', children, className }: BadgeProps) {
  return (
    <span className={clsx('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', VARIANTES[variante], className)}>
      {children}
    </span>
  )
}
