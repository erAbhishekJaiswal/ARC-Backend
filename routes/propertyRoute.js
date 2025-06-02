// const express = require('express');
// const router = express.Router();
// const propertyController = require('../controllers/propertyController');

// Create a new property
// router.post('/post', propertyController.createProperty);

// // Get all properties
// router.get('/list', propertyController.getAllProperties);

// // Get single property by ID
// router.get('/:id', propertyController.getPropertyById);

// module.exports = router;








const express = require('express');
const {
  createProperty,
  getProperties,
  getProperty,
  updateProperty,
  deleteProperty,
  deletePropertyImage,
  deletePropertyVideo,
} = require('../controllers/propertyController');

const router = express.Router();

router.route('/')
  .post(createProperty)
  .get(getProperties);

router.route('/:id')
  .get(getProperty)
  .put(updateProperty)
  .delete(deleteProperty);

router.route('/:id/images/:imageId')
  .delete(deletePropertyImage);

router.route('/:id/videos/:videoId')
  .delete(deletePropertyVideo);

module.exports = router;