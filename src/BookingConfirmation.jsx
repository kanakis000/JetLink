import { useNavigate } from "react-router-dom";
import "./styles/BookingConfirmation.css";

const BookingConfirmation = ({ onClose }) => {
  const navigate = useNavigate();

  const handleGoToBookings = () => {
    navigate("/my-bookings");
    onClose();
  };

  const handleGoHome = () => {
    navigate("/");
    onClose();
  };

  return (
    <div className="confirmation-modal">
      <div className="confirmation-content">
        <div style={{ fontSize: "40px", marginBottom: "10px" }}>🎉</div>
        <h2>Booking Confirmed!</h2>
        <p>Thank you for choosing us. We can't wait to welcome you!</p>
        <button onClick={handleGoHome}>🏠 Back to Home</button>
        <button onClick={handleGoToBookings}>📋 View My Bookings</button>
      </div>
    </div>
  );
};

export default BookingConfirmation;
