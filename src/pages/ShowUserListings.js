import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AiFillEnvironment, AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
export default function ShowUserListings() {
    const [listings, setAllListings] = useState([]);
    
    const { currentUser } = useSelector((state) => state.user);
    const fetchData = async () => {
        try {
            const res = await fetch(`http://localhost:3001/api/user/listings/${currentUser._id}`, {
                method: "GET",
                credentials: "include",
            });
            const data = await res.json();
            setAllListings(data);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="pt-[60px] px-3">
            {!listings ||
                (listings.length === 0 && (
                    <>
                        <h1 className="text-center font-bold text-3xl">Your listings is empty</h1>
                        <p className="text-center text-xl mt-3">
                            Create new listing in{" "}
                            <Link className="text-blue-400" to={"/create-listing"}>
                                here
                            </Link>
                            !!!
                        </p>
                    </>
                ))}

            {listings && listings.length > 0 && (
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-center">
                        <h1 className="text-center font-bold text-2xl">Your listings</h1>
                        <div className="flex gap-2">
                            <div className="relative">
                                <input
                                    placeholder="Search....."
                                    className="w-60 p-3 rounded-md border border-slate-400 outline-none"
                                />
                                <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer" />
                            </div>

                            <select className="w-40 p-3 rounded-md border border-slate-400 outline-none">
                                <option>First</option>
                                <option>First</option>
                            </select>
                        </div>
                    </div>
                    <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4 justify-center mt-6">
                        {listings.map((listing, index) => (
                            <li
                                key={index}
                                className="rounded-md bg-white shadow-sm overflow-hidden hover:shadow-md transition-all cursor-pointer"
                            >
                                <Link to={`/details-listing/${listing._id}`}>
                                   
                                    <div className="flex flex-col p-3 gap-2">
                                        <h3 className="text-slate-700 font-semibold text-xl">{listing.name}</h3>
                                        <p className="flex items-center">
                                            <AiFillEnvironment className="text-red-500 mr-1 " />
                                            <span className="text-sm truncate text-gray-700">{listing.address}</span>
                                        </p>
                                        <p className="truncate text-sm">{listing.description}</p>
                                        <p className="text-slate-500 font-bold">${listing.regularPrice}</p>
                                        <p>
                                            <span className="text-slate-700 font-bold text-xs mr-2">
                                                {listing.bedrooms} Beds
                                            </span>
                                            <span className="text-slate-700 font-bold text-xs">
                                                {listing.bathrooms} Baths
                                            </span>
                                        </p>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <ul className="flex justify-center gap-2 mt-10">
                        <li className="py-2 px-4 rounded-md bg-white border border-slate-700 flex items-center cursor-pointer hover:shadow-md">
                            <AiFillCaretLeft className="text-center my-auto" />
                        </li>
                        <li className="py-2 px-4 rounded-md bg-white border border-slate-700 cursor-pointer hover:shadow-md">
                            1
                        </li>

                        <li className="py-2 px-4 rounded-md bg-white border border-slate-700 flex items-center cursor-pointer hover:shadow-md">
                            <AiFillCaretRight className="text-center my-auto " />
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
}
