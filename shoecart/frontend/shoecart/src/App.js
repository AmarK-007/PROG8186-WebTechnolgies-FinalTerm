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
import { CartContext, CartProvider } from './components/CartContext';
import AuthContext from './components/AuthContext';
import ProductDetail from './components/ProductDetail'; // Import the ProductDetail component
import Modal from 'react-modal';
import Lottie from 'react-lottie';
import animationDataOrder from './animations/shoecart_orderplaced.json';
import animationDataCart from './animations/shoecart_addtocart.json';

Modal.setAppElement('#root');

// class component for the main app
class App extends Component {
    state = {
        cart: [],
        products: [], // Array to store selected products
        total: 0, // Total bill
        showModal: false, // Whether to show the modal
        showWarning: false, // Whether to show the warning
        isLoggedIn: false,
        signupModalIsOpen: false,
        orderData: null,
        paymentMethod: 'card',
        isModalOpen: false, // Initialize modal state
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

    /*  // Function to add a product to the cart
     addToCart = (product) => {
         console.log('Sending product to server:', product);
 
         fetch('http://localhost:5000/carts', {
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
     }; */

    // Function to add a product to the cart
    addToCart = (product) => {
        const userId = Number(localStorage.getItem('userId')); // Fetch the user_id from the local storage
        console.log('userId:', userId); // Log the userId
        // Make a POST request to the cart API
        fetch('http://localhost:5000/carts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: userId, // Use the fetched user_id
                product_id: product.product_id,
                quantity: product.quantity,
                size: product.size
            }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Cart API Response:', data);

                // Update the state only when the API request is successful
                const updatedProduct = { ...product, price: product.price, quantity: product.quantity };
                const updatedCart = [...this.state.cart, updatedProduct];
                const total = this.calculateTotal(updatedCart);
                this.setState({ cart: updatedCart, total });
                console.log("Updated Cart:", updatedCart);
                console.log("Total:", total);
                this.handleAddToCart();
            })
            .catch(error => {
                console.error('Error:', error);

                // Show a popup message when the API request fails
                alert('Failed to add the product to the cart. Please try again.');
            });
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

                // Calculate the new state outside of setState
                let newState = {};
                if (isClearAll) {
                    newState = { cart: [], total: 0 };
                    // Clear the cart from local storage
                    localStorage.removeItem('cart');
                } else {
                    const updatedCart = this.state.cart.filter(item => item.cart_id !== cartId);
                    const total = this.calculateTotal(updatedCart);
                    newState = { cart: updatedCart, total };

                    // Update the cart in local storage
                    localStorage.setItem('cart', JSON.stringify(updatedCart));
                }
                // Update the state 

                this.setState(newState, () => {
                    // Show a success message
                    if (isClearAll) {
                        console.log("All items cleared from cart successfully!");
                    } else {
                        console.log("Item removed from cart successfully!");
                    }
                });

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

