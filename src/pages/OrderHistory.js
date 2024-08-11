import React, { useEffect, useState } from "react";
import { FaAngleRight } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function OrderHistory() {
    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        const res = await fetch("http://localhost:3001/api/user/get-history", {
            method: "GET",
            credentials: "include",
        });

        const data = await res.json();
        setOrders(data);
        console.log(data);
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <div className="max-w-md sm:max-w-7xl mx-auto pt-16">
            <div className="bg-white p-3 border rounded-md">
                <p className="flex items-center text-sm">
                    <Link to={"/"}>Home</Link> <FaAngleRight />
                    History
                </p>
            </div>
            <h1 className="my-10 text-center text-4xl font-bold font-dancing">History</h1>

            <ul className="flex flex-col gap-3">
                {orders.length > 0 &&
                    orders.map((order, index) => (
                        <li key={index} className="border border-orange-500 rounded-md p-3">
                            <div className="flex justify-between">
                                <h1 className="text-sm">Total: ${order.totalPrice.toFixed(2)}</h1>
                                <h1 className="text-sm">Time: {order.createdAt}</h1>
                                <span className="text-sm">Status: {order.isPaid ? "Success" : "Shipping"}</span>
                            </div>
                            <ul className="mt-3">
                                {order.items.map((item, i) => (
                                    <li key={i} className="grid grid-cols-3 text-center">
                                        <h1>{item.product.name}</h1>
                                        <p className="text-sm">{item.quantity}</p>
                                        <p className="text-sm">
                                            $
                                            <span className="font-semibold">
                                                {(item.product.discountPrice * item.quantity).toFixed(2)}
                                            </span>{" "}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
            </ul>
        </div>
    );
}
