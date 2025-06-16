import React from 'react';
import { Link } from 'react-router-dom';
import { popularCourses } from '../../data/popularCourses.js';
import './PopularCourses.css';

const PopularCourses = () => {
  return (
    <section className="ai-courses-section">
      <div className="courses-container"> {/* This is the new wrapper */}
        <div className="ai-section-header">
          <h1 className="ai-courses-title">
            Popular Courses
          </h1>
          <p className="ai-section-subtitle">Master AI with our cutting-edge curriculum</p>
        </div>

        <div className="ai-courses-grid">
          {popularCourses.slice(0, 6).map((course, index) => (
            <div
              key={course.id}
              className="ai-course-card"
              style={{ '--delay': `${index * 0.1}s` }}
            >
              <div className="card-shine" />
              <div className="course-image-container">
                <img
                  src={course.image}
                  alt={course.title}
                  className="course-image"
                  loading="lazy"
                />
                <div className="image-overlay" />
                <span className="course-duration">{course.availablePlaces} weeks</span>
              </div>

              <div className="course-content">
                <div className="course-header">
                  <h3 className="course-title">
                    <span className="title-highlight">{course.title}</span>
                  </h3>
                  <div className="tech-tags">
                    {course.skills?.slice(0, 3).map((skill, i) => (
                      <span key={i} className="tech-tag">{skill}</span>
                    ))}
                  </div>
                </div>

                <p className="course-desc">{course.description}</p>

                <div className="course-footer">
                  <div className="instructor-info">
                    <div
                      className="instructor-avatar"
                      style={{ backgroundImage: `url(${course.profImage})` }}
                    />
                    <span>{course.profName}</span>
                  </div>
                  <div className="course-cta">
                    <span className="enroll-text">Enroll Now</span>
                    <div className="arrow-icon">→</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="view-all-container">
          <Link to="/courses" className="view-all-btn">
            <span>Explore All Courses</span>
            <div className="btn-arrow">
              <div className="arrow-line" />
              <div className="arrow-head" />
            </div>
          </Link>
        </div>
      </div> {/* End of the new wrapper */}
    </section>
  );
};

export default PopularCourses;