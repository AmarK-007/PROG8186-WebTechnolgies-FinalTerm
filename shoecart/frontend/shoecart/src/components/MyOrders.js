import React from 'react';

class MyOrders extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            orders: [],
        };
    }

    componentDidMount() {
        fetch('http://localhost:5000/orders?user_id=1')
            .then(response => response.json())
            .then(data => this.setState({ orders: data }));
    }

    render() {
        const { products } = this.props;
        return (
            <div className="order-card-layout">
                <h1>My Orders</h1>
                <div class="fancy-line"></div>
                {this.state.orders.map(order => (
                    <div key={order.order_id} className="order-card">
                        <h2 style={{ flex: 1, paddingLeft: '20px', textAlign: 'left', textJustify: 'inter-word' }}>Order ID: {order.order_id}</h2>
                        <div className="order-details">
                            <h3 style={{ flex: 1, paddingLeft: '20px', textAlign: 'left', textJustify: 'inter-word' }}>Order Details:</h3>
                            {order.order_details.map(detail => {
                                const product = products.find(p => p.product_id === detail.product_id);
                                return (
                                    <div key={detail.order_detail_id} className="order-detail-card" style={{ display: 'flex', alignItems: 'center' }}>
                                        {product && product.image_url && product.image_url.length > 0 &&
                                            <img src={process.env.PUBLIC_URL + product.image_url[0]} alt={product.name} style={{ width: '180px', height: '180px', objectFit: 'cover', marginRight: '10px' }} />
                                        }
                                        <div style={{ flex: 1, textAlign: 'left', textJustify: 'inter-word' }}>
                                            {product && (
                                                <div>
                                                    <p style={{ flex: 1, paddingLeft: '20px', textAlign: 'left', textJustify: 'inter-word' }}><strong>Product:</strong> <span style={{ color: '#6c757d' }}>{product.title}</span></p>
                                                    <p style={{ flex: 1, paddingLeft: '20px', textAlign: 'left', textJustify: 'inter-word' }}><strong>Price:</strong> <span style={{ color: '#28a745' }}>${product.price}</span></p>
                                                    <p style={{ flex: 1, paddingLeft: '20px', textAlign: 'left', textJustify: 'inter-word' }}><strong>Quantity:</strong> <span style={{ color: '#6c757d' }}>{detail.quantity}</span></p>
                                                    <p style={{ flex: 1, paddingLeft: '20px', textAlign: 'left', textJustify: 'inter-word' }}><strong>Total:</strong> <span style={{ color: '#28a745' }}>${product.price * detail.quantity}</span></p>
                                                </div>
                                            )}
                                            <p style={{ flex: 1, paddingLeft: '20px', textAlign: 'left', textJustify: 'inter-word' }}><strong>Product ID:</strong> <span style={{ color: '#6c757d' }}>{detail.product_id}</span></p>
                                            <p style={{ flex: 1, paddingLeft: '20px', textAlign: 'left', textJustify: 'inter-word' }}><strong>Product Size:</strong> <span style={{ color: '#6c757d' }}>{detail.product_size}</span></p>
                                        </div>
                                    </div>
                                );
                            })}

                        </div>
                        <div className="order-info" style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '5px', marginTop: '20px' }}>
                            <h2 style={{ color: '#6c757d', marginBottom: '10px' }}>Order Information</h2>
                            <p><strong>Total Amount:</strong> <span style={{ color: '#28a745' }}>${order.total_amount}</span></p>
                            <p><strong>Order Date:</strong> <span style={{ color: '#6c757d' }}>{new Date(order.order_date).toLocaleDateString()}</span></p>
                            <p><strong>Payment Method:</strong> <span style={{ color: '#6c757d' }}>{order.payment_method}</span></p>
                            <p><strong>Delivery Status:</strong> <span style={{ color: order.delivery_status === 'Delivered' ? '#28a745' : '#dc3545' }}>{order.delivery_status}</span></p>
                            <p><strong>Return Status:</strong> <span style={{ color: order.return_status === 'Returned' ? '#dc3545' : '#6c757d' }}>{order.return_status}</span></p>
                        </div>
                        <br />
                        <div class="fancy-line"></div>
                    </div>

                ))}
            </div>
        );
    }
}

export default MyOrders;
