
import { Col, Row } from 'react-bootstrap';
import Product from "../components/Product";
import Loader from "../components/Loader";
import { useFetchProductsQuery } from "../slices/productsApiSlice";
import Message from "../components/Message";
import {Link, useParams} from "react-router-dom";
import Paginate from "../components/Paginate";
import {FaArrowLeft} from "react-icons/fa";
import TopProducts from "../components/TopProducts";

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
                        {
                            keyword ? (
                                <>
                                    <h2>Search Results for "{keyword}"</h2>
                                    <Link variant="light" className="btn btn-light" to="/">
                                        <FaArrowLeft /> Back to Home
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <TopProducts />
                                    <h2>Latest Products</h2>
                                </>
                            )
                        }
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
