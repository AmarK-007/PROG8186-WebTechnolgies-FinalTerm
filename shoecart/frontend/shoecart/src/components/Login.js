import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from './AuthContext';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loginError, setLoginError] = useState(false);

    const { onLogin } = useContext(AuthContext);

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (isLoggedIn === 'true') {
            setIsLoggedIn(true);
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch('http://localhost:5000/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                if (data.status) {
                    setIsLoggedIn(true);
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('userId', data.user_id);
                    onLogin(); // Call onLogin function from AuthContext
                    window.location.href = '/';
                } else {
                    setLoginError(true);
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                setLoginError(true);
            });
    };

    // Function to handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'username') {
            setUsername(value);
        } else if (name === 'password') {
            setPassword(value);
        }
    };

    return (
        <div className="container-fluid mt-5 container-form-Login-logout">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title text-center mb-4" style={{ color: 'white' }}>Login</h2>
                            <hr className="white-line" />
                            <br />
                            {loginError && <p className="text-danger" style={{ color: 'red' }}>Invalid username or password</p>}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="username" className="form-label" style={{ color: 'white' }}>Username</label>
                                    <input type="text" name="username" id="username" className="form-control" value={username} onChange={handleChange} placeholder="Enter your username" required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label" style={{ color: 'white' }}>Password</label>
                                    <input type="password" name="password" id="password" className="form-control" value={password} onChange={handleChange} placeholder="Enter your password" required />
                                </div>
                                <br />
                                <button type="submit" className="btn btn-primary">Login</button>
                            </form>
                            <p className="mt-3" style={{ color: 'blue' }}>Don't have an account? <Link to="/account">Create Account</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
