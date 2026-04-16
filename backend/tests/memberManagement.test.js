const request = require('supertest');
const app = require('../server');

describe('Admin Member Management API', () => {
    // We use a fake MongoDB ID for testing
    const testGroupId = "65f123abc456def789012345";
    const testUserId = "65f987fed654cba321098765";

    // TEST 1: VIEW (Read)
    it('should GET all members for a specific group', async () => {
        const response = await request(app)
            .get(`/api/groups/${testGroupId}/members`);
        
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
    });

    // TEST 2: ADD (Create)
    it('should ADD a new member to the group', async () => {
        const newMember = { email: "newmember@test.com", role: "member" };
        
        const response = await request(app)
            .post(`/api/groups/${testGroupId}/members`)
            .send(newMember);

        expect(response.statusCode).toBe(201);
        expect(response.body.message).toContain("added successfully");
    });

    // TEST 3: REMOVE (Delete)
    it('should REMOVE a member from the group', async () => {
        const response = await request(app)
            .delete(`/api/groups/${testGroupId}/members/${testUserId}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toContain("removed");
    });
});