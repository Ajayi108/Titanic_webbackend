import "./About.css";

function About() {
  return (
    <div className="page-container">
      <h1>About Us</h1>

      <section className="section">
        <h2>Our Mission</h2>
        <p>
          {" "}
          IcebergAI is an interactive web application powered by cutting-edge
          machine learning technology. Our goal is to educate and engage users
          by letting them explore survival predictions from the Titanic disaster
          based on real passenger data.
        </p>
      </section>

      <section className="section">
        <h2>What You Can Do</h2>
        <ul>
          <li>Experiment with different passenger characterisitcs</li>
          <li>See real-time AI predictions for survival chances</li>
          <li>View personalized prediction histories</li>
          <li>Train your own models</li>
        </ul>
      </section>

      <section className="section">
        <h2>Why We Built This</h2>
        <p>
          This project is part of a software engineering practical course at TH
          Deggendorf. It demonstrates how modern AI can be integrated into
          full-stack web applications to solve real-world problems.
        </p>
      </section>

      <section className="section">
        <h2>Learn AI with Us</h2>
        <p>
          IcebergAI also serves as a promotional showcase for our online course:
          <strong> "Build and Deploy AI-Powered Web Applications" </strong>.
          Learn how to preprocess data, train models, and integrate them into
          production-ready apps.
        </p>
      </section>
      <p>
        This project predicts Titanic survival chances using machine learning.
      </p>
    </div>
  );
}

export default About;
