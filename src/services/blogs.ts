import api from './index'

export type BlogStatus = 'draft' | 'published' | 'review'

export interface Blog {
  id: string | number
  title: string
  content: string
  author: {
    id: string | number
    name: string
    email: string
  }
  status: BlogStatus
  created_at: string
  updated_at: string
  views: number
  likes: number
  tags?: string[]
  featured_image?: string
}

export interface BlogFormData {
  title: string
  content: string
  status: BlogStatus
  tags?: string[]
  featured_image?: File | string | null
}

export const blogsService = {
  async list(): Promise<Blog[]> {
    try {
      const res = await api.get('/blogs/')
      const data = res.data
      if (Array.isArray(data)) return data
      if (data && Array.isArray(data.results)) return data.results
      return []
    } catch (error) {
      console.error('Error fetching blogs:', error)
      throw error
    }
  },

  async get(id: string | number): Promise<Blog> {
    const res = await api.get(`/blogs/${id}/`)
    return res.data
  },

  async create(data: FormData): Promise<Blog> {
    const res = await api.post('/blogs/', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return res.data
  },

  async update(id: string | number, data: Partial<BlogFormData> | FormData): Promise<Blog> {
    const isFormData = data instanceof FormData
    const res = await api.patch(
      `/blogs/${id}/`,
      isFormData ? data : { ...data },
      isFormData ? {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      } : {}
    )
    return res.data
  },

  async remove(id: string | number): Promise<void> {
    await api.delete(`/blogs/${id}/`)
  },

  async count(): Promise<number> {
    const res = await api.get('/blogs/')
    const data = res.data
    if (Array.isArray(data)) return data.length
    if (typeof data?.count === 'number') return data.count
    return 0
  },
}
