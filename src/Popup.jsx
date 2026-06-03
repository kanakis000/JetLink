import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login, register } from "./services/authService";
import "./styles/Popup.css"; // ✅ Make sure this path is correct

const Popup = ({ onClose }) => {
    const [isRegister, setIsRegister] = useState(true);
    const [formData, setFormData] = useState({ username: "", email: "", password: "", phonenumber: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            onClose(); // ✅ If already logged in, close popup
        }
    }, [onClose]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            if (isRegister) {
                // ✅ Register User
                await register(formData);
                alert("Registration successful! Now login.");
                setIsRegister(false); // ✅ Switch to login after successful registration
            } else {
                // ✅ Login User
                const response = await login(formData);
                localStorage.setItem("token", response.data.token);
                onClose(); // ✅ Close popup only after successful login
                navigate("/"); // ✅ Redirect to homepage after login
            }
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong!");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>×</button>
                <h2>{isRegister ? "Register" : "Login"}</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    {isRegister && (
                        <>
                            <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
                            <input type="text" name="phonenumber" placeholder="Phone Number" onChange={handleChange} required />
                        </>
                    )}
                    <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                    <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                    <button type="submit">{isRegister ? "Register" : "Login"}</button>
                </form>
                <p>
                    {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
                    <span className="toggle-auth" onClick={() => setIsRegister(!isRegister)}>
                        {isRegister ? "Login here" : "Register here"}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Popup;
