"use client"

import Image from "next/image"
import "./globals.css"
import { AuthProvider, useAuth } from "./context/AuthContext"
import { useState } from "react"
import { Toaster } from "sonner"

function Header() {
  const { user, logout } = useAuth()
  const [showLogin, setShowLogin] = useState(false)

  return (
    <header className="top-bar flex items-center justify-between px-4 py-3 shadow-md">
      <div className="logo flex items-center gap-2">
        <Image src="/ikea.png" alt="IKEA logo" width={50} height={50} />
        <a className="text-xl font-semibold" href="/home">RAPPORTÖR</a>
      </div>

      <nav className="flex space-x-4 items-center">
        <a className="hover:text-blue-500" href="/reports">Reports</a>
        <a className="hover:text-blue-500" href="/settings">Settings</a>

        {user ? (
          <div className="flex items-center gap-2">
            <a href="/user" className="hover:text-blue-500">User</a>
            <a onClick={logout} className="text-red-500 hover:text-red-500">Logout</a>
          </div>
        ) : (
          <a onClick={() => setShowLogin(true)} className="hover:text-blue-500 cursor-pointer">
            Login
          </a>
        )}
        
      </nav>

      {showLogin && (
        <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg p-6 z-50">
          <LoginSidebar onClose={() => setShowLogin(false)} />
        </div>
      )}
    </header>
  )
}

function LoginSidebar({ onClose }: { onClose: () => void }) {
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async () => {
    await login(email, password)
    onClose()
  }

  return (
    <div className="flex flex-col gap-4">
      <button onClick={onClose} className="self-end text-gray-500">✕</button>
      <h2 className="text-black font-semibold">Email</h2>
      
      <input
        type="email"
        placeholder="Email"
        className="border p-2 rounded text-black"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <h2 className="text-black font-semibold">Password</h2>
      <input
        type="password"
        placeholder="Password"
        className="border p-2 rounded text-black"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleLogin}
        className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
      >
        Sign in
      </button>
      <h2 className="text-center text-black underline">
        I forgot my password
      </h2>
    </div>
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Header />
          <main className="container mx-auto py-10">{children}</main>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
