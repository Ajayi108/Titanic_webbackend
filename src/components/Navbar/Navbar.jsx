import { useEffect, useRef, useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import "./Navbar.css";
import iceberggift from "../../assets/transhumanism.gif";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <header className="navbar" ref={menuRef}>
      <Link
        to="/"
        className="logo"
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <img src={iceberggift} alt="Iceberg Logo" className="icon-gift" />
        <div className="logo-box">
          <p className="logo-title">Iceberg-AI</p>
          <p className="logo-slogan">Predict. Survive. Learn.</p>
        </div>
      </Link>

      <div className="nav-arrows">
        <button
          onClick={() => navigate(-1)}
          className="arrow-btn"
          aria-label="Back"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => navigate(1)}
          className="arrow-btn"
          aria-label="Forward"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="hamburger" onClick={() => setMenuOpen((p) => !p)}>
        ☰
      </div>

      <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
        <Link to="/about">
          <p>About</p>
        </Link>
        <Link to="/courses">
          <p>Courses</p>
        </Link>
        <Link to="/calculator">
          <p>Prediction Calculator</p>
        </Link>

        {user ? (
          <>
            <p>Hello, {user.firstName}!</p>

            {/* Only show Admin Dashboard link for admin users */}
            {user.isAdmin && (
              <Link to="/admindashboard">
                <p>Admin Dashboard</p>
              </Link>
            )}

            <p onClick={logout} style={{ cursor: "pointer" }}>
              Logout
            </p>
          </>
        ) : (
          <>
            <Link to="/login">
              <p>Login</p>
            </Link>
            <Link to="/signup">
              <p>Sign Up</p>
            </Link>
          </>
        )}

        {/* For development only - remove before production */}
        {process.env.NODE_ENV === "development" && (
          <Link to="/admindashboard">
            <p className="dev-link">Dev Admin</p>
          </Link>
        )}
      </nav>
    </header>
  );
}
