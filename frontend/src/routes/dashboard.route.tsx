import type { RouteObject } from "react-router-dom";
import Dashboard from "@/pages/dashboard/Dashboard";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const dashboardRoutes: RouteObject[] = [
    {
        index: true, 
        element: (
            <ProtectedRoute>
                <Dashboard />
            </ProtectedRoute>
        )
    }
]

export default dashboardRoutes;
