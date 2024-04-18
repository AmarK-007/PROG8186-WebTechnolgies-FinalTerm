import React, { useState, useEffect } from 'react';

function MyOrders() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/orders?user_id=1')
            .then(response => response.json())
            .then(data => setOrders(data));
    }, []);

    return (
        <div className="order-card-layout">
            <h1>My Orders</h1>
            <div class="fancy-line"></div>
            {orders.map(order => (
                <div key={order.order_id} className="order-card">
                    <h2>Order ID: {order.order_id}</h2>
                    <div className="order-details">
                        <h3>Order Details:</h3>
                        {order.order_details.map(detail => (
                            <div key={detail.order_detail_id} className="order-detail-card">
                                <p>Product ID: {detail.product_id}</p>
                                <p>Quantity: {detail.quantity}</p>
                                <p>Product Size: {detail.product_size}</p>
                            </div>
                        ))}
                    </div>
                    <div className="order-info">
                        <p>Total Amount: {order.total_amount}</p>
                        <p>Order Date: {new Date(order.order_date).toLocaleDateString()}</p>
                        <p>Payment Method: {order.payment_method}</p>
                        <p>Delivery Status: {order.delivery_status}</p>
                        <p>Return Status: {order.return_status}</p>
                    </div>
                    <div class="fancy-line"></div>
                </div>
            ))}
        </div>
    );
}

export default MyOrders;