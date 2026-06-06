import { useState, useEffect, useCallback } from 'react'
import { Header } from '../components/Header'
import { Modal } from '../components/Modal'
import { Badge } from '../components/Badge'
import { ToastContainer } from '../components/Toast'
import { Spinner } from '../components/Spinner'
import { useToast } from '../hooks/useToast'
import { anuncioService } from '../services/anuncioService'
import { pedidoService } from '../services/pedidoService'
import type { Anuncio, Pedido } from '../types'
import {
  formatarMoeda, mensagemErroApi,
  LABELS_TIPO, LABELS_STATUS_PEDIDO, LABELS_RARIDADE
} from '../utils/formatters'

type Aba = 'buscar' | 'pedidos'

const RARIDADE_COR: Record<string, 'cinza' | 'verde' | 'azul' | 'amarelo' | 'roxo'> = {
  comum:    'cinza',
  rara:     'verde',
  especial: 'azul',
  lendaria: 'roxo',
}

const PEDIDO_COR: Record<string, 'amarelo' | 'verde' | 'vermelho'> = {
  pendente: 'amarelo',
  aceito:   'verde',
  recusado: 'vermelho',
}

export function DashboardComprador() {
  const [aba, setAba]                         = useState<Aba>('buscar')
  const [anuncios, setAnuncios]               = useState<Anuncio[]>([])
  const [pedidos, setPedidos]                 = useState<Pedido[]>([])
  const [busca, setBusca]                     = useState('')
  const [carregando, setCarregando]           = useState(false)
  const [anuncioSelecionado, setAnuncioSel]   = useState<Anuncio | null>(null)
  const [mensagemInteresse, setMensagem]      = useState('')
  const [enviandoInteresse, setEnviando]      = useState(false)
  const toast = useToast()

  const carregarAnuncios = useCallback(async () => {
    setCarregando(true)
    try {
      const dados = await anuncioService.listar({ busca: busca || undefined })
      setAnuncios(dados)
    } catch (err) {
      toast.erro(mensagemErroApi(err))
    } finally {
      setCarregando(false)
    }
  }, [busca]) // eslint-disable-line react-hooks/exhaustive-deps

  const carregarPedidos = useCallback(async () => {
    setCarregando(true)
    try {
      setPedidos(await pedidoService.listar())
    } catch (err) {
      toast.erro(mensagemErroApi(err))
    } finally {
      setCarregando(false)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { carregarAnuncios() }, [carregarAnuncios])
  useEffect(() => { if (aba === 'pedidos') carregarPedidos() }, [aba, carregarPedidos])

  const manifestarInteresse = async () => {
    if (!anuncioSelecionado) return
    setEnviando(true)
    try {
      await pedidoService.criar(anuncioSelecionado.id, mensagemInteresse || undefined)
      toast.sucesso('Interesse enviado! O vendedor será notificado.')
      setAnuncioSel(null)
      setMensagem('')
    } catch (err) {
      toast.erro(mensagemErroApi(err))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <>
      <Header />
      <ToastContainer toasts={toast.toasts} onRemover={toast.remover} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Abas */}
        <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-8 w-fit">
          {([['buscar', 'Buscar Figurinhas'], ['pedidos', 'Meus Pedidos']] as [Aba, string][]).map(([val, label]) => (
            <button
              key={val}
              onClick={() => setAba(val)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                aba === val ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Buscar */}
        {aba === 'buscar' && (
          <>
            <div className="flex gap-3 mb-6">
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && carregarAnuncios()}
                placeholder="Buscar por nome, número ou seleção..."
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 placeholder-gray-400"
              />
              <button
                onClick={carregarAnuncios}
                className="px-6 py-3 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition-colors"
              >
                Buscar
              </button>
            </div>

            {carregando ? (
              <div className="flex justify-center py-16"><Spinner tamanho="lg" /></div>
            ) : anuncios.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-5xl mb-4">🔍</p>
                <p className="text-gray-500">Nenhuma figurinha encontrada.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {anuncios.map((anuncio) => (
                  <div key={anuncio.id} className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-green-200 hover:shadow-card transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-xs font-mono text-gray-400">{anuncio.figurinha.numero}</p>
                        <h3 className="font-semibold text-gray-900 text-sm mt-0.5 leading-tight">{anuncio.figurinha.nome}</h3>
                        {anuncio.figurinha.pais && (
                          <p className="text-xs text-gray-500 mt-0.5">{anuncio.figurinha.pais}</p>
                        )}
                      </div>
                      <Badge variante={RARIDADE_COR[anuncio.figurinha.raridade] ?? 'cinza'}>
                        {LABELS_RARIDADE[anuncio.figurinha.raridade]}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <Badge variante={anuncio.tipo === 'troca' ? 'azul' : 'verde'}>
                        {LABELS_TIPO[anuncio.tipo]}
                      </Badge>
                      {anuncio.preco && (
                        <span className="text-base font-bold text-green-600">{formatarMoeda(anuncio.preco)}</span>
                      )}
                    </div>

                    <p className="text-xs text-gray-500 mb-3 truncate">
                      Vendedor: <span className="font-medium text-gray-700">{anuncio.vendedor.nome}</span>
                    </p>

                    <button
                      onClick={() => setAnuncioSel(anuncio)}
                      className="w-full py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Tenho interesse
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Pedidos */}
        {aba === 'pedidos' && (
          carregando ? (
            <div className="flex justify-center py-16"><Spinner tamanho="lg" /></div>
          ) : pedidos.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-5xl mb-4">📋</p>
              <p className="text-gray-500">Você ainda não fez nenhuma solicitação.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pedidos.map((pedido) => (
                <div key={pedido.id} className="bg-white rounded-2xl p-5 border border-gray-100 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs text-gray-400">{pedido.anuncio.figurinha.numero}</span>
                      <span className="font-semibold text-gray-900">{pedido.anuncio.figurinha.nome}</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Vendedor: <span className="font-medium">{pedido.anuncio.vendedor.nome}</span>
                    </p>
                    {pedido.mensagem && (
                      <p className="text-xs text-gray-400 mt-1 italic">"{pedido.mensagem}"</p>
                    )}
                    {pedido.resposta && (
                      <p className="text-xs text-blue-600 mt-1">Resposta: {pedido.resposta}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variante={PEDIDO_COR[pedido.status]}>
                      {LABELS_STATUS_PEDIDO[pedido.status]}
                    </Badge>
                    <span className="text-xs text-gray-400">{pedido.criado_em}</span>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </main>

      {/* Modal de interesse */}
      <Modal
        aberto={anuncioSelecionado !== null}
        onFechar={() => { setAnuncioSel(null); setMensagem('') }}
        titulo="Manifestar interesse"
      >
        {anuncioSelecionado && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="font-semibold text-gray-900">{anuncioSelecionado.figurinha.nome}</p>
              <p className="text-sm text-gray-500 mt-0.5">
                {LABELS_TIPO[anuncioSelecionado.tipo]}
                {anuncioSelecionado.preco ? ` · ${formatarMoeda(anuncioSelecionado.preco)}` : ''}
              </p>
              <p className="text-sm text-gray-500 mt-0.5">
                Vendedor: {anuncioSelecionado.vendedor.nome}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Mensagem para o vendedor <span className="text-gray-400">(opcional)</span>
              </label>
              <textarea
                value={mensagemInteresse}
                onChange={(e) => setMensagem(e.target.value)}
                rows={3}
                maxLength={500}
                placeholder="Ex: Olá, gostaria de trocar pela figurinha BRA-1..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 placeholder-gray-400 resize-none"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => { setAnuncioSel(null); setMensagem('') }}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={manifestarInteresse}
                disabled={enviandoInteresse}
                className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {enviandoInteresse ? <><Spinner tamanho="sm" className="text-white" /> Enviando...</> : 'Enviar interesse'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}
