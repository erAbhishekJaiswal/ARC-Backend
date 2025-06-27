// const express = require('express');
// const router = express.Router();
// const contactController = require('../controllers/contactController');
// const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });

// // Bulk upload VCF file
// router.post('/bulk-upload', upload.single('vcfFile'), contactController.bulkUpload);

// // Single contact operations
// router.post('/', contactController.createContact);
// router.get('/', contactController.getAllContacts);
// router.get('/:id', contactController.getContact);
// router.put('/:id', contactController.updateContact);
// router.delete('/:id', contactController.deleteContact);

// module.exports = router;












const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const multer = require('multer');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Upload Excel route
router.post('/upload', upload.single('file'), contactController.uploadExcel);

// List contacts route
router.get('/', contactController.listContacts);

// Get contact details route
router.get('/:id', contactController.getContactDetails);

// Search contacts route
router.get('/search', contactController.searchContacts);

// filter contacts
router.get('/filter', contactController.filterContacts);


module.exports = router;