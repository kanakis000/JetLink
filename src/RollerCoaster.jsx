import React, { useEffect, useState } from "react";
import { getAllHotels } from "./services/hotelService";
import { getAllRestaurants } from "./services/restaurantService";
import "./styles/RollerCoaster.css";

const RollerCoaster = () => {
  const [hotels, setHotels] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [currentHotelIndex, setCurrentHotelIndex] = useState(0);
  const [currentRestaurantIndex, setCurrentRestaurantIndex] = useState(0);
  const [fadeKey, setFadeKey] = useState(0); // triggers animation restart

  useEffect(() => {
    const fetchData = async () => {
      try {
        const hotelsRes = await getAllHotels();
        const restaurantsRes = await getAllRestaurants();
        setHotels(hotelsRes.data);
        setRestaurants(restaurantsRes.data);
      } catch (err) {
        console.error("Error fetching rollercoaster data:", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHotelIndex((prev) => (hotels.length > 0 ? (prev + 1) % hotels.length : 0));
      setCurrentRestaurantIndex((prev) =>
        restaurants.length > 0 ? (prev + 1) % restaurants.length : 0
      );
      setFadeKey((prev) => prev + 1); // triggers animation re-run
    }, 4000);

    return () => clearInterval(interval);
  }, [hotels, restaurants]);

  const currentHotel = hotels[currentHotelIndex];
  const currentRestaurant = restaurants[currentRestaurantIndex];

  return (
    <div className="roller-section">
      {currentHotel && (
        <div key={`hotel-${fadeKey}`} className="roller-card active">
          <img src={`http://localhost:5000/uploads/${currentHotel.image}`} alt={currentHotel.name} />
          <div className="roller-info">
            <span className="roller-label">Hotel</span>
            <h3>{currentHotel.name}</h3>
            <p>{currentHotel.region}</p>
          </div>
        </div>
      )}

      {currentRestaurant && (
        <div key={`restaurant-${fadeKey}`} className="roller-card active">
          <img src={`http://localhost:5000/uploads/${currentRestaurant.image}`} alt={currentRestaurant.name} />
          <div className="roller-info">
            <span className="roller-label">Restaurant & Bar</span>
            <h3>{currentRestaurant.name}</h3>
            <p>{currentRestaurant.region}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RollerCoaster;
