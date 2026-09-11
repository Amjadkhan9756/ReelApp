import React from 'react'
import { NavLink } from 'react-router-dom'
import '../Style/bottom-nav.css'

const BottomNav = () => {
  return (
    <nav className="bottom-nav" role="navigation" aria-label="Primary navigation">
      <NavLink className="bottom-nav__brand" to="/">Reel<span>App</span></NavLink>
      <div className="bottom-nav__inner">
        <NavLink to="/home" className={({ isActive }) => `bottom-nav__item ${isActive ? 'is-active' : ''}`}>
          <span className="bottom-nav__icon" aria-hidden="true">
            {/* home icon */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 10.5 12 3l9 7.5"/>
              <path d="M5 10v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V10"/>
            </svg>
          </span>
          <span className="bottom-nav__label">Reels</span>
        </NavLink>

        <NavLink to="/create-food" className={({ isActive }) => `bottom-nav__item bottom-nav__post ${isActive ? 'is-active' : ''}`}>
          <span className="bottom-nav__icon bottom-nav__plus" aria-hidden="true">+</span>
          <span className="bottom-nav__label">Post Reel</span>
        </NavLink>

        <NavLink to="/user/login" className={({ isActive }) => `bottom-nav__item ${isActive ? 'is-active' : ''}`}>
          <span className="bottom-nav__icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c.8-4 3.5-6 8-6s7.2 2 8 6" />
            </svg>
          </span>
          <span className="bottom-nav__label">Login</span>
        </NavLink>

        <NavLink to="/register" className={({ isActive }) => `bottom-nav__item bottom-nav__register ${isActive ? 'is-active' : ''}`}>
          <span className="bottom-nav__icon" aria-hidden="true">+</span>
          <span className="bottom-nav__label">Register</span>
        </NavLink>

        <NavLink to="/saved" className={({ isActive }) => `bottom-nav__item ${isActive ? 'is-active' : ''}`}>
          <span className="bottom-nav__icon" aria-hidden="true">
            {/* bookmark icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z"/>
            </svg>
          </span>
          <span className="bottom-nav__label">Saved</span>
        </NavLink>

      </div>
    </nav>
  )
}

export default BottomNav
