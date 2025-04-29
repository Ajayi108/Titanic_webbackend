import { useState } from 'react'
import SignupInvitation from './components/SignupInvitation';
import ServiceSlider from './components/ServiceSlider';
import './App.css'
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';

function LandingPage() {
  const services = [
    {
      icon: "📊",
      title: "Data Analysis",
      description: "Comprehensive statistical breakdown of survival factors"
    },
    {
      icon: "🤖",
      title: "AI Prediction",
      description: "Accurate machine learning model trained on passenger data"
    },
    {
      icon: "📈",
      title: "Service 2",
      description: "Interactive charts showing survival probabilities"
    },
    {
      icon: "🔍",
      title: "Service 3",
      description: "One service we that can offer, small description"
    },
    {
      icon: "📚",
      title: "Service 4",
      description: "One service we that can offer, small description"
    },
    {
      icon: "🔄",
      title: "Service 5",
      description: "One service we that can offer, small description"
    }
  ];

  return (

      /* Please observe that landing-container is the main container of the landing page 
      In case u want to insert a navigation bar, or something before the main title (Titanic Survival Predictor)
      you can do it right here inserting a new class 
      In case u want to work with the title and welcoming message please work on the class hero-section and subclasses too 
      
      'ServiceSlider, SignupInvitation' are by now the components that we are using. 
      


      */
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
       
      
       
      <ServiceSlider services={services} />
      
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