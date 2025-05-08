import React, { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileGrid from '../components/profile/ProfileGrid';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../context/PostsContext';

const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { getUser, currentUser } = useAuth();
  const { fetchUserPosts, userPosts, isLoading } = usePosts();
  
  const user = userId ? getUser(userId) : null;

  useEffect(() => {
    if (userId) {
      fetchUserPosts(userId);
    }
  }, [userId, fetchUserPosts]);

  // If no user ID is provided and user is logged in, redirect to their profile
  if (!userId && currentUser) {
    return <Navigate to={`/profile/${currentUser.id}`} />;
  }

  // If user doesn't exist
  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">User not found</h2>
        <p className="text-gray-600">The user you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div>
      <ProfileHeader user={user} postCount={userPosts.length} />
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-purple-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <ProfileGrid posts={userPosts} />
      )}
    </div>
  );
};

export default ProfilePage;