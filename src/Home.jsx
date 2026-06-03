import React from "react";
import TopImage from "./TopImage.jsx";
import './styles/Home.css';
import Card from "./Card.jsx";
import RollerCoaster from "./RollerCoaster";
import heraklionImg from "./assets/heraklion.png";
import chaniaImg from "./assets/chania.png";
import rethymnoImg from "./assets/rethymno.png";



const Home = () => {
    return (
        <>
            <TopImage />
            <RollerCoaster />
            <main className="body">
                <section className="card-section">
                    <Card
                        destination="/Heraklion"
                        title="Heraklion"
                        text="Discover the capital of Crete."
                        image={heraklionImg}
                    />
                    <Card
                        destination="/Chania"
                        title="Chania"
                        text="Explore the charming old town."
                        image={chaniaImg}
                    />
                    <Card
                        destination="/Rethymno"
                        title="Rethymno"
                        text="Experience history and beaches."
                        image={rethymnoImg}
                    />
                </section>
            </main>
        </>
    );
};

export default Home;
