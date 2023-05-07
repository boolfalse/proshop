
import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from "../utils/cartUtils";

const initialState = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : {
    cartItems: [],
    shippingAddress: {
        // address: "",
        // city: "",
        // postalCode: "",
        // country: "",
    },
    paymentMethod: "PayPal",
};

export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const item = action.payload;
            const itemInCart = state.cartItems.find((i) => i._id === item._id);
            if (itemInCart) {
                state.cartItems = state.cartItems.map((i) => (i._id === itemInCart._id ? item : i));
            } else {
                state.cartItems = [ ...state.cartItems, item ];
            }

            return updateCart(state);
        },
        removeFromCart: (state, action) => {
            const id = action.payload;
            state.cartItems = state.cartItems.filter((i) => i._id !== id);

            return updateCart(state);
        },
        saveShippingAddress: (state, action) => {
            state.shippingAddress = action.payload;

            return updateCart(state);
        },
        savePaymentMethod: (state, action) => {
            state.paymentMethod = action.payload;

            return updateCart(state);
        },
        clearCartItems: (state) => {
            state.cartItems = [];

            return updateCart(state);
        },
    },
});

export const {
    addToCart,
    removeFromCart,
    saveShippingAddress,
    savePaymentMethod,
    clearCartItems,
} = cartSlice.actions;
export default cartSlice.reducer;
