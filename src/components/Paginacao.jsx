export default function Paginacao({ paginaAtual, totalPaginas, aoMudar }) {
  if (totalPaginas <= 1) return null

  const paginas = Array.from({ length: totalPaginas }, (_, i) => i + 1)

  return (
    <nav className="paginacao" aria-label="Paginação">
      <button type="button" onClick={() => aoMudar(paginaAtual - 1)} disabled={paginaAtual === 1}>
        Anterior
      </button>

      {paginas.map((numero) => (
        <button
          key={numero}
          type="button"
          className={numero === paginaAtual ? 'ativa' : ''}
          aria-current={numero === paginaAtual ? 'page' : undefined}
          onClick={() => aoMudar(numero)}
        >
          {numero}
        </button>
      ))}

      <button
        type="button"
        onClick={() => aoMudar(paginaAtual + 1)}
        disabled={paginaAtual === totalPaginas}
      >
        Próxima
      </button>
    </nav>
  )
}