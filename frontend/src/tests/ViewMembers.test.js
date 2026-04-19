import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ViewMembers from '../Dashboard/ViewMembers'; 

describe('ViewMembers Component', () => {
    const mockGroup = { 
        groupName: "Community Stokvel", 
        creationDate: "2026-04-18T00:00:00.000Z" 
    };

    const mockMembers = [
        { 
            _id: '1', 
            displayName: 'Alice Zwane', 
            userEmail: 'alice@test.com',
            memberType: 'Admin',
            joiningDate: '2026-04-18'
        },
        { 
            _id: '2', 
            displayName: 'Bob Mokoena', 
            userEmail: 'bob@test.com',
            memberType: 'Member',
            joiningDate: '2026-04-18'
        }
    ];

    const mockOnSelect = jest.fn();

    beforeEach(() => {
        const user = JSON.stringify({ email: 'alice@test.com', name: 'Alice Zwane' });
        window.sessionStorage.setItem('user', user);
    });

    test('renders group header and member list correctly', () => {
        render(
            <BrowserRouter>
                <ViewMembers group={mockGroup} members={mockMembers} onSelectMember={mockOnSelect} />
            </BrowserRouter>
        );

        expect(screen.getByText(/Community Stokvel/i)).toBeInTheDocument();
        expect(screen.getByText(/2 Members/i)).toBeInTheDocument();
        expect(screen.getByText(/You/i)).toBeInTheDocument(); // Logic check for 'isMe'
        
        const adminTag = screen.getByText(/Admin/i);
        expect(adminTag).toHaveClass('role-tag-blue-inline');
    });

    test('calls onSelectMember when a member card is clicked', () => {
        render(
            <BrowserRouter>
                <ViewMembers group={mockGroup} members={mockMembers} onSelectMember={mockOnSelect} />
            </BrowserRouter>
        );

        const memberCard = screen.getByText(/Bob Mokoena/i).closest('li');
        fireEvent.click(memberCard);

        expect(mockOnSelect).toHaveBeenCalledTimes(1);
        expect(mockOnSelect).toHaveBeenCalledWith(mockMembers[1]);
    });

    test('renders correctly with an empty members list', () => {
        render(
            <BrowserRouter>
                <ViewMembers group={mockGroup} members={[]} onSelectMember={mockOnSelect} />
            </BrowserRouter>
        );
        expect(screen.getByText(/0 Members/i)).toBeInTheDocument();
        expect(screen.getByText(/No members found/i)).toBeInTheDocument(); // Empty state check
    });
});