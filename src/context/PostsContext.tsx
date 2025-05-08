import React, { createContext, useContext, useState, useEffect } from 'react';
import { Post, Comment, PostsState } from '../types';
import { useAuth } from './AuthContext';

// Mock data for demonstration
const MOCK_POSTS: Post[] = [
  {
    id: '1',
    userId: '1',
    username: 'johndoe',
    userProfileImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    mediaUrl: 'https://images.pexels.com/photos/2325446/pexels-photo-2325446.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    caption: 'Beautiful sunset at the beach',
    likes: ['2'],
    dislikes: [],
    comments: [],
    createdAt: new Date('2023-04-15')
  },
  {
    id: '2',
    userId: '2',
    username: 'janedoe',
    userProfileImage: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    mediaUrl: 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    caption: 'Adventure in the mountains!',
    likes: ['1', '3'],
    dislikes: [],
    comments: [],
    createdAt: new Date('2023-04-10')
  },
  {
    id: '3',
    userId: '1',
    username: 'johndoe',
    userProfileImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    mediaUrl: 'https://images.pexels.com/photos/699963/pexels-photo-699963.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    caption: 'City lights',
    likes: [],
    dislikes: ['2'],
    comments: [],
    createdAt: new Date('2023-04-05')
  }
];

interface PostsContextType extends PostsState {
  fetchPosts: () => void;
  fetchUserPosts: (userId: string) => void;
  createPost: (post: Omit<Post, 'id' | 'createdAt' | 'comments'>) => void;
  likePost: (postId: string) => void;
  dislikePost: (postId: string) => void;
  addComment: (postId: string, content: string) => void;
  getFeedPosts: () => Post[];
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

export const PostsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  
  const [state, setState] = useState<PostsState>({
    posts: MOCK_POSTS,
    userPosts: [],
    isLoading: false,
    error: null
  });

  const fetchPosts = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setState(prev => ({ ...prev, posts: MOCK_POSTS, isLoading: false }));
    } catch (error: any) {
      setState(prev => ({ ...prev, isLoading: false, error: error.message }));
    }
  };

  const fetchUserPosts = async (userId: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const userPosts = state.posts.filter(post => post.userId === userId);
      setState(prev => ({ ...prev, userPosts, isLoading: false }));
    } catch (error: any) {
      setState(prev => ({ ...prev, isLoading: false, error: error.message }));
    }
  };

  const createPost = (postData: Omit<Post, 'id' | 'createdAt' | 'comments'>) => {
    if (!currentUser) return;

    const newPost: Post = {
      ...postData,
      id: (state.posts.length + 1).toString(),
      comments: [],
      createdAt: new Date()
    };
    
    setState(prev => ({
      ...prev,
      posts: [newPost, ...prev.posts]
    }));

    // Update user's posts array
    currentUser.posts = [...(currentUser.posts || []), newPost.id];
  };

  const likePost = (postId: string) => {
    if (!currentUser) return;

    setState(prev => ({
      ...prev,
      posts: prev.posts.map(post => {
        if (post.id === postId) {
          // If already liked, remove like
          if (post.likes.includes(currentUser.id)) {
            return {
              ...post,
              likes: post.likes.filter(id => id !== currentUser.id)
            };
          }
          // Add like and remove from dislikes if present
          return {
            ...post,
            likes: [...post.likes, currentUser.id],
            dislikes: post.dislikes.filter(id => id !== currentUser.id)
          };
        }
        return post;
      })
    }));
  };

  const dislikePost = (postId: string) => {
    if (!currentUser) return;

    setState(prev => ({
      ...prev,
      posts: prev.posts.map(post => {
        if (post.id === postId) {
          // If already disliked, remove dislike
          if (post.dislikes.includes(currentUser.id)) {
            return {
              ...post,
              dislikes: post.dislikes.filter(id => id !== currentUser.id)
            };
          }
          // Add dislike and remove from likes if present
          return {
            ...post,
            dislikes: [...post.dislikes, currentUser.id],
            likes: post.likes.filter(id => id !== currentUser.id)
          };
        }
        return post;
      })
    }));
  };

  const addComment = (postId: string, content: string) => {
    if (!currentUser) return;

    const newComment: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      postId,
      userId: currentUser.id,
      username: currentUser.username,
      userProfileImage: currentUser.profileImage,
      content,
      createdAt: new Date()
    };

    setState(prev => ({
      ...prev,
      posts: prev.posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, newComment]
          };
        }
        return post;
      })
    }));
  };

  const getFeedPosts = () => {
    if (!currentUser) return state.posts;
    
    // For feed, show posts from users the current user is following
    return state.posts.filter(post => 
      currentUser.following.includes(post.userId) || post.userId === currentUser.id
    ).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <PostsContext.Provider value={{
      ...state,
      fetchPosts,
      fetchUserPosts,
      createPost,
      likePost,
      dislikePost,
      addComment,
      getFeedPosts
    }}>
      {children}
    </PostsContext.Provider>
  );
};

export const usePosts = () => {
  const context = useContext(PostsContext);
  if (context === undefined) {
    throw new Error('usePosts must be used within a PostsProvider');
  }
  return context;
};