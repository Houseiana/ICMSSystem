'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Building2,
  Wallet,
  Package,
  TrendingUp,
  CreditCard,
  CalendarCheck,
  DollarSign,
  RefreshCw,
  Car,
  Home,
  ArrowRight
} from 'lucide-react'

interface Summary {
  realEstate: { totalValue: number; totalProperties: number }
  salaries: { totalNet: number; totalRecords: number }
  assets: { totalValue: number; totalAssets: number }
  dividends: { totalNet: number; totalDividends: number }
  liabilities: { totalBalance: number; totalLiabilities: number }
  monthlyPayments: { totalMonthly: number; activePayments: number }
  cars: { totalValue: number; totalCars: number }
  carsUK: { totalValue: number; totalCars: number }
  propertiesUK: { totalValue: number; totalProperties: number }
}

const sections = [
  { id: 'real-estate', label: 'Real Estate', icon: Building2, href: '/finance/real-estate', color: 'blue', description: 'Manage properties and rental income' },
  { id: 'cars', label: 'Cars', icon: Car, href: '/finance/cars', color: 'cyan', description: 'Vehicle assets and maintenance' },
  { id: 'cars-uk', label: 'Cars UK', icon: Car, href: '/finance/cars-uk', color: 'teal', description: 'UK vehicle portfolio' },
  { id: 'properties-uk', label: 'Properties UK', icon: Home, href: '/finance/properties-uk', color: 'sky', description: 'UK real estate investments' },
  { id: 'salaries', label: 'Salaries', icon: Wallet, href: '/finance/salaries', color: 'green', description: 'Employee compensation records' },
  { id: 'assets', label: 'Assets', icon: Package, href: '/finance/assets', color: 'purple', description: 'Valuable items and investments' },
  { id: 'dividends', label: 'Dividends', icon: TrendingUp, href: '/finance/dividends', color: 'orange', description: 'Investment returns and distributions' },
  { id: 'liabilities', label: 'Liabilities', icon: CreditCard, href: '/finance/liabilities', color: 'red', description: 'Loans and debts' },
  { id: 'monthly-payments', label: 'Monthly Payments', icon: CalendarCheck, href: '/finance/monthly-payments', color: 'indigo', description: 'Recurring expenses' }
]

