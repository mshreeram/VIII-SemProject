import { useState, useEffect } from 'react';
import React from 'react';
import LoginStudent from './LoginStudent';
// import '../assets/Jobs.css';

function Jobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('studentToken'));
    const [token, setToken] = useState(localStorage.getItem('studentToken') || '');

    const handleLogin = (token) => {
        setToken(token);
        setIsAuthenticated(true);
    };

    const fetchJobs = async () => {
        try {
            const response = await fetch('http://localhost:3000/getJobs');
            if (!response.ok) {
                throw new Error('Failed to fetch jobs');
            }
            const data = await response.json();
            setJobs(data.jobs);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('studentToken');
        window.location.reload();
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchJobs();
        }
    }, [isAuthenticated]);

    return (
        <div className="jobs-container">
            {!isAuthenticated ? (
                <LoginStudent onLogin={handleLogin} />
            ) : (
                <>
                    <span onClick={logout}>Logout</span>
                    {jobs.map((job) => (
                        <div className="job-card" key={job.companyname}>
                            <h2>{job.companyname}</h2>
                            <p><strong>Role:</strong> {job.role}</p>
                            <p><strong>Type:</strong> {job.isoncampus ? 'On Campus' : 'Off Campus'}</p>
                            {job.jd && <p><strong>Job Description:</strong> {job.jd}</p>}
                            {job.package && <p><strong>Package:</strong> {job.package} LPA</p>}
                            {job.numberofopenings && <p><strong>Openings:</strong> {job.numberofopenings}</p>}
                            {job.url && (
                                <p><a href={job.url} target="_blank" rel="noopener noreferrer">Apply Here</a></p>
                            )}
                            {job.adminmessage && <p><strong>Admin Message:</strong> {job.adminmessage}</p>}
                            <hr/>
                        </div>
                    ))}
                </>
            )}
        </div>
    );
    
}

export default Jobs;
