import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types';

// Mock data for demonstration
const MOCK_USERS: User[] = [
  {
    id: '1',
    username: 'johndoe',
    email: 'john@example.com',
    fullName: 'John Doe',
    bio: 'Photography enthusiast',
    profileImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    followers: ['2', '3'],
    following: ['2'],
    isCreator: true,
    createdAt: new Date('2023-01-01')
  },
  {
    id: '2',
    username: 'janedoe',
    email: 'jane@example.com',
    fullName: 'Jane Doe',
    bio: 'Travel lover',
    profileImage: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    followers: ['1'],
    following: ['1', '3'],
    isCreator: true,
    createdAt: new Date('2023-01-15')
  },
  {
    id: '3',
    username: 'samsmith',
    email: 'sam@example.com',
    fullName: 'Sam Smith',
    bio: 'Just browsing',
    profileImage: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    followers: ['2'],
    following: ['1'],
    isCreator: false,
    createdAt: new Date('2023-02-01')
  }
];

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
  followUser: (userId: string) => void;
  unfollowUser: (userId: string) => void;
  currentUser: User | null;
  getUser: (userId: string) => User | undefined;
  allUsers: User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null
  });
  const [allUsers, setAllUsers] = useState<User[]>(MOCK_USERS);

  useEffect(() => {
    // Check for stored user session on initial load
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setState({
        user: JSON.parse(storedUser),
        isLoading: false,
        error: null
      });
    } else {
      setState(prevState => ({ ...prevState, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string) => {
    setState({ ...state, isLoading: true, error: null });
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = allUsers.find(u => u.email === email);
      if (!user) {
        throw new Error('Invalid email or password');
      }
      
      // In a real application, you would validate the password here
      
      localStorage.setItem('currentUser', JSON.stringify(user));
      setState({ user, isLoading: false, error: null });
    } catch (error: any) {
      setState({ ...state, isLoading: false, error: error.message });
    }
  };

  const signup = async (username: string, email: string, password: string, fullName: string) => {
    setState({ ...state, isLoading: true, error: null });
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if email or username already exists
      if (allUsers.some(u => u.email === email)) {
        throw new Error('Email already in use');
      }
      if (allUsers.some(u => u.username === username)) {
        throw new Error('Username already taken');
      }
      
      // Create new user
      const newUser: User = {
        id: (allUsers.length + 1).toString(),
        username,
        email,
        fullName,
        bio: '',
        followers: [],
        following: [],
        isCreator: true, // Default to creator
        createdAt: new Date()
      };
      
      const updatedUsers = [...allUsers, newUser];
      setAllUsers(updatedUsers);
      
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      setState({ user: newUser, isLoading: false, error: null });
    } catch (error: any) {
      setState({ ...state, isLoading: false, error: error.message });
    }
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setState({ user: null, isLoading: false, error: null });
  };

  const followUser = (userId: string) => {
    if (!state.user) return;
    
    // Update current user's following list
    const updatedCurrentUser = {
      ...state.user,
      following: [...state.user.following, userId]
    };
    
    // Update target user's followers list
    const updatedUsers = allUsers.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          followers: [...user.followers, state.user!.id]
        };
      } else if (user.id === state.user!.id) {
        return updatedCurrentUser;
      }
      return user;
    });
    
    setAllUsers(updatedUsers);
    localStorage.setItem('currentUser', JSON.stringify(updatedCurrentUser));
    setState({ ...state, user: updatedCurrentUser });
  };

  const unfollowUser = (userId: string) => {
    if (!state.user) return;
    
    // Update current user's following list
    const updatedCurrentUser = {
      ...state.user,
      following: state.user.following.filter(id => id !== userId)
    };
    
    // Update target user's followers list
    const updatedUsers = allUsers.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          followers: user.followers.filter(id => id !== state.user!.id)
        };
      } else if (user.id === state.user!.id) {
        return updatedCurrentUser;
      }
      return user;
    });
    
    setAllUsers(updatedUsers);
    localStorage.setItem('currentUser', JSON.stringify(updatedCurrentUser));
    setState({ ...state, user: updatedCurrentUser });
  };

  const getUser = (userId: string) => {
    return allUsers.find(user => user.id === userId);
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      signup,
      logout,
      followUser,
      unfollowUser,
      currentUser: state.user,
      getUser,
      allUsers
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};