import { useEffect, useState } from 'react'
import ImovelCard from '../components/ImovelCard.jsx'
import { listarImoveis } from '../services/imoveisService.js'
import { mensagemDeErro } from '../services/api.js'

export default function Vitrine() {
  const [imoveis, setImoveis] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

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

  return (
    <section>
      <h1>Imóveis disponíveis</h1>

      {carregando && <p className="estado">Carregando imóveis...</p>}

      {erro && (
        <p className="estado erro" role="alert">
          {erro}
        </p>
      )}

      {!carregando && !erro && imoveis.length === 0 && (
        <p className="estado">Nenhum imóvel encontrado.</p>
      )}

      <div className="grade">
        {imoveis.map((imovel) => (
          <ImovelCard key={imovel.id} imovel={imovel} />
        ))}
      </div>
    </section>
  )
}