import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImNotification } from "react-icons/im";
import { BsCashCoin } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { FaPaypal } from "react-icons/fa";
import Paypal from "../components/Paypal";
import { refeshCartAfterPurchase } from "../redux/cart/cartSlice";
export default function Checkout() {
    let idOrder;
    const { items, totalPrice } = useSelector((state) => state.cart);
    const { currentUser } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [informations, setInformation] = useState({});

    const fetchProfile = async () => {
        try {
            const res = await fetch("http://localhost:3001/api/user/get-profile", {
                method: "GET",
                credentials: "include",
            });
            const data = await res.json();
            if (data.success === false) {
                console.log(data.message);
                return;
            }
            setInformation(data);
        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);
    const handleChangeInformation = (e) => {
        setInformation((prev) => ({
            ...prev,
            [e.target.id]: e.target.value,
        }));
    };

    const handlePurchaseNewOrder = async () => {
        try {
            await setInformation((prev) => ({ ...prev, user: currentUser._id }));
            const res = await fetch("http://localhost:3001/api/order/purchase-by-cash", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    profile: informations,
                    items: items,
                    totalPrice: totalPrice,
                    payment: "cash",
                    isPaid: false,
                }),
            });
            const data = await res.json();
            if (data.success === false) {
                console.log(data.message);
                return;
            }
            console.log(data);
            dispatch(refeshCartAfterPurchase());
            navigate("/");
        } catch (error) {
            console.log(error.message);
        }
    };

    const createOrder = async () => {
        await setInformation((prev) => ({ ...prev, user: currentUser._id }));
        try {
            const res = await fetch("http://localhost:3001/api/order/purchase-by-paypal", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    profile: informations,
                    items: items,
                    totalPrice: totalPrice,
                    payment: "paypal",
                    isPaid: false,
                }),
            });

            const data = await res.json();
            if (data.success === false) {
                console.log(data.message);
                return;
            }
            idOrder = data.idData;
            return data.idPaypal;
        } catch (error) {
            console.error(error);
        }
    };

    const onApprove = async (data) => {
        try {
            await fetch("http://localhost:3001/api/order/capture-order-paypal", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    orderId: data.orderID,
                    idData: idOrder,
                }),
            });
            alert("Payment Successful!");
            dispatch(refeshCartAfterPurchase());
            navigate("/");
        } catch (error) {
            console.error("Error capturing order:", error);
        }
    };

    return (
        <div className="sm:max-w-7xl max-w-md mx-auto grid grid-cols-2">
            <div className="pt-16 px-6">
                <h1 className="text-sm text-gray-500">Account</h1>
                <input
                    readOnly
                    value={`${currentUser.email}`}
                    className="p-3 border-b w-full text-sm font-medium outline-none select-none"
                />

                <form className="mt-16 grid grid-cols-1 gap-3">
                    <h1>Delivery</h1>
                    <div className="grid grid-cols-2 gap-3">
                        <input
                            id="firstname"
                            value={informations.firstname || ""}
                            onChange={handleChangeInformation}
                            className="border border-slate-500 rounded-md p-3 outline-orange-500"
                            placeholder="First name"
                        />
                        <input
                            id="lastname"
                            value={informations.lastname || ""}
                            onChange={handleChangeInformation}
                            className="border border-slate-500 rounded-md p-3 outline-orange-500"
                            placeholder="Last name"
                        />
                    </div>

                    <div>
                        <input
                            id="phone"
                            type="text"
                            value={informations.phone || ""}
                            onChange={handleChangeInformation}
                            className="w-full border border-slate-500 rounded-md p-3 outline-orange-500"
                            placeholder="Phone number"
                        />
                    </div>
                    <div>
                        <input
                            id="address"
                            value={informations.address || ""}
                            onChange={handleChangeInformation}
                            className="border border-slate-500 rounded-md p-3 outline-orange-500 w-full"
                            placeholder="Apartment, suite, etc.(optional)"
                        />
                        <p className="flex items-center gap-2 mt-1 text-sm">
                            <ImNotification /> <span>Add a number house if you have one</span>
                        </p>
                    </div>

                    <div>
                        <h1 className="font-bold">Shipping method</h1>
                        <input
                            id="shipping_method"
                            value={"Fast Delivery"}
                            readOnly
                            className="outline-none rounded-md p-3 bg-gray-200 w-full mt-2"
                            placeholder="Enter your shipping address to view shipping methods"
                        />
                    </div>
                    <div>
                        <h1 className="font-bold text-xl mt-10">Payment</h1>
                        <p className="text-sm">All transactions are secure and encrypted.</p>
                    </div>
                    <div className="w-full">
                        <ul className="grid grid-cols-2 gap-3">
                            <li className="flex flex-col items-center justify-center bg-orange-500 py-2 rounded-lg text-white cursor-pointer">
                                <BsCashCoin className="text-2xl" />
                                <h3 className="text-sm">Cash</h3>
                            </li>
                            <li className="flex flex-col items-center justify-center border border-orange-500 py-2 rounded-lg cursor-pointer">
                                <FaPaypal className="text-2xl text-blue-500" />
                                <h3 className="text-sm">Paypal</h3>
                            </li>
                        </ul>
                    </div>
                    <Paypal createOrder={createOrder} onApprove={onApprove} />
                </form>
            </div>
            <div className="bg-gray-100 pt-16 px-6 border-l border-slate-600">
                <ul className="flex flex-col gap-3 px-3">
                    {items.map((item, index) => {
                        const product = item.product;
                        return (
                            <li key={index} className="flex justify-between items-center">
                                <div className="flex gap-3 items-center">
                                    <div className="h-[70px] w-[70px] relative">
                                        <div className="w-full h-full rounded-md border border-slate-500 overflow-hidden">
                                            <img
                                                src={`${product.imageUrls[0]}`}
                                                className="object-cover w-full h-full"
                                            />
                                        </div>
                                        <div className="absolute h-5 w-5 text-center text-white text-xs leading-5 bg-slate-600  rounded-full -right-1 -top-2 z-10">
                                            {item.quantity}
                                        </div>
                                    </div>
                                    <div>
                                        <h1 className="text-sm">{product.name}</h1>
                                        <p className="text-xs text-gray-500">
                                            {product.weight} {product.unit}
                                        </p>
                                    </div>
                                </div>
                                <p>
                                    $
                                    {(
                                        (product.discountPrice > 0 ? product.discountPrice : product.price) *
                                        item.quantity
                                    ).toFixed(2)}
                                </p>
                            </li>
                        );
                    })}
                </ul>

                <div className="w-full mt-12 flex flex-col gap-2 border-t border-slate-500">
                    <div className="flex justify-around items-center mt-3">
                        <p className="text-start">Subtotal</p>
                        <p className="text-end">${totalPrice.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-around items-center">
                        <p className="text-start">Shipping</p>
                        <p className="text-end">$30.00</p>
                    </div>
                    <div className="flex justify-around items-center">
                        <p className="text-start text-xl font-bold">Total</p>
                        <p className="text-end">${(totalPrice + 30).toFixed(2)}</p>
                    </div>
                </div>

                <button
                    className={`bg-orange-500 text-white p-3 w-full mt-3 rounded-lg 
                    }`}
                    onClick={handlePurchaseNewOrder}
                >
                    Purchase
                </button>
            </div>
        </div>
    );
}
