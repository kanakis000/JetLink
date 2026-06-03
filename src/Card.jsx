import React from "react";
import { useNavigate } from "react-router-dom";

function Card({ destination, title, text, image }) {
  const navigate = useNavigate();

  return (
    <button className="card" onClick={() => navigate(destination)}>
      <img className="card-image" src={image} alt={title} />
      <div className="card-content">
        <h2 className="card-title">{title}</h2>
        <p className="card-text">{text}</p>
      </div>
    </button>
  );
}

export default Card;
