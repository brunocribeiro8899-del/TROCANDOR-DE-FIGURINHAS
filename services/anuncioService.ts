import api from './api'
import type { Anuncio } from '../types'

interface AnuncioPayload {
  figurinha_id: number
  tipo: 'venda' | 'troca' | 'ambos'
  preco?: number
  descricao?: string
}

interface FiltrosAnuncio {
  busca?: string
  categoria?: string
  tipo?: string
}

export const anuncioService = {
  async listar(filtros?: FiltrosAnuncio): Promise<Anuncio[]> {
    const { data } = await api.get('/anuncios', { params: filtros })
    return data.data
  },

  async meusAnuncios(): Promise<Anuncio[]> {
    const { data } = await api.get('/meus-anuncios')
    return data.data
  },

  async buscarPorId(id: number): Promise<Anuncio> {
    const { data } = await api.get(`/anuncios/${id}`)
    return data.data
  },

  async criar(payload: AnuncioPayload): Promise<Anuncio> {
    const { data } = await api.post('/anuncios', payload)
    return data.data
  },

  async atualizar(id: number, payload: Partial<AnuncioPayload>): Promise<Anuncio> {
    const { data } = await api.put(`/anuncios/${id}`, payload)
    return data.data
  },

  async deletar(id: number): Promise<void> {
    await api.delete(`/anuncios/${id}`)
  },

  async marcarVendido(id: number): Promise<Anuncio> {
    const { data } = await api.patch(`/anuncios/${id}/vender`)
    return data.data
  },

  async listarAdmin(filtros?: { busca?: string; status?: string }): Promise<Anuncio[]> {
    const { data } = await api.get('/admin/anuncios', { params: filtros })
    return data.data
  },

  async deletarAdmin(id: number): Promise<void> {
    await api.delete(`/admin/anuncios/${id}`)
  },
}
