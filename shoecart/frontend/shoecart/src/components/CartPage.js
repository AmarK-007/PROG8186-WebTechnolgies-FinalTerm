import React from "react";
import CartContext from './CartContext';
class CartPage extends React.Component {
    static contextType = CartContext;
    constructor(props) {
        super(props);
        this.state = {
            showAddress: false,
            showPaymentOptions: false,
            paymentMethod: null,
            cardNumber: '',
            cardValidation: '',
            userAddress: '',
        };
    }
    componentDidMount() {
        fetch('http://localhost:5000/users?user_id=1')
            .then(response => response.json())
            .then(data => this.setState({ userAddress: data[0].address }))
            .catch(error => console.error('Error:', error));
    }
    // Function to calculate the total bill
    calculateQuantity = (cart) => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    };
    // Function to calculate the total bill
    calculateTotal = (cart, products) => {
        return cart.reduce((total, item) => {
            const product = products.find(product => product.product_id === item.product_id);
            return total + (product ? product.price * item.quantity : 0);
        }, 0);
    };

    // Function to calculate tax
    calculateTax = (total) => {
        return total * 0.13; // 13% tax
    };
    handleProceedConfirm = () => {
        this.setState({ showAddress: true });
    };

    handleProceedPayment = () => {
        this.setState({ showPaymentOptions: true });
    };

    handlePaymentMethodChange = (event) => {
        this.setState({ paymentMethod: event.target.value });
    };

    handleCardNumberChange = (event) => {
        this.setState({ cardNumber: event.target.value });
    };

    handleCardValidationChange = (event) => {
        this.setState({ cardValidation: event.target.value });
    };

    handlePlaceOrder = () => {
        // Validate card details if card payment is selected
        if (this.state.paymentMethod === 'card' && (this.state.cardNumber === '' || this.state.cardValidation === '')) {
            alert('Please enter valid card details');
            return;
        }

        // Place order
        this.props.handleBuyNow();
    };

    render() {
        // Get the cart from the props
        const { cart, products } = this.props;
        const total = this.calculateTotal(cart, products);
        const tax = this.calculateTax(total);
        const totalWithTax = total + tax;
        const quantity = this.calculateQuantity(cart);

        return (
            <div className="cart-card-layout" style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '5px', marginTop: '20px' }}>
                <h1 style={{ color: '#6c757d', marginBottom: '10px' }}>Shopping Cart</h1>
                <div class="fancy-line"></div>
                <div>
                    {cart.length > 1 &&
                        <button onClick={() => {
                            if (window.confirm('Are you sure? This will clear all the cart items.')) {
                                this.context.clearCartAPICall(null, true);
                            }
                        }}>Remove All</button>
                    }
                </div>
                <br />
                <div>
                    {/* Display selected products */}
                    {cart.map((item, index) => {
                        const product = products.find(product => product.product_id === item.product_id);
                        return product && (
                            <div key={index} className="cart-item" style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                {product.image_url && product.image_url.length > 0 &&
                                    <img src={process.env.PUBLIC_URL + product.image_url[0]} alt={product.name} style={{ width: '180px', height: '180px', objectFit: 'cover', marginRight: '10px' }} />
                                }
                                <div style={{ flex: 1, textAlign: 'left', textJustify: 'inter-word' }}>
                                    <p><strong>Product:</strong> <span style={{ color: '#6c757d' }}>{product.title}</span></p>
                                    <p><strong>Price:</strong> <span style={{ color: '#28a745' }}>${product.price}</span></p>
                                    <p><strong>Quantity:</strong> <span style={{ color: '#6c757d' }}>{item.quantity}</span></p>
                                    <p><strong>Total:</strong> <span style={{ color: '#28a745' }}>${product.price * item.quantity}</span></p>
                                </div>
                                <button onClick={() => this.context.clearCartAPICall(item.cart_id, false)}>Remove</button>
                            </div>
                        );
                    })}
                </div>
                <div>
                    <h2>Total Quantity: <span style={{ color: '#6c757d' }}>{quantity}</span></h2>
                    <h2>Subtotal: <span style={{ color: '#28a745' }}>${total.toFixed(2)}</span></h2>
                    <h2>Tax: <span style={{ color: '#dc3545' }}>${tax.toFixed(2)}</span></h2>
                    <h2>Total: <span style={{ color: '#28a745' }}>${totalWithTax.toFixed(2)}</span></h2>
                    <button onClick={this.handleProceedConfirm}>Proceed/Confirm</button>
                    {this.state.showAddress && (
                        <div>
                            <p>User Address: <span style={{ color: '#6c757d' }}>{this.state.userAddress}</span></p>
                            <button onClick={this.handleProceedPayment}>Proceed to Payment</button>
                        </div>
                    )}
                    {this.state.showPaymentOptions && (
                        <div>
                            <label>
                                <input type="radio" value="card" checked={this.state.paymentMethod === 'card'} onChange={this.handlePaymentMethodChange} />
                                Credit/Debit Card
                            </label>
                            <label>
                                <input type="radio" value="cash" checked={this.state.paymentMethod === 'cash'} onChange={this.handlePaymentMethodChange} />
                                Cash on Delivery
                            </label>
                            {this.state.paymentMethod === 'card' && (
                                <div>
                                    <input type="text" value={this.state.cardNumber} onChange={this.handleCardNumberChange} placeholder="Card Number" />
                                    <input type="text" value={this.state.cardValidation} onChange={this.handleCardValidationChange} placeholder="Card Validation" />
                                </div>
                            )}
                            <button onClick={this.handlePlaceOrder}>Place Order</button>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default CartPage;
