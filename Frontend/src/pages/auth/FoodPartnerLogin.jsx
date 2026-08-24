import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../Style/auth-shared.css'
import axios from 'axios';

const FoodPartnerLogin = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      await axios.post("/api/auth/food-partner/login", {
        email,
        password
      }, { withCredentials: true });
      navigate("/home");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(error.response?.data?.message || 'Login failed. Please check your details.');
      } else {
        setErrorMessage('Login failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card" role="region" aria-labelledby="partner-login-title">
        <header>
          <h1 id="partner-login-title" className="auth-title">Partner Sign In</h1>
          <p className="auth-subtitle">Sign in to manage your food uploads.</p>
        </header>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="field-group">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" required />
          </div>
          <div className="field-group">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" placeholder="••••••••" autoComplete="current-password" required />
          </div>
          <button className="auth-submit" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Signing in...' : 'Sign In'}</button>
        </form>
        {errorMessage && <p className="auth-error" role="alert">{errorMessage}</p>}
        <div className="auth-alt-action">
          New partner? <Link to="/food-partner/register">Create account</Link>
        </div>
      </div>
    </div>
  );
};

export default FoodPartnerLogin;
