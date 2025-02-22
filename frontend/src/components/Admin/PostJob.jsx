import { useState } from 'react';
import React from 'react';
import '../../assets/PostJob.css';
import LoginAdmin from './LoginAdmin';

function PostJob() {
    const [formData, setFormData] = useState({
        companyname: '',
        role: '',
        isoncampus: false,
        jd: '',
        package: '',
        numberofopenings: '',
        url: '',
        adminmessage: ''
    });
    
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let token = localStorage.getItem("authToken");
        try {
            if (!token) {
                return <LoginAdmin />
            }
            console.log(formData);
            
            const response = await fetch('http://localhost:3000/postJob', {
                method: 'POST',
                headers: { Authorization: `BEARER ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                alert('Job posted successfully!');
                setFormData({
                    companyname: '', role: '', isoncampus: false, jd: '', package: '', numberofopenings: '', url: '', adminmessage: ''
                });
            } else {
                alert('Failed to post job');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error posting job');
        }
    };

    return (
        <div className="post-job-container">
            <h2>Post a Job</h2>
            <form onSubmit={handleSubmit}>
                <label>Company Name *</label>
                <input type="text" name="companyname" value={formData.companyname} onChange={handleChange} required />
                
                <label>Role *</label>
                <input type="text" name="role" value={formData.role} onChange={handleChange} required />
                
                <label>On Campus?</label>
                <input type="checkbox" name="isoncampus" checked={formData.isoncampus} onChange={handleChange} />
                
                <label>Job Description</label>
                <textarea name="jd" value={formData.jd} onChange={handleChange}></textarea>
                
                <label>Package (in LPA)</label>
                <input type="number" name="package" value={formData.package} onChange={handleChange} />
                
                <label>Number of Openings</label>
                <input type="number" name="numberofopenings" value={formData.numberofopenings} onChange={handleChange} />
                
                <label>Application URL</label>
                <input type="url" name="url" value={formData.url} onChange={handleChange} />
                
                <label>Admin Message</label>
                <textarea name="adminmessage" value={formData.adminmessage} onChange={handleChange}></textarea>
                
                <button type="submit">Post Job</button>
            </form>
        </div>
    );
}

export default PostJob;
