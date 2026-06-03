import { Navigate, Outlet } from "react-router-dom";

const Check = () => {
    const token = localStorage.getItem("token"); // ✅ Get the JWT token

    return token ? <Outlet /> : <Navigate to="/" replace />;
};

export default Check;
