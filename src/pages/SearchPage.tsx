import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import Input from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { User } from '../types';

const SearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { allUsers, currentUser } = useAuth();
  
  const filteredUsers = searchQuery.trim() 
    ? allUsers.filter(user => 
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allUsers.filter(user => 
        // Don't show current user in the list
        currentUser ? user.id !== currentUser.id : true
      );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Search</h1>
      
      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <SearchIcon size={20} className="text-gray-500" />
        </div>
        <Input
          type="text"
          placeholder="Search for users"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
          fullWidth
        />
      </div>
      
      <div className="space-y-4">
        {searchQuery.trim() && filteredUsers.length === 0 ? (
          <p className="text-center text-gray-500 py-6">No users found matching "{searchQuery}"</p>
        ) : (
          <>
            {searchQuery.trim() ? (
              <h2 className="text-lg font-semibold">Results</h2>
            ) : (
              <h2 className="text-lg font-semibold">Suggested Users</h2>
            )}
            
            <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
              {filteredUsers.map(user => (
                <UserItem key={user.id} user={user} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

interface UserItemProps {
  user: User;
}

const UserItem: React.FC<UserItemProps> = ({ user }) => {
  const { currentUser, followUser, unfollowUser } = useAuth();
  
  const isFollowing = currentUser?.following.includes(user.id);
  
  const handleFollowToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!currentUser) return;
    
    if (isFollowing) {
      unfollowUser(user.id);
    } else {
      followUser(user.id);
    }
  };

  return (
    <Link to={`/profile/${user.id}`} className="flex items-center justify-between p-4 hover:bg-gray-50">
      <div className="flex items-center gap-3">
        {user.profileImage ? (
          <img 
            src={user.profileImage} 
            alt={user.username} 
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
            {user.username.charAt(0).toUpperCase()}
          </div>
        )}
        
        <div>
          <p className="font-semibold text-sm">{user.username}</p>
          <p className="text-xs text-gray-500">{user.fullName}</p>
        </div>
      </div>
      
      {currentUser && (
        <button
          onClick={handleFollowToggle}
          className={`text-sm font-medium px-3 py-1 rounded-lg transition-colors ${
            isFollowing
              ? 'text-gray-600 bg-gray-100 hover:bg-gray-200'
              : 'text-white bg-purple-600 hover:bg-purple-700'
          }`}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </button>
      )}
    </Link>
  );
};

export default SearchPage;