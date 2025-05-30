import React, { useState, useEffect } from 'react';
import './Statistics.css';

const statsConfig = [
  { id: 'students', label: 'Students', target: 15000, suffix: 'K' },
  { id: 'countries', label: 'Countries', target: 45, suffix: '' },
  { id: 'professors', label: 'Professors', target: 120, suffix: '' },
];

const Statistics = () => {
  const [counts, setCounts] = useState(
    statsConfig.reduce((acc, cur) => ({ ...acc, [cur.id]: 0 }), {})
  );

  useEffect(() => {
    const timers = statsConfig.map(({ id, target }) => {
      let current = 0;
      const step = Math.ceil(target / 100);
      const interval = setInterval(() => {
        current = Math.min(current + step, target);
        setCounts(prev => ({ ...prev, [id]: current }));
        if (current >= target) clearInterval(interval);
      }, 20);
      return interval;
    });

    return () => timers.forEach(clearInterval);
  }, []);

  return (
    <section className="statistics-section">
      <h2 className="stats-heading">
        We’re shaping tomorrow’s innovators with world-class AI education.
      </h2>
      <div className="stats-grid">
        {statsConfig.map(({ id, label, suffix }) => (
          <div key={id} className="stat-card">
            <span className="stat-value">
              +{counts[id].toLocaleString()}{suffix}
            </span>
            <span className="stat-label">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Statistics;