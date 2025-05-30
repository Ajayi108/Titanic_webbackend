import React from 'react';
import './JoinUsSection.css';
import engineerImage from '../../assets/capita1.png'; 
 
const JoinUsSection = () => (
  <section className="join-us-section">
    <div className="join-us-container">
      <div className="join-us-left">
        <p className="join-us-statement">
          We don’t just take on projects—we take on possibilities. With brilliant minds and bold ideas, we push boundaries. Be part of the journey toward something greater.
        </p>
        <img
          src={engineerImage}
          alt="Engineer holding blueprints"
          className="join-us-image"
        />
      </div>

      <div className="join-us-right">
        <h2 className="join-us-title">
          Let’s Build the Future Together<br />
          Discover What You’re Capable Of
         </h2>
        <p className="join-us-text">
            Behind every line of code is a team of expert Machine Learning engineers, AI specialists, and software developers passionate about building smarter experiences. Their combined expertise brings ideas to life, crafting technology that’s both innovative and impactful.        </p>
        <p className="join-us-text">
            <strong >  Get ready to dive into the world of AI like never before! </strong>
            Our immersive web experience lets you uncover whether you would have survived the Titanic catastrophe—by tweaking real data and seeing AI in action. It’s more than just a simulation; it’s a powerful glimpse into the future of intelligent technology.
            Built by expert engineers and AI innovators, this tool blends history, data science, and discovery into one unforgettable journey. It’s fun, it’s educational, and it’s a bold preview of what you’ll master in our AI courses.
            Curious minds welcome. Start exploring, share the experience with friends, and be part of the AI-powered future.        </p>
        <div class ="join-us-button-container">
            <button className="join-us-button">Join Now</button>
             
        </div>
      </div>
    </div>
  </section>
);

export default JoinUsSection;