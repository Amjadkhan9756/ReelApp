import { useEffect, useState } from 'react'
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import Home from '../general/Home';
import type { AuthSessionResponse } from '../../types';

type AuthStatus = 'checking' | 'authenticated' | 'anonymous' | 'error';

const ProtectedHome = () => {
  const [status, setStatus] = useState<AuthStatus>('checking');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    axios.get<AuthSessionResponse>('/api/auth/session', { withCredentials: true })
      .then(() => setStatus('authenticated'))
      .catch((error: unknown) => {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          setStatus('anonymous');
          return;
        }
        setErrorMessage('Could not check your session. Please refresh and try again.');
        setStatus('error');
      });
  }, []);

  if (status === 'error') return <p className="auth-error" role="alert">{errorMessage}</p>;
  if (status === 'checking') return <div aria-busy="true" />;
  if (status === 'anonymous') return <Navigate to="/" replace />;
  return <Home />;
};

export default ProtectedHome;