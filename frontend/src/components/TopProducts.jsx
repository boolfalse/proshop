
import {useGetTopProductsQuery} from "../slices/productsApiSlice";
import Loader from "./Loader";
import Message from "./Message";
import {Carousel, Image} from "react-bootstrap";
import {Link} from "react-router-dom";

const TopProducts = () => {
    const {
        data: topProducts,
        isLoading: isLoadingTopProducts,
        error,
    } = useGetTopProductsQuery();

    return isLoadingTopProducts ? (
        <Loader />
    ) : (error ? (
        <Message variant="danger">{error?.data?.message || error?.error || 'Something went wrong!'}</Message>
    ) : (
        <Carousel pause="hover" className="bg-primary mb-4">
            {topProducts.map((product) => (
                <Carousel.Item key={product._id}>
                    <Link to={`/product/${product._id}`}>
                        <Image src={product.image} alt={product.name} fluid />
                        <Carousel.Caption className="carousel-caption">
                            <h2>{product.name} (${product.price})</h2>
                        </Carousel.Caption>
                    </Link>
                </Carousel.Item>
            ))}
        </Carousel>
    ));
};

export default TopProducts;
