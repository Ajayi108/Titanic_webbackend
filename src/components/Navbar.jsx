import { Link } from 'react-router-dom';
import '../App.css';

function Navbar() {
  return (
    <header className="navbar">
      <div className="logo">
        <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
          🚢 TitanicAI
        </Link>
      </div>
      <nav className="nav-links">
        <Link to="/about">About Us</Link>
        <Link to="/contact">Contact Info</Link>
        <Link to="/calculator">Prediction Calculator</Link>
      </nav>
    </header>
  );
}

export default Navbar;

