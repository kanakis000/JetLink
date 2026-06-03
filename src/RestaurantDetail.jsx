import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRestaurantById } from "./services/restaurantService";
import { getMenu } from "./services/menuService";
import "./styles/RestaurantDetail.css";

const RestaurantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await getRestaurantById(id);
        setRestaurant(response.data);

        const menuResponse = await getMenu(id);
        setMenuItems(menuResponse.data);
      } catch (err) {
        setError("Restaurant not found.");
      }
    };
    fetchRestaurant();
  }, [id]);

  if (error) {
    return <div className="restaurant-detail-container"><p>{error}</p></div>;
  }

  if (!restaurant) {
    return <div className="restaurant-detail-container"><p>Loading...</p></div>;
  }

  return (
    <div className="restaurant-detail-container">
      <button className="back-button" onClick={() => navigate(-1)}>← Back</button>

      <div className="restaurant-banner">
        <img src={`http://localhost:5000/uploads/${restaurant.image}`} alt={restaurant.name} />
      </div>

      <h1 className="restaurant-name">{restaurant.name}</h1>
      <p className="restaurant-region">📍 {restaurant.region}</p>

      <div className="restaurant-types">
        {restaurant.type && restaurant.type.split(',').map((t) => (
          <span key={t} className="type-chip">
            {t.trim() === 'Restaurant' && '🍽️ '}
            {t.trim() === 'Bar' && '🍹 '}
            {t.trim() === 'Cafe' && '☕ '}
            {t.trim() === 'Club' && '🎶 '}
            {t.trim()}
          </span>
        ))}
      </div>

      <p className="restaurant-description">{restaurant.description}</p>

      {menuItems.length > 0 && (
        <div className="restaurant-menu-section">
          <h2>Menu</h2>
          <div className="menu-items-grid">
            {menuItems.map((item) => (
              <div key={item.id} className="menu-card">
                {item.image && (
                  <img src={`http://localhost:5000/uploads/${item.image}`} alt={item.name} />
                )}
                <h4>{item.name}</h4>
                <p className="menu-description">{item.description}</p>
<p className="menu-category">{item.category}</p>
<p className="menu-price">💰 {item.price}€</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetail;
