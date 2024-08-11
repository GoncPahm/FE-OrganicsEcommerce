import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaAngleRight, FaEye, FaEyeSlash } from "react-icons/fa";
import { signInSuccess } from "../redux/user/userSlice";
import { loadCartItems } from "../redux/cart/cartSlice";
import OAuth from "../components/OAuth";
import { startAction, startToast, timeoOutToast } from "../redux/toast/toastSlice";
export default function Signin() {
    const [formData, setFormData] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [timeOutId, setTimeoutID] = useState(null);
    const { loading } = useSelector((state) => state.toast);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            if (timeOutId) clearTimeout(timeOutId);
        };
    }, [timeOutId]);

    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    }
    async function handleSubmitSignin(e) {
        e.preventDefault();
        dispatch(startAction());
        try {
            const res = await fetch("http://localhost:3001/api/auth/signin", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
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
            console.log(data);
            dispatch(
                startToast({
                    typeToast: "notifi",
                    content: `Welcome ${data.user.username}`,
                })
            );
            dispatch(signInSuccess(data.user));
            dispatch(loadCartItems({ cartItems: data.cartItems, totalPrice: data.totalPrice }));

            if (timeOutId) clearTimeout(timeOutId);
            const idTimeout = setTimeout(() => {
                dispatch(timeoOutToast());
                navigate("/");
            }, 2000);
            setTimeoutID(idTimeout);
        } catch (error) {
            dispatch(
                startToast({
                    typeToast: "error",
                    content: `${error.message}`,
                })
            );
            return;
        }
    }

    return (
        <>
            <div className="max-w-md sm:max-w-7xl mx-auto pt-16">
                <div className="bg-white p-3 border rounded-md">
                    <p className="flex items-center text-sm">
                        <Link to={"/"}>Home</Link> <FaAngleRight />
                        Account
                    </p>
                </div>
                <h1 className="my-6 text-3xl font-bold text-center">Already Registered?</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                    <div className="border border-slate-400 rounded-md p-4">
                        <h3 className="text-lg">New Customer</h3>
                        <p className="text-sm text-gray-600 my-5">
                            By creating an account you will be able to shop faster, be up to date on an order's status,
                            and keep track of the orders you have previously made.
                        </p>
                        <Link to={"/sign-up"} className="bg-orange-500 text-white text-sm p-2 rounded-md">
                            Create Account
                        </Link>
                    </div>
                    {!isForgotPassword ? (
                        <div className="border border-slate-400 rounded-md p-4">
                            <h1 className="font-semibold text-2xl sm:text-2xl text-slate-950 mb-3 text-start">
                                Log in
                            </h1>
                            <p className="text-sm text-gray-400 my-3">If you have an account, please log in</p>
                            <form className="flex flex-col gap-4" onSubmit={handleSubmitSignin}>
                                <div>
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        id="email"
                                        className="border rounded-md p-3 outline-slate-500 w-full"
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                        id="password"
                                        className="border rounded-md p-3 outline-slate-500 w-full"
                                        onChange={handleChange}
                                    />
                                    {showPassword ? (
                                        <FaEyeSlash
                                            className="absolute top-1/2 transform -translate-y-1/2 right-4 cursor-pointer"
                                            onClick={() => setShowPassword(!showPassword)}
                                        />
                                    ) : (
                                        <FaEye
                                            className="absolute top-1/2 transform -translate-y-1/2 right-4 cursor-pointer"
                                            onClick={() => setShowPassword(!showPassword)}
                                        />
                                    )}
                                </div>

                                <p
                                    className="text-sm text-end cursor-pointer hover:text-orange-500"
                                    onClick={() => setIsForgotPassword(true)}
                                >
                                    Forgot your password?
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <button
                                        disabled={loading}
                                        className=" bg-orange-500 p-3 rounded-lg text-white cursor-pointer hover:opacity-95"
                                    >
                                        {loading ? "LOADING......" : "SIGN IN"}
                                    </button>
                                    <OAuth />
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="border border-slate-400 rounded-md p-4">
                            <h1 className="font-semibold text-2xl sm:text-2xl text-slate-950 mb-3 text-start">
                                Reset your password
                            </h1>
                            <p className="text-sm text-gray-400 my-3">
                                We will send you an email to reset your password
                            </p>
                            <p className="my-3 text-red-700"></p>
                            <form className="flex flex-col gap-4" onSubmit={handleSubmitSignin}>
                                <div>
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        id="email"
                                        className="border rounded-md p-3 outline-slate-500 w-full"
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className=" bg-orange-500 p-3 rounded-lg text-white cursor-pointer hover:opacity-95"
                                    >
                                        {loading ? "LOADING......" : "SUBMIT"}
                                    </button>

                                    <button
                                        type="button"
                                        className=" bg-slate-600 p-3 rounded-lg text-white cursor-pointer hover:opacity-95"
                                        onClick={() => setIsForgotPassword(false)}
                                    >
                                        CANCEL
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
