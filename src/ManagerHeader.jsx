import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./styles/Header.css";

function ManagerHeader() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const homePath = user?.role === "hotel_manager"
    ? "/hotelmanage"
    : user?.role === "restaurant_manager"
    ? "/restaurantmanage"
    : "/home";

  return (
    <header className="header">
      <div className="left-nav">
        {user?.role === "hotel_manager" ? (
          <>
            <Link to="/hotelmanage" className="link">Manage Hotels</Link>
            <Link to="/manager-bookings" className="link">View Bookings</Link>
            
          </>
        ) : (
          <>
            <Link to={homePath} className="link">Home</Link>
          </>
        )}
      </div>

      <h1 className="title">JetLink</h1>


      <div className="right-nav">
        {user ? (
          <>
            {user.role !== "hotel_manager" && (
              <>
                
              </>
            )}
            <button className="link logout-btn" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/account-type" className="link">Login</Link>
          </>
        )}
      </div>
    </header>
  );
}

export default ManagerHeader;
