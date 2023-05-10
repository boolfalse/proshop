
import { Link, useNavigate, useParams } from "react-router-dom";
import { Row, Col, Image, ListGroup, Card, Button, Form } from "react-bootstrap";
import Rating from "../components/Rating";
import {
    useGetProductDetailsQuery,
    useCreateProductReviewMutation,
} from "../slices/productsApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useState } from "react";
import {useDispatch, useSelector} from "react-redux";
import { addToCart } from "../slices/cartSlice";
import {toast} from "react-toastify";
import Meta from "../components/Meta";

const ProductScreen = () => {
    const { productId } = useParams();
    const [qty, setQty] = useState(1);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const { userInfo } = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        data: product,
        isLoading,
        error,
        refetch: refetchProduct,
    } = useGetProductDetailsQuery(productId);
    const [createProductReview, {
        isLoading: isLoadingCreateReview,
        error: errorCreateReview,
    }] = useCreateProductReviewMutation();

    const addToCartHandler = () => {
        // dispatch({
        //     type: 'cart/addItem',
        //     payload: {
        //         product: product._id,
        //         qty,
        //     }
        // });
        dispatch(addToCart({ ...product, qty }));
        navigate('/cart');
    }

    const submitCreateReviewHandler = async (e) => {
        e.preventDefault();
        try {
            await createProductReview({
                _id: productId,
                rating,
                comment
            }).unwrap();
            setRating(0);
            setComment('');
            refetchProduct();
            toast.success('Review submitted.')
        } catch (err) {
            toast(err.data?.message || err.error || 'Something went wrong!')
        }
    };

    return <>
        <Link to="/" className="btn btn-light my-3">Back</Link>
        { isLoading ? (
            <Loader />
        ) : (
            error ? (
                <Message variant="danger">{error?.data?.message || error?.error}</Message>
            ) : (<>
                <Meta title={product.name}
                      description={product.description}
                      keywords={product.category} />
                <Row>
                    <Col md={5}>
                        <Image src={product.image} alt={product.name} fluid />
                    </Col>
                    <Col md={4}>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h3>{product.name}</h3>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Rating value={product.rating} text={`${product.numReviews} reviews`} />
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <h3>Price: ${product.price}</h3>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <p>Description: {product.description}</p>
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                    <Col md={3}>
                        <Card>
                            <ListGroup variant='flush'>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Price:</Col>
                                        <Col>
                                            <strong>${product.price}</strong>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Status:</Col>
                                        <Col>
                                            <strong>{product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}</strong>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                                {product.countInStock > 0 && (
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Qty</Col>
                                            <Col>
                                                <Form.Control as='select'
                                                              onChange={(e) => setQty(Number(e.target.value))}
                                                              value={qty}>
                                                    {[...Array(product.countInStock).keys()].map((x) => (
                                                        <option key={x + 1} value={x + 1}>{x + 1}</option>
                                                    ))}
                                                </Form.Control>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                )}
                                <ListGroup.Item>
                                    <Button className='btn-block'
                                            type='button'
                                            disabled={product.countInStock === 0}
                                            onClick={addToCartHandler}
                                    >Add to Cart</Button>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card>
                    </Col>
                </Row>
                <Row className='review'>
                    <Col md={6}>
                        <h2>Reviews</h2>
                        {product.reviews.length === 0 && <Message>No Reviews</Message>}
                        <ListGroup variant='flush'>
                            {product.reviews.map((review) => (
                                <ListGroup.Item key={review._id}>
                                    <strong>{review.name}</strong>
                                    <Rating value={review.rating} />
                                    <p>{review.createdAt.substring(0, 10)}</p>
                                    <p>{review.comment}</p>
                                </ListGroup.Item>
                            ))}
                            <ListGroup.Item>
                                <h2>Write a Customer Review</h2>
                                {
                                    errorCreateReview && (
                                        <Message variant='danger'>
                                            {errorCreateReview?.data?.message || errorCreateReview?.error}
                                        </Message>
                                    )
                                }
                                {isLoadingCreateReview && <Loader />}
                                {userInfo ? (
                                    <Form onSubmit={submitCreateReviewHandler}>
                                        <Form.Group controlId='rating' className='my-2'>
                                            <Form.Label>Rating</Form.Label>
                                            <Form.Control as='select'
                                                          disabled={isLoadingCreateReview}
                                                          onChange={(e) => setRating(Number(e.target.value))}
                                                          value={rating}>
                                                <option value=''>Select...</option>
                                                <option value='1'>1 - Poor</option>
                                                <option value='2'>2 - Fair</option>
                                                <option value='3'>3 - Good</option>
                                                <option value='4'>4 - Very Good</option>
                                                <option value='5'>5 - Excellent</option>
                                            </Form.Control>
                                        </Form.Group>
                                        <Form.Group controlId='comment' className='my-2'>
                                            <Form.Label>Comment</Form.Label>
                                            <Form.Control as='textarea'
                                                          row='3'
                                                          disabled={isLoadingCreateReview}
                                                          onChange={(e) => setComment(e.target.value)}
                                                          value={comment}></Form.Control>
                                        </Form.Group>
                                        <Button type='submit'
                                                disabled={isLoadingCreateReview}
                                                variant='primary'>Add Review</Button>
                                    </Form>
                                ) : (
                                    <Message>Please <Link to='/login'>Login</Link> to write a review.</Message>
                                )}
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                </Row>
            </>)
        ) }
    </>;
}

export default ProductScreen;
