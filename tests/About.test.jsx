// tests just the header footer of the about page
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import About from '../src/pages/About/About';

// Mock the Footer component and CSS import
vi.mock('../../components/Footer/Footer', () => ({ default: () => <div data-testid="mock-footer"></div> }));
vi.mock('../src/pages/About/About.css', () => ({}));

describe('About', () => {
  it('renders the main welcome heading', () => {
    render(<About />);
    expect(screen.getByRole('heading', { name: /welcome to icebergai/i })).toBeInTheDocument();
  });
});
