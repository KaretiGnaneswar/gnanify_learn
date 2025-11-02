import { useEffect, useState } from 'react';
import { FiSearch, FiEye, FiEdit, FiPlus, FiX, FiTrash2 } from 'react-icons/fi';
import { Blog, blogsService, BlogStatus } from '../services/blogs';

interface BlogCardProps {
  blog: Blog;
  onEdit: (blog: Blog) => void;
  onView: (blog: Blog) => void;
  onDelete: (id: string | number) => void;
  isAdmin?: boolean;
  currentUserId?: string | number | null;
}

const BlogCard: React.FC<BlogCardProps> = ({ 
  blog, 
  onEdit, 
  onView, 
  onDelete,
  isAdmin = false,
  currentUserId = null
}) => {
  const canDelete = isAdmin || blog.author?.id === currentUserId;

  return (
    <div className="card hover:shadow-md transition-shadow h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {blog.title}
        </h3>
      </div>
      
      <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-grow">
        {blog.content}
      </p>

      <div className="mt-auto">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span>By {blog.author?.name || 'Unknown'}</span>
          <div className="flex gap-4">
            <span>{blog.views} views</span>
            <span>{blog.likes} likes</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button 
            className="flex-1 btn-secondary text-sm"
            onClick={(e) => {
              e.stopPropagation();
              onView(blog);
            }}
          >
            <FiEye className="inline w-4 h-4 mr-1" />
            View
          </button>
          <button 
            className="flex-1 btn-secondary text-sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(blog);
            }}
          >
            <FiEdit className="inline w-4 h-4 mr-1" />
            Edit
          </button>
          {canDelete && (
            <button 
              className="btn-danger text-sm flex-1"
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm('Are you sure you want to delete this blog?')) {
                  onDelete(blog.id);
                }
              }}
            >
              <FiTrash2 className="inline w-4 h-4 mr-1" />
              Delete
            </button>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Created: {new Date(blog.created_at).toLocaleDateString()}</span>
            <span>Updated: {new Date(blog.updated_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

interface User {
  id: string | number;
  is_staff?: boolean;
  // Add other user properties as needed
}

export default function Blogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | BlogStatus>('all');
  const [error, setError] = useState<string | null>(null);
  const [viewingBlog, setViewingBlog] = useState<Blog | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    fetchBlogs();
    // Fetch current user data - replace with your actual auth context or API call
    const fetchCurrentUser = async () => {
      try {
        // Replace this with your actual user fetching logic
        // For example: const user = await authService.getCurrentUser();
        const user = { id: 'current-user-id', is_staff: true }; // Example user
        setCurrentUser(user);
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };
    fetchCurrentUser();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const data = await blogsService.list();
      setBlogs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setError('Failed to load blogs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.author?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.author?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || blog.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (blog: Blog) => {
    alert(`Edit feature for "${blog.title}" coming soon.`);
  };

  const handleDelete = async (id: string | number) => {
    if (!window.confirm('Are you sure you want to delete this blog? This action cannot be undone.')) {
      return;
    }

    try {
      await blogsService.remove(id);
      setBlogs(blogs.filter(blog => blog.id !== id));
    } catch (error) {
      console.error('Error deleting blog:', error);
      setError('Failed to delete blog. Please try again.');
    } finally {
    }
  };

  if (loading && blogs.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blogs</h1>
          <p className="text-gray-600">View and manage platform blogs</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            Showing {filteredBlogs.length} of {blogs.length} blogs
          </span>
          <button
            onClick={() => alert('Create New Blog form coming soon!')}
            className="btn-primary flex items-center"
          >
            <FiPlus className="w-4 h-4 mr-1" />
            New Blog
          </button>
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
                placeholder="Search blogs..."
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

      {/* Error */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 text-red-700 flex items-center space-x-2">
          <FiX className="h-5 w-5 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Blogs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBlogs.map((blog) => (
          <BlogCard
            key={blog.id}
            blog={blog}
            onEdit={handleEdit}
            onView={setViewingBlog}
            onDelete={handleDelete}
            isAdmin={currentUser?.is_staff || false}
            currentUserId={currentUser?.id || null}
          />
        ))}
      </div>

      {filteredBlogs.length === 0 && !loading && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-1">No blogs found</h3>
          <p className="text-gray-500">
            Try adjusting your search or filters.
          </p>
        </div>
      )}

      {/* Blog View Modal */}
      {viewingBlog && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
              aria-hidden="true"
              onClick={() => setViewingBlog(null)}
            ></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                        {viewingBlog.title}
                      </h3>
                      <button
                        type="button"
                        className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                        onClick={() => setViewingBlog(null)}
                      >
                        <span className="sr-only">Close</span>
                        <FiX className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                    
                    <div className="mt-2">
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <span>By {viewingBlog.author?.name || 'Unknown'}</span>
                        <span className="mx-2">•</span>
                        <span>{new Date(viewingBlog.created_at).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="prose max-w-none mt-4 text-gray-700">
                        {viewingBlog.content.split('\n').map((paragraph, i) => (
                          <p key={i} className="mb-4">{paragraph}</p>
                        ))}
                      </div>
                      
                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{viewingBlog.views || 0} views</span>
                          <span>{viewingBlog.likes || 0} likes</span>
                          <span className="ml-auto">
                            Status: <span className="font-medium">
                              {viewingBlog.status ? viewingBlog.status.charAt(0).toUpperCase() + viewingBlog.status.slice(1) : 'Draft'}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    handleEdit(viewingBlog);
                    setViewingBlog(null);
                  }}
                >
                  Edit Blog
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setViewingBlog(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
