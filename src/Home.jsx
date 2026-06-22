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
            <main className="body">
                <section className="home-section featured-section">
                    <div className="section-heading">
                        <span className="section-kicker">Featured</span>
                        <h2>Places to start your trip</h2>
                        <p>Explore a rotating selection of stays, restaurants, and bars across Crete.</p>
                    </div>
                    <RollerCoaster />
                </section>

                <section className="home-section destinations-section">
                    <div className="section-heading">
                        <span className="section-kicker">Destinations</span>
                        <h2>Choose your Crete escape</h2>
                        <p>Browse JetLink by region and find the right place for your next day or stay.</p>
                    </div>
                    <div className="card-section">
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
                    </div>
                </section>
            </main>
        </>
    );
};

export default Home;
