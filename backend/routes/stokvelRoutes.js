const express = require('express');
const router = express.Router();
const Group = require('../models/Group');
const Member = require('../models/Member');
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS 
    }
});


router.post('/', async (req, res) => {
    try {
        console.log("--- Processing New Group ---");
        const { groupName, adminId, treasurerId, financials, treasurerDetails } = req.body;

        // Save Group to MongoDB
        const newGroup = new Group({
            groupName: groupName,
            adminEmail: adminId,
            treasurerEmail: treasurerId,
            contributionAmount: financials.amount,
            frequency: financials.frequency
        });
        await newGroup.save();
        console.log("✅ Group Saved to DB");

        const adminMember = new Member({
            user: adminId,
            group: groupName,
            memberType: 'Admin'
        });
        await adminMember.save();
        console.log("✅ Admin Linked to Group");

        // 3. SEND THE EMAIL
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: treasurerId, // Sending to the Treasurer's email entered in the form
            subject: `Invitation to join ${groupName}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #eee; padding: 20px;">
                    <h2 style="color: #8b5cf6;">Stokvel Invitation</h2>
                    <p>Hi <strong>${treasurerDetails.firstName}</strong>,</p>
                    <p>You have been appointed as the <b>Treasurer</b> for the new group: <strong>${groupName}</strong>.</p>
                    <hr />
                    <p><strong>Contribution:</strong> R${financials.amount}</p>
                    <p><strong>Frequency:</strong> ${financials.frequency}</p>
                    <hr />
                    <p>Please log in to the Stokvel Stockie app to manage the payouts.</p>
                    <br />
                    <p>Regards,<br/>The Stokvel Team</p>
                </div>
            `
        };

       
        await transporter.sendMail(mailOptions);
        console.log(`📧 Email successfully sent to: ${treasurerId}`);

        res.status(201).json({ message: "Group created and invitation sent!" });

    } catch (err) {
        console.error("❌ Error in Route:", err.message);
        res.status(500).json({ error: "Server error", details: err.message });
    }
});


router.get('/user/:email', async (req, res) => {
    try {
        const groups = await Group.find({ adminEmail: req.params.email });
        res.json(groups);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;