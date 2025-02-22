import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import '../../assets/Forms.css'

function RegisterStudent() {
    const [domainmail, setDomainMail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [mobile, setMobile] = useState('');
    const [email, setemail] = useState('');
    const [skills, setSkills] = useState([]);

    const navigate = useNavigate();

    const skillOptions = ['C', 'C++', 'Java', 'Python', 'JavaScript', 'React', 'Node.js', 'SQL'];

    const validateDomainMail = (email) => {
        return /^[^@]+@gvpce\.ac\.in$/.test(email);
    };

    const validateMobile = (num) => {
        return num === '' || /^[6-9]\d{9}$/.test(num);
    };

    const registerStudent = async () => {
        if (!validateDomainMail(domainmail)) {
            alert('Invalid domain mail. Use format: anything@gvpce.ac.in');
            return;
        }
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        if (!validateMobile(mobile)) {
            alert('Invalid mobile number');
            return;
        }
        
        try {
            const response = await fetch('http://localhost:3000/registerStudent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ domainmail, password, mobile, email, skills }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error);
            }

            const data = await response.json();
            if (data.message) {
                alert(data.message);
                localStorage.removeItem('studentToken');
                navigate('/studentdashboard');
            }
        } catch (error) {
            alert('Registration failed: ' + error.message);
        }
    };

    const handleSkillChange = (skill) => {
        setSkills((prevSkills) =>
            prevSkills.includes(skill) ? prevSkills.filter(s => s !== skill) : [...prevSkills, skill]
        );
    };

    return (
        <div className='form-container'>
            <h2>Student Register</h2>
            <input
                type="text"
                placeholder="Domain Mail*"
                value={domainmail}
                onChange={(e) => setDomainMail(e.target.value)}
            />
            <br />
            <input
                type="password"
                placeholder="Password*"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            <input
                type="password"
                placeholder="Re-enter Password*"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <br />
            <input
                type="text"
                placeholder="Mobile"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
            />
            <br />
            <input
                type="text"
                placeholder="Personal Mail"
                value={email}
                onChange={(e) => setemail(e.target.value)}
            />
            <br />
            <div>
                <label>Skills:</label>
                <div className="skills-container">
                    {skillOptions.map(skill => (
                        <div key={skill}>
                            <input
                                type="checkbox"
                                checked={skills.includes(skill)}
                                onChange={() => handleSkillChange(skill)}
                            /> {skill}
                        </div>
                    ))}
                </div>
            </div>
            <br />
            <button onClick={registerStudent}>Register</button>
        </div>
    );
}

export default RegisterStudent;
