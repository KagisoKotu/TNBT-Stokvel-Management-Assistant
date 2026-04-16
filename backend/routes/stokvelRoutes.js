const express = require('express');
const router = express.Router();
const Group = require('../models/Group');
const Member = require('../models/Member');
const nodemailer = require('nodemailer');

// 1. Setup Email Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS 
    }
});

// 2. POST Route: Create Group & Link ALL Roles (Admin, Treasurer, and Members)
router.post('/', async (req, res) => {
    try {
        console.log("--- Processing New Group ---");
        // Destructure all fields including the 'members' array from the UI
        const { groupName, adminId, treasurerId, financials, treasurerDetails, members } = req.body;

        // A. Save Group to MongoDB
        const newGroup = new Group({
            groupName: groupName,
            adminEmail: adminId,
            treasurerEmail: treasurerId,
            contributionAmount: financials.amount,
            frequency: financials.frequency
        });
        await newGroup.save();
        console.log("✅ Group Saved to DB");

        // B. Save Admin as a Member
        await Member.create({
            user: adminId.toLowerCase(),
            group: groupName,
            memberType: 'Admin'
        });
        console.log("✅ Admin Linked to Group");

        // C. Save Treasurer as a Member
        await Member.create({
            user: treasurerId.toLowerCase(),
            group: groupName,
            memberType: 'Treasurer'
        });
        console.log("✅ Treasurer Linked to Group");

        // D. LOOP THROUGH ADDITIONAL MEMBERS AND SAVE THEM
        // This fixes the issue where people added in the "Add Member" section couldn't see the group
        if (members && Array.isArray(members)) {
            for (let m of members) {
                if (m.email && m.email.trim() !== "") {
                    await Member.create({
                        user: m.email.toLowerCase(),
                        group: groupName,
                        memberType: 'Member'
                    });
                    console.log(`✅ Member ${m.email} saved to DB`);

                    // Send Invitation Email to Member
                    const memberMail = {
                        from: process.env.EMAIL_USER,
                        to: m.email,
                        subject: `Invitation to join ${groupName}`,
                        html: `<p>You have been invited to join <b>${groupName}</b> as a member. Log in to your dashboard to see details.</p>`
                    };
                    transporter.sendMail(memberMail).catch(err => console.log("Member Email Error:", err));
                }
            }
        }

        // E. Send the primary Invitation Email to the Treasurer
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: treasurerId,
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
        console.log(`📧 Treasurer Email successfully sent to: ${treasurerId}`);

        res.status(201).json({ message: "Group created and all participants linked!" });

    } catch (err) {
        console.error("❌ Error in Route:", err.message);
        res.status(500).json({ error: "Server error", details: err.message });
    }
});

// 3. GET Route: Fetch groups for ANY user (Admin, Treasurer, or Member)
router.get('/user/:email', async (req, res) => {
    try {
        const userEmail = req.params.email.toLowerCase();
        console.log(`Fetching memberships for: ${userEmail}`);

        // Search the Member table, which now contains Admin, Treasurer, and ALL Members
        const memberships = await Member.find({ user: userEmail });

        if (!memberships || memberships.length === 0) {
            return res.json([]); 
        }

        // Get the names of the groups this user is in
        const groupNames = memberships.map(m => m.group);

        // Fetch the full details from Group table
        const groupDetails = await Group.find({ groupName: { $in: groupNames } });

        // Merge the Group info with the specific user's role
        const results = groupDetails.map(group => {
            const m = memberships.find(membership => membership.group === group.groupName);
            return {
                ...group._doc,
                userRole: m ? m.memberType : 'Member' 
            };
        });

        res.json(results);
    } catch (err) {
        console.error("❌ Error fetching groups:", err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;