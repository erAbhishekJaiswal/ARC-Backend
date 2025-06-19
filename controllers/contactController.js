// const Contact = require('../models/Contact');
// const vcard = require('vcard-parser');
// const fs = require('fs');

// // Helper function to parse VCF data
// // const parseVcfData = (vcfData) => {
// //   const card = vcard.parse(vcfData);
  
// //   // Extract phones with their types
// //   const phones = [];
// //   if (card.phone) {
// //     if (Array.isArray(card.phone)) {
// //       card.phone.forEach(phone => {
// //         phones.push({
// //           number: phone.value,
// //           type: phone.type || 'mobile'
// //         });
// //       });
// //     } else {
// //       phones.push({
// //         number: card.phone,
// //         type: 'mobile'
// //       });
// //     }
// //   }

// //   // Extract emails
// //   const emails = [];
// //   if (card.email) {
// //     if (Array.isArray(card.email)) {
// //       emails.push(...card.email);
// //     } else {
// //       emails.push(card.email);
// //     }
// //   }

// //   return {
// //     firstName: card.firstName || '',
// //     lastName: card.lastName || '',
// //     emails,
// //     phones,
// //     organization: card.organization || '',
// //     title: card.title || '',
// //     address: card.address || '',
// //     note: card.note || '',
// //     vcfData: card.rawData || vcfData
// //   };
// // };

// // const parseVcfData = (vcfData) => {
// //   const card = vcard.parse(vcfData);
  
// //   // Extract firstName and lastName (handle array cases)
// //   let firstName = '';
// //   let lastName = '';
  
// //   if (Array.isArray(card.firstName)) {
// //     firstName = card.firstName[0].value || '';
// //   } else if (card.firstName) {
// //     firstName = card.firstName;
// //   }
  
// //   if (Array.isArray(card.lastName)) {
// //     lastName = card.lastName[0].value || '';
// //   } else if (card.lastName) {
// //     lastName = card.lastName;
// //   }

// //   // Extract title (handle array case)
// //   let title = '';
// //   if (Array.isArray(card.title)) {
// //     title = card.title[0].value || '';
// //   } else if (card.title) {
// //     title = card.title;
// //   }

// //   // Extract organization (handle array case)
// //   let organization = '';
// //   if (Array.isArray(card.organization)) {
// //     organization = card.organization[0].value || '';
// //   } else if (card.organization) {
// //     organization = card.organization;
// //   }

// //   // Extract phones with their types
// //   const phones = [];
// //   if (card.phone) {
// //     const phoneArray = Array.isArray(card.phone) ? card.phone : [card.phone];
// //     phoneArray.forEach(phone => {
// //       if (phone && phone.value) {
// //         phones.push({
// //           number: phone.value,
// //           type: phone.type || 'mobile'
// //         });
// //       } else if (phone) {
// //         phones.push({
// //           number: phone,
// //           type: 'mobile'
// //         });
// //       }
// //     });
// //   }

// //   // Extract emails
// //   const emails = [];
// //   if (card.email) {
// //     const emailArray = Array.isArray(card.email) ? card.email : [card.email];
// //     emailArray.forEach(email => {
// //       if (email && email.value) {
// //         emails.push(email.value);
// //       } else if (email) {
// //         emails.push(email);
// //       }
// //     });
// //   }

// //   return {
// //     firstName,
// //     lastName,
// //     emails,
// //     phones,
// //     organization,
// //     title,
// //     address: card.address || '',
// //     note: card.note || '',
// //     vcfData: card.rawData || vcfData
// //   };
// // };

// const parseVcfData = (vcfData) => {
//   // First clean the vcfData to prevent parsing issues
//   const cleanedVcfData = vcfData.replace(/\r?\n/g, '\r\n').replace(/\r\r/g, '\r');

//   try {
//     const card = vcard.parse(cleanedVcfData);

//     // Helper function to safely extract string values
//     const getStringValue = (value) => {
//       if (!value) return '';
//       if (Array.isArray(value)) {
//         // Handle array of strings
//         if (typeof value[0] === 'string') {
//           return value.join(', '); // Combine multiple values
//         }
//         // Handle array of objects with value property
//         if (value[0] && typeof value[0] === 'object' && value[0].value) {
//           return value.map(v => v.value).join(', ');
//         }
//         return value[0].toString();
//       }
//       if (typeof value === 'object' && value.value) {
//         return value.value;
//       }
//       return value.toString();
//     };

