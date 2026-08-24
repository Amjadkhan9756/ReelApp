import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import '../Style/navbar.css';

const Navbar = () => (
  <header className="site-navbar">
    <Link className="site-navbar__brand" to="/">Reel<span>App</span></Link>
    <nav className="site-navbar__links" aria-label="Primary navigation">
      <NavLink to="/home" className={({ isActive }) => `site-navbar__link ${isActive ? 'is-active' : ''}`}>Reels</NavLink>
      <NavLink to="/create-food" className={({ isActive }) => `site-navbar__link site-navbar__post ${isActive ? 'is-active' : ''}`}>
        <span aria-hidden="true">+</span> Post Reel
      </NavLink>
      <NavLink to="/user/login" className={({ isActive }) => `site-navbar__link ${isActive ? 'is-active' : ''}`}>Login</NavLink>
      <NavLink to="/register" className={({ isActive }) => `site-navbar__link site-navbar__register ${isActive ? 'is-active' : ''}`}>Register</NavLink>
    </nav>
  </header>
);

export default Navbar;