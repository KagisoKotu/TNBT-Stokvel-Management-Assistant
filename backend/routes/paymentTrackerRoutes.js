// routes/paymentTrackerRoutes.js
const express = require('express');
const router = express.Router();
const PaymentTrackerController = require('../controllers/PaymentTrackerController');

// Endpoint updated to expect the dynamic groupId parameter
router.get('/:groupId/contributions', PaymentTrackerController.getGroupContributions);

module.exports = router;