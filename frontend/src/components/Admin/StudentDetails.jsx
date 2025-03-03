import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "../../assets/Jobs.css";

function StudentDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    const student = location.state?.student;

    if (!student) {
        return <div className="loading">Student details not found.</div>;
    }

    return (
        <div className="job-details-container">
            <h2>{student.name}</h2>
            <p><strong>Regd. Number:</strong> {student.regdno}</p>
            <p><strong>Branch:</strong> {student.branch}</p>
            <p><strong>Section:</strong> {student.section}</p>
            <p><strong>Passout Year:</strong> {student.passoutyear}</p>
            <p><strong>CGPA:</strong> {student.cgpa}</p>
            {student.email && <p><strong>Email:</strong> {student.email}</p>}
            {student.mobile && <p><strong>:</strong> {student.mobile}</p>}
            <button onClick={() => navigate(-1)} className="back-button">Back to Students</button>
        </div>
    );
}

export default StudentDetails;
