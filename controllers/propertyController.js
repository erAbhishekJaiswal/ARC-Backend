// const Property = require('../models/Property');
// const mongoose = require('mongoose');

// Create a new property
// exports.createProperty = async (req, res) => {
//   try {
//     const { title, description, price, type, location, bedrooms, photos, seller } = req.body;
    
//     const newProperty = new Property({
//       title,
//       description,
//       price,
//       type,
//       location,
//       bedrooms,
//       photos,
//       seller: new mongoose.Types.ObjectId(seller) // Ensure seller ID is converted to ObjectId
//     });

//     const savedProperty = await newProperty.save();
//     res.status(201).json({
//       success: true,
//       data: savedProperty
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// Get all properties
// exports.getAllProperties = async (req, res) => {
//   try {
//     const properties = await Property.find().populate('seller', '-password'); // Exclude password if seller has one
//     res.status(200).json({
//       success: true,
//       count: properties.length,
//       data: properties
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// Get single property by ID
// exports.getPropertyById = async (req, res) => {
//   try {
//     const property = await Property.findById(req.params.id).populate('seller', '-password');
    
//     if (!property) {
//       return res.status(404).json({
//         success: false,
//         message: 'Property not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: property
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };


// Validator: Approve a property
// exports.approveProperty = async (req, res) => {
//   try {
//     const property = await Property.findById(req.params.id);
    
//     if (!property) {
//       return res.status(404).json({
//         success: false,
//         message: 'Property not found'
//       });
//     }

//     if (property.status !== 'pending') {
//       return res.status(400).json({
//         success: false,
//         message: 'Only pending properties can be approved'
//       });
//     }

//     property.status = 'approved';
//     property.rejectionReason = undefined; // Clear any previous rejection reason
//     await property.save();

//     res.status(200).json({
//       success: true,
//       data: property
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// Validator: Reject a property (with reason)
// exports.rejectProperty = async (req, res) => {
//   try {
//     const { reason } = req.body;
    
//     if (!reason || reason.trim() === '') {
//       return res.status(400).json({
//         success: false,
//         message: 'Rejection reason is required'
//       });
//     }

//     const property = await Property.findById(req.params.id);
    
//     if (!property) {
//       return res.status(404).json({
//         success: false,
//         message: 'Property not found'
//       });
//     }

//     if (property.status !== 'pending') {
//       return res.status(400).json({
//         success: false,
//         message: 'Only pending properties can be rejected'
//       });
//     }

//     property.status = 'rejected';
//     property.rejectionReason = reason;
//     await property.save();

//     res.status(200).json({
//       success: true,
//       data: property
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// Get properties by status (for validators)
// exports.getPropertiesByStatus = async (req, res) => {
//   try {
//     const { status } = req.params;
    
//     if (!['pending', 'approved', 'rejected'].includes(status)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid status value'
//       });
//     }

//     const properties = await Property.find({ status }).populate('seller', '-password');
//     res.status(200).json({
//       success: true,
//       count: properties.length,
//       data: properties
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };











const Property = require('../models/Property');
const { cloudinary } = require('../config/cloudinary');
const { storage } = require('../config/cloudinary');
const multer = require('multer');

// Configure Multer with Cloudinary storage
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit for files (adjust as needed)
  },
}).fields([
  { name: 'images', maxCount: 10 },
  { name: 'videos', maxCount: 3 },
]);

// Helper function to process uploads
const processUploads = (req, res, next) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ success: false, message: err.message });
    } else if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
    next();
  });
};

