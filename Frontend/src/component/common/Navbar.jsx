import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';
import './Navbar.css';

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const isAuthenticated = ApiService.isAuthenticated();
    const isAdmin = ApiService.isAdmin();
    const isUser = ApiService.isUser();
    const navigate = useNavigate();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu when window is resized
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setIsMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogout = () => {
        const isLogout = window.confirm('Are you sure you want to logout?');
        if (isLogout) {
            ApiService.logout();
            navigate('/home');
            setIsMenuOpen(false); // Close mobile menu after logout
        }
    };

    const toggleMobileMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
            <div className="navbar-container">
                <div className="navbar-brand">
                    <NavLink to="/home" onClick={closeMobileMenu}>
                        Turf Management
                    </NavLink>
                </div>

                {/* Mobile Menu Toggle */}
                <div 
                    className={`mobile-menu-toggle ${isMenuOpen ? 'active' : ''}`}
                    onClick={toggleMobileMenu}
                    aria-label="Toggle mobile menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

                {/* Navigation Menu */}
                <ul className={`navbar-ul ${isMenuOpen ? 'mobile-menu-open' : ''}`}>
                    <li>
                        <NavLink 
                            to="/home" 
                            className={({ isActive }) => isActive ? 'active' : ''}
                            onClick={closeMobileMenu}
                        >
                            Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink 
                            to="/turfs" 
                            className={({ isActive }) => isActive ? 'active' : ''}
                            onClick={closeMobileMenu}
                        >
                            Turfs
                        </NavLink>
                    </li>
                    <li>
                        <NavLink 
                            to="/find-booking" 
                            className={({ isActive }) => isActive ? 'active' : ''}
                            onClick={closeMobileMenu}
                        >
                            Find my Booking
                        </NavLink>
                    </li>

                    {/* User-specific links */}
                    {isUser && (
                        <li>
                            <NavLink 
                                to="/profile" 
                                className={({ isActive }) => isActive ? 'active' : ''}
                                onClick={closeMobileMenu}
                            >
                                Profile
                            </NavLink>
                        </li>
                    )}

                    {/* Admin-specific links */}
                    {isAdmin && (
                        <li>
                            <NavLink 
                                to="/admin" 
                                className={({ isActive }) => isActive ? 'active' : ''}
                                onClick={closeMobileMenu}
                            >
                                Admin
                            </NavLink>
                        </li>
                    )}

                    {/* Authentication links */}
                    {!isAuthenticated && (
                        <>
                            <li>
                                <NavLink 
                                    to="/login" 
                                    className={({ isActive }) => isActive ? 'active' : ''}
                                    onClick={closeMobileMenu}
                                >
                                    Login
                                </NavLink>
                            </li>
                            <li>
                                <NavLink 
                                    to="/register" 
                                    className={({ isActive }) => isActive ? 'active' : ''}
                                    onClick={closeMobileMenu}
                                >
                                    Register
                                </NavLink>
                            </li>
                        </>
                    )}

                    {/* Logout */}
                    {isAuthenticated && (
                        <li 
                            onClick={handleLogout} 
                            style={{ cursor: 'pointer' }}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    handleLogout();
                                }
                            }}
                        >
                            Logout
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;