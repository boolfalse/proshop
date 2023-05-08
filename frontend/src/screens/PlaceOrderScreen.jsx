
import {Link, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import CheckoutSteps from "../components/CheckoutSteps";
import {Button, Card, Col, Image, ListGroup, Row} from "react-bootstrap";
import Message from "../components/Message";
import {useCreateOrderMutation} from "../slices/ordersApiSlice";
import Loader from "../components/Loader";
import {clearCartItems} from "../slices/cartSlice";
import {toast} from "react-toastify";

const PlaceOrderScreen = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cart = useSelector((state) => state.cart);
    const {
        shippingAddress, paymentMethod, cartItems,
        itemsPrice, shippingPrice, taxPrice, totalPrice,
    } = cart;
    const [createOrder, {isLoading, error}] = useCreateOrderMutation();

    useEffect(() => {
        if (!shippingAddress || !shippingAddress.address) {
            navigate("/shipping");
        }
        if (!paymentMethod) {
            navigate("/payment");
        }
    }, [
        navigate,
        shippingAddress,
        shippingAddress.address,
        paymentMethod,
    ]);

    const placeOrderHandler = async () => {
        try {
            const res = await createOrder({
                orderItems: cartItems,
                shippingAddress,
                paymentMethod,
                itemsPrice: itemsPrice,
                shippingPrice: shippingPrice,
                taxPrice: taxPrice,
                totalPrice: totalPrice,
            }).unwrap();

            // dispatch({type: "ORDER_CREATE_SUCCESS", payload: res});
            // dispatch({type: "CART_CLEAR_ITEMS"});

            dispatch(clearCartItems());
            navigate(`/order/${res._id}`);
        } catch (err) {
            toast.error(err.message || "Something went wrong!");
        }
    };

    return (
        <>
            <CheckoutSteps step1 step2 step3 step4 />
            <h2>Place Order</h2>
            <Row>
                <Col md={8}>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <h3>Shipping</h3>
                            <p>
                                <strong>Address:{" "}</strong>
                                {shippingAddress.address},{" "}
                                {shippingAddress.city},{" "}
                                {shippingAddress.postalCode},{" "}
                                {shippingAddress.country}
                            </p>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h3>Payment Method</h3>
                            <p>
                                <strong>Method:{" "}</strong>
                                {paymentMethod}
                            </p>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h3>Order Items</h3>
                            {cartItems.length === 0 ? (
                                <Message>Your cart is empty</Message>
                            ) : (
                                <ListGroup variant="flush">
                                    {cartItems.map((item, index) => (
                                        <ListGroup.Item key={index}>
                                            <Row>
                                                <Col md={1}>
                                                    <Image src={item.image} alt={item.name} fluid rounded />
                                                </Col>
                                                <Col>
                                                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                                                </Col>
                                                <Col md={4}>
                                                    {item.qty} x ${item.price} = ${item.qty * item.price}
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={4}>
                    <Card>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <h3>Order Summary:</h3>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Items:</Col>
                                    {/*<Col>${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0)}</Col>*/}
                                    <Col>${itemsPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping:</Col>
                                    <Col>${shippingPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax:</Col>
                                    <Col>${taxPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Total:</Col>
                                    <Col>${totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            {error && (
                                <ListGroup.Item>
                                    <Message variant="danger">{error}</Message>
                                </ListGroup.Item>
                            )}
                            <ListGroup.Item>
                                <Button type="button"
                                        className="btn-block"
                                        onClick={placeOrderHandler}
                                        disabled={cartItems.length === 0}>Place Order</Button>
                            </ListGroup.Item>
                            {isLoading && (
                                <Loader />
                            )}
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default PlaceOrderScreen;
