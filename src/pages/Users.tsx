import { useEffect, useState } from 'react';
import { usersService } from '../services/users';
import { adminService } from '../services/admin';
import SearchInput from '../components/admin/SearchInput';
import UserTable from '../components/admin/UserTable';
import UserDetailModal from '../components/admin/UserDetailModal';

type User = {
  id: string;
  name: string;
  title: string;
  avatarUrl: string;
};

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailUser, setDetailUser] = useState<any | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const fetchUsers = async () => {
    try {
      setError(null);
      const data = await usersService.list(searchTerm);
      const mapped: User[] = data.map((u: any) => ({
        id: String(u.id),
        name: String(u.name || 'User'),
        title: String(u.title || ''),
        avatarUrl: String(u.avatarUrl || ''),
      }));
      setUsers(mapped);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handlePromote = async (userId: string) => {
    try {
      await adminService.promoteToContributor(userId);
      await fetchUsers();
    } catch (e) {
      console.error(e);
      setError('Failed to promote user');
    }
  };

  const handleView = async (userId: string) => {
    try {
      setDetailUser(null);
      setDetailOpen(true);
      const data = await adminService.getUserDetail(userId);
      setDetailUser(data);
    } catch (e) {
      console.error(e);
      setError('Failed to load user details');
      setDetailOpen(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600 mt-1">Manage and view all platform users</p>
        </div>
        <div className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-lg">
          Total Users: <span className="font-semibold text-gray-800">{users.length}</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 shadow-sm">
          {error}
        </div>
      )}

      {/* Search Card */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-md p-6 transition-all">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Search Users
        </label>
        <SearchInput
          value={searchTerm}
          placeholder="Search by name or title"
          onChange={(v) => setSearchTerm(v)}
        />
      </div>

      {/* User Table Card */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-md p-6 transition-all hover:shadow-lg">
        <UserTable
          users={filteredUsers}
          loading={loading}
          onView={handleView}
          onPromote={handlePromote}
        />
      </div>

      {/* Modal */}
      <UserDetailModal open={detailOpen} onClose={() => setDetailOpen(false)} user={detailUser} />
    </div>
  );
}
