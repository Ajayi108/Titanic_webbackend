import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import iceberggift from "../../assets/transhumanism.gif";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();
  const location = useLocation();

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <header className="navbar" ref={menuRef}>
      <Link to="/" className="logo" style={{ textDecoration: "none", color: "inherit" }}>
        <img src={iceberggift} alt="Iceberg Logo" className="icon-gift" />
        <div className="logo-box">
          <p className="logo-title">Iceberg-AI</p>
          <p className="logo-slogan">Predict. Survive. Learn.</p>
        </div>
      </Link>


      <div className="hamburger" onClick={() => setMenuOpen((prev) => !prev)}>
        ☰
      </div>

      <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
        <Link to="/about"><p>About</p></Link>
        <Link to="/contact"><p>Contact Info</p></Link>
        <Link to="/calculator"><p>Prediction Calculator</p></Link>
        <Link to="/courses"><p>Courses</p></Link>
        <Link to="/Login"><p>Login</p></Link>
        <Link to="/Signup"><p>Create an Account</p></Link>
      </nav>
    </header>
  );
}

export default Navbar;
