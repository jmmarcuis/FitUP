const Client = require('../Models/ClientModel');
const { cloudinary } = require('../Config/cloudinaryConfig');
const bcrypt = require('bcryptjs');

exports.updateClientDetails = async (req, res) => {
  try {
    const clientId = req.user._id; // Assuming req.user is set by your verifyToken middleware
    const updates = req.body;
    const allowedUpdates = ['firstName', 'lastName', 'dateOfBirth', 'height', 'weight'];
    
    // Filter out any fields that aren't allowed to be updated
    const filteredUpdates = Object.keys(updates)
      .filter(key => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key];
        return obj;
      }, {});

    // Handle profile picture upload
    if (req.files && req.files.profilePicture) {
      const file = req.files.profilePicture;
      try {
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
          folder: 'profile_pictures',
          width: 300,
          crop: "scale"
        });
        filteredUpdates.clientImage = result.secure_url;
      } catch (uploadError) {
        console.error('Error uploading to Cloudinary:', uploadError);
        return res.status(500).json({ message: 'Error uploading profile picture' });
      }
    }

    // Update the client
    const updatedClient = await Client.findByIdAndUpdate(
      clientId,
      filteredUpdates,
      { new: true, runValidators: true }
    ).select('-password -otp -otpExpires');

    if (!updatedClient) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Prepare the response
    const clientDetails = {
      id: updatedClient._id,
      firstName: updatedClient.firstName,
      lastName: updatedClient.lastName,
      email: updatedClient.email,
      profilePicture: updatedClient.clientImage,
      dateOfBirth: updatedClient.dateOfBirth,
      height: updatedClient.height,
      weight: updatedClient.weight,
      age: updatedClient.getAge ? updatedClient.getAge() : null
    };

    res.status(200).json({ message: 'Client updated successfully', client: clientDetails });
  } catch (error) {
    console.error('Error updating client details:', error);
    res.status(500).json({ message: 'Error updating client details' });
  }
};

exports.getClientDetails = async (req, res) => {
  try {
    const client = await Client.findById(req.user._id).select('-password -otp -otpExpires');
    
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    const clientDetails = {
      id: client._id,
      firstName: client.firstName,
      lastName: client.lastName,
      email: client.email,
      profilePicture: client.clientImage,
      dateOfBirth: client.dateOfBirth,
      height: client.height,
      weight: client.weight,
      age: client.getAge ? client.getAge() : null
    };

    return res.status(200).json(clientDetails);
  } catch (error) {
    console.error('Error fetching client details:', error);
    return res.status(500).json({ message: 'Error fetching client details' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const clientId = req.user._id; 

    // Find the client
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Check if the current password is correct
    const isMatch = await client.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Temporary console log to display the new unencrypted password
    console.log('New unencrypted password:', newPassword);

    // Update the password
    client.password = newPassword;
    await client.save();

    res.status(200).json({ message: 'Password updated successfully' });

  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Error changing password' });
  }
};