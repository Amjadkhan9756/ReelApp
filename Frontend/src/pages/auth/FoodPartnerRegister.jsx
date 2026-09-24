import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../Style/auth-shared.css'
import axios from 'axios';

const FoodPartnerRegister = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const phone = e.target.phone.value;
    const address = e.target.address.value;
    const contactName = e.target.contactName.value;

    try {
      await axios.post("/api/auth/food-partner/register", {
        name,
        email,
        password,
        phone,
        address,
        contactName
      }, { withCredentials: true });
      navigate("/home");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(error.response?.data?.message || 'Registration failed. Please check your details.');
      } else {
        setErrorMessage('Registration failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card" role="region" aria-labelledby="partner-register-title">
        <header>
          <h1 id="partner-register-title" className="auth-title">videos createrd Sign Up</h1>
          <p className="auth-subtitle">Create your  account and start uploading videos.</p>
        </header>
        <nav className="auth-alt-action" style={{ marginTop: '-4px' }}>
          <strong style={{ fontWeight: 600 }}>Switch:</strong> <Link to="/user/register">User</Link> • <Link to="/food-partner/register">videos creater </Link>
        </nav>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="field-group">
            <label htmlFor="name">Business Name</label>
            <input id="name" name="name" placeholder="Enter" required />
          </div>
          <div className="field-group">
            <label htmlFor="contactName">Contact Name</label>
            <input id="contactName" name="contactName" placeholder="Enter" required />
          </div>
          <div className="field-group">
            <label htmlFor="phone">Phone</label>
            <input id="phone" name="phone" type="tel" placeholder="enter " required />
          </div>
          <div className="field-group">
            <label htmlFor="address">Address</label>
            <input id="address" name="address" placeholder="Enter" required />
          </div>
          <div className="field-group">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" placeholder="Enter" autoComplete="email" required />
          </div>
          <div className="field-group">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" placeholder="Enter" autoComplete="new-password" minLength="6" required />
          </div>
          <button className="auth-submit" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating account...' : 'Sign Up'}</button>
        </form>
        {errorMessage && <p className="auth-error" role="alert">{errorMessage}</p>}
        <div className="auth-alt-action">
          Already createrd? <Link to="/food-partner/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default FoodPartnerRegister;
