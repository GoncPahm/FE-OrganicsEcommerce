import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import { loadCartItems } from "../redux/cart/cartSlice";
import { startToast, timeoOutToast } from "../redux/toast/toastSlice";
import { useEffect, useState } from "react";
export default function OAuth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [timeOutId, setTimeoutID] = useState(null);

    useEffect(() => {
        return () => {
            if (timeOutId) clearTimeout(timeOutId);
        };
    }, [timeOutId]);
    const handleSignupWithGoogle = async (e) => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);
            const result = await signInWithPopup(auth, provider);
            const res = await fetch("http://localhost:3001/api/auth/google", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    photo: result.user.photoURL,
                }),
            });
            const data = await res.json();
            console.log(data);
            dispatch(signInSuccess(data.user));
            dispatch(loadCartItems({ cartItems: data.cartItems, totalPrice: data.totalPrice }));
            dispatch(
                startToast({
                    typeToast: "notifi",
                    content: `Welcome ${data.user.username}`,
                })
            );
            navigate("/");
            if (timeOutId) clearTimeout(timeOutId);
            const idTimeout = setTimeout(() => {
                dispatch(timeoOutToast());
            }, 2000);
            setTimeoutID(idTimeout);
        } catch (error) {
            console.log("Don't signup with google", error);
        }
    };
    return (
        <button
            onClick={handleSignupWithGoogle}
            type="button"
            className=" bg-blue-500 p-3 rounded-lg text-white cursor-pointer hover:opacity-95"
        >
            CONTINUE WITH GOOGLE
        </button>
    );
}
