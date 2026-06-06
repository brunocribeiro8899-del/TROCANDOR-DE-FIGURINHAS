import api from './api'
import type { Pedido } from '../types'

export const pedidoService = {
  async listar(): Promise<Pedido[]> {
    const { data } = await api.get('/pedidos')
    return data.data
  },

  async criar(anuncioId: number, mensagem?: string): Promise<Pedido> {
    const { data } = await api.post('/pedidos', { anuncio_id: anuncioId, mensagem })
    return data.data
  },

  async responder(id: number, status: 'aceito' | 'recusado', resposta?: string): Promise<Pedido> {
    const { data } = await api.patch(`/pedidos/${id}/responder`, { status, resposta })
    return data.data
  },
}
