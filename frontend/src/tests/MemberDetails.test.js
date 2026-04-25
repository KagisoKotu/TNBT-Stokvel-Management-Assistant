import { render, screen, fireEvent, act } from '@testing-library/react';
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
    const mockOnRemove = jest.fn();

    beforeEach(() => {
        
        window.sessionStorage.setItem('user', JSON.stringify({ email: 'admin@test.com' }));
        jest.clearAllMocks();
    });

    test('renders member details correctly', () => {
        render(<MemberDetails member={mockMember} onClose={mockOnClose} onRemove={mockOnRemove} />);
        
        expect(screen.getByRole('heading', { name: /Bob Mokoena/i })).toBeInTheDocument();
        expect(screen.getByText(/bob@test.com/i)).toBeInTheDocument();
        
        expect(screen.getByText(/18 April 2026/i)).toBeInTheDocument(); 
    });

    test('calls onRemove and shows success message on "Yes" click', async () => {
        
        mockOnRemove.mockResolvedValue(true);

        render(<MemberDetails member={mockMember} onClose={mockOnClose} onRemove={mockOnRemove} />);
        
       
        fireEvent.click(screen.getByText(/Remove Member/i));

       
        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /yes/i }));
        });

        
        expect(mockOnRemove).toHaveBeenCalledWith('2');

        
        const successMessage = await screen.findByText(/successfully removed/i);
        expect(successMessage).toBeInTheDocument();
    });

    test('hides confirmation box when "No" is clicked', () => {
        render(<MemberDetails member={mockMember} onClose={mockOnClose} onRemove={mockOnRemove} />);
        
        fireEvent.click(screen.getByText(/Remove Member/i));
        
        
        expect(screen.getByText(/Are you sure/i)).toBeInTheDocument();

        
        fireEvent.click(screen.getByRole('button', { name: /no/i }));

        
        expect(screen.queryByText(/Are you sure/i)).not.toBeInTheDocument();
        expect(mockOnRemove).not.toHaveBeenCalled();
    });

    test('shows error message if removal fails', async () => {
        
        mockOnRemove.mockResolvedValue(false);
        
        render(<MemberDetails member={mockMember} onClose={mockOnClose} onRemove={mockOnRemove} />);
        
        fireEvent.click(screen.getByText(/Remove Member/i));

        
        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /yes/i }));
        });

        
        const errorMessage = await screen.findByText(/failed/i);
        expect(errorMessage).toBeInTheDocument();
    });
});