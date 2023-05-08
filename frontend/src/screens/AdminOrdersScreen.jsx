
import {FaTimes} from "react-icons/fa";
import {LinkContainer} from "react-router-bootstrap";
import {Button, Table} from "react-bootstrap";
import {useGetOrdersQuery} from "../slices/ordersApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";

const AdminOrdersScreen = () => {
    const {
        data: orders,
        isLoading: isLoadingOrders,
        error: errorOrders,
    } = useGetOrdersQuery();

    return <>
        <h2>Orders</h2>
        {isLoadingOrders ? <Loader /> : (
            errorOrders ? (
                <Message variant='danger'>{errorOrders}</Message>
            ) : (
                <Table striped hover responsive className={'table-sm'}>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>DATE</th>
                        <th>TOTAL</th>
                        <th>PAID</th>
                        <th>DELIVERED</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders?.map((order) => (
                        <tr key={order._id}>
                            <td>{order._id}</td>
                            <td>{order.createdAt.substring(0, 10)}</td>
                            <td>${order.totalPrice}</td>
                            <td>{order.isPaid ? order.paidAt.substring(0, 10) : (
                                <FaTimes style={{color: 'red'}} />
                            )}</td>
                            <td>{order.isDelivered ? order.deliveredAt.substring(0, 10) : (
                                <FaTimes style={{color: 'red'}} />
                            )}</td>
                            <td>
                                <LinkContainer to={`/order/${order._id}`}>
                                    <Button variant='light' className='btn-sm'>Details</Button>
                                </LinkContainer>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            )
        )}
    </>;
};

export default AdminOrdersScreen;
