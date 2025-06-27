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
    if (!isValidEmail(form.email)) {
      alert("Please enter a valid email address");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await register(form.email, form.password, form.firstName, form.lastName);
      alert("✅ Signup successful");
      navigate('/login');
    } catch (error) {
      alert(`❌ ${error?.response?.data?.detail || 'Signup failed'}`);
    }
  };


  return (
    <div className="signup-container">
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
