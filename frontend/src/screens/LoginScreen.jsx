
import {useEffect, useState} from "react";
import FormContainer from "../components/FormContainer";
import {Button, Form, Row} from "react-bootstrap";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {useLoginMutation} from "../slices/usersApiSlice";
import {useDispatch, useSelector} from "react-redux";
import {setCredentials} from "../slices/authSlice";
import {toast} from "react-toastify";
import Loader from "../components/Loader";

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loginApiCall, {isLoading, error}] = useLoginMutation();
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
        e.preventDefault()

        try {
            const res = await loginApiCall({email, password}).unwrap();
            dispatch(setCredentials({ ...res }));
            navigate(redirect);
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    }

    return (
        <FormContainer>
            <h2>Login</h2>
            <Form onSubmit={submitHandler}>
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
                <Button type='submit'
                        variant='primary'
                        disabled={isLoading}
                        className='my-2'
                >Login</Button>
                {isLoading && <Loader/>}
            </Form>
            <Row className='py-3'>
                New Customer?
                <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>Register</Link>
            </Row>
        </FormContainer>
    )
}

export default LoginScreen
