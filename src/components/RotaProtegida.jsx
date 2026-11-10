import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

// perfil: 'ADMIN' ou 'CLIENTE'. Sem perfil, basta estar logado.
export default function RotaProtegida({ perfil, children }) {
  const { logado, perfil: perfilAtual } = useAuth()
  const location = useLocation()

  // Sem token: volta para o login, lembrando para onde a pessoa queria ir.
  if (!logado) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  // Perfil errado: manda para a área do próprio perfil.
  if (perfil && perfil !== perfilAtual) {
    return <Navigate to={perfilAtual === 'ADMIN' ? '/admin' : '/cliente'} replace />
  }

  return children
}