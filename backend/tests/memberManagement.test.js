const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); 
const Member = require('../models/Member');
const User = require('../models/User');
const Group = require('../models/Group');

describe('Admin Member Management API', () => {
    let testGroup;
    let testGroupId;

    beforeAll(async () => {
        // Clean state for testing
        await Group.deleteMany({});
        await User.deleteMany({});
        await Member.deleteMany({});

        // 1. Setup Test Group
        testGroup = await Group.create({ 
            groupName: "Test Group", 
            adminEmail: "admin@test.com",
            treasurerEmail: "treasurer@test.com",
            contributionAmount: 500,
            frequency: "Monthly"
        });
        testGroupId = testGroup._id.toString();
        
        // 2. Setup Test User
        await User.create({ 
            name: "Alice Zwane", 
            email: "alice@test.com"
        });
    }, 10000);

    afterEach(async () => {
        // Clear members after each test to prevent cross-contamination
        await Member.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should GET group members with joined user data', async () => {
        // Seed a member
        await Member.create({
            user: "alice@test.com",
            group: "Test Group",
            memberType: "Member"
        });

        // FIXED PATH: Matches router.get('/:groupId/members')
        const response = await request(app).get(`/api/managegroup/${testGroupId}/members`);
        
        expect(response.statusCode).toBe(200);
        expect(response.body.group.groupName).toBe("Test Group");
        expect(response.body.members[0].userEmail).toBe("alice@test.com");
        expect(response.body.members[0].displayName).toBe("Alice Zwane"); 
    });

    it('should REMOVE a member successfully', async () => {
        const memberToDie = await Member.create({
            user: "remove-me@test.com",
            group: "Test Group",
            memberType: "Member"
        });

        // FIXED PATH: Matches router.delete('/:groupId/member/:memberId')
        const response = await request(app)
            .delete(`/api/managegroup/${testGroupId}/member/${memberToDie._id}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toMatch(/removed/i);

        const check = await Member.findById(memberToDie._id);
        expect(check).toBeNull();
    });

    it('should NOT remove a member if they belong to a different group (Security Check)', async () => {
        // Create a member belonging to a different group name
        const safeMember = await Member.create({
            user: "safe@test.com",
            group: "Unauthorized Group", 
            memberType: "Member"
        });

        // Attempt to delete them using the Test Group's context
        const response = await request(app)
            .delete(`/api/managegroup/${testGroupId}/member/${safeMember._id}`);

        // Should be 404 because the route filters by { _id, group: group.groupName }
        expect(response.statusCode).toBe(404);
        
        const check = await Member.findById(safeMember._id);
        expect(check).not.toBeNull(); // Member should still exist
    });

    it('should return 404 for a non-existent member ID', async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const response = await request(app)
            .delete(`/api/managegroup/${testGroupId}/member/${fakeId}`);

        expect(response.statusCode).toBe(404);
    });
});