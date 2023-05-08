
import { PRODUCTS_URL } from "../constants";
import {apiSlice} from "./apiSlice";

export const productsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        fetchProducts: builder.query({
            query: () => ({
                url: PRODUCTS_URL,
            }),
            providesTags: ['Products'], // tags are used for invalidation
            keepUnusedDataFor: 5, // seconds
        }),
        getProductDetails: builder.query({
            query: (productId) => ({
                url: `${PRODUCTS_URL}/${productId}`,
            }),
            keepUnusedDataFor: 5,
        }),
        createProduct: builder.mutation({
            query: () => ({
                url: PRODUCTS_URL,
                method: "POST",
            }),
            invalidatesTags: ['Product'], // invalidates all queries with tag 'Product'
        }),
        updateProduct: builder.mutation({
            query: (data) => ({
                url: `${PRODUCTS_URL}/${data._id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ['Products'],
        }),
    }),
});

// convention: fetchProducts -> useFetchProductsQuery
export const {
    useFetchProductsQuery,
    useGetProductDetailsQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
} = productsApiSlice;