//     // Process phones
//     // const phones = [];
//     // if (card.phone) {
//     //   const phoneArray = Array.isArray(card.phone) ? card.phone : [card.phone];
//     //   phoneArray.forEach(phone => {
//     //     const number = getStringValue(phone).replace(/\D/g, ''); // Clean phone number
//     //     if (number) {
//     //       phones.push({
//     //         number,
//     //         type: (phone.type || 'mobile').toString().toLowerCase()
//     //       });
//     //     }
//     //   });
//     // }

//       // Improved phone number extraction
//     const phones = [];
//     if (card.phone) {
//       const phoneArray = Array.isArray(card.phone) ? card.phone : [card.phone];
//       phoneArray.forEach(phone => {
//         try {
//           let number = '';
//           if (typeof phone === 'object' && phone.value) {
//             number = phone.value;
//           } else if (typeof phone === 'string') {
//             number = phone;
//           }
          
//           // Clean and validate phone number
//           number = number.replace(/\D/g, ''); // Remove non-digit characters
//           if (number.length >= 7) {  // Basic validation for phone numbers
//             phones.push({
//               number,
//               type: (phone.type || 'mobile').toString().toLowerCase()
//             });
//           }
//         } catch (e) {
//           console.log('Error processing phone:', e);
//         }
//       });
//     }

//     // Process emails
//     const emails = [];
//     if (card.email) {
//       const emailArray = Array.isArray(card.email) ? card.email : [card.email];
//       emailArray.forEach(email => {
//         const emailValue = getStringValue(email).trim().toLowerCase();
//         if (emailValue) {
//           emails.push(emailValue);
//         }
//       });
//     }

//     // Build contact object
//     return {
//       firstName: getStringValue(card.firstName),
//       lastName: getStringValue(card.lastName),
//       emails,
//       phones,
//       organization: getStringValue(card.organization),
//       title: getStringValue(card.title),
//       address: getStringValue(card.address),
//       note: getStringValue(card.note),
//       vcfData: card.rawData || vcfData
//     };
//   } catch (error) {
//     console.error('Error parsing vCard:', error);
//     // Return minimal valid contact if parsing fails
//     return {
//       firstName: '',
//       lastName: '',
//       emails: [],
//       phones: [],
//       organization: '',
//       title: '',
//       address: '',
//       note: '',
//       vcfData: vcfData
//     };
//   }
// };

// // Bulk upload VCF file
// // exports.bulkUpload = async (req, res) => {
// //   try {
// //     if (!req.file) {
// //       return res.status(400).json({ message: 'No VCF file uploaded' });
// //     }

// //     const fileContent = fs.readFileSync(req.file.path, 'utf-8');
// //     const cards = vcard.parse(fileContent);

// //     const contacts = cards.map(card => {
// //       const vcfData = card.rawData || JSON.stringify(card);
// //       return parseVcfData(vcfData);
// //     });

// //     const savedContacts = await Contact.insertMany(contacts);
    
// //     // Clean up the uploaded file
// //     fs.unlinkSync(req.file.path);

// //     res.status(201).json({
// //       message: 'Contacts uploaded successfully',
// //       count: savedContacts.length,
// //       contacts: savedContacts
// //     });
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ message: 'Server error', error: error.message });
// //   }
// // };

// // exports.bulkUpload = async (req, res) => {
// //   try {
// //     if (!req.file) {
// //       return res.status(400).json({ message: 'No VCF file uploaded' });
// //     }

// //     const fileContent = fs.readFileSync(req.file.path, 'utf-8');
    
// //     // Split the file content into individual vCards
// //     const vcardSeparator = 'END:VCARD';
// //     const individualCards = fileContent
// //       .split(vcardSeparator)
// //       .map(card => card.trim() + (card.trim() ? vcardSeparator : ''))
// //       .filter(card => card.trim().length > 0);

// //     const contacts = [];
    
// //     for (const cardContent of individualCards) {
// //       try {
// //         const contactData = parseVcfData(cardContent);
// //         contacts.push(contactData);
// //       } catch (error) {
// //         console.error('Error parsing vCard:', error);
// //         // Continue with next card even if one fails
// //       }
// //     }

