import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Grid, Bookmark, UserCheck, UserPlus } from 'lucide-react';
import Button from '../ui/Button';
import { User } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface ProfileHeaderProps {
  user: User;
  postCount: number;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, postCount }) => {
  const { currentUser, followUser, unfollowUser } = useAuth();
  const navigate = useNavigate();
  
  const isCurrentUser = currentUser?.id === user.id;
  const isFollowing = currentUser?.following.includes(user.id);

  const handleFollowToggle = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    if (isFollowing) {
      unfollowUser(user.id);
    } else {
      followUser(user.id);
    }
  };

  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
        {/* Profile Picture */}
        <div className="w-24 h-24 sm:w-32 sm:h-32">
          {user.profileImage ? (
            <img 
              src={user.profileImage} 
              alt={user.username} 
              className="w-full h-full rounded-full object-cover border-2 border-white shadow-md"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-4xl">
              {user.username.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        
        {/* Profile Info */}
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
            <h1 className="text-2xl font-bold">{user.username}</h1>
            
            {isCurrentUser ? (
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Edit Profile</Button>
                <Button variant="ghost" size="sm">
                  <Settings size={18} />
                </Button>
              </div>
            ) : (
              <Button 
                variant={isFollowing ? 'outline' : 'primary'} 
                size="sm"
                onClick={handleFollowToggle}
                className="flex items-center gap-1"
              >
                {isFollowing ? (
                  <>
                    <UserCheck size={16} />
                    <span>Following</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={16} />
                    <span>Follow</span>
                  </>
                )}
              </Button>
            )}
          </div>
          
          <div className="flex justify-center sm:justify-start gap-6 mb-4 text-sm">
            <div>
              <span className="font-semibold">{postCount}</span> posts
            </div>
            <div>
              <span className="font-semibold">{user.followers.length}</span> followers
            </div>
            <div>
              <span className="font-semibold">{user.following.length}</span> following
            </div>
          </div>
          
          <div>
            <p className="font-semibold">{user.fullName}</p>
            {user.bio && <p className="text-sm mt-1">{user.bio}</p>}
          </div>
        </div>
      </div>
      
      {/* Profile Tabs */}
      <div className="border-t border-gray-200">
        <div className="flex justify-center">
          <button className="flex items-center gap-1 px-4 py-3 text-sm font-medium text-gray-900 border-t-2 border-gray-900">
            <Grid size={16} />
            <span>POSTS</span>
          </button>
          <button className="flex items-center gap-1 px-4 py-3 text-sm font-medium text-gray-500">
            <Bookmark size={16} />
            <span>SAVED</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;