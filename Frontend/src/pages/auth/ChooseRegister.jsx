import React from 'react';
import { Link } from 'react-router-dom';
import '../../Style/auth-shared.css';

const ChooseRegister = () => {
  return (
    <div className="auth-page-wrapper">
      <div className="auth-card" role="region" aria-labelledby="choose-register-title">
        <header>
          <h1 id="choose-register-title" className="auth-title">Register</h1>
          <p className="auth-subtitle">Pick how you want to join the platform.</p>
        </header>
        <div className="auth-choice-list">
          <Link to="/user/register" className="auth-submit">
            Register as normal user
          </Link>
          <Link to="/food-partner/register" className="auth-submit secondary">
            Register as videos creater and watcher
          </Link>
        </div>
        <div className="auth-alt-action" style={{marginTop:'4px'}}>
          Already have an account? <Link to="/user/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default ChooseRegister;
