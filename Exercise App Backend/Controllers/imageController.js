const { cloudinary } = require('../Config/cloudinaryConfig');
const Client = require('../Models/ClientModel');
const fs = require('fs');
const util = require('util');
const unlinkFile = util.promisify(fs.unlink);

exports.uploadClientImage = async (req, res) => {
  try {
    const { clientId } = req.params;
    console.log("Client ID:", clientId);
    console.log("Received file:", req.file);

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Upload the image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'client_images',
    });

    // Delete the file from local storage
    await unlinkFile(req.file.path);

    // Update the client's image URL
    const updatedClient = await Client.findByIdAndUpdate(
      clientId, 
      { clientImage: result.secure_url },
      { new: true }
    );

    if (!updatedClient) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.status(200).json({ 
      message: 'Image uploaded successfully', 
      clientImage: result.secure_url 
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ message: 'Error uploading image', error: error.message });
  }
};