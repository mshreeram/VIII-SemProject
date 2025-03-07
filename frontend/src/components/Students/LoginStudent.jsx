import { useState } from 'react';
import React from 'react';
import '../../assets/Forms.css'

function LoginStudent({ onLogin }) {
    const [domainmail, setdomainmail] = useState('');
    const [password, setPassword] = useState('');

    const loginStudent = async () => {
        try {
            const response = await fetch('http://localhost:3000/loginStudent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ domainmail, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error);
            }

            const data = await response.json();
            
            onLogin(data.token, data.student.name, data.student._id);
        } catch (error) {
            alert('Login failed: ' + error.message);
        }
    };

    return (
        <div className='form-container'>
            <h2>Student Login</h2>
            <input
                type="text"
                placeholder="domainmail"
                value={domainmail}
                onChange={(e) => setdomainmail(e.target.value)}
            />
            <br />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            <button onClick={loginStudent}>Login</button>
        </div>
    );
}

export default LoginStudent;
