import { useState, useEffect } from "react";
import { getHotelsByRegion } from "./services/hotelService";
import { getRestaurantsByRegion } from "./services/restaurantService";
import "./styles/Hotels.css";
import { Link } from "react-router-dom";

const Chania = () => {
    const [category, setCategory] = useState("hotels"); // hotels or restaurants-bars
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchItems(page, category);
    }, [page, category]);

    const fetchItems = async (page, category) => {
        try {
            if (category === "hotels") {
                const response = await getHotelsByRegion("chania", page, 5);
                setItems(response.data.hotels);
                setTotalPages(response.data.totalPages);
            } else {
                const response = await getRestaurantsByRegion("Chania", page, 5);
                setItems(response.data.restaurants_bars);
                setTotalPages(response.data.totalPages);
            }
        } catch (error) {
            console.error("❌ Error fetching items:", error);
        }
    };

    return (
        <div className="hotels-container">
            <h2 className="hotels-title">Explore Chania</h2>

            <div style={{ marginBottom: "20px" }}>
                <button onClick={() => { setCategory("hotels"); setPage(1); }}>🏨 Hotels</button>
                <button onClick={() => { setCategory("restaurants-bars"); setPage(1); }} style={{ marginLeft: "10px" }}>🍴 Restaurants & Bars</button>
            </div>

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

            <div className="pagination">
                <button disabled={page === 1} onClick={() => setPage(page - 1)}>⬅ Previous</button>
                <span> Page {page} of {totalPages} </span>
                <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next ➡</button>
            </div>
        </div>
    );
};

export default Chania;
