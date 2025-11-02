import React from 'react'

interface Props {
  title: string
  value: string | number
  subtitle?: string
  icon?: React.ReactNode
  colorClass?: string
}

const StatCard: React.FC<Props> = ({ title, value, subtitle, icon, colorClass = 'text-blue-600' }) => {
  return (
    <div className="card">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className={`h-8 w-8 ${colorClass}`}>{icon}</div>
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      </div>
    </div>
  )
}

export default StatCard
