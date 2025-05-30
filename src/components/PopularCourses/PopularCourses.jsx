// PopularCourses.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { popularCourses } from '../../data/popularCourses.js';
import './PopularCourses.css';

const PopularCourses = () => (
  <section className="popular-courses-section">
    <h1 className="popular-courses-title">
      Popular Courses
    </h1>
    <div className="popular-courses-grid">
      {popularCourses.slice(0, 6).map(course => (
        <div key={course.id} className="course-card">
          <img src={course.image} alt={course.title} className="course-image" />
          <div className="course-content">
            <h3 className="course-title">{course.title}</h3>
            {course.skills?.length > 0 &&  (
              <div className="course-skills">
                <strong>Skills you’ll gain:</strong>{' '}
                 <span className="skills-preview">
                  {course.skills.join(', ')}
                 </span>
              </div>
            )}
            <p className="course-desc">{course.description}</p>
            <p className="course-meta">
              Instructor: {course.profName} · {course.availablePlaces}  weeks 
            </p>
            
            
            
          </div>
        </div>
      ))}
    </div>
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Link to="/courses" className="view-all">
        View All Courses
      </Link>
    </div>
  </section>
);

export default PopularCourses;