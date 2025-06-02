// // models/Property.js
// const propertySchema = new mongoose.Schema({
//     title: String,
//     description: String,
//     price: Number,
//     type: { type: String, enum: ['sale', 'rent'] },
//     location: {
//       address: String,
//       coordinates: { type: [Number], index: '2dsphere' } // [longitude, latitude]
//     },
//     bedrooms: Number,
//     photos: [String], // Array of image URLs
//     status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
//     rejectionReason: String, // Validator feedback
//     seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//     createdAt: { type: Date, default: Date.now }
//   });







// models/Property.js

const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  type: { type: String, enum: ['sale', 'rent'] },
  location: {
    address: String,
    coordinates: { type: [Number], index: '2dsphere' } // [longitude, latitude]
  },
  bedrooms: Number,
    area: {
    type: Number,
    required: [true, 'Please specify area in square feet'],
  },
  photos: [{
      url: String,
      public_id: String,
    },], // Array of image URLs
     images: [
    {
      url: String,
      public_id: String,
    },
  ],
     videos: [
    {
      url: String,
      public_id: String,
      resource_type: String,
    },
  ],
  status: { type: String, enum: ['active', 'verified', 'Unverified'], default: 'active' },
  rejectionReason: String, // Validator feedback
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Property', propertySchema);
