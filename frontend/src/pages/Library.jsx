import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useToast } from '../components/Toast';
import CopyButton from '../components/CopyButton';
import ConfirmModal from '../components/ConfirmModal';
import { PostSkeleton } from '../components/Skeleton';
import { PenSquare, Trash2, FolderOpen, Filter } from 'lucide-react';

export default function Library() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterPlatform, setFilterPlatform] = useState('all');
  const [postToDelete, setPostToDelete] = useState(null);

  const { show } = useToast();
  const deleteBtnRef = useRef(null);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/posts');
      setPosts(res.data);
    } catch {
      show('Could not fetch posts library.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDeletePost = async () => {
    if (!postToDelete) return;
    try {
      await api.delete(`/posts/${postToDelete.id}`);
      setPosts((prev) => prev.filter((p) => p.id !== postToDelete.id));
      show('Post deleted from library.', 'info');
    } catch {
      show('Failed to delete post.', 'error');
    } finally {
      setPostToDelete(null);
    }
  };

  const filteredPosts = posts.filter(
    (p) => filterPlatform === 'all' || p.platform === filterPlatform
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-white">Content Library</h1>
          <p className="text-xs text-text-2 mt-0.5">Manage and organize all your social drafts, scheduled queues, and published assets.</p>
        </div>
        <Link to="/app/create" className="btn btn-primary btn-sm self-start sm:self-auto">
          <PenSquare className="w-3.5 h-3.5 mr-1" /> New Post
        </Link>
      </div>

      <div className="card">
        {/* Filters bar */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2 text-xs text-text-3">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter platform:</span>
            <select
              value={filterPlatform}
              onChange={(e) => setFilterPlatform(e.target.value)}
              className="bg-transparent border border-white/10 text-white text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-accent"
            >
              <option value="all" className="bg-bg text-white">All platforms</option>
              <option value="instagram" className="bg-bg text-white">Instagram</option>
              <option value="linkedin" className="bg-bg text-white">LinkedIn</option>
              <option value="x" className="bg-bg text-white">X</option>
              <option value="facebook" className="bg-bg text-white">Facebook</option>
            </select>
          </div>
          <span className="text-xs text-text-3">{filteredPosts.length} posts</span>
        </div>

        {loading ? (
          <div className="space-y-3">
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="space-y-3">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition gap-4"
              >
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-white truncate">{post.title}</span>
                    <span
                      className={`post-badge ${
                        post.status === 'scheduled'
                          ? 'badge-scheduled'
                          : post.status === 'published'
                          ? 'badge-published'
                          : 'badge-draft'
                      }`}
                    >
                      {post.status}
                    </span>
                  </div>
                  <p className="text-xs text-text-3 line-clamp-1">{post.content}</p>
                  <div className="text-[11px] text-text-3 capitalize">
                    {post.platform} {post.scheduled_at && `• ${new Date(post.scheduled_at).toLocaleDateString()}`}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <CopyButton text={post.content} label="Copy" />
                  <button
                    ref={deleteBtnRef}
                    type="button"
                    onClick={() => setPostToDelete(post)}
                    aria-label={`Delete post ${post.title}`}
                    className="p-1.5 rounded-lg text-text-3 hover:text-error hover:bg-error/10 transition"
                    title="Delete post"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-text-3">
            <FolderOpen className="w-8 h-8 mx-auto mb-3 opacity-40" />
            <p className="text-sm font-medium text-text-2">No posts found</p>
            <p className="text-xs mt-1">Start by creating your first post or generating one in AI Studio.</p>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      <ConfirmModal
        isOpen={Boolean(postToDelete)}
        title="Delete post?"
        message={`Are you sure you want to permanently delete "${postToDelete?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        isDanger={true}
        onConfirm={handleDeletePost}
        onCancel={() => setPostToDelete(null)}
        triggerRef={deleteBtnRef}
      />
    </div>
  );
}
