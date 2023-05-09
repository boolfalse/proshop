
import {Link, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {
    useAdminGetUserDetailsQuery,
    useAdminUpdateUserMutation,
} from "../slices/usersApiSlice";
import FormContainer from "../components/FormContainer";
import Message from "../components/Message";
import Loader from "../components/Loader";
import {Button, Form} from "react-bootstrap";
import {toast} from "react-toastify";

const AdminUserProfileScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    const navigate = useNavigate();
    const { userId } = useParams();
    const {
        data: user,
        isLoading: isLoadingUser,
        error: errorUser,
        refetch: refetchUser,
    } = useAdminGetUserDetailsQuery(userId);
    const [updateUser, {
        isLoading: isLoadingUpdateUser,
        error: errorUpdateUser,
    }] = useAdminUpdateUserMutation();

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setIsAdmin(user.isAdmin);
        }
    }, [
        user,
    ]);

    const submitUpdateHandler = async (e) => {
        e.preventDefault();

        try {
            const updated = await updateUser({
                _id: userId,
                name,
                email,
                isAdmin,
            }).unwrap();
            if (updated.error) {
                toast.error(updated.error || 'Something went wrong!');
            } else {
                toast.success('User updated.');
                refetchUser();
                navigate('/admin/users');
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <Link to={'/admin/users'} className={'btn btn-light my-3'}>
                Users List
            </Link>
            {
                isLoadingUser ? (
                    <Loader />
                ) : (
                    <>
                        <FormContainer>
                            { !user.isAdmin && <h2>Edit Profile</h2> }
                            <h2>Registered on {user.createdAt.substring(0, 10)}</h2>
                            {isLoadingUser ? <Loader /> : (errorUser ? (
                                <Message variant='danger'>{errorUser}</Message>
                            ) : (
                                <Form onSubmit={submitUpdateHandler}>
                                    <Form.Group controlId='name'>
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control type='text'
                                                      disabled={user.isAdmin}
                                                      placeholder='Enter name'
                                                      className='mb-3'
                                                      value={name}
                                                      onChange={(e) => setName(e.target.value)} />
                                    </Form.Group>
                                    <Form.Group controlId='email'>
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control type='email'
                                                      disabled={user.isAdmin}
                                                      placeholder='Enter email'
                                                      className='mb-3'
                                                      value={email}
                                                      onChange={(e) => setEmail(e.target.value)} />
                                    </Form.Group>
                                    <Form.Group controlId='isAdmin'>
                                        <Form.Label>Is Admin</Form.Label>
                                        <Form.Check type='checkbox'
                                                    disabled={user.isAdmin}
                                                    label='Is Admin'
                                                    className='mb-3'
                                                    checked={isAdmin}
                                                    onChange={(e) => setIsAdmin(e.target.checked)}
                                        ></Form.Check>
                                    </Form.Group>
                                    {errorUpdateUser && <Message variant='danger'>{errorUpdateUser}</Message>}
                                    {isLoadingUpdateUser && <Loader />}
                                    {
                                        !isLoadingUpdateUser &&
                                        <Button type='submit'
                                                variant='primary'
                                                disabled={user.isAdmin}
                                                className='my-3'
                                        >Update</Button>
                                    }
                                </Form>
                            ))}
                        </FormContainer>
                    </>
                )
            }
        </>
    );
};

export default AdminUserProfileScreen;
