import React, { useState, useEffect, useContext } from 'react';
import CartContext from './CartContext';
import { useNavigate } from 'react-router-dom';

// functional component for user authentication
const UserAuthentication = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { clearCart } = useContext(CartContext);
    const navigate = useNavigate();

    // Function to check if user is logged in
    useEffect(() => {
        // Simulate authentication status check
        const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
        setIsLoggedIn(loggedIn);
    }, []);

    // Function to handle logout
    const handleLogout = () => {
        const confirmed = window.confirm('Are you sure you want to logout?');
        if (confirmed) {
            // Handle logout
            setIsLoggedIn(false);
            localStorage.setItem('isLoggedIn', 'false');
            localStorage.removeItem('cart'); // Clear the cart from local storage
            localStorage.removeItem('userId');// Clear the userId from local storage
            localStorage.removeItem('users');// Clear the users from local storage
            // Clear the cart
            clearCart();
            navigate('/login');
        }
    };

    return (
        <div>
            {isLoggedIn ? (
                <button onClick={handleLogout}>Logout</button>
            ) : (
                <a href="/login">Login</a>
            )}
        </div>
    );
}

export default UserAuthentication;
