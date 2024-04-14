import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import CartPage from './components/CartPage';
import Login from './components/Login';
import Logout from './components/Logout';
import AccountPage from './components/AccountPage';

// class component for the main app
class App extends Component {
    state = {
        cart: [], // Array to store selected products
        total: 0, // Total bill
        showModal: false, // Whether to show the modal
        showWarning: false
    };

    fetchCart = () => {
        // Get the user ID from local storage
        const userId = localStorage.getItem('userId');

        // Fetch the cart for the specific user
        fetch(`http://localhost:5000/carts?user_id=${userId}`)
            .then(response => response.json())
            .then(data => {
                const total = this.calculateTotal(data);
                this.setState({ cart: data, total }, () => {
                    console.log("Cart state:", this.state.cart); // Log the updated state
                });

                // Save updated cart data to local storage
                localStorage.setItem('cart', JSON.stringify(data));
            })
            .catch(error => console.error('Error:', error));
    };

    componentDidMount() {
        this.fetchCart();
    }

    // Function to add a product to the cart
    addToCart = (product) => {
        // Add product to cart in API
        fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product),
        })
            .then(() => {
                // Fetch the updated cart
                this.fetchCart();
            })
            .then(() => {
                // Update local state and local storage
                this.setState(prevState => {
                    const updatedCart = [...prevState.cart, product];
                    const total = this.calculateTotal(updatedCart);

                    // Save updated cart data to local storage
                    localStorage.setItem('cart', JSON.stringify(updatedCart));

                    return { cart: updatedCart, total };
                });
            })
            .catch(error => console.error('Error:', error));
    };

    // Function to remove a product from the cart
    removeFromCart = (index) => {
        this.setState(prevState => {
            const updatedCart = [...prevState.cart.slice(0, index), ...prevState.cart.slice(index + 1)];
            const total = this.calculateTotal(updatedCart);

            // Save updated cart data to local storage
            localStorage.setItem('cart', JSON.stringify(updatedCart));

            return { cart: updatedCart, total };
        });
    };

    // Function to handle buy now action
    handleBuyNow = () => {
        const { cart } = this.state;
        // Check if the cart is empty
        if (cart.length === 0) {
            // Show the warning
            this.setState({ showWarning: true });
        } else {
            // Check if the user is logged in
            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
            if (isLoggedIn) {
                // Show the modal
                this.setState({ showModal: true });
                // Clear the cart
                this.setState({ cart: [], total: 0 });

                // Clear the cart from local storage
                localStorage.removeItem('cart');

            } else {
                // Redirect the user to the login page
                window.location.href = '/login';
            }
        }
    };

    // Function to close the modal
    handleCloseModal = () => {
        this.setState({ showModal: false });
        // Redirect the user to the Home page
        window.location.href = '/';
    };

    // Function to close the warning
    handleCloseWarning = () => {
        this.setState({ showWarning: false });
    };

    // Function to calculate the total bill
    calculateTotal = (cart) => {
        return cart.reduce((total, product) => total + product.price, 0);
    };


    render() {
        const { cart, showModal, showWarning } = this.state;

        return (
            <Router>
                <div className="App">
                    <Header cart={cart} />
                    <Routes>
                        <Route path="/" element={<HomePage addToCart={this.addToCart} cart={this.state.cart} total={this.state.total} />} />
                        <Route path="/cart" element={<CartPage cart={this.state.cart} total={this.state.total} removeFromCart={this.removeFromCart} handleBuyNow={this.handleBuyNow} />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/logout" element={<Logout />} />
                        <Route path="/account" element={<AccountPage />} />
                    </Routes>
                    <Footer />

                    {showWarning && (
                        <p className="warning">
                            Your cart is empty.
                            <br />
                            Please add some products before checking out.
                            <br />
                            <button onClick={this.handleCloseWarning}>Close</button>
                        </p>
                    )}

                    <Modal show={showModal} onHide={this.handleCloseModal}>
                        <Modal.Header>
                            <Modal.Title><h2>Order Placed Successfully!</h2></Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <br />
                            Thank you for your Cash-on delivery mode purchase! Your order has been successfully placed.
                            We will send you a confirmation email shortly with details about your order.
                            <br />
                            <br />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.handleCloseModal}>
                                Continue Shopping
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </Router>
        );
    }
}

export default App;
