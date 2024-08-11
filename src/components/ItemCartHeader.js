import React, { useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { GoTrash } from "react-icons/go";
import { useDispatch } from "react-redux";
import { deleteCartItem, updateCartItem } from "../redux/cart/cartSlice";
import { Link } from "react-router-dom";
import { startToast, timeoOutToast } from "../redux/toast/toastSlice";

export default function ItemCartHeader({ item }) {
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
        <div className="flex gap-2 pb-2">
            <div className="h-[80px] w-[80px] rounded-md border border-slate-300 overflow-hidden">
                <Link to={`/product/${product._id}`}>
                    <img src={`${product.imageUrls[0]}`} className="h-full w-full object-cover" alt="Cart item" />
                </Link>
            </div>
            <div className="flex-grow flex flex-col gap-1 text-black">
                <div className="text-black text-sm flex justify-between items-center">
                    <Link to={`/product/${product._id}`}>
                        <p className="hover:text-green-500 cursor-pointer">{product.name}</p>
                    </Link>
                    <button className="hover:text-orange-500" onClick={handleDeleteCartItem}>
                        <GoTrash />
                    </button>
                </div>
                <p className="text-xs">
                    Weight: {product.weight}
                    {product.unit}
                </p>
                <div className="flex justify-between items-center">
                    <div className="text-xs p-1 border border-slate-200 rounded-md flex items-center gap-2">
                        <button className="text-slate-500">
                            <FaMinus onClick={() => handeUpdateCartItem("decrease")} />
                        </button>
                        <span>{item.quantity < 0 ? 1 : item.quantity}</span>
                        <button>
                            <FaPlus onClick={() => handeUpdateCartItem("increase")} />
                        </button>
                    </div>

                    <p className="text-sm">
                        $
                        {((product.discountPrice > 0 ? product.discountPrice : product.price) * item.quantity).toFixed(
                            2
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
}
