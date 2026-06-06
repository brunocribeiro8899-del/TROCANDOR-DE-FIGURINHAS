import api from './api'
import type { User } from '../types'

interface LoginPayload { email: string; senha: string }
interface CadastroPayload { nome: string; email: string; senha: string; senha_confirmation: string; perfil: string }

export const authService = {
  async login(dados: LoginPayload): Promise<{ token: string; user: User }> {
    const { data } = await api.post('/login', dados)
    return data.data
  },

  async cadastro(dados: CadastroPayload): Promise<{ token: string; user: User }> {
    const { data } = await api.post('/cadastro', dados)
    return data.data
  },

  async logout(): Promise<void> {
    await api.post('/logout')
  },

  async me(): Promise<User> {
    const { data } = await api.get('/me')
    return data.data
  },
}
