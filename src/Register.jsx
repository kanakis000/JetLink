import { useState } from "react";
import { register } from "./services/authService";
import { useNavigate, Link } from "react-router-dom";
import "./styles/Register.css"; // Ensure CSS file exists

const Register = ({role}) => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        phonenumber: "",
      });
      
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");
    
      try {
        await register({
          ...formData,
          role, // still passed from props
        });
    
        alert("Registration successful! Please login.");
    
        if (role === "hotel_manager") {
          navigate("/login/manager");
        } else if (role === "restaurant_manager") {
          navigate("/login/restaurant");
        } else {
          navigate("/login/user");
        }
    
      } catch (err) {
        setError(err.response?.data?.message || "Registration failed!");
      }
    };
    
      
      

    return (
    <div className="register-wrapper"> 
        <div className="register-container">
            <h2>Register</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                <input type="text" name="phonenumber" placeholder="Phone Number" onChange={handleChange} required />

                

                <button type="submit">Register</button>
            </form>
            <p>Already have an account? <Link to="/account-type">Login here</Link></p>
        </div>
    </div>
    );

};

export default Register;
