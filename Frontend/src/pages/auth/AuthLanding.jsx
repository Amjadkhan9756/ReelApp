import React from 'react';
import { Link } from 'react-router-dom';
import '../../Style/auth-shared.css';

const AuthLanding = () => (
  <div className="auth-page-wrapper">
    <div className="auth-card" role="region" aria-labelledby="auth-landing-title">
      <header>
        <h1 id="auth-landing-title" className="auth-title">Welcome to ReelApp</h1>
        <p className="auth-subtitle">Discover great videos, or share your own.</p>
      </header>
      <div className="auth-choice-list">
        <Link to="/user/login" className="auth-submit">Log in</Link>
        <Link to="/register" className="auth-submit secondary">Register</Link>
      </div>
      <p className="auth-alt-action">videos createrd? <Link to="/food-partner/login">createrd sign in</Link></p>
    </div>
  </div>
);

export default AuthLanding;