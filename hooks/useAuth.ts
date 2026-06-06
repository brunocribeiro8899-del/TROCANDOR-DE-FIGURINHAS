import { useState, useEffect, useCallback } from 'react'
import type { User } from '../types'
import { authService } from '../services/authService'

interface AuthState {
  user: User | null
  token: string | null
  carregando: boolean
}

export function useAuth() {
  const [estado, setEstado] = useState<AuthState>({
    user:       JSON.parse(localStorage.getItem('user') ?? 'null') as User | null,
    token:      localStorage.getItem('token'),
    carregando: false,
  })

  const autenticado = estado.token !== null && estado.user !== null

  const salvarSessao = (token: string, user: User) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    setEstado({ token, user, carregando: false })
  }

  const login = useCallback(async (email: string, senha: string) => {
    setEstado((s) => ({ ...s, carregando: true }))
    try {
      const resultado = await authService.login({ email, senha })
      salvarSessao(resultado.token, resultado.user)
      return resultado.user
    } finally {
      setEstado((s) => ({ ...s, carregando: false }))
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } catch {
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setEstado({ user: null, token: null, carregando: false })
    }
  }, [])

  useEffect(() => {
    if (estado.token && !estado.user) {
      authService.me()
        .then((user) => setEstado((s) => ({ ...s, user })))
        .catch(() => logout())
    }
  }, [estado.token, estado.user, logout])

  return {
    user:        estado.user,
    token:       estado.token,
    carregando:  estado.carregando,
    autenticado,
    login,
    logout,
  }
}
