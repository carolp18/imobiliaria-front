export function moeda(valor) {
  return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function numero(valor) {
  return Number(valor).toLocaleString('pt-BR')
}

// Lista os preços que o imóvel tem: venda e/ou aluguel.
export function precosDoImovel(imovel) {
  const precos = []
  if (Number(imovel.precoVenda) > 0) {
    precos.push({ rotulo: 'Venda', valor: Number(imovel.precoVenda), sufixo: '' })
  }
  if (Number(imovel.precoAluguel) > 0) {
    precos.push({ rotulo: 'Aluguel', valor: Number(imovel.precoAluguel), sufixo: '/mês' })
  }
  return precos
}

// Preço usado para filtrar e ordenar. Se a finalidade escolhida for aluguel ou
// venda, usa o preço correspondente; senão, usa o menor preço que o imóvel tem.
export function precoReferencia(imovel, finalidade = '') {
  const precos = precosDoImovel(imovel)
  if (precos.length === 0) return null

  const f = String(finalidade).toUpperCase()
  let preferido = null
  if (f.includes('ALUG')) preferido = 'Aluguel'
  else if (f.includes('VEND')) preferido = 'Venda'

  const escolhido = precos.find((p) => p.rotulo === preferido)
  if (escolhido) return escolhido.valor
  return Math.min(...precos.map((p) => p.valor))
}