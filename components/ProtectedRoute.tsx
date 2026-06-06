import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Spinner } from './Spinner'

interface ProtectedRouteProps {
  children: React.ReactNode
  apenasAdmin?: boolean
}

export function ProtectedRoute({ children, apenasAdmin = false }: ProtectedRouteProps) {
  const { autenticado, carregando, user } = useAuth()

  if (carregando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner tamanho="lg" />
      </div>
    )
  }

  if (!autenticado) return <Navigate to="/login" replace />
  if (apenasAdmin && user?.perfil !== 'admin') return <Navigate to="/dashboard" replace />

  return <>{children}</>
}
