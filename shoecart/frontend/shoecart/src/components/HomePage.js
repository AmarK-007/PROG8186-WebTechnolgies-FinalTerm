import React from 'react';
import Product from './Product';
import Modal from 'react-modal';
import Lottie from 'react-lottie';
import Slider from 'react-input-slider';
import animationData from '../animations/shoecart_addtocart.json';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaArrowUp, FaGooglePay, FaCcVisa, FaCcMastercard, FaMoneyBillWave } from 'react-icons/fa'; // Import Font Awesome icons
import '../App.css';


// class component for home page
class HomePage extends React.Component {

    // Constructor to initialize state
    constructor(props) {
        super(props);
        this.state = {
            cart: [], // Initialize cart state
            total: 0, // Initialize total state
            products: [], // Initialize products state
            isModalOpen: false, // Initialize modal state

            serverError: false, // Initialize serverError state
            feedback: 0,
        };
    }

    handleAddToCart = () => {
        this.setState({ isModalOpen: true });
    };

    handleFeedbackChange = (pos) => {
        this.setState({ feedback: pos.x });
    };

    closeModal = () => {
        this.setState({ isModalOpen: false });
        this.props.fetchCart(); //fetches the cart
        //window.location.reload(); //reloads the page
    };
    componentDidMount() {
        fetch('http://localhost:5000/products')
            .then(response => response.json())
            .then(data => {
                console.log('API Response:', data); // Log the response data
                this.setState({ products: data });
                this.props.updateProducts(data); // Update the products in the App component
            })
            .catch(error => {
                console.error('Error:', error);
                this.setState({ serverError: true }); // Set serverError to true if there's an error
            });
    }
    componentDidUpdate(prevProps, prevState) {
        if (JSON.stringify(this.state.products) !== JSON.stringify(prevState.products)) {
            this.forceUpdate();
        }
        if (JSON.stringify(this.state.cart) !== JSON.stringify(prevState.cart)) {
            this.forceUpdate();
        }
    }

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

    // Function to remove a product from the cart
    removeFromCart = (index) => {
        const { cart } = this.state;
        const updatedCart = [...cart.slice(0, index), ...cart.slice(index + 1)];
        const total = this.calculateTotal(updatedCart);
        this.setState({ cart: updatedCart, total });
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

    render() {
        const { products, serverError } = this.state; // Use products from state
        const defaultOptions = {
            loop: true,
            autoplay: true,
            animationData: animationData,
            rendererSettings: {
                preserveAspectRatio: 'xMidYMid slice'
            }
        };
        return (
            <div className="App">
                {serverError ? (
                    <div className="error-message">Something broke. Please visit later.</div>
                ) : (
                    <>
                        <div className="webpage-content">
                            <h1><i>Welcome to Our Store!</i></h1>
                            <h3>AIR specializes in air-cushioned fashion sneakers. Because it is professional, it is excellent.</h3>
                        </div>
                        <h2>Best Sellers</h2>
                        <div className="products-container  flex-container">{/* scrollable-container */}
                            {products.map((product, index) => (
                                <Product key={index} product={product} addToCart={this.addToCart} />
                            ))}
                        </div>

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
                            <h2>Add to Cart</h2>
                            <div className="lottie-container">
                                <Lottie options={defaultOptions} height={'100%'} width={'100%'} />
                            </div>
                            {/* <button onClick={this.closeModal}>Close</button> */}
                        </Modal>
                        <br />
                        <br />
                        <div style={{ width: '100%', backgroundColor: '#666363' }}>
                            <br />
                            <div className="webpage-content">
                                <p>At present, our products include men’s air-cushion shoes, women’s air-cushion shoes, children’s air-cushion shoes,men's casual shoes, men's memory foam walking shoes and other series.
                                    <h4>Thanks to fans for their support, we will continue to update and optimize new styles to give everyone a better wearing experience.</h4>
                                </p>
                            </div>
                            <br />
                        </div>
                        <br />
                        <br />
                        <div className="info-row">
                            <div className="about-us">
                                <h2>About Us</h2>
                                <p>We are a team of passionate individuals who believe in the power of comfort and style. Our mission is to provide high-quality, air-cushioned shoes that don't compromise on style.</p>
                            </div>

                            <div className="testimonials">
                                <h2>What Our Customers Say</h2>
                                <p>"These are the most comfortable shoes I've ever worn!" - Rajinikanth</p>
                                <p>"I love the style and the comfort. Highly recommend!" - Johnny Depp</p>
                            </div>

                            <div className="contact-us customer-service">
                                <h2>Customer Service</h2>
                                <p>Call us at +1 226-898-4990 or email us at service@shoecart.com</p>
                                <p><a href="/myorders">Order Status</a></p>
                            </div>

                            <div className="social-media">
                                <h2>Follow Us</h2>
                                <div className="social-icons">
                                    <a href="https://www.facebook.com" target="_blank" rel="noreferrer"><FaFacebook className="icon" size={30} color="white" /></a>
                                    <a href="https://www.instagram.com" target="_blank" rel="noreferrer"><FaInstagram className="icon" size={30} color="white" /></a>
                                    <a href="https://www.twitter.com" target="_blank" rel="noreferrer"><FaTwitter className="icon" size={30} color="white" /></a>
                                    <a href="https://www.linkedin.com" target="_blank" rel="noreferrer"><FaLinkedin className="icon" size={30} color="white" /></a>
                                </div>
                                <br />
                                <div className="payment-methods">
                                    <h2>We Accept</h2>
                                    <div className="payment-icons">
                                        <FaCcVisa className="icon" size={30} color="white" />
                                        <FaCcMastercard className="icon" size={30} color="white" />
                                        <FaMoneyBillWave className="icon" size={30} color="white" />
                                        <FaGooglePay className="icon" size={30} color="white" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button className="back-to-top" style={{ width: '-webkit-fill-available' }} onClick={() => window.scrollTo(0, 0)}> <FaArrowUp /> Back to Top </button>

                        <div className="feedback-slider">
                            <h2>Give Us Your Feedback</h2>
                            <Slider
                                axis="x"
                                xstep={1}
                                xmin={1}
                                xmax={10}
                                x={this.state.feedback}
                                onChange={this.handleFeedbackChange}
                            />
                            <p>Your feedback: {this.state.feedback}</p>
                        </div>
                    </>
                )}
            </div>
        );
    }
}

export default HomePage;
