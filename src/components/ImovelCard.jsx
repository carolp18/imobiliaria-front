// Os campos podem vir como texto ou como objeto ({ nome }), dependendo do backend.
const texto = (valor) => (valor && typeof valor === 'object' ? valor.nome : valor)

const moeda = (valor) =>
  Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export default function ImovelCard({ imovel }) {
  const foto = imovel.fotos?.[0]?.url ?? imovel.foto ?? imovel.fotoUrl
  const tipo = texto(imovel.tipo) ?? texto(imovel.tipoImovel)
  const bairro = texto(imovel.bairro)
  const cidade = imovel.cidade ?? imovel.bairro?.cidade
  const finalidade = texto(imovel.finalidade) ?? texto(imovel.tipoOferta)

  return (
    <article className="card">
      {foto ? (
        <img className="card-foto" src={foto} alt={`${tipo ?? 'Imóvel'} em ${bairro ?? ''}`} />
      ) : (
        <div className="card-foto card-foto-vazia">Sem foto</div>
      )}

      <div className="card-corpo">
        {finalidade && <span className="selo">{finalidade}</span>}
        <h3>{tipo ?? 'Imóvel'}</h3>
        <p className="local">{[bairro, texto(cidade)].filter(Boolean).join(' · ')}</p>
        {imovel.valor != null && <p className="valor">{moeda(imovel.valor)}</p>}
      </div>
    </article>
  )
}