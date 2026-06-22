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
        console.error("β Failed to fetch bookings:", err);
        setMessage("β Could not load bookings.");
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
      setMessage("β… Booking cancelled.");
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, status: "cancelled" } : b
        )
      );
    } catch (err) {
      console.error("β Failed to cancel booking:", err);
      setMessage("β Cancel failed.");
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
        <p className={`status-message ${message.includes("β") ? "error" : "success"}`}>
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
              <Card className="booking-card-inner" style={{ padding: 0, margin: 0 }}>
                <div className="booking-card-header">
                  <div>
                    <h4 className="booking-hotel-name">{booking.hotel_name}</h4>
                    <p className="booking-region">{booking.region}</p>
                  </div>
                  <span className={`status ${booking.status}`}>
                    {booking.status}
                  </span>
                </div>

                <div className="booking-detail-grid">
                  <div className="booking-detail-item">
                    <span>Room Type</span>
                    <strong>{booking.room_type}</strong>
                  </div>
                  <div className="booking-detail-item">
                    <span>Check-in</span>
                    <strong>{booking.check_in?.split("T")[0]}</strong>
                  </div>
                  <div className="booking-detail-item">
                    <span>Check-out</span>
                    <strong>{booking.check_out?.split("T")[0]}</strong>
                  </div>
                  <div className="booking-detail-item">
                    <span>Guests</span>
                    <strong>{booking.guests}</strong>
                  </div>
                  <div className="booking-detail-item booking-total">
                    <span>Total Price</span>
                    <strong>
                      &euro;{!isNaN(Number(booking.total_price))
                        ? Number(booking.total_price).toFixed(2)
                        : "0.00"}
                    </strong>
                  </div>
                </div>

                {booking.status !== "cancelled" && (
                  <div className="booking-card-actions">
                    <Button variant="secondary" onClick={() => cancelBooking(booking.id)}>Cancel</Button>
                  </div>
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

