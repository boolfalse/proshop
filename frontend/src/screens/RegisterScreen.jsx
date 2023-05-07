
import {useEffect, useState} from "react";
import FormContainer from "../components/FormContainer";
import {Button, Form, Row} from "react-bootstrap";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {useRegisterMutation} from "../slices/usersApiSlice";
import {useDispatch, useSelector} from "react-redux";
import {setCredentials} from "../slices/authSlice";
import {toast} from "react-toastify";
import Loader from "../components/Loader";

const RegisterScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [registerApiCall, {isLoading, error}] = useRegisterMutation();
    const { userInfo } = useSelector(state => state.auth);

    const {search} = useLocation();
    const searchParams = new URLSearchParams(search);
    const redirect = searchParams.get('redirect') || '/';

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [
        navigate,
        redirect,
        userInfo,
    ]);

    const submitHandler = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('Passwords do not match!');
            return;
        }

        try {
            const res = await registerApiCall({name, email, password}).unwrap();
            dispatch(setCredentials({ ...res }));
            navigate(redirect);
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    }

    return (
        <FormContainer>
            <h2>Register</h2>
            <Form onSubmit={submitHandler}>
                <Form.Group controlId='name' className='my-3'>
                    <Form.Label>Name</Form.Label>
                    <Form.Control type='text'
                                  onChange={(e) => setName(e.target.value)}
                                  placeholder='Enter name'
                                  value={name}
                    ></Form.Control>
                </Form.Group>
                <Form.Group controlId='email' className='my-3'>
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control type='email'
                                  onChange={(e) => setEmail(e.target.value)}
                                  placeholder='Enter email'
                                  value={email}
                    ></Form.Control>
                </Form.Group>
                <Form.Group controlId='password' className='my-3'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control type='password'
                                  onChange={(e) => setPassword(e.target.value)}
                                  placeholder='Enter password'
                                  value={password}
                    ></Form.Control>
                </Form.Group>
                <Form.Group controlId='confirmPassword' className='my-3'>
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control type='password'
                                  onChange={(e) => setConfirmPassword(e.target.value)}
                                  placeholder='Confirm password'
                                  value={confirmPassword}
                    ></Form.Control>
                </Form.Group>
                <Button type='submit'
                        variant='primary'
                        disabled={isLoading}
                        className='my-2'
                >Register</Button>
                {isLoading && <Loader/>}
            </Form>
            <Row className='py-3'>
                Already have an account?{' '}
                <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>Login</Link>
            </Row>
        </FormContainer>
    )
}

export default RegisterScreen
