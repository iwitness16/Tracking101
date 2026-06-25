import { cookies } from 'next/headers'

export const ADMIN_COOKIE = 'atlas_admin_session'
export const ADMIN_COOKIE_VALUE = 'authenticated'

const ADMIN_USERNAME = 'adminuser'
const ADMIN_PASSWORD = 'Crypto123#'

export function isValidAdminCredentials(username: string, password: string) {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD
}

export async function isAdminAuthenticated() {
  const store = await cookies()
  return store.get(ADMIN_COOKIE)?.value === ADMIN_COOKIE_VALUE
}
