import React from 'react';
import { render, screen } from '@testing-library/react';
import ServiceSlider from '../src/components/ServiceSlider/ServiceSlider';
import { vi } from 'vitest';

// 1. Create consistent Swiper mocks that won't change between test runs
vi.mock('swiper/react', () => ({
  Swiper: ({ children }) => (
    <div className="swiper-mock" data-testid="swiper-mock">
      {children}
    </div>
  ),
  SwiperSlide: ({ children }) => (
    <div className="swiper-slide-mock" data-testid="swiper-slide-mock">
      {children}
    </div>
  )
}));

// 2. Mock the modules
vi.mock('swiper/modules', () => ({
  Navigation: vi.fn(),
  Pagination: vi.fn(),
  Autoplay: vi.fn()
}));

// 3. Mock reviews data with consistent test data
vi.mock('../../src/data/reviews.js', () => ({
  reviews: [
    {
      name: "Test User",
      profession: "Test Profession",
      location: "Test Location",
      image: "/test-image.png",
      title: "Test Title",
      description: "Test Description"
    }
  ]
}));

describe('ServiceSlider Component', () => {
  beforeEach(() => {
    render(<ServiceSlider />);
  });

  it('renders the section title', () => {
    expect(screen.getByText('What Our Clients are saying:')).toBeInTheDocument();
  });

  it('renders at least one review card', () => {
    const cards = screen.getAllByTestId('swiper-slide-mock');
    expect(cards.length).toBeGreaterThan(0);
  });

  it('matches snapshot', () => {
    const { container } = render(<ServiceSlider />);
    expect(container).toMatchSnapshot();
  });
});