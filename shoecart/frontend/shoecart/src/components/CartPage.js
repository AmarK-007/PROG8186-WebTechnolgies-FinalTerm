import React from "react";
import CartContext from './CartContext';
class CartPage extends React.Component {
static contextType = CartContext;
    constructor(props) {
        super(props);
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

    render() {
        // Get the cart from the props
        const { cart, products } = this.props;
        const total = this.calculateTotal(cart, products);
        const tax = this.calculateTax(total);
        const totalWithTax = total + tax;
        const quantity = this.calculateQuantity(cart);

        return (
            <div className="cart-card-layout">
            <h1>Shopping Cart</h1>
            <div>
                {cart.length > 1 &&
                    <button onClick={() => {
                        if (window.confirm('Are you sure? This will clear all the cart items.')) {
                            this.context.clearCartAPICall(null, true);
                        }
                    }}>Remove All</button>
                }
            </div>
            <br/>
                <div>
                    {/* Display selected products */}
                    {cart.map((item, index) => {
                        const product = products.find(product => product.product_id === item.product_id);
                        return product && (
                            <div key={index} className="cart-item">
                                {product.image_url && product.image_url.length > 0 &&
                                    <img src={process.env.PUBLIC_URL + product.image_url[0]} alt={product.name} style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                                }
                                <span>{product.title} - ${product.price} x {item.quantity} = ${product.price * item.quantity}</span>
                                <button onClick={() => this.context.clearCartAPICall(item.cart_id , false)/*this.props.removeFromCart(index)*/}>Remove</button>
                            </div>
                        );
                    })}
                </div>
                <div>
                    <h2>Total Quantity: {quantity}</h2>
                    <h2>Subtotal: ${total.toFixed(2)}</h2>
                    <h2>Tax: ${tax.toFixed(2)}</h2>
                    <h2>Total: ${totalWithTax.toFixed(2)}</h2>
                    <button onClick={this.props.handleBuyNow}>Buy Now</button>
                </div>
            </div>
        );
    }
}

export default CartPage;
