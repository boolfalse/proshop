
import { Col, Row } from 'react-bootstrap';
import Product from "../components/Product";
import { useFetchProductsQuery } from "../slices/productsApiSlice";

const HomeScreen = () => {
    const {
        data: products,
        isLoading,
        error,
    } = useFetchProductsQuery();

    return (
        <>
            { isLoading ? (
                <h3>Loading...</h3>
            ) : (
                error ? (
                    <h3>{ error?.data?.message || error?.error }</h3>
                ) : (
                    <>
                        <h2>Latest Products</h2>
                        <Row>
                            {products.map((product) => (
                                <Col key={product._id} sm="12" md="6" lg="4" xl="3">
                                    <Product product={product} />
                                </Col>
                            ))}
                        </Row>
                    </>
                )
            ) }
        </>
    );
}

export default HomeScreen;
