import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Logo from '../ui/Logo';
import { useAuth } from '../../context/AuthContext';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:px-6">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-8">
        <div className="flex justify-center mb-6">
          <Logo size="lg" />
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            fullWidth
          />
          
          <Input
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
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
            disabled={!email || !password || isLoading}
          >
            Log In
          </Button>
        </form>
        
        <div className="relative flex items-center justify-center mt-6 mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative bg-white px-4">
            <span className="text-sm text-gray-500">Or</span>
          </div>
        </div>

        {/* Demo accounts for testing */}
        {/* <div className="space-y-3 mb-6">
          <p className="text-sm text-center text-gray-600 mb-2">Use a demo account:</p>
          <Button 
            type="button" 
            variant="outline" 
            fullWidth
            onClick={() => {
              setEmail('john@example.com');
              setPassword('password');
            }}
          >
            Login as Creator
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            fullWidth
            onClick={() => {
              setEmail('sam@example.com');
              setPassword('password');
            }}
          >
            Login as Consumer
          </Button>
        </div>
         */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-purple-600 hover:text-purple-700 font-semibold">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;