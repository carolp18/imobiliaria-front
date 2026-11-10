import { useEffect, useMemo, useState } from 'react'
import ImovelCard from '../components/ImovelCard.jsx'
import FiltrosImoveis from '../components/FiltrosImoveis.jsx'
import Paginacao from '../components/Paginacao.jsx'
import { listarImoveis } from '../services/imoveisService.js'
import { mensagemDeErro } from '../services/api.js'
import {
  FILTROS_INICIAIS,
  filtrarEOrdenar,
  opcoesDistintas,
  paginar,
} from '../utils/filtrarImoveis.js'

const POR_PAGINA = 9

export default function Vitrine() {
  const [imoveis, setImoveis] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [filtros, setFiltros] = useState(FILTROS_INICIAIS)
  const [pagina, setPagina] = useState(1)

  useEffect(() => {
    let cancelado = false

    async function carregar() {
      setCarregando(true)
      setErro(null)
      try {
        const lista = await listarImoveis()
        if (!cancelado) setImoveis(lista)
      } catch (e) {
        if (!cancelado) setErro(mensagemDeErro(e))
      } finally {
        if (!cancelado) setCarregando(false)
      }
    }

    carregar()
    return () => {
      cancelado = true
    }
  }, [])

  const bairros = useMemo(() => opcoesDistintas(imoveis, (i) => i.bairro?.nome), [imoveis])
  const finalidades = useMemo(() => opcoesDistintas(imoveis, (i) => i.finalidade), [imoveis])
  const filtrados = useMemo(() => filtrarEOrdenar(imoveis, filtros), [imoveis, filtros])
  const { itens, paginaAtual, totalPaginas } = paginar(filtrados, pagina, POR_PAGINA)

  function alterarFiltro(campo, valor) {
    setFiltros((atual) => ({ ...atual, [campo]: valor }))
    setPagina(1)
  }

  function limparFiltros() {
    setFiltros(FILTROS_INICIAIS)
    setPagina(1)
  }

  function mudarPagina(nova) {
    setPagina(nova)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <section>
      <h1>Imóveis disponíveis</h1>

      {carregando && <p className="estado">Carregando imóveis...</p>}

      {erro && (
        <p className="estado erro" role="alert">
          {erro}
        </p>
      )}

      {!carregando && !erro && (
        <>
          <FiltrosImoveis
            filtros={filtros}
            bairros={bairros}
            finalidades={finalidades}
            aoAlterar={alterarFiltro}
            aoLimpar={limparFiltros}
          />

          {imoveis.length === 0 && <p className="estado">Nenhum imóvel cadastrado ainda.</p>}

          {imoveis.length > 0 && filtrados.length === 0 && (
            <p className="estado">Nenhum imóvel encontrado com esses filtros.</p>
          )}

          {filtrados.length > 0 && (
            <p className="contagem">
              {filtrados.length} {filtrados.length === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}
            </p>
          )}

          <div className="grade">
            {itens.map((imovel) => (
              <ImovelCard key={imovel.id} imovel={imovel} />
            ))}
          </div>

          <Paginacao paginaAtual={paginaAtual} totalPaginas={totalPaginas} aoMudar={mudarPagina} />
        </>
      )}
    </section>
  )
}