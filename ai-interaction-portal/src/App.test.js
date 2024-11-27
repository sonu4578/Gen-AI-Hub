import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

// Mock the fetch function for API calls
global.fetch = jest.fn();

describe('App Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('should show error message if userInput is empty and form is submitted', () => {
    render(<App />);

    // Select model from dropdown
    fireEvent.change(screen.getByLabelText(/Model/i), { target: { value: 'OpenAI-gpt-4' } });

    // Submit the form with no userInput
    fireEvent.click(screen.getByText(/Submit/i));

    // Assert that the error message for userInput is shown
    expect(screen.getByText(/User Input is required/i)).toBeInTheDocument();
  });

  test('should submit form successfully with valid inputs and show response', async () => {
    render(<App />);

    // Fill the form with valid inputs
    fireEvent.change(screen.getByLabelText(/Model/i), { target: { value: 'OpenAI-gpt-4' } });
    fireEvent.change(screen.getByLabelText(/User Input/i), { target: { value: 'What is AI?' } });

    // Mock the API response
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ response: 'AI stands for Artificial Intelligence' }),
    });

    // Submit the form
    fireEvent.click(screen.getByText(/Submit/i));

    // Wait for API call to complete
    await waitFor(() => screen.getByText(/AI stands for Artificial Intelligence/i));

    // Assert that the response is rendered
    expect(screen.getByText(/AI stands for Artificial Intelligence/i)).toBeInTheDocument();
  });

  test('should handle API error and display error message', async () => {
    render(<App />);

    // Fill the form with valid inputs
    fireEvent.change(screen.getByLabelText(/Model/i), { target: { value: 'OpenAI-gpt-4' } });
    fireEvent.change(screen.getByLabelText(/User Input/i), { target: { value: 'What is AI?' } });

    // Mock the API response to simulate a failure
    fetch.mockRejectedValueOnce(new Error('API Error'));

    // Submit the form
    fireEvent.click(screen.getByText(/Submit/i));

    // Wait for error message to be displayed
    await waitFor(() => screen.getByText(/Error fetching data from API/i));

    // Assert that the error message is rendered
    expect(screen.getByText(/Error fetching data from API/i)).toBeInTheDocument();
  });


  test('should render Markdown content correctly', async () => {
    render(<App />);

    // Fill the form with valid inputs
    fireEvent.change(screen.getByLabelText(/Model/i), { target: { value: 'OpenAI-gpt-4' } });
    fireEvent.change(screen.getByLabelText(/User Input/i), { target: { value: 'What is Markdown?' } });

    // Mock the API response to return markdown content
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({
        response: '# Header\n**Bold Text**\n```code block```',
      }),
    });

    // Submit the form
    fireEvent.click(screen.getByText(/Submit/i));

    // Wait for API response
    await waitFor(() => screen.getByText(/Header/i));

    // Assert that the markdown content is rendered correctly as HTML
    expect(screen.getByText(/Header/i).tagName).toBe('H1');
    expect(screen.getByText(/Bold Text/i).tagName).toBe('B');
    expect(screen.getByText(/code block/i).tagName).toBe('CODE');
  });

  test('should render footer correctly', () => {
    render(<App />);

    // Assert that the footer is rendered
    expect(screen.getByText(/© 2024 Gen AI Hub/i)).toBeInTheDocument();
  });

  test('should update formData when model is selected', () => {
    render(<App />);

    // Select a new model
    fireEvent.change(screen.getByLabelText(/Model/i), { target: { value: 'Anthropic-claude-1' } });

    // Assert that the formData model is updated
    expect(screen.getByLabelText(/Model/i).value).toBe('Anthropic-claude-1');
  });

  test('should update userInput field when text is entered', () => {
    render(<App />);

    // Type in the userInput field
    fireEvent.change(screen.getByLabelText(/User Input/i), { target: { value: 'What is GPT?' } });

    // Assert that the userInput field value is updated
    expect(screen.getByLabelText(/User Input/i).value).toBe('What is GPT?');
  });

  test('should show error message for empty userInput field if form is submitted', async () => {
    render(<App />);

    // Submit the form with an empty userInput field
    fireEvent.click(screen.getByText(/Submit/i));

    // Assert that the error message for the userInput field is shown
    expect(screen.getByText(/User Input is required/i)).toBeInTheDocument();
  });

});
