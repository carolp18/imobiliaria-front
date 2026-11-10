export default function FiltrosImoveis({ filtros, bairros, finalidades, aoAlterar, aoLimpar }) {
  const faixaInvalida =
    filtros.precoMin !== '' &&
    filtros.precoMax !== '' &&
    Number(filtros.precoMin) > Number(filtros.precoMax)

  return (
    <form className="filtros" onSubmit={(e) => e.preventDefault()}>
      <label className="campo">
        Bairro
        <select value={filtros.bairro} onChange={(e) => aoAlterar('bairro', e.target.value)}>
          <option value="">Todos</option>
          {bairros.map((nome) => (
            <option key={nome} value={nome}>
              {nome}
            </option>
          ))}
        </select>
      </label>

      <label className="campo">
        Finalidade
        <select
          value={filtros.finalidade}
          onChange={(e) => aoAlterar('finalidade', e.target.value)}
        >
          <option value="">Todas</option>
          {finalidades.map((nome) => (
            <option key={nome} value={nome}>
              {nome}
            </option>
          ))}
        </select>
      </label>

      <label className="campo">
        Preço mínimo (R$)
        <input
          type="number"
          min="0"
          value={filtros.precoMin}
          onChange={(e) => aoAlterar('precoMin', e.target.value)}
        />
      </label>

      <label className="campo">
        Preço máximo (R$)
        <input
          type="number"
          min="0"
          value={filtros.precoMax}
          onChange={(e) => aoAlterar('precoMax', e.target.value)}
        />
      </label>

      <label className="campo">
        Ordenar por
        <select value={filtros.ordem} onChange={(e) => aoAlterar('ordem', e.target.value)}>
          <option value="recentes">Mais recentes</option>
          <option value="menor">Menor preço</option>
          <option value="maior">Maior preço</option>
        </select>
      </label>

      <button type="button" className="botao botao-secundario" onClick={aoLimpar}>
        Limpar filtros
      </button>

      {faixaInvalida && (
        <p className="campo-erro filtros-aviso">O preço mínimo é maior que o máximo.</p>
      )}
    </form>
  )
}