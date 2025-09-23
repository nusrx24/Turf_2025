import React, { useState } from "react";
import TurfResult from "../common/TurfResult ";
import TurfSearch from "../common/TurfSearch";
import './HomePage.css';

const HomePage = () => {
    const [turfSearchResults, setTurfSearchResults] = useState([]);

    const handleSearchResult = (results) => {
        setTurfSearchResults(results);
    };

    return (
        <div className="home">
            {/* HEADER / BANNER SECTION */}
            <section>
                <header className="header-banner">
                    <img 
                        src="./assets/images/main-turf.jpg" 
                        alt="Turf Management" 
                        className="header-image" 
                    />
                    <div className="overlay"></div>
                    <div className="animated-texts overlay-content">
                        <h1>
                            Welcome to <span className="turf-color">Turf Management</span>
                        </h1>
                        <h3>Book your perfect playing field with ease</h3>
                    </div>
                </header>
            </section>

            {/* SEARCH/FIND AVAILABLE TURF SECTION */}
            <div className="container section-spacing">
                <TurfSearch handleSearchResult={handleSearchResult} />
                <TurfResult turfSearchResults={turfSearchResults} />
            </div>

            <h4>
                <a className="view-turfs-home" href="/turfs">
                    View All Turfs
                </a>
            </h4>

            <h2 className="home-services">
                Services at <span className="turf-color">Our Facility</span>
            </h2>

            {/* SERVICES SECTION */}
            <section className="service-section">
                <div className="service-card">
                    <img 
                        src="./assets/images/equipment.jpeg" 
                        alt="Sports Equipment Rental" 
                    />
                    <div className="service-details">
                        <h3 className="service-title">Equipment Rental</h3>
                        <p className="service-description">
                            Get access to quality sports equipment for various games 
                            including football, cricket, and more.
                        </p>
                    </div>
                </div>
                
                <div className="service-card">
                    <img 
                        src="./assets/images/lighting.jpeg" 
                        alt="Flood Lighting" 
                    />
                    <div className="service-details">
                        <h3 className="service-title">Flood Lighting</h3>
                        <p className="service-description">
                            Enjoy extended playing hours with our professional flood 
                            lighting for evening matches and events.
                        </p>
                    </div>
                </div>
                
                <div className="service-card">
                    <img 
                        src="./assets/images/locker.jpeg" 
                        alt="Locker Rooms" 
                    />
                    <div className="service-details">
                        <h3 className="service-title">Locker Rooms</h3>
                        <p className="service-description">
                            Clean and secure locker rooms with shower facilities 
                            available for all players.
                        </p>
                    </div>
                </div>
                
                <div className="service-card">
                    <img 
                        src="./assets/images/refreshments.jpeg" 
                        alt="Refreshments" 
                    />
                    <div className="service-details">
                        <h3 className="service-title">Refreshments</h3>
                        <p className="service-description">
                            Stay energized with our on-site cafe offering drinks, 
                            snacks, and sports nutrition.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default HomePage;