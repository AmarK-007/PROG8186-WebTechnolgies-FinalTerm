import React from 'react';
import { FaCcVisa, FaCcMastercard, FaMoneyBillWave, FaGooglePay } from 'react-icons/fa';

class PaymentForm extends React.Component {
    state = {
        paymentMethod: 'card',
        cardNumber: '',
        cardExpiry: '',
        cardCVV: '',
        cardHolderName: '',
        orderData: null,
    };

    handlePaymentMethodChange = (event) => {
        this.setState({ paymentMethod: event.target.value });
    }

    handleInputChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    validateCardNumber = (number) => /^\d{16}$/.test(number);

    validateCardExpiry = (expiry) => {
        const match = expiry.match(/^(0[1-9]|1[0-2])\/(\d{2})$/);
        if (!match) return false;
        const year = new Date().getFullYear() % 100;
        return match[2] >= year;
    };

    validateCardCVV = (cvv) => /^\d{3}$/.test(cvv);

    validateCardHolderName = (name) => /^[a-zA-Z\s]*$/.test(name) && /[a-zA-Z]/.test(name);

    renderPaymentMethods = () => (
        <div className="payment-methods">
            <h2>We Accept</h2>
            <div className="payment-icons">
                <FaCcVisa className="icon" size={30} color="blue" />
                <FaCcMastercard className="icon" size={30} color="blue" />
                <FaMoneyBillWave className="icon" size={30} color="blue" />
                <FaGooglePay className="icon" size={30} color="blue" />
            </div>
        </div>
    );

    renderCardDetails = () => (
        this.state.paymentMethod === 'card' && (
            <div>
                {this.renderPaymentMethods()}
                <div className="cart-card-layout" style={{ width: '250px', backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '5px', marginTop: '20px' }}>
                    <input style={{ width: '100%', boxSizing: 'border-box' }} type="text" name="cardNumber" value={this.state.cardNumber} onChange={this.handleInputChange} placeholder="Card Number" />
                    {!this.validateCardNumber(this.state.cardNumber) && <span>Please enter a valid card number.</span>}
                    <input style={{ width: '100%', boxSizing: 'border-box' }} type="text" name="cardExpiry" value={this.state.cardExpiry} onChange={this.handleInputChange} placeholder="Expiry (MM/YY)" />
                    {!this.validateCardExpiry(this.state.cardExpiry) && <span>Please enter a valid expiry date.</span>}
                    <input style={{ width: '100%', boxSizing: 'border-box' }} type="text" name="cardCVV" value={this.state.cardCVV} onChange={this.handleInputChange} placeholder="CVV" />
                    {!this.validateCardCVV(this.state.cardCVV) && <span>Please enter a valid CVV.</span>}
                    <input style={{ width: '100%', boxSizing: 'border-box' }} type="text" name="cardHolderName" value={this.state.cardHolderName} onChange={this.handleInputChange} placeholder="Cardholder Name" />
                    {!this.validateCardHolderName(this.state.cardHolderName) && <span>Please enter a valid cardholder name.</span>}
                </div>
            </div>
        )
    );

    handleSubmit = (event) => {
        event.preventDefault();

        if (this.state.paymentMethod === 'card') {
            const isValidCardNumber = this.validateCardNumber(this.state.cardNumber);
            const isValidCardExpiry = this.validateCardExpiry(this.state.cardExpiry);
            const isValidCardCVV = this.validateCardCVV(this.state.cardCVV);
            const isValidCardHolderName = this.validateCardHolderName(this.state.cardHolderName);

            if (isValidCardNumber && isValidCardExpiry && isValidCardCVV && isValidCardHolderName) {
                this.props.handlePlaceOrder();
            }
        } else {
            this.props.handlePlaceOrder();
        }
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    <input type="radio" value="card" checked={this.state.paymentMethod === 'card'} onChange={this.handlePaymentMethodChange} />
                    Credit/Debit Card
                </label>
                <label>
                    <input type="radio" value="cash" checked={this.state.paymentMethod === 'cash'} onChange={this.handlePaymentMethodChange} />
                    Cash on Delivery
                </label>
                {this.state.paymentMethod === 'card' && this.renderCardDetails()}
                <button type="submit">Place Order</button>
            </form>
        );
    }
}

export default PaymentForm;