// //     const savedContacts = await Contact.insertMany(contacts);
    
// //     // Clean up the uploaded file
// //     fs.unlinkSync(req.file.path);

// //     res.status(201).json({
// //       message: 'Contacts uploaded successfully',
// //       count: savedContacts.length,
// //       contacts: savedContacts
// //     });
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ message: 'Server error', error: error.message });
// //   }
// // };

// exports.bulkUpload = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: 'No VCF file uploaded' });
//     }

//     const fileContent = fs.readFileSync(req.file.path, 'utf-8');
    
//     // Improved vCard splitting that handles various formats
//     const vcardSeparator = 'END:VCARD\r\n';
//     const individualCards = fileContent
//       .split(/(END:VCARD\r?\n)/gi)
//       .reduce((acc, part, i, arr) => {
//         if (i % 2 === 0) {
//           const card = part + (arr[i+1] || '');
//           if (card.trim().length > 0) {
//             acc.push(card.trim());
//           }
//         }
//         return acc;
//       }, [])
//       .filter(card => card.includes('BEGIN:VCARD'));

//     // const contacts = [];
//     // const errors = [];
    
//     // for (const [index, cardContent] of individualCards.entries()) {
//     //   try {
//     //     const contactData = parseVcfData(cardContent);
//     //     if (contactData.phones.length > 0 || contactData.emails.length > 0) {
//     //       contacts.push(contactData);
//     //     } else {
//     //       errors.push(`Card ${index + 1}: No valid contact information found`);
//     //     }
//     //   } catch (error) {
//     //     errors.push(`Card ${index + 1}: ${error.message}`);
//     //   }
//     // }

//        const contacts = [];
//     const errors = [];
//     const skipped = [];
    
//     for (const [index, cardContent] of individualCards.entries()) {
//       try {
//         const contactData = parseVcfData(cardContent);
        
//         if (!contactData) {
//           errors.push(`Card ${index + 1}: Failed to parse vCard`);
//           continue;
//         }

//         // Accept contacts with either phones OR emails
//         if (contactData.phones.length > 0 || contactData.emails.length > 0) {
//           contacts.push(contactData);
//         } else {
//           skipped.push(`Card ${index + 1}: No valid contact information (neither phone nor email)`);
//         }
//       } catch (error) {
//         errors.push(`Card ${index + 1}: ${error.message}`);
//       }
//     }

//     if (contacts.length === 0) {
//       throw new Error('No valid contacts found in the file');
//     }

//     const savedContacts = await Contact.insertMany(contacts);
    
//     // Clean up the uploaded file
//     fs.unlinkSync(req.file.path);

//     res.status(201).json({
//       message: 'Contacts uploaded successfully',
//       count: savedContacts.length,
//       contacts: savedContacts,
//       errors: errors.length > 0 ? errors : undefined
//     });
//   } catch (error) {
//     console.error('Bulk upload error:', error);
//     if (req.file) {
//       try { fs.unlinkSync(req.file.path); } catch (e) {}
//     }
//     res.status(500).json({ 
//       message: 'Server error',
//       error: error.message,
//       details: error.errors
//     });
//   }
// };

// // Create single contact
// exports.createContact = async (req, res) => {
//   try {
//     const { vcfData } = req.body;
    
//     if (!vcfData) {
//       return res.status(400).json({ message: 'VCF data is required' });
//     }

//     const contactData = parseVcfData(vcfData);
//     const contact = new Contact(contactData);
//     await contact.save();

//     res.status(201).json(contact);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// // Get all contacts
// exports.getAllContacts = async (req, res) => {
//   try {
//     const { page = 1, limit = 10 } = req.query;
//     const contacts = await Contact.find()
//       .sort({ createdAt: -1 })
//       .limit(limit * 1)
//       .skip((page - 1) * limit)
//       .exec();

//     const count = await Contact.countDocuments();

