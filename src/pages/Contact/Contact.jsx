import { Mail, Twitter, Linkedin } from "lucide-react";
import "./Contact.css";

function Contact() {
  return (
    <div className="contact-container">
      <h1>Let’s Get in Touch</h1>
      <p>Have a question, idea, or just want to say hi? We’d love to hear from you!</p>

      <div className="contact-card">
        <Mail size={20} />
        <a href="mailto:icebergai@titanic.com">icebergai@titanic.com</a>
      </div>

      <div className="social-links">
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
          <Twitter size={20} /> Twitter
        </a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
          <Linkedin size={20} /> LinkedIn
        </a>
      </div>

      <form className="contact-form">
        <label>
          Your Email
          <input type="email" placeholder="you@example.com" required />
        </label>
        <label>
          Message
          <textarea placeholder="Write us a message..." required></textarea>
        </label>
        <button type="submit">Send Message</button>
      </form>
    </div>
  );
}

export default Contact;
