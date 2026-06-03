import { useEffect, useState } from "react";
import "./styles/restaurant.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import Modal from "./components/ui/Modal";
import { getRestaurantsByManager, addRestaurant, updateRestaurant, deleteRestaurant } from "./services/restaurantService";


const RestaurantManage = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.id;

  const [restaurants, setRestaurants] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    region: "Heraklion",
    types: [],
    description: "",
    image: null,
  });

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await getRestaurantsByManager(userId);
      setRestaurants(response.data);
    } catch (error) {
      console.error("❌ Error fetching:", error);
    }
  };

  const openModal = (restaurant = null) => {
    if (restaurant) {
      setEditingRestaurant(restaurant);
      setFormData({
        name: restaurant.name,
        region: restaurant.region,
        types: restaurant.type ? restaurant.type.split(",") : [],
        description: restaurant.description,
        image: null,
      });
    } else {
      setEditingRestaurant(null);
      setFormData({ name: "", region: "Heraklion", types: [], description: "", image: null });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingRestaurant(null);
  };

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleTypeChange = (e) => {
    const type = e.target.value;
    const newTypes = formData.types.includes(type)
      ? formData.types.filter((t) => t !== type)
      : [...formData.types, type];
    setFormData({ ...formData, types: newTypes });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("region", formData.region);
    data.append("type", formData.types.join(","));
    data.append("description", formData.description);
    if (formData.image) data.append("image", formData.image);
    data.append("manager_id", userId);

    try {
      if (editingRestaurant) {
        await updateRestaurant(editingRestaurant.id, data);
      } else {
        await addRestaurant(data);
      }
      fetchRestaurants();
      closeModal();
    } catch (error) {
      console.error("❌ Error saving:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this restaurant/bar?")) {
      try {
        await deleteRestaurant(id);
        fetchRestaurants();
      } catch (error) {
        console.error("❌ Error deleting:", error);
      }
    }
  };

  return (
    <>
      <div className="hotels-container">
        <h2 className="hotels-title">Manage Restaurants & Bars</h2>

        <div className="add-button-wrapper">
          <button className="role-btn" onClick={() => openModal()}>
            ➕ Add New Restaurant/Bar
          </button>
        </div>

        <div className="card-list">
        {restaurants.map((restaurant) => (
  <div key={restaurant.id} className="card">
    {restaurant.image && (
      <img
        src={`http://localhost:5000/uploads/${restaurant.image}`}
        alt={restaurant.name}
      />
    )}
    <h3 className="card-name">{restaurant.name}</h3>
    <p className="card-type">
      {restaurant.type.split(",").map((type) => {
        const trimmed = type.trim();
        const icons = {
          Restaurant: "🍽️",
          Bar: "🍹",
          Cafe: "☕",
          Club: "🎶",
        };
        return `${icons[trimmed] || ""} ${trimmed}`;
      }).join(" / ")}
    </p>

    <p className="truncate-description">{restaurant.description}</p>

    <div className="icon-buttons">
      <button className="icon-button edit" onClick={() => openModal(restaurant)}>
        <FaEdit />
      </button>
      <button className="icon-button delete" onClick={() => handleDelete(restaurant.id)}>
        <FaTrash />
      </button>
    </div>

    {/*  Menu Button */}
    <Link to={`/restaurantmanage/menu/${restaurant.id}`}>
      <button className="menu-manage-btn">🍽️ Manage Menu</button>
    </Link>
  </div>
))}

        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        overlayClassName="modal-overlay"
        contentClassName="modal"
        closeOnOverlayClick={false}
      >
        <div className="modal-content">
          <h2 className="modal-title">{editingRestaurant ? "Edit" : "Add Restaurant/Bar"}</h2>

          <form onSubmit={handleSubmit} className="restaurant-form">
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <select name="region" value={formData.region} onChange={handleChange}>
                <option value="Heraklion">Heraklion</option>
                <option value="Chania">Chania</option>
                <option value="Rethymno">Rethymno</option>
              </select>
            </div>

            <div className="form-group types-selection">
              {["Restaurant", "Bar", "Cafe", "Club"].map((type) => (
                <button
                  key={type}
                  type="button"
                  className={`type-btn ${formData.types.includes(type) ? "selected" : ""}`}
                  onClick={() => handleTypeChange({ target: { value: type } })}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="form-group">
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
              ></textarea>
            </div>

            <div className="form-group">
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="save-btn">
                {editingRestaurant ? "Save Changes" : "Add Restaurant/Bar"}
              </button>
              <button type="button" onClick={closeModal} className="cancel-btn">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default RestaurantManage;