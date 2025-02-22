import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "../../assets/Jobs.css";

function JobDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    const job = location.state?.job;

    if (!job) {
        return <div className="loading">Job details not found.</div>;
    }

    return (
        <div className="job-details-container">
            <h2>{job.companyname}</h2>
            <p><strong>Role:</strong> {job.role}</p>
            <p><strong>Type:</strong> <span className={`job-status ${job.isoncampus ? 'on-campus' : 'off-campus'}`}>
                {job.isoncampus ? 'On Campus' : 'Off Campus'}
            </span></p>
            {job.jd && <p><strong>Job Description:</strong> {job.jd}</p>}
            {job.package && <p><strong>Package:</strong> {job.package} LPA</p>}
            {job.numberofopenings && <p><strong>Openings:</strong> {job.numberofopenings}</p>}
            {job.url && <p><a href={job.url} target="_blank" rel="noopener noreferrer">Apply Here</a></p>}
            {job.adminmessage && <p><strong>Admin Message:</strong> {job.adminmessage}</p>}
            <button onClick={() => navigate(-1)} className="back-button">Back to Jobs</button>
        </div>
    );
}

export default JobDetails;
