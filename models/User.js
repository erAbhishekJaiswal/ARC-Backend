// models/User.js
const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: { type: String, unique: true },
  password: {type: String, required: true},
  role: { type: String, enum: ['admin', 'seller', 'buyer', 'validator', 'broker'], required: true },
  isVerified: { type: Boolean, default: false }, // For OTP verification
  aadhaarNumber: { type: String, sparse: true }, // Seller/Validator only
  panNumber: { type: String, sparse: true, default: false },    // Seller/Validator only
  documents: [{
    type: { type: String, enum: ['aadhaar', 'pan', 'ownership_proof'] }, // 'aadhaar', 'pan', 'ownership_proof'
    url: String
  }],
  banned: { type: Boolean, default: false },
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
const User = mongoose.model('User', UserSchema);
module.exports = User;