import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/index.css';

function Index() {
    return (
        <div className="index-container">
            <Link to="/admindashboard" className="header-link">Admin Login</Link>
            <Link to="/studentdashboard" className="header-link">Student Login</Link>
            <Link to="/registerstudent" className="header-link">Student Register</Link>
        </div>
    );
}

export default Index;
