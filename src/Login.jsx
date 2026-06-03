import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { login } from "./services/authService";
import "./styles/Login.css"; 

const Login = ({ role }) => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    
    

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
      
        console.log(" Sending Login Request:", { email: formData.email, password: formData.password });
      
        try {
          const response = await login(formData);
          const user = response.data.user;
      
          console.log(" Server Response:", response.data);
      
          // ✅ Check if the logged-in user's role matches the login panel's role
          if (user.role !== role) {
            setError(`You are trying to log in as a ${role.replace("_", " ")}, but your account is registered as a ${user.role.replace("_", " ")}.`);
            return;
          }
      
          // ✅ Save token and user
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(user));
      
          console.log(" User Logged In:", user);
      
          // ✅ Redirect based on user role
          if (user.role === "hotel_manager") {
            console.log("🔄 Redirecting to Hotel Management Page...");
            navigate("/hotelmanage");
          } else if (user.role === "restaurant_manager") {
            console.log("🔄 Redirecting to Restaurant Management Page...");
            navigate("/restaurantmanage"); // (⚡ New page we'll create next!)
          } else {
            console.log("🔄 Redirecting to Home Page...");
            navigate("/home");
          }
      
        } catch (err) {
          console.error(" Login Error:", err.response?.data || err);
          setError(err.response?.data?.message || "Login failed!");
        }
      };
      
    

    return (
        <div className="login-wrapper">
  <div className="auth-container">
  <h2>
  Login as {role === "hotel_manager" ? "Hotel Manager" : role === "restaurant_manager" ? "Restaurant Manager" : "User"}
</h2>

    {error && <p className="error">{error}</p>}

    <form onSubmit={handleSubmit} className="login-form">
      <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
      <button type="submit">Login</button>
    </form>
  </div>
</div>

      );
      
};

export default Login;
