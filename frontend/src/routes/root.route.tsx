import { createBrowserRouter } from "react-router-dom";

import Home from "@/pages/Home";
import RootLayout from "@/layouts/root.layout";
import { eventRoutes } from "./event.route";


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
])

export default rootRouter;
