import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../src/components/Footer/Footer';
import { vi } from 'vitest';
 // Mock static assets correctly
vi.mock('../src/assets/transhumanism.gif', () => ({
  default: 'mock-gif-path'
}));

// Mock react-icons
vi.mock('react-icons/fa', () => ({
  __esModule: true,
  FaTwitter: () => <span data-icon="twitter">TwitterIcon</span>,
  FaGithub: () => <span data-icon="github">GitHubIcon</span>,
  FaLinkedin: () => <span data-icon="linkedin">LinkedInIcon</span>,
  FaCalculator: () => <span data-icon="calculator">CalculatorIcon</span>,
  FaInfoCircle: () => <span data-icon="info">InfoIcon</span>,
  FaShip: () => <span data-icon="ship">ShipIcon</span>,
  FaChartLine: () => <span data-icon="chart">ChartIcon</span>,
  FaBrain: () => <span data-icon="brain">BrainIcon</span>,
}));

describe('Footer Component', () => {
  beforeEach(() => {
    render(<Footer />);
  });

  it('renders brand section correctly', () => {
    // Check logo parts
    expect(screen.getByText('ICE')).toBeInTheDocument();
    expect(screen.getByText('BERG')).toBeInTheDocument();
    expect(screen.getByText('-AI')).toBeInTheDocument();
    
    // Check slogan using text content matching
    const sloganContainer = screen.getByText((content, element) => {
      return element.className.includes('cyber-slogan');
    });
    expect(sloganContainer.textContent).toMatch(/PREDICT\.\s*SURVIVE\.\s*LEARN/);
    
    // Check GIF
    expect(screen.getByAltText('Iceberg AI animated logo')).toHaveAttribute('src', 'mock-gif-path');
  });

  it('renders navigation links correctly', () => {
    const navLinks = [
      { text: 'Our Courses', icon: 'calculator' },
      { text: 'Predictanic', icon: 'ship' },
      { text: 'About Project', icon: 'info' },
      { text: 'AI Research', icon: 'chart' },
    ];

    navLinks.forEach(link => {
      expect(screen.getByText(link.text)).toBeInTheDocument();
      expect(screen.getByText(link.text).closest('a')).toBeInTheDocument();
    });
  });

  it('renders social media links correctly', () => {
    const socialLinks = ['Twitter', 'GitLab', 'LinkedIn', 'Contact'];
    socialLinks.forEach(link => {
      expect(screen.getByText(link)).toBeInTheDocument();
    });
  });

  it('renders newsletter form correctly', () => {
    expect(screen.getByText('Get AI insights directly to your inbox')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('YOUR@EMAIL.COM')).toBeInTheDocument();
    expect(screen.getByText('SUBSCRIBE')).toBeInTheDocument();
  });

  it('renders copyright information', () => {
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(`© ${currentYear} ICEBERG-AI SYSTEMS`)).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { container } = render(<Footer />);
    expect(container).toMatchSnapshot();
  });
});