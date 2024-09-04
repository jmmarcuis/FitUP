const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function checkCloudinaryConfig() {
  const { cloud_name, api_key, api_secret } = cloudinary.config();
  
  let configErrors = [];

  if (!cloud_name) configErrors.push('Cloudinary cloud_name is missing');
  if (!api_key) configErrors.push('Cloudinary api_key is missing');
  if (!api_secret) configErrors.push('Cloudinary api_secret is missing');

  if (configErrors.length > 0) {
    configErrors.forEach(error => console.error(error));
    throw new Error('Failed to configure Cloudinary. Please check your environment variables.');
  }

  console.log('Cloudinary is successfully configured and connected.');
}

// Run the check immediately
checkCloudinaryConfig();

module.exports = { cloudinary, checkCloudinaryConfig };