import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { mensagemErroApi } from '../utils/formatters'
import { Spinner } from '../components/Spinner'

const PERFIS_TESTE = [
  { label: 'Administrador', email: 'admin@admin.com', cor: 'blue' },
  { label: 'Comprador',     email: 'comprador@teste.com', cor: 'green' },
  { label: 'Vendedor',      email: 'vendedor@teste.com', cor: 'purple' },
] as const

export function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const { login, carregando } = useAuth()
  const navigate = useNavigate()

  const preencherPerfil = (emailPerfil: string) => {
    setEmail(emailPerfil)
    setSenha('123456')
    setErro('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    try {
      const user = await login(email, senha)
      navigate(user.perfil === 'admin' ? '/admin' : '/dashboard')
    } catch (err) {
      setErro(mensagemErroApi(err, 'E-mail ou senha incorretos.'))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center gap-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-600 to-blue-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-extrabold text-xl">TF</span>
            </div>
            <span className="text-2xl font-extrabold text-gray-900">Trocando Figurinas</span>
          </Link>
          <p className="text-gray-500 text-sm mt-1">Bem-vindo de volta!</p>
        </div>

        {/* Atalhos de teste */}
        <div className="bg-white rounded-2xl p-4 shadow-card border border-gray-100 mb-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Acesso rápido — modo de teste
          </p>
          <div className="grid grid-cols-3 gap-2">
            {PERFIS_TESTE.map(({ label, email: e, cor }) => (
              <button
                key={e}
                type="button"
                onClick={() => preencherPerfil(e)}
                className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all hover:scale-105 ${
                  cor === 'blue'   ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100' :
                  cor === 'green'  ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100' :
                                     'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">Senha padrão: 123456</p>
        </div>

        {/* Formulário */}
        <div className="bg-white rounded-2xl p-8 shadow-card border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="seu@email.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Senha</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
              />
            </div>

            {erro && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                {erro}
              </div>
            )}

            <button
              type="submit"
              disabled={carregando}
              className="w-full py-3.5 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {carregando ? <><Spinner tamanho="sm" className="text-white" /> Entrando...</> : 'Entrar'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Não tem conta?{' '}
            <Link to="/cadastro" className="text-green-600 font-semibold hover:text-green-700">
              Cadastre-se grátis
            </Link>
          </p>
        </div>

        <p className="text-center mt-6">
          <Link to="/" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
            ← Voltar para o início
          </Link>
        </p>
      </div>
    </div>
  )
}