// @desc    Create a new property
// @route   POST /api/properties
// @access  Public (you can add auth later)
const createProperty = async (req, res) => {
  try {
    // Process the uploads first
    processUploads(req, res, async () => {
      const propertyData = req.body;
      
      // Handle images
      const images = [];
      if (req.files['images']) {
        req.files['images'].forEach(image => {
          images.push({
            url: image.path,
            public_id: image.filename,
          });
        });
      }
      
      // Handle videos
      const videos = [];
      if (req.files['videos']) {
        req.files['videos'].forEach(video => {
          videos.push({
            url: video.path,
            public_id: video.filename,
            resource_type: video.resource_type,
          });
        });
      }
      
      // Create property with media
      const property = await Property.create({
        ...propertyData,
        images,
        videos,
      });
      
      res.status(201).json({
        success: true,
        data: property,
      });
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};


// @desc    Get all properties
// @route   GET /api/properties
// @access  Public
const getProperties = async (req, res) => {
  try {
    const properties = await Property.find();
    res.status(200).json({
      success: true,
      count: properties.length,
      data: properties,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
const getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }
    
    res.status(200).json({
      success: true,
      data: property,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Public (add auth later)
const updateProperty = async (req, res) => {
  try {
    // Process the uploads first
    processUploads(req, res, async () => {
      let property = await Property.findById(req.params.id);
      
      if (!property) {
        return res.status(404).json({
          success: false,
          message: 'Property not found',
        });
      }
      
      const propertyData = req.body;
      
      // Handle new images
      const newImages = [];
      if (req.files['images']) {
        req.files['images']?.forEach(image => {
          newImages.push({
            url: image.path,
            public_id: image.filename,
          });
        });
      }
      
      // Handle new videos
      // const newVideos = [];
      // if (req.files['videos']) {
      //   req.files['videos'].forEach(video => {
      //     newVideos.push({
      //       url: video.path,
      //       public_id: video.filename,
      //       resource_type: video.resource_type,
      //     });
      //   });
      // }
      
      // Update property with new media
      property = await Property.findByIdAndUpdate(
        req.params.id,
        {
          ...propertyData,
          $push: {
            images: { $each: newImages },
            // videos: { $each: newVideos },
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );
      
      res.status(200).json({
        success: true,
        data: property,
      });
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// const updateProperty = async (req, res) => {
//   try {
//     processUploads(req, res, async () => {
//       let property = await Property.findById(req.params.id);
//       if (!property) {
//         return res.status(404).json({ success: false, message: 'Property not found' });
//       }

//       const propertyData = {
//         ...req.body,
//         location: req.body.location ? JSON.parse(req.body.location) : property.location,
//       };

//       // Parse fields that may have been sent as strings
//       if (typeof propertyData.price === 'string') propertyData.price = parseFloat(propertyData.price);
//       if (typeof propertyData.bedrooms === 'string') propertyData.bedrooms = parseInt(propertyData.bedrooms);
//       if (typeof propertyData.area === 'string') propertyData.area = parseFloat(propertyData.area);

//       const newImages = [];
//       if (req.files && req.files['images']) {
//         req.files['images'].forEach(image => {
//           newImages.push({
//             url: image.path,
//             public_id: image.filename,
//           });
//         });
//       }

//       const updated = await Property.findByIdAndUpdate(
//         req.params.id,
//         {
//           ...propertyData,
//           $push: { images: { $each: newImages } },
//         },
//         { new: true, runValidators: true }
//       );

//       res.status(200).json({ success: true, data: updated });
//     });
//   } catch (err) {
//     res.status(400).json({ success: false, message: err.message });
//   }
// };


// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Public (add auth later)
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    // Delete images from Cloudinary
    for (const image of property.images) {
      await cloudinary.uploader.destroy(image.public_id);
    }

    // Delete videos from Cloudinary
    for (const video of property.videos) {
      await cloudinary.uploader.destroy(video.public_id, { resource_type: 'video' });
    }

    // Delete property from database
    await Property.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

// @desc    Delete property image
// @route   DELETE /api/properties/:id/images/:imageId
// @access  Public (add auth later)
const deletePropertyImage = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }
    console.log(req.params.imageId);
    
    // Find the image to delete
    const imageToDelete = property.images.find(
      image => image.public_id === req.params.imageId
    );
    
    if (!imageToDelete) {
      return res.status(404).json({
        success: false,
        message: 'Image not found',
      });
    }
    
    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(imageToDelete.public_id);
    
    // Remove image from property
    property.images = property.images.filter(
      image => image.public_id !== req.params.imageId
    );
    
    await property.save();
    
    res.status(200).json({
      success: true,
      data: property,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

// @desc    Delete property video
// @route   DELETE /api/properties/:id/videos/:videoId
// @access  Public (add auth later)
const deletePropertyVideo = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }
    
    // Find the video to delete
    const videoToDelete = property.videos.find(
      video => video.public_id === req.params.videoId
    );
    
    if (!videoToDelete) {
      return res.status(404).json({
        success: false,
        message: 'Video not found',
      });
    }
    
    // Delete video from Cloudinary
    await cloudinary.uploader.destroy(videoToDelete.public_id, { 
      resource_type: 'video' 
    });
    
    // Remove video from property
    property.videos = property.videos.filter(
      video => video.public_id !== req.params.videoId
    );
    
    await property.save();
    
    res.status(200).json({
      success: true,
      data: property,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

module.exports = {
  createProperty,
  getProperties,
  getProperty,
  updateProperty,
  deleteProperty,
  deletePropertyImage,
  deletePropertyVideo,
};