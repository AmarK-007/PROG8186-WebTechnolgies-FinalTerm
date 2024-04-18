import React, { Component } from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../App.css';

// class component for product
class Product extends Component {
    constructor(props) {
        super(props);
        this.state = {
            quantity: 0,
            size: '0',
            warning: ''
        };
    }

    // Function to handle quantity change
    handleQuantityChange = (amount) => {
        this.setState(prevState => {
            const newQuantity = prevState.quantity + amount;
            return { quantity: Math.max(1, Math.min(99, newQuantity)) }; // Ensure quantity is between 1 and 99
        });
    };

    // Function to handle size change
    handleSizeChange = (event) => {
        this.setState({ size: event.target.value });
    };

    // Function to handle adding product to cart
    handleAddToCart = () => {
        const { product, addToCart } = this.props;
        const { size } = this.state;

        let quantity = parseInt(this.state.quantity);
        quantity = Math.max(1, Math.min(99, quantity));

        if (quantity === 0) {
            this.setState({ warning: 'Please select a quantity.' });
            return;
        }

        if (size === '0') {
            this.setState({ warning: 'Please select a size.' });
            return;
        }

        const productToAdd = {
            ...product,
            quantity,
            size,
            user_id: localStorage.getItem('userId'), // Replace with the actual user ID
            product_id: product.product_id // Replace with the actual product ID
        };
        console.log('Adding product to cart:', productToAdd);
        addToCart(productToAdd);
        console.log(productToAdd.quantity, productToAdd.size, productToAdd.name, productToAdd.price);

        // Clear the warning
        this.setState({ warning: '' });
    };

    render() {
        const { product } = this.props;
        const { title, description, price, image_url, sizes } = product;
        const { quantity, size } = this.state;

        const settings = {
            dots: true,
            infinite: false,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            centerMode: true,
            centerPadding: '30px',
        };

        return (

            <div className="product">
                <div className="product-images">
                    <Slider {...settings}>
                        {image_url && image_url.map((image, index) => {
                            console.log('Image prop:', image);
                            console.log('With PUBLIC_URL:', process.env.PUBLIC_URL + image);

                            return (
                                <div key={index}>
                                    <img
                                        className="product-image"
                                        src={process.env.PUBLIC_URL + image}
                                        alt={title}
                                        style={{
                                            width: '300px',
                                            height: '250px',
                                            objectFit: 'cover',
                                            transition: 'transform 0.2s',
                                            ':hover': {
                                                transform: 'scale(1.2)'
                                            }
                                        }}
                                    />
                                </div>
                            );
                        })}
                    </Slider>
                </div>
                <div className="product-details">
                    <br />
                    <Link to={`/product/${product.product_id}`}>
                        <h3>{title}</h3>
                        <p>{description}</p>
                        <p>Price: ${price}</p>
                    </Link>
                    <div className="quantity-selector">
                        <label htmlFor="quantity">Quantity:&nbsp;</label>
                        <button className="quantity-button" onClick={() => this.handleQuantityChange(-1)}>-</button>
                        &nbsp;
                        <input type="text" className="quantity-input" value={quantity} readOnly />
                        &nbsp;
                        <button className="quantity-button" onClick={() => this.handleQuantityChange(1)}>+</button>
                    </div>
                    <div>
                        <label htmlFor="size">Size (US):&nbsp;</label>
                        <select id="size" className="size-input" value={size} onChange={this.handleSizeChange}>
                            <option value="0">Select</option>
                            {sizes.map((size, index) => (
                                <option key={index} value={size.size_us}>{size.size_us}</option>
                            ))}
                        </select>
                    </div>
                    {this.state.warning !== '' ? (
                        <p className="warning" style={{ color: 'red' }}>{this.state.warning}</p>
                    ) : (
                        <div><br /><br /> </div>
                    )}
                    <button onClick={this.handleAddToCart}>Add to Cart</button>
                </div>
            </div>

        );
    }
}

export default Product;

