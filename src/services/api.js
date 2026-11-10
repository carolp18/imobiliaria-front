import axios from 'axios'

const TOKEN_KEY = 'token'

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080',
  timeout: 15000,
})

// Toda requisição autenticada envia Authorization: Bearer <token>
api.interceptors.request.use((config) => {
  const token = tokenStorage.get()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 401 com token guardado = sessão expirada: apaga o token e volta ao login.
// (No login com senha errada não há token guardado, então não cai aqui.)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && tokenStorage.get()) {
      tokenStorage.clear()
      window.location.assign('/login?expirou=1')
    }
    return Promise.reject(error)
  },
)

// Converte qualquer erro da API em uma mensagem amigável (nunca um JSON)
export function mensagemDeErro(error) {
  if (!error.response) {
    return 'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.'
  }

  const { status, data } = error.response
  const mensagemDoBackend = typeof data?.message === 'string' ? data.message : null

  switch (status) {
    case 401:
      return 'Sua sessão expirou. Faça login novamente.'
    case 403:
      return 'Acesso negado. Você não tem permissão para realizar esta ação.'
    case 404:
      return 'Item não encontrado.'
    case 409:
      return mensagemDoBackend ?? 'Esta ação não é permitida pelas regras do sistema.'
    default:
      return status >= 500
        ? 'Ocorreu um erro no servidor. Tente novamente em instantes.'
        : (mensagemDoBackend ?? 'Não foi possível concluir a operação.')
  }
}

export default api