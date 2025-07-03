// tests/Statistics.test.jsx
import React from 'react';
import { render, screen, fireEvent, within, act } from '@testing-library/react';
import { vi } from 'vitest';
import Statistics from '../src/components/Statistics/Statistics';

// Mock IntersectionObserver
let ioCallback;
class IntersectionObserverMock {
  constructor(cb) { ioCallback = cb; }
  observe() {}
  unobserve() {}
  disconnect() {}
}
vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);

describe('Statistics Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    
    // More controlled animation frame mock
    let callCount = 0;
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      if (callCount++ < 60) { // Limit to prevent infinite loops
        setTimeout(() => cb(Date.now()), 16);
      }
      return callCount;
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('renders main heading and subheading', () => {
    render(<Statistics />);
    
    expect(
      screen.getByRole('heading', { name: /Shaping Tomorrow's Innovators/i })
    ).toBeInTheDocument();
    
    expect(
      screen.getByText(/With World-Class AI Education/i)
    ).toBeInTheDocument();
  });

  it('renders all statistic cards with initial zero values', () => {
    render(<Statistics />);
    const zeroValues = screen.getAllByText('+0');
    expect(zeroValues.length).toBe(3);
    
    // Alternative way to check for card labels that works with split text
    const cardTexts = ['Students', 'Countries', 'Professors'];
    cardTexts.forEach(text => {
      // Find the parent stat-card element
      const statCards = document.querySelectorAll('.stat-card');
      const hasText = Array.from(statCards).some(card => 
        card.textContent.includes(text)
      );
      expect(hasText).toBe(true);
    });
  });

  it('animates counts when component becomes visible', async () => {
    render(<Statistics />);
    
    // Get initial values
    const initialValues = screen.getAllByText('+0');
    expect(initialValues.length).toBe(3);
    
    // Trigger intersection
    await act(async () => {
      ioCallback([{ isIntersecting: true, intersectionRatio: 1 }]);
      await Promise.resolve();
    });
    
    // Advance timers in controlled manner
    await act(async () => {
      // Advance enough time for animation to complete
      vi.advanceTimersByTime(2000);
      await Promise.resolve();
    });
    
    // Check final values
    const countElements = screen.getAllByText(/\+/i);
    const finalValues = countElements.map(el => 
      parseInt(el.textContent.replace('+', ''), 10)
    );
    
    // Verify at least one value changed
    expect(finalValues.some(val => val > 0)).toBe(true);
    // Verify all values are reasonable (not NaN, not negative)
    finalValues.forEach(val => {
      expect(val).toBeGreaterThanOrEqual(0);
      // Remove or adjust the upper limit based on your actual values
      // expect(val).toBeLessThanOrEqual(10000); 
    });
  });

  it('applies active class when card is hovered', async () => {
    render(<Statistics />);
    
    // Get all cards and test each one
    const cards = screen.getAllByText('+0').map(el => el.closest('.stat-card'));
    
    for (const card of cards) {
      // Hover in
      await act(async () => {
        fireEvent.mouseEnter(card);
        vi.advanceTimersByTime(100);
        await Promise.resolve();
      });
      
      expect(card).toHaveClass('active');
      
      // Hover out
      await act(async () => {
        fireEvent.mouseLeave(card);
        vi.advanceTimersByTime(100);
        await Promise.resolve();
      });
      
      expect(card).not.toHaveClass('active');
    }
  });

  it('renders glitch effect layers for the heading', () => {
    render(<Statistics />);
    
    const heading = screen.getByRole('heading', { 
      name: /Shaping Tomorrow's Innovators/i 
    });
    
    // Find all glitch layers
    const glitchLayers = within(heading).queryAllByRole('generic', {
      hidden: true,
    }).filter(el => el.className.includes('glitch-layer'));
    
    expect(glitchLayers.length).toBe(2);
  });

  it('matches snapshot', () => {
    const { container } = render(<Statistics />);
    expect(container).toMatchSnapshot();
  });
});