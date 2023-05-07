
import {useEffect, useState} from "react";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import {Button, Col, Form} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {savePaymentMethod} from "../slices/cartSlice";

const PaymentScreen = () => {
    const [paymentMethod, setPaymentMethod] = useState('PayPal');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cart = useSelector(state => state.cart);
    const { shippingAddress } = cart;

    useEffect(() => {
        if (!shippingAddress || !shippingAddress.address) {
            navigate('/shipping');
        }
    }, [
        navigate,
        shippingAddress,
    ]);

    const submitHandler = (e) => {
        e.preventDefault();

        dispatch(savePaymentMethod(paymentMethod));
        navigate('/place-order');
    };

    return (
        <FormContainer>
            <CheckoutSteps step1 step2 step3 />
            <h2>Payment Method</h2>
            <Form onSubmit={submitHandler}>
                <Form.Group>
                    <Form.Label as='legend'>Select Method</Form.Label>
                    <Col>
                        <Form.Check type='radio'
                                    label='PayPal or Credit Card'
                                    id='PayPal'
                                    name='paymentMethod'
                                    value='PayPal'
                                    checked={paymentMethod === 'PayPal'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className='my-2'></Form.Check>
                    </Col>
                </Form.Group>
                <Button type='submit' variant='primary'>Continue</Button>
            </Form>
        </FormContainer>
    );
};

export default PaymentScreen;
