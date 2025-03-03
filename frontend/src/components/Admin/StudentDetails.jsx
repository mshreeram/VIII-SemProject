import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "../../assets/Jobs.css";

function StudentDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    const student = location.state?.student;
    const [placements, setPlacements] = useState([]);

    useEffect(() => {
        if (student?.placements?.length > 0) {
            fetch("http://localhost:3000/getPlacementRecords", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ placementIds: student.placements })
            })
                .then(response => response.json())
                .then(data => setPlacements(data))
                .catch(error => console.error("Error fetching placements:", error));
        }
    }, [student]);

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
            {student.mobile && <p><strong>Mobile:</strong> {student.mobile}</p>}
            
            {student.skills && student.skills.length > 0 && (
                <div>
                    <h3>Skills</h3>
                    <ul>
                        {student.skills.map((skill, index) => (
                            <li key={index}>{skill}</li>
                        ))}
                    </ul>
                </div>
            )}
            
            {placements.length > 0 && (
                <div>
                    <h3>Placements</h3>
                    <ul>
                        {placements.map((placement, index) => (
                            <li key={index}>
                                <strong>{placement.companyName}</strong> - {placement.role} ({placement.package} LPA)
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            
            <button onClick={() => navigate(-1)} className="back-button">Back to Students</button>
        </div>
    );
}

export default StudentDetails;
