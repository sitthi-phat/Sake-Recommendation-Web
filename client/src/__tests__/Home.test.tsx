import { render, screen, fireEvent } from '@testing-library/react';
import Home from '../app/page';

// Mock next-auth
jest.mock('next-auth/react', () => ({
    signIn: jest.fn(),
    useSession: jest.fn(() => ({ data: null, status: 'unauthenticated' })),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

describe('Home Page (Login)', () => {
    it('renders the welcome message', () => {
        render(<Home />);
        const heading = screen.getByRole('heading', { level: 1 });
        expect(heading).toHaveTextContent(/Sake/i);
        expect(heading).toHaveTextContent(/Select/i);
        expect(screen.getByText('Discover the perfect sake for your palate.')).toBeInTheDocument();
    });

    it('renders login buttons', () => {
        render(<Home />);
        expect(screen.getByText('Continue with Line')).toBeInTheDocument();
        expect(screen.getByText('Continue with Google')).toBeInTheDocument();
        expect(screen.getByText('Continue with Facebook')).toBeInTheDocument();
        expect(screen.getByText('Continue with Apple')).toBeInTheDocument();
    });

    it('calls signIn when a provider button is clicked', () => {
        const { signIn } = require('next-auth/react');
        render(<Home />);

        fireEvent.click(screen.getByText('Continue with Google'));
        expect(signIn).toHaveBeenCalledWith('google', { callbackUrl: '/' });
    });
});
