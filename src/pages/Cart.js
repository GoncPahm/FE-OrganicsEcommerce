import React from "react";
import { FaAngleRight, FaMinus, FaPlus } from "react-icons/fa";
import { GoTrash } from "react-icons/go";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ItemCartPage from "../components/ItemCartPage";

export default function Cart() {
    const { items, totalPrice } = useSelector((state) => state.cart);
    const { currentUser } = useSelector((state) => state.user);
    return (
        <div className="max-w-md sm:max-w-7xl mx-auto pt-16">
            <div className="bg-white p-3 border rounded-md">
                <p className="flex items-center text-sm">
                    <Link to={"/"}>Home</Link> <FaAngleRight />
                    Your Shopping Cart
                </p>
            </div>

            <div className="flex justify-between items-center my-8">
                <h1 className="text-xl sm:text-3xl font-bold">Your Cart</h1>
                <Link to={"/"} className="text-orange-500 text-sm sm:text-base">
                    Continue shopping
                </Link>
            </div>

            <ul className="grid grid-cols-1 gap-5">
                {items.map((item, index) => (
                    <ItemCartPage key={index} item={item} />
                ))}
            </ul>

            <div className="flex flex-col gap-6 sm:flex-row justify-between items-start pt-4 border-t border-slate-400 mt-10">
                <div className="flex flex-col gap-4 w-full sm:w-auto">
                    <p className="text-sm">Order special instructions</p>
                    <textarea className="w-full sm:w-[560px] h-[160px] outline-none shadow-md p-3 border rounded-md"></textarea>
                </div>

                <div className="flex flex-col gap-3 self-end sm:self-start">
                    <p>
                        Subtotal: <span className="text-xl font-bold">${totalPrice.toFixed(2)}</span>
                    </p>
                    <p className="text-sm">Taxes and shipping calculated at checkout</p>
                    <Link to={`/checkout/${currentUser._id}`} className="bg-orange-500 text-white text-center p-3 rounded-lg">
                        Checkout
                    </Link>
                </div>
            </div>
        </div>
    );
}
