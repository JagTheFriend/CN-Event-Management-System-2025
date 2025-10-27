import EventDetails from "@/pages/EventDetails";
import Events from "@/pages/Events";
import type { RouteObject } from "react-router-dom";

export const eventRoutes: RouteObject[] = [
    {
        path: '',
        element: <Events />
    },
    {
        path: ':id',
        element: <EventDetails />
    }
]