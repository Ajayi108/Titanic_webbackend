import React, { useEffect, useState, useContext } from 'react';
import './Login.css';
import titanicVideo from '../../assets/shot-titanic.mp4';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export default function LoginPage() {
  const [fact, setFact] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState(null);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // fire a toast
  const showNotification = (message, type = 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const funFacts = [
    "The Titanic was the largest moving man-made object of its time.",
    "It took about 3 million rivets to hold the Titanic together.",
    "There were only 20 lifeboats on board, enough for half the passengers.",
    "The Titanic had its own onboard newspaper: 'Atlantic Daily Bulletin'.",
    "The ship broke in two pieces as it sank.",
    "The wreck was discovered in 1985, 73 years after it sank."
  ];

  useEffect(() => {
    setFact(funFacts[Math.floor(Math.random() * funFacts.length)]);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    //  No blanks
    if (!email.trim() || !password.trim()) {
      showNotification("Please fill in all fields", "error");
      return;
    }
    try {
      await login(email, password);
      showNotification("✅ Login successful", "success");
      navigate('/', { replace: true });
    } catch (err) {
      alert(err.response?.data?.detail || 'Login failed');
      showNotification(err.response?.data?.detail || 'Login failed', "error");
    }
  };

  return (
    <div className="login-container">
      {/* ——— Toast goes here ——— */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          <div className="notification-content">
            <span className="notification-icon">
              {notification.type === "success" ? "✓" : "!"}
            </span>
            <span className="notification-message">{notification.message}</span>
          </div>
          <div className="notification-progress"></div>
        </div>
      )}
      <video autoPlay muted loop className="background-video">
        <source src={titanicVideo} type="video/mp4" />
      </video>
      <div className="login-content">
        <form className="login-box" onSubmit={handleSubmit}>
          <h2>Sign in</h2>
          <input
            type="email"
            placeholder="Your email"
            className="login-input"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="login-input"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <div className="login-row">
            <label><input type="checkbox" /> Keep me signed in</label>
            <Link to="#" className="login-link">Forgot password?</Link>
          </div>
          <button type="submit" className="login-btn">Sign In</button>
          <p className="login-footer">
            Don't have an account? <Link to="/signup" className="login-link">Sign up</Link>
          </p>
        </form>
        <div className="fact-box">
          <h3>Did You Know?</h3>
          <p>{fact}</p>
        </div>
      </div>
    </div>
  );
}
