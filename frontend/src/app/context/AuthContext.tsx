"use client"
import { createContext, useContext, useState, useEffect } from "react"
import { User } from "@/app/data/User"
import { login as loginApi } from "../api"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (savedUser) setUser(JSON.parse(savedUser))
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const user = await loginApi(email, password)
      setUser(user)
      localStorage.setItem("user", JSON.stringify(user))
    } catch (error) {
      console.error("Login failed:", error)
      throw error 
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}
