
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Button, Col, Form, Row} from "react-bootstrap";
import {useProfileMutation} from "../slices/usersApiSlice";
import Loader from "../components/Loader";
import {toast} from "react-toastify";
import {setCredentials} from "../slices/authSlice";

const ProfileScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const dispatch = useDispatch();
    const { userInfo } = useSelector(state => state.auth);
    const [updateProfile, {
        isLoading: isLoadingUpdateProfile,
        error,
        data,
    }] = useProfileMutation();

    useEffect(() => {
        if (userInfo) {
            setName(userInfo.name);
            setEmail(userInfo.email);
        }
    }, [
        userInfo.name,
        // userInfo.email,
    ]);

    const submitHandler = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.warning('Passwords do not match!');
        } else {
            try {
                const res = await updateProfile({
                    _id: userInfo._id,
                    name,
                    // email,
                    password,
                }).unwrap();
                dispatch(setCredentials(res));
                toast.success('Profile updated successfully!');
            } catch (err) {
                toast.error(err.data?.message || err.error || 'Something went wrong!');
            }
        }
    };

    return (
        <Row>
            <Col md={3}>
                <h2>User Profile</h2>
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId='name' className={'mb-3'}>
                        <Form.Label>Name</Form.Label>
                        <Form.Control type='text'
                                      placeholder='Enter name'
                                      value={name}
                                      onChange={(e) => setName(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId='email' className={'mb-3'}>
                        <Form.Label>Email (disabled)</Form.Label>
                        <Form.Control type='text'
                                      placeholder='Enter email'
                                      value={email}
                                      // onChange={(e) => setEmail(e.target.value)}
                                      disabled={true}
                        />
                    </Form.Group>
                    <Form.Group controlId='password' className={'mb-3'}>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type='password'
                                      placeholder='Enter password'
                                      value={password}
                                      onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId='confirmPassword' className={'mb-3'}>
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control type='password'
                                      placeholder='Confirm password'
                                      value={confirmPassword}
                                      onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </Form.Group>
                    <Button type='submit' variant='primary' className={'mb-2'}>
                        Update
                    </Button>
                    {isLoadingUpdateProfile && <Loader />}
                </Form>
            </Col>
            <Col md={9}></Col>
        </Row>
    );
};

export default ProfileScreen;
