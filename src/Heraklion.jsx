import { useState, useEffect } from "react";
import { getHotelsByRegion } from "./services/hotelService";
import { getRestaurantsByRegion } from "./services/restaurantService";
import "./styles/Hotels.css";
import { Link } from "react-router-dom";

const Heraklion = () => {
    const [category, setCategory] = useState("hotels"); // 🏨 or 🍽️
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchData();
    }, [category, page]);

    const fetchData = async () => {
        try {
            if (category === "hotels") {
                const response = await getHotelsByRegion("heraklion", page, 5);
                setItems(response.data.hotels);
                setTotalPages(response.data.totalPages);
            } else {
                const response = await getRestaurantsByRegion("Heraklion", page, 5);
                setItems(response.data.restaurants_bars);
                setTotalPages(response.data.totalPages);
            }
        } catch (error) {
            console.error("❌ Error fetching data:", error);
        }
    };

    return (
        <div className="hotels-container">
            <h2 className="hotels-title">Explore Heraklion</h2>

            {/* 🔥 Switch between Hotels and Restaurants */}
            <div className="switch-category">
                <button
                    onClick={() => {
                        setCategory("hotels");
                        setPage(1);
                    }}
                    className={category === "hotels" ? "active" : ""}
                >
                    🏨 Hotels
                </button>
                <button
                    onClick={() => {
                        setCategory("restaurants-bars");
                        setPage(1);
                    }}
                    className={category === "restaurants-bars" ? "active" : ""}
                >
                    🍽️ Restaurants & Bars
                </button>
            </div>

            {/* ✅ List hotels or restaurants */}
            {items && items.length === 0 ? (
    <p className="no-hotels">No results found.</p>
) : (
    <div className="hotel-list">
        {items && items.map((item) => (
            <Link
                key={item.id}
                to={
                    category === "hotels"
                        ? `/hotels/${item.id}`
                        : `/restaurants-bars/${item.id}`
                }
                className="hotel-card"
                style={{ textDecoration: "none", color: "inherit" }}
            >
                {item.image && (
                    <img
                        src={`http://localhost:5000/uploads/${item.image}`}
                        alt={item.name}
                        className="hotel-image"
                    />
                )}
                <h3 className="hotel-name">{item.name}</h3>
                <p className="hotel-type">
                    ⭐ {category === "hotels" ? item.type : item.category}
                </p>
                {category === "hotels" && (
                    <p className="truncate-description">{item.description}</p>
                )}
            </Link>
        ))}
    </div>
)}


            {/* ✅ Pagination */}
            <div className="pagination">
                <button disabled={page === 1} onClick={() => setPage(page - 1)}>⬅ Previous</button>
                <span> Page {page} of {totalPages} </span>
                <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next ➡</button>
            </div>
        </div>
    );
};

export default Heraklion;
