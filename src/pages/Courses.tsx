import { useEffect, useState } from 'react'
import { FiSearch, FiMoreVertical, FiEdit, FiTrash2, FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { coursesService, type Course, type Lesson } from '../services/courses'

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | Course['status']>('all')
  const [expanded, setExpanded] = useState<number | null>(null)
  const [lessonsByCourse, setLessonsByCourse] = useState<Record<number, Lesson[]>>({})

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const data = await coursesService.list()
      setCourses(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteCourse = async (courseId: number) => {
    if (!confirm('Delete this course? This cannot be undone.')) return
    try {
      await coursesService.deleteCourse(courseId)
      setCourses((cs) => cs.filter(c => c.id !== courseId))
      if (expanded === courseId) setExpanded(null)
    } catch (e) {
      console.error('Error deleting course:', e)
      alert('Failed to delete course')
    }
  }

  const toggleExpand = async (courseId: number) => {
    if (expanded === courseId) {
      setExpanded(null)
      return
    }
    setExpanded(courseId)
    if (!lessonsByCourse[courseId]) {
      try {
        const lessons = await coursesService.listLessons(courseId)
        setLessonsByCourse((m) => ({ ...m, [courseId]: lessons }))
      } catch (e) {
        console.error('Failed to load lessons', e)
      }
    }
  }

  const filteredCourses = courses.filter(course => {
    const matchesSearch = (course.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (course.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (course.created_by_name || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || course.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const updateCourseStatus = async (_courseId: number, _newStatus: Course['status']) => {
    // Optional: wire to backend if admin publish API exists
  }

  const deleteLesson = async (courseId: number, lessonId: number) => {
    if (!confirm('Delete this lesson?')) return
    try {
      await coursesService.deleteLesson(lessonId)
      setLessonsByCourse((m) => ({
        ...m,
        [courseId]: (m[courseId] || []).filter(l => l.id !== lessonId)
      }))
      // reflect count locally
      setCourses((cs) => cs.map(c => c.id === courseId ? { ...c, total_lessons: (c.total_lessons || 1) - 1 } : c))
    } catch (e) {
      console.error('Error deleting lesson:', e)
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
              <option value="archived">Archived</option>
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
                course.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                'bg-yellow-100 text-yellow-800'
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
              <span>By {course.created_by_name || 'Unknown'}</span>
              <span>{course.enrollments_count || 0} students</span>
            </div>

            <div className="flex items-center text-sm text-gray-600 mb-4">
              <span className="text-yellow-500">★</span>
              <span className="ml-1">{course.average_rating || 0}</span>
              <span className="ml-2 text-gray-400">({course.total_ratings || 0})</span>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 btn-secondary text-sm" onClick={() => toggleExpand(course.id)}>
                {expanded === course.id ? <FiChevronUp className="inline w-4 h-4 mr-1" /> : <FiChevronDown className="inline w-4 h-4 mr-1" />}
                Lessons ({course.total_lessons || 0})
              </button>
              <button className="flex-1 btn-secondary text-sm" disabled>
                <FiEdit className="inline w-4 h-4 mr-1" />
                Edit
              </button>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Created: {course.created_at ? new Date(course.created_at).toLocaleDateString() : '-'}</span>
                <span>Updated: {course.updated_at ? new Date(course.updated_at).toLocaleDateString() : '-'}</span>
              </div>
              {expanded === course.id && (
                <div className="mt-3 space-y-2">
                  {(lessonsByCourse[course.id] || []).length === 0 && (
                    <div className="text-sm text-gray-500">No lessons</div>
                  )}
                  {(lessonsByCourse[course.id] || []).map((lesson) => (
                    <div key={lesson.id} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                      <div className="text-sm text-gray-800">
                        <span className="font-medium">{lesson.title}</span>
                        <span className="ml-2 text-gray-500">(subtopics: {lesson.subtopics_count || 0})</span>
                      </div>
                      <button
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        onClick={() => deleteLesson(course.id, lesson.id)}
                        title="Delete lesson"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-3 flex justify-end">
                <button
                  className="btn-secondary text-sm text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => deleteCourse(course.id)}
                >
                  <FiTrash2 className="inline w-4 h-4 mr-1" />
                  Delete Course
                </button>
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
