import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout";

export function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Navigate to="/parent-1" replace />} />
                <Route path="parent-1" element={<div>Parent 1 Page</div>} />
                <Route path="parent-2/child-1" element={<div>Child 1</div>} />
                <Route path="parent-2/child-2" element={<div>Child 2</div>} />
                <Route path="parent-2/child-3" element={<div>Child 3</div>} />
            </Route>
        </Routes>
    )
}