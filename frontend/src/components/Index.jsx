import React from 'react';
import { Link } from 'react-router-dom';

function Index() {
    return (
        <>
            <Link to="/admindashboard" className="header-link">Admin Login</Link>
            <br />
            <Link to="/studentdashboard" className="header-link">Student Login</Link>
        </>
    );
} 

export default Index;