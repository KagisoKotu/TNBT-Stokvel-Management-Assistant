import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; 
import App from './App';

jest.mock('@react-oauth/google', () => ({
  GoogleLogin: () => <div>Google Login Mock</div>,
  useGoogleLogin: () => ({ login: jest.fn() }),
}));

test('renders the StokvelStokkie logo text', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  
  const logoElement = screen.getByText(/StokvelStokkie/i); 
  expect(logoElement).toBeInTheDocument();
});