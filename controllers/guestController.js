// const Guest = require('../models/Guest');
// const { v4: uuidv4 } = require('uuid');
// const fingerprintjs = require('@fingerprintjs/fingerprintjs');

// exports.handleGuestRequest = async (req, res) => {
//   try {
//     // const { guestId } = req.body;
//     if (!req.body) {
//       return res.status(400).json({ error: 'Request body is missing' });
//     }

//     const { guestId } = req.body || {};  

//     const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
//     const userAgent = req.headers['user-agent'];
    
//     // Generate device fingerprint (simplified)
//     const fpPromise = fingerprintjs.load();
//     const fp = await fpPromise;
//     const result = await fp.get();
//     const deviceFingerprint = result.visitorId;

//     if (guestId) {
//       const guest = await Guest.findOneAndUpdate(
//         { guestId },
//         { 
//           lastActive: Date.now(),
//           $push: { 
//             activityLog: { 
//               action: 'session_renewal',
//               metadata: { ip, userAgent } 
//             } 
//           }
//         },
//         { new: true }
//       );

//       if (guest) return res.json({ guestId, isReturning: true });
//     }

//     // Create new guest
//     const newGuestId = `guest_${uuidv4()}`;
//     const newGuest = new Guest({
//       guestId: newGuestId,
//       deviceFingerprint,
//       ipAddress: ip,
//       userAgent,
//       activityLog: [{
//         action: 'initial_login',
//         metadata: { ip, userAgent }
//       }]
//     });

//     await newGuest.save();
//     res.json({ guestId: newGuestId, isReturning: false });
    
//   } catch (error) {
//     console.error('Guest tracking error:', error);
//     res.status(500).json({ error: 'Guest tracking failed' });
//   }
// };

// exports.logGuestActivity = async (guestId, action, metadata = {}) => {
//   try {
//     await Guest.findOneAndUpdate(
//       { guestId },
//       { 
//         $push: { 
//           activityLog: { 
//             action,
//             metadata,
//             timestamp: Date.now()
//           } 
//         },
//         lastActive: Date.now()
//       }
//     );
//   } catch (error) {
//     console.error('Activity logging failed:', error);
//   }
// };

// exports.getGuestActivityLog = async (guestId) => {
//   try {
//     const guest = await Guest.findOne({ guestId });
//     if (!guest) return null;
//     return res.status(200).json({ activityLog: guest.activityLog });
//     // return guest ? guest.activityLog ;
//   } catch (error) {
//     console.error('Activity log retrieval failed:', error);
//     return null;
//   }
// };












