import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard where all user flows are implemented
    navigate('/dashboard');
  }, [navigate]);

  return null;
};

export default Index;
