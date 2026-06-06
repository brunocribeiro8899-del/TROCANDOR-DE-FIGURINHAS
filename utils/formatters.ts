export function formatarMoeda(valor?: number | null): string {
  if (valor == null) return '—'
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)
}

export function formatarData(data?: string | null): string {
  if (!data) return '—'
  return data
}

export const LABELS_TIPO: Record<string, string> = {
  venda: 'Venda',
  troca: 'Troca',
  ambos: 'Venda / Troca',
}

export const LABELS_STATUS_ANUNCIO: Record<string, string> = {
  disponivel: 'Disponível',
  vendido:    'Vendido',
  pausado:    'Pausado',
}

export const LABELS_STATUS_PEDIDO: Record<string, string> = {
  pendente:  'Pendente',
  aceito:    'Aceito',
  recusado:  'Recusado',
}

export const LABELS_RARIDADE: Record<string, string> = {
  comum:    'Comum',
  rara:     'Rara',
  especial: 'Especial',
  lendaria: 'Lendária',
}

export const LABELS_PERFIL: Record<string, string> = {
  admin:     'Administrador',
  comprador: 'Comprador',
  vendedor:  'Vendedor',
  ambos:     'Comprador / Vendedor',
}

export function mensagemErroApi(error: unknown, fallback = 'Ocorreu um erro inesperado. Tente novamente.'): string {
  if (error && typeof error === 'object' && 'response' in error) {
    const resp = (error as { response?: { data?: { message?: string } } }).response
    return resp?.data?.message ?? fallback
  }
  return fallback
}
