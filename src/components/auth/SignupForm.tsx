import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Logo from '../ui/Logo';
import { useAuth } from '../../context/AuthContext';

const SignupForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    username: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const { signup, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Basic validation
    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    try {
      await signup(
        formData.username, 
        formData.email, 
        formData.password, 
        formData.fullName
      );
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:px-6">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-8">
        <div className="flex justify-center mb-6">
          <Logo size="lg" />
        </div>
        
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Sign up to see photos</h2>
          <p className="text-sm text-gray-600 mt-1">
            Connect with creators and discover amazing content
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            name="email"
            label="Email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            fullWidth
          />
          
          <Input
            type="text"
            name="fullName"
            label="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
            fullWidth
          />
          
          <Input
            type="text"
            name="username"
            label="Username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Choose a username"
            required
            fullWidth
          />
          
          <Input
            type="password"
            name="password"
            label="Password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password"
            required
            fullWidth
          />
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          
          <Button 
            type="submit" 
            variant="primary" 
            fullWidth 
            isLoading={isLoading}
            disabled={
              !formData.email || 
              !formData.fullName || 
              !formData.username || 
              !formData.password || 
              isLoading
            }
          >
            Sign Up
          </Button>
        </form>
        
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            By signing up, you agree to our Terms, Privacy Policy and Cookies Policy.
          </p>
        </div>
        
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Have an account?{' '}
            <Link to="/login" className="text-purple-600 hover:text-purple-700 font-semibold">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;