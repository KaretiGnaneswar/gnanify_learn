import api from './index'

export const adminService = {
  async promoteToContributor(userId: string | number) {
    const res = await api.post(`/auth/promote-contributor/${userId}/`)
    return res.data
  },
  async blockUser(userId: string | number) {
    const res = await api.post(`/auth/users/${userId}/block/`)
    return res.data
  },
  async unblockUser(userId: string | number) {
    const res = await api.post(`/auth/users/${userId}/unblock/`)
    return res.data
  },
  async getUserDetail(userId: string | number) {
    const res = await api.get(`/auth/users/${userId}/`)
    return res.data
  },
}
