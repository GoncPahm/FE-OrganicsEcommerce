import React, { useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";
import { TbShoppingBagPlus } from "react-icons/tb";
import { GoEye } from "react-icons/go";
import { useDispatch } from "react-redux";
import { addNewCartItem } from "../redux/cart/cartSlice";
import { Link } from "react-router-dom";
import { startAction, startToast, timeoOutToast } from "../redux/toast/toastSlice";
export default function Product({ product, horizontal }) {
    const dispatch = useDispatch();
    const [quantity, setQuantity] = useState(1);
    const [timeOutId, setTimeoutID] = useState(null);
    const [formData, setFormData] = useState({
        quantity: 1,
        price: product.discountPrice > 0 ? product.discountPrice : product.price,
    });
    const increaseQuantity = () => setQuantity(quantity + 1);
    const decreaseQuantity = () => setQuantity(Math.max(1, quantity - 1));

    useEffect(() => {
        return () => {
            if (timeOutId) clearTimeout(timeOutId);
        };
    }, [timeOutId]);
    
    const handleAddProductToCart = async (idProduct) => {
        try {
            dispatch(startAction());
            const res = await fetch("http://localhost:3001/api/cart/add_product", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    product: idProduct,
                }),
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
            dispatch(addNewCartItem(data));
            dispatch(
                startToast({
                    typeToast: "notifi",
                    content: "Item added!!",
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
    return (
        <React.Fragment>
            {horizontal ? (
                <div className="bg-white rounded-md overflow-hidden border relative flex items-center p-4">
                    <Link
                        to={`/product/${product._id}`}
                        className="absolute right-2 top-2 bg-white p-3 border rounded-full shadow-lg hover:bg-orange-400 hover:text-white"
                    >
                        <GoEye />
                    </Link>
                    <div className="relative">
                        {product.discountPrice > 0 && (
                            <div className="absolute bg-orange-500 left-0 top-4 text-sm text-white pl-2 pr-6 py-1 rounded-r-full ">
                                SALE
                            </div>
                        )}

                        <Link to={`/product/${product._id}`}>
                            <img
                                src={product.imageUrls[0]}
                                className="w-[270px] h-[270px] border rounded-md object-cover"
                                alt={product.name}
                            />
                        </Link>
                    </div>
                    <div className="flex flex-col gap-4 p-3">
                        <h5 className="text-gray-500 text-sm">{product.category.toUpperCase()}</h5>
                        <Link to={`/product/${product._id}`}>
                            <h2 className="font-semibold hover:text-orange-500">{product.name}</h2>
                        </Link>
                        <div className="flex justify-between items-center font-bold">
                            <p>
                                ${product.price.toFixed(2)}{" "}
                                <span className="text-sm text-gray-400 line-through">
                                    {product.discountPrice > 0 && `$${product.discountPrice.toFixed(2)}`}
                                </span>
                            </p>
                            <span className="px-3 py-1 rounded-md font-semibold text-sm bg-green-500 text-white flex items-center gap-1">
                                {product.rating} <FaStar className="text-yellow-200 text-xs" />
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <button className="border-slate-500 border-2 px-3 rounded-md">
                                {product.weight} {product.unit}
                            </button>
                        </div>
                        <div className="flex justify-between items-center gap-3">
                            <div className="p-3 border border-slate-200 rounded-md flex items-center gap-2">
                                <button className="text-slate-500">
                                    <FaMinus
                                        onClick={() => {
                                            decreaseQuantity();
                                            if (formData.quantity > 1) {
                                                setFormData((prevFormData) => ({
                                                    ...prevFormData,
                                                    quantity: prevFormData.quantity - 1,
                                                }));
                                            }
                                        }}
                                    />
                                </button>
                                <span>{quantity}</span>
                                <button>
                                    <FaPlus
                                        onClick={() => {
                                            increaseQuantity();
                                            setFormData((prevFormData) => ({
                                                ...prevFormData,
                                                quantity: prevFormData.quantity + 1,
                                            }));
                                        }}
                                    />
                                </button>
                            </div>

                            <button className="bg-orange-500 p-3 rounded-md text-white flex items-center gap-1">
                                <TbShoppingBagPlus className="text-2xl" />
                                <span className="text-sm" onClick={() => handleAddProductToCart(product._id)}>
                                    ADD TO CART
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-md overflow-hidden border border-slate-300 shadow-md relative select-none">
                    <Link
                        to={`/product/${product._id}`}
                        className="absolute right-2 top-2 bg-white p-3 border rounded-full shadow-lg hover:bg-orange-400 hover:text-white"
                    >
                        <GoEye />
                    </Link>
                    {product.discountPrice > 0 && (
                        <div className="absolute bg-orange-500 left-0 top-4 text-sm text-white pl-2 pr-6 py-1 rounded-r-full ">
                            SALE
                        </div>
                    )}

                    <Link to={`/product/${product._id}`}>
                        <img src={product.imageUrls[0]} className="w-full object-cover" alt={product.name} />
                    </Link>

                    <div className="flex flex-col gap-2 p-4">
                        <h5 className="text-gray-500 text-sm">{product.category.toUpperCase()}</h5>
                        <Link to={`/product/${product._id}`}>
                            <h2 className="font-semibold hover:text-orange-500">{product.name}</h2>
                        </Link>
                        <div className="flex justify-between items-center font-bold">
                            <p>
                                ${(product.discountPrice > 0 ? product.discountPrice : product.price).toFixed(2)}{" "}
                                <span className="text-sm text-gray-400 line-through">
                                    {product.discountPrice > 0 && `$${product.price.toFixed(2)}`}
                                </span>
                            </p>
                            <span className="px-3 py-1 rounded-md font-semibold text-sm bg-green-500 text-white flex items-center gap-1">
                                {product.rating} <FaStar className="text-yellow-200 text-xs" />
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <button className="border-slate-500 border-2 px-3 rounded-md">
                                {product.weight} {product.unit}
                            </button>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="py-2 px-3 border border-slate-200 rounded-md flex items-center gap-2">
                                <button className="text-slate-500">
                                    <FaMinus
                                        onClick={() => {
                                            decreaseQuantity();
                                            if (formData.quantity > 1) {
                                                setFormData((prevFormData) => ({
                                                    ...prevFormData,
                                                    quantity: prevFormData.quantity - 1,
                                                }));
                                            }
                                        }}
                                    />
                                </button>
                                <span>{quantity}</span>
                                <button>
                                    <FaPlus
                                        onClick={() => {
                                            increaseQuantity();
                                            setFormData((prevFormData) => ({
                                                ...prevFormData,
                                                quantity: prevFormData.quantity + 1,
                                            }));
                                        }}
                                    />
                                </button>
                            </div>

                            <button className="bg-orange-500 p-3 rounded-md text-white flex items-center gap-1">
                                <TbShoppingBagPlus className="text-2xl" />
                                <span className="text-sm" onClick={() => handleAddProductToCart(product._id)}>
                                    ADD TO CART
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </React.Fragment>
    );
}
