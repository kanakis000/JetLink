import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";


function UserHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <header className="header">
      <div className="title">JetLink</div>

      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>

      <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
        <Link to="/home" className="link">Home</Link>
        
        
        
        {user?.role === "user" && (
          <Link to="/my-bookings" className="link">My Bookings</Link>
        )}
        <button className="link logout-btn" onClick={handleLogout}>Logout</button>
      </nav>
    </header>
  );
}

export default UserHeader;
