
import Message from "../components/Message";
import {Link, useParams} from "react-router-dom";
import {
    useGetOrderDetailsQuery,
    usePayOrderMutation,
    useGetPaypalClientIdQuery,
    useDeliverOrderMutation,
} from "../slices/ordersApiSlice";
import Loader from "../components/Loader";
import {Button, Card, Col, ListGroup, Row} from "react-bootstrap";
import {PayPalButtons, usePayPalScriptReducer} from "@paypal/react-paypal-js";
import {useEffect} from "react";
import {toast} from "react-toastify";
import {FaArrowLeft} from "react-icons/fa";
import {useSelector} from "react-redux";

const OrderScreen = () => {
    const {orderId} = useParams();
    const { userInfo } = useSelector((state) => state.auth);
    const {
        data: order,
        refetch,
        isLoading,
        error,
    } = useGetOrderDetailsQuery(orderId);
    const [payOrder, {isLoading: isPayLoading}] = usePayOrderMutation();
    const [deliverOrder, {isLoading: isDeliverLoading}] = useDeliverOrderMutation();
    const [{isPending}, paypalDispatch] = usePayPalScriptReducer();
    const {
        data: paypal,
        isLoading: isPaypalLoading,
        error: paypalError,
    } = useGetPaypalClientIdQuery();

    useEffect(() => {
        if (!paypalError && !isPaypalLoading && paypal) {
            const loadPaypalScript = async () => {
                paypalDispatch({
                    type: "resetOptions",
                    value: {"client-id": paypal.clientId, currency: "USD"},
                });
                paypalDispatch({
                    type: "setLoadingStatus",
                    value: "pending"
                });
            };
            if (order && !order.isPaid) {
                if (!window.paypal) {
                    loadPaypalScript();
                } else {
                    paypalDispatch({
                        type: "setLoadingStatus",
                        value: "resolved"
                    });
                }
            }
        }
    }, [
        paypal,
        paypalDispatch,
        paypalError,
        isPaypalLoading,
        order,
    ]);

    const deliverOrderHandler = async () => {
        try {
            await deliverOrder(orderId);
            refetch();
            toast.success("Order has been delivered.");
        } catch (err) {
            toast.error(err.data?.message || err.message || "Failed to deliver the order!");
        }
    };

    const paypalOnApprove = (data, actions) => {
        return actions.order.capture().then(async (details) => {
            try {
                await payOrder({ orderId, details });
                refetch();
                toast.success("Order has been paid.");
            } catch (err) {
                toast.error(err.data?.message || err.message || "Failed to pay the order!");
            }
        });
    };
    const paypalCreateOrder = (data, actions) => {
        return actions.order
            .create({
                purchase_units: [{
                    amount: {
                        value: order.totalPrice,
                    },
                },],
            })
            .then((oId) => {
                return oId; // order id
            });
    };
    const paypalOnError = (err) => {
        toast.error(err.message || "Failed to pay the order!");
    };

    return <>
        {userInfo.isAdmin ? (
            <Link to="/admin/orders" className="btn btn-light my-3">
                <FaArrowLeft /> Back to List
            </Link>
        ) : (
            <Link to="/profile" className="btn btn-light my-3">
                <FaArrowLeft /> Back to Profile
            </Link>
        )}
        {isLoading ? (
            <Loader/>
        ) : (error ? (
                <Message variant="danger">{error}</Message>
            ) : (<>
                <h2>Order #{order._id}</h2>
                <Row>
                    <Col md={8}>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <h3>Shipping:</h3>
                                <p>
                                    <strong>Name: </strong> {order.user.name}
                                </p>
                                <p>
                                    <strong>Email: </strong> {order.user.email}
                                </p>
                                <p>
                                    {order.shippingAddress.address},{" "}
                                    {order.shippingAddress.city},{" "}
                                    {order.shippingAddress.postalCode},{" "}
                                    {order.shippingAddress.country}
                                </p>
                                {order.isDelivered ? (
                                    <Message variant="success">Delivered on {order.deliveredAt}</Message>
                                ) : (
                                    <Message variant="danger">Not Delivered</Message>
                                )}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <h3>Payment:</h3>
                                <p>
                                    <strong>Method:{" "}</strong>
                                    {order.paymentMethod}
                                </p>
                                {order.isPaid ? (
                                    <Message variant="success">Paid on {order.paidAt}</Message>
                                ) : (
                                    <Message variant="danger">Not Paid</Message>
                                )}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <h3>Items:</h3>
                                {order.orderItems.length === 0 ? (
                                    <Message>Order is empty</Message>
                                ) : (
                                    <ListGroup variant="flush">
                                        {order.orderItems.map((item, index) => (
                                            <ListGroup.Item key={index}>
                                                <Row>
                                                    <Col md={1}>
                                                        <img src={item.image} alt={item.name} className="img-fluid"/>
                                                    </Col>
                                                    <Col>
                                                        {item.name}
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
                                    <h3>Summary:</h3>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Items:</Col>
                                        <Col>${order.itemsPrice}</Col>
                                    </Row>
                                    <Row>
                                        <Col>Shipping:</Col>
                                        <Col>${order.shippingPrice}</Col>
                                    </Row>
                                    <Row>
                                        <Col>Tax:</Col>
                                        <Col>${order.taxPrice}</Col>
                                    </Row>
                                    <Row>
                                        <Col>Total:</Col>
                                        <Col>${order.totalPrice}</Col>
                                    </Row>
                                    { !order.isPaid && (
                                        <ListGroup.Item>
                                            {isPayLoading && <Loader/>}
                                            {isPending ? (
                                                <Loader/>
                                            ) : (
                                                <>
                                                    <PayPalButtons
                                                        createOrder={paypalCreateOrder}
                                                        onApprove={paypalOnApprove}
                                                        onError={paypalOnError}
                                                    ></PayPalButtons>
                                                </>
                                            )}
                                        </ListGroup.Item>
                                    ) }
                                    {userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                                        <ListGroup.Item>
                                            {isDeliverLoading && <Loader/>}
                                            <Button type='button'
                                                    className='btn btn-block'
                                                    onClick={deliverOrderHandler}
                                            >Mark as Delivered</Button>
                                        </ListGroup.Item>
                                    )}
                                </ListGroup.Item>
                            </ListGroup>
                        </Card>
                    </Col>
                </Row>
            </>)
        )}
    </>
};

export default OrderScreen;
