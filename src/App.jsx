import { Routes, Route, Link } from 'react-router-dom'
import Vitrine from './pages/Vitrine.jsx'

export default function App() {
  return (
    <>
      <header className="topo">
        <Link to="/" className="marca">
          Imobiliária
        </Link>
      </header>

      <main className="conteudo">
        <Routes>
          <Route path="/" element={<Vitrine />} />
          <Route path="*" element={<p className="estado">Página não encontrada.</p>} />
        </Routes>
      </main>
    </>
  )
}