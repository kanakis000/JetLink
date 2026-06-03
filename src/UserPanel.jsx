import { useNavigate } from "react-router-dom";

const UserPanel = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token"); // ✅ Remove token on logout
        navigate("/login"); // ✅ Redirect to login page
    };

    return (
        <div className="user-panel-container">
            <h2>Welcome to Your User Panel</h2>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default UserPanel;
