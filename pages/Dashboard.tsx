import { useAuth } from '../hooks/useAuth'
import { DashboardComprador } from './DashboardComprador'
import { DashboardVendedor } from './DashboardVendedor'

export function Dashboard() {
  const { user } = useAuth()

  if (!user) return null

  if (user.perfil === 'vendedor') return <DashboardVendedor />
  if (user.perfil === 'ambos') return <DashboardComprador />
  return <DashboardComprador />
}
