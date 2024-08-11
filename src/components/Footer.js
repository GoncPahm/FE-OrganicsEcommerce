import React from "react";
import { FaFacebook, FaGithub, FaPhoneAlt, FaYoutube } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";
import { IoIosMail } from "react-icons/io";
export default function Footer() {
    return (
        <div className="bg-black mt-10 grid grid-cols-4 py-10">
            <div className="text-white text-center">
                <h1>CONTACT US</h1>
                <ul className="flex flex-col gap-2 mt-3">
                    <li className="flex items-center justify-center gap-2">
                        <IoLocationOutline />
                        <span>Ha Noi, Viet Nam</span>
                    </li>
                    <li className="flex items-center justify-center gap-2">
                        <FaPhoneAlt />
                        <span>012-345-789</span>
                    </li>
                    <li className="flex items-center justify-center gap-2">
                        <IoIosMail />
                        <span>congpvc1910@gmail.com</span>
                    </li>
                    <li className="flex items-center justify-center gap-3">
                        <FaGithub className="text-xl" />
                        <FaFacebook className="text-xl" />
                        <FaYoutube className="text-xl" />
                    </li>
                </ul>
            </div>
            <div className="text-white text-center">
                <h1>PRODUCTS</h1>
                <ul className="flex flex-col gap-2 mt-3">
                    <li>Vegetables</li>
                    <li>Fruits</li>
                    <li>Juices</li>
                    <li>Other</li>
                </ul>
            </div>
            <div className="text-white text-center">
                <h1>SERVICE</h1>
                <ul className="flex flex-col gap-2 mt-3">
                    <li>About us</li>
                    <li>Contact</li>
                    <li>Information</li>
                    <li>Privacy & Policy</li>
                    <li>Terms & Conditions</li>
                </ul>
            </div>
            <div className="text-white text-center">
                <h1>EXTRA</h1>
                <ul className="flex flex-col gap-2 mt-3">
                    <li>Search</li>
                    <li>News</li>
                    <li>All Collections</li>
                </ul>
            </div>
        </div>
    );
}
