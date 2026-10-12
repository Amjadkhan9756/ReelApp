import { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import AuthLanding from './AuthLanding';
import type { AuthSessionResponse } from '../../types';

type AuthStatus = 'checking' | 'authenticated' | 'anonymous' | 'error';

const AuthGate = () => {
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

  if (status === 'error') return <div className="auth-page-wrapper"><p className="auth-error" role="alert">{errorMessage}</p></div>;
  if (status === 'checking') return <div className="auth-page-wrapper" aria-busy="true" />;
  if (status === 'authenticated') return <Navigate to="/home" replace />;
  return <AuthLanding />;
};

export default AuthGate;