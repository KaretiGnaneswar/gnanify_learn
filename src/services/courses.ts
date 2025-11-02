import api from './index'

export type Course = any // Replace with actual type once backend schema is finalized

export const coursesService = {
  async list() {
    const res = await api.get<Course[]>('/courses/courses/')
    return res.data
  },
}
