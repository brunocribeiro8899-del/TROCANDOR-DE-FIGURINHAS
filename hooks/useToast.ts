import { useState, useCallback } from 'react'
import type { ToastData } from '../types'

export function useToast() {
  const [toasts, setToasts] = useState<ToastData[]>([])

  const mostrar = useCallback((tipo: ToastData['tipo'], mensagem: string) => {
    const id = crypto.randomUUID()
    setToasts((prev) => [...prev, { id, tipo, mensagem }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  const remover = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return {
    toasts,
    sucesso: (msg: string) => mostrar('sucesso', msg),
    erro:    (msg: string) => mostrar('erro', msg),
    aviso:   (msg: string) => mostrar('aviso', msg),
    info:    (msg: string) => mostrar('info', msg),
    remover,
  }
}
