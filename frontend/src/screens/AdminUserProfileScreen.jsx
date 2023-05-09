
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
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');

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
            <FormContainer>
                <h2>Edit User</h2>
                {isLoadingUser ? <Loader /> : (errorUser ? (
                    <Message variant='danger'>{errorUser}</Message>
                ) : (
                    <Form onSubmit={submitUpdateHandler}>
                        <Form.Group controlId='name'>
                            <Form.Label>Name</Form.Label>
                            <Form.Control type='text'
                                          placeholder='Enter name'
                                          value={name}
                                          onChange={(e) => setName(e.target.value)} />
                        </Form.Group>
                        {errorUpdateUser && <Message variant='danger'>{errorUpdateUser}</Message>}
                        {isLoadingUpdateUser && <Loader />}
                        <Button type='submit' variant='primary' className='my-3'>Update</Button>
                    </Form>
                ))}
            </FormContainer>
        </>
    );
};

export default AdminUserProfileScreen;
