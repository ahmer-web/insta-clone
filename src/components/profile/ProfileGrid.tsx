import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle } from 'lucide-react';
import { Post } from '../../types';

interface ProfileGridProps {
  posts: Post[];
}

const ProfileGrid: React.FC<ProfileGridProps> = ({ posts }) => {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">No posts yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-1 sm:gap-4">
      {posts.map((post) => (
        <Link 
          key={post.id} 
          to={`/post/${post.id}`}
          className="relative group aspect-square bg-gray-100 overflow-hidden"
        >
          <img 
            src={post.mediaUrl} 
            alt={post.caption || 'Post'} 
            className="w-full h-full object-cover"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <div className="flex gap-4 text-white">
              <div className="flex items-center gap-1">
                <Heart size={20} fill="white" />
                <span>{post.likes.length}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle size={20} fill="white" />
                <span>0</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProfileGrid;