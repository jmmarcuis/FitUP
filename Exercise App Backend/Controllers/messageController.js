const crypto = require('crypto');
const Message = require('../Models/MessageModel');
const Collaboration = require('../Models/CollaborationModel');
const IV_LENGTH = 16;


function encrypt(text) {
  const encryptionKey = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
  const encryptionKey = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');  // Extract encrypted message

  const decipher = crypto.createDecipheriv('aes-256-cbc', encryptionKey, iv);
  let decrypted = decipher.update(encryptedText);

  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
}



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

    const encryptedContent = encrypt(content);

    const message = new Message({
      collaboration: collaborationId,
      sender: senderId,
      content: encryptedContent
    });

    await message.save();

    res.status(201).json({ message: 'Message sent successfully', message });
  } catch (error) {
    console.error('Error in sendMessage:', error);
    res.status(500).json({ message: 'Error sending message', error: error.message });
  }
};

// Retrieve all messages for a collaboration (with decryption)
exports.getMessages = async (req, res) => {
  try {
    const { collaborationId } = req.params;
    const userId = req.user._id;
    const userRole = req.user.role;

    // Ensure user identification is present
    if (!userId || !userRole) {
      return res.status(400).json({ message: 'User identification not found in the request' });
    }

    // Find the collaboration by ID
    const collaboration = await Collaboration.findById(collaborationId);

    if (!collaboration) {
      return res.status(404).json({ message: 'Collaboration not found' });
    }

    // Check if the user is authorized (client or coach in this collaboration)
    const isAuthorized = (userRole === 'client' && collaboration.client.toString() === userId.toString()) ||
      (userRole === 'coach' && collaboration.coach.toString() === userId.toString());

    if (!isAuthorized) {
      return res.status(403).json({ message: 'Not authorized to view messages in this collaboration' });
    }

    // Retrieve all messages for this collaboration, sorted by timestamp
    const messages = await Message.find({ collaboration: collaborationId }).sort('timestamp');

    // Decrypt the content of each message before sending them back
    const decryptedMessages = messages.map(message => {
      return {
        ...message._doc,  // Spread the existing document data
        content: decrypt(message.content)  // Decrypt the message content
      };
    });

    res.status(200).json(decryptedMessages);
  } catch (error) {
    console.error('Error in getMessages:', error);
    res.status(500).json({ message: 'Error fetching messages', error: error.message });
  }
};
