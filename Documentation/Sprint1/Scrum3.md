# Scrum 3

# Objectives

1. Capture client requirements for Sprint 1
2. Define recommended technology stack
3. Establish client expectations and meeting cadence

---

## Meet up with Client

This document captures the requirements and recommendations communicated by the client (tutor) during the Sprint 1 requirements meeting. All items below represent agreed-upon expectations and guidance for the development team.

**Weekly Client Meeting:** The team must meet with the client once per week. This meeting is mandatory and does not count towards the required four internal team meetings.

**Client Recommendations and Advice:**

- Daily stand-up meetings must be held amongst team members only, without client involvement
- The team should meet as soon as possible to design system layouts (UI and structure)
- Outline all core system features and identify how they are interconnected

---

## Choose Specifications

**Sprint 1 Functional Requirements:**

| Requirement | Description |
|-------------|-------------|
| User Login | Registered users must be able to log in securely |
| User Sign-Up | New users must be able to register and select a role during the sign-up process |
| Role-Based Dashboards | Upon login, users must be redirected to a dashboard with UI elements specific to their assigned role. All three user roles must have distinct dashboard views |
| Rubric Alignment | The system must address all items listed on the rubric, with the team encouraged to exceed the minimum requirements where possible |

**User Roles Defined:**

| Role | Responsibilities |
|------|------------------|
| Admin | System administration and oversight |
| Member | Standard platform user |
| Treasurer | Financial management and tracking |

**Authentication Requirements:**

All user roles (Admin, Member, and Treasurer) must be able to:
- Sign up for an account
- Log in to the system

**Recommended Technology Stack:**

| Component | Recommendation |
|-----------|----------------|
| Language & Deployment | JavaScript, deployed on Microsoft Azure (mandatory for Sprint 1) |
| Authentication | Google Authentication |
| Database | MongoDB |
| Backend Framework | Express.js and Node.js |

*Note: While these are the advised defaults, the team may conduct further research and adjust the stack if there is sufficient justification.*

---

## Create Backlog

**Items added to backlog for Sprint 1:**

- User Sign-Up with role selection (Admin, Member, Treasurer)
- User Login with secure authentication
- Google Authentication integration
- Role-based dashboards (three distinct views)
- MongoDB database setup
- Express.js/Node.js backend implementation
- Azure deployment configuration
- Initial UI/UX design meeting

## Evidence

![evidence](S13.jpeg)
