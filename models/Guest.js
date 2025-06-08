// const mongoose = require('mongoose');

// const guestSchema = new mongoose.Schema({
//   guestId: { type: String, required: true, unique: true },
//   createdAt: { type: Date, default: Date.now, expires: '30d' }, // Auto-delete after 30 days
//   lastActive: { type: Date, default: Date.now },
//   deviceFingerprint: String,
//   ipAddress: String,
//   userAgent: String,
//   activityLog: [{
//     action: String,
//     timestamp: { type: Date, default: Date.now },
//     metadata: mongoose.Schema.Types.Mixed
//   }]
// });

// // Update lastActive timestamp on each activity
// guestSchema.methods.updateActivity = function(action, metadata) {
//   this.lastActive = Date.now();
//   this.activityLog.push({ action, metadata });
//   return this.save();
// };

// module.exports = mongoose.model('Guest', guestSchema);















const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema({
  guestID: { type: String, required: true, unique: true },
  name: { type: String },
  deviceFingerprint: { type: String },
  ip: { type: String },
  userAgent: { type: String },
  lastActive: { type: Date, default: Date.now },
    activityLog: [{
    action: String,
    timestamp: { type: Date, default: Date.now },
    metadata: mongoose.Schema.Types.Mixed
  }]
});

module.exports = mongoose.model('Guest', guestSchema);
