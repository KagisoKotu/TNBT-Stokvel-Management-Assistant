import { render, screen } from '@testing-library/react';
import App from './App';
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

jest.mock('@react-oauth/google', () => ({
  GoogleLogin: () => <button type="button">Google Login Mock</button>,
  useGoogleLogin: () => ({ login: jest.fn() }),
  }));

test('renders the StokvelStokkie logo text', () => {
render(<App />);

  const logoElement = screen.getByText(/StokvelStokkie/i, { selector: 'span' });
  expect(logoElement).toBeInTheDocument();

});