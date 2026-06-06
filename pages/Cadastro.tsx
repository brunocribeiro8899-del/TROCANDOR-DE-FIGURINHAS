import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'
import { mensagemErroApi } from '../utils/formatters'
import { Spinner } from '../components/Spinner'

type Perfil = 'comprador' | 'vendedor' | 'ambos'

interface Erros { [campo: string]: string }

export function Cadastro() {
  const [nome, setNome]               = useState('')
  const [email, setEmail]             = useState('')
  const [senha, setSenha]             = useState('')
  const [confirmar, setConfirmar]     = useState('')
  const [perfil, setPerfil]           = useState<Perfil>('comprador')
  const [erros, setErros]             = useState<Erros>({})
  const [erroGeral, setErroGeral]     = useState('')
  const [carregando, setCarregando]   = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErros({})
    setErroGeral('')

    const novosErros: Erros = {}
    if (!nome.trim())           novosErros.nome = 'O nome é obrigatório.'
    if (!email.trim())          novosErros.email = 'O e-mail é obrigatório.'
    if (senha.length < 6)       novosErros.senha = 'A senha deve ter no mínimo 6 caracteres.'
    if (senha !== confirmar)    novosErros.confirmar = 'As senhas não conferem.'

    if (Object.keys(novosErros).length) {
      setErros(novosErros)
      return
    }

    setCarregando(true)
    try {
      const { token, user } = await authService.cadastro({
        nome, email, senha,
        senha_confirmation: confirmar,
        perfil,
      })
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      navigate('/dashboard')
    } catch (err) {
      const msg = mensagemErroApi(err, 'Não foi possível criar sua conta. Tente novamente.')
      setErroGeral(msg)

      // Erros de campo da API
      if (err && typeof err === 'object' && 'response' in err) {
        const resp = (err as { response?: { data?: { errors?: Erros } } }).response
        if (resp?.data?.errors) setErros(resp.data.errors as Erros)
      }
    } finally {
      setCarregando(false)
    }
  }

  const PERFIS = [
    { valor: 'comprador', label: 'Comprador', desc: 'Quero encontrar figurinhas' },
    { valor: 'vendedor',  label: 'Vendedor',  desc: 'Quero vender figurinhas' },
    { valor: 'ambos',     label: 'Ambos',     desc: 'Quero comprar e vender' },
  ] as const

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center gap-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-600 to-blue-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-extrabold text-xl">TF</span>
            </div>
            <span className="text-2xl font-extrabold text-gray-900">Trocando Figurinas</span>
          </Link>
          <p className="text-gray-500 text-sm mt-1">Crie sua conta gratuita</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-card border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nome */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome completo</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-400"
              />
              {erros.nome && <p className="text-red-600 text-xs mt-1">{erros.nome}</p>}
            </div>

            {/* E-mail */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                autoComplete="email"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-400"
              />
              {erros.email && <p className="text-red-600 text-xs mt-1">{erros.email}</p>}
            </div>

            {/* Senha */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Senha</label>
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                />
                {erros.senha && <p className="text-red-600 text-xs mt-1">{erros.senha}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirmar</label>
                <input
                  type="password"
                  value={confirmar}
                  onChange={(e) => setConfirmar(e.target.value)}
                  placeholder="••••••"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                />
                {erros.confirmar && <p className="text-red-600 text-xs mt-1">{erros.confirmar}</p>}
              </div>
            </div>

            {/* Perfil */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Como você quer usar a plataforma?</label>
              <div className="grid grid-cols-3 gap-2">
                {PERFIS.map(({ valor, label, desc }) => (
                  <button
                    key={valor}
                    type="button"
                    onClick={() => setPerfil(valor)}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      perfil === valor
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className={`text-xs font-semibold ${perfil === valor ? 'text-green-700' : 'text-gray-700'}`}>{label}</p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-tight">{desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {erroGeral && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                {erroGeral}
              </div>
            )}

            <button
              type="submit"
              disabled={carregando}
              className="w-full py-3.5 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {carregando ? <><Spinner tamanho="sm" className="text-white" /> Criando conta...</> : 'Criar conta grátis'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Já tem conta?{' '}
            <Link to="/login" className="text-green-600 font-semibold hover:text-green-700">
              Fazer login
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
