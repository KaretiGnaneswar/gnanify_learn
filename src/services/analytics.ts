import api from './index'

export type AdminStats = {
  totals: { users: number; courses: number; blogs: number; problems: number }
  user_growth: Array<{ name: string; users: number }>
  content_stats: Array<{ name: string; value: number }>
  engagement: Array<{ name: string; value: number }>
  revenue: Array<{ name: string; revenue: number }>
}

export const analyticsService = {
  async getStats() {
    const res = await api.get<AdminStats>('/auth/stats/')
    return res.data
  },
}
