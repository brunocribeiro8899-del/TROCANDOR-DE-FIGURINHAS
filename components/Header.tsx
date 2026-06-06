import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { LABELS_PERFIL } from '../utils/formatters'

export function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-600 to-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">TF</span>
            </div>
            <span className="font-bold text-gray-900 hidden sm:block">Trocando Figurinas</span>
          </Link>

          <nav className="flex items-center gap-3">
            {user?.perfil === 'admin' && (
              <Link
                to="/admin"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-sm font-medium hover:bg-blue-100 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Painel Admin
              </Link>
            )}

            <div className="flex items-center gap-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-900 leading-none">{user?.nome}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {user?.perfil ? LABELS_PERFIL[user.perfil] : ''}
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {user?.nome?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Sair"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </header>
  )
}
