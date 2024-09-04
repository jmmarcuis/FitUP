const { cloudinary } = require('../Config/cloudinaryConfig');

exports.uploadProfilePicture = async (imageBase64) => {
  try {
    const uploadedImage = await cloudinary.uploader.upload(imageBase64, {
      folder: 'user_profile_pictures',
      use_filename: true,
      unique_filename: false,
    });

    return uploadedImage.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image');
  }
};
