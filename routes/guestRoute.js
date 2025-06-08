// const express = require('express');
// const router = express.Router();
// const guestController = require('../controllers/guestController');

// router.post('/guest', guestController.handleGuestRequest);
// router.post('/activity', guestController.logGuestActivity);

// module.exports = router;











const express = require('express');
const router = express.Router();
const Guest = require('../models/Guest');
const { v4: uuidv4 } = require('uuid');

router.post('/login', async (req, res) => {
    try {
        const { name } = req.body;
        const guestID = req.cookies.guestID ||"";

        if (!guestID) {
            // New Guest Flow
            const newID = uuidv4();
            // console.log("Generated new guest ID:", newID);
            const ip = req.ip;
            const userAgent = req.headers['user-agent'];
            const deviceFingerprint = `${userAgent}-${ip}`; // Simplified version

            const newGuest = new Guest({
                guestID: newID,
                name: name || '',
                deviceFingerprint,
                ip,
                userAgent
            });

            await newGuest.save();
            return res.status(201).json({ guestID: newID });
        }

        // Existing Guest Flow
        const guest = await Guest.findOne({ guestID });
        if (!guest) {
            return res.status(400).json({ message: 'Invalid guest ID in cookie' });
        }

        guest.lastActive = Date.now();
        await guest.save();
        res.status(200).json({ guestID: guest.guestID });
    } catch (error) {
        console.error('Guest login error:', error.message);
        res.status(500).json({ error: 'Guest login failed', message: error.message });
    }

});

// Get All Guest list
router.get('/guests', async (req, res) => {
    try {
        const guests = await Guest.find();
        res.status(200).json({ guests });
    } catch (error) {
        console.error('Guest list error:', error.message);
        res.status(500).json({ error: 'Guest list failed', message: error.message });
    }
});

// Get Activity Log
router.get('/:guestID', async (req, res) => {
    try {
        const guestID = req.params.guestID;
        const guest = await Guest.findOne({ guestID });
        if (!guest) {
            return res.status(404).json({ error: 'Guest not found' });
        }
        res.status(200).json({ activityLog: guest.activityLog });
    } catch (error) {
        console.error('Guest activity log error:', error.message);
        res.status(500).json({ error: 'Guest activity log failed', message: error.message });
    }
});

// Log guest activity
router.post('/guest-activity', async (req, res) => {
  const { guestID, action, metadata } = req.body;

  try {
    const guest = await Guest.findOne({ guestID });
    if (!guest) return res.status(404).json({ message: 'Guest not found' });

    guest.activityLog.push({ action, metadata }); // timestamp is auto-handled
    guest.lastActive = Date.now();
    await guest.save();

    res.status(200).json({ message: 'Activity logged' });
  } catch (error) {
    console.error('Activity logging error:', error);
    res.status(500).json({ message: 'Failed to log activity' });
  }
});



module.exports = router;