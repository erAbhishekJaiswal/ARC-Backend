// models/SavedListing.js
const savedListingSchema = new mongoose.Schema({
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: false  }
  });