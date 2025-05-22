import { useState } from "react";
import { Routes, Route } from "react-router-dom";

// Global app-wide styles (variables, resets, shared layouts, navbar, hero, etc.)
import "./App.css";

// Shared UI components
import Layout from "./components/Layout/Layout";
import SignupInvitation from "./components/SignupInvitation/SignupInvitation";
import ServiceSlider from "./components/ServiceSlider/ServiceSlider";
import Welcome from "./components/Welcome/Welcome";
//page components
import Login from "./pages/Login/Login";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Courses from "./pages/Courses/Courses";
import CalculatorPage from "./pages/CalculatorPage/CalculatorPage";

function LandingPage() {
  const [showModal, setShowModal] = useState(false);
  // Data fed into the ServiceSlider component
  const services = [
    {
      icon: "📊",
      title: "Data Analysis",
      description: "Comprehensive statistical breakdown of survival factors",
    },
    {
      icon: "🤖",
      title: "AI Prediction",
      description: "Accurate machine learning model trained on passenger data",
    },
    {
      icon: "📈",
      title: "Service 2",
      description: "Interactive charts showing survival probabilities",
    },
    {
      icon: "🔍",
      title: "Service 3",
      description: "Explore passengers' real stories and survival rates",
    },
    {
      icon: "📚",
      title: "Service 4",
      description: "Educational resources for historical and data context",
    },
    {
      icon: "🔄",
      title: "Service 5",
      description: "Dynamic comparisons across classes, gender, age, etc.",
    },
  ];

  return (
    <div className="landing-container">
      {
        <Welcome /> /* The previous 'Welcome' section code was converted to a component, please go to components/Welcome/Welcome.jsx */
      }
      <ServiceSlider services={services} />
      <div className="Invitation">
        <SignupInvitation onSignupClick={() => setShowModal(true)} />
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <button
                className="close-button"
                onClick={() => setShowModal(false)}
              >
                ✖
              </button>
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
      <Route element={<Layout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/calculator" element={<CalculatorPage />} />
        <Route path="/courses" element={<Courses />} />
      </Route>
    </Routes>
  );
}

export default App;
