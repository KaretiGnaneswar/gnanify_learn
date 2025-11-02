import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import CourseEditor from './CourseEditor';
import UserManager from './UserManager';
import AnalyticsDashboard from './AnalyticsDashboard';
import SystemSettings from './SystemSettings';

const AdminCourseManager = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showCourseEditor, setShowCourseEditor] = useState(false);
  const [showUserManager, setShowUserManager] = useState(false);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalUsers: 0,
    totalEnrollments: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchCourses(),
        fetchUsers(),
        fetchCategories(),
        fetchStats()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleCreateCourse = async (courseData) => {
    try {
      const response = await fetch('/api/courses/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(courseData),
      });
      
      if (response.ok) {
        const newCourse = await response.json();
        setCourses(prev => [...prev, newCourse]);
        setShowCourseEditor(false);
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, error: error.error };
      }
    } catch (error) {
      return { success: false, error: 'Failed to create course' };
    }
  };

  const handleUpdateCourse = async (courseId, courseData) => {
    try {
      const response = await fetch(`/api/courses/${courseId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(courseData),
      });
      
      if (response.ok) {
        const updatedCourse = await response.json();
        setCourses(prev => prev.map(course => 
          course.id === courseId ? updatedCourse : course
        ));
        setShowCourseEditor(false);
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, error: error.error };
      }
    } catch (error) {
      return { success: false, error: 'Failed to update course' };
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!confirm('Are you sure you want to delete this course?')) {
      return;
    }

    try {
      const response = await fetch(`/api/courses/${courseId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (response.ok) {
        setCourses(prev => prev.filter(course => course.id !== courseId));
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, error: error.error };
      }
    } catch (error) {
      return { success: false, error: 'Failed to delete course' };
    }
  };

  const handleApproveContributor = async (userId) => {
    try {
      const response = await fetch(`/api/users/${userId}/approve-contributor/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (response.ok) {
        fetchUsers();
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, error: error.error };
      }
    } catch (error) {
      return { success: false, error: 'Failed to approve contributor' };
    }
  };

  const handleBanUser = async (userId) => {
    if (!confirm('Are you sure you want to ban this user?')) {
      return;
    }

    try {
      const response = await fetch(`/api/users/${userId}/ban/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (response.ok) {
        fetchUsers();
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, error: error.error };
      }
    } catch (error) {
      return { success: false, error: 'Failed to ban user' };
    }
  };

  const handleCreateCategory = async (categoryData) => {
    try {
      const response = await fetch('/api/categories/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(categoryData),
      });
      
      if (response.ok) {
        const newCategory = await response.json();
        setCategories(prev => [...prev, newCategory]);
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, error: error.error };
      }
    } catch (error) {
      return { success: false, error: 'Failed to create category' };
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-gray-400">Manage the entire platform</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-gray-900/50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Navigation</h3>
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                  activeTab === 'dashboard'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('courses')}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                  activeTab === 'courses'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                All Courses
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                  activeTab === 'users'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                User Management
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                  activeTab === 'analytics'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                Analytics
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                  activeTab === 'settings'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                System Settings
              </button>
            </nav>
          </div>

          {/* Quick Stats */}
          <div className="bg-gray-900/50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Platform Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">Total Courses</span>
                <span className="text-white font-semibold">{stats.totalCourses}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Total Users</span>
                <span className="text-white font-semibold">{stats.totalUsers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Total Enrollments</span>
                <span className="text-white font-semibold">{stats.totalEnrollments}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Total Revenue</span>
                <span className="text-green-400 font-semibold">${stats.totalRevenue}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Total Courses</h3>
                  <p className="text-3xl font-bold text-blue-400">{stats.totalCourses}</p>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Total Users</h3>
                  <p className="text-3xl font-bold text-green-400">{stats.totalUsers}</p>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Enrollments</h3>
                  <p className="text-3xl font-bold text-yellow-400">{stats.totalEnrollments}</p>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Revenue</h3>
                  <p className="text-3xl font-bold text-purple-400">${stats.totalRevenue}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-900/50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Recent Courses</h3>
                  <div className="space-y-3">
                    {courses.slice(0, 5).map((course) => (
                      <div key={course.id} className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                        <div>
                          <div className="text-white font-semibold">{course.title}</div>
                          <div className="text-gray-400 text-sm">By {course.created_by_name}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            course.status === 'published' ? 'bg-green-600' : 'bg-yellow-600'
                          }`}>
                            {course.status}
                          </span>
                          <span className="text-gray-400 text-sm">{course.enrollments_count} students</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-900/50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Recent Users</h3>
                  <div className="space-y-3">
                    {users.slice(0, 5).map((user) => (
                      <div key={user.id} className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                        <div>
                          <div className="text-white font-semibold">{user.name}</div>
                          <div className="text-gray-400 text-sm">{user.email}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            user.role === 'admin' ? 'bg-red-600' : 
                            user.role === 'contributor' ? 'bg-blue-600' : 'bg-green-600'
                          }`}>
                            {user.role}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'courses' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-white">All Courses</h2>
                <button
                  onClick={() => setShowCourseEditor(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Create Course
                </button>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="text-gray-400 mt-2">Loading courses...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map((course) => (
                    <div key={course.id} className="bg-gray-900/50 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-2">{course.title}</h3>
                          <p className="text-gray-300 text-sm mb-2">{course.short_description}</p>
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-1 rounded text-xs ${
                              course.status === 'published' ? 'bg-green-600' : 'bg-yellow-600'
                            }`}>
                              {course.status}
                            </span>
                            <span className="text-gray-400 text-sm">{course.difficulty}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedCourse(course);
                              setShowCourseEditor(true);
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteCourse(course.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-sm text-gray-400">
                        <div className="flex gap-4">
                          <span>👥 {course.enrollments_count} students</span>
                          <span>⭐ {course.average_rating} ({course.total_ratings})</span>
                          <span>📚 {course.total_lessons} lessons</span>
                        </div>
                        <div className="text-gray-300">
                          By {course.created_by_name}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'users' && (
            <UserManager
              users={users}
              onApproveContributor={handleApproveContributor}
              onBanUser={handleBanUser}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsDashboard
              courses={courses}
              users={users}
              stats={stats}
            />
          )}

          {activeTab === 'settings' && (
            <SystemSettings
              categories={categories}
              onCreateCategory={handleCreateCategory}
            />
          )}
        </div>
      </div>

      {/* Course Editor Modal */}
      {showCourseEditor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-white">
                  {selectedCourse ? 'Edit Course' : 'Create New Course'}
                </h2>
                <button
                  onClick={() => {
                    setShowCourseEditor(false);
                    setSelectedCourse(null);
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              
              <CourseEditor
                course={selectedCourse}
                categories={categories}
                onSave={selectedCourse ? 
                  (data) => handleUpdateCourse(selectedCourse.id, data) :
                  handleCreateCourse
                }
                onCancel={() => {
                  setShowCourseEditor(false);
                  setSelectedCourse(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCourseManager;
