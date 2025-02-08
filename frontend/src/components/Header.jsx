import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/Header.css';

function Header() {
    return (
        <header className="header-container">
            <Link to="/" className="header-link">
                <h1 className="header-title">Place Ease</h1>
            </Link>
        </header>
    );
} 

export default Header;