import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import GroupManagement from '../Dashboard/GroupManagement';

// 1. More resilient fetch mock
const mockFetchResponse = {
    group: { 
        groupName: 'Test Stokvel', 
        creationDate: '2026-04-18T00:00:00.000Z' 
    },
    members: [{ 
        _id: '1', 
        displayName: 'Alice', 
        userEmail: 'alice@test.com', 
        memberType: 'Admin' 
    }]
};

global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockFetchResponse),
    })
);

describe('GroupManagement Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Required for ViewMembers/MemberDetails "isMe" logic
        window.sessionStorage.setItem('user', JSON.stringify({ email: 'admin@test.com' }));
    });

    const renderWithRouter = () => {
        return render(
            <MemoryRouter 
                initialEntries={['/manage/123']}
                future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
            >
                <Routes>
                    <Route path="/manage/:groupId" element={<GroupManagement />} />
                </Routes>
            </MemoryRouter>
        );
    };

    test('shows welcome placeholder initially', () => {
        renderWithRouter();
        expect(screen.getByText(/Select an action/i)).toBeInTheDocument();
    });

    test('switches to member list when sidebar item is clicked', async () => {
        renderWithRouter();
        
        // Open Sidebar and select Members tab
        fireEvent.click(screen.getByText(/☰ Menu/i));
        fireEvent.click(screen.getByText(/View Members/i));

        // Use findBy to handle the async shift from "Loading..." to the Data
        const groupHeader = await screen.findByText(/Test Stokvel/i, {}, { timeout: 3000 });
        const memberName = await screen.findByText(/Alice/i);

        expect(groupHeader).toBeInTheDocument();
        expect(memberName).toBeInTheDocument();
    });

    test('opens member details when a member is selected', async () => {
        renderWithRouter();
        
        fireEvent.click(screen.getByText(/☰ Menu/i));
        fireEvent.click(screen.getByText(/View Members/i));

        // Wait for Alice to appear and click
        const memberItem = await screen.findByText(/Alice/i);
        fireEvent.click(memberItem);

        // Verify MemberDetails renders labels from that component
        await waitFor(() => {
            expect(screen.getByText(/Full Name/i)).toBeInTheDocument();
            expect(screen.getByText(/alice@test.com/i)).toBeInTheDocument();
        });
    });
});