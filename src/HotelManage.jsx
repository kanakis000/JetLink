import { useState, useEffect } from "react";
import { getHotelsByManager, addHotel, updateHotel, deleteHotel } from "./services/hotelService";
import { getRoomTypes, initRoomTypes, setRoomTypes as saveRoomTypes } from "./services/roomTypeService";
import "./styles/HotelManage.css";
import Modal from "./components/ui/Modal";

const HotelManage = () => {
  const [formData, setFormData] = useState({ 
    name: "", 
    type: "1-star", 
    region: "Heraklion", 
    image: null, 
    room_count: "" 
  });
  
  const [expandedHotelId, setExpandedHotelId] = useState(null);
  const [roomTypes, setRoomTypes] = useState({});

  const [hotels, setHotels] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [managerId, setManagerId] = useState(null);
  const [editingHotel, setEditingHotel] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [existingImage, setExistingImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [closing, setClosing] = useState(false);
  const getAssignedRoomCount = (hotelId) => {
  const types = roomTypes[hotelId] || [];
  return types.reduce((total, room) => total + (parseInt(room.available_rooms) || 0), 0);
  };
  
 
  

  const toggleRoomTypes = async (hotelId) => {
    if (expandedHotelId === hotelId) {
      setExpandedHotelId(null); // Collapse if already open
      return;
    }
  
    try {
      // 🔍 First fetch existing room types
      let res = await getRoomTypes(hotelId);
  
      // ✅ If none exist, initialize them
      if (res.data.length === 0) {
        const initRes = await initRoomTypes(hotelId);
        console.log("✅ Room types initialized:", initRes.data);
  
        // Fetch again after creation
        res = await getRoomTypes(hotelId);
      }
  
      // 📦 Update state and expand section
      setRoomTypes((prev) => ({ ...prev, [hotelId]: res.data }));
      setExpandedHotelId(hotelId);
    } catch (err) {
      console.error("❌ Error toggling room types:", err);
      setError("Failed to load or initialize room types.");
    }
  };
  
  
  const handleRoomTypeSave = async (hotelId) => {
    try {
      const updatedTypes = roomTypes[hotelId];
      await saveRoomTypes(hotelId, updatedTypes.map((r) => ({
        type: r.type,
        available_rooms: r.available_rooms,
        price_per_night: r.price_per_night ?? 0
      })));
      setMessage("✅ Room types updated!");
    } catch (err) {
      console.error("❌ Failed to update room types:", err);
      setError("Failed to update room types.");
    }
  };
  
  

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.role === "hotel_manager") {
      setManagerId(user.id);
      fetchHotels(user.id);
    } else {
      setError("You are not authorized to access this page.");
    }
  }, []);

  const fetchHotels = async (managerId) => {
    try {
      const response = await getHotelsByManager(managerId);
      setHotels(response.data);
    } catch (err) {
      console.error("❌ Error fetching hotels:", err);
      setError("Failed to load hotels.");
    }
  };

  const handleChange = (e) => {
    if (e.target.name === "image") {
      const file = e.target.files[0];
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file)); // 👈 live preview
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
  
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("type", formData.type);
    formDataToSend.append("region", formData.region);
    formDataToSend.append("manager_id", managerId);
    formDataToSend.append("room_count", formData.room_count || 0); // ✅ This line ensures room count is sent
  
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }
  
    try {
      if (editingHotel) {
        await updateHotel(editingHotel.id, formDataToSend);
        fetchHotels(managerId);
  
        // 🧊 Fade out before closing
        setClosing(true);
        setTimeout(() => {
          setEditingHotel(null);
          setIsModalOpen(false);
          setClosing(false);
          setFormData({ name: "", type: "1-star", region: "Heraklion", image: null });
          setImagePreview(null);
        }, 300); // match animation duration
  
      } else {
        await addHotel(formDataToSend);
        setMessage("Hotel added successfully!");
        fetchHotels(managerId);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong!");
    }
  };
  

  const handleEdit = (hotel) => {
    setEditingHotel(hotel);
    setExistingImage(hotel.image);
    setFormData({
      name: hotel.name,
      type: hotel.type,
      region: hotel.region,
      image: null,
      room_count: hotel.room_count || "", 
    });
    setIsModalOpen(true);
  };
  
  
  

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this hotel?")) {
      try {
        await deleteHotel(id);
        setMessage("Hotel deleted successfully!");
        fetchHotels(managerId);
      } catch (err) {
        setError(err.response?.data?.message || "Delete failed.");
      }
    }
  };

  const handleCloseModal = () => {
    setClosing(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setClosing(false);
      setEditingHotel(null);
      setFormData({ name: "", type: "1-star", region: "Heraklion", image: null });
      setImagePreview(null);
    }, 300); // match your CSS animation duration
  };
  
  const fetchRoomTypes = async (hotelId) => {
    try {
      const res = await getRoomTypes(hotelId);
      return res.data;
    } catch (err) {
      console.error("❌ Failed to fetch room types:", err);
      return [];
    }
  };
  

  return (
    <div className="hotel-manage-container">
      <h2>Hotel Management</h2>
      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}

 
      <form onSubmit={handleSubmit} className="hotel-form">
  <input type="text" name="name" value={formData.name} onChange={handleChange} required />

  <select name="type" value={formData.type} onChange={handleChange}>
    <option value="1-star">1 Star</option>
    <option value="2-star">2 Star</option>
    <option value="3-star">3 Star</option>
    <option value="4-star">4 Star</option>
    <option value="5-star">5 Star</option>
  </select>

  <select name="region" value={formData.region} onChange={handleChange}>
    <option value="Heraklion">Heraklion</option>
    <option value="Chania">Chania</option>
    <option value="Rethymno">Rethymno</option>
  </select>


  

  {/* ✅ Add this input for room count */}
  <input
    type="number"
    name="room_count"
    placeholder="Number of Rooms"
    value={formData.room_count || ""}
    onChange={handleChange}
    min={1}
  />

  {/*  Image Preview */}
  {formData.image && (
    <img src={URL.createObjectURL(formData.image)} alt="Preview" className="image-preview" />
  )}
  {!formData.image && existingImage && (
    <img src={`http://localhost:5000/uploads/${existingImage}`} alt="Current" className="image-preview" />
  )}

  <input type="file" name="image" accept="image/*" onChange={handleChange} />
  <button type="submit">{editingHotel ? "Save Changes" : "Add Hotel"}</button>
