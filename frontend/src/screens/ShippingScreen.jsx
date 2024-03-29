
import {useState} from "react";
import FormContainer from "../components/FormContainer";
import {Button, Form} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {saveShippingAddress} from "../slices/cartSlice";
import CheckoutSteps from "../components/CheckoutSteps";
import {toast} from "react-toastify";

const ShippingScreen = () => {
    const cart = useSelector(state => state.cart);
    const {shippingAddress} = cart;

    const [address, setAddress] = useState(shippingAddress?.address || '');
    const [city, setCity] = useState(shippingAddress?.city || '');
    const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');
    const [country, setCountry] = useState(shippingAddress?.country || '');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault();

        if (!address || !city || !postalCode || !country) {
            toast.warning('Please fill in all fields');
            return;
        }

        dispatch(saveShippingAddress({
            address,
            city,
            postalCode,
            country,
        }));
        navigate('/payment');
    }

    return (
        <FormContainer>
            <CheckoutSteps step1 step2 />
            <h2>Shipping</h2>
            <Form onSubmit={submitHandler}>
                <Form.Group controlId='address' className='my-2'>
                    <Form.Label>Address</Form.Label>
                    <Form.Control type='text'
                                  placeholder='Enter address'
                                  onChange={(e) => setAddress(e.target.value)}
                                  value={address}></Form.Control>
                </Form.Group>
                <Form.Group controlId='city' className='my-2'>
                    <Form.Label>City</Form.Label>
                    <Form.Control type='text'
                                  placeholder='Enter city'
                                  onChange={(e) => setCity(e.target.value)}
                                  value={city}></Form.Control>
                </Form.Group>
                <Form.Group controlId='postalCode' className='my-2'>
                    <Form.Label>Postal Code</Form.Label>
                    <Form.Control type='text'
                                  placeholder='Enter postal code'
                                  onChange={(e) => setPostalCode(e.target.value)}
                                  value={postalCode}></Form.Control>
                </Form.Group>
                <Form.Group controlId='country' className='my-2'>
                    <Form.Label>Country</Form.Label>
                    <Form.Select onChange={(e) => setCountry(e.target.value)}
                                    value={country}>
                        <option value=''>Select country</option>
                        <option value='us'>United States</option>
                        <option value='am'>Armenia</option>
                    </Form.Select>
                </Form.Group>
                <Button type='submit' variant='primary' className='my-2'>
                    Continue
                </Button>
            </Form>
        </FormContainer>
    );
}

export default ShippingScreen;
