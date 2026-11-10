import { useAuth } from '../context/AuthContext.jsx'

export default function AreaCliente() {
  const { email } = useAuth()

  return (
    <section>
      <h1>Minha área</h1>
      <p>Olá, {email}.</p>
      <p className="estado">Em breve: minhas ofertas, favoritos e contratos.</p>
    </section>
  )
}