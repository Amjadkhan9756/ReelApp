import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import AuthLanding from './AuthLanding';

const AuthGate = () => {
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    axios.get('/api/auth/session', { withCredentials: true })
      .then(() => setStatus('authenticated'))
      .catch(() => setStatus('anonymous'));
  }, []);

  if (status === 'checking') return <div className="auth-page-wrapper" aria-busy="true" />;
  if (status === 'authenticated') return <Navigate to="/home" replace />;
  return <AuthLanding />;
};

export default AuthGate;