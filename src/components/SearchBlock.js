import React, { forwardRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { Link } from "react-router-dom";

const SearchBlock = forwardRef((props, closeref) => {
    const [searchData, setSearchData] = useState([]);
    const [keySearch, setKeySearch] = useState("");
    const handleSearch = async () => {
        const res = await fetch(`http://localhost:3001/api/product/search`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                key: keySearch,
            }),
        });
        const data = await res.json();
        console.log(data);
        setSearchData(data);
    };

    return (
        <div className="w-full mx-auto z-30 absolute top-[100%] left-1/2 -translate-x-1/2">
            <div className="border border-orange-500 rounded-md overflow-hidden flex items-center px-3 bg-white">
                <input
                    value={keySearch}
                    type="text"
                    className="w-full p-3 outline-none"
                    onChange={(e) => setKeySearch(e.target.value)}
                />
                <div className="flex items-center gap-3">
                    <FaSearch className="hover:text-orange-500" onClick={handleSearch} />
                    <IoClose
                        ref={closeref}
                        className="text-2xl cursor-pointer hover:text-orange-500"
                        onClick={props.handleCloseSearch}
                    />
                </div>
            </div>

            <div className="border border-orange-500 rounded-md overflow-hidden p-3 bg-white">
                <h1 className="font-bold mb-3">Products</h1>
                <div className="flex flex-col gap-3">
                    {searchData.length > 0 &&
                        searchData.map((product, index) => (
                            <Link key={index} to={`/product/${product._id}`} className="flex items-center gap-3">
                                <div className="w-20 h-20 border border-orange-500 rounded-md overflow-hidden">
                                    <img
                                        src={product.imageUrls[0]}
                                        className="w-full h-full object-cover"
                                        alt={product.name}
                                    />
                                </div>

                                <div>
                                    <h1 className="font-semibold">{product.name}</h1>
                                    <h1 className="text-sm font-bold">
                                        ${(product.discoutPrice > 0 ? product.discoutPrice : product.price).toFixed(2)}
                                        {product.discoutPrice > 0 && (
                                            <span className="text-gray-400 ms-1 line-through">
                                                ${product.price.toFixed(2)}
                                            </span>
                                        )}
                                    </h1>
                                </div>
                            </Link>
                        ))}
                </div>
            </div>
        </div>
    );
});

export default SearchBlock;
