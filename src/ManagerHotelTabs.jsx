import { useEffect, useState } from "react";
import { getHotelsByManager } from "./services/hotelService";
import { getHotelBookings } from "./services/bookingService";
import "./styles/ManagerTabs.css";

const ManagerHotelTabs = () => {
  const [hotels, setHotels] = useState([]);
  const [bookingsByHotel, setBookingsByHotel] = useState({});
  const [error, setError] = useState("");
  const [expandedHotelId, setExpandedHotelId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.role === "hotel_manager") {
      fetchHotels(user.id);
    } else {
      setError("Unauthorized access.");
    }
  }, []);

  const fetchHotels = async (managerId) => {
    try {
      const res = await getHotelsByManager(managerId);
      setHotels(res.data);
      res.data.forEach(hotel => fetchBookingsForHotel(hotel.id));
    } catch (err) {
      setError("Failed to load hotels.");
    }
  };

  const fetchBookingsForHotel = async (hotelId) => {
    try {
      const res = await getHotelBookings(hotelId);
      setBookingsByHotel(prev => ({ ...prev, [hotelId]: res.data }));
    } catch (err) {
      console.error("Error fetching bookings for hotel:", hotelId, err);
    }
  };

  const toggleHotel = (hotelId) => {
    setExpandedHotelId(prev => (prev === hotelId ? null : hotelId));
  };

  return (
    <div className="manager-tabs-container">
      <h2>Your Hotel Bookings</h2>
      {error && <p className="error">{error}</p>}

      {hotels.map(hotel => (
        <div key={hotel.id} className="hotel-block">
          <div className="hotel-summary" onClick={() => toggleHotel(hotel.id)}>
            <h3>{hotel.name}</h3>
            <p>{bookingsByHotel[hotel.id]?.length || 0} bookings</p>
            <span className="dropdown-icon">
              {expandedHotelId === hotel.id ? "▲" : "▼"}
            </span>
          </div>

          {expandedHotelId === hotel.id && (
            <>
              {/* Filter Buttons */}
              <div className="filter-bar">
                <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>All</button>
                <button className={filter === "confirmed" ? "active" : ""} onClick={() => setFilter("confirmed")}>Confirmed</button>
                <button className={filter === "cancelled" ? "active" : ""} onClick={() => setFilter("cancelled")}>Cancelled</button>
              </div>

              {/* Sort Buttons */}
              <div className="sort-bar">
                <button className={sortOrder === "newest" ? "active" : ""} onClick={() => setSortOrder("newest")}>Newest</button>
                <button className={sortOrder === "oldest" ? "active" : ""} onClick={() => setSortOrder("oldest")}>Oldest</button>
              </div>

              <table>
                <thead>
                  <tr>
                    <th>Guest</th>
                    <th>Check-in</th>
                    <th>Check-out</th>
                    <th>Guests</th>
                    <th>Room Type</th>
                    <th>Total (€)</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
  {bookingsByHotel[hotel.id]
    ?.filter((booking) => filter === "all" || booking.status === filter)
    .sort((a, b) =>
      sortOrder === "newest"
        ? new Date(b.check_in) - new Date(a.check_in)
        : new Date(a.check_in) - new Date(b.check_in)
    )
    .map((booking) => (
      <tr
        key={booking.id}
        className={booking.status === "cancelled" ? "cancelled-booking" : ""}>
  <td>{booking.guest_name}</td>
  <td>{booking.check_in?.split("T")[0]}</td>
  <td>{booking.check_out?.split("T")[0]}</td>
  <td>{booking.guests}</td>
  <td>{booking.room_type}</td>
  <td>{!isNaN(Number(booking.total_price)) 
             ? Number(booking.total_price).toFixed(2) 
             : "0.00"}</td>

  <td>
    <span className={`status-label ${booking.status}`}>
      {booking.status}
    </span>
  </td>
</tr>
    ))}
</tbody>

              </table>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default ManagerHotelTabs;
