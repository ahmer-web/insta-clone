import React, { useState } from 'react';
import { Camera, X, Image as ImageIcon } from 'lucide-react';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { usePosts } from '../../context/PostsContext';
import { useNavigate } from 'react-router-dom';

const UploadForm: React.FC = () => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useAuth();
  const { createPost } = usePosts();
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size should be less than 5MB');
      return;
    }

    setError(null);
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result as string);
    };
    fileReader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!previewUrl) {
      setError('Please select an image');
      return;
    }

    setIsLoading(true);
    
    try {
      // In a real app, you would upload the image to a server here
      // For this demo, we'll use the data URL directly
      createPost({
        userId: currentUser.id,
        username: currentUser.username,
        userProfileImage: currentUser.profileImage,
        mediaUrl: previewUrl,
        caption,
        likes: [],
        dislikes: []
      });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      navigate('/');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const clearImage = () => {
    setPreviewUrl(null);
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Post</h1>
      
      <form onSubmit={handleSubmit}>
        {!previewUrl ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-6 text-center bg-gray-50">
            <div className="mx-auto w-16 h-16 mb-4 text-gray-400">
              <ImageIcon className="w-full h-full" />
            </div>
            <p className="mb-4 text-gray-600">Drag photos and videos here</p>
            <div className="relative">
              <Button type="button" variant="primary" className="relative z-10">
                <Camera className="mr-2 h-5 w-5" /> Select from computer
              </Button>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>
        ) : (
          <div className="relative mb-6">
            <button
              type="button"
              onClick={clearImage}
              className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 rounded-full p-1 text-white z-10"
            >
              <X size={16} />
            </button>
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="w-full rounded-lg"
            />
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Caption
          </label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            rows={3}
            placeholder="Write a caption..."
          ></textarea>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isLoading}
          disabled={!previewUrl || isLoading}
        >
          Share
        </Button>
      </form>
    </div>
  );
};

export default UploadForm;