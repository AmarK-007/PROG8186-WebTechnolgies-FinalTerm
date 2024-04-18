import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Modal as BootstrapModal, Button } from 'react-bootstrap';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import CartPage from './components/CartPage';
import MyOrders from './components/MyOrders';
import Login from './components/Login';
import Logout from './components/Logout';
import AccountPage from './components/AccountPage';
import CartContext from './components/CartContext';
import AuthContext from './components/AuthContext';

// class component for the main app
class App extends Component {
    state = {
        cart: [],
        products: [], // Array to store selected products
        total: 0, // Total bill
        showModal: false, // Whether to show the modal
        showWarning: false, // Whether to show the warning
        isLoggedIn: false,
    };

    handleLogin = () => {
        this.setState({ isLoggedIn: true });
        localStorage.setItem('isLoggedIn', 'true');
    };

    handleLogout = () => {
        this.setState({ isLoggedIn: false }, () => {
            localStorage.setItem('isLoggedIn', 'false');
            localStorage.removeItem('userId');
            window.location.href = '/login';
            window.location.reload();
        });
    };

    updateProducts = (products) => {
        this.setState({ products });
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
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        this.setState({ isLoggedIn });
    }

    // Function to add a product to the cart
    addToCart = (product) => {
        console.log('Sending product to server:', product);

        fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product),
        })
            .then(response => {
                console.log('Response from server:', response);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(() => {
                this.fetchCart();
            })
            .then(() => {
                this.setState(prevState => {
                    const updatedProduct = { ...product, price: product.price, quantity: product.quantity };
                    const updatedCart = [...prevState.cart, updatedProduct];
                    const total = this.calculateTotal(updatedCart);

                    localStorage.setItem('cart', JSON.stringify(updatedCart));

                    return { cart: updatedCart, total };
                });
            })
            .catch(error => console.error('Error:', error));
    };
    
    // Function to clear the cart
    clearCartAPICall = (cartId, isClearAll) => {
        // Get the user ID from local storage
        const userId = localStorage.getItem('userId');
    
        // Determine the API endpoint based on isClearAll
        const endpoint = isClearAll ? `http://localhost:5000/carts?user_id=${userId}` : `http://localhost:5000/carts?cart_id=${cartId}`;
    
        fetch(endpoint, {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Delete API Response:', data);
    
            // Update the state only when the API request is successful
            if (isClearAll) {
                this.setState({ cart: [], total: 0 }, () => {
                    // Clear the cart from local storage
                    localStorage.removeItem('cart');
    
                    // Show a success message
                    alert('All items cleared from cart successfully!');
                });
            } else {
                this.setState(prevState => {
                    const updatedCart = prevState.cart.filter(item => item.cart_id !== cartId);
                    const total = this.calculateTotal(updatedCart);
    
                    // Update the cart in local storage
                    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
                    // Show a success message
                    alert('Item removed from cart successfully!');
    
                    return { cart: updatedCart, total };
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
    
            // Show a popup message when the API request fails
            alert('Failed to clear the cart. Please try again.');
        });
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
        return cart.reduce((total, product) => {
            if (product && product.price && !isNaN(product.price) && product.quantity && !isNaN(product.quantity)) {
                return total + product.price * product.quantity;
            } else {
                return total;
            }
        }, 0);
    };

    clearCartLocallyOnLogout = () => {
        this.setState({ cart: [], total: 0 });
        localStorage.removeItem('cart');
    };

    render() {
        const { cart, showModal, showWarning } = this.state;

        return (
            <AuthContext.Provider
                value={{
                    isLoggedIn: this.state.isLoggedIn,
                    onLogin: this.handleLogin,
                    onLogout: this.handleLogout,
                }}
            >
                <CartContext.Provider value={{ cart: this.state.cart, clearCartAPICall: this.clearCartAPICall }}>
                    <Router>
                        <div className="App">
                            <Header products={this.state.products} cart={cart} />
                            <Routes>
                                <Route path="/" element={<HomePage addToCart={this.addToCart} updateProducts={this.updateProducts} cart={this.state.cart} total={this.state.total} fetchCart={this.fetchCart} />} />
                                <Route path="/cart" element={<CartPage cart={this.state.cart} total={this.state.total} products={this.state.products} removeFromCart={this.removeFromCart} handleBuyNow={this.handleBuyNow} />} />
                                <Route path="/myorders" element={<MyOrders products={this.state.products} />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/logout" element={<Logout clearCartLocallyOnLogout={this.clearCartLocallyOnLogout} />} />
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

                            <BootstrapModal show={showModal} onHide={this.handleCloseModal}>
                                <BootstrapModal.Header>
                                    <BootstrapModal.Title><h2>Order Placed Successfully!</h2></BootstrapModal.Title>
                                </BootstrapModal.Header>
                                <BootstrapModal.Body>
                                    <br />
                                    Thank you for your Cash-on delivery mode purchase! Your order has been successfully placed.
                                    We will send you a confirmation email shortly with details about your order.
                                    <br />
                                    <br />
                                </BootstrapModal.Body>
                                <BootstrapModal.Footer>
                                    <Button variant="secondary" onClick={this.handleCloseModal}>
                                        Continue Shopping
                                    </Button>
                                </BootstrapModal.Footer>
                            </BootstrapModal>
                        </div>
                    </Router>
                </CartContext.Provider>
            </AuthContext.Provider>
        );
    }
}

export default App;
