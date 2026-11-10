import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { tokenStorage } from '../services/api.js'
import { decodificarToken, perfilDoToken, tokenExpirado } from '../utils/jwt.js'

const AuthContext = createContext(null)

// Lê o token guardado e devolve a sessão, ou null se não há token válido.
function lerSessao() {
  const token = tokenStorage.get()
  if (!token) return null

  const payload = decodificarToken(token)
  if (!payload || tokenExpirado(payload)) {
    tokenStorage.clear()
    return null
  }

  return {
    token,
    email: payload.sub,
    perfil: perfilDoToken(payload),
    exp: payload.exp,
  }
}

export function AuthProvider({ children }) {
  const [sessao, setSessao] = useState(lerSessao)

  const entrar = useCallback((token) => {
    tokenStorage.set(token)
    const nova = lerSessao()
    setSessao(nova)
    return nova
  }, [])

  const sair = useCallback(() => {
    tokenStorage.clear()
    setSessao(null)
  }, [])

  // Desloga sozinho quando o token vence, mesmo sem nenhuma requisição.
  useEffect(() => {
    if (!sessao?.exp) return undefined
    const restante = sessao.exp * 1000 - Date.now()
    const id = setTimeout(sair, Math.max(restante, 0))
    return () => clearTimeout(id)
  }, [sessao, sair])

  const valor = useMemo(
    () => ({
      logado: Boolean(sessao),
      email: sessao?.email ?? null,
      perfil: sessao?.perfil ?? null,
      entrar,
      sair,
    }),
    [sessao, entrar, sair],
  )

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const contexto = useContext(AuthContext)
  if (!contexto) {
    throw new Error('useAuth precisa estar dentro de <AuthProvider>')
  }
  return contexto
}