import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

function ProtectedRoute({ children }) {
  const { profile } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!profile) {
      navigate('/profile');
    }
  }, [profile, navigate]);

  return profile ? children : null;
}

export default ProtectedRoute;
