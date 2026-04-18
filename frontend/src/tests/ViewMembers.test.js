import { render, screen } from '@testing-library/react';
import ViewMembers from '../Dashboard/ViewMembers'; 

test('renders group name in bold and member list', () => {
  // 1. Setup Mock Data
  const mockGroup = { name: "Community Stokvel", createdAt: "2026-04-18" };
  const mockMembers = [
    { _id: '1', firstName: 'Alice', lastName: 'Zwane' },
    { _id: '2', firstName: 'Bob', lastName: 'Mokoena' }
  ];

  render(
    <BrowserRouter>
      <ViewMembers group={mockGroup} members={mockMembers} />
    </BrowserRouter>
  );

  
  const nameElement = screen.getByText(/Community Stokvel/i);
  expect(nameElement).toBeInTheDocument();

  
  expect(nameElement.tagName).toBe('H2');

  
  const memberName = screen.getByText(/Alice Zwane/i);
  expect(memberName).toBeInTheDocument();
});