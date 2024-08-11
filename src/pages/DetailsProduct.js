import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { Swiper, SwiperSlide } from "swiper/react";
import { FaAngleDown, FaAngleRight, FaAngleUp, FaComment, FaMinus, FaPlus, FaUserCircle } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { BsBoxSeam } from "react-icons/bs";
import { GoDotFill } from "react-icons/go";
import { FaCheck } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { addNewCartItem } from "../redux/cart/cartSlice";
export default function DetailsProduct() {
    const socket = io("http://localhost:3001/");
    const { currentUser } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const { id_product } = useParams();
    const [product, setProduct] = useState({});
    const [loading, setLoading] = useState(true);
    const [hiddenPolicy, setHiddenPolicy] = useState(true);
    const [hiddenAbout, setHiddenAbout] = useState(true);
    const [currentImage, setCurrentImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [formData, setFormData] = useState({
        quantity: 1,
    });
    const [review, setReview] = useState("");
    const [listReviews, setListReviews] = useState([]);
    const increaseQuantity = () => setQuantity(quantity + 1);
    const decreaseQuantity = () => setQuantity(Math.max(1, quantity - 1));
    const handleAddProductToCart = async () => {
        try {
            const res = await fetch("http://localhost:3001/api/cart/add_product", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    quantity: quantity,
                    product: id_product,
                    price: product.discountPrice > 0 ? product.discountPrice : product.price,
                }),
            });

            const data = await res.json();
            if (data.success === false) {
                console.log(data.message);
                return;
            }
            // console.log(data);
            dispatch(addNewCartItem(data));
        } catch (error) {
            console.log(error);
        }
    };
    const fetchData = async () => {
        const res = await fetch(`http://localhost:3001/api/product/details/${id_product}`, {
            method: "GET",
        });
        const data = await res.json();
        if (data.success === false) {
            console.log(data.message);
            return;
        }
        setProduct(data);
        setListReviews(data.reviews.map((r) => r.comment));
        setLoading(false);
    };
    useEffect(() => {
        try {
            fetchData();
        } catch (error) {
            console.log(error);
        }

        socket.emit("join-room", { productId: id_product });

        socket.on("receive-review", (review) => {
            setListReviews(review);
        });

        return () => {
            socket.emit("leave-room", { productId: id_product });
            socket.off("receive-review");
        };
    }, [id_product]);

    const handlePostNewReview = async () => {
        const res = await fetch(`http://localhost:3001/api/product/post-comment/${id_product}`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user: currentUser._id,
                comment: review.trim(),
            }),
        });
        const data = await res.json();
        if (data.success === false) {
            console.log(data.message);
            return;
        }
        setReview("");
        socket.emit("post-review", {
            productId: id_product,
            reviews: data.reviews.map((r) => r.comment),
        });
    };

    return (
        product &&
        !loading && (
            <div className="max-w-md sm:max-w-7xl mx-auto pt-16">
                <div className="bg-white p-3 border rounded-md">
                    <p className="flex items-center text-sm">
                        <Link to={"/"}>Home</Link> <FaAngleRight />
                        {product.name}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-10">
                    <div>
                        <div className="h-[480px] lg:h-[520px] border rounded-lg overflow-hidden">
                            <img src={product.imageUrls[currentImage]} className="w-full h-full object-cover" />
                        </div>
                        <Swiper
                            slidesPerView={4}
                            spaceBetween={20}
                            breakpoints={{
                                640: {
                                    slidesPerView: 3,
                                    slidesPerGroup: 1,
                                    spaceBetween: 10,
                                },
                                768: {
                                    slidesPerView: 3,
                                    slidesPerGroup: 1,
                                    spaceBetween: 10,
                                },
                                1024: {
                                    slidesPerView: 4,
                                    slidesPerGroup: 1,
                                    spaceBetween: 20,
                                },
                            }}
                            className="mySwiper mt-6"
                        >
                            {product.imageUrls.map((image, index) => (
                                <SwiperSlide
                                    key={index}
                                    className="border rounded-md overflow-hidden cursor-pointer"
                                    onClick={() => setCurrentImage(index)}
                                >
                                    <img src={image} className="" alt="Slide" />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                    <div className="flex flex-col gap-4">
                        <h3 className="text-slate-400 font-semibold text-sm">Gonc Organics</h3>
                        <h1 className="text-3xl">{product.name}</h1>
                        <p className="text-2xl font-bold">
                            ${(product.discountPrice > 0 ? product.discountPrice : product.price).toFixed(2)}
                        </p>
                        <div className="flex items-center gap-1 text-orange-500">
                            <BsBoxSeam className="text-xl" />
                            <span>Shipping</span>
                        </div>
                        <div>
                            <p className="flex items-center gap-1 text-red-800">
                                <GoDotFill />
                                <span>In stock (60 units), ready to be shipped</span>
                            </p>
                            <div className="h-1 bg-gray-200 rounded-full">
                                <div className="h-1 bg-red-500 rounded-full w-[40%]"></div>
                            </div>
                        </div>
                        <div className="inline-flex items-center gap-3">
                            <h3 className="min-w-20">Size: </h3>
                            <button className="border-slate-500 border-2 p-2 rounded-md">
                                {product.weight} {product.unit}
                            </button>
                        </div>
                        <div className="inline-flex items-center gap-3">
                            <h3 className="min-w-20">Quantity: </h3>
                            <div className="py-3 px-3 border border-slate-200 rounded-md flex items-center gap-3">
                                <button className="text-slate-500 hover:text-orange-500">
                                    <FaMinus
                                        onClick={() => {
                                            decreaseQuantity();
                                            if (formData.quantity > 1) {
                                                setFormData((prevFormData) => ({
                                                    ...prevFormData,
                                                    quantity: prevFormData.quantity - 1,
                                                }));
                                            }
                                        }}
                                    />
                                </button>
                                <span>{quantity}</span>
                                <button className="hover:text-orange-500">
                                    <FaPlus
                                        onClick={() => {
                                            increaseQuantity();
                                            setFormData((prevFormData) => ({
                                                ...prevFormData,
                                                quantity: prevFormData.quantity + 1,
                                            }));
                                        }}
                                    />
                                </button>
                            </div>
                        </div>
                        <button className="bg-orange-500 p-3 rounded-md text-white" onClick={handleAddProductToCart}>
                            ADD TO CART
                        </button>

                        <div className="border-b border-t py-3">
                            <div
                                className="flex justify-between items-center"
                                onClick={() => setHiddenPolicy(!hiddenPolicy)}
                            >
                                <h3 className="flex items-center gap-2 cursor-pointer">
                                    <FaCheck />
                                    <span>Privacy Policy</span>
                                </h3>
                                {hiddenPolicy ? <FaAngleDown /> : <FaAngleUp />}
                            </div>
                            <p className={`${hiddenPolicy && "hidden"} transition-all mt-2 text-justify`}>
                                Aenean viverra ante felis, eget lobortis mauris mollis euismod. Fusce hendrerit dapibus
                                eros, quis consectetur neque vestibulum non. Vivamus condimentum urna at massa semper,
                                in bibendum ante sollicitudin. Pellentesque et rhoncus leo. Praesent eu vulputate ipsum.
                                In posuere tristique pulvinar. Fusce ultricies, est sit amet pellentesque suscipit,
                                nulla ligula semper dui, quis fringilla ante metus quis dui. Vivamus ut porta est, eget
                                finibus augue. Curabitur egestas sit amet nibh ac condimentum. Nam non justo lectus.
                                Vestibulum eleifend tempor odio eu luctus. Cras vel risus eleifend, molestie arcu non,
                                aliquam dolor. Cras ex erat, pretium eu faucibus pellentesque, ullamcorper sagittis
                                eros. Curabitur nec pellentesque ligula. Duis tincidunt ante nisl, non ultrices nisl
                                imperdiet vitae. Vestibulum maximus malesuada tortor et vulputate. Etiam malesuada quam
                                vestibulum, scelerisque odio nec, interdum turpis. Mauris hendrerit egestas libero, eget
                                pellentesque lacus sodales a. Vestibulum in consequat nibh, a hendrerit odio. Interdum
                                et malesuada fames ac ante ipsum primis in faucibus. Nulla at velit a nisl pellentesque
                                mollis condimentum a turpis. Morbi lacinia vitae magna eu bibendum. Phasellus euismod
                                dui vitae sem suscipit cursus. Duis vehicula ante massa. Cras eu ante non augue egestas
                                ultrices sed et nisi. Quisque elit mauris, sodales ac erat sodales, vehicula faucibus
                                elit. Duis vulputate congue est id congue. Curabitur nec justo non elit pretium
                                ullamcorper. Nulla sed dictum nulla.
                            </p>
                        </div>

                        <div className="border-b border-t py-3">
                            <div
                                className="flex justify-between items-center"
                                onClick={() => setHiddenAbout(!hiddenAbout)}
                            >
                                <h3 className="flex items-center gap-2 cursor-pointer">
                                    <FaCheck />
                                    <span>About us</span>
                                </h3>
                                {hiddenAbout ? <FaAngleDown /> : <FaAngleUp />}
                            </div>
                            <p className={`${hiddenAbout && "hidden"} transition-all mt-2 text-justify`}>
                                Aenean viverra ante felis, eget lobortis mauris mollis euismod. Fusce hendrerit dapibus
                                eros, quis consectetur neque vestibulum non. Vivamus condimentum urna at massa semper,
                                in bibendum ante sollicitudin. Pellentesque et rhoncus leo. Praesent eu vulputate ipsum.
                                In posuere tristique pulvinar. Fusce ultricies, est sit amet pellentesque suscipit,
                                nulla ligula semper dui, quis fringilla ante metus quis dui. Vivamus ut porta est, eget
                                finibus augue. Curabitur egestas sit amet nibh ac condimentum. Nam non justo lectus.
                                Vestibulum eleifend tempor odio eu luctus. Cras vel risus eleifend, molestie arcu non,
                                aliquam dolor. Cras ex erat, pretium eu faucibus pellentesque, ullamcorper sagittis
                                eros. Curabitur nec pellentesque ligula. Duis tincidunt ante nisl, non ultrices nisl
                                imperdiet vitae. Vestibulum maximus malesuada tortor et vulputate. Etiam malesuada quam
                                vestibulum, scelerisque odio nec, interdum turpis. Mauris hendrerit egestas libero, eget
                                pellentesque lacus sodales a. Vestibulum in consequat nibh, a hendrerit odio. Interdum
                                et malesuada fames ac ante ipsum primis in faucibus. Nulla at velit a nisl pellentesque
                                mollis condimentum a turpis. Morbi lacinia vitae magna eu bibendum. Phasellus euismod
                                dui vitae sem suscipit cursus. Duis vehicula ante massa. Cras eu ante non augue egestas
                                ultrices sed et nisi. Quisque elit mauris, sodales ac erat sodales, vehicula faucibus
                                elit. Duis vulputate congue est id congue. Curabitur nec justo non elit pretium
                                ullamcorper. Nulla sed dictum nulla.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="mt-10">
                    <h1 className="text-center text-4xl text-orange-500 font-semibold font-dancing p-2">Description</h1>
                    <p className="py-3 border-t">{product.description}</p>
                </div>
                <div className="mt-10">
                    <h1 className="text-center text-4xl text-orange-500 font-semibold font-dancing p-2">Reviews</h1>
                    <ul className="border p-6 rounded-lg flex flex-col gap-3">
                        {listReviews.length === 0 && <h1 className="text-center">Please review product</h1>}
                        {listReviews.length > 0 &&
                            listReviews.map((item, index) => (
                                <li key={index} className="bg-gray-100 p-3 rounded-md">
                                    <div className="flex items-center gap-2">
                                        <div className="bg-gray-100 border border-orange-500 inline-block rounded-full">
                                            <FaUserCircle className="text-3xl text-slate-300" />
                                        </div>
                                        <h3 className="text-sm text-orange-500">Customer</h3>
                                    </div>
                                    <div className="pl-3 mt-2 flex items-center gap-2">
                                        <FaComment className="text-orange-500" /> {" : "}
                                        <p className="text-sm italic">{item}</p>
                                    </div>
                                </li>
                            ))}
                    </ul>
                    <div className="mt-3">
                        <h3 className="text-xl font-semibold">Write a review</h3>
                        <h3 className="text-sm flex items-center gap-1 my-3">
                            <span className="text-orange-500">*</span>
                            Your review
                        </h3>
                        <textarea
                            className="w-full h-[100px] outline-none border border-orange-500 p-3 rounded-lg"
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                        ></textarea>
                        <button
                            className="bg-orange-500 text-white py-2 px-10 rounded-lg"
                            onClick={handlePostNewReview}
                        >
                            Post
                        </button>
                    </div>
                </div>
            </div>
        )
    );
}
