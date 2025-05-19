import { Link } from 'react-router-dom';
import './Navbar.css';
import icebergLogo from '../../assets/iceberg.png';
import iceberggift from '../../assets/transhumanism.gif';
 
function Navbar() {
  return (
    <header className="navbar">
      <div className="logo">
        
        <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
        </Link>
        <img src={iceberggift} alt="Iceberg Logo"  className="icon-gift" />
         
        <div className='logo-box'>
 
            <p className='logo-title'> Iceberg-AI</p>
            <p className='logo-slogan'>Predict. Survive. Learn.</p>
        </div>

      </div>
      <nav className="nav-links">
 
        <Link to="/about"> <p> About</p> </Link>
        <Link to="/contact"> <p> Contact Info </p></Link>
        <Link to="/calculator"> <p> Prediction Calculator </p></Link>
      </nav>
    </header>
  );
}

export default Navbar;

