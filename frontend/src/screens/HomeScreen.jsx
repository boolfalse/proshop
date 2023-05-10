
import { Col, Row } from 'react-bootstrap';
import Product from "../components/Product";
import Loader from "../components/Loader";
import { useFetchProductsQuery } from "../slices/productsApiSlice";
import Message from "../components/Message";
import {useParams} from "react-router-dom";
import Paginate from "../components/Paginate";

const HomeScreen = () => {
    const { pageNumber, keyword } = useParams();
    const {
        data: productsPagination,
        isLoading: isLoadingProducts,
        error,
    } = useFetchProductsQuery({ pageNumber, keyword });

    return (
        <>
            { isLoadingProducts ? (
                <Loader />
            ) : (
                error ? (
                    <Message variant="danger">{error?.data?.message || error?.error}</Message>
                ) : (
                    <>
                        <h2>Latest Products</h2>
                        <Row>
                            {productsPagination.items.map((product) => (
                                <Col key={product._id} sm="12" md="6" lg="4" xl="3">
                                    <Product product={product} />
                                </Col>
                            ))}
                        </Row>
                        <Paginate pages={productsPagination.pagesCount}
                                  page={productsPagination.page}
                                  keyword={keyword}
                                  uriPrefix='/page' />
                    </>
                )
            ) }
        </>
    );
}

export default HomeScreen;
