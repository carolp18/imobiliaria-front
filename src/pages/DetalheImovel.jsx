import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { buscarImovel } from '../services/imoveisService.js'
import { mensagemDeErro } from '../services/api.js'
import { EMAIL_CONTATO } from '../config.js'
import { moeda, numero, precosDoImovel } from '../utils/formatar.js'

function Info({ rotulo, valor }) {
  if (valor === null || valor === undefined || valor === '') return null
  return (
    <div className="info">
      <dt>{rotulo}</dt>
      <dd>{valor}</dd>
    </div>
  )
}

export default function DetalheImovel() {
  const { id } = useParams()
  const { email } = useAuth()

  const [imovel, setImovel] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    let cancelado = false

    async function carregar() {
      setCarregando(true)
      setErro(null)
      setImovel(null)
      try {
        const dados = await buscarImovel(id)
        if (!cancelado) setImovel(dados)
      } catch (e) {
        if (!cancelado) {
          setErro(e.response?.status === 404 ? 'Imóvel não encontrado.' : mensagemDeErro(e))
        }
      } finally {
        if (!cancelado) setCarregando(false)
      }
    }

    carregar()
    return () => {
      cancelado = true
    }
  }, [id])

  if (carregando) return <p className="estado">Carregando imóvel...</p>

  if (erro) {
    return (
      <section>
        <p className="estado erro" role="alert">
          {erro}
        </p>
        <p className="estado">
          <Link to="/">Voltar para os imóveis</Link>
        </p>
      </section>
    )
  }

  const precos = precosDoImovel(imovel)
  const bairro = imovel.bairro?.nome
  const cidade = [imovel.bairro?.cidade, imovel.bairro?.estado].filter(Boolean).join(' - ')
  const rua = [imovel.endereco, imovel.numero].filter(Boolean).join(', ')
  const enderecoCompleto = [rua, imovel.complemento, bairro, cidade, imovel.cep && `CEP ${imovel.cep}`]
    .filter(Boolean)
    .join(' · ')

  // E-mail de contato já preenchido com os dados do imóvel
  const assunto = `Interesse no imóvel: ${imovel.titulo}`
  const corpo = [
    'Olá,',
    '',
    `Tenho interesse no imóvel "${imovel.titulo}" (código ${imovel.id})${bairro ? `, no bairro ${bairro}` : ''}.`,
    'Gostaria de receber mais informações.',
    '',
    'Atenciosamente,',
    email ?? '',
  ].join('\n')
  const linkContato = `mailto:${EMAIL_CONTATO}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`

  return (
    <article className="detalhe">
      <p>
        <Link to="/">← Voltar para os imóveis</Link>
      </p>

      <div className="selos">
        {imovel.finalidade && <span className="selo">{imovel.finalidade}</span>}
        {imovel.status && <span className="selo selo-status">{imovel.status}</span>}
        {imovel.destaque && <span className="selo selo-destaque">Destaque</span>}
      </div>

      <h1>{imovel.titulo}</h1>
      <p className="local">{[imovel.tipoImovel?.nome, bairro, cidade].filter(Boolean).join(' · ')}</p>

      <div className="detalhe-precos">
        {precos.length === 0 && <p>Preço sob consulta.</p>}
        {precos.map((preco) => (
          <p className="valor valor-grande" key={preco.rotulo}>
            <span className="valor-rotulo">{preco.rotulo}</span> {moeda(preco.valor)}
            {preco.sufixo}
          </p>
        ))}
      </div>

      <div className="card-foto card-foto-vazia detalhe-foto">Sem foto</div>

      {imovel.descricao && (
        <>
          <h2>Descrição</h2>
          <p className="texto-longo">{imovel.descricao}</p>
        </>
      )}

      <h2>Detalhes</h2>
      <dl className="infos">
        <Info rotulo="Dormitórios" valor={imovel.dormitorios} />
        <Info rotulo="Banheiros" valor={imovel.banheiros} />
        <Info rotulo="Vagas de garagem" valor={imovel.garagem} />
        <Info
          rotulo="Área total"
          valor={imovel.areaTotal != null ? `${numero(imovel.areaTotal)} m²` : null}
        />
        <Info
          rotulo="Área construída"
          valor={imovel.areaConstruida != null ? `${numero(imovel.areaConstruida)} m²` : null}
        />
      </dl>

      {imovel.caracteristicas && (
        <>
          <h2>Características</h2>
          <p className="texto-longo">{imovel.caracteristicas}</p>
        </>
      )}

      {enderecoCompleto && (
        <>
          <h2>Localização</h2>
          <p>{enderecoCompleto}</p>
        </>
      )}

      <p className="detalhe-acoes">
        <a className="botao botao-link" href={linkContato}>
          Entrar em contato por e-mail
        </a>
      </p>
    </article>
  )
}