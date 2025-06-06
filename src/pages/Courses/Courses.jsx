import { popularCourses } from '../../data/popularCourses';
import './Courses.css';

function Courses() {
    // Sort courses by availability
    const sortedCourses = [...popularCourses].sort((a, b) => a.availablePlaces - b.availablePlaces);

    return (
        <div className="page-container">
            <h1>Our Courses</h1>

            <section className="section intro-section">
                <h2>Featured Programs</h2>
                <p>
                    Explore our interactive courses designed to take you from fundamentals to advanced AI applications.
                    Each program combines theory with hands-on projects.
                </p>
            </section>

            <div className="courses-grid">
                {sortedCourses.map((course) => (
                    <div key={course.id} className="course-card">
                        <div className="course-image-container">
                            <img
                                src={`/src/assets/courses/${course.image.split('/').pop()}`}
                                alt={course.title}
                                className="course-image"
                            />
                            {course.availablePlaces < 5 && (
                                <span className="availability-badge">Almost Full!</span>
                            )}
                        </div>
                        <div className="course-content">
                            <h3>{course.title}</h3>
                            <p className="course-description">{course.description}</p>
                            <div className="course-meta">
                                <span className="professor">By {course.profName}</span>
                                <span className={`spots ${course.availablePlaces < 3 ? 'warning' : ''}`}>
                                    {course.availablePlaces} spots left
                                </span>
                            </div>
                            <ul className="course-skills">
                                {course.skills.slice(0, 3).map((skill, index) => (
                                    <li key={index}>
                                        <span className="skill-bullet">•</span> {skill}
                                    </li>
                                ))}
                            </ul>
                            <button className="view-details-btn">View Details</button>
                        </div>
                    </div>
                ))}
            </div>

            <section className="section pathway-section">
                <h2>Learning Pathways</h2>
                <p>
                    Our courses are designed to build upon each other. Start with fundamentals and progress
                    to specialized topics with our structured learning paths.
                </p>
                <blockquote>
                    "The best way to predict the future is to create it."
                    <br /> — Prof. Alan Turington, Academic Director
                </blockquote>
            </section>
        </div>
    );
}

export default Courses;