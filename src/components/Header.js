import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signOut } from "../redux/user/userSlice";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { RiUserFill } from "react-icons/ri";
import { CiUser, CiSearch } from "react-icons/ci";
import { IoLogOut } from "react-icons/io5";
import { FaLock } from "react-icons/fa";
import { clearCart } from "../redux/cart/cartSlice";
import ItemCartHeader from "./ItemCartHeader";
import SearchBlock from "./SearchBlock";
export default function Header() {
    const { currentUser } = useSelector((state) => state.user);
    const { items, totalPrice } = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [hiddenDropdownUser, setHiddenDropdownUser] = useState(true);
    const [hiddenDropdownCart, setHiddenDropdownCart] = useState(true);
    const [hiddenSearchBlock, setHiddenSearchBlock] = useState(true);
    const searchRef = useRef();
    const cartRef = useRef();
    const userRef = useRef();
    const dropDownCartRef = useRef();
    const dropDownUserRef = useRef();
    const searchClose = useRef();
    const location = useLocation();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                cartRef.current &&
                !cartRef.current.contains(event.target) &&
                dropDownCartRef.current &&
                !dropDownCartRef.current.contains(event.target)
            ) {
                setHiddenDropdownCart(true);
            }

            if (
                dropDownUserRef.current &&
                !dropDownUserRef.current.contains(event.target) &&
                userRef.current &&
                !userRef.current.contains(event.target)
            ) {
                setHiddenDropdownUser(true);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        setHiddenDropdownCart(true);
        setHiddenDropdownUser(true);
        setHiddenSearchBlock(true);
    }, [location]);

    const handleSignout = async () => {
        try {
            const res = await fetch("http://localhost:3001/api/auth/signout");
            const data = await res.json();
            if (data.success === false) {
                return;
            }
            setTimeout(() => {
                dispatch(signOut());
                dispatch(clearCart());
                navigate("/sign-in");
            }, 1000);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="flex items-center justify-around max-w-2xl md:max-w-7xl mx-auto sm:justify-between p-6">
                <h1 className="font-bold text-2xl sm:text-4xl flex flex-wrap">
                    <Link to="/">
                        <span className="text-slate-500 font-caveat">GonC</span>
                        <span className="text-slate-700 font-caveat">Organics</span>
                    </Link>
                </h1>

                <ul className="flex gap-8 items-center justify-center font-semibold text-xl">
                    <li className="hidden sm:inline text-slate-700 px-3 py-1 rounded-full cursor-pointer hover:bg-orange-500 hover:text-white transition-all duration-300">
                        <Link to="/collections/vegetable">Vegetables</Link>
                    </li>
                    <li className="hidden sm:inline text-slate-700 px-3 py-1 rounded-full cursor-pointer hover:bg-orange-500 hover:text-white transition-all duration-300">
                        <Link to="/collections/fruit">Fruits</Link>
                    </li>
                    <li className="hidden sm:inline text-slate-700 px-3 py-1 rounded-full cursor-pointer hover:bg-orange-500 hover:text-white transition-all duration-300">
                        <Link to="/collections/juice">Juices</Link>
                    </li>
                    <li className="hidden sm:inline text-slate-700 px-3 py-1 rounded-full cursor-pointer hover:bg-orange-500 hover:text-white transition-all duration-300">
                        <Link to="/collections/other">Other</Link>
                    </li>
                </ul>

                {!hiddenSearchBlock && (
                    <SearchBlock closeref={searchClose} handleCloseSearch={() => setHiddenSearchBlock(true)} />
                )}

                <div className="flex gap-3 items-center">
                    <div ref={searchRef}>
                        <CiSearch
                            className="text-3xl hover:text-green-500 cursor-pointer"
                            onClick={() => setHiddenSearchBlock(!hiddenSearchBlock)}
                        />
                    </div>

                    <div className="relative">
                        <div ref={userRef}>
                            <CiUser
                                className="text-3xl hover:text-green-500 cursor-pointer"
                                onClick={() => {
                                    setHiddenDropdownUser(!hiddenDropdownUser);
                                }}
                            />
                        </div>

                        {currentUser ? (
                            <ul
                                ref={dropDownUserRef}
                                className={`absolute bg-white shadow-lg p-3 right-0 top-[110%] rounded-md border border-slate-200 ${
                                    hiddenDropdownUser && "hidden"
                                }`}
                            >
                                <li className="min-w-[160px] py-1 hover:text-green-500">
                                    <Link to={"/account"} className="flex items-center justify-start gap-1">
                                        <RiUserFill />
                                        <span>My Account</span>
                                    </Link>
                                </li>
                                <li
                                    className="min-w-[160px] flex items-center justify-start gap-1 py-1 hover:text-green-500 cursor-pointer"
                                    onClick={handleSignout}
                                >
                                    <IoLogOut />
                                    <span>Log out</span>
                                </li>
                            </ul>
                        ) : (
                            <ul
                                ref={dropDownUserRef}
                                className={`absolute bg-white shadow-lg p-3 right-0 top-[110%] rounded-md border border-slate-200 ${
                                    hiddenDropdownUser && "hidden"
                                }`}
                            >
                                <li className="min-w-[160px] py-1 hover:text-green-500">
                                    <Link to={"/sign-in"} className="flex items-center justify-start gap-1">
                                        <FaLock />
                                        <span>Log in</span>
                                    </Link>
                                </li>
                                <li className="min-w-[160px] flex items-center justify-start gap-1 py-1 hover:text-green-500 cursor-pointer">
                                    <Link to={"/sign-up"} className="flex items-center justify-start gap-1">
                                        <RiUserFill />
                                        <span>Create account</span>
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </div>
                    <div
                        ref={cartRef}
                        className="flex gap-1 items-center bg-green-500 text-white px-4 py-1 rounded-lg relative cursor-pointer select-none"
                        onClick={(e) => {
                            setHiddenDropdownCart(!hiddenDropdownCart);
                        }}
                    >
                        <AiOutlineShoppingCart className="text-2xl cursor-pointer" title="Cart" />
                        <span className="text-sm">{items.length || 0}</span>
                        <div
                            ref={dropDownCartRef}
                            onClick={(e) => e.stopPropagation()}
                            className={`${
                                hiddenDropdownCart && "hidden"
                            } absolute min-w-[300px] sm:min-w-[400px] bg-white p-3 right-0 top-[110%] rounded-md border border-slate-200 shadow-lg`}
                        >
                            {currentUser ? (
                                <>
                                    {items.length > 0 &&
                                        items.map((item, index) => <ItemCartHeader key={index} item={item} />)}
                                    {items.length === 0 && (
                                        <p className="text-center text-black py-2">Your cart is empty!!</p>
                                    )}
                                    <div className="border-t">
                                        <p className="flex justify-between items-center text-black pt-2">
                                            Subtotal: <span>${totalPrice.toFixed(2) || "0.00"}</span>
                                        </p>
                                        {items.length > 0 && (
                                            <div className="grid grid-cols-2 gap-2 my-2">
                                                <button className="bg-green-600 p-2 rounded-md text-center">
                                                    <Link to={`/cart/${currentUser._id}`}>View cart</Link>
                                                </button>

                                                <button className="bg-green-600 p-2 rounded-md text-center">
                                                    <Link to={`/checkout/${currentUser._id}`}>Check out</Link>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <p className="text-black text-center">Please log in to view cart!!!</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
