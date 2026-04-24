import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('fixit_user')
    return saved ? JSON.parse(saved) : null
  })

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('fixit_users') || '[]')
    const found = users.find(u => u.email === email && u.password === password)
    if (!found) throw new Error('Invalid email or password')
    const { password: _, ...safe } = found
    setUser(safe)
    localStorage.setItem('fixit_user', JSON.stringify(safe))
    return safe
  }

  const signup = (name, email, password) => {
    const users = JSON.parse(localStorage.getItem('fixit_users') || '[]')
    if (users.find(u => u.email === email)) throw new Error('Email already registered')
    const newUser = { id: Date.now(), name, email, password, joined: new Date().toISOString() }
    users.push(newUser)
    localStorage.setItem('fixit_users', JSON.stringify(users))
    const { password: _, ...safe } = newUser
    setUser(safe)
    localStorage.setItem('fixit_user', JSON.stringify(safe))
    return safe
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('fixit_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