//     res.json({
//       contacts,
//       totalPages: Math.ceil(count / limit),
//       currentPage: page
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// // Get single contact
// exports.getContact = async (req, res) => {
//   try {
//     const contact = await Contact.findById(req.params.id);
//     if (!contact) {
//       return res.status(404).json({ message: 'Contact not found' });
//     }
//     res.json(contact);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// // Update contact
// exports.updateContact = async (req, res) => {
//   try {
//     const contact = await Contact.findByIdAndUpdate(
//       req.params.id,
//       { ...req.body, updatedAt: Date.now() },
//       { new: true }
//     );
//     if (!contact) {
//       return res.status(404).json({ message: 'Contact not found' });
//     }
//     res.json(contact);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// // Delete contact
// exports.deleteContact = async (req, res) => {
//   try {
//     const contact = await Contact.findByIdAndDelete(req.params.id);
//     if (!contact) {
//       return res.status(404).json({ message: 'Contact not found' });
//     }
//     res.json({ message: 'Contact deleted successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };







// const Contact = require('../models/Contact');
// const xlsx = require('xlsx');
// const fs = require('fs');

// // Upload Excel and process data
// exports.uploadExcel = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: 'No file uploaded' });
//     }

//     const workbook = xlsx.readFile(req.file.path);
//     const sheetName = workbook.SheetNames[0];
//     const worksheet = workbook.Sheets[sheetName];
//     const jsonData = xlsx.utils.sheet_to_json(worksheet);

//     // Map Excel columns to schema fields
//     const mappedData = jsonData.map(item => ({
//       firstName: item['First Name'] || '',
//       lastName: item['Last Name'] || '',
//       displayName: item['Display Name'] || '',
//       nickname: item['Nickname'] || '',
//       emailAddress: item['E-mail Address'] || '',
//       email2Address: item['E-mail 2 Address'] || '',
//       email3Address: item['E-mail 3 Address'] || '',
//       homePhone: item['Home Phone'] || '',
//       businessPhone: item['Business Phone'] || '',
//       homeFax: item['Home Fax'] || '',
//       businessFax: item['Business Fax'] || '',
//       pager: item['Pager'] || '',
//       mobilePhone: item['Mobile Phone'] || '',
//       homeStreet: item['Home Street'] || '',
//       homeAddress2: item['Home Address 2'] || '',
//       homeCity: item['Home City'] || '',
//       homeState: item['Home State'] || '',
//       homePostalCode: item['Home Postal Code'] || '',
//       homeCountry: item['Home Country'] || '',
//       businessAddress: item['Business Address'] || '',
//       businessAddress2: item['Business Address 2'] || '',
//       businessCity: item['Business City'] || '',
//       businessState: item['Business State'] || '',
//       businessPostalCode: item['Business Postal Code'] || '',
//       businessCountry: item['Business Country'] || '',
//       countryCode: item['Country Code'] || '',
//       relatedName: item['Related name'] || '',
//       jobTitle: item['Job Title'] || '',
//       department: item['Department'] || '',
//       organization: item['Organization'] || '',
//       notes: item['Notes'] || '',
//       birthday: item['Birthday'] || null,
//       anniversary: item['Anniversary'] || null,
//       gender: item['Gender'] || '',
//       webPage: item['Web Page'] || '',
//       webPage2: item['Web Page 2'] || '',
//       categories: item['Categories'] || ''
//     }));

//     // Insert into MongoDB
//     await Contact.insertMany(mappedData);

//     // Delete the uploaded file
//     fs.unlinkSync(req.file.path);

//     res.status(201).json({ 
//       message: 'Data uploaded successfully', 
//       count: mappedData.length 
//     });
//   } catch (error) {
//     console.error('Error uploading data:', error);
//     res.status(500).json({ message: 'Error processing file', error: error.message });
//   }
// };



const Contact = require('../models/Contact');
const xlsx = require('xlsx');
const fs = require('fs');
const moment = require('moment'); // Add moment.js for better date handling

// Helper function to parse dates
const parseDate = (dateString) => {
  if (!dateString) return null;
  
  // Handle Excel serial date numbers
  if (typeof dateString === 'number') {
    return moment(new Date((dateString - 25569) * 86400 * 1000)).toDate();
  }

  // Handle string dates
  if (typeof dateString === 'string') {
    // Try various date formats
    const formats = [
      'YYYY-MM-DD HH:mm:ss',
      'MMDD-YY-DD HH:mm:ss', // For values like "0308-00-00 00:00:00"
      'YYYY/MM/DD',
      'DD-MM-YYYY',
      'MM-DD-YYYY',
      'YYYYMMDD',
      'X' // Unix timestamp
    ];

    for (const format of formats) {
      const date = moment(dateString, format, true);
      if (date.isValid()) {
        return date.toDate();
      }
    }
  }

  return null; // Return null for invalid dates
};

