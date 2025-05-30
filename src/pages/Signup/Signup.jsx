import React, { useEffect, useState } from 'react';
import './Signup.css';
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
    <div className="signup-container">
      <video autoPlay muted loop className="signup-background-video">
        <source src={titanicVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="signup-content">
        <div className="signup-box">
          <h2>Create Account</h2>
          <input type="text" placeholder="First name" className="signup-input" />
          <input type="text" placeholder="Last name" className="signup-input" />
          <input type="email" placeholder="Email address" className="signup-input" />
          <input type="password" placeholder="Password" className="signup-input" />
          <input type="password" placeholder="Confirm password" className="signup-input" />
          <button className="signup-btn">Sign Up</button>
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
