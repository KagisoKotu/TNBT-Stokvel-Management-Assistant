import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MemberDetails from '../Dashboard/MemberDetails';

describe('MemberDetails Component', () => {
    const mockMember = {
        _id: '2',
        displayName: 'Bob Mokoena',
        userEmail: 'bob@test.com',
        memberType: 'Member',
        joiningDate: '2026-04-18T00:00:00.000Z'
    };

    const mockOnClose = jest.fn();
    // Ensure the mock specifically returns a resolved promise
    const mockOnRemove = jest.fn().mockImplementation(() => Promise.resolve(true));

    beforeEach(() => {
        window.sessionStorage.setItem('user', JSON.stringify({ email: 'admin@test.com' }));
        jest.clearAllMocks();
    });

    test('renders member details correctly', () => {
        render(<MemberDetails member={mockMember} onClose={mockOnClose} onRemove={mockOnRemove} />);
        expect(screen.getByText(/bob@test.com/i)).toBeInTheDocument();
        // Matching localized date format used in component
        expect(screen.getByText(/18 April 2026/i)).toBeInTheDocument(); 
    });

    test('calls onRemove and shows success message on "Yes" click', async () => {
        render(<MemberDetails member={mockMember} onClose={mockOnClose} onRemove={mockOnRemove} />);
        
        // Show confirmation box
        fireEvent.click(screen.getByText(/Remove Member/i));

        // Click Yes
        const yesButton = screen.getByRole('button', { name: /yes/i });
        fireEvent.click(yesButton);

        // Verify the function call
        expect(mockOnRemove).toHaveBeenCalledWith('2');

        // Use findByText which automatically handles the async state update
        const successMessage = await screen.findByText(/successfully removed/i);
        expect(successMessage).toBeInTheDocument();
    });

    test('calls onClose and does NOT remove when "No" is clicked', () => {
        render(<MemberDetails member={mockMember} onClose={mockOnClose} onRemove={mockOnRemove} />);
        fireEvent.click(screen.getByText(/Remove Member/i));

        const noButton = screen.getByRole('button', { name: /no/i });
        fireEvent.click(noButton);

        expect(mockOnRemove).not.toHaveBeenCalled();
        expect(mockOnClose).toHaveBeenCalled(); 
    });

    test('hides remove button if viewing own profile', () => {
        window.sessionStorage.setItem('user', JSON.stringify({ email: 'bob@test.com' }));
        render(<MemberDetails member={mockMember} onClose={mockOnClose} onRemove={mockOnRemove} />);
        expect(screen.queryByText(/Remove Member/i)).not.toBeInTheDocument();
    });
});