// tests/minutesController.test.js
const { saveMinutes } = require('../controllers/minutesController');
const Minute = require('../models/Minute');

// Mock the Mongoose model so we don't hit the real database
jest.mock('../models/Minute');

describe('Minutes Controller - saveMinutes', () => {
  let req, res;

  // Set up the fake Request and Response before every test
  beforeEach(() => {
    req = {
      params: { groupId: 'stokvel-group-123' },
      body: {
        meetingDate: '2026-04-20',
        meetingTime: '15:00',
        contributions: [
          { member: 'Sipho', amount: '500.00', status: 'paid' },
          { member: 'Thabo', amount: '250.00', status: 'partial' }
        ],
        decisions: ['Agreed to increase monthly contributions by R50'],
        notes: 'Great meeting, everyone was on time.'
      }
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  // Clear the mocks after every test to prevent crossover
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully save valid minutes and return 201', async () => {
    // Tell the mock database to successfully resolve the .save() function
    Minute.prototype.save = jest.fn().mockResolvedValue(true);

    await saveMinutes(req, res);

    // Verify the database model was called with the correct extracted data
    expect(Minute).toHaveBeenCalledWith(expect.objectContaining({
      groupId: 'stokvel-group-123',
      meetingDate: '2026-04-20',
      meetingTime: '15:00'
    }));
    
    // Verify the API sent the correct success response back to React
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Minutes saved to the database successfully!'
    }));
  });

  it('should return a 400 error if meetingDate is missing', async () => {
    // Simulate frontend validation failing or being bypassed
    req.body.meetingDate = '';

    await saveMinutes(req, res);

    // Database should NOT be called
    expect(Minute.prototype.save).not.toHaveBeenCalled();
    
    // API should return the bad request status
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ 
      message: 'Meeting date and time are required.' 
    });
  });

  it('should return a 400 error if meetingTime is missing', async () => {
    req.body.meetingTime = '';

    await saveMinutes(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should return a 500 error if the database save fails', async () => {
    // Simulate MongoDB crashing or dropping the connection
    Minute.prototype.save = jest.fn().mockRejectedValue(new Error('Database Connection Failed'));

    await saveMinutes(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ 
      message: 'Server error: Could not save minutes. Please try again.' 
    });
  });
});
