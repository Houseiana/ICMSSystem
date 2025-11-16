'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const menuItems = [
  {
    icon: '📊',
    label: 'Dashboard',
    path: '/dashboard',
    description: 'Overview and statistics'
  },
  {
    icon: '👥',
    label: 'Employees',
    path: '/dashboard/employees',
    description: 'Manage employee records'
  },
  {
    icon: '🤝',
    label: 'Stakeholders',
    path: '/dashboard/stakeholders',
    description: 'Manage stakeholder relationships'
  },
  {
    icon: '🏢',
    label: 'Employers',
    path: '/dashboard/employers',
    description: 'Manage employer companies and contacts'
  },
  {
    icon: '🤝🏢',
    label: 'Contractors',
    path: '/dashboard/contractors',
    description: 'Manage contractors and service providers'
  },
  {
    icon: '🛠️👥',
    label: 'Task Helpers',
    path: '/dashboard/task-helpers',
    description: 'Manage task helpers and personal assistants'
  },
  {
    icon: '📄✈️',
    label: 'Visas',
    path: '/dashboard/visas',
    description: 'Manage visa applications and status'
  },
  {
    icon: '📘🆔',
    label: 'Passports',
    path: '/dashboard/passports',
    description: 'Manage passports and track locations'
  },
  {
    icon: '⚙️',
    label: 'Settings',
    path: '/dashboard/settings',
    description: 'System configuration'
  },
]

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleNavigation = (path: string) => {
    router.push(path)
    if (window.innerWidth < 1024) {
      onClose()
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full bg-white border-r border-gray-200 shadow-lg z-30
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:h-screen
        w-80
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">IC</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">ICMS</h1>
                  <p className="text-sm text-gray-500">HR Management</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="lg:hidden p-2 rounded-md hover:bg-gray-100"
              >
                <span className="text-gray-500">✕</span>
              </button>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = pathname === item.path
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`
                    w-full text-left p-4 rounded-lg transition-all duration-200
                    hover:bg-blue-50 hover:border-blue-200 border border-transparent
                    ${isActive
                      ? 'bg-blue-50 border-blue-200 text-blue-700'
                      : 'text-gray-700 hover:text-blue-600'
                    }
                    group
                  `}
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium ${isActive ? 'text-blue-700' : 'text-gray-900'}`}>
                        {item.label}
                      </p>
                      <p className={`text-sm ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                        {item.description}
                      </p>
                    </div>
                    {isActive && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-2"></div>
                    )}
                  </div>
                </button>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-medium">A</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
                <p className="text-xs text-gray-500">HR Administrator</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 p-3 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <span className="text-xl">🚪</span>
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}