
import {LinkContainer} from "react-router-bootstrap";
import {Button, Col, Row, Table} from "react-bootstrap";
import {
    useAdminGetUsersQuery,
    useAdminDeleteUserMutation,
} from "../slices/usersApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import {FaEdit, FaPlusSquare, FaTrash} from "react-icons/fa";
import {toast} from "react-toastify";

const AdminUsersScreen = () => {
    const {
        data: users,
        isLoading: isLoadingUsers,
        error: errorUsers,
        refetch: refetchUsers,
    } = useAdminGetUsersQuery();
    const [deleteUser, {
        isLoading: isLoadingDeleteUser,
        error: errorDeleteUser,
    }] = useAdminDeleteUserMutation();

    const deleteUserHandler = async (userId, isAdmin) => {
        // if (isAdmin) {
        //     toast.error('Not allowed to delete admin user!');
        //     return;
        // }
        if (window.confirm('Are you sure you want to delete the user?')) {
            try {
                await deleteUser(userId);
                refetchUsers();
                toast.success('User deleted.');
            } catch (err) {
                toast.error(err.data?.message || err.error || 'Something went wrong!');
            }
        }
    };

    return <>
        {isLoadingDeleteUser && <Loader />}
        {isLoadingUsers ? <Loader /> : (
            errorUsers ? (
                <Message variant='danger'>{errorUsers}</Message>
            ) : (
                <Table striped hover responsive className={'table-sm'}>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>NAME</th>
                        <th>EMAIL</th>
                        <th>REGISTERED</th>
                        <th>ROLE</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users?.map((user) => (
                        <tr key={user._id}>
                            <td>{user._id}</td>
                            <td>{user.name}</td>
                            <td>
                                <a href={`mailto:${user.email}`}>{user.email}</a>
                            </td>
                            <td>{user.createdAt.substring(0, 10)}</td>
                            <td>{user.isAdmin ? 'Admin' : 'User'}</td>
                            <td>
                                <LinkContainer to={`/admin/users/${user._id}`}>
                                    <Button variant='light' className='btn-sm mx-2' title='Edit User'>
                                        <FaEdit />
                                    </Button>
                                </LinkContainer>
                                <Button variant='danger'
                                        disabled={user.isAdmin}
                                        style={{color: user.isAdmin ? 'red' : 'black'}}
                                        className='btn-sm mx-2'
                                        onClick={() => deleteUserHandler(user._id, user.isAdmin)}
                                        title='Delete User'>
                                    <FaTrash />
                                </Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            )
        )}
    </>;
};

export default AdminUsersScreen;