    handlePaymentMethodChange = (paymentMethod) => {
        this.setState({ paymentMethod });
    }
    // Function to handle buy now action
    handleBuyNow = async () => {
        const { cart, total, paymentMethod } = this.state;
        // Check if the cart is empty
        if (cart.length === 0) {
            // Show the warning
            this.setState({ showWarning: true });
        } else {
            // Check if the user is logged in
            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
            if (isLoggedIn) {
                // Prepare the order details
                const orderDetails = cart.map(item => ({
                    product_id: item.id,
                    quantity: item.quantity,
                    product_size: item.size,
                }));

                // Prepare the order data
                const orderData = {
                    user_id: 1, // Replace with the actual user ID
                    total_amount: total,
                    order_date: new Date().toISOString().split('T')[0],
                    payment_method: paymentMethod,
                    delivery_status: 'Order Placed. Pending Delivery',
                    return_status: 'No Return',
                    orderdetails: orderDetails,
                };

                // Make a POST request to the orders API
                const response = await fetch('http://localhost:5000/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(orderData),
                });

                if (response.ok) {
                    // Show the modal
                    this.setState({ showModal: true, orderData });
                    // Clear the cart
                    this.setState({ cart: [], total: 0 });

                    // Clear the cart from local storage
                    localStorage.removeItem('cart');
                    try {
                        await this.clearCartAPICall(null, true);
                    } catch (error) {
                        console.error('Error clearing server cart:', error);
                    }
                    // Show a popup with a valid message
                    console.log("Your order has been placed successfully!");
                } else {
                    // Show a popup with an error message
                    alert('There was an error placing your order. Please try again.');
                    console.log("There was an error placing your order. Please try again.");
                }
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
    handleAddToCart = () => {
        this.setState({ isModalOpen: true });
    };

    handleFeedbackChange = (pos) => {
        this.setState({ feedback: pos.x });
    };

    closeModal = () => {
        this.setState({ isModalOpen: false });
        this.fetchCart(); //fetches the cart
        //window.location.reload(); //reloads the page
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

    openSignupModal = () => {
        this.setState({ signupModalIsOpen: true });
    }

    closeSignupModal = () => {
        this.setState({ signupModalIsOpen: false });
    }

    render() {
        const { cart, showModal, showWarning } = this.state;

        const defaultOptionsOrder = {
            loop: true,
            autoplay: true,
            animationData: animationDataOrder, // use different animation data
            rendererSettings: {
                preserveAspectRatio: 'xMidYMid slice'
            }
        };

        const defaultOptionsCart = {
            loop: true,
            autoplay: true,
            animationData: animationDataCart, // use different animation data
            rendererSettings: {
                preserveAspectRatio: 'xMidYMid slice'
            }
        };

        return (
            <AuthContext.Provider
                value={{
                    isLoggedIn: this.state.isLoggedIn,
                    onLogin: this.handleLogin,
                    onLogout: this.handleLogout,
                }}
            >
                <CartProvider clearCartAPICall={this.clearCartAPICall} value={{ cart: this.state.cart }}>
                    <Router>
                        <div className="App">
                            <Header products={this.state.products} cart={cart} />
                            <Routes>
                                <Route path="/" element={<HomePage addToCart={this.addToCart} updateProducts={this.updateProducts} cart={this.state.cart} total={this.state.total} fetchCart={this.fetchCart} showSignupButton={true} />} />
                                <Route path="/cart" element={<CartPage cart={this.state.cart} total={this.state.total} products={this.state.products}
                                    removeFromCart={this.removeFromCart} handleBuyNow={this.handleBuyNow} orderData={this.state.orderData} clearCartAPICall={this.clearCartAPICall}
                                    onPaymentMethodChange={this.handlePaymentMethodChange} showSignupButton={false} />} />
                                <Route path="/myorders" element={<MyOrders products={this.state.products} showSignupButton={false} />} />
                                <Route path="/login" element={<Login />} showSignupButton={false} />
                                <Route path="/logout" element={<Logout clearCartLocallyOnLogout={this.clearCartLocallyOnLogout} showSignupButton={false} />} />
                                <Route path="/account" element={<AccountPage />} showSignupButton={false} />
                                <Route path="/product/:id" element={<ProductDetail addToCart={this.addToCart} showSignupButton={false} />} />
                            </Routes>
                            {this.props.showSignupButton && (
                                <button onClick={this.openSignupModal}>Sign Up for Gift Card</button>
                            )}
                            <Modal
                                isOpen={this.state.signupModalIsOpen}
                                onRequestClose={this.closeSignupModal}
                                contentLabel="Signup for Gift Card Modal"
                                overlayClassName="modal-animation-overlay"
                                className="modal-animation-content scrollable-container"
                            >
                                <button
                                    onClick={this.closeSignupModal}
                                    className="close-button"
                                    img="/images/close.jpg"
                                />
                                <h2>Sign Up for a Gift Card!</h2>
                                <p>Enter your details below to sign up for a chance to win a gift card.</p>
                                <form>
                                    <label>
                                        Email address
                                        <input type="email" required />
                                    </label>
                                    <button type="submit">Sign Up</button>
                                </form>
                                <img src="/images/gift.gif" style={{ width: '180px', height: '180px', objectFit: 'cover' }} alt="Loading..." /> {/* Add your GIF here */}
                            </Modal>

                            <Modal
                                isOpen={this.state.isModalOpen}
                                onRequestClose={this.closeModal}
                                overlayClassName="modal-animation-overlay"
                                className="modal-animation-content scrollable-container"
                            >
                                <button
                                    onClick={this.closeModal}
                                    className="close-button"
                                    img="/images/close.jpg"
                                />
                                <h2>Item Added to Cart</h2>
                                <div className="lottie-container">
                                    <Lottie options={defaultOptionsCart} height={'100%'} width={'100%'} />
                                </div>
                                {/* <button onClick={this.closeModal}>Close</button> */}
                            </Modal>
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


                            <Modal
                                isOpen={this.state.showModal}
                                onRequestClose={this.handleCloseModal}
                                overlayClassName="modal-animation-overlay"
                                className="modal-animation-content scrollable-container"
                            >
                                <button onClick={this.handleCloseModal} className="close-button">
                                    <img src="/images/close.jpg" alt="Close" />
                                </button>
                                <h2>Order Placed Successfully!</h2>
                                <div className="lottie-container">
                                    <Lottie options={defaultOptionsOrder} height={'100%'} width={'100%'} />
                                </div>
                                <p>
                                    Thank you for your {this.state.orderData ? this.state.orderData.payment_method : ''} purchase! Your order has been successfully placed.
                                    We will send you a confirmation email shortly with details about your order.
                                </p>
                                <button onClick={this.handleCloseModal}>Continue Shopping</button>
                            </Modal>

                        </div>
                    </Router>
                </CartProvider>
            </AuthContext.Provider >
        );
    }
}

export default App;
