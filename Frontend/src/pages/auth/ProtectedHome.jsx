import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import Home from '../general/Home';

const ProtectedHome = () => {
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    axios.get('http://localhost:8080/api/auth/session', { withCredentials: true })
      .then(() => setStatus('authenticated'))
      .catch(() => setStatus('anonymous'));
  }, []);

  if (status === 'checking') return <div aria-busy="true" />;
  if (status === 'anonymous') return <Navigate to="/" replace />;
  return <Home />;
};

export default ProtectedHome;