</form>



{/*How the hotel card will show */} 
{hotels.length > 0 && (
  <div className="hotel-list">
    <h3>Your Hotels</h3>
    {hotels.map((hotel) => {
  const assignedTotal = roomTypes[hotel.id]?.reduce(
    (sum, room) => sum + Number(room.available_rooms || 0),
    0
  ) || 0;

  const isOverLimit = assignedTotal > hotel.room_count;

  return (
    <div key={hotel.id} className="hotel-card">
      <img
        src={`http://localhost:5000/uploads/${hotel.image}`}
        alt={hotel.name}
      />
      <div>
        <h4>{hotel.name}</h4>
        <p>{hotel.type} - {hotel.region}</p>
        <button onClick={() => handleEdit(hotel)}>✏ Edit</button>
        <button onClick={() => handleDelete(hotel.id)}>🗑 Delete</button>
        <button onClick={() => toggleRoomTypes(hotel.id)}>
          {expandedHotelId === hotel.id ? "Hide Room Types" : "View Room Types"}
        </button>
      </div>

      {/* ✅ Only render for selected hotel */}
      {expandedHotelId === hotel.id && roomTypes[hotel.id] && (
        <div className="room-types-section">
          <h5>Room Types</h5>
          <ul>
            {roomTypes[hotel.id].map((room, idx) => (
              <li
                key={room.id}
                style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}
              >
                <span style={{ width: "100px" }}>{room.type}:</span>
                <input
  type="number"
  min={0}
  value={isNaN(room.available_rooms) ? 0 : room.available_rooms}
  onChange={(e) => {
    const updated = [...roomTypes[hotel.id]];
    updated[idx].available_rooms = parseInt(e.target.value) || 0;
    setRoomTypes((prev) => ({ ...prev, [hotel.id]: updated }));
  }}
  style={{
    width: "60px",
    marginLeft: "10px",
    border: isOverLimit ? "1px solid red" : undefined,
    backgroundColor: isOverLimit ? "#ffe6e6" : undefined,
  }}
/>

<input
  type="number"
  min={0}
  step={0.01}
  value={room.price_per_night ?? ""}
  onChange={(e) => {
    const updated = [...roomTypes[hotel.id]];
    updated[idx].price_per_night = parseFloat(e.target.value) || 0;
    setRoomTypes((prev) => ({ ...prev, [hotel.id]: updated }));
  }}
  placeholder="€/night"
  style={{
    width: "80px",
    marginLeft: "10px",
    padding: "4px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  }}
/>

              </li>
            ))}
          </ul>

          <p style={{ fontWeight: "bold", marginTop: "5px" }}>
            Assigned: {assignedTotal} / Total: {hotel.room_count}
          </p>

          {isOverLimit && (
            <p style={{ color: "red", fontSize: "14px", marginBottom: "5px" }}>
              ⚠️ Room assignment exceeds the hotel room limit!
            </p>
          )}

          <button
            onClick={() => handleRoomTypeSave(hotel.id)}
            disabled={isOverLimit}
            style={{
              marginTop: "10px",
              opacity: isOverLimit ? 0.5 : 1,
              cursor: isOverLimit ? "not-allowed" : "pointer",
            }}
          >
            💾 Save Room Types
          </button>
        </div>
      )}
    </div>
  );
})}


        </div>
      )}

<Modal
  isOpen={isModalOpen}
  onClose={handleCloseModal}
  overlayClassName={`modal ${closing ? "fade-out" : ""}`}
  contentClassName={`modal-content ${closing ? "fade-out" : ""}`}
  closeOnOverlayClick={false}
>
  <span className="close" onClick={handleCloseModal}>&times;</span>
  <h3>{editingHotel ? "Edit Hotel" : "Add Hotel"}</h3>
  <form onSubmit={handleSubmit} className="hotel-form">
    <input type="text" name="name" value={formData.name} onChange={handleChange} required />
    <select name="type" value={formData.type} onChange={handleChange}>
      <option value="1-star">1 Star</option>
      <option value="2-star">2 Star</option>
      <option value="3-star">3 Star</option>
      <option value="4-star">4 Star</option>
      <option value="5-star">5 Star</option>
    </select>
    <select name="region" value={formData.region} onChange={handleChange}>
      <option value="Heraklion">Heraklion</option>
      <option value="Chania">Chania</option>
      <option value="Rethymno">Rethymno</option>
    </select>

    <input
      type="number"
      name="room_count"
      placeholder="Number of Rooms"
      value={formData.room_count || ""}
      onChange={handleChange}
      min={1}
    />

    {formData.image && (
      <img src={URL.createObjectURL(formData.image)} alt="Preview" className="image-preview" />
    )}
    {!formData.image && existingImage && (
      <img src={`http://localhost:5000/uploads/${existingImage}`} alt="Current" className="image-preview" />
    )}

    <input type="file" name="image" accept="image/*" onChange={handleChange} />
    <button type="submit">{editingHotel ? "Save Changes" : "Add Hotel"}</button>
  </form>
</Modal>



    </div>
  );
};

export default HotelManage;
