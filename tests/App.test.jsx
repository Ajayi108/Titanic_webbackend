import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock RequireAdmin to bypass auth checks
vi.mock('../src/components/Auth/RequireAdmin', () => ({
  default: ({ children }) => <>{children}</>,
}));

// Mock child components that might cause issues
vi.mock('../src/components/Welcome/Welcome', () => ({
  default: () => <div>Welcome Component</div>,
}));

vi.mock('../src/components/ServiceSlider/ServiceSlider', () => ({
  default: () => <div>ServiceSlider Component</div>,
}));

vi.mock('../src/components/PopularCourses/PopularCourses', () => ({
  default: () => <div>PopularCourses Component</div>,
}));

vi.mock('../src/components/Statistics/Statistics', () => ({
  default: () => <div>Statistics Component</div>,
}));

vi.mock('../src/components/JoinUsSection/JoinUsSection', () => ({
  default: () => <div>JoinUsSection Component</div>,
}));

vi.mock('../src/components/Footer/Footer', () => ({
  default: () => <div>Footer Component</div>,
}));

import App from '../src/App';

// Mock course data for CourseDetails tests
const mockCourse = {
  title: "Machine Learning Fundamentals",
  profName: "Dr. Smith",
  description: "Introduction to core ML concepts",
  skills: ["Python", "TensorFlow", "Scikit-learn"],
  availablePlaces: 15
};

describe('App component', () => {
  it('mounts without crashing', () => {
    const { container } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    expect(container).toBeTruthy();
  });

  it('matches the snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('App routing', () => {
  it('renders LandingPage on default route', () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );
    // Check for any of the mocked components
    expect(screen.getByText('Welcome Component')).toBeInTheDocument();
  });

  it('renders Login page on /login route', () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: /Sign in/i })).toBeInTheDocument();
  });

  it('renders Signup page on /signup route', () => {
    render(
      <MemoryRouter initialEntries={["/signup"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: /Create Account/i })).toBeInTheDocument();
  });

  it('renders About page on /about route', () => {
    render(
      <MemoryRouter initialEntries={["/about"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: /welcome to icebergai/i })).toBeInTheDocument();
  });

  it('renders Contact page on /contact route', () => {
    render(
      <MemoryRouter initialEntries={["/contact"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/let['’]s get in touch/i)).toBeInTheDocument();
    expect(screen.getByText(/icebergai@titanic\.com/i)).toBeInTheDocument();
 
  });

  it('renders Courses page on /courses route', () => {
    render(
      <MemoryRouter initialEntries={["/courses"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: /courses/i })).toBeInTheDocument();
  });

  describe('CourseDetails page', () => {
    it('renders with course data on /coursedetails route', () => {
      render(
        <MemoryRouter initialEntries={[{
          pathname: "/coursedetails",
          state: { course: mockCourse }
        }]}>
          <App />
        </MemoryRouter>
      );
      
      expect(screen.getByRole('heading', { name: mockCourse.title })).toBeInTheDocument();
      expect(screen.getByText(new RegExp(`by ${mockCourse.profName}`, 'i'))).toBeInTheDocument();
    });

    it('shows fallback when no course is selected', () => {
      render(
        <MemoryRouter initialEntries={["/coursedetails"]}>
          <App />
        </MemoryRouter>
      );
      
      expect(screen.getByText(/no course selected/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /back to courses/i })).toBeInTheDocument();
    });
  });

  it('renders AdminDashboard when admin route is accessed', () => {
    render(
      <MemoryRouter initialEntries={["/admindashboard"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: /admin.control/i })).toBeInTheDocument();
    expect(screen.getByText(/model management interface/i)).toBeInTheDocument();
  });

  it('renders CalculatorRedirect on /calculator route', () => {
    render(
      <MemoryRouter initialEntries={["/calculator"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/calculator/i)).toBeInTheDocument();
  });
});