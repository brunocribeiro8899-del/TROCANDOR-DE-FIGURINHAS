export interface User {
  id: number
  nome: string
  email: string
  perfil: 'admin' | 'comprador' | 'vendedor' | 'ambos'
  ativo: boolean
  criado_em?: string
}

export interface Figurinha {
  id: number
  numero: string
  nome: string
  categoria: string
  pais?: string
  raridade: 'comum' | 'rara' | 'especial' | 'lendaria'
  imagem?: string
}

export interface Anuncio {
  id: number
  tipo: 'venda' | 'troca' | 'ambos'
  preco?: number
  descricao?: string
  status: 'disponivel' | 'vendido' | 'pausado'
  criado_em: string
  figurinha: Figurinha
  vendedor: { id: number; nome: string }
}

export interface Pedido {
  id: number
  mensagem?: string
  status: 'pendente' | 'aceito' | 'recusado'
  resposta?: string
  criado_em: string
  anuncio: Anuncio
  comprador: User
}

export interface Metricas {
  total_usuarios: number
  usuarios_ativos: number
  total_anuncios: number
  anuncios_ativos: number
  total_pedidos: number
  pedidos_aceitos: number
}

export interface ApiResponse<T> {
  data: T
  message: string
}

export interface ToastData {
  id: string
  tipo: 'sucesso' | 'erro' | 'aviso' | 'info'
  mensagem: string
}
