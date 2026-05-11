# User Story: Member View Contribution History

## User Story

**As a** Member of a stokvel group,  
**I want to** view my complete contribution history,  
**So that** I can track my payments over time and verify my financial standing.

---

## Acceptance Criteria (6 UATs)

| # | Test Description |
|---|------------------|
| **UAT-01** | Verify that member can view contribution history table showing Date, Group Name, Amount, Transaction ID, and Status |
| **UAT-02** | Verify that summary cards display Total Paid, Total Payments, Groups Participating, and Last Payment Date |
| **UAT-03** | Verify that member can filter contributions by Group Name and only selected group payments are shown |
| **UAT-04** | Verify that member can filter contributions by Status (Confirmed/Pending) and only matching status payments are shown |
| **UAT-05** | Verify that member can export filtered contribution history as CSV file when clicking Download CSV button |
| **UAT-06** | Verify that "No contributions found" message appears when member has no payment records |

---

## Feature Summary

| Feature | Description |
|---------|-------------|
| **Contribution Table** | Displays date, group name, amount, transaction ID, and payment status |
| **Summary Cards** | Shows total paid, total payments, groups participating, and last payment date |
| **Group Filter** | Filter contributions by specific stokvel group |
| **Status Filter** | Filter by Confirmed or Pending status |
| **CSV Export** | Download filtered contribution history as CSV file |
| **Empty State** | Shows message when no payment records exist |
