
import {Link, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {
    useGetProductDetailsQuery,
    useUpdateProductMutation,
    useUploadProductImageMutation,
} from "../slices/productsApiSlice";
import FormContainer from "../components/FormContainer";
import Message from "../components/Message";
import Loader from "../components/Loader";
import {Button, Form} from "react-bootstrap";
import {toast} from "react-toastify";

const AdminProductScreen = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');

    const navigate = useNavigate();
    const { productId } = useParams();
    const {
        data: product,
        isLoading: isLoadingProduct,
        error: errorProduct,
        refetch: refetchProduct,
    } = useGetProductDetailsQuery(productId);
    const [updateProduct, {
        isLoading: isLoadingUpdateProduct,
        error: errorUpdateProduct,
    }] = useUpdateProductMutation();
    const [uploadProductImage, {
        isLoading: isLoadingUploadProductImage,
        error: errorUploadProductImage,
    }] = useUploadProductImageMutation();

    useEffect(() => {
        if (product) {
            setName(product.name);
            setPrice(product.price);
            setImage(product.image);
            setBrand(product.brand);
            setCategory(product.category);
            setCountInStock(product.countInStock);
            setDescription(product.description);
        }
    }, [
        product,
    ]);

    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            const updated = await updateProduct({
                _id: productId,
                name,
                price,
                image,
                brand,
                category,
                countInStock,
                description,
            }).unwrap();
            if (updated.error) {
                toast.error(updated.error || 'Something went wrong!');
            } else {
                toast.success('Product updated.');
                refetchProduct();
                navigate('/admin/products-list');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const uploadProductImageHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);

        try {
            const uploaded = await uploadProductImage(formData).unwrap();
            if (uploaded.success) {
                toast.success('Product image uploaded.');
                setImage(uploaded.image);
            } else {
                toast.error(uploaded.error || 'Something went wrong!');
            }
        } catch (err) {
            // console.error(err.data?.message || err.error);
            toast.error('Something went wrong!');
        }
    };

    return (
        <>
            <Link to={'/admin/products-list'} className={'btn btn-light my-3'}>
                Products List
            </Link>
            <FormContainer>
                <h2>Edit Product</h2>
                {isLoadingProduct ? <Loader /> : (errorProduct ? (
                    <Message variant='danger'>{errorProduct}</Message>
                ) : (
                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId='name'>
                            <Form.Label>Name</Form.Label>
                            <Form.Control as='textarea'
                                          row='3'
                                          placeholder='Enter name'
                                          value={name}
                                          onChange={(e) => setName(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId='price'>
                            <Form.Label>Price</Form.Label>
                            <Form.Control type='number'
                                          placeholder='Enter price'
                                          value={price}
                                          onChange={(e) => setPrice(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId='image'>
                            <Form.Label>Image</Form.Label>
                            <Form.Control type='hidden'
                                          // placeholder='Enter image url'
                                          // onChange={(e) => setImage(e.target.value)}
                                          value={image} />
                            <Form.Control type='file'
                                          placeholder='Choose image'
                                          onChange={uploadProductImageHandler} />
                        </Form.Group>
                        <Form.Group controlId='brand'>
                            <Form.Label>Brand</Form.Label>
                            <Form.Control type='text'
                                          placeholder='Enter brand'
                                          value={brand}
                                          onChange={(e) => setBrand(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId='category'>
                            <Form.Label>Category</Form.Label>
                            <Form.Control type='text'
                                          placeholder='Enter category'
                                          value={category}
                                          onChange={(e) => setCategory(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId='countInStock'>
                            <Form.Label>Count In Stock</Form.Label>
                            <Form.Control type='number'
                                          placeholder='Enter count in stock'
                                          value={countInStock}
                                          onChange={(e) => setCountInStock(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId='description'>
                            <Form.Label>Description</Form.Label>
                            <Form.Control type='text'
                                          placeholder='Enter description'
                                          value={description}
                                          onChange={(e) => setDescription(e.target.value)} />
                        </Form.Group>
                        {errorUpdateProduct && <Message variant='danger'>{errorUpdateProduct}</Message>}
                        {isLoadingUpdateProduct && <Loader />}
                        <Button type='submit' variant='primary' className='my-3'>Update</Button>
                    </Form>
                ))}
            </FormContainer>
        </>
    );
};

export default AdminProductScreen;
