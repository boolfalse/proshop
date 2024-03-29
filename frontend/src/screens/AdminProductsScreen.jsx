
import {LinkContainer} from "react-router-bootstrap";
import {Button, Col, Row, Table} from "react-bootstrap";
import {
    useFetchProductsQuery,
    useCreateProductMutation,
    useDeleteProductMutation,
} from "../slices/productsApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import {FaEdit, FaPlusSquare, FaTrash} from "react-icons/fa";
import {toast} from "react-toastify";
import {useParams} from "react-router-dom";
import Paginate from "../components/Paginate";

const AdminProductsScreen = () => {
    const { pageNumber, keyword } = useParams();
    const {
        data: productsPagination,
        isLoading: isLoadingProducts,
        error: errorProducts,
        refetch: refetchProducts,
    } = useFetchProductsQuery({ pageNumber, keyword });
    const [createProduct, {
        isLoading: isLoadingCreateProduct,
        error: errorCreateProduct,
    }] = useCreateProductMutation();
    const [deleteProduct, {
        isLoading: isLoadingDeleteProduct,
        error: errorDeleteProduct,
    }] = useDeleteProductMutation();

    const createProductHandler = async () => {
        if (window.confirm('Are you sure you want to create a new product?')) {
            try {
                await createProduct();
                refetchProducts();
                toast.success('Sample product created.');
            } catch (err) {
                toast.error(err.data?.message || err.error || 'Something went wrong!');
            }
        }
    };
    const deleteProductHandler = async (productId) => {
        if (window.confirm('Are you sure you want to delete the product?')) {
            try {
                await deleteProduct(productId);
                refetchProducts();
                toast.success('Product deleted.');
            } catch (err) {
                toast.error(err.data?.message || err.error || 'Something went wrong!');
            }
        }
    };

    return <>
        <Row className='align-items-center'>
            <Col className='text-start'>
                <h2>Products</h2>
            </Col>
            <Col className='text-end'>
                <Button className='my-3' onClick={createProductHandler} disabled={isLoadingCreateProduct}>
                    <FaPlusSquare /> Create Product
                </Button>
            </Col>
        </Row>
        {isLoadingCreateProduct && <Loader />}
        {isLoadingDeleteProduct && <Loader />}

        {isLoadingProducts ? <Loader /> : (
            errorProducts ? (
                <Message variant='danger'>{errorProducts}</Message>
            ) : (
                <>
                    <Table striped hover responsive className={'table-sm'}>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>NAME</th>
                            <th>ADDED</th>
                            <th>CATEGORY</th>
                            <th>BRAND</th>
                            <th>PRICE</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {productsPagination.items?.map((product) => (
                            <tr key={product._id}>
                                <td>{product._id}</td>
                                <td>{product.name}</td>
                                <td>{product.createdAt.substring(0, 10)}</td>
                                <td>{product.category}</td>
                                <td>{product.brand}</td>
                                <td>${product.price}</td>
                                <td>
                                    <LinkContainer to={`/admin/products/${product._id}`}>
                                        <Button variant='light' className='btn-sm mx-2' title='Edit Product'>
                                            <FaEdit />
                                        </Button>
                                    </LinkContainer>
                                    <Button variant='danger'
                                            style={{color: 'white'}}
                                            className='btn-sm mx-2'
                                            onClick={() => deleteProductHandler(product._id)}
                                            title='Delete Product'>
                                        <FaTrash />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                    <Paginate pages={productsPagination.pagesCount}
                              page={productsPagination.page}
                              keyword={keyword}
                              uriPrefix='/admin/products-list/page' />
                </>
            )
        )}
    </>;
};

export default AdminProductsScreen;
