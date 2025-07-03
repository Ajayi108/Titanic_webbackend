 import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CalculatorPage from '../src/pages/CalculatorPage/CalculatorPage';

// Mock Footer component to avoid rendering complexities
vi.mock('../../components/Footer/Footer', () => ({
  default: () => <div data-testid="footer" />
}));

// Stub out scrollIntoView in jsdom
beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = () => {};
});

describe('CalculatorPage Component', () => {
  beforeEach(() => {
    render(<CalculatorPage />);
  });

  it('renders the hero section with model selection', () => {
    // Hero title is an H1
    expect(screen.getByRole('heading', { level: 1, name: /Predictanic/i })).toBeInTheDocument();
    // Model-selection header is an H3
    expect(
      screen.getByRole('heading', { level: 3, name: /SELECT PREDICTION ALGORITHM/i })
    ).toBeInTheDocument();
    // Algorithm cards use H4
    expect(
      screen.getByRole('heading', { level: 4, name: /RANDOM FOREST/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 4, name: /SUPPORT VECTOR MACHINE/i })
    ).toBeInTheDocument();
  });

  it('allows selecting a model and displays input grid', async () => {
    const rfCard = screen.getByRole('heading', { level: 4, name: /RANDOM FOREST/i }).closest('.model-card');
    expect(rfCard).toBeInTheDocument();
    await userEvent.click(rfCard);

    // Active model tag appears
    expect(screen.getByText(/ACTIVE MODEL:/i)).toBeInTheDocument();
    expect(screen.getByText(/RANDOM FOREST/i)).toBeInTheDocument();

    // Input grid should show 7 inputs
    const labels = screen.getAllByText(/CLASS|SEX|AGE|FARE|ALONE|EMBARKED|TITLE/i);
    expect(labels).toHaveLength(7);
  });

  it('toggles reset functionality', async () => {
    const svmCard = screen.getByRole('heading', { level: 4, name: /SUPPORT VECTOR MACHINE/i }).closest('.model-card');
    await userEvent.click(svmCard);

    // Fill one option
    await userEvent.click(screen.getByText('First'));
    // Ensure reset clears it
    const resetBtn = screen.getByRole('button', { name: /RESET PARAMETERS/i });
    await userEvent.click(resetBtn);

    expect(
      screen.queryByText('First', { selector: '.selected' })
    ).not.toBeInTheDocument();
  });

  it('shows explanation panel when clicking an input cell', async () => {
    // Select model to show inputs
    const rfCard = screen.getByRole('heading', { level: 4, name: /RANDOM FOREST/i }).closest('.model-card');
    await userEvent.click(rfCard);

    // Locate the SEX input-cell by its label-text
    const sexLabel = screen.getByText(/SEX/i, { selector: '.label-text' });
    const sexCell = sexLabel.closest('.input-cell');
    await userEvent.click(sexCell);

    // Explanation panel content
    expect(
      screen.getByRole('heading', { level: 4, name: /SEX/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Women and children had higher survival rates/i)
    ).toBeInTheDocument();
  });

  it('disables predict button until all inputs are filled', async () => {
    const rfCard = screen.getByRole('heading', { level: 4, name: /RANDOM FOREST/i }).closest('.model-card');
    await userEvent.click(rfCard);
    const predictBtn = screen.getByRole('button', { name: /EXECUTE PREDICTION/i });
    expect(predictBtn).toBeDisabled();

    // Fill categorical inputs
    const options = ['First', 'Female', 'No', 'Southampton', 'Mrs'];
    for (const option of options) {
      await userEvent.click(screen.getByText(option));
    }

    // Fill numeric inputs AGE and FARE
    await userEvent.type(screen.getByPlaceholderText('AGE'), '30');
    await userEvent.type(screen.getByPlaceholderText('FARE'), '50');

    expect(predictBtn).toBeEnabled();
  });
});
