import type { RouteObject } from "react-router-dom";
import Dashboard from "@/pages/dashboard/Dashboard";

const dashboardRoutes: RouteObject[] = [
    {index: true, element: <Dashboard />}
]

export default dashboardRoutes;
