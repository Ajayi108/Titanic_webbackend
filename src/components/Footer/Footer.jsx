import React from 'react';
import './Footer.css';
import { FaTwitter, FaGithub, FaLinkedin, FaCalculator, FaInfoCircle, FaShip, FaChartLine, FaBrain } from 'react-icons/fa';
import iceberggif from "../../assets/transhumanism.gif";

const Footer = () => {
  return (
    <footer className="cyber-footer">
      <div className="holographic-line"></div>
      
      <div className="footer-container">
        {/* Animated Brand Section */}
        <div className="brand-section">
          <div className="gif-container">
            <img src={iceberggif} alt="Iceberg AI animated logo" className="brand-gif" />
            <div className="gif-overlay"></div>
          </div>
          <div className="brand-text">
            <h2 className="cyber-logo">
              <span className="logo-part">ICE</span>
              <span className="logo-part-accent">BERG</span>
              <span className="logo-part">-AI</span>
            </h2>
            <p className="cyber-slogan">PREDICT. <span className="slogan-accent">SURVIVE.</span> LEARN.</p>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="footer-grid">
          {/* Navigation Section */}
          <div className="footer-section">
            <h3 className="section-title">
              <FaBrain className="title-icon" />
              NAVIGATION
            </h3>
            <ul className="cyber-links">
              <li>
                <a href="/Courses">
                  <FaCalculator className="link-icon pulse" />
                  <span>Our Courses</span>
                  <div className="link-hover"></div>
                </a>
              </li>
              <li>
                <a href="/calculator">
                  <FaShip className="link-icon pulse" />
                  <span>Predictanic</span>
                  <div className="link-hover"></div>
                </a>
              </li>
              <li>
                <a href="/about">
                  <FaInfoCircle className="link-icon pulse" />
                  <span>About Project</span>
                  <div className="link-hover"></div>
                </a>
              </li>
              <li>
                <a href="#">
                  <FaChartLine className="link-icon pulse" />
                  <span>AI Research</span>
                  <div className="link-hover"></div>
                </a>
              </li>
            </ul>
          </div>

          {/* Social & Contact */}
          <div className="footer-section">
            <h3 className="section-title">
              <div className="signal-bars">
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
              </div>
              CONNECT
            </h3>
            <div className="social-grid">
              <a href="https://mygit.th-deg.de/schober-teaching/student-projects/ain-23-software-engineering/ss-25/IcebergAI" className="social-item twitter">
                <FaTwitter className="social-icon" />
                <span>Twitter</span>
              </a>
              <a href="https://mygit.th-deg.de/schober-teaching/student-projects/ain-23-software-engineering/ss-25/IcebergAI" className="social-item github">
                <FaGithub className="social-icon" />
                <span>GitLab</span>
              </a>
              <a href="https://mygit.th-deg.de/schober-teaching/student-projects/ain-23-software-engineering/ss-25/IcebergAI" className="social-item linkedin">
                <FaLinkedin className="social-icon" />
                <span>LinkedIn</span>
              </a>
              <a href="/Contact" className="social-item email">
                <div className="email-icon">
                  <div className="envelope"></div>
                </div>
                <span>Contact</span>
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div className="footer-section">
            <h3 className="section-title">
              <div className="radar">
                <div className="radar-sweep"></div>
              </div>
              UPDATES
            </h3>
            <p className="newsletter-desc">Get AI insights directly to your inbox</p>
            <form className="cyber-form">
              <div className="input-container">
                <input type="email" placeholder="YOUR@EMAIL.COM" required />
                <div className="input-border"></div>
              </div>
              <button type="submit" className="cyber-button">
                SUBSCRIBE
                <div className="button-lights">
                  <span className="light blue"></span>
                  <span className="light teal"></span>
                </div>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="scanline"></div>
        <div className="bottom-content">
          <p className="copyright">© {new Date().getFullYear()} ICEBERG-AI SYSTEMS</p>
          <div className="legal-links">
            <a href="https://mygit.th-deg.de/schober-teaching/student-projects/ain-23-software-engineering/ss-25/IcebergAI">PRIVACY</a>
            <a href="https://mygit.th-deg.de/schober-teaching/student-projects/ain-23-software-engineering/ss-25/IcebergAI">TERMS</a>
            <a href="https://mygit.th-deg.de/schober-teaching/student-projects/ain-23-software-engineering/ss-25/IcebergAI">COOKIES</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;