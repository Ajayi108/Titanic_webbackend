import './Welcome.css';
import titanic from '../../assets/titanic.png';
import shot from '../../assets/shot-titanic.mp4';


function Welcome() {
  return (
    <div className="hero-container">
      <div className="hero-content">
        <h1>WOULD YOU HAVE SURVIVED?</h1>
        <p>Discover your fate on that fateful night through our AI-powered analysis of Titanic passenger data</p>
        <a href="/predictor" className="cta-button">TRY THE PREDICTOR</a>
      </div>

      
      
      
      <img src={titanic} alt='Titanic ship' className="titanic-silhouette" />

      {/* This part is designed to the video! */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="titanic"
      >
        <source src={shot} type="video/mp4" />
        Your browser does not support the video tag.
      </video>


    </div>
  );
}

export default Welcome;