import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

import Navbar from './components/Navbar';
import SignupInvitation from './components/SignupInvitation';
import ServiceSlider from './components/ServiceSlider';

import Login from './pages/Login';
import About from './pages/About';
import Contact from './pages/Contact';

function LandingPage() {
  const [showModal, setShowModal] = useState(false);

  const services = [
    {
      icon: "📊",
      title: "Data Analysis",
      description: "Comprehensive statistical breakdown of survival factors"
    },
    {
      icon: "🤖",
      title: "AI Prediction",
      description: "Accurate machine learning model trained on passenger data"
    },
    {
      icon: "📈",
      title: "Service 2",
      description: "Interactive charts showing survival probabilities"
    },
    {
      icon: "🔍",
      title: "Service 3",
      description: "Explore passengers' real stories and survival rates"
    },
    {
      icon: "📚",
      title: "Service 4",
      description: "Educational resources for historical and data context"
    },
    {
      icon: "🔄",
      title: "Service 5",
      description: "Dynamic comparisons across classes, gender, age, etc."
    }
  ];

  return (
    <div className="landing-container">
      <Navbar />

      <section className="hero-section">
        {/* Starry Background Animation */}
        <div className="starry-hero">
          {Array.from({ length: 80 }).map((_, i) => (
            <div
              key={i}
              className="star"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        <h1 className="hero-title">Titanic Survival Predictor</h1>
        <p className="hero-subtitle">AI-Powered Historical Analysis</p>

        <div className="ship-animation-wrapper">
          <img src="/src/assets/ship.png" alt="Titanic Ship" className="ship" />
          <div className="wave"></div>
        </div>

        <div className="project-description">
          <p>
            Discover if you would have survived the legendary Titanic disaster with our
            machine learning prediction tool. Explore real passenger data, learn about
            survival factors, and engage with interactive visualizations.
          </p>
        </div>
      </section>

      <ServiceSlider services={services} />

      <div className="Invitation">
        <SignupInvitation onSignupClick={() => setShowModal(true)} />
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <button className="close-button" onClick={() => setShowModal(false)}>✖</button>
              <h2>Sign Up</h2>
              <form className="signup-form">
                <input type="text" placeholder="Full Name" required />
                <input type="email" placeholder="Email" required />
                <input type="password" placeholder="Password" required />
                <button type="submit">Create Account</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
}

export default App;
