interface StatsCardProps {
  title: string
  value: string | number
  icon: string
  trend?: {
    value: number
    isPositive: boolean
  }
  bgColor?: string
  textColor?: string
}

export default function StatsCard({
  title,
  value,
  icon,
  trend,
  bgColor = 'bg-white',
  textColor = 'text-gray-900'
}: StatsCardProps) {
  return (
    <div className={`${bgColor} rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <span
                className={`flex items-center text-sm font-medium ${
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {trend.isPositive ? '↗️' : '↘️'}
                {Math.abs(trend.value)}%
              </span>
              <span className="text-gray-500 text-sm ml-1">from last month</span>
            </div>
          )}
        </div>
        <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center">
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </div>
  )
}