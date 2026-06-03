import { useState, useEffect } from "react";
import { getRoomTypes } from "./services/hotelService";
import { checkAvailability, createBooking } from "./services/bookingService";
import "./styles/HotelBooking.css";
import BookingConfirmation from "./BookingConfirmation";


const HotelBooking = ({ hotelId, userId }) => {
  const [step, setStep] = useState(1); // 🔥 1 = Form, 2 = Confirm
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [roomType, setRoomType] = useState("");
  const [roomOptions, setRoomOptions] = useState([]);
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  


  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const res = await getRoomTypes(hotelId);
        setRoomOptions(res.data);
      } catch (err) {
        console.error("❌ Failed to load room types:", err);
      }
    };
    fetchRoomTypes();
  }, [hotelId]);

  useEffect(() => {
    const fetchAvailability = async () => {
      if (checkIn && checkOut) {
        setLoading(true);
        try {
          const res = await checkAvailability(hotelId, checkIn, checkOut);
          setAvailability(res.data.availableRooms);
        } catch (err) {
          console.error("❌ Availability fetch failed:", err);
          setAvailability(null);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchAvailability();
  }, [checkIn, checkOut, hotelId]);

  const calculateNights = (start, end) => {
    const diff = new Date(end) - new Date(start);
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const selectedRoom = roomOptions.find((r) => r.type === roomType);
  const nights = checkIn && checkOut ? calculateNights(checkIn, checkOut) : 0;
  const totalPrice = selectedRoom ? selectedRoom.price_per_night * nights : 0;

  const proceedToPayment = (e) => {
    e.preventDefault();
    if (!roomType) {
      setMessage("❌ Please select a room type.");
      return;
    }
    if (availability !== null && guests > availability) {
      setMessage("❌ Not enough rooms available.");
      return;
    }
    setMessage("");
    setStep(2); // Move to Payment Step 
  };
  

  const confirmBooking = async () => {
    try {
      await createBooking({
        hotel_id: hotelId,
        user_id: userId,
        check_in: checkIn,
        check_out: checkOut,
        guests,
        room_type: roomType,
        total_price: totalPrice.toFixed(2),
      });

      setMessage("✅ Booking confirmed!");
      // Reset form after successful booking
      setCheckIn("");
      setCheckOut("");
      setGuests(1);
      setRoomType("");
      setStep(1);
      setShowConfirmation(true);
      setMessage("✅ Booking successful!");
    } catch (err) {
      console.error("❌ Booking failed:", err);
      setMessage("❌ Booking failed. Please try again.");
    }
  };

  return (
    <div className="booking-container">
      <h4>Book this hotel</h4>

      {step === 1 && (
        <form onSubmit={proceedToPayment} className="booking-form">
          <label>Check-in:</label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            required
          />

          <label>Check-out:</label>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            required
          />

          <label>Guests:</label>
          <input
            type="number"
            value={guests}
            min={1}
            onChange={(e) => setGuests(parseInt(e.target.value))}
            required
          />

          <label>Room Type:</label>
          {roomOptions.filter((r) => r.available_rooms > 0).length > 0 ? (
            <select value={roomType} onChange={(e) => setRoomType(e.target.value)} required>
              <option value="">-- Select --</option>
              {roomOptions
                .filter((room) => room.available_rooms > 0)
                .map((room) => (
                  <option key={room.id} value={room.type}>
                    {room.type} - €{room.price_per_night}/night ({room.available_rooms} available)
                  </option>
                ))}
            </select>
          ) : (
            <p style={{ color: "red", fontSize: "14px" }}>
              ❌ No rooms available for booking.
            </p>
          )}

          {loading ? (
            <p>Checking availability...</p>
          ) : availability !== null ? (
            <p>
              {availability > 0
                ? `✅ ${availability} room(s) available`
                : "❌ No rooms available"}
            </p>
          ) : null}

          <button type="submit" disabled={!roomType || availability === 0}>
            Proceed to Payment
          </button>
        </form>
      )}

{step === 2 && (
  <form className="payment-form" onSubmit={(e) => { e.preventDefault(); setStep(3); }}>
    <h5>💳 Enter Payment Details</h5>

    <label>Card Number:</label>
    <input type="text" placeholder="1234 5678 9012 3456" maxLength={19} required />

    <label>Expiry Date:</label>
    <input type="text" placeholder="MM/YY" maxLength={5} required />

    <label>CVV:</label>
    <input type="text" placeholder="123" maxLength={4} required />

    <div style={{ marginTop: "20px" }}>
      <button type="button" onClick={() => setStep(1)}>🔙 Back</button>
      <button type="submit" style={{ marginLeft: "10px" }}>
        💳 Pay Now
      </button>
    </div>
  </form>
)}


{step === 3 && (
  <div className="payment-summary">
    <h5>Confirm Your Booking</h5>
    <p><strong>Room:</strong> {selectedRoom?.type}</p>
    <p><strong>Dates:</strong> {checkIn} to {checkOut}</p>
    <p><strong>Guests:</strong> {guests}</p>
    <p><strong>Price per night:</strong> €{selectedRoom?.price_per_night}</p>
    <p><strong>Nights:</strong> {nights}</p>
    <p><strong>Total Price:</strong> <span style={{ fontWeight: 'bold' }}>€{totalPrice.toFixed(2)}</span></p>

    <div style={{ marginTop: "20px" }}>
      <button onClick={() => setStep(2)}>🔙 Back to Payment</button>
      <button onClick={confirmBooking} style={{ marginLeft: "10px" }}>
        🎯 Confirm Booking
      </button>
    </div>
  </div>
)}



      {message && (
        <p className={message.includes("❌") ? "error" : "success"}>
          {message}
        </p>
      )}
      {showConfirmation && <BookingConfirmation onClose={() => setShowConfirmation(false)} />}
    </div>
  );
  

};

export default HotelBooking;
