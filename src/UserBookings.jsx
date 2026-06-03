import { useState, useEffect } from "react";
import { getUserBookings, cancelBookingById } from "./services/bookingService";
import "./styles/UserBookings.css";
import LoadingSpinner from "./components/ui/LoadingSpinner";
import EmptyState from "./components/ui/EmptyState";
import Button from "./components/ui/Button";
import Card from "./components/ui/Card";

const UserBookings = ({ userId }) => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [filter, setFilter] = useState("all");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const res = await getUserBookings(userId);
        setBookings(res.data);
        setFilteredBookings(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch bookings:", err);
        setMessage("❌ Could not load bookings.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [userId]);

  useEffect(() => {
    if (filter === "all") {
      setFilteredBookings(bookings);
    } else {
      setFilteredBookings(bookings.filter((b) => b.status === filter));
    }
  }, [filter, bookings]);

  const cancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await cancelBookingById(bookingId);
      setMessage("✅ Booking cancelled.");
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, status: "cancelled" } : b
        )
      );
    } catch (err) {
      console.error("❌ Failed to cancel booking:", err);
      setMessage("❌ Cancel failed.");
    }
  };

  return (
    <div className="user-bookings-container">
      <h3>Your Bookings</h3>

      {/* Filter Bar */}
      <div className="filter-bar">
        <button
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={filter === "confirmed" ? "active" : ""}
          onClick={() => setFilter("confirmed")}
        >
          Confirmed
        </button>
        <button
          className={filter === "cancelled" ? "active" : ""}
          onClick={() => setFilter("cancelled")}
        >
          Cancelled
        </button>
      </div>

      {message && (
        <p className={`status-message ${message.includes("❌") ? "error" : "success"}`}>
          {message}
        </p>
      )}

      {loading ? (
        <div style={{ padding: 20 }}>
          <LoadingSpinner />
        </div>
      ) : filteredBookings.length === 0 ? (
        <EmptyState
          title="No bookings"
          message="You don't have any bookings for this filter."
        />
      ) : (
        <ul className="bookings-list">
          {filteredBookings.map((booking) => (
            <li
              key={booking.id}
              className={`booking-card ${
                booking.status === "cancelled" ? "cancelled" : ""
              }`}
            >
              <Card style={{ padding: 16, margin: 0 }}>
                <p>
                  <strong>Hotel:</strong> {booking.hotel_name} <br />
                  <strong>Region:</strong> {booking.region} <br />
                  <strong>Room Type:</strong> {booking.room_type} <br />
                  <strong>Check-in:</strong> {booking.check_in?.split("T")[0]} <br />
                  <strong>Check-out:</strong> {booking.check_out?.split("T")[0]} <br />
                  <strong>Guests:</strong> {booking.guests} <br />
                  <strong>Total Price:</strong> 
                    €{!isNaN(Number(booking.total_price)) 
                    ? Number(booking.total_price).toFixed(2) 
                    : "0.00"}<br />
                  <strong>Status:</strong>{" "}
                  <span className={`status ${booking.status}`}>
                    {booking.status}
                  </span>
                </p>

                {booking.status !== "cancelled" && (
                  <Button variant="secondary" onClick={() => cancelBooking(booking.id)}>❌ Cancel</Button>
                )}
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserBookings;
