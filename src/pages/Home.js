import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { MdOutlineLocalShipping, MdOutlineSupportAgent } from "react-icons/md";
import { TbCoin } from "react-icons/tb";
import { IoGiftOutline } from "react-icons/io5";
// import required modules
import { Autoplay, Keyboard } from "swiper/modules";
import { useSelector } from "react-redux";
import Product from "../components/Product";
export default function Home() {
    const { currentUser } = useSelector((state) => state.user);
    const [fillter, setFillter] = useState("feature");
    const [fillterProducts, setFillterProducts] = useState([]);
    const [vegetables, setVegetables] = useState([]);

    const fetchData = async () => {
        const res = await fetch(`http://localhost:3001/api/product/fillter?type=${fillter}`, {
            method: "GET",
        });
        const data = await res.json();
        setFillterProducts(data);
    };

    const fetchVegetables = fetch(`http://localhost:3001/api/product/fillter?category=vegetable`, {
        method: "GET",
    }).then((res) => res.json());
    const fetchArrayData = () => {
        Promise.all([fetchVegetables])
            .then(([vegetablesData]) => {
                setVegetables(vegetablesData);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        try {
            fetchData();
        } catch (error) {
            console.log(error);
        }
    }, [fillter]);

    useEffect(() => {
        try {
            fetchArrayData();
        } catch (error) {
            console.log(error);
        }
    }, []);

    return (
        <div>
            <Swiper
                centeredSlides={true}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                }}
                modules={[Autoplay]}
                className="mySwiper"
            >
                <SwiperSlide>
                    <img src="./slide1.jpg" className="md:h-screen h-[200px] w-full" alt="Slide" />
                </SwiperSlide>
                <SwiperSlide>
                    <img src="./slide2.jpg" className="md:h-screen h-[200px] w-full" alt="Slide" />
                </SwiperSlide>
                <SwiperSlide>
                    <img src="./slide4.webp" className="md:h-screen h-[200px] w-full" alt="Slide" />
                </SwiperSlide>
            </Swiper>

            <div className="md:max-w-7xl max-w-3xl mx-auto grid grid-cols-1 gap-12">
                {/* banner */}
                <h1 className="font-dancing text-center text-5xl text-green-800 mt-10">Top Deals</h1>
                <div className="hidden sm:grid grid-cols-3 grid-rows-2  gap-6">
                    <div className="rounded-2xl overflow-hidden row-span-2 relative hover-overlay">
                        <img src="./deal1.webp" className="w-full object-cover" alt="Banner" />
                        <div className="absolute top-16 text-center w-full">
                            <h4 className="text-2xl">We Supply 100% Fresh</h4>
                            <h1 className="text-4xl font-bold my-3">Fresh Healthy Foods</h1>
                            <button className="bg-green-500 text-white p-3 rounded-md text-xl hover:shadow-lg">
                                Shop now
                            </button>
                        </div>
                    </div>
                    <div className="rounded-2xl overflow-hidden relative hover-overlay">
                        <img src="./deal2.webp" className="w-full object-cover" alt="Banner" />
                        <div className="absolute top-10 text-end w-full pe-3">
                            <h4 className="text-2xl">-30% OFF</h4>
                            <h1 className="text-3xl font-bold my-3">
                                Fresh <br /> Vegetables
                            </h1>
                            <button className="bg-green-500 text-white p-3 rounded-md text-xl hover:shadow-lg">
                                Shop now
                            </button>
                        </div>
                    </div>
                    <div className="rounded-2xl overflow-hidden relative hover-overlay">
                        <img src="./deal3.webp" className="w-full object-cover" alt="Banner" />
                        <div className="absolute top-10 text-end w-full pe-3">
                            <h4 className="text-2xl">-35% OFF</h4>
                            <h1 className="text-3xl font-bold my-3">
                                100% <br />
                                Organic Food
                            </h1>
                            <button className="bg-green-500 text-white p-3 rounded-md text-xl hover:shadow-lg">
                                Shop now
                            </button>
                        </div>
                    </div>
                    <div className="rounded-2xl overflow-hidden col-span-2 relative hover-overlay">
                        <img src="./deal4.webp" className="w-full object-cover" alt="Banner" />
                        <div className="absolute top-10 text-start w-full ps-5">
                            <h4 className="text-2xl">Daily Essentials</h4>
                            <h1 className="text-3xl font-bold my-3">
                                Sale 50%
                                <br /> Of All Fruit Products
                            </h1>
                            <button className="bg-green-500 text-white p-3 rounded-md text-xl hover:shadow-lg">
                                Shop now
                            </button>
                        </div>
                    </div>
                </div>

                {/* Trending Product */}

                <div>
                    <h1 className="font-dancing text-center text-5xl text-green-800">Trending Products</h1>

                    {/* Fillter */}
                    <div className="flex gap-6 justify-center mt-6">
                        <button
                            className={`${
                                fillter === "feature" ? "bg-orange-400 text-white" : "bg-white border border-orange-500"
                            } px-4 py-2 min-w-[120px] rounded-lg shadow-sm`}
                            onClick={() => setFillter("feature")}
                        >
                            Feature
                        </button>

                        <button
                            className={`${
                                fillter === "lastest" ? "bg-orange-400 text-white" : "bg-white border border-orange-500"
                            } px-4 py-2 min-w-[120px] rounded-lg shadow-sm`}
                            onClick={() => setFillter("lastest")}
                        >
                            Lastest
                        </button>

                        <button
                            className={`${
                                fillter === "bestseller"
                                    ? "bg-orange-400 text-white"
                                    : "bg-white border border-orange-500"
                            } px-4 py-2 min-w-[120px] rounded-lg shadow-sm`}
                            onClick={() => setFillter("bestseller")}
                        >
                            Best seller
                        </button>
                    </div>

                    {/* List */}
                    <Swiper
                        slidesPerView={4}
                        centeredSlides={false}
                        spaceBetween={20}
                        slidesPerGroupSkip={1}
                        autoplay={{
                            delay: 4000,
                            disableOnInteraction: false,
                        }}
                        grabCursor={true}
                        keyboard={{
                            enabled: true,
                        }}
                        breakpoints={{
                            640: {
                                slidesPerView: 2,
                                slidesPerGroup: 1,
                                spaceBetween: 10,
                            },
                            768: {
                                slidesPerView: 4,
                                slidesPerGroup: 1,
                                spaceBetween: 10,
                            },
                            1024: {
                                slidesPerView: 4,
                                slidesPerGroup: 1,
                                spaceBetween: 20,
                            },
                        }}
                        modules={[Autoplay, Keyboard]}
                        className="mySwiper mt-10"
                    >
                        {fillterProducts.map((product, index) => (
                            <SwiperSlide key={index}>
                                <Product product={product} horizontal={false} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* ------- */}
                <div className="grid grid-cols-1 grid-rows-4 md:grid-cols-4 md:grid-rows-1 gap-2">
                    <div className="text-center">
                        <div className="bg-white p-3 shadow-md size-14 rounded-full flex justify-center items-center mx-auto border border-slate-300">
                            <MdOutlineSupportAgent className="text-3xl text-gray-600 hover:text-orange-500" />
                        </div>
                        <p className="my-2 text-xl">24 / 7 Free Support</p>
                        <p className="text-gray-500 text-xs">
                            Passage Of Lorem Ipsum, You Need To Be Amet Embarrassing.
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="bg-white p-3 shadow-md size-14 rounded-full flex justify-center items-center mx-auto border border-slate-300">
                            <MdOutlineLocalShipping className="text-3xl text-gray-600 hover:text-orange-500" />
                        </div>
                        <p className="my-2 text-xl">Worldwide Free Shipping</p>
                        <p className="text-gray-500 text-xs">
                            Passage Of Lorem Ipsum, You Need To Be Amet Embarrassing.
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="bg-white p-3 shadow-md size-14 rounded-full flex justify-center items-center mx-auto border border-slate-300">
                            <TbCoin className="text-3xl text-gray-600 hover:text-orange-500" />
                        </div>
                        <p className="my-2 text-xl">Money Back Guarantee</p>
                        <p className="text-gray-500 text-xs">
                            Passage Of Lorem Ipsum, You Need To Be Amet Embarrassing.
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="bg-white p-3 shadow-md size-14 rounded-full flex justify-center items-center mx-auto border border-slate-300">
                            <IoGiftOutline className="text-3xl text-gray-600 hover:text-orange-500" />
                        </div>
                        <p className="my-2 text-xl">A Lots Of Gift</p>
                        <p className="text-gray-500 text-xs">
                            Passage Of Lorem Ipsum, You Need To Be Amet Embarrassing.
                        </p>
                    </div>
                </div>

                {/* Vegetables Product */}
                <h1 className="font-dancing text-center text-5xl text-green-800">Vegetables</h1>

                <div className="grid grid-cols-1 grid-rows-2 md:grid-cols-2 md:grid-rows-1 gap-6">
                    <div className="rounded-2xl overflow-hidden shadow-lg relative hover-overlay">
                        <img src="./deal5.webp" className="w-full object-cover h-[300px]" alt="Banner" />
                        <div className="absolute top-20 text-end w-full">
                            <h4 className="text-2xl">We Supply 100% Fresh</h4>
                            <h1 className="text-4xl font-bold my-3">Fresh Healthy Foods</h1>
                        </div>
                    </div>
                    <div className="rounded-2xl overflow-hidden shadow-lg relative hover-overlay">
                        <img src="./deal5.webp" className="w-full object-cover h-[300px]" alt="Banner" />
                        <div className="absolute top-20 text-end w-full">
                            <h4 className="text-2xl">We Supply 100% Fresh</h4>
                            <h1 className="text-4xl font-bold my-3">Fresh Healthy Foods</h1>
                        </div>
                    </div>
                </div>

                <div>
                    <Swiper
                        slidesPerView={2}
                        centeredSlides={false}
                        spaceBetween={20}
                        slidesPerGroupSkip={1}
                        autoplay={{
                            delay: 4000,
                            disableOnInteraction: false,
                        }}
                        grabCursor={true}
                        keyboard={{
                            enabled: true,
                        }}
                        breakpoints={{
                            640: {
                                slidesPerView: 1,
                                slidesPerGroup: 1,
                                spaceBetween: 10,
                            },
                            768: {
                                slidesPerView: 1,
                                slidesPerGroup: 1,
                                spaceBetween: 10,
                            },
                            1024: {
                                slidesPerView: 2,
                                slidesPerGroup: 1,
                                spaceBetween: 20,
                            },
                        }}
                        modules={[Autoplay, Keyboard]}
                        className="mySwipe"
                    >
                        {vegetables.map((product, index) => (
                            <SwiperSlide key={index}>
                                <Product product={product} horizontal={true} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                <ul className="grid grid-cols-6 gap-8 justify-between">
                    <li>
                        <img src="./brand1.webp" />
                    </li>
                    <li>
                        <img src="./brand2.avif" />
                    </li>
                    <li>
                        <img src="./brand3.avif" />
                    </li>
                    <li>
                        <img src="./brand4.webp" />
                    </li>
                    <li>
                        <img src="./brand5.webp" />
                    </li>
                    <li>
                        <img src="./brand6.avif" />
                    </li>
                </ul>
            </div>
        </div>
    );
}
