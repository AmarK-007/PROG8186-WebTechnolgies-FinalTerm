import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Product from './Product';

function ProductDetail() {
    const [product, setProduct] = useState(null);
    const [comments, setComments] = useState([]);
    const { id: productId } = useParams();

    useEffect(() => {
        // Fetch the product data
        fetch(`http://localhost:5000/products?product_id=${productId}`)
            .then(res => res.json())
            .then(product => setProduct(product))
            .catch(error => {
                console.error('Error:', error);
            });

        // Fetch the comments data
        fetch(`http://localhost:5000/comments?product_id=${productId}`)
            .then(res => res.json())
            .then(comments => setComments(comments))
            .catch(error => {
                console.error('Error:', error);
            });
    }, [productId]);

    if (!product) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                {product.map(item => (
                    <div style={{ border: '1px solid #ccc',  padding: '1rem', margin: '1rem' }} key={item.id}>
                        <Product product={item} />
                    </div>
                ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h2>Comments</h2>
                {comments.reduce((unique, comment) => {
                    if (!unique.some(item => item.image_url === comment.image_url)) {
                        unique.push(comment);
                    }
                    return unique;
                }, []).map(comment => (
                    <div style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '1rem', margin: '1rem', minWidth: '250px', backgroundColor: 'rgba(0, 0, 0, 0.3)' }} key={comment.id}>
                        <img src={comment.image_url} alt="User" style={{ width: '250px', height: 'auto' }} />
                        <div style={{ display: 'flex', overflowX: 'auto', gap: '1rem' }}>
                            {comments.filter(c => c.image_url === comment.image_url).map((c, index) => (
                                <div style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '1rem', margin: '1rem', width: '250px', backgroundColor: 'rgba(0, 0, 0, 0.3)' }} key={index}>
                                    <p>{c.comment}</p>
                                    <p>Rating: {c.rating}</p>
                                    <div>
                                        {[...Array(c.rating)].map((e, i) => <img src="/images/star.jpg" alt="Star" key={i} style={{ width: '20px', height: '20px' }} />)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProductDetail;