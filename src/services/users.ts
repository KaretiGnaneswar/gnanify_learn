import api from './index'

export type ConnectionUser = {
  id: string
  name: string
  title: string
  avatarUrl: string
}

export const usersService = {
  async list(search?: string) {
    const params: Record<string, string> = {}
    if (search && search.trim()) params.search = search.trim()
    const res = await api.get<ConnectionUser[]>('/connections/users/', { params })
    return res.data
  },
}
