import React, { useState, useEffect, useRef } from 'react'; // import useRef
import { useParams } from 'react-router-dom';
import Product from './Product';

function ProductDetail(props) {
    const [product, setProduct] = useState(null);
    const [comments, setComments] = useState([]);
    const { id: productId } = useParams();
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(0);
    const imageRef = useRef(null);
    const idRef = useRef(null);

    const handleCommentChange = (event) => {
        setComment(event.target.value);
    };

    const handleRatingChange = (rating) => {
        setRating(rating);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!product || product.length === 0) {
            console.error('Product array is not defined or empty');
            return;
        }
        console.log('Product:', product);
        // Get the first product from the product array
        const productObj = product[0];
        let { image_urlString } = "";
        // Map over the image_url array in the product
        const images = productObj.image_url.map((image, index) => {
            // Use the image URL here
            console.log(`Image ${index + 1}: ${image}`);
            if (index === 0)
            image_urlString = image;
        });
        // Get the user ID from local storage
        const userId = localStorage.getItem('userId');
        const commentData = {

            product_id: productObj.product_id,
            user_id: userId,
            rating: rating,
            image_url: image_urlString,
            comment: comment,
        };

        await fetch('http://localhost:5000/comments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(commentData),
        });

        setComment('');
        setRating(0);
    };

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
                    <div style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem' }} key={item.id}>
                        <Product product={item} addToCart={props.addToCart} enableHoverEffect={true} />
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
                        <img src={comment.image_url} alt="User" style={{ width: '250px', height: 'auto' }} ref={imageRef} src={product.image_url} alt="Product" />
                        <p ref={idRef}>{product.id}</p>
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
                <div style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '1rem', margin: '1rem', minwidth: '350px', minHeight: '80px', backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
                    <form onSubmit={handleSubmit}>
                        <h4>Add your comments here...</h4>
                        <textarea value={comment} onChange={handleCommentChange} required />
                        <div>
                            <div>
                                <div>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button type="button" onClick={() => handleRatingChange(star)} key={star} style={{ background: 'transparent', border: 'none' }}>
                                            {star}
                                        </button>
                                    ))}
                                </div>
                                <div>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button type="button" onClick={() => handleRatingChange(star)} key={star} style={{ background: 'transparent', border: 'none' }}>
                                            <img src={`/images/star.jpg`} style={{ width: '20px', height: '20px' }} alt={`${star} Star${star > 1 ? 's' : ''}`} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <button type="submit">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
