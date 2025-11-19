// src/components/TopNavbar.jsx
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './TopNavbar.css';
import logo from '../components/assets/logoAutoecole.jpg';
import { ActiveLinkContext } from './context/ActiveLinkContext';

const TopNavbar = () => {
    const navigate = useNavigate();
    const { activeLink, setActiveLink } = useContext(ActiveLinkContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        navigate('/');
    };

    const handleLinkClick = (link) => {
        setActiveLink(link);
        setIsMenuOpen(false);
    };

    return (
        <nav className="top-navbar">
            <div className="navbar-container">
                {/* Professional Logo with Container */}
                <div className="logo-container">
                    <Link to="/dashboard" id='link'>
                        <div className="logo-wrapper">
                            <img src={logo} alt="Auto-École AZIZ Logo" className="logo-image" />
                            <div className="logo-text-container">
                                <span className="logo-title">Auto-École</span>
                                <span className="logo-subtitle">AZIZ HASSOUNI</span>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <div className="nav-links-container">
                    <ul className="nav-links">
                        <li className={activeLink === 'dashboard' ? 'active' : ''}>
                            <Link to="/dashboard" onClick={() => handleLinkClick('dashboard')}>
                                <span className="nav-icon"><i className="fas fa-home"></i></span>
                                <span className="nav-text">Accueil</span>
                            </Link>
                        </li>
                        <li className={activeLink === 'clients' ? 'active' : ''}>
                            <Link to="/clients" onClick={() => handleLinkClick('clients')}>
                                <span className="nav-icon"><i className="fas fa-users"></i></span>
                                <span className="nav-text">Clients</span>
                            </Link>
                        </li>
                        <li className={activeLink === 'paiements' ? 'active' : ''}>
                            <Link to="/paiements" onClick={() => handleLinkClick('paiements')}>
                                <span className="nav-icon"><i className="fas fa-money-bill-wave"></i></span>
                                <span className="nav-text">Paiements</span>
                            </Link>
                        </li>
                        <li className={activeLink === 'examens' ? 'active' : ''}>
                            <Link to="/examens" onClick={() => handleLinkClick('examens')}>
                                <span className="nav-icon"><i className="fas fa-calendar-alt"></i></span>
                                <span className="nav-text">Examens</span>
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Mobile Menu Button */}
                <button 
                    className={`hamburger ${isMenuOpen ? 'open' : ''}`}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                {/* Logout Button */}
                <div className="logout-container">
                    <button
                        className="logout-btn"
                        onClick={handleLogout}
                        aria-label="Déconnexion"
                    >
                        <span className="logout-icon"><i className="fas fa-sign-out-alt"></i></span>
                        <span className="logout-text">Déconnexion</span>
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
                <ul>
                    <li className={activeLink === 'dashboard' ? 'active' : ''}>
                        <Link to="/dashboard" onClick={() => handleLinkClick('dashboard')}>
                            <span className="nav-icon"><i className="fas fa-home"></i></span>
                            <span className="nav-text">Accueil</span>
                        </Link>
                    </li>
                    <li className={activeLink === 'clients' ? 'active' : ''}>
                        <Link to="/clients" onClick={() => handleLinkClick('clients')}>
                            <span className="nav-icon"><i className="fas fa-users"></i></span>
                            <span className="nav-text">Clients</span>
                        </Link>
                    </li>
                    <li className={activeLink === 'paiements' ? 'active' : ''}>
                        <Link to="/paiements" onClick={() => handleLinkClick('paiements')}>
                            <span className="nav-icon"><i className="fas fa-money-bill-wave"></i></span>
                            <span className="nav-text">Paiements</span>
                        </Link>
                    </li>
                    <li className={activeLink === 'examens' ? 'active' : ''}>
                        <Link to="/examens" onClick={() => handleLinkClick('examens')}>
                            <span className="nav-icon"><i className="fas fa-calendar-alt"></i></span>
                            <span className="nav-text">Examens</span>
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default TopNavbar;