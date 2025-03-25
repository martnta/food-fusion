"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (token: string, user: User) => void
  logout: () => void
  updateUser: (user: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token")
    const storedUser = localStorage.getItem("auth_user")

    if (storedToken && storedUser) {
      try {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Failed to parse stored user:", error)
        // Clear invalid storage
        localStorage.removeItem("auth_token")
        localStorage.removeItem("auth_user")
      }
    }

    setIsLoading(false)
  }, [])

  // Login function
  const login = (newToken: string, newUser: User) => {
    // Store in state
    setToken(newToken)
    setUser(newUser)

    // Persist to localStorage
    localStorage.setItem("auth_token", newToken)
    localStorage.setItem("auth_user", JSON.stringify(newUser))
  }

  // Logout function
  const logout = () => {
    // Clear state
    setToken(null)
    setUser(null)

    // Clear localStorage
    localStorage.removeItem("auth_token")
    localStorage.removeItem("auth_user")
  }

  // Update user information
  const updateUser = (updatedUserData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updatedUserData }
      setUser(updatedUser)
      localStorage.setItem("auth_user", JSON.stringify(updatedUser))
    }
  }

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token && !!user,
    login,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

