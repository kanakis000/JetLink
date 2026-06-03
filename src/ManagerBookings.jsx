import { useState, useEffect } from "react";
import { getManagerBookings } from "./services/bookingService";
import "./styles/ManagerBookings.css"; // Create if needed

const ManagerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.role === "hotel_manager") {
      fetchBookings(user.id);
    } else {
      setError("Unauthorized access");
    }
  }, []);

  const fetchBookings = async (managerId) => {
    try {
      const response = await getManagerBookings(managerId);
      setBookings(response.data);
    } catch (err) {
      console.error("❌ Error fetching bookings:", err);
      setError("Failed to fetch bookings");
    }
  };

  return (
    <div className="manager-bookings-container">
      <h2>Your Hotel Bookings</h2>
      {error && <p className="error">{error}</p>}
      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Hotel</th>
              <th>Guest</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Guests</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.hotel_name}</td>
                <td>{booking.username}</td>
                <td>{booking.check_in?.split("T")[0]}</td>
                <td>{booking.check_out?.split("T")[0]}</td>
                <td>{booking.guests}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManagerBookings;
