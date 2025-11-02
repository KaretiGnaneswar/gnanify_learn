import React from 'react'

interface Props {
  title: string
  children: React.ReactNode
}

const ChartCard: React.FC<Props> = ({ title, children }) => {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  )
}

export default ChartCard
