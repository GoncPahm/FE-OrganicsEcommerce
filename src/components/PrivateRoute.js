import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

//path/path2
//Outlet sẽ là component của path2

export default function PrivateRoute() {
    const { currentUser } = useSelector((state) => state.user);
    return currentUser ? <Outlet /> : <Navigate to={"/sign-in"} />;
}
