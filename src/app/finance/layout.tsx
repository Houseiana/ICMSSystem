'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  Building2,
  Wallet,
  Package,
  TrendingUp,
  CreditCard,
  CalendarCheck,
  DollarSign,
  Car,
  Home,
  LogOut,
  User,
  ChevronLeft,
  Menu,
  X
} from 'lucide-react'

interface AuthUser {
  username: string
  email: string
  role: string
  accessLevel: 'full' | 'finance'
}

const navItems = [
  { id: 'real-estate', label: 'Real Estate', icon: Building2, href: '/finance/real-estate', color: 'blue' },
  { id: 'cars', label: 'Cars', icon: Car, href: '/finance/cars', color: 'cyan' },
  { id: 'cars-uk', label: 'Cars UK', icon: Car, href: '/finance/cars-uk', color: 'teal' },
  { id: 'properties-uk', label: 'Properties UK', icon: Home, href: '/finance/properties-uk', color: 'sky' },
  { id: 'salaries', label: 'Salaries', icon: Wallet, href: '/finance/salaries', color: 'green' },
  { id: 'assets', label: 'Assets', icon: Package, href: '/finance/assets', color: 'purple' },
  { id: 'dividends', label: 'Dividends', icon: TrendingUp, href: '/finance/dividends', color: 'orange' },
  { id: 'liabilities', label: 'Liabilities', icon: CreditCard, href: '/finance/liabilities', color: 'red' },
  { id: 'monthly-payments', label: 'Monthly Payments', icon: CalendarCheck, href: '/finance/monthly-payments', color: 'indigo' }
]

export default function FinanceLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [authChecking, setAuthChecking] = useState(true)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Skip auth check for login page
  const isLoginPage = pathname === '/finance/login'

  useEffect(() => {
    if (isLoginPage) {
      setAuthChecking(false)
      return
    }

    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check-finance')
        const data = await response.json()

        if (!data.authenticated) {
          router.push('/finance/login')
          return
        }

        setUser(data.user)
        setAuthChecking(false)
      } catch (error) {
        console.error('Auth check error:', error)
        router.push('/finance/login')
      }
    }

    checkAuth()
  }, [router, isLoginPage])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/finance-logout', { method: 'POST' })
      router.push('/finance/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // Show loading while checking auth (except for login page)
  if (authChecking && !isLoginPage) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Finance Portal...</p>
        </div>
      </div>
    )
  }

  // Render login page without sidebar
  if (isLoginPage) {
    return <>{children}</>
  }

  const isMainPage = pathname === '/finance'
  const currentSection = navItems.find(item => pathname.startsWith(item.href))

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b">
            <Link href="/finance" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-gray-900">Finance</h1>
                <p className="text-xs text-gray-500">Management Portal</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href)
              const colorClasses: Record<string, string> = {
                blue: 'bg-blue-50 text-blue-700 border-blue-200',
                cyan: 'bg-cyan-50 text-cyan-700 border-cyan-200',
                teal: 'bg-teal-50 text-teal-700 border-teal-200',
                sky: 'bg-sky-50 text-sky-700 border-sky-200',
                green: 'bg-green-50 text-green-700 border-green-200',
                purple: 'bg-purple-50 text-purple-700 border-purple-200',
                orange: 'bg-orange-50 text-orange-700 border-orange-200',
                red: 'bg-red-50 text-red-700 border-red-200',
                indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200'
              }

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? colorClasses[item.color]
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t">
            {user && (
              <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 rounded-lg mb-3">
                <User className="w-4 h-4 text-emerald-600" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-emerald-700 truncate">{user.username}</p>
                  <p className="text-xs text-emerald-600">
                    {user.accessLevel === 'full' ? 'Admin' : 'Finance Manager'}
                  </p>
                </div>
              </div>
            )}
            {user?.accessLevel === 'finance' && (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 min-h-screen">
        {/* Page Header for section pages */}
        {!isMainPage && currentSection && (
          <div className="bg-white border-b px-6 py-4">
            <div className="flex items-center gap-4">
              <Link
                href="/finance"
                className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="text-sm">Back</span>
              </Link>
              <div className="h-6 w-px bg-gray-200" />
              <div className="flex items-center gap-2">
                <currentSection.icon className="w-5 h-5 text-gray-600" />
                <h1 className="text-lg font-semibold text-gray-900">{currentSection.label}</h1>
              </div>
            </div>
          </div>
        )}

        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
