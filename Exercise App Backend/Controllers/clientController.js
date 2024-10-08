//Media Upload Bucket
const multer = require('multer');
const upload = multer({ dest: 'uploads/' })
const cloudinary = require('../Config/cloudinaryConfig').cloudinary;
