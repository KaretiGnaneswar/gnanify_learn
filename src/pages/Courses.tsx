import { useEffect, useState } from 'react'
import { FiSearch, FiFilter, FiMoreVertical, FiEdit, FiTrash2, FiEye, FiCheck, FiX } from 'react-icons/fi'

type Course = {
  id: string
  title: string
  description: string
  author: string
  status: 'draft' | 'published' | 'review'
  createdAt: string
  updatedAt: string
  students: number
  rating: number
}

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published' | 'review'>('all')

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      // Mock data for now - replace with actual API calls
      setCourses([
        {
          id: '1',
          title: 'React Fundamentals',
          description: 'Learn the basics of React development',
          author: 'John Doe',
          status: 'published',
          createdAt: '2024-01-15',
          updatedAt: '2024-01-20',
          students: 150,
          rating: 4.8
        },
        {
          id: '2',
          title: 'Advanced JavaScript',
          description: 'Deep dive into advanced JavaScript concepts',
          author: 'Jane Smith',
          status: 'review',
          createdAt: '2024-01-18',
          updatedAt: '2024-01-20',
          students: 0,
          rating: 0
        }
      ])
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || course.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const updateCourseStatus = async (courseId: string, newStatus: 'draft' | 'published' | 'review') => {
    try {
      // API call to update course status
      setCourses(courses.map(course => 
        course.id === courseId ? { ...course, status: newStatus } : course
      ))
    } catch (error) {
      console.error('Error updating course status:', error)
    }
  }

  const deleteCourse = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return
    
    try {
      // API call to delete course
      setCourses(courses.filter(course => course.id !== courseId))
    } catch (error) {
      console.error('Error deleting course:', error)
    }
  }

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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
          <p className="text-gray-600">Manage platform courses and content</p>
        </div>
        <div className="text-sm text-gray-500">
          Total: {courses.length} courses
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search courses"
                className="input-field pl-10"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className="input-field"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="review">Under Review</option>
            </select>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div key={course.id} className="card hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                course.status === 'published' ? 'bg-green-100 text-green-800' :
                course.status === 'review' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {course.status}
              </span>
              <div className="relative">
                <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors">
                  <FiMoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {course.title}
            </h3>
            
            <p className="text-sm text-gray-600 mb-4 line-clamp-3">
              {course.description}
            </p>

            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <span>By {course.author}</span>
              <span>{course.students} students</span>
            </div>

            {course.rating > 0 && (
              <div className="flex items-center text-sm text-gray-600 mb-4">
                <span className="text-yellow-500">★</span>
                <span className="ml-1">{course.rating}</span>
              </div>
            )}

            <div className="flex gap-2">
              <button className="flex-1 btn-secondary text-sm">
                <FiEye className="inline w-4 h-4 mr-1" />
                View
              </button>
              <button className="flex-1 btn-secondary text-sm">
                <FiEdit className="inline w-4 h-4 mr-1" />
                Edit
              </button>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Created: {new Date(course.createdAt).toLocaleDateString()}</span>
                <span>Updated: {new Date(course.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No courses found matching your criteria
        </div>
      )}
    </div>
  )
}
