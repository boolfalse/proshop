
import {ORDERS_URL, PAYPAL_URL} from "../constants";
import {apiSlice} from "./apiSlice";

export const ordersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createOrder: builder.mutation({
            query: (data) => ({
                url: ORDERS_URL,
                method: "POST",
                body: data,
            }),
        }),
        getOrderDetails: builder.query({
            query: (orderId) => ({
                url: `${ORDERS_URL}/my/${orderId}`,
            }),
        }),
        payOrder: builder.mutation({
            query: ({orderId, details}) => ({
                url: `${ORDERS_URL}/pay/${orderId}`,
                method: "PUT",
                body: details,
            }),
        }),
        getPaypalClientId: builder.query({
            query: () => ({
                url: `${PAYPAL_URL}`,
            }),
            keepUnusedDataFor: 5,
        }),
    }),
});

export const {
    useCreateOrderMutation,
    useGetOrderDetailsQuery,
    usePayOrderMutation,
    useGetPaypalClientIdQuery,
} = ordersApiSlice;
