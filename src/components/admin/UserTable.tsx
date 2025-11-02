import React, { useState } from 'react'
import { FiMoreVertical, FiEye, FiTrendingUp } from 'react-icons/fi'

export type TableUser = {
  id: string
  name: string
  title?: string
  avatarUrl?: string
}

interface Props {
  users: TableUser[]
  onView?: (id: string) => void
  onPromote?: (id: string) => void
  loading?: boolean
}

const UserTable: React.FC<Props> = ({ users, onView, onPromote, loading }) => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  const toggleMenu = (id: string) => {
    setOpenMenuId(openMenuId === id ? null : id)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-900/60 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden backdrop-blur-md">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800/60">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-all duration-200"
              >
                {/* User Info */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatarUrl || '/default-avatar.png'}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-700"
                    />
                    <div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {user.name}
                      </div>
                      {user.title && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {user.title}
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                  <button
                    onClick={() => toggleMenu(user.id)}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <FiMoreVertical className="h-4 w-4" />
                  </button>

                  {openMenuId === user.id && (
                    <div
                      className="absolute right-6 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-20"
                    >
                      <button
                        onClick={() => {
                          onView && onView(user.id)
                          setOpenMenuId(null)
                        }}
                        className="flex items-center w-full gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                      >
                        <FiEye className="h-4 w-4" /> View Profile
                      </button>

                      {onPromote && (
                        <button
                          onClick={() => {
                            onPromote(user.id)
                            setOpenMenuId(null)
                          }}
                          className="flex items-center w-full gap-2 px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 transition"
                        >
                          <FiTrendingUp className="h-4 w-4" /> Promote to Contributor
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400 text-sm">
          No users found
        </div>
      )}
    </div>
  )
}

export default UserTable
