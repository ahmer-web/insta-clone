import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ThumbsDown, MessageCircle, Share2, Send } from 'lucide-react';
import { Post } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { usePosts } from '../../context/PostsContext';
import Input from '../ui/Input';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { currentUser } = useAuth();
  const { likePost, dislikePost, addComment } = usePosts();
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  const hasLiked = currentUser && post.likes.includes(currentUser.id);
  const hasDisliked = currentUser && post.dislikes.includes(currentUser.id);

  const handleLike = () => {
    if (!currentUser) return;
    likePost(post.id);
  };

  const handleDislike = () => {
    if (!currentUser) return;
    dislikePost(post.id);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !newComment.trim()) return;
    
    addComment(post.id, newComment.trim());
    setNewComment('');
  };

  // Format date to relative time
  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds}s ago`;
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)}m ago`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    } else if (diffInSeconds < 604800) {
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
      {/* Post Header */}
      <div className="flex items-center p-3 border-b border-gray-100">
        <Link to={`/profile/${post.userId}`} className="flex items-center gap-2">
          {post.userProfileImage ? (
            <img 
              src={post.userProfileImage} 
              alt={post.username} 
              className="w-9 h-9 rounded-full object-cover"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
              {post.username.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-semibold text-sm">{post.username}</p>
            <p className="text-xs text-gray-500">{getRelativeTime(new Date(post.createdAt))}</p>
          </div>
        </Link>
      </div>

      {/* Post Image */}
      <div className="relative pb-[100%] bg-gray-100">
        {!isImageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-purple-500 rounded-full animate-spin"></div>
          </div>
        )}
        <img 
          src={post.mediaUrl} 
          alt={post.caption || 'Post image'} 
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setIsImageLoaded(true)}
        />
      </div>

      {/* Post Actions */}
      <div className="p-3">
        <div className="flex justify-between mb-2">
          <div className="flex gap-4">
            <button 
              onClick={handleLike}
              className={`flex items-center gap-1 ${hasLiked ? 'text-red-500' : 'text-gray-700'} transition-colors`}
            >
              <Heart size={20} fill={hasLiked ? 'currentColor' : 'none'} />
              <span className="text-sm">{post.likes.length}</span>
            </button>
            <button 
              onClick={handleDislike}
              className={`flex items-center gap-1 ${hasDisliked ? 'text-blue-500' : 'text-gray-700'} transition-colors`}
            >
              <ThumbsDown size={20} fill={hasDisliked ? 'currentColor' : 'none'} />
              <span className="text-sm">{post.dislikes.length}</span>
            </button>
            <button 
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-1 text-gray-700"
            >
              <MessageCircle size={20} />
              <span className="text-sm">{post.comments.length}</span>
            </button>
          </div>
          <button className="text-gray-700">
            <Share2 size={20} />
          </button>
        </div>

        {/* Caption */}
        {post.caption && (
          <div className="mt-1">
            <p className="text-sm">
              <Link to={`/profile/${post.userId}`} className="font-semibold">{post.username}</Link>{' '}
              {post.caption}
            </p>
          </div>
        )}

        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 border-t border-gray-100 pt-4">
            <div className="max-h-60 overflow-y-auto space-y-4">
              {post.comments.map(comment => (
                <div key={comment.id} className="flex items-start gap-2">
                  <Link to={`/profile/${comment.userId}`}>
                    {comment.userProfileImage ? (
                      <img 
                        src={comment.userProfileImage} 
                        alt={comment.username} 
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                        {comment.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </Link>
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-lg px-3 py-2">
                      <Link to={`/profile/${comment.userId}`} className="font-semibold text-sm">
                        {comment.username}
                      </Link>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {getRelativeTime(new Date(comment.createdAt))}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Comment Form */}
            <form onSubmit={handleAddComment} className="mt-4 flex gap-2">
              <Input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1"
              />
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="text-purple-600 hover:text-purple-700 disabled:opacity-50"
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;