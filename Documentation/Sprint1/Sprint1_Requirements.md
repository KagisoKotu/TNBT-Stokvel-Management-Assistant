# Scrum 1

# Objectives

1. Define Sprint 1 functional requirements
2. Establish recommended technology stack
3. Document client advice and team guidelines

---

## Meet up with Client

The team must meet with the client once per week. This is mandatory and does not count towards the four internal meetings the team must have.

**Client Advice:**

| Topic | Guideline |
|-------|-----------|
| Daily Meetings | Daily stand-up meetings will be held with team members only (no client involvement) |
| Initial Design Meeting | Meet as soon as possible to design system layouts (UI/structure), outline all core features, and identify how features are connected within the system |

---

## Choose Specifications

**Sprint 1 Functional Requirements:**

| Requirement | Description |
|-------------|-------------|
| Login | Users must be able to log in securely |
| Sign-Up | Users must be able to sign up and select a role during registration |
| Role-Based Dashboards | Login takes users to a different dashboard with UI elements specific to their role. All three user roles must have distinct dashboards |
| Rubric Alignment | Show what is on the rubric and do as much as possible. Recommended to do more than the minimum requirements |

**User Roles Definition:**

The system will have three roles. Responsibilities and permissions of each role must be clearly defined within the system.

| Role | Description |
|------|-------------|
| Admin | System administration and oversight |
| Member | Standard platform user |
| Treasurer | Financial management and tracking |

**Authentication:**

All users (Admin, Member, and Treasurer) will be able to:
- Sign up
- Log in

**Recommended Technology Stack:**

| Component | Recommendation |
|-----------|----------------|
| Language | JavaScript |
| Deployment | Azure (must use for Sprint 1) |
| Authentication | Google Authentication |
| Database | MongoDB |
| Backend Framework | Express.js and Node.js |

*Note: These are the recommended technologies; however, the team may conduct further research and adjust the stack if necessary.*

---

## Create Backlog

**Items added to backlog for Sprint 1:**

- User Sign-Up with role selection (Admin, Member, Treasurer)
- User Login with secure authentication
- Google Authentication integration
- Role-based dashboards (three distinct views)
- Rubric requirements implementation
- MongoDB database setup
- Express.js/Node.js backend implementation
- Azure deployment for Sprint 1
- Initial design meeting (UI/structure, core features, feature connections)
- Daily stand-up meetings (team members only)


