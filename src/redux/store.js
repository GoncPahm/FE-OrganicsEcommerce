import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice.js";
import cartReducer from "./cart/cartSlice.js";
import toastReducer from "./toast/toastSlice.js";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
const persistConfig = {
    key: "root",
    storage,
    version: 1,
    whitelist: ["user", "cart", "toast"],
};
const rootReducer = combineReducers({ user: userReducer, cart: cartReducer, toast: toastReducer });
const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);
