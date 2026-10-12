import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import '../../Style/auth-shared.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import type { UserAuthResponse } from '../../types';
import { useState } from 'react';
import { getApiErrorMessage } from '../../apiError';

const UserRegister = () => {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMessage('');
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const firstName = String(formData.get('firstName') ?? '');
        const lastName = String(formData.get('lastName') ?? '');
        const email = String(formData.get('email') ?? '');
        const password = String(formData.get('password') ?? '');


        try {
            await axios.post<UserAuthResponse>("/api/auth/user/register", {
                fullName: firstName + " " + lastName,
                email,
                password
            }, { withCredentials: true });
            navigate("/home");
        } catch (error: unknown) {
            setErrorMessage(getApiErrorMessage(error, 'Registration failed. Please try again.'));
        } finally {
            setIsSubmitting(false);
        }

    };

    return (
        <div className="auth-page-wrapper">
            <div className="auth-card" role="region" aria-labelledby="user-register-title">
                <header>
                    <h1 id="user-register-title" className="auth-title">Create your account</h1>
                    <p className="auth-subtitle">Join to explore and enjoy videos.</p>
                </header>
                <nav className="auth-alt-action" style={{ marginTop: '-4px' }}>
                    <strong style={{ fontWeight: 600 }}>Switch:</strong> <Link to="/user/register">User</Link> • <Link to="/food-partner/register">videos createrd </Link>
                </nav>
                <form className="auth-form" onSubmit={handleSubmit} noValidate>
                    <div className="two-col">
                        <div className="field-group">
                            <label htmlFor="firstName">First Name</label>
                            <input id="firstName" name="firstName" placeholder="Jane" autoComplete="given-name" required />
                        </div>
                        <div className="field-group">
                            <label htmlFor="lastName">Last Name</label>
                            <input id="lastName" name="lastName" placeholder="Doe" autoComplete="family-name" required />
                        </div>
                    </div>
                    <div className="field-group">
                        <label htmlFor="email">Email</label>
                        <input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" required />
                    </div>
                    <div className="field-group">
                        <label htmlFor="password">Password</label>
                        <input id="password" name="password" type="password" placeholder="••••••••" autoComplete="new-password" minLength={6} required />
                    </div>
                    <button className="auth-submit" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating account...' : 'Sign Up'}</button>
                </form>
                {errorMessage && <p className="auth-error" role="alert">{errorMessage}</p>}
                <div className="auth-alt-action">
                    Already have an account? <Link to="/user/login">Sign in</Link>
                </div>
            </div>
        </div>
    );
};

export default UserRegister;
