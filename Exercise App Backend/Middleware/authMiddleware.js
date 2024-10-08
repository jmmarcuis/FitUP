// const jwt = require('jsonwebtoken');
// const User = require('../Models/clientModel'); 
// exports.protect = async (req, res, next) => {
//   let token;

//   // Check for the token in the Authorization header
//   if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//     token = req.headers.authorization.split(' ')[1];
//   }

//   // If no token, return an unauthorized response
//   if (!token) {
//     return res.status(401).json({ message: 'Not authorized, no token' });
//   }

//   try {
//     // Verify the token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
//     // Fetch the user from the database
//     const user = await User.findById(decoded.id).select('-password');

//     // If no user is found, return an unauthorized response
//     if (!user) {
//       return res.status(401).json({ message: "Not authorized, no user found" });
//     }

//     // Attach the user to the request object
//     req.user = user;
//     next(); // Proceed to the next middleware or route handler
//   } catch (error) {
//     // Handle token verification errors
//     res.status(401).json({ message: "Not authorized, token failed" });
//   }
// };
