import React, { useEffect, useState } from "react";
import { FaAngleRight } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "../redux/user/userSlice";
import { clearCart } from "../redux/cart/cartSlice";

export default function Account() {
    const { currentUser } = useSelector((state) => state.user);
    const [loading, setLoading] = useState(true);
    const [hiddenProfile, setHiddenProfile] = useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [profile, setProfile] = useState({
        firstname: "",
        lastname: "",
        address: "",
        phone: "",
        user: currentUser._id,
    });

    const handleChangeProfile = (e) => {
        setProfile((prev) => ({
            ...prev,
            [e.target.id]: e.target.value,
        }));
    };

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

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const idUser = currentUser._id;
            const res = await fetch(`http://localhost:3001/api/user/update/${idUser}`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(profile),
            });
            const data = await res.json();
            console.log(data);
            if (data.success === false) {
                console.log(data.message);
                return;
            }
            setProfile(data);
            alert("Update successfully!!!")
            // dispatch(actionStart());
            // dispatch(updateUserSuccess(data));
            // alert("Update successfully!!!");
            // setPercent(0);
        } catch (error) {
            // dispatch(actionFailure(error.message));
            // return;
            console.log(error.message);
            
        }
    };

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
            setProfile(data);
        } catch (error) {
            console.log(error.message);
        }
    };
    // console.log(profile);

    useEffect(() => {
        fetchProfile();
        setLoading(false);
    }, []);
    return (
        !loading && (
            <div className="max-w-md sm:max-w-7xl mx-auto pt-16">
                <div className="bg-white p-3 border rounded-md">
                    <p className="flex items-center text-sm">
                        <Link to={"/"}>Home</Link> <FaAngleRight />
                        Account
                    </p>
                </div>
                <h1 className="my-10 text-center text-4xl font-bold font-dancing">Account</h1>

                <div className="grid grid-cols-4">
                    <div>
                        <div className="mb-10">
                            <h1 className="font-semibold text-xl">Order history</h1>
                            <div className="text-sm bg-orange-500 text-white p-2 rounded-lg mt-2 inline-block">
                                <Link to={"/history"}>View order history</Link>
                            </div>
                        </div>

                        <div>
                            <h1 className="font-semibold text-xl">Account details</h1>
                            <p className="flex items-center gap-2">
                                <span className="text-sm opacity-70">{profile.firstname}</span>
                                <span className="text-sm opacity-70">{profile.lastname}</span>
                            </p>
                            <p className="text-sm opacity-70">{profile.address}</p>

                            <div className="flex items-center gap-2">
                                <button
                                    className="text-white bg-orange-500 p-2 rounded-lg text-sm"
                                    onClick={() => setHiddenProfile(!hiddenProfile)}
                                >
                                    {!hiddenProfile ? "Hidden profile" : "View profile"}
                                </button>
                                <button
                                    className="text-white bg-orange-500 p-2 rounded-lg text-sm"
                                    onClick={handleSignout}
                                >
                                    Log out
                                </button>
                            </div>
                        </div>
                    </div>

                    {!hiddenProfile && (
                        <form onSubmit={handleUpdateProfile} className="col-span-3 grid grid-cols-1 gap-6">
                            <div className="grid grid-cols-2 gap-6">
                                <input
                                    id="firstname"
                                    value={profile.firstname}
                                    type="text"
                                    placeholder="Firstname"
                                    className="border border-orange-500 rounded-md outline-none px-3"
                                    onChange={handleChangeProfile}
                                />
                                <input
                                    id="lastname"
                                    value={profile.lastname}
                                    type="text"
                                    placeholder="Lastname"
                                    className="border border-orange-500 rounded-md outline-none px-3"
                                    onChange={handleChangeProfile}
                                />
                            </div>
                            <input
                                id="phone"
                                type="text"
                                value={profile.phone}
                                placeholder="Phone"
                                className="border border-orange-500 rounded-md outline-none px-3"
                                onChange={handleChangeProfile}
                            />
                            <input
                                id="address"
                                value={profile.address}
                                type="text"
                                placeholder="Address"
                                className="border border-orange-500 rounded-md outline-none px-3"
                                onChange={handleChangeProfile}
                            />

                            <button type="submit" className="bg-orange-500 text-white rounded-md">
                                Update
                            </button>
                        </form>
                    )}
                </div>
            </div>
        )
    );
}
