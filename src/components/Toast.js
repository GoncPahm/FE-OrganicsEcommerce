import React from "react";
import { MdError, MdNotifications, MdOutlineClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { closeToast } from "../redux/toast/toastSlice";
export default function Toast() {
    const { typeToast, content } = useSelector((state) => state.toast);
    const dispatch = useDispatch();
    const getIcon = () => {
        switch (typeToast) {
            case "notifi":
                return <MdNotifications className="text-blue-500 text-xl" />;
            case "error":
                return <MdError className="text-red-500 text-xl" />;
            default:
                return null;
        }
    };

    return (
        <div className={`bg-gray-100 min-w-80 fixed right-0 p-3 rounded-md z-50`}>
            <div className="flex items-center justify-center">
                {getIcon()}
                <h1 className="flex-1 text-center">{content}</h1>
                <MdOutlineClose
                    className="text-xl cursor-pointer hover:text-orange-500"
                    onClick={() => dispatch(closeToast())}
                />
            </div>
            <div className="bg-orange-500 h-1 rounded-md mt-2 progress"></div>
        </div>
    );
}
