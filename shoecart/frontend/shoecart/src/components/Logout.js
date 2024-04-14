import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import '../App.css';

// class component for logout
const Logout = ({ clearCart }) => {
    useEffect(() => {
        // Clear the cart when the component is mounted
        clearCart();
    }, [clearCart]);

    const navigate = useNavigate(); // Use useNavigate hook
    const [loggedIn, setLoggedIn] = useState(true); // State to track login status

    // Logout logic
    const logout = useCallback(() => {
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
                    navigate('/login'); // Redirect to the login page
                } else {
                    console.error('Logout failed:', data.message);
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }, [navigate]); // Add navigate to the dependency array

    // Call logout function when component mounts
    useEffect(() => {
        logout();
    }, [logout]); // Add logout to the dependency array

    // Listen for changes in isLoggedIn value in local storage
    useEffect(() => {
        const handleStorageChange = () => {
            const isLoggedIn = localStorage.getItem('isLoggedIn');
            if (!isLoggedIn) {
                setTimeout(() => navigate('/login'), 0);
            }
        };

        window.addEventListener('storage', handleStorageChange);

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [navigate]); // Add navigate to the dependency array

    return null;
    // (
    //     <div>
    //         <div id="receipt-section" className="text-center">
    //             <h2 className="success-message">You have been successfully logged out...</h2>
    //         </div>

    //         {!loggedIn && (
    //             <button onClick={() => navigate('/login')}>Login</button>
    //         )}
    //     </div>
    // );
}

export default Logout;
