import { useState } from "react";
import { Routes, Route } from "react-router-dom";

// Global app-wide styles (variables, resets, shared layouts, navbar, hero, etc.)
import "./App.css";

// Shared UI components
import Layout from "./components/Layout/Layout";
import SignupInvitation from "./components/SignupInvitation/SignupInvitation";
import ServiceSlider from "./components/ServiceSlider/ServiceSlider";
import Welcome from "./components/Welcome/Welcome";
import PopularCourses from "./components/PopularCourses/PopularCourses";
import Statistics from "./components/Statistics/Statistics";
import JoinUsSection from "./components/JoinUsSection/JoinUsSection";
import Footer from "./components/Footer/Footer";

// Page components
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Courses from "./pages/Courses/Courses";
import CalculatorPage from "./pages/CalculatorPage/CalculatorPage";
import CourseDetails from "./pages/CourseDetails/CourseDetails"; // <-- Use the actual component
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";

function LandingPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="landing-container">
      <Welcome />
      <Statistics />
      <PopularCourses />
      <ServiceSlider />
      <JoinUsSection />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/calculator" element={<CalculatorPage />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/coursedetails" element={<CourseDetails />} />{" "}
        <Route path="/admindashboard" element={<AdminDashboard />} />
      </Route>
    </Routes>
  );
}

export default App;
