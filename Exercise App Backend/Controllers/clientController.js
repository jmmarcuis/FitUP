const Client = require('../Models/ClientModel');

exports.getClientDetails = async (req, res) => {
  try {
    const client = await Client.findById(req.user.id).select('-password -otp -otpExpires');
    
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
      age: client.getAge()
    };

    res.status(200).json(clientDetails);
  } catch (error) {
    console.error('Error fetching client details:', error);
    res.status(500).json({ message: 'Error fetching client details' });
  }
};