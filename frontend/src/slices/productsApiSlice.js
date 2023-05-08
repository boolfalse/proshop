
import { PRODUCTS_URL } from "../constants";
import {apiSlice} from "./apiSlice";

export const productsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        fetchProducts: builder.query({
            query: () => ({
                url: PRODUCTS_URL,
            }),
            keepUnusedDataFor: 5, // seconds
        }),
        getProductDetails: builder.query({
            query: (productId) => ({
                url: `${PRODUCTS_URL}/${productId}`,
            }),
        }),
        createProduct: builder.mutation({
            query: () => ({
                url: PRODUCTS_URL,
                method: "POST",
            }),
            invalidatesTags: ['Product'], // invalidates all queries with tag 'Product'
        }),
    }),
});

// convention: fetchProducts -> useFetchProductsQuery
export const {
    useFetchProductsQuery,
    useGetProductDetailsQuery,
    useCreateProductMutation,
} = productsApiSlice;
