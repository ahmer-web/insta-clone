export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  bio?: string;
  profileImage?: string;
  followers: string[]; // Array of user IDs
  following: string[]; // Array of user IDs
  isCreator: boolean;
  posts: string[]; // Array of post IDs
  createdAt: Date;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  username: string;
  userProfileImage?: string;
  content: string;
  createdAt: Date;
}

export interface Post {
  id: string;
  userId: string;
  username: string;
  userProfileImage?: string;
  mediaUrl: string;
  caption?: string;
  likes: string[]; // Array of user IDs
  dislikes: string[]; // Array of user IDs
  comments: Comment[];
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface PostsState {
  posts: Post[];
  userPosts: Post[];
  isLoading: boolean;
  error: string | null;
}