exports.uploadExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(worksheet);

    // Map Excel columns to schema fields with better date handling
    const mappedData = jsonData.map(item => {
      // Clean data - trim strings and handle empty values
      const cleanData = {};
      for (const key in item) {
        if (typeof item[key] === 'string') {
          cleanData[key] = item[key].trim();
        } else {
          cleanData[key] = item[key];
        }
      }

      return {
        firstName: cleanData['First Name'] || '',
        lastName: cleanData['Last Name'] || '',
        displayName: cleanData['Display Name'] || '',
        nickname: cleanData['Nickname'] || '',
        emailAddress: cleanData['E-mail Address'] || '',
        email2Address: cleanData['E-mail 2 Address'] || '',
        email3Address: cleanData['E-mail 3 Address'] || '',
        homePhone: cleanData['Home Phone'] || '',
        businessPhone: cleanData['Business Phone'] || '',
        homeFax: cleanData['Home Fax'] || '',
        businessFax: cleanData['Business Fax'] || '',
        pager: cleanData['Pager'] || '',
        mobilePhone: cleanData['Mobile Phone'] || '',
        homeStreet: cleanData['Home Street'] || '',
        homeAddress2: cleanData['Home Address 2'] || '',
        homeCity: cleanData['Home City'] || '',
        homeState: cleanData['Home State'] || '',
        homePostalCode: cleanData['Home Postal Code'] || '',
        homeCountry: cleanData['Home Country'] || '',
        businessAddress: cleanData['Business Address'] || '',
        businessAddress2: cleanData['Business Address 2'] || '',
        businessCity: cleanData['Business City'] || '',
        businessState: cleanData['Business State'] || '',
        businessPostalCode: cleanData['Business Postal Code'] || '',
        businessCountry: cleanData['Business Country'] || '',
        countryCode: cleanData['Country Code'] || '',
        relatedName: cleanData['Related name'] || '',
        jobTitle: cleanData['Job Title'] || '',
        department: cleanData['Department'] || '',
        organization: cleanData['Organization'] || '',
        notes: cleanData['Notes'] || '',
        birthday: parseDate(cleanData['Birthday']),
        anniversary: parseDate(cleanData['Anniversary']),
        gender: cleanData['Gender'] || '',
        webPage: cleanData['Web Page'] || '',
        webPage2: cleanData['Web Page 2'] || '',
        categories: cleanData['Categories'] || ''
      };
    });

    // Insert into MongoDB with error handling for each document
    let successfulCount = 0;
    const errors = [];
    
    for (const contactData of mappedData) {
      try {
        const contact = new Contact(contactData);
        await contact.save();
        successfulCount++;
      } catch (error) {
        errors.push({
          rowData: contactData,
          error: error.message
        });
      }
    }

    // Delete the uploaded file
    fs.unlinkSync(req.file.path);

    res.status(201).json({ 
      message: 'Data upload completed',
      successfulCount,
      errorCount: errors.length,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Error uploading data:', error);
    
    // Clean up file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ 
      message: 'Error processing file', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// List all contacts with pagination
exports.listContacts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
      const search = req.query.search || '';

    // const contacts = await Contact.find()
    //   .skip(skip)
    //   .limit(limit)
    //   .sort({ createdAt: -1 });

    const query = {
    $or: [
      { firstName: new RegExp(search, 'i') },
      { lastName: new RegExp(search, 'i') },
      { mobilePhone: new RegExp(search, 'i') }
    ]
  };

  const total = await Contact.countDocuments(query);
  const contacts = await Contact.find(query)
    .skip(skip)
    .limit(limit)
    .lean();

    // const total = await Contact.countDocuments();

    res.status(200).json({
      contacts,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contacts', error: error.message });
  }
};

// Get single contact details
exports.getContactDetails = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contact details', error: error.message });
  }
};

// Search contacts
exports.searchContacts = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const contacts = await Contact.find({
      $or: [
        { firstName: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } },
        { displayName: { $regex: query, $options: 'i' } },
        { emailAddress: { $regex: query, $options: 'i' } },
        { mobilePhone: { $regex: query, $options: 'i' } },
        { organization: { $regex: query, $options: 'i' } }
      ]
    }).limit(50);

    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Error searching contacts', error: error.message });
  }
};