export default function FinanceDashboard() {
  const [summary, setSummary] = useState<Summary>({
    realEstate: { totalValue: 0, totalProperties: 0 },
    salaries: { totalNet: 0, totalRecords: 0 },
    assets: { totalValue: 0, totalAssets: 0 },
    dividends: { totalNet: 0, totalDividends: 0 },
    liabilities: { totalBalance: 0, totalLiabilities: 0 },
    monthlyPayments: { totalMonthly: 0, activePayments: 0 },
    cars: { totalValue: 0, totalCars: 0 },
    carsUK: { totalValue: 0, totalCars: 0 },
    propertiesUK: { totalValue: 0, totalProperties: 0 }
  })
  const [loading, setLoading] = useState(true)

  const fetchSummary = async () => {
    setLoading(true)
    try {
      const [realEstate, salaries, assets, dividends, liabilities, monthlyPayments, cars, carsUK, propertiesUK] = await Promise.all([
        fetch('/api/finance/real-estate').then(r => r.json()),
        fetch('/api/finance/salaries').then(r => r.json()),
        fetch('/api/finance/assets').then(r => r.json()),
        fetch('/api/finance/dividends').then(r => r.json()),
        fetch('/api/finance/liabilities').then(r => r.json()),
        fetch('/api/finance/monthly-payments').then(r => r.json()),
        fetch('/api/finance/cars').then(r => r.json()),
        fetch('/api/finance/cars-uk').then(r => r.json()),
        fetch('/api/finance/properties-uk').then(r => r.json())
      ])

      setSummary({
        realEstate: {
          totalValue: realEstate.summary?.totalValue || 0,
          totalProperties: realEstate.summary?.totalProperties || 0
        },
        salaries: {
          totalNet: salaries.summary?.totalNetSalary || 0,
          totalRecords: salaries.summary?.totalRecords || 0
        },
        assets: {
          totalValue: assets.summary?.totalCurrentValue || 0,
          totalAssets: assets.summary?.totalAssets || 0
        },
        dividends: {
          totalNet: dividends.summary?.totalNetAmount || 0,
          totalDividends: dividends.summary?.totalDividends || 0
        },
        liabilities: {
          totalBalance: liabilities.summary?.totalCurrentBalance || 0,
          totalLiabilities: liabilities.summary?.totalLiabilities || 0
        },
        monthlyPayments: {
          totalMonthly: monthlyPayments.summary?.totalActiveMonthly || 0,
          activePayments: monthlyPayments.summary?.activePayments || 0
        },
        cars: {
          totalValue: cars.summary?.totalValue || 0,
          totalCars: cars.summary?.totalCars || 0
        },
        carsUK: {
          totalValue: carsUK.summary?.totalValue || 0,
          totalCars: carsUK.summary?.totalCars || 0
        },
        propertiesUK: {
          totalValue: propertiesUK.summary?.totalValue || 0,
          totalProperties: propertiesUK.summary?.totalProperties || 0
        }
      })
    } catch (error) {
      console.error('Error fetching summary:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSummary()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getSectionData = (id: string) => {
    switch (id) {
      case 'real-estate':
        return { value: summary.realEstate.totalValue, count: summary.realEstate.totalProperties }
      case 'cars':
        return { value: summary.cars.totalValue, count: summary.cars.totalCars }
      case 'cars-uk':
        return { value: summary.carsUK.totalValue, count: summary.carsUK.totalCars }
      case 'properties-uk':
        return { value: summary.propertiesUK.totalValue, count: summary.propertiesUK.totalProperties }
      case 'salaries':
        return { value: summary.salaries.totalNet, count: summary.salaries.totalRecords }
      case 'assets':
        return { value: summary.assets.totalValue, count: summary.assets.totalAssets }
      case 'dividends':
        return { value: summary.dividends.totalNet, count: summary.dividends.totalDividends }
      case 'liabilities':
        return { value: summary.liabilities.totalBalance, count: summary.liabilities.totalLiabilities }
      case 'monthly-payments':
        return { value: summary.monthlyPayments.totalMonthly, count: summary.monthlyPayments.activePayments }
      default:
        return { value: 0, count: 0 }
    }
  }

  const totalNetWorth =
    summary.realEstate.totalValue +
    summary.assets.totalValue +
    summary.dividends.totalNet +
    summary.cars.totalValue +
    summary.carsUK.totalValue +
    summary.propertiesUK.totalValue -
    summary.liabilities.totalBalance

  const colorClasses: Record<string, { bg: string; text: string; border: string; hover: string; iconBg: string }> = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', hover: 'hover:border-blue-400', iconBg: 'bg-blue-100' },
    cyan: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200', hover: 'hover:border-cyan-400', iconBg: 'bg-cyan-100' },
    teal: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200', hover: 'hover:border-teal-400', iconBg: 'bg-teal-100' },
    sky: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200', hover: 'hover:border-sky-400', iconBg: 'bg-sky-100' },
    green: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', hover: 'hover:border-green-400', iconBg: 'bg-green-100' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', hover: 'hover:border-purple-400', iconBg: 'bg-purple-100' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', hover: 'hover:border-orange-400', iconBg: 'bg-orange-100' },
    red: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', hover: 'hover:border-red-400', iconBg: 'bg-red-100' },
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', hover: 'hover:border-indigo-400', iconBg: 'bg-indigo-100' }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-green-600" />
              Finance Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Overview of your financial portfolio
            </p>
          </div>
          <button
            onClick={fetchSummary}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Net Worth Card */}
        <div className="mt-6 p-6 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl text-white shadow-lg">
          <p className="text-green-100 text-sm font-medium">Estimated Net Worth</p>
          <p className="text-4xl font-bold mt-1">{formatCurrency(totalNetWorth)}</p>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-green-200">Real Estate</p>
              <p className="font-semibold">{formatCurrency(summary.realEstate.totalValue)}</p>
            </div>
            <div>
              <p className="text-green-200">Assets</p>
              <p className="font-semibold">{formatCurrency(summary.assets.totalValue)}</p>
            </div>
            <div>
              <p className="text-green-200">Dividends YTD</p>
              <p className="font-semibold">{formatCurrency(summary.dividends.totalNet)}</p>
            </div>
            <div>
              <p className="text-green-200">Liabilities</p>
              <p className="font-semibold text-red-200">-{formatCurrency(summary.liabilities.totalBalance)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Section Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => {
          const data = getSectionData(section.id)
          const colors = colorClasses[section.color]

          return (
            <Link
              key={section.id}
              href={section.href}
              className={`group block p-6 rounded-xl border-2 ${colors.border} ${colors.hover} ${colors.bg} transition-all hover:shadow-md`}
            >
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-lg ${colors.iconBg}`}>
                  <section.icon className={`w-6 h-6 ${colors.text}`} />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className={`mt-4 text-lg font-semibold ${colors.text}`}>{section.label}</h3>
              <p className="text-sm text-gray-500 mt-1">{section.description}</p>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.value)}</p>
                <p className="text-sm text-gray-500">{data.count} records</p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
