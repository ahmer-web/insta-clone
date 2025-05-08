import React from 'react';
import SignupForm from '../components/auth/SignupForm';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const SignupPage: React.FC = () => {
  const { currentUser } = useAuth();
  
  // Redirect if already logged in
  if (currentUser) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <SignupForm />
    </div>
  );
};

export default SignupPage;