import { Link } from 'react-router-dom'
import { moeda, precosDoImovel } from '../utils/formatar.js'

// "foto" é opcional: quando as fotos estiverem integradas, basta passar a URL.
export default function ImovelCard({ imovel, foto }) {
  const precos = precosDoImovel(imovel)
  const tipo = imovel.tipoImovel?.nome
  const local = [tipo, imovel.bairro?.nome, imovel.bairro?.cidade].filter(Boolean).join(' · ')

  const detalhes = [
    imovel.dormitorios != null && `${imovel.dormitorios} dorm.`,
    imovel.banheiros != null && `${imovel.banheiros} banh.`,
    imovel.garagem != null && `${imovel.garagem} vaga(s)`,
  ].filter(Boolean)

  return (
    <article className="card">
      {foto ? (
        <img className="card-foto" src={foto} alt={imovel.titulo} />
      ) : (
        <div className="card-foto card-foto-vazia">Sem foto</div>
      )}

      <div className="card-corpo">
        <div className="selos">
          {imovel.finalidade && <span className="selo">{imovel.finalidade}</span>}
          {imovel.status && <span className="selo selo-status">{imovel.status}</span>}
        </div>

        <h3>{imovel.titulo}</h3>
        {local && <p className="local">{local}</p>}
        {detalhes.length > 0 && <p className="detalhes-curtos">{detalhes.join(' · ')}</p>}

        {precos.map((preco) => (
          <p className="valor" key={preco.rotulo}>
            <span className="valor-rotulo">{preco.rotulo}</span> {moeda(preco.valor)}
            {preco.sufixo}
          </p>
        ))}

        <Link className="botao botao-link" to={`/imoveis/${imovel.id}`}>
          Ver detalhes
        </Link>
      </div>
    </article>
  )
}