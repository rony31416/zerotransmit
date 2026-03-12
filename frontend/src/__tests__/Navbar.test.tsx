import { render, screen } from '@testing-library/react';
import Navbar from '@/components/Navbar';

// Mock usePathname from next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

describe('Navbar Component', () => {
  it('renders the ZeroTransmit logo', () => {
    render(<Navbar />);
    expect(screen.getByText('ZeroTransmit')).toBeInTheDocument();
  });

  it('renders all navigation links', () => {
    render(<Navbar />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Risk Assessment')).toBeInTheDocument();
    expect(screen.getByText('Chatbot')).toBeInTheDocument();
    expect(screen.getByText('Counseling')).toBeInTheDocument();
    expect(screen.getByText('GeoMap')).toBeInTheDocument();
  });
});
