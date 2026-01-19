import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductsPage from '../app/products/page';

// Mock next-auth
jest.mock('next-auth/react', () => ({
    useSession: jest.fn(() => ({
        data: { user: { id: '123', name: 'Test User' } },
        status: 'authenticated',
    })),
    signOut: jest.fn(),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
    useSearchParams: () => ({
        get: jest.fn(),
    }),
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

// Mock fetch
global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () =>
            Promise.resolve({
                products: [
                    { id: 1, name: 'Sake A', type: 'Junmai', description: 'Desc A', price: '$$' },
                    { id: 2, name: 'Sake B', type: 'Ginjo', description: 'Desc B', price: '$$$' },
                ],
                mode: 'personalized',
                message: 'Personalized Recommendations',
            }),
    })
) as jest.Mock;

describe('Products Page', () => {
    it('renders the header and logout button', async () => {
        render(<ProductsPage />);

        await waitFor(() => {
            expect(screen.getByText('Sake Selection')).toBeInTheDocument();
            expect(screen.getByText('Logout')).toBeInTheDocument();
        });
    });

    it('renders products fetched from API', async () => {
        render(<ProductsPage />);

        await waitFor(() => {
            expect(screen.getByText('Sake A')).toBeInTheDocument();
            expect(screen.getByText('Sake B')).toBeInTheDocument();
            expect(screen.getByText('Personalized Recommendations')).toBeInTheDocument();
        });
    });

    it('calls signOut when logout button is clicked', async () => {
        const { signOut } = require('next-auth/react');
        render(<ProductsPage />);

        await waitFor(() => {
            fireEvent.click(screen.getByText('Logout'));
            expect(signOut).toHaveBeenCalledWith({ callbackUrl: '/' });
        });
    });
});
