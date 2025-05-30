import React, { useEffect, useState } from 'react';
import './Login.css';
import titanicVideo from '../../assets/shot-titanic.mp4';
import { Link } from 'react-router-dom';


const funFacts = [
  "The Titanic was the largest moving man-made object of its time.",
  "It took about 3 million rivets to hold the Titanic together.",
  "There were only 20 lifeboats on board, enough for half the passengers.",
  "The Titanic had its own onboard newspaper: 'Atlantic Daily Bulletin'.",
  "The ship broke in two pieces as it sank.",
  "The wreck was discovered in 1985, 73 years after it sank."
];

export default function LoginPage() {
  const [currentFact, setCurrentFact] = useState('');

  useEffect(() => {
    // Pick a random fact on load
    setCurrentFact(funFacts[Math.floor(Math.random() * funFacts.length)]);
  }, []);

  return (
    <div className="login-container">
      <video autoPlay muted loop className="background-video">
        <source src={titanicVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="login-content">
        <div className="login-box">
          <h2>Sign in</h2>
          <input type="email" placeholder="Your email" className="login-input" />
          <input type="password" placeholder="Password" className="login-input" />
          <div className="login-row">
            <label><input type="checkbox" /> Keep me signed in</label>
            <a href="#" className="login-link">Forgot password?</a>
          </div>
          <button className="login-btn">Sign In</button>
          <p className="login-footer">
            Don't have an account? <Link to="/Signup" className="login-link">Sign up</Link>
          </p>
        </div>

        <div className="fact-box">
          <h3>Did You Know?</h3>
          <p>{currentFact}</p>
        </div>
      </div>
    </div>
  );
}
