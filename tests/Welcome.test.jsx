// tests/Welcome.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import Welcome from '../src/components/Welcome/Welcome';

describe('Welcome Component', () => {
  let requestAnimationFrameMock;
  let cancelAnimationFrameMock;
  let addEventListenerSpy;
  let animationId = 0;

  beforeEach(() => {
    // Mock canvas methods
    HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
      fillStyle: '',
      font: '',
      fillRect: vi.fn(),
      fillText: vi.fn(),
    }));

    // Mock requestAnimationFrame with controlled execution
    requestAnimationFrameMock = vi.spyOn(window, 'requestAnimationFrame')
      .mockImplementation((cb) => {
        animationId++;
        // Execute callback immediately but only once to prevent recursion
        if (animationId < 5) { // Limit iterations for testing
          setTimeout(() => cb(performance.now()), 0);
        }
        return animationId;
      });

    cancelAnimationFrameMock = vi.spyOn(window, 'cancelAnimationFrame');
    addEventListenerSpy = vi.spyOn(window, 'addEventListener');

    // Mock window dimensions
    window.innerWidth = 1024;
    window.innerHeight = 768;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    animationId = 0;
  });

  it('renders the canvas background', () => {
    render(<Welcome />);
    const canvases = document.getElementsByClassName('binary-bg');
    expect(canvases.length).toBe(1);
    expect(canvases[0]).toBeInTheDocument();
  });

  it('renders the main heading', () => {
    render(<Welcome />);
    expect(
      screen.getByRole('heading', { 
        name: /WE KNOW WHO WOULD'VE SURVIVED\. DO YOU\?/i 
      })
    ).toBeInTheDocument();
  });

  it('renders the description paragraph', () => {
    render(<Welcome />);
    expect(
      screen.getByText(
        /The AI-powered survival predictor that reveals whether you would have made it through the Titanic disaster is here\. Real data\. Real analysis\. Real answers\./i
      )
    ).toBeInTheDocument();
  });

  it('renders the CTA button with correct link', () => {
    render(<Welcome />);
    const ctaButton = screen.getByRole('link', { name: /TRY PREDICTANIC NOW/i });
    expect(ctaButton).toBeInTheDocument();
    expect(ctaButton).toHaveAttribute('href', '/calculator');
    expect(ctaButton).toHaveClass('cta-button');
  });

  it('sets up canvas animation on mount', () => {
    render(<Welcome />);
    expect(HTMLCanvasElement.prototype.getContext).toHaveBeenCalledWith('2d');
    expect(requestAnimationFrameMock).toHaveBeenCalled();
  });

  it('cleans up animation on unmount', () => {
    const { unmount } = render(<Welcome />);
    unmount();
    expect(cancelAnimationFrameMock).toHaveBeenCalled();
  });

  it('handles window resize events', () => {
    render(<Welcome />);
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'resize',
      expect.any(Function)
    );
  });
});