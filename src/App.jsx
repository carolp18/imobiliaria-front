import { Routes, Route } from 'react-router-dom'
import Menu from './components/Menu.jsx'
import RotaProtegida from './components/RotaProtegida.jsx'
import Vitrine from './pages/Vitrine.jsx'
import DetalheImovel from './pages/DetalheImovel.jsx'
import Login from './pages/Login.jsx'
import AreaCliente from './pages/AreaCliente.jsx'
import PainelAdmin from './pages/PainelAdmin.jsx'

export default function App() {
  return (
    <>
      <Menu />

      <main className="conteudo">
        <Routes>
          <Route path="/" element={<Vitrine />} />
          <Route path="/imoveis/:id" element={<DetalheImovel />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/cliente"
            element={
              <RotaProtegida perfil="CLIENTE">
                <AreaCliente />
              </RotaProtegida>
            }
          />

          <Route
            path="/admin"
            element={
              <RotaProtegida perfil="ADMIN">
                <PainelAdmin />
              </RotaProtegida>
            }
          />

          <Route path="*" element={<p className="estado">Página não encontrada.</p>} />
        </Routes>
      </main>
    </>
  )
}