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
            })
            .catch(error => console.error('Error:', error));
    }
    // Function to add a product to the cart
    addToCart = (product) => {
        const updatedCart = [...this.state.cart, product];
        const total = this.calculateTotal(updatedCart);
        this.setState({ cart: updatedCart, total });
        console.log("Updated Cart:", updatedCart);

        console.log("Total:", total);
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
