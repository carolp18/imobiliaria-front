import { useAuth } from '../context/AuthContext.jsx'

export default function PainelAdmin() {
  const { email } = useAuth()

  return (
    <section>
      <h1>Painel do administrador</h1>
      <p>Olá, {email}.</p>
      <p className="estado">Em breve: cadastros, gestão de ofertas e contratos e gráficos.</p>
    </section>
  )
}