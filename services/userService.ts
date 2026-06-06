import api from './api'
import type { Metricas, User } from '../types'

export const userService = {
  async listar(filtros?: { busca?: string; perfil?: string; ativo?: boolean }): Promise<User[]> {
    const { data } = await api.get('/admin/usuarios', { params: filtros })
    return data.data
  },

  async alterarStatus(id: number): Promise<User> {
    const { data } = await api.patch(`/admin/usuarios/${id}/status`)
    return data.data
  },

  async metricas(): Promise<Metricas> {
    const { data } = await api.get('/admin/metricas')
    return data.data
  },
}
