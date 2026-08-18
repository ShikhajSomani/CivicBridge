const USERS_KEY = 'civicbridge.users'
const SESSION_KEY = 'civicbridge.session'

function readUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
  } catch {
    return []
  }
}

function waitForRequest(result) {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(result), 350)
  })
}

// This mock keeps the UI usable until a real auth API is available.
// Replace these functions with fetch calls without changing the pages.
export async function signUp({ name, email, password }) {
  const users = readUsers()
  const normalizedEmail = email.trim().toLowerCase()

  if (users.some((user) => user.email === normalizedEmail)) {
    throw new Error('An account with this email already exists.')
  }

  const user = { name: name.trim(), email: normalizedEmail, password }
  localStorage.setItem(USERS_KEY, JSON.stringify([...users, user]))
  localStorage.setItem(SESSION_KEY, JSON.stringify({ name: user.name, email: user.email }))
  return waitForRequest({ name: user.name, email: user.email })
}

export async function signIn({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase()
  const user = readUsers().find((candidate) => candidate.email === normalizedEmail)

  if (!user || user.password !== password) {
    throw new Error('The email or password you entered is incorrect.')
  }

  const session = { name: user.name, email: user.email }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return waitForRequest(session)
}

export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null')
  } catch {
    return null
  }
}

export function signOut() {
  localStorage.removeItem(SESSION_KEY)
}
