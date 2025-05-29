import "./About.css";

function About() {
  return (
    <div className="page-container">
      <h1>Welcome to IcebergAI</h1>

      <section className="section">
        <h2>Step Into the Story</h2>
        <p>
          Ever wondered what it might’ve been like aboard the Titanic? With IcebergAI,
          you can explore passenger profiles and uncover your own “what if” survival
          story—all while learning something new in the process.
        </p>
      </section>

      <section className="section">
        <h2>What You Can Explore</h2>
        <ul>
          <li>Experiment with different passenger backgrounds</li>
          <li>Discover how small choices affect big outcomes</li>
          <li>Track your own prediction history</li>
          <li>Try your hand at adjusting how the system thinks</li>
        </ul>
      </section>

      <section className="section">
        <h2>Why We Made This</h2>
        <p>
          This project grew from a course at TH Deggendorf, where we combined tech
          skills and curiosity to create something educational, thought-provoking,
          and fun to explore.
        </p>
      </section>

      <section className="section">
        <h2>Learn and Share</h2>
        <p>
          IcebergAI is also part of our course{" "}
          <strong>"Build and Deploy Web Apps with Intelligence"</strong>. Learn how
          to build apps that think, respond, and evolve. Try it out, share your
          results, and invite others to experience it too.
        </p>
        <blockquote>
          “Join the adventure, spread the word, and help others step into the story!”
          <br /> — Sam Altmaniac, Marketing Director
        </blockquote>
      </section>
    </div>
  );
}

export default About;
