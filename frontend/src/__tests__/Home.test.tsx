import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

describe('Home Page', () => {
  it('renders the main heading', () => {
    render(<Home />);
    const heading = screen.getByText('ZeroTransmit');
    expect(heading).toBeInTheDocument();
  });

  it('displays all four main features', () => {
    render(<Home />);
    expect(screen.getByText('Risk Assessment')).toBeInTheDocument();
    expect(screen.getByText('Chatbot Support')).toBeInTheDocument();
    expect(screen.getByText('Mental Health Counseling')).toBeInTheDocument();
    expect(screen.getByText('Geographic Analytics')).toBeInTheDocument();
  });

  it('shows statistics section', () => {
    render(<Home />);
    expect(screen.getByText('150+')).toBeInTheDocument();
    expect(screen.getByText('1000+')).toBeInTheDocument();
    expect(screen.getByText('24/7')).toBeInTheDocument();
  });

  it('displays helpline information', () => {
    render(<Home />);
    expect(screen.getByText(/16230/)).toBeInTheDocument();
    expect(screen.getByText(/16789/)).toBeInTheDocument();
  });
});
