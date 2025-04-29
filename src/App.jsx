import { useState } from 'react'
import SignupInvitation from './components/SignupInvitation';
import './App.css'
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';

function LandingPage() {
  return (
    <div className="landing-container">
      <div className="hero-section">
        <h1 className="hero-title">Titanic Survival Predictor</h1>
        <p className="hero-subtitle">AI-Powered Historical Analysis</p>
        
        <div className='project-description'>  
          <p>
            Discover if you would have survived the legendary Titanic disaster with our 
            machine learning prediction tool. Description of the project , Description of the project,
            Description of the project, Description of the project. Description 
            of the project, 

          </p>
        </div>
      </div>

      <div className='features-section'>
        <h2 className="section-title"> Here will go our services and a title, we could show this using sliders, showing the services one by one</h2> 
        <ul className='features-grid'>
          <li className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Data Analysis</h3>
            <p>Comprehensive statistical breakdown of survival factors</p>
          </li>
          <li className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI Prediction</h3>
            <p>Accurate machine learning model trained on passenger data</p>
          </li>
          <li className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Sevicio2</h3>
            <p>Interactive charts showing survival probabilities</p>
          </li>
          <li className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Servicio3</h3>
            <p>Learn about the real passengers and their stories</p>
          </li> 
          <li className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Servicio4</h3>
            <p>Learn about the real passengers and their stories</p>
          </li> 
          <li className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Servicio6</h3>
            <p>Learn about the real passengers and their stories</p>
          </li> 

        </ul>  
      </div>
      <div className='Invitation'>
        <SignupInvitation />
      </div>
      
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;