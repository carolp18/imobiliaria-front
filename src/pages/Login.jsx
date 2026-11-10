import { useState } from 'react'
import { Navigate, useLocation, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { login } from '../services/authService.js'
import { mensagemDeErro } from '../services/api.js'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validar({ email, senha }) {
  const erros = {}
  if (!email.trim()) erros.email = 'Informe o e-mail.'
  else if (!EMAIL_REGEX.test(email.trim())) erros.email = 'Informe um e-mail válido.'
  if (!senha) erros.senha = 'Informe a senha.'
  return erros
}

export function paginaInicialDoPerfil(perfil) {
  return perfil === 'ADMIN' ? '/admin' : '/cliente'
}

export default function Login() {
  const { entrar, logado, perfil } = useAuth()
  const location = useLocation()
  const [params] = useSearchParams()

  const [form, setForm] = useState({ email: '', senha: '' })
  const [erros, setErros] = useState({})
  const [erroGeral, setErroGeral] = useState(null)
  const [enviando, setEnviando] = useState(false)

  // Já logado (ou acabou de logar): vai para onde tentava ir, ou para a área do perfil.
  if (logado) {
    const destino = location.state?.from ?? paginaInicialDoPerfil(perfil)
    return <Navigate to={destino} replace />
  }

  function alterar(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }))
    setErros((atual) => ({ ...atual, [campo]: undefined }))
  }

  async function enviar(evento) {
    evento.preventDefault()
    setErroGeral(null)

    const encontrados = validar(form)
    setErros(encontrados)
    if (Object.keys(encontrados).length > 0) return

    setEnviando(true)
    try {
      const token = await login(form.email.trim(), form.senha)
      const sessao = entrar(token)
      if (!sessao) {
        setErroGeral('O servidor devolveu uma resposta inválida. Tente novamente.')
      }
    } catch (erro) {
      if (erro.response?.status === 401) {
        setErroGeral('E-mail ou senha incorretos.')
      } else {
        setErroGeral(mensagemDeErro(erro))
      }
    } finally {
      setEnviando(false)
    }
  }

  return (
    <section className="form-pagina">
      <h1>Entrar</h1>

      {params.get('expirou') && (
        <p className="aviso" role="status">
          Sua sessão expirou. Faça login novamente.
        </p>
      )}

      <form onSubmit={enviar} noValidate className="formulario">
        <label className="campo">
          E-mail
          <input
            type="email"
            value={form.email}
            onChange={(e) => alterar('email', e.target.value)}
            autoComplete="email"
            aria-invalid={Boolean(erros.email)}
          />
          {erros.email && <span className="campo-erro">{erros.email}</span>}
        </label>

        <label className="campo">
          Senha
          <input
            type="password"
            value={form.senha}
            onChange={(e) => alterar('senha', e.target.value)}
            autoComplete="current-password"
            aria-invalid={Boolean(erros.senha)}
          />
          {erros.senha && <span className="campo-erro">{erros.senha}</span>}
        </label>

        {erroGeral && (
          <p className="estado erro" role="alert">
            {erroGeral}
          </p>
        )}

        <button type="submit" className="botao" disabled={enviando}>
          {enviando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </section>
  )
}