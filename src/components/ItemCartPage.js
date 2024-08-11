import React, { useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { GoTrash } from "react-icons/go";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { deleteCartItem, updateCartItem } from "../redux/cart/cartSlice";
import { startToast, timeoOutToast } from "../redux/toast/toastSlice";

export default function ItemCartPage({ item }) {
    const product = item.product;
    const dispatch = useDispatch();
    const [timeOutId, setTimeoutID] = useState(null);

    useEffect(() => {
        return () => {
            if (timeOutId) clearTimeout(timeOutId);
        };
    }, [timeOutId]);

   const handleDeleteCartItem = async () => {
        try {
            const res = await fetch(`http://localhost:3001/api/cart/delete/${item.id}`, {
                method: "DELETE",
                credentials: "include",
            });
            const data = await res.json();
            if (data.success === false) {
                dispatch(
                    startToast({
                        typeToast: "error",
                        content: data.message,
                    })
                );
                if (timeOutId) clearTimeout(timeOutId);
                const idTimeout = setTimeout(() => {
                    dispatch(timeoOutToast());
                }, 2000);
                setTimeoutID(idTimeout);
                return;
            }

            dispatch(deleteCartItem(data));
            dispatch(
                startToast({
                    typeToast: "notifi",
                    content: `Item deleted!!!`,
                })
            );
            if (timeOutId) clearTimeout(timeOutId);
            const idTimeout = setTimeout(() => {
                dispatch(timeoOutToast());
            }, 2000);
            setTimeoutID(idTimeout);
        } catch (error) {
            console.log(error);
        }
    };

    const handeUpdateCartItem = async (key) => {
        let quantity = item.quantity;
        if (key === "increase") ++quantity;
        else {
            quantity = quantity === 1 ? 1 : --quantity;
        }

        try {
            const res = await fetch(`http://localhost:3001/api/cart/update/${item.id}`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    product: product,
                    id: item.id,
                    quantity: quantity,
                }),
            });
            const data = await res.json();
            if (data.success === false) {
                console.log(data.message);
                return;
            }
            // console.log(data);
            dispatch(updateCartItem(data));
        } catch (error) {
            console.log(error.message);
        }
        // console.log(formData);
    };

    return (
        <li className="flex justify-between items-center border rounded-md p-3 bg-white gap-2">
            <div className="flex items-center gap-1 sm:gap-6 w-1/3">
                <Link to={`/product/${product._id}`} className="border rounded-md overflow-hidden">
                    <img
                        src={`${product.imageUrls[0]}`}
                        alt="Product"
                        className="w-[80px] h-[80px] sm:h-[140px] sm:w-[140px] object-cover"
                    />
                </Link>
                <div className="flex flex-col gap-2">
                    <Link
                        to={`/product/${product._id}`}
                        className="sm:text-base text-xs font-bold hover:text-orange-500"
                    >
                        {product.name}
                    </Link>
                    <p className="text-sm font-semibold">
                        ${(product.discountPrice > 0 ? product.discountPrice : product.price).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">
                        Size: {product.weight} {product.unit}
                    </p>
                </div>
            </div>
            <div className="flex sm:flex-row flex-col gap-3 justify-around sm:flex-1">
                <div className="sm:text-base text-xs flex border p-2 gap-3 items-center justify-center rounded-md">
                    <button className="text-slate-500 hover:text-orange-500">
                        <FaMinus onClick={() => handeUpdateCartItem("decrease")} />
                    </button>
                    <span>{item.quantity < 0 ? 1 : item.quantity}</span>
                    <button className="text-slate-500 hover:text-orange-500">
                        <FaPlus onClick={() => handeUpdateCartItem("increase")} />
                    </button>
                </div>
                <div className="flex items-center gap-6">
                    <p className="font-semibold sm:text-base text-sm">
                        $
                        {((product.discountPrice > 0 ? product.discountPrice : product.price) * item.quantity).toFixed(
                            2
                        )}
                    </p>
                    <button className="hover:text-orange-500 text-xl" onClick={handleDeleteCartItem}>
                        <GoTrash />
                    </button>
                </div>
            </div>
        </li>
    );
}
