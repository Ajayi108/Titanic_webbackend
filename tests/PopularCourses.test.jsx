import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PopularCourses from '../src/components/PopularCourses/PopularCourses';
import { vi } from 'vitest';

// Mock the image imports
vi.mock('../../src/assets/courses/titanic-course.png', () => ({
  default: '/mock-course1.jpg'
}));

// Mock the professor images
vi.mock('../../src/assets/professors/prof1.jpg', () => ({
  default: '/mock-prof1.jpg'
}));

describe('PopularCourses Component', () => {
  beforeEach(() => {
    // Mock the actual data file
    vi.mock('../../src/data/popularCourses.js', () => ({
      popularCourses: [
        {
          id: 1,
          title: 'Titanic Survival Predictor',
          description: 'Build an AI model to predict Titanic survival using real passenger data.',
          profName: 'Dr. Emily Clark',
          profImage: '/mock-prof1.jpg',
          image: '/mock-course1.jpg',
          skills: ['AI', 'ML'],
          availablePlaces: 4
        }
      ]
    }));

    render(
      <MemoryRouter>
        <PopularCourses />
      </MemoryRouter>
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the section header correctly', () => {
    expect(screen.getByText('Popular Courses')).toBeInTheDocument();
    expect(screen.getByText('Master AI with our cutting-edge curriculum')).toBeInTheDocument();
  });

  it('renders course cards with correct content', () => {
    expect(screen.getByText('Titanic Survival Predictor')).toBeInTheDocument();
    expect(screen.getByText('Build an AI model to predict Titanic survival using real passenger data.')).toBeInTheDocument();
    expect(screen.getByText('Dr. Emily Clark')).toBeInTheDocument();
  });

  it('renders the view all button with correct link', () => {
    const viewAllLink = document.querySelector('.view-all-btn');
    expect(viewAllLink).toHaveAttribute('href', '/courses');
    expect(viewAllLink).toHaveTextContent('Explore All Courses');
  });

  it('matches snapshot', () => {
    const { container } = render(
      <MemoryRouter>
        <PopularCourses />
      </MemoryRouter>
    );
    expect(container).toMatchSnapshot();
  });
});