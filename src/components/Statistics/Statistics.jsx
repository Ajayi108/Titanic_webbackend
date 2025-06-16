import React, { useState, useEffect, useRef } from 'react';
import './Statistics.css';

const statsConfig = [
  { id: 'students', label: 'Students', target: 15000, suffix: '', color: '#00f7ff' },
  { id: 'countries', label: 'Countries', target: 45, suffix: '', color: '#ff00aa' },
  { id: 'professors', label: 'Professors', target: 120, suffix: '', color: '#00ff88' },
];

const Statistics = () => {
  const [counts, setCounts] = useState(
    statsConfig.reduce((acc, cur) => ({ ...acc, [cur.id]: 0 }), {})
  );
  const [activeCard, setActiveCard] = useState(null);
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const timers = statsConfig.map(({ id, target }) => {
      let current = 0;
      const duration = 2000;
      const startTime = Date.now();
      const endTime = startTime + duration;

      const animateCount = () => {
        const now = Date.now();
        const progress = Math.min((now - startTime) / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 5);
        current = Math.floor(easeProgress * target);
        
        setCounts(prev => ({ ...prev, [id]: current }));
        
        if (now < endTime) {
          requestAnimationFrame(animateCount);
        }
      };

      const frameId = requestAnimationFrame(animateCount);
      return () => cancelAnimationFrame(frameId);
    });

    return () => timers.forEach(clearInterval);
  }, [isVisible]);

  const glitchText = (text) => {
    return (
      <>
        <span className="glitch-layer glitch-layer-1" aria-hidden="true">{text}</span>
        <span className="glitch-layer glitch-layer-2" aria-hidden="true">{text}</span>
        {text}
      </>
    );
  };

  return (
    <section 
      className={`statistics-section ${isVisible ? 'visible' : ''}`} 
      ref={sectionRef}
      data-theme="cyberpunk"
    >
      <div className="cyberpunk-overlay"></div>
      
      <h2 className="stats-heading">
        {glitchText("Shaping Tomorrow's Innovators")}
        <span className="subheading">With World-Class AI Education</span>
      </h2>
      
      <div className="stats-grid-container">
        <div className="stats-grid">
          {statsConfig.map(({ id, label, suffix, color }) => (
            <div 
              key={id} 
              className={`stat-card ${activeCard === id ? 'active' : ''}`}
              onMouseEnter={() => setActiveCard(id)}
              onMouseLeave={() => setActiveCard(null)}
              style={{ '--neon-color': color }}
            >
              <div className="corner corner-tl"></div>
              <div className="corner corner-tr"></div>
              <div className="corner corner-bl"></div>
              <div className="corner corner-br"></div>
              
              <div className="holographic-effect"></div>
              
              <span className="stat-value" data-value={`+${counts[id].toLocaleString()}${suffix}`}>
                +{counts[id].toLocaleString()}{suffix}
              </span>
              
              <span className="stat-label">
                {label.split('').map((letter, i) => (
                  <span 
                    key={i} 
                    className="letter" 
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    {letter}
                  </span>
                ))}
              </span>
              
              {activeCard === id && (
                <div className="active-pulse"></div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="cyberpunk-grid"></div>
    </section>
  );
};

export default Statistics;