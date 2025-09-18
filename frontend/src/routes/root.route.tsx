import { createBrowserRouter } from "react-router-dom";

import Home from "@/pages/Home";
import RootLayout from "@/layouts/root.layout";
import { eventRoutes } from "./event.route";
import dashboardRoutes from "./dashboard.route";


const rootRouter = createBrowserRouter([
    {
        index: true,
        element: <Home />
    },
    {
        path: '/events',
        element: <RootLayout />,
        children: eventRoutes
    },
    {
        path: '/dashboard',
        element: <RootLayout />,
        children: dashboardRoutes
    }
])

export default rootRouter;
