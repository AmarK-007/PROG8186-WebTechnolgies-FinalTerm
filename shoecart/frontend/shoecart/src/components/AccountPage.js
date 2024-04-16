import React, { Component } from 'react';

// class component for AccountPage
class AccountPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            address1: '',
            address2: '',
            city: '',
            province: '',
            pincode: '',
            phone: '',
            username: '',
            password: '',
            error: null,
            isLoading: false,
        };
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const { name, email, address1, address2, city, province, pincode, phone, username, password } = this.state;

        // Basic form validation
        if (!name || !email || !address1 || !city || !province || !pincode || !phone || !username || !password) {
            this.setState({ error: 'Please fill in all fields.' });
            return;
        }

        const shipping_address = `${address1} ${address2}, ${city}, ${province}, ${pincode}`;

        const newUser = {
            name,
            email,
            shipping_address,
            phone,
            username,
            password,
            purchase_history: "0",
        };

        this.setState({ isLoading: true });

        fetch('http://localhost:5000/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Success:', data);

                // Redirect to login page after creating account
                setTimeout(() => {
                    window.location.href = '/login';
                }, 1000);
            })
            .catch((error) => {
                console.error('Error:', error);
                this.setState({ error: 'There was a problem creating your account. Please try again.' });
            })
            .finally(() => {
                this.setState({ isLoading: false });
            });
    };

    render() {
        const { error, isLoading } = this.state;

        return (
            <div className="container-fluid mt-5 container-form-Login-logout">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <h2 className="card-title text-center mb-4" style={{ color: 'white' }}>Create Account</h2>
                                <hr className="white-line" />
                                <br />
                                <form onSubmit={this.handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="name" className="form-label" style={{ color: 'white' }}>Name:</label>
                                        <input type="text" id="name" name="name" value={this.state.name} onChange={(e) => this.setState({ name: e.target.value })} className="form-control" />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label" style={{ color: 'white' }}>Email:</label>
                                        <input type="email" id="email" name="email" value={this.state.email} onChange={(e) => this.setState({ email: e.target.value })} className="form-control" />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="phone" className="form-label" style={{ color: 'white' }}>Phone:</label>
                                        <input type="tel" id="phone" name="phone" value={this.state.phone} onChange={(e) => this.setState({ phone: e.target.value })} className="form-control" />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="username" className="form-label" style={{ color: 'white' }}>Username:</label>
                                        <input type="text" id="username" name="username" value={this.state.username} onChange={(e) => this.setState({ username: e.target.value })} className="form-control" />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label" style={{ color: 'white' }}>Password:</label>
                                        <input type="password" id="password" name="password" value={this.state.password} onChange={(e) => this.setState({ password: e.target.value })} className="form-control" />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="address1" className="form-label" style={{ color: 'white' }}>Address 1:</label>
                                        <input type="text" id="address1" name="address1" value={this.state.address1} onChange={(e) => this.setState({ address1: e.target.value })} className="form-control" />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="address2" className="form-label" style={{ color: 'white' }}>Address 2:</label>
                                        <input type="text" id="address2" name="address2" value={this.state.address2} onChange={(e) => this.setState({ address2: e.target.value })} className="form-control" />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="city" className="form-label" style={{ color: 'white' }}>City:</label>
                                        <input type="text" id="city" name="city" value={this.state.city} onChange={(e) => this.setState({ city: e.target.value })} className="form-control" />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="province" className="form-label" style={{ color: 'white' }}>Province:</label>
                                        <input type="text" id="province" name="province" value={this.state.province} onChange={(e) => this.setState({ province: e.target.value })} className="form-control" />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="pincode" className="form-label" style={{ color: 'white' }}>Pincode:</label>
                                        <input type="text" id="pincode" name="pincode" value={this.state.pincode} onChange={(e) => this.setState({ pincode: e.target.value })} className="form-control" />
                                    </div>
                                    {error && <p className="text-danger" style={{ color: 'red' }}>{error}</p>}
                                    <br />
                                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
                                        {isLoading ? 'Loading...' : 'Create Account'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AccountPage;
