import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./styles/ManageMenu.css";
import { getMenu, addMenu, updateMenu, deleteMenu } from "./services/menuService";

const ManageMenu = () => {
  const { restaurantId } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Food",
    image: null,
  });

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await getMenu(restaurantId);
      setMenuItems(res.data);
    } catch (err) {
      console.error("❌ Error fetching menu:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value ?? ""); 
    });
    
    data.append("restaurant_id", restaurantId);

    try {
      if (editingId) {
        await updateMenu(editingId, data);
      } else {
        await addMenu(data);
      }
      fetchMenu();
      resetForm();
    } catch (err) {
      console.error("❌ Error submitting form:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await deleteMenu(id);
      fetchMenu();
    } catch (err) {
      console.error("❌ Error deleting item:", err);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image: null,
    });
    setEditingId(item.id);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "Food",
      image: null,
    });
    setEditingId(null);
    setShowModal(false);
  };

  return (
    <div className="menu-manage-container">
      <h2>Manage Menu</h2>

      <form onSubmit={handleSubmit} className="menu-form">
        <input name="name" placeholder="Item name" value={formData.name} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} />
        <input name="price" type="number" placeholder="Price" value={formData.price} onChange={handleChange} required />
        <select name="category" value={formData.category} onChange={handleChange}>
          <option value="Food">Food</option>
          <option value="Drink">Drink</option>
        </select>
        <input type="file" name="image" accept="image/*" onChange={handleChange} />
        <button type="submit">{editingId ? "Update Item" : "Add Item"}</button>
      </form>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingId ? "Edit Menu Item" : "Add New Item"}</h3>
            <form onSubmit={handleSubmit} className="restaurant-form">
              <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
              <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
              <input name="price" type="number" value={formData.price} onChange={handleChange} placeholder="Price" required />
              <select name="category" value={formData.category} onChange={handleChange}>
                <option value="Food">Food</option>
                <option value="Drink">Drink</option>
              </select>
              <input type="file" name="image" accept="image/*" onChange={handleChange} />
              <div className="form-actions">
                <button type="submit" className="save-btn">Save</button>
                <button type="button" className="cancel-btn" onClick={resetForm}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="menu-items-list">
        {menuItems.map((item) => (
          <div key={item.id} className="menu-item-card">
            {item.image && <img src={`http://localhost:5000/uploads/${item.image}`} alt={item.name} />}
            <h4>{item.name}</h4>
            <p className="menu-description">{item.description}</p>
            <p>{item.category}</p>
            <p>💰 {item.price}€</p>
            <div>
              <button className="menu-action-btn menu-edit" onClick={() => handleEdit(item)}>Edit</button>
              <button className="menu-action-btn menu-delete" onClick={() => handleDelete(item.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageMenu;
