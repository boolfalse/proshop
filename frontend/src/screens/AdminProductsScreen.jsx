
import {LinkContainer} from "react-router-bootstrap";
import {Button, Col, Row, Table} from "react-bootstrap";
import {useFetchProductsQuery} from "../slices/productsApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import {FaPlusSquare} from "react-icons/fa";

const AdminProductsScreen = () => {
    const {
        data: products,
        isLoading: isLoadingProducts,
        error: errorProducts,
    } = useFetchProductsQuery();

    return <>
        <Row className='align-items-center'>
            <Col className='text-start'>
                <h2>Products</h2>
            </Col>
            <Col className='text-end'>
                <LinkContainer to='/admin/product/create'>
                    <Button className='my-3'>
                        <FaPlusSquare /> Create Product
                    </Button>
                </LinkContainer>
            </Col>
        </Row>
        {isLoadingProducts ? <Loader /> : (
            errorProducts ? (
                <Message variant='danger'>{errorProducts}</Message>
            ) : (
                <Table striped hover responsive className={'table-sm'}>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>NAME</th>
                        <th>DATE</th>
                        <th>PRICE</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {products?.map((product) => (
                        <tr key={product._id}>
                            <td>{product._id}</td>
                            <td>{product.name}</td>
                            <td>{product.createdAt.substring(0, 10)}</td>
                            <td>${product.price}</td>
                            <td>
                                <LinkContainer to={`/product/${product._id}`}>
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

export default AdminProductsScreen;
