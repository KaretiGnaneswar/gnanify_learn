import React from 'react'

type UserDetail = {
  id: string
  email: string
  name: string
  role: string
  is_active: boolean
  is_approved_contributor: boolean
  total_score: number
  problems_solved: number
  time_spent_coding: string
  rank: number
  about: string
  education: any[]
  social: Record<string, string>
  created_at?: string | null
  last_active?: string | null
}

interface Props {
  open: boolean
  onClose: () => void
  user?: UserDetail | null
}

const UserDetailModal: React.FC<Props> = ({ open, onClose, user }) => {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">User Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        {!user ? (
          <div className="py-16 text-center text-gray-500">Loading...</div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{user.name || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="font-medium capitalize">{user.role}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium">{user.is_active ? 'Active' : 'Blocked'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Contributor</p>
                <p className="font-medium">{user.is_approved_contributor ? 'Approved' : 'No'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Rank</p>
                <p className="font-medium">{user.rank}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Score</p>
                <p className="font-medium">{user.total_score}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Problems Solved</p>
                <p className="font-medium">{user.problems_solved}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Created At</p>
                <p className="font-medium">{user.created_at ? new Date(user.created_at).toLocaleString() : '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Active</p>
                <p className="font-medium">{user.last_active ? new Date(user.last_active).toLocaleString() : '-'}</p>
              </div>
            </div>
            {user.about && (
              <div>
                <p className="text-sm text-gray-500">About</p>
                <p className="font-medium text-gray-800 whitespace-pre-wrap">{user.about}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-500 mb-1">Social</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {Object.entries(user.social || {}).map(([k, v]) => (
                  v ? <div key={k} className="text-gray-700"><span className="font-medium capitalize">{k}:</span> {v}</div> : null
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="mt-6 text-right">
          <button onClick={onClose} className="btn-secondary">Close</button>
        </div>
      </div>
    </div>
  )
}

export default UserDetailModal
