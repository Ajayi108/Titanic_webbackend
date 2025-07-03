import React, { useEffect, useState , useContext} from 'react';
import './Signup.css';
import titanicVideo from '../../assets/shot-titanic.mp4';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';


const funFacts = [
  "The Titanic was the largest moving man-made object of its time.",
  "It took about 3 million rivets to hold the Titanic together.",
  "There were only 20 lifeboats on board, enough for half the passengers.",
  "The Titanic had its own onboard newspaper: 'Atlantic Daily Bulletin'.",
  "The ship broke in two pieces as it sank.",
  "The wreck was discovered in 1985, 73 years after it sank."
];

export default function SignupPage() {
  const { register } = useContext(AuthContext);
  const [currentFact, setCurrentFact] = useState('');
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [notification, setNotification] = useState(null);
  const showNotification = (message, type = 'error') => {
    setNotification({ message, type });
    // auto-dismiss after 5s
    setTimeout(() => setNotification(null), 5000);
  };

    
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentFact(funFacts[Math.floor(Math.random() * funFacts.length)]);
  }, []);

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    //Make sure no field is empty
    if (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.email.trim() ||
      !form.password.trim() ||
      !form.confirmPassword.trim()
    ) {
      showNotification("Please fill in all fields", "error");
      return;
    }

    // email‐format check
    if (!isValidEmail(form.email)) {
      showNotification("Please enter a valid email address", "error");
      return;
    }

    if (form.password !== form.confirmPassword) {
      showNotification("Passwords do not match", "error");
      return;
    }

    try {
      await register(form.email, form.password, form.firstName, form.lastName);
        showNotification("✅ Signup successful", "success");
      navigate('/login');
    } catch (error) {
      showNotification(`❌ ${error?.response?.data?.detail || 'Signup failed'}`, "error");
    }
  };


  return (
    <div className="signup-container">
      {notification && (
        <div className={`notification ${notification.type}`}>
          <div className="notification-content">
            <span className="notification-icon">
              {notification.type === "success" ? "✓" : notification.type === "error" ? "!" : "⚠️"}
            </span>
            <span className="notification-message">
              {notification.message}
            </span>
          </div>
        <div className="notification-progress"></div>
      </div>
      )}
      <video autoPlay muted loop className="signup-background-video">
        <source src={titanicVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="signup-content">
        <div className="signup-box">
          <h2>Create Account</h2>
          <input
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            placeholder="First name"
            className="signup-input"
          />
          <input
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            placeholder="Last name"
            className="signup-input"
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email address"
            className="signup-input"
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="signup-input"
          />
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm password"
            className="signup-input"
          />
          <button className="signup-btn" onClick={handleSubmit}>Sign Up</button>
          <p className="signup-footer">
            Already have an account? <Link to="/login" className="signup-link">Sign in</Link>
          </p>
        </div>

        <div className="signup-fact-box">
          <h3>Did You Know?</h3>
          <p>{currentFact}</p>
        </div>
      </div>
    </div>
  );
}
