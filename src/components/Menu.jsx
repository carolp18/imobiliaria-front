import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Menu() {
  const { logado, perfil, email, sair } = useAuth()
  const navigate = useNavigate()

  function aoSair() {
    sair()
    navigate('/login', { replace: true })
  }

  return (
    <header className="topo">
      <Link to="/" className="marca">
        Imobiliária
      </Link>

      <nav className="menu">
        <NavLink to="/" end>
          Imóveis
        </NavLink>

        {!logado && <NavLink to="/login">Entrar</NavLink>}

        {logado && perfil === 'CLIENTE' && <NavLink to="/cliente">Minha área</NavLink>}
        {logado && perfil === 'ADMIN' && <NavLink to="/admin">Painel</NavLink>}

        {logado && (
          <>
            <span className="menu-usuario">{email}</span>
            <button type="button" className="botao-sair" onClick={aoSair}>
              Sair
            </button>
          </>
        )}
      </nav>
    </header>
  )
}