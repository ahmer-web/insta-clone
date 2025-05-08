import React from 'react';
import UploadForm from '../components/post/UploadForm';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const CreatePage: React.FC = () => {
  const { currentUser } = useAuth();
  
  // Only creators can access this page
  if (currentUser && !currentUser.isCreator) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <UploadForm />
    </div>
  );
};

export default CreatePage;