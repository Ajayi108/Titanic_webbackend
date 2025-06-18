import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './CourseDetails.css';

function CourseDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const course = location.state?.course;

  if (!course) {
    // If no course was selected, redirect back or show a message
    return (
      <div className="coursedetails-container">
        <h2>No course selected.</h2>
        <button onClick={() => navigate('/courses')}>Back to Courses</button>
      </div>
    );
  }

  return (
    <div className="coursedetails-container">
      <div className="coursedetails-header">
        <h1>{course.title}</h1>
        <p className="coursedetails-lecturer">By {course.profName}</p>
      </div>
      <div className="coursedetails-content">
        <p>{course.description}</p>
        <ul className="coursedetails-topics">
          {course.skills.map((t, i) => <li key={i}>{t}</li>)}
        </ul>
        <div className="coursedetails-meta">
          <span><b>Price:</b> 50 Euros</span>
          <span><b>Dates:</b> 01/08/2025</span>
          <span className="spots-left"><b>{course.availablePlaces} spots left</b></span>
        </div>
      </div>
    </div>
  );
}

export default CourseDetails;