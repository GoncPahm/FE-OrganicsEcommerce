import React, { useEffect, useState } from "react";
import { FaAngleLeft, FaAngleRight, FaListUl } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { BsFillGrid3X3GapFill } from "react-icons/bs";
import Product from "../components/Product";
export default function Collections() {
    const { category } = useParams();
    const [pages, setPages] = useState(1);
    const [products, setProducts] = useState([]);
    const [horizontal, setHorizontal] = useState(false);
    const [query, setQuery] = useState({
        avaiability: "",
        priceHigh: 0,
        priceLow: 0,
        sortQuery: "best_selling",
        page: 1,
    });

    const handleChangeQueryStock = (e) => {
        if (e.target.checked) {
            setQuery((prev) => ({
                ...prev,
                avaiability: e.target.id,
            }));
        }
    };

    const handleChangeQueryPrice = (e) => {
        setQuery((prev) => ({
            ...prev,
            [e.target.id]: e.target.value,
        }));
    };

    const handleChangeQuerySort = (e) => {
        setQuery((prev) => ({
            ...prev,
            sortQuery: e.target.value,
        }));
    };

    const handleChangeQueryPage = (e) => {
        setQuery((prev) => ({
            ...prev,
            page: parseInt(e.target.id) + 1,
        }));
    };

    const handleResetAvaiability = () => {
        setQuery((prev) => ({
            ...prev,
            avaiability: "",
        }));
    };

    const handleResetPrice = () => {
        setQuery((prev) => ({
            ...prev,
            priceHigh: 0,
            priceLow: 0,
        }));
    };

    const fetchData = async () => {
        const url = new URL(`http://localhost:3001/api/product/category/${category}`);
        url.searchParams.append("sortQuery", query.sortQuery);
        url.searchParams.append("avaiability", query.avaiability);
        url.searchParams.append("priceLow", query.priceLow);
        url.searchParams.append("priceHigh", query.priceHigh);
        url.searchParams.append("page", query.page);
        // console.log(url.toString());

        try {
            const res = await fetch(url.toString(), {
                method: "GET",
            });
            const data = await res.json();
            setProducts(data.products);
            setPages(data.pages);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [category, query]);

    return (
        <div className="max-w-md sm:max-w-7xl mx-auto pt-16">
            <div className="bg-white p-3 border rounded-md">
                <p className="flex items-center text-sm">
                    <Link to={"/"}>Home</Link> <FaAngleRight />
                    Collections
                </p>
            </div>
            <h1 className="my-10 text-center text-3xl font-bold font-dancing">{category.toUpperCase()}</h1>
            <div className="grid grid-cols-4 gap-6">
                <div>
                    <div></div>
                    <div className="pb-10">
                        <h1 className="border-b pb-3 font-semibold">AVAIABLILITY</h1>
                        <div className="text-sm my-2 flex items-center justify-between">
                            Choose avaiability
                            <p className="text-orange-500 cursor-pointer" onClick={handleResetAvaiability}>
                                Reset
                            </p>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                            <div className="flex gap-3 items-center">
                                <input
                                    checked={query.avaiability === "in-stock"}
                                    id="in-stock"
                                    type="checkbox"
                                    className="w-4 h-4"
                                    onChange={handleChangeQueryStock}
                                />
                                <p className="text-sm">In stock</p>
                            </div>
                            <div className="flex gap-3 items-center">
                                <input
                                    checked={query.avaiability === "sold-out"}
                                    id="sold-out"
                                    type="checkbox"
                                    className="w-4 h-4"
                                    onChange={handleChangeQueryStock}
                                />
                                <p className="text-sm">Out of stock</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h1 className="border-b pb-3 font-semibold">PRICE</h1>
                        <div className="text-sm my-2 flex items-center justify-between">
                            The highest price is $2,250.0
                            <p className="text-orange-500 cursor-pointer" onClick={handleResetPrice}>
                                Reset
                            </p>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            <div className="flex gap-2 items-center">
                                <span>$</span>
                                <div className="border rounded-md overflow-hidden">
                                    <input
                                        id="priceLow"
                                        value={query.priceLow}
                                        type="number"
                                        className="p-3 outline-none text-sm"
                                        placeholder="From"
                                        onChange={handleChangeQueryPrice}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-2 items-center">
                                <span>$</span>
                                <div className="border rounded-md overflow-hidden">
                                    <input
                                        id="priceHigh"
                                        value={query.priceHigh}
                                        type="number"
                                        className="p-3 outline-none text-sm"
                                        placeholder="To"
                                        onChange={handleChangeQueryPrice}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-span-3">
                    <div className="bg-white p-3 border rounded-md">
                        <div className="flex items-center text-sm gap-2">
                            <button
                                className={`hover:text-orange-500 transition-all ${!horizontal && "text-orange-500"}`}
                                onClick={() => setHorizontal(false)}
                            >
                                <BsFillGrid3X3GapFill className="text-2xl" />
                            </button>
                            <button
                                className={`hover:text-orange-500 transition-all ${horizontal && "text-orange-500"}`}
                                onClick={() => setHorizontal(true)}
                            >
                                <FaListUl className="text-2xl" />
                            </button>
                            <div className="ml-auto flex gap-3 items-center">
                                <h1 className="text-base text-orange-500">{products.length} Products</h1>
                                <span>Sort by:</span>
                                <select
                                    className="outline-none border px-3 py-2 rounded-md"
                                    onChange={handleChangeQuerySort}
                                >
                                    <option value={"best_selling"}>Best selling</option>
                                    <option value={"alphaAtoZ"}>Aplabetically A-Z</option>
                                    <option value={"alphaZtoA"}>Aplabetically Z-A</option>
                                    <option value={"priceHightoLow"}>Price, high to low</option>
                                    <option value={"priceLowtoHigh"}>Price, low to high</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className={`grid ${horizontal ? "grid-cols-1" : "grid-cols-3"} gap-5 mt-10`}>
                        {products.length > 0 &&
                            products.map((product, index) => (
                                <Product key={index} product={product} horizontal={horizontal} />
                            ))}
                        {products.length === 0 && <h1 className="col-span-3 text-center text-2xl">Empty!!!</h1>}
                    </div>
                </div>
            </div>

            <ul className="flex justify-center items-center mt-10 gap-2">
                <li
                    className={`border p-3 rounded-md ${query.page === 1 && "hidden"}`}
                    onClick={() =>
                        setQuery((prev) => ({
                            ...prev,
                            page: query.page - 1,
                        }))
                    }
                >
                    <FaAngleLeft />
                </li>
                {Array.from({ length: pages }, (_, index) => (
                    <li
                        id={index}
                        key={index}
                        className={`border px-4 py-2 rounded-md cursor-pointer ${
                            query.page === index + 1 && "text-white bg-orange-500"
                        }`}
                        onClick={handleChangeQueryPage}
                    >
                        {index + 1}
                    </li>
                ))}
                <li
                    className={`border p-3 rounded-md ${query.page === pages && "hidden"}`}
                    onClick={() =>
                        setQuery((prev) => ({
                            ...prev,
                            page: query.page + 1,
                        }))
                    }
                >
                    <FaAngleRight />
                </li>
            </ul>
        </div>
    );
}
