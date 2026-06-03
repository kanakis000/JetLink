import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getHotelById } from "./services/hotelService";
import HotelBooking from "./HotelBooking"; // ✅ Reuse existing component
import "./styles/HotelDetail.css"; // ✅ Create this file if it doesn’t exist

const HotelDetail = () => {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const response = await getHotelById(id);
        setHotel(response.data);
      } catch (err) {
        console.error("❌ Error fetching hotel:", err);
      }
    };

    fetchHotel();
  }, [id]);

  if (!hotel) return <p style={{ textAlign: "center", marginTop: "2rem" }}>Loading hotel details...</p>;

  return (
    <div className="hotel-detail-container">
      <img
        src={`http://localhost:5000/uploads/${hotel.image}`}
        alt={hotel.name}
        className="hotel-detail-image"
      />

      <div className="hotel-info">
        <h2>{hotel.name}</h2>
        <p className="hotel-type">⭐ {hotel.type}</p>
        <p className="hotel-region">📍 {hotel.region}</p>
        <p className="hotel-description">{hotel.description}</p>
      </div>

      <div className="booking-section">
        <h3>Book this hotel</h3>
        <HotelBooking hotelId={hotel.id} userId={user?.id} />
      </div>
    </div>
  );
};

export default HotelDetail;
