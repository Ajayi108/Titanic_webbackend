import React from 'react';
import './JoinUsSection.css';
import promoVideo from '../../assets/shot-titanic.mp4';

const JoinUsSection = () => (
  <section className="join-us-section">
    <div className="cyber-grid-overlay"></div>
    
    <div className="join-us-container">
      <div className="video-column">
        <div className="video-frame">
          <video
            className="cyber-video"
            src={promoVideo}
            autoPlay
            loop
            muted
            playsInline
          />
          <div className="video-glowing-border"></div>
        </div>
      </div>
      
      <div className="content-column">
        <h2 className="cyber-title">
          <span className="glowing-text">Let's Build</span>
          <span className="glowing-text-accent">The Future</span>
          <span className="glowing-text">Together</span>
        </h2>
        
        <div className="content-grid">
          <div className="cyber-card">
            <h3 className="card-title">Push Boundaries</h3>
            <p className="card-text">
              We don't just take on projects—we take on possibilities. With brilliant minds and bold ideas.
            </p>
          </div>
          
          <div className="cyber-card accent">
            <h3 className="card-title">AI Specialists</h3>
            <p className="card-text">
              Machine Learning engineers crafting technology that's both innovative and impactful.
            </p>
          </div>
        </div>
        
        <div className="highlight-box">
          <div className="pulse-dot"></div>
          <p>
            <strong>Immersive AI Experience:</strong> Discover if you'd survive Titanic by tweaking real data and seeing AI predictions in action.
          </p>
        </div>
        
        <a href='/Signup' className="cyber-button">
        
          <span>Join Our Crew</span>
          <div className="button-lights">
            <span className="light blue"></span>
            <span className="light teal"></span>
          </div>
        </a>
      </div>
    </div>
  </section>
);

export default JoinUsSection;