import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopImageSrc from "./assets/TopImage.png";
import { getAllHotels } from "./services/hotelService";
import { getAllRestaurants } from "./services/restaurantService";

function TopImage() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [allData, setAllData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const hotelsRes = await getAllHotels();
        const restaurantsRes = await getAllRestaurants();
        setAllData([...hotelsRes.data, ...restaurantsRes.data]);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  const handleSearch = () => {
    const trimmedQuery = searchQuery.trim().toLowerCase();
    if (!trimmedQuery) return;

    const match = allData.find(item => item.name.toLowerCase() === trimmedQuery);
    if (match) {
      const type = match.room_count !== undefined ? "hotels" : "restaurants-bars";
      navigate(`/${type}/${match.id}`);
    } else {
      alert("No match found!");
    }
  };

  return (
    <div className="top-image-container">
      <img src={TopImageSrc} alt="Beautiful Scenery" className="top-image" />

      <div className="jetlink-text">JetLink</div>

      

      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Search here..."
          className="search-bar"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button className="search-button" onClick={handleSearch}>🔍</button>
      </div>
    </div>
  );
}

export default TopImage;
