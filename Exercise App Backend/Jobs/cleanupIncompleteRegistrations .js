 

const User = require('../Models/userModel');

const cleanupIncompleteRegistrations = async () => {
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);  
  
  try {
    const result = await User.deleteMany({
      isProfileCompleted: false,
      registrationDate: { $lt: thirtyMinutesAgo }
    });
    
    console.log(`Deleted ${result.deletedCount} incomplete registrations`);
  } catch (error) {
    console.error('Error cleaning up incomplete registrations:', error);
  }
};

module.exports = cleanupIncompleteRegistrations;
