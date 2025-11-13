'use client'

import { User } from '@/types'

interface UserListProps {
  users: User[]
  loading?: boolean
}

export default function UserList({ users, loading }: UserListProps) {
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Users</h3>
        <div className="text-center py-8 text-gray-500">Loading users...</div>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Users ({users.length})</h3>
      {users.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No users found. Create your first user above.
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((user) => (
            <div key={user.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-900">
                    {user.name || 'Unnamed User'}
                  </h4>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Created: {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  {user.posts ? `${user.posts.length} posts` : '0 posts'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}