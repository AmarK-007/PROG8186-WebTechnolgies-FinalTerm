import React from 'react';
import Product from './Product';
import '../App.css';

// class component for home page
class HomePage extends React.Component {

    // Constructor to initialize state
    constructor(props) {
        super(props);
        this.state = {
            cart: [], // Initialize cart state
            total: 0, // Initialize total state
            products: [] // Initialize products state
        };
    }

    componentDidMount() {
        fetch('http://localhost:5000/products')
            .then(response => response.json())
            .then(data => {
                console.log('API Response:', data); // Log the response data
                this.setState({ products: data });
                this.props.updateProducts(data); // Update the products in the App component
            })
            .catch(error => console.error('Error:', error));
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
                const updatedCart = [...this.state.cart, product];
                const total = this.calculateTotal(updatedCart);
                this.setState({ cart: updatedCart, total });

                console.log("Updated Cart:", updatedCart);
                console.log("Total:", total);
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
        return cart.reduce((total, product) => total + product.price * product.quantity, 0);
    };

    render() {
        const { products } = this.state; // Use products from state

        return (
            <div className="App">
                <div className="webpage-content">
                    <h1><i>Welcome to Our Store!</i></h1>
                    <h3>AIR specializes in air-cushioned fashion sneakers. Because it is professional, it is excellent.</h3>
                    <p>At present, our products include men’s air-cushion shoes, women’s air-cushion shoes, children’s air-cushion shoes,men's casual shoes, men's memory foam walking shoes and other series.
                        <h4>Thanks to fans for their support, we will continue to update and optimize new styles to give everyone a better wearing experience.</h4>
                    </p>
                </div>
                <div className="products-container scrollable-container flex-container">
                    {products.map((product, index) => (
                        <Product key={index} product={product} addToCart={this.addToCart} />
                    ))}
                </div>
            </div>
        );
    }
}

export default HomePage;
