const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { app, connectDB } = require('../server');
const Member = require('../models/Member');
const User = require('../models/User');
const Group = require('../models/Group');

describe('Admin Member Management API', () => {
    let testGroup;
    let testGroupId;
    let mongoServer;

    beforeAll(async () => {
        
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await connectDB(uri);

        
        testGroup = await Group.create({ 
            groupName: "Test Group", 
            adminEmail: "admin@test.com",
            treasurerEmail: "treasurer@test.com",
            contributionAmount: 500,
            frequency: "Monthly"
        });
        testGroupId = testGroup._id.toString();
        


        await User.create({ 
            firebaseUid: "test-uid-12345", 
            name: "Alice Zwane", 
            email: "alice@test.com"
        });
    }, 20000);

    afterEach(async () => {
        
        await Member.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    it('should GET group members with joined user data', async () => {
        
        await Member.create({
            user: "alice@test.com",
            group: "Test Group",
            memberType: "Member"
        });

       
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

        
        const response = await request(app)
            .delete(`/api/managegroup/${testGroupId}/member/${memberToDie._id}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toMatch(/removed/i);

        const check = await Member.findById(memberToDie._id);
        expect(check).toBeNull();
    });

    it('should NOT remove a member if they belong to a different group (Security Check)', async () => {
        
        const safeMember = await Member.create({
            user: "safe@test.com",
            group: "Unauthorized Group", 
            memberType: "Member"
        });

        
        const response = await request(app)
            .delete(`/api/managegroup/${testGroupId}/member/${safeMember._id}`);

       
        expect(response.statusCode).toBe(404);
        
        const check = await Member.findById(safeMember._id);
        expect(check).not.toBeNull(); 
    });

    it('should return 404 for a non-existent member ID', async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const response = await request(app)
            .delete(`/api/managegroup/${testGroupId}/member/${fakeId}`);

        expect(response.statusCode).toBe(404);
    });
});