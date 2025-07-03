import React from 'react';
import { render, screen } from '@testing-library/react';
import JoinUsSection from '../src/components/JoinUsSection/JoinUsSection';
import { vi } from 'vitest';

// Mock the video file import
vi.mock('../../src/assets/shot-titanic.mp4', () => ({
  __esModule: true,
  default: '/mock-video-path.mp4'
}));

describe('JoinUsSection Component', () => {
  beforeEach(() => {
    render(<JoinUsSection />);
  });

  it('renders the video element with correct class', () => {
    const video = document.querySelector('.cyber-video');
    expect(video).toBeInTheDocument();
    expect(video).toHaveClass('cyber-video');
  });

  it('renders the main heading with all text parts', () => {
    const heading = document.querySelector('.cyber-title');
    expect(heading).toHaveTextContent(/Let's Build/);
    expect(heading).toHaveTextContent(/The Future/);
    expect(heading).toHaveTextContent(/Together/);
    
    const glowingTexts = document.querySelectorAll('.glowing-text');
    expect(glowingTexts.length).toBeGreaterThanOrEqual(2);
    expect(document.querySelector('.glowing-text-accent')).toBeInTheDocument();
  });

  it('renders both cyber cards with correct content', () => {
    const cards = document.querySelectorAll('.cyber-card');
    expect(cards).toHaveLength(2);
    
    expect(cards[0]).toHaveTextContent('Push Boundaries');
    expect(cards[0]).toHaveTextContent(/We don't just take on projects/);
    
    expect(cards[1]).toHaveTextContent('AI Specialists');
    expect(cards[1]).toHaveTextContent(/Machine Learning engineers/);
    expect(cards[1]).toHaveClass('accent');
  });

  it('renders the highlight box with pulse animation', () => {
    const highlightBox = document.querySelector('.highlight-box');
    expect(highlightBox).toHaveTextContent(/Immersive AI Experience/);
    expect(highlightBox).toHaveTextContent(/Discover if you'd survive Titanic/);
    expect(document.querySelector('.pulse-dot')).toBeInTheDocument();
  });

  it('renders the join button with correct link and styling', () => {
    const joinButton = document.querySelector('a[href="/Signup"]');
    expect(joinButton).toHaveTextContent('Join Our Crew');
    expect(joinButton).toHaveClass('cyber-button');
    
    const lights = joinButton.querySelectorAll('.light');
    expect(lights).toHaveLength(2);
    expect(lights[0]).toHaveClass('blue');
    expect(lights[1]).toHaveClass('teal');
  });

  it('matches snapshot', () => {
    const { container } = render(<JoinUsSection />);
    expect(container).toMatchSnapshot();
  });
});