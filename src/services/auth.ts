import api from './index'

export type LoginResponse = {
  message: string
  token: string
}

export const authService = {
  async login(email: string, password: string) {
    const res = await api.post<LoginResponse>('/auth/login/', { email, password })
    return res.data
  },

  async profile() {
    const res = await api.get('/auth/profile/')
    return res.data
  },
}
