import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    items: [],
    totalPrice: 0,
};

export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        loadCartItems: (state, action) => {
            state.items = [...state.items, ...action.payload.cartItems];
            state.totalPrice += action.payload.totalPrice;
        },
        addNewCartItem: (state, action) => {
            state.items = [...state.items, action.payload];
            state.totalPrice +=
                (action.payload.product.discountPrice > 0
                    ? action.payload.product.discountPrice
                    : action.payload.product.price) * action.payload.quantity;
        },
        clearCart: (state) => {
            state.items = [];
            state.totalPrice = 0;
        },
        deleteCartItem: (state, action) => {
            state.items = state.items.filter((item) => item.id !== action.payload.id);
            state.totalPrice -=
                (action.payload.product.discountPrice > 0
                    ? action.payload.product.discountPrice
                    : action.payload.product.price) * action.payload.quantity;
        },
        updateCartItem: (state, action) => {
            const updateItem = state.items.find((item) => item.id === action.payload._id);
            updateItem.quantity = action.payload.quantity;
            state.totalPrice = state.items.reduce((acc, item) => {
                const price = item.product.discountPrice > 0 ? item.product.discountPrice : item.product.price;
                return (acc += item.quantity * price);
            }, 0);
        },
        refeshCartAfterPurchase: (state) => {
            state.items = [];
            state.totalPrice = 0;
        },
    },
});

export const { loadCartItems, addNewCartItem, clearCart, deleteCartItem, updateCartItem, refeshCartAfterPurchase } = cartSlice.actions;

export default cartSlice.reducer;
