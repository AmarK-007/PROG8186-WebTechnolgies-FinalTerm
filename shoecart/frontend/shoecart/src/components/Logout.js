import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../App.css';

// class component for logout
const Logout = () => {
    const navigate = useNavigate(); // Use useNavigate hook
    const [loggedIn, setLoggedIn] = useState(true); // State to track login status

    // Logout logic
    const logout = () => {
        // Call the logout API
        fetch('http://localhost:5000/users/logout')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Update login status to false
                    setLoggedIn(false);

                    // Remove isLoggedIn and userId from local storage
                    localStorage.removeItem('isLoggedIn');
                    localStorage.removeItem('userId');

                    // Redirect to home page after logout
                    navigate('/'); // Redirect to the homepage
                } else {
                    console.error('Logout failed:', data.message);
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    // Call logout function when component mounts
    useEffect(() => {
        logout();
    }, []); // Empty dependency array ensures useEffect runs only once after mount

    return (
        <div>
            <div id="receipt-section" className="text-center">
                <h2 className="success-message">You have been successfully logged out...</h2>
            </div>

            {!loggedIn && (
                <button onClick={() => navigate('/login')}>Login</button>
            )}
        </div>
    );
}

export default Logout;
