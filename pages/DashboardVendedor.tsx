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
  LABELS_TIPO, LABELS_STATUS_ANUNCIO, LABELS_STATUS_PEDIDO
} from '../utils/formatters'

type Aba = 'anuncios' | 'pedidos'

const STATUS_ANUNCIO_COR: Record<string, 'verde' | 'cinza' | 'amarelo'> = {
  disponivel: 'verde',
  vendido:    'cinza',
  pausado:    'amarelo',
}

const PEDIDO_COR: Record<string, 'amarelo' | 'verde' | 'vermelho'> = {
  pendente: 'amarelo',
  aceito:   'verde',
  recusado: 'vermelho',
}

interface FormAnuncio { figurinha_id: string; tipo: string; preco: string; descricao: string }

export function DashboardVendedor() {
  const [aba, setAba]                       = useState<Aba>('anuncios')
  const [anuncios, setAnuncios]             = useState<Anuncio[]>([])
  const [pedidos, setPedidos]               = useState<Pedido[]>([])
  const [carregando, setCarregando]         = useState(false)
  const [modalAberto, setModalAberto]       = useState(false)
  const [editando, setEditando]             = useState<Anuncio | null>(null)
  const [form, setForm]                     = useState<FormAnuncio>({ figurinha_id: '', tipo: 'venda', preco: '', descricao: '' })
  const [salvando, setSalvando]             = useState(false)
  const [pedidoResp, setPedidoResp]         = useState<Pedido | null>(null)
  const [resposta, setResposta]             = useState('')
  const toast = useToast()

  const carregarAnuncios = useCallback(async () => {
    setCarregando(true)
    try { setAnuncios(await anuncioService.meusAnuncios()) }
    catch (err) { toast.erro(mensagemErroApi(err)) }
    finally { setCarregando(false) }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const carregarPedidos = useCallback(async () => {
    setCarregando(true)
    try { setPedidos(await pedidoService.listar()) }
    catch (err) { toast.erro(mensagemErroApi(err)) }
    finally { setCarregando(false) }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { carregarAnuncios() }, [carregarAnuncios])
  useEffect(() => { if (aba === 'pedidos') carregarPedidos() }, [aba, carregarPedidos])

  const abrirNovoAnuncio = () => {
    setEditando(null)
    setForm({ figurinha_id: '', tipo: 'venda', preco: '', descricao: '' })
    setModalAberto(true)
  }

  const abrirEdicao = (a: Anuncio) => {
    setEditando(a)
    setForm({
      figurinha_id: String(a.figurinha.id),
      tipo: a.tipo,
      preco: a.preco ? String(a.preco) : '',
      descricao: a.descricao ?? '',
    })
    setModalAberto(true)
  }

  const salvarAnuncio = async () => {
    if (!form.figurinha_id || !form.tipo) {
      toast.aviso('Preencha todos os campos obrigatórios.')
      return
    }
    setSalvando(true)
    try {
      const payload = {
        figurinha_id: Number(form.figurinha_id),
        tipo: form.tipo as 'venda' | 'troca' | 'ambos',
        preco: form.preco ? Number(form.preco) : undefined,
        descricao: form.descricao || undefined,
      }
      if (editando) {
        await anuncioService.atualizar(editando.id, payload)
        toast.sucesso('Anúncio atualizado com sucesso.')
      } else {
        await anuncioService.criar(payload)
        toast.sucesso('Anúncio publicado com sucesso.')
      }
      setModalAberto(false)
      carregarAnuncios()
    } catch (err) {
      toast.erro(mensagemErroApi(err))
    } finally {
      setSalvando(false)
    }
  }

  const marcarVendido = async (id: number) => {
    try {
      await anuncioService.marcarVendido(id)
      toast.sucesso('Figurinha marcada como vendida.')
      carregarAnuncios()
    } catch (err) {
      toast.erro(mensagemErroApi(err))
    }
  }

  const deletarAnuncio = async (id: number) => {
    if (!confirm('Remover este anúncio?')) return
    try {
      await anuncioService.deletar(id)
      toast.sucesso('Anúncio removido.')
      carregarAnuncios()
    } catch (err) {
      toast.erro(mensagemErroApi(err))
    }
  }

  const responderPedido = async (status: 'aceito' | 'recusado') => {
    if (!pedidoResp) return
    try {
      await pedidoService.responder(pedidoResp.id, status, resposta || undefined)
      toast.sucesso(status === 'aceito' ? 'Pedido aceito!' : 'Pedido recusado.')
      setPedidoResp(null)
      setResposta('')
      carregarPedidos()
    } catch (err) {
      toast.erro(mensagemErroApi(err))
    }
  }

  return (
    <>
      <Header />
      <ToastContainer toasts={toast.toasts} onRemover={toast.remover} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
            {([['anuncios', 'Meus Anúncios'], ['pedidos', 'Pedidos Recebidos']] as [Aba, string][]).map(([val, label]) => (
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
          {aba === 'anuncios' && (
            <button
              onClick={abrirNovoAnuncio}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors"
            >
              <span className="text-lg leading-none">+</span> Publicar anúncio
            </button>
          )}
        </div>

        {/* Anúncios */}
        {aba === 'anuncios' && (
          carregando ? (
            <div className="flex justify-center py-16"><Spinner tamanho="lg" /></div>
          ) : anuncios.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-5xl mb-4">📦</p>
              <p className="text-gray-500 mb-4">Você ainda não tem anúncios.</p>
              <button onClick={abrirNovoAnuncio} className="px-6 py-3 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition-colors">
                Publicar primeiro anúncio
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {anuncios.map((anuncio) => (
                <div key={anuncio.id} className="bg-white rounded-2xl p-5 border border-gray-100 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs text-gray-400">{anuncio.figurinha.numero}</span>
                      <span className="font-semibold text-gray-900">{anuncio.figurinha.nome}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variante={STATUS_ANUNCIO_COR[anuncio.status]}>{LABELS_STATUS_ANUNCIO[anuncio.status]}</Badge>
                      <Badge variante={anuncio.tipo === 'troca' ? 'azul' : 'verde'}>{LABELS_TIPO[anuncio.tipo]}</Badge>
                      {anuncio.preco && <span className="text-sm font-bold text-green-600">{formatarMoeda(anuncio.preco)}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {anuncio.status === 'disponivel' && (
                      <button onClick={() => marcarVendido(anuncio.id)} className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors">
                        Marcar como vendido
                      </button>
                    )}
                    <button onClick={() => abrirEdicao(anuncio)} className="px-3 py-1.5 rounded-lg text-xs font-medium text-blue-600 border border-blue-200 hover:bg-blue-50 transition-colors">
                      Editar
                    </button>
                    <button onClick={() => deletarAnuncio(anuncio.id)} className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 border border-red-200 hover:bg-red-50 transition-colors">
                      Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* Pedidos */}
        {aba === 'pedidos' && (
          carregando ? (
            <div className="flex justify-center py-16"><Spinner tamanho="lg" /></div>
          ) : pedidos.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-5xl mb-4">📩</p>
              <p className="text-gray-500">Nenhum pedido recebido ainda.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pedidos.map((pedido) => (
                <div key={pedido.id} className="bg-white rounded-2xl p-5 border border-gray-100 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 mb-0.5">{pedido.anuncio.figurinha.nome}</p>
                    <p className="text-sm text-gray-500">
                      Comprador: <span className="font-medium">{pedido.comprador.nome}</span>
                    </p>
                    {pedido.mensagem && (
                      <p className="text-xs text-gray-400 mt-1 italic">"{pedido.mensagem}"</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variante={PEDIDO_COR[pedido.status]}>{LABELS_STATUS_PEDIDO[pedido.status]}</Badge>
                    {pedido.status === 'pendente' && (
                      <button
                        onClick={() => { setPedidoResp(pedido); setResposta('') }}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium text-blue-600 border border-blue-200 hover:bg-blue-50 transition-colors"
                      >
                        Responder
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </main>

      {/* Modal anúncio */}
      <Modal
        aberto={modalAberto}
        onFechar={() => setModalAberto(false)}
        titulo={editando ? 'Editar anúncio' : 'Novo anúncio'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">ID da Figurinha</label>
            <input
              type="number"
              value={form.figurinha_id}
              onChange={(e) => setForm(f => ({ ...f, figurinha_id: e.target.value }))}
              placeholder="Ex: 1"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tipo de negociação</label>
            <select
              value={form.tipo}
              onChange={(e) => setForm(f => ({ ...f, tipo: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
            >
              <option value="venda">Venda</option>
              <option value="troca">Troca</option>
              <option value="ambos">Venda / Troca</option>
            </select>
          </div>
          {form.tipo !== 'troca' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Preço (R$)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.preco}
                onChange={(e) => setForm(f => ({ ...f, preco: e.target.value }))}
                placeholder="Ex: 5.00"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Descrição <span className="text-gray-400">(opcional)</span></label>
            <textarea
              value={form.descricao}
              onChange={(e) => setForm(f => ({ ...f, descricao: e.target.value }))}
              rows={3}
              maxLength={500}
              placeholder="Estado da figurinha, condições de troca..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 resize-none"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setModalAberto(false)} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors">
              Cancelar
            </button>
            <button
              onClick={salvarAnuncio}
              disabled={salvando}
              className="flex-1 py-3 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {salvando ? <><Spinner tamanho="sm" className="text-white" /> Salvando...</> : (editando ? 'Salvar alterações' : 'Publicar anúncio')}
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal resposta pedido */}
      <Modal
        aberto={pedidoResp !== null}
        onFechar={() => { setPedidoResp(null); setResposta('') }}
        titulo="Responder pedido"
      >
        {pedidoResp && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="font-semibold">{pedidoResp.anuncio.figurinha.nome}</p>
              <p className="text-sm text-gray-500">De: {pedidoResp.comprador.nome}</p>
              {pedidoResp.mensagem && <p className="text-xs text-gray-400 mt-1 italic">"{pedidoResp.mensagem}"</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Mensagem de resposta <span className="text-gray-400">(opcional)</span></label>
              <textarea
                value={resposta}
                onChange={(e) => setResposta(e.target.value)}
                rows={3}
                maxLength={500}
                placeholder="Ex: Pode entrar em contato pelo WhatsApp..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 resize-none"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => responderPedido('recusado')} className="flex-1 py-3 rounded-xl border border-red-200 text-red-600 font-medium hover:bg-red-50 transition-colors">
                Recusar
              </button>
              <button onClick={() => responderPedido('aceito')} className="flex-1 py-3 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition-colors">
                Aceitar
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}
