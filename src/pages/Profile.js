import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from "../firebase.js";
import Error from "../components/Error";
import { updateUserSuccess, actionFailure, actionStart, signOut } from "../redux/user/userSlice.js";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

export default function Profile() {
    const { currentUser, loading, error } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const fileRef = useRef();
    const progessRef = useRef();
    const avatarRef = useRef();
    const [file, setFile] = useState(undefined);
    const [percent, setPercent] = useState(0);
    const [fileError, setFileUploadError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: currentUser.email,
        username: currentUser.username,
        avatar: currentUser.avatar,
    });
    const handleClickAvatar = (e) => {
        fileRef.current.click();
    };

    const handleUploadFile = (file) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progess = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setPercent(progess);
            },
            (error) => {
                setFileUploadError(true);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((dowloadURL) => {
                    avatarRef.current.src = dowloadURL;
                    setFormData({ ...formData, avatar: dowloadURL });
                });
            }
        );
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleUpdateUserInfo = async (e) => {
        e.preventDefault();
        try {
            const idUser = currentUser._id;
            const res = await fetch(`http://localhost:3001/api/user/update/${idUser}`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            console.log(data);
            dispatch(actionStart());
            if (data.success === false) {
                dispatch(actionFailure(data.message));
                return;
            }
            dispatch(updateUserSuccess(data));
            alert("Update successfully!!!");
            setPercent(0);
        } catch (error) {
            dispatch(actionFailure(error.message));
            return;
        }
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
                navigate("/sign-in");
            }, 1000);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (file) {
            handleUploadFile(file);
        }
    }, [file]);

    return (
        <>
            {error && <Error errors={error} />}
            <div className="max-w-lg mx-auto pt-10">
                <h1 className="font-semibold text-2xl sm:text-3xl text-slate-950 mb-3 text-center">Profile</h1>
                <form className="flex flex-col gap-4">
                    <input
                        type="file"
                        hidden
                        accept="image/*"
                        ref={fileRef}
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                    <img
                        src={currentUser.avatar}
                        ref={avatarRef}
                        alt="Profile"
                        onClick={handleClickAvatar}
                        className="w-24 h-24 object-cover rounded-full self-center mt-2 cursor-pointer"
                    />
                    <p ref={progessRef} className="text-center text-red-500 h-2 mb-2">
                        {percent > 0 && percent < 100 && `Uploaded: ${percent}%`}
                        {fileError && `Error while uploading image`}
                        {percent === 100 && `Image is uploaded successfully!!!`}
                    </p>
                    <div>
                        <input
                            type="text"
                            placeholder="Username"
                            id="username"
                            required
                            defaultValue={currentUser.username}
                            className="border rounded-md p-3 outline-slate-500 w-full"
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            id="email"
                            readOnly
                            required
                            defaultValue={currentUser.email}
                            className="border rounded-md p-3 outline-slate-500 w-full"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            required
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
                        className=" bg-slate-600 p-3 rounded-lg text-white cursor-pointer hover:opacity-95"
                        onClick={handleUpdateUserInfo}
                    >
                        {loading ? "UPDATING......" : "UPDATE"}
                    </button>
                    <Link
                        to={"/create-listing"}
                        className=" bg-orange-800 p-3 rounded-lg text-white text-center cursor-pointer hover:opacity-95"
                    >
                        CREATE LISTING
                    </Link>
                </form>
                <div className="flex mt-2 justify-between">
                    <p className="text-red-600 cursor-pointer" onClick={handleSignout}>
                        Sign out
                    </p>
                    <p className="text-red-600 cursor-pointer">
                        <Link to={`/user-listings/${currentUser._id}`}>Your listings</Link>
                    </p>
                </div>
            </div>
        </>
    );
}
