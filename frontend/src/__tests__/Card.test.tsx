import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { render, screen } from '@testing-library/react';

describe('Card Components', () => {
  it('renders Card with children', () => {
    render(<Card>Test Content</Card>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders CardHeader with children', () => {
    render(<CardHeader>Header Content</CardHeader>);
    expect(screen.getByText('Header Content')).toBeInTheDocument();
  });

  it('renders CardTitle with children', () => {
    render(<CardTitle>Title Content</CardTitle>);
    expect(screen.getByText('Title Content')).toBeInTheDocument();
  });

  it('renders CardContent with children', () => {
    render(<CardContent>Content Body</CardContent>);
    expect(screen.getByText('Content Body')).toBeInTheDocument();
  });

  it('applies custom className to Card', () => {
    const { container } = render(<Card className="custom-class">Test</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('custom-class');
  });
});
