"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Menu, X, Home, Building, LogIn, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { isAuthenticated, logout } = useAuth()

  const isActive = (path: string) => pathname === path

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Building className="h-8 w-8 text-rose-600 mr-2" />
              <span className="font-bold text-xl text-gray-800">Hansam Ventures</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-4">
            <Link
              href="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/") ? "text-rose-600 bg-rose-50" : "text-gray-700 hover:text-rose-600 hover:bg-gray-50"
              }`}
            >
              Home
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  href="/admin/dashboard"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive("/admin/dashboard")
                      ? "text-rose-600 bg-rose-50"
                      : "text-gray-700 hover:text-rose-600 hover:bg-gray-50"
                  }`}
                >
                  Dashboard
                </Link>
                <Button variant="ghost" onClick={logout} className="text-gray-700 hover:text-rose-600 hover:bg-gray-50">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/admin/login">
                <Button variant="ghost" className="text-gray-700 hover:text-rose-600 hover:bg-gray-50">
                  <LogIn className="h-4 w-4 mr-2" />
                  Admin
                </Button>
              </Link>
            )}
          </nav>

          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-rose-600 hover:bg-gray-50 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
            <Link
              href="/"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive("/") ? "text-rose-600 bg-rose-50" : "text-gray-700 hover:text-rose-600 hover:bg-gray-50"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center">
                <Home className="h-4 w-4 mr-2" />
                Home
              </div>
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  href="/admin/dashboard"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive("/admin/dashboard")
                      ? "text-rose-600 bg-rose-50"
                      : "text-gray-700 hover:text-rose-600 hover:bg-gray-50"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <Building className="h-4 w-4 mr-2" />
                    Dashboard
                  </div>
                </Link>
                <button
                  onClick={() => {
                    logout()
                    setIsMenuOpen(false)
                  }}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-rose-600 hover:bg-gray-50"
                >
                  <div className="flex items-center">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </div>
                </button>
              </>
            ) : (
              <Link
                href="/admin/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-rose-600 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center">
                  <LogIn className="h-4 w-4 mr-2" />
                  Admin
                </div>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
