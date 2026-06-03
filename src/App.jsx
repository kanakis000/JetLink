import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import ManagerHeader from "./ManagerHeader.jsx";
import UserHeader from "./UserHeader.jsx";
import HeaderMinimal from "./HeaderMinimal.jsx";
import Footer from "./Footer.jsx";
import Home from "./Home.jsx";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import AccountType from "./AccountType.jsx";
import Check from "./Check.jsx";
import HotelManage from "./HotelManage.jsx";
import Heraklion from "./Heraklion.jsx";
import Chania from "./Chania.jsx";
import Rethymno from "./Rethymno.jsx";
import ManagerHotelTabs from "./ManagerHotelTabs.jsx";
import HotelDetail from "./HotelDetail";
import UserBookings from "./UserBookings";
import RestaurantManage from "./RestaurantManage";
import RestaurantDetail from "./RestaurantDetail";
import ManageMenu from "./ManageMenu";

const AppContent = () => {
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const isAccountPage = location.pathname === "/account-type";

  return (
    <>
      {/* ✅ Header logic */}
      {isAccountPage ? (
        <HeaderMinimal />
      ) : user?.role === "hotel_manager" || user?.role === "restaurant_manager" ? (
        <ManagerHeader />
      ) : (
        <UserHeader />
      )}

      <Routes>
        <Route path="/" element={<Navigate to="/account-type" />} />
        <Route path="/account-type" element={<AccountType />} />
        <Route path="/login/user" element={<Login role="user" />} />
        <Route path="/login/manager" element={<Login role="hotel_manager" />} />
        <Route path="/login/restaurant" element={<Login role="restaurant_manager" />} />
        <Route path="/register/user" element={<Register role="user" />} />
        <Route path="/register/manager" element={<Register role="hotel_manager" />} />
        <Route path="/register/restaurant" element={<Register role="restaurant_manager" />} />

        {/* ✅ Protected routes */}
        <Route element={<Check />}>
          <Route path="/home" element={<Home />} />
          <Route path="/hotelmanage" element={<HotelManage />} />
          <Route path="/manager-bookings" element={<ManagerHotelTabs />} />
          <Route path="/restaurantmanage" element={<RestaurantManage userId={user?.id} />} />
        </Route>

        {/* ✅ Detail and region pages */}
        <Route path="/hotels/:id" element={<HotelDetail />} />
        <Route path="/my-bookings" element={<UserBookings userId={user?.id} />} />
        <Route path="/restaurants-bars/:id" element={<RestaurantDetail />} />
        <Route path="/restaurantmanage/menu/:restaurantId" element={<ManageMenu />} />
        <Route path="/Heraklion" element={<Heraklion />} />
        <Route path="/Chania" element={<Chania />} />
        <Route path="/Rethymno" element={<Rethymno />} />
      </Routes>

      {!isAccountPage && <Footer />}
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
