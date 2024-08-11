import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import DetailsProduct from "./pages/DetailsProduct";
import Collections from "./pages/Collections";
import Footer from "./components/Footer";
import Account from "./pages/Account";
import OrderHistory from "./pages/OrderHistory";
import Toast from "./components/Toast";
import { useSelector } from "react-redux";

// router component
export default function App({ children }) {
    const { start, typeToast, content } = useSelector((state) => state.toast);
    return (
        <BrowserRouter>
            <Header />
            {start && <Toast />}
            {children}

            <Routes>
                <Route path="/" element={<Home />} />
                <Route element={<PrivateRoute />}>
                    <Route path="/account" element={<Account />} />
                    <Route path="/cart/:id" element={<Cart />} />
                    <Route path="/checkout/:id" element={<Checkout />} />
                    <Route path="/history" element={<OrderHistory />} />
                </Route>
                <Route path="/product/:id_product" element={<DetailsProduct />} />
                <Route path="/collections/:category" element={<Collections />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/about" element={<Toast />} />
            </Routes>
            <Footer />
        </BrowserRouter>
    );
}
