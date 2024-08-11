import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import OAuth from "../components/OAuth";
import { FaAngleRight, FaEye, FaEyeSlash } from "react-icons/fa";
import { startAction, startToast, timeoOutToast } from "../redux/toast/toastSlice";
export default function Signup() {
    const [formData, setFormData] = useState({});
    const [showPassword, setShowPassword] = useState(false);
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
    async function handleSubmitSignup(e) {
        e.preventDefault();
        dispatch(startAction());
        try {
            const res = await fetch("http://localhost:3001/api/auth/signup", {
                method: "POST",
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
            dispatch(
                startToast({
                    typeToast: "notifi",
                    content: `Sign up successfully!!!`,
                })
            );

            if (timeOutId) clearTimeout(timeOutId);
            const idTimeout = setTimeout(() => {
                dispatch(timeoOutToast());
                navigate("/sign-in");
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
                        Create Account
                    </p>
                </div>
                <h1 className="font-bold text-3xl my-6 text-center">Create Account</h1>
                <div className="max-w-3xl mx-auto">
                    <form className="flex flex-col gap-4" onSubmit={handleSubmitSignup}>
                        <div>
                            <input
                                type="text"
                                placeholder="Username"
                                id="username"
                                className="border rounded-md p-3 outline-slate-500 w-full"
                                onChange={handleChange}
                            />
                        </div>

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

                        <button
                            disabled={loading}
                            className=" bg-orange-500 p-3 rounded-lg text-white cursor-pointer hover:opacity-95"
                        >
                            {loading ? "LOADING......" : "SIGN UP"}
                        </button>
                        <OAuth />
                    </form>
                    <h3 className="mt-3">
                        Have an account?
                        <span className="text-sm text-blue-400">
                            <Link to="/sign-in" className="text-base">
                                {" "}
                                Sign in
                            </Link>
                        </span>
                    </h3>
                </div>
            </div>
        </>
    );
}
