// Leitura do JWT no front. Aqui só LEMOS o conteúdo para saber quem é a pessoa
// e quando o token expira; quem valida de verdade a assinatura é o backend.

function base64UrlParaTexto(parte) {
  const base64 = parte.replace(/-/g, '+').replace(/_/g, '/')
  const preenchido = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')
  const bytes = Uint8Array.from(atob(preenchido), (c) => c.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

export function decodificarToken(token) {
  try {
    const [, payload] = token.split('.')
    return JSON.parse(base64UrlParaTexto(payload))
  } catch {
    return null
  }
}

export function tokenExpirado(payload) {
  if (!payload?.exp) return false
  return payload.exp * 1000 <= Date.now()
}

// O backend grava o perfil no campo "role". Qualquer valor diferente de ADMIN
// (com ou sem o prefixo ROLE_) é tratado como cliente.
export function perfilDoToken(payload) {
  const bruto = String(payload?.role ?? '')
    .replace(/^ROLE_/i, '')
    .toUpperCase()
  return bruto === 'ADMIN' ? 'ADMIN' : 'CLIENTE'
}