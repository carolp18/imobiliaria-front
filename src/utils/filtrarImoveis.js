import { precoReferencia } from './formatar.js'

export const FILTROS_INICIAIS = {
  bairro: '',
  finalidade: '',
  precoMin: '',
  precoMax: '',
  ordem: 'recentes',
}

function paraNumero(texto) {
  if (texto === '' || texto == null) return null
  const n = Number(texto)
  return Number.isFinite(n) ? n : null
}

// O backend devolve todos os imóveis; filtros e ordenação são feitos aqui.
export function filtrarEOrdenar(imoveis, filtros) {
  const min = paraNumero(filtros.precoMin)
  const max = paraNumero(filtros.precoMax)

  const lista = imoveis.filter((imovel) => {
    if (filtros.bairro && imovel.bairro?.nome !== filtros.bairro) return false
    if (filtros.finalidade && imovel.finalidade !== filtros.finalidade) return false

    if (min !== null || max !== null) {
      const preco = precoReferencia(imovel, filtros.finalidade)
      if (preco === null) return false
      if (min !== null && preco < min) return false
      if (max !== null && preco > max) return false
    }
    return true
  })

  if (filtros.ordem === 'menor' || filtros.ordem === 'maior') {
    const sentido = filtros.ordem === 'menor' ? 1 : -1
    return lista.sort((a, b) => {
      const pa = precoReferencia(a, filtros.finalidade)
      const pb = precoReferencia(b, filtros.finalidade)
      if (pa === null && pb === null) return 0
      if (pa === null) return 1 // sem preço vai para o fim
      if (pb === null) return -1
      return (pa - pb) * sentido
    })
  }

  // Padrão: mais recentes primeiro
  return lista.sort((a, b) => b.id - a.id)
}

// Valores distintos (ordenados) de um campo, para montar as opções dos filtros.
export function opcoesDistintas(imoveis, obter) {
  const valores = imoveis.map(obter).filter(Boolean)
  return [...new Set(valores)].sort((a, b) => a.localeCompare(b, 'pt-BR'))
}

export function paginar(lista, pagina, porPagina) {
  const totalPaginas = Math.max(1, Math.ceil(lista.length / porPagina))
  const paginaAtual = Math.min(Math.max(pagina, 1), totalPaginas)
  const inicio = (paginaAtual - 1) * porPagina
  return {
    itens: lista.slice(inicio, inicio + porPagina),
    paginaAtual,
    totalPaginas,
  }
}