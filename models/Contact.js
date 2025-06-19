// const mongoose = require('mongoose');

// const ContactSchema = new mongoose.Schema({
//   firstName: {
//     type: String,
//     // required: true
//   },
//   lastName: {
//     type: String
//   },
//   emails: [{
//     type: String
//   }],
//   phones: [{
//     number: {
//       type: String,
//     },
//     type: {
//       type: String,
//       enum: ['mobile', 'work', 'home', 'other'],
//       default: 'mobile'
//     }
//   }],
//   organization: {
//     type: String,
//     default: ''
//   },
//   title: {
//     type: String,
//     default: ''
//   },
//   address: {
//     type: String
//   },
//   note: {
//     type: String
//   },
//   vcfData: {
//     type: String,
//     // required: true
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// module.exports = mongoose.model('Contact', ContactSchema);







const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  displayName: String,
  nickname: String,
  emailAddress: String,
  email2Address: String,
  email3Address: String,
  homePhone: String,
  businessPhone: String,
  homeFax: String,
  businessFax: String,
  pager: String,
  mobilePhone: String,
  homeStreet: String,
  homeAddress2: String,
  homeCity: String,
  homeState: String,
  homePostalCode: String,
  homeCountry: String,
  businessAddress: String,
  businessAddress2: String,
  businessCity: String,
  businessState: {type:String, required: false},
  businessPostalCode: {type:String, required: false},
  businessCountry: {type:String, required: false},
  countryCode: {type:String, required: false},
  relatedName: {type:String, required: false},
  jobTitle: {type:String, required: false},
  department: {type:String, required: false},
  organization: {type:String, required: false},
  notes: {type:String, required: false},
  birthday: {type:Date, required: false},
  anniversary:{type:Date, required: false},
  gender: {type:String, required: false},
  webPage: {type:String, required: false},
  webPage2: {type:String, required: false},
  categories: {type:String, required: false},
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);