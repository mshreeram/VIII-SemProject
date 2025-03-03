import { useState, useEffect } from 'react';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoginStudent from './LoginStudent';
import "../../assets/Jobs.css"

function Jobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('studentToken'));
    const navigate = useNavigate();
    const [studentName, setStudentName] = useState(localStorage.getItem('studentName'));
    const [studentID, setStudentID] = useState(localStorage.getItem('studentID'));

    const handleLogin = (token, studentName, studentID) => {
        localStorage.setItem('studentToken', token);
        localStorage.setItem('studentName', studentName);
        localStorage.setItem('studentID', studentID);
        setIsAuthenticated(true);
        window.location.reload();
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
        localStorage.removeItem('studentName');
        localStorage.removeItem('studentID');
        window.location.reload();
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchJobs();
        }
    }, [isAuthenticated, studentName, studentID]);

    const handleJobClick = (job) => {
        navigate(`/job/${job._id}`, { state: { job } });
    };

    return (
        <div className="jobs-container">
            {!isAuthenticated ? (
                <LoginStudent onLogin={handleLogin} />
            ) : (
                <>
                    <h2 className="jobs-title">Hello, {studentName}!!</h2>
                    <h2 className="jobs-title">Available Jobs</h2>
                    <div className="job-list">
                        {jobs.map((job) => (
                            <div className="job-card" key={job._id} onClick={() => handleJobClick(job)}>
                                <h3>{job.companyname}</h3>
                                <span className={`job-status ${job.isoncampus ? 'on-campus' : 'off-campus'}`}>
                                    {job.isoncampus ? 'On Campus' : 'Off Campus'}
                                </span>
                            </div>
                        ))}
                    </div>
                    <Link to="/addPlacementRecords" className='post-job'>Post Placement Records</Link>
                    <button className="logout-btn" onClick={logout}>Logout</button>
                </>
            )}
        </div>
    );
}

export default Jobs;
