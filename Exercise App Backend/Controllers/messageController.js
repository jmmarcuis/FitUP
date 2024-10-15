const Message = require('../Models/MessageModel');
const Collaboration = require('../Models/CollaborationModel');

exports.sendMessage = async (req, res) => {
  try {
    const { collaborationId, content } = req.body;
    const senderId = req.user._id;
    const senderRole = req.user.role;

    const collaboration = await Collaboration.findById(collaborationId);

    if (!collaboration) {
      return res.status(404).json({ message: 'Collaboration not found' });
    }

    if (collaboration.status !== 'accepted' && collaboration.status !== 'active') {
      return res.status(403).json({ message: 'Can only send messages in accepted or active collaborations' });
    }

    let isAuthorized = false;
    if (senderRole === 'client' && collaboration.client.toString() === senderId.toString()) {
      isAuthorized = true;
    } else if (senderRole === 'coach' && collaboration.coach.toString() === senderId.toString()) {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      return res.status(403).json({ message: 'Not authorized to send messages in this collaboration' });
    }

    const message = new Message({
      collaboration: collaborationId,
      sender: senderId,
      content
    });

    await message.save();

    res.status(201).json({ message: 'Message sent successfully', message });
  } catch (error) {
    console.error('Error in sendMessage:', error);
    res.status(500).json({ message: 'Error sending message', error: error.message });
  }
};
  
  exports.getMessages = async (req, res) => {
    try {
      const { collaborationId } = req.params;
      console.log('Requested collaboration ID:', collaborationId);
       
      console.log('Full req.user object:', req.user);
      const userId = req.user ? req.user._id : undefined;
      const userRole = req.user ? req.user.role : undefined;
      console.log('Authenticated user ID:', userId);
      console.log('Authenticated user role:', userRole);
  
      if (!userId || !userRole) {
        return res.status(400).json({ message: 'User identification not found in the request' });
      }
  
      const collaboration = await Collaboration.findById(collaborationId);
      console.log('Found collaboration:', collaboration);
  
      if (!collaboration) {
        return res.status(404).json({ message: 'Collaboration not found' });
      }
  
      // Check if the authenticated user is either the client or the coach of this collaboration
      const isAuthorized = (userRole === 'client' && collaboration.client.toString() === userId.toString()) ||
                           (userRole === 'coach' && collaboration.coach.toString() === userId.toString());
  
      if (!isAuthorized) {
        console.log('User not authorized. User ID:', userId, 'Role:', userRole);
        console.log('Collaboration client:', collaboration.client, 'Collaboration coach:', collaboration.coach);
        return res.status(403).json({ message: 'Not authorized to view messages in this collaboration' });
      }
  
      const messages = await Message.find({ collaboration: collaborationId }).sort('timestamp');
      console.log('Number of messages found:', messages.length);
  
      res.status(200).json(messages);
    } catch (error) {
      console.error('Error in getMessages:', error);
      res.status(500).json({ message: 'Error fetching messages', error: error.message });
    }
  };