'use client'

import { Post } from '@/types'

interface PostListProps {
  posts: Post[]
  loading?: boolean
}

export default function PostList({ posts, loading }: PostListProps) {
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Posts</h3>
        <div className="text-center py-8 text-gray-500">Loading posts...</div>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Posts ({posts.length})</h3>
      {posts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No posts found. Create your first post above.
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <article key={post.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-gray-900">{post.title}</h4>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    post.published
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>
              {post.content && (
                <p className="text-gray-600 mb-3 line-clamp-3">{post.content}</p>
              )}
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>
                  By {post.author?.name || post.author?.email || 'Unknown Author'}
                </span>
                <span>
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}