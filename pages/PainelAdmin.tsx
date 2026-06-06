import { useState, useEffect, useCallback } from 'react'
import { Header } from '../components/Header'
import { Badge } from '../components/Badge'
import { ToastContainer } from '../components/Toast'
import { Spinner } from '../components/Spinner'
import { useToast } from '../hooks/useToast'
import { userService } from '../services/userService'
import { anuncioService } from '../services/anuncioService'
import type { Anuncio, Metricas, User } from '../types'
import { mensagemErroApi, LABELS_PERFIL, LABELS_STATUS_ANUNCIO, LABELS_TIPO, formatarMoeda } from '../utils/formatters'

type Aba = 'metricas' | 'usuarios' | 'anuncios'

export function PainelAdmin() {
  const [aba, setAba]           = useState<Aba>('metricas')
  const [metricas, setMetricas] = useState<Metricas | null>(null)
  const [usuarios, setUsuarios] = useState<User[]>([])
  const [anuncios, setAnuncios] = useState<Anuncio[]>([])
  const [busca, setBusca]       = useState('')
  const [carregando, setCarregando] = useState(false)
  const toast = useToast()

  const carregarMetricas = useCallback(async () => {
    setCarregando(true)
    try { setMetricas(await userService.metricas()) }
    catch (err) { toast.erro(mensagemErroApi(err)) }
    finally { setCarregando(false) }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const carregarUsuarios = useCallback(async () => {
    setCarregando(true)
    try { setUsuarios(await userService.listar({ busca: busca || undefined })) }
    catch (err) { toast.erro(mensagemErroApi(err)) }
    finally { setCarregando(false) }
  }, [busca]) // eslint-disable-line react-hooks/exhaustive-deps

  const carregarAnuncios = useCallback(async () => {
    setCarregando(true)
    try { setAnuncios(await anuncioService.listarAdmin({ busca: busca || undefined })) }
    catch (err) { toast.erro(mensagemErroApi(err)) }
    finally { setCarregando(false) }
  }, [busca]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (aba === 'metricas') carregarMetricas()
    else if (aba === 'usuarios') carregarUsuarios()
    else if (aba === 'anuncios') carregarAnuncios()
  }, [aba, carregarMetricas, carregarUsuarios, carregarAnuncios])

  const alterarStatus = async (id: number) => {
    try {
      const user = await userService.alterarStatus(id)
      toast.sucesso(user.ativo ? 'Conta ativada.' : 'Conta desativada.')
      carregarUsuarios()
    } catch (err) { toast.erro(mensagemErroApi(err)) }
  }

  const removerAnuncio = async (id: number) => {
    if (!confirm('Remover este anúncio?')) return
    try {
      await anuncioService.deletarAdmin(id)
      toast.sucesso('Anúncio removido.')
      carregarAnuncios()
    } catch (err) { toast.erro(mensagemErroApi(err)) }
  }

  const ABAS: [Aba, string][] = [['metricas', 'Métricas'], ['usuarios', 'Usuários'], ['anuncios', 'Anúncios']]

  return (
    <>
      <Header />
      <ToastContainer toasts={toast.toasts} onRemover={toast.remover} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Painel Administrativo</h1>
            <p className="text-sm text-gray-500">Gerencie usuários, anúncios e métricas da plataforma</p>
          </div>
        </div>

        {/* Abas */}
        <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-8 w-fit">
          {ABAS.map(([val, label]) => (
            <button
              key={val}
              onClick={() => { setAba(val); setBusca('') }}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                aba === val ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Métricas */}
        {aba === 'metricas' && (
          carregando ? (
            <div className="flex justify-center py-16"><Spinner tamanho="lg" /></div>
          ) : metricas && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: 'Total de Usuários',    valor: metricas.total_usuarios,  cor: 'blue',   emoji: '👥' },
                { label: 'Usuários Ativos',      valor: metricas.usuarios_ativos, cor: 'green',  emoji: '✅' },
                { label: 'Total de Anúncios',    valor: metricas.total_anuncios,  cor: 'purple', emoji: '📋' },
                { label: 'Anúncios Disponíveis', valor: metricas.anuncios_ativos, cor: 'green',  emoji: '🏷️' },
                { label: 'Total de Pedidos',     valor: metricas.total_pedidos,   cor: 'blue',   emoji: '📩' },
                { label: 'Negociações Aceitas',  valor: metricas.pedidos_aceitos, cor: 'green',  emoji: '🤝' },
              ].map(({ label, valor, cor, emoji }) => (
                <div key={label} className={`bg-white rounded-2xl p-6 border ${
                  cor === 'blue'   ? 'border-blue-100' :
                  cor === 'green'  ? 'border-green-100' :
                                     'border-purple-100'
                } shadow-card`}>
                  <p className="text-3xl mb-2">{emoji}</p>
                  <p className={`text-3xl font-extrabold ${
                    cor === 'blue'   ? 'text-blue-600' :
                    cor === 'green'  ? 'text-green-600' :
                                       'text-purple-600'
                  }`}>{valor.toLocaleString('pt-BR')}</p>
                  <p className="text-sm text-gray-500 mt-1">{label}</p>
                </div>
              ))}
            </div>
          )
        )}

        {/* Usuários */}
        {aba === 'usuarios' && (
          <>
            <div className="flex gap-3 mb-6">
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && carregarUsuarios()}
                placeholder="Buscar por nome ou e-mail..."
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
              />
              <button onClick={carregarUsuarios} className="px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors">
                Buscar
              </button>
            </div>
            {carregando ? (
              <div className="flex justify-center py-16"><Spinner tamanho="lg" /></div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {['Usuário', 'Perfil', 'Cadastro', 'Status', 'Ação'].map((h) => (
                        <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {usuarios.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4">
                          <p className="font-medium text-gray-900 text-sm">{user.nome}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </td>
                        <td className="px-5 py-4">
                          <Badge variante={user.perfil === 'admin' ? 'azul' : 'cinza'}>
                            {LABELS_PERFIL[user.perfil]}
                          </Badge>
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-500">{user.criado_em}</td>
                        <td className="px-5 py-4">
                          <Badge variante={user.ativo ? 'verde' : 'vermelho'}>
                            {user.ativo ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </td>
                        <td className="px-5 py-4">
                          {user.perfil !== 'admin' && (
                            <button
                              onClick={() => alterarStatus(user.id)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                                user.ativo
                                  ? 'text-red-600 border-red-200 hover:bg-red-50'
                                  : 'text-green-600 border-green-200 hover:bg-green-50'
                              }`}
                            >
                              {user.ativo ? 'Desativar' : 'Ativar'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {usuarios.length === 0 && (
                  <div className="text-center py-12 text-gray-400">Nenhum usuário encontrado.</div>
                )}
              </div>
            )}
          </>
        )}

        {/* Anúncios */}
        {aba === 'anuncios' && (
          <>
            <div className="flex gap-3 mb-6">
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && carregarAnuncios()}
                placeholder="Buscar por figurinha..."
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
              />
              <button onClick={carregarAnuncios} className="px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors">
                Buscar
              </button>
            </div>
            {carregando ? (
              <div className="flex justify-center py-16"><Spinner tamanho="lg" /></div>
            ) : (
              <div className="space-y-3">
                {anuncios.map((anuncio) => (
                  <div key={anuncio.id} className="bg-white rounded-2xl p-5 border border-gray-100 flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs text-gray-400">{anuncio.figurinha.numero}</span>
                        <span className="font-semibold text-gray-900">{anuncio.figurinha.nome}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 items-center">
                        <Badge variante="cinza">{LABELS_STATUS_ANUNCIO[anuncio.status]}</Badge>
                        <Badge variante="azul">{LABELS_TIPO[anuncio.tipo]}</Badge>
                        {anuncio.preco && <span className="text-sm font-bold text-green-600">{formatarMoeda(anuncio.preco)}</span>}
                        <span className="text-xs text-gray-400">por {anuncio.vendedor.nome}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => removerAnuncio(anuncio.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 border border-red-200 hover:bg-red-50 transition-colors whitespace-nowrap"
                    >
                      Remover
                    </button>
                  </div>
                ))}
                {anuncios.length === 0 && (
                  <div className="text-center py-12 text-gray-400">Nenhum anúncio encontrado.</div>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </>
  )
}
