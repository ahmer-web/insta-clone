import React, { useEffect } from 'react';
import PostCard from '../components/post/PostCard';
import { usePosts } from '../context/PostsContext';
import { useAuth } from '../context/AuthContext';

const HomePage: React.FC = () => {
  const { getFeedPosts, isLoading } = usePosts();
  const { currentUser } = useAuth();
  
  const feedPosts = getFeedPosts();

  // If user has no following, recommend some accounts to follow
  const shouldShowRecommendations = currentUser && currentUser.following.length === 0;

  return (
    <div>
      {shouldShowRecommendations && (
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <h2 className="text-lg font-semibold mb-2">Welcome to Instaclone!</h2>
          <p className="text-gray-600 text-sm mb-4">
            Follow some creators to see their posts in your feed.
          </p>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-purple-500 rounded-full animate-spin"></div>
        </div>
      ) : feedPosts.length > 0 ? (
        <div>
          {feedPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">No posts yet</h2>
          <p className="text-gray-600 mb-6">Start following creators to see their posts here</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;