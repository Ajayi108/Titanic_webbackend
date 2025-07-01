import { useState } from "react";
import { Routes, Route } from "react-router-dom";

// Global app-wide styles
import "./App.css";

// Shared UI components
import Layout from "./components/Layout/Layout";
import Welcome from "./components/Welcome/Welcome";
import ServiceSlider from "./components/ServiceSlider/ServiceSlider";
import PopularCourses from "./components/PopularCourses/PopularCourses";
import Statistics from "./components/Statistics/Statistics";
import JoinUsSection from "./components/JoinUsSection/JoinUsSection";
import Footer from "./components/Footer/Footer";

// Pages
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Courses from "./pages/Courses/Courses";
import CourseDetails from "./pages/CourseDetails/CourseDetails";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import RequireAdmin from "./components/Auth/RequireAdmin";

// Conditional calculator route handler
import CalculatorRedirect from "./pages/CalculatorRedirect"; // ✅ new component

function LandingPage() {
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
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/coursedetails" element={<CourseDetails />} />
        import RequireAdmin from "./components/Auth/RequireAdmin"; // ...
        <Route
          path="/admindashboard"
          element={
            <RequireAdmin>
              <AdminDashboard />
            </RequireAdmin>
          }
        />
        <Route path="/calculator" element={<CalculatorRedirect />} />{" "}
        {/* ✅ auto-switch */}
      </Route>
    </Routes>
  );
}

export default App;
