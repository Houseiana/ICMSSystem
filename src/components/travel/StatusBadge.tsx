import { TravelRequestStatus } from '@/types/travel'

interface StatusBadgeProps {
  status: TravelRequestStatus
  className?: string
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const styles: Record<TravelRequestStatus, string> = {
    REQUEST: 'bg-blue-100 text-blue-800 border-blue-200',
    PLANNING: 'bg-purple-100 text-purple-800 border-purple-200',
    CONFIRMING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    EXECUTING: 'bg-orange-100 text-orange-800 border-orange-200',
    COMPLETED: 'bg-green-100 text-green-800 border-green-200',
    CANCELLED: 'bg-red-100 text-red-800 border-red-200',
  }

  const icons: Record<TravelRequestStatus, string> = {
    REQUEST: '📝',
    PLANNING: '📋',
    CONFIRMING: '✓',
    EXECUTING: '✈️',
    COMPLETED: '✅',
    CANCELLED: '❌',
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${styles[status]} ${className}`}
    >
      <span>{icons[status]}</span>
      <span>{status}</span>
    </span>
  )
}
