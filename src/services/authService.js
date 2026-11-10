import api from './api.js'

// POST /public/login -> { token }. Senha errada devolve 401 sem corpo.
export async function login(email, senha) {
  const { data } = await api.post('/public/login', { email, senha })
  return data.token
}