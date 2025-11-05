import api from './index'

export type Course = {
  id: number
  title: string
  description: string
  short_description?: string
  category: number
  category_name?: string
  created_by?: number
  created_by_name?: string
  status: 'draft' | 'published' | 'archived'
  enrollments_count?: number
  total_lessons?: number
  average_rating?: number
  total_ratings?: number
  created_at?: string
  updated_at?: string
}

export type Lesson = {
  id: number
  course: number
  title: string
  description?: string
  order?: number
  subtopics_count?: number
}

export const coursesService = {
  async list(params: Record<string, any> = {}) {
    const res = await api.get('/courses/courses/', { params })
    // Backend wraps as { success, data }
    return Array.isArray(res.data) ? res.data : res.data?.data || []
  },
  async listLessons(courseId: number) {
    const res = await api.get(`/courses/courses/${courseId}/lessons/`)
    return res.data as Lesson[]
  },
  async deleteLesson(lessonId: number) {
    await api.delete(`/courses/lessons/${lessonId}/`)
    return true
  },
  async deleteCourse(courseId: number) {
    await api.delete(`/courses/courses/${courseId}/`)
    return true
  },
}
