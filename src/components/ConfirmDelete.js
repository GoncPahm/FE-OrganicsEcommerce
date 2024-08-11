import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
export default function ConfirmDelete({ onHidden, listingID }) {
    const { currentUser, loading, error } = useSelector((state) => state.user);
    const [errorDelete, setErrorDelete] = useState('');
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();
    const handleChange = (e) => {
        setConfirmPassword(e.target.value);
    };
    const handleDeleteListing = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`http://localhost:3001/api/listings/delete/${listingID}`, {
                method: "DELETE",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ password: confirmPassword }),
            });
            const data = await res.json();
            if (data.success === true) {
                alert("Deleted");
                setErrorDelete('');
                setTimeout(() => {
                    navigate(`/listings/${currentUser._id}`);
                }, 1000);
            }
            else {
                setErrorDelete(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className="fixed top-0 right-0 left-0 bottom-0 bg-black z-50 bg-opacity-60">
            <div className="w-[420px]  p-5 flex flex-col gap-3 bg-white items-center justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md">
                <h1 className="font-bold text-xl">CONFIRM DELETE LISTING</h1>
                <p className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                    Are you sure you want to delete this item? This action cannot be undone, and you will lose all
                    associated data permanently.
                </p>
                <form onSubmit={handleDeleteListing} className="w-full">
                    <div className="w-full">
                        <input
                            autoFocus
                            type="password"
                            id="password"
                            value={confirmPassword}
                            onChange={handleChange}
                            className="border border-slate-600 w-full p-2 rounded-md"
                            placeholder="Please enter your password to confirm!!!"
                        />
                    </div>
                    <p className="text-red-500 text-center h-6">
                        {errorDelete}
                    </p>
                    <div className="flex gap-2">
                        <button type="submit" className="bg-red-700 w-full py-2 rounded-md text-white">
                            DELETE LISTING
                        </button>
                        <button
                            onClick={onHidden}
                            type="button"
                            className="bg-blue-600 w-full py-2 rounded-md text-white"
                        >
                            CANCEL
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
