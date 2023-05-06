
import {useState} from "react";
import FormContainer from "../components/FormContainer";
import {Button, Form, Row} from "react-bootstrap";
import {Link} from "react-router-dom";

const LoginScreen = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const submitHandler = (e) => {
        e.preventDefault() // prevent page from refreshing
        console.log('submit')
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
                <Button type='submit' variant='primary' className='my-2'>
                    Login
                </Button>
            </Form>
            <Row className='py-3'>
                New Customer? <Link to={'/register'}>Register</Link>
            </Row>
        </FormContainer>
    )
}

export default LoginScreen
