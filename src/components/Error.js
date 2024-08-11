import React from "react";
import { FaTimes, FaExclamationTriangle } from "react-icons/fa";
// import { closeNotification } from "../redux/user/userSlice";
// import { useDispatch } from "react-redux";
// export default function Error({ errors }) {
//     const dispatch = useDispatch();
//     const handleTurnOff = () => {
//         dispatch(closeNotification());
//     }
//     return (
//         <div className="flex items-center justify-around bg-red-600 min-w-64 fixed right-1 px-3 z-40 py-4 m-2 rounded-sm slide-out text-white cursor-pointer">
//             <FaExclamationTriangle/>
//             <span className="px-3">{errors}</span>
//             <FaTimes className="hover:text-slate-300 hover:transition-all" onClick={handleTurnOff}/>
//             <div className="clear-none"></div>
//         </div>
//     );
// }