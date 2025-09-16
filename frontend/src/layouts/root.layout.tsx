import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Navbar from "@/components/Navbar";

export default function RootLayout() {
    return (
        <>
            <Navbar />
            <ToastContainer />

            <div className="pt-20">
                <Outlet />
            </div>
        </>
    )
}
