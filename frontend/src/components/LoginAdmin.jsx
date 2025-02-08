import { useState } from 'react';
import React from 'react';

function LoginAdmin({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const loginAdmin = async () => {
        try {
            const response = await fetch('http://localhost:3000/loginAdmin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error);
            }

            const data = await response.json();
            localStorage.setItem('authToken', data.token);
            onLogin(data.token);
        } catch (error) {
            alert('Login failed: ' + error.message);
        }
    };

    return (
        <div>
            <h2>Admin Login</h2>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <br />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            <button onClick={loginAdmin}>Login</button>
        </div>
    );
}

export default LoginAdmin;
