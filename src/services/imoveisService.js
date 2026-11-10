import api from './api.js'

// Aceita tanto uma lista simples quanto respostas paginadas
// ({ content: [] }, { data: [] }, { items: [] }, { imoveis: [] }).
function extrairLista(corpo) {
  if (Array.isArray(corpo)) return corpo
  return corpo?.content ?? corpo?.data ?? corpo?.items ?? corpo?.imoveis ?? []
}

export async function listarImoveis(params = {}) {
  const { data } = await api.get('/imoveis', { params })
  return extrairLista(data)
}

// GET /imoveis/{id}: devolve o imóvel ou 404
export async function buscarImovel(id) {
  const { data } = await api.get(`/imoveis/${id}`)
  return data
}