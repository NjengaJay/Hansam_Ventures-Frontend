"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { login as apiLogin, refreshToken } from "@/lib/api"

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = localStorage.getItem("accessToken")
      const refreshTokenValue = localStorage.getItem("refreshToken")

      if (!accessToken || !refreshTokenValue) {
        setIsAuthenticated(false)
        setIsLoading(false)
        return
      }

      try {
        // Check if token is expired and refresh if needed
        const tokenData = JSON.parse(atob(accessToken.split(".")[1]))
        const expiryTime = tokenData.exp * 1000 // Convert to milliseconds

        if (Date.now() >= expiryTime) {
          // Token is expired, try to refresh
          const newTokens = await refreshToken(refreshTokenValue)
          localStorage.setItem("accessToken", newTokens.access)
          localStorage.setItem("refreshToken", newTokens.refresh)
          setIsAuthenticated(true)
        } else {
          // Token is still valid
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error("Auth error:", error)
        // If refresh fails, log the user out
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (username: string, password: string) => {
    try {
      const tokens = await apiLogin(username, password)
      localStorage.setItem("accessToken", tokens.access)
      localStorage.setItem("refreshToken", tokens.refresh)
      setIsAuthenticated(true)
      return tokens
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    setIsAuthenticated(false)
  }

  return <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
