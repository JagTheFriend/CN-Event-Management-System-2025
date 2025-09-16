import { createBrowserRouter } from "react-router-dom";

import Home from "@/pages/Home";
import RootLayout from "@/layouts/root.layout";
import Events from "@/pages/Events";


const rootRouter = createBrowserRouter([
    {
        path: '/',
        element: <Home />
    },
    {
        path: '/',
        element: <RootLayout />,
        children: [
            {
                path: 'events',
                element: <Events />
            }
        ]
    }
])

export default rootRouter;
