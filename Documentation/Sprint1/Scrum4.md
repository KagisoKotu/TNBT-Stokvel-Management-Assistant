# Scrum 1

# Objectives

1. Define core system functionality and user flow
2. Establish group creation and member invitation process
3. Define role-based access and redirection logic

---

## Meet up with Client

Following the review of the allocated project (Stokvel Management Platform), the team held a follow-up discussion to define the core system functionality, group management processes, and role-based access controls. The client was not present at this internal design meeting, but the outcomes align with the previously agreed Sprint 1 requirements.

---

## Choose Specifications

**Core System Functionality and User Flow:**

The team outlined the primary functionality of the system and the expected user journey:

| Step | Action |
|------|--------|
| 1 | Users who are not yet registered must be able to sign up for an account |
| 2 | Registered users must be able to log in securely |
| 3 | Upon successful login, users will be redirected to a home page/dashboard where they will be able to view all stokvel groups they are currently a member of |
| 4 | Users can create a new stokvel group |
| 5 | Users automatically become a member of any group they create |

**Group Creation and Member Invitation Process:**

| Step | Action |
|------|--------|
| 1 | When creating a group, the user must be able to invite other members by entering their email addresses |
| 2 | Invited members will receive an email invitation to join the group |
| 3 | Upon accepting the invitation, users will be redirected to the platform |
| 4 | They will either log in (if already registered) or sign up (if new users) |

**Role-Based Access and Redirection:**

| Step | Action |
|------|--------|
| 1 | When a user selects a group they belong to, they will be redirected to a role-specific dashboard |
| 2 | The system will determine the user's role within the selected group (e.g., Admin, Treasurer, or Member) |
| 3 | Based on the assigned role, the user will have access to the appropriate features and permissions |

---

## Create Backlog

**Items added to backlog for Stokvel Management Platform:**

- User sign-up and secure login
- Home page/dashboard displaying user's stokvel groups
- Group creation functionality
- Auto-enrollment of group creator as a member
- Email invitation system for new members
- Invite acceptance flow with login/sign-up redirect
- Role-based dashboard views (Admin, Treasurer, Member)
- Role determination logic per selected group

## Evidence

![evidence](S14.jpeg)

