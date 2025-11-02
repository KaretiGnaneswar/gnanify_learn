import { useEffect, useState } from 'react'
import { FiTrendingUp, FiUsers, FiActivity } from 'react-icons/fi'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import StatCard from '../components/admin/StatCard'
import ChartCard from '../components/admin/ChartCard'
import { analyticsService } from '../services/analytics'

type AnalyticsData = {
  userGrowth: Array<{ name: string; users: number }>
  contentStats: Array<{ name: string; value: number }>
  engagement: Array<{ name: string; value: number }>
  revenue: Array<{ name: string; revenue: number }>
}

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData>({
    userGrowth: [],
    contentStats: [],
    engagement: [],
    revenue: []
  })
  const [loading, setLoading] = useState(true)
  const [totals, setTotals] = useState<{ users: number; courses: number; blogs: number; problems?: number }>({ users: 0, courses: 0, blogs: 0 })

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const stats = await analyticsService.getStats()
      setTotals({
        users: stats.totals.users,
        courses: stats.totals.courses,
        blogs: stats.totals.blogs,
        problems: stats.totals.problems,
      })
      setData({
        userGrowth: stats.user_growth,
        contentStats: stats.content_stats,
        engagement: stats.engagement,
        revenue: stats.revenue,
      })
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B']

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600">Platform performance and user engagement metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={totals.users} subtitle="Real-time count" icon={<FiUsers className="h-8 w-8" />} colorClass="text-blue-600" />
        <StatCard title="Active Users" value={0} subtitle="TBD" icon={<FiActivity className="h-8 w-8" />} colorClass="text-green-600" />
        <StatCard title="Course Completions" value={0} subtitle="TBD" icon={<FiTrendingUp className="h-8 w-8" />} colorClass="text-purple-600" />
        <StatCard title="Revenue" value={'₹0'} subtitle="TBD" icon={<FiTrendingUp className="h-8 w-8" />} colorClass="text-orange-600" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth */}
        <ChartCard title="User Growth">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.userGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Content Distribution */}
        <ChartCard title="Content Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.contentStats}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.contentStats.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Weekly Engagement */}
        <ChartCard title="Weekly Engagement">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.engagement}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Revenue Trend */}
        <ChartCard title="Revenue Trend">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.revenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
              <Line type="monotone" dataKey="revenue" stroke="#F59E0B" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Courses</h3>
          <div className="space-y-3">
            {[
              { name: 'React Fundamentals', students: 450, rating: 4.8 },
              { name: 'JavaScript Advanced', students: 320, rating: 4.7 },
              { name: 'Python Basics', students: 280, rating: 4.6 },
            ].map((course, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="font-medium text-gray-900">{course.name}</p>
                  <p className="text-sm text-gray-500">{course.students} students</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{course.rating} ⭐</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Contributors</h3>
          <div className="space-y-3">
            {[
              { name: 'John Doe', courses: 8, students: 1200 },
              { name: 'Jane Smith', courses: 6, students: 950 },
              { name: 'Mike Johnson', courses: 5, students: 800 },
            ].map((contributor, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="font-medium text-gray-900">{contributor.name}</p>
                  <p className="text-sm text-gray-500">{contributor.courses} courses</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{contributor.students} students</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
