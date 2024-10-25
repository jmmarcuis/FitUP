import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import "./Messages.scss";
import dummyImage from "../../assets/TrainerImages/coach-2.jpg"; // Update path based on your setup
import CoachDetailsModal from "../Modals/CoachModals/CoachDetailsModal";
import { getClientCollabotion } from '../../services/collaborationService';
import { getCollaborationMessages } from '../../services/messageService';
import { saveMessage } from '../../services/messageService';
import { useMessageContext } from '../../Context/MessageContext';

const Messages = () => {
  const socket = useMessageContext();
  const [messages, setMessages] = useState<{ sender: string, text: string }[]>([]);


  const [clientName, setClientName] = useState("Kyriakos Kapakoulak");
  const [clientDate, setClientDate] = useState("1-1-2000");
  const [clientEmail, setEmail] = useState("hello@gmail.com");
  const [clientImage, setClientImage] = useState(dummyImage);
  const [newMessage, setNewMessage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [collaborationId, setCollaborationId] = useState<string>("");
  const [senderId, setSenderId] = useState<string>("");

  useEffect(() => {
    console.log(socket);
    console.log(collaborationId);

    if (!socket) return;
    console.log("socket")

    socket.emit('joinCollaboration', collaborationId, (ack: { error?: string }) => {
      console.log("IM HERE")
      if (ack.error) {
        console.error(ack.error);
      }
    });

    // Listen for new messages
    socket.on('newMessage', (data: { collaborationId: string; message: { content: string, sender: string, timestamp: number } }) => {
      console.log("kulit", data)
      if (data.collaborationId === collaborationId) {
        setMessages((prevMessages) => [
          {
            sender: data.message.sender === senderId ? 'client' : 'coach', // Ensure correct identification
            text: data.message.content,
          },
            ...prevMessages
        ]);
      }
    });

    // Handle errors
    socket.on('error', (err: Error) => {
      console.error('Socket error:', err.message);
      console.error(err.message);
    });

    // Cleanup listeners on component unmount
    return () => {
      socket.off('newMessage');
      socket.off('error');
    };
  }, [socket, collaborationId]);

  useEffect(() => {
    fetchCollaboration();
  }, [])

  const fetchCollaboration = async () => {
    const collab = await getClientCollabotion();

    if (collab) {
      const { firstName, lastName, clientImage, collaborationId, email, startDate, clientId } = collab;
      const formattedDate = new Date(startDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      setClientName(`${firstName} ${lastName}`)
      setClientImage(clientImage)
      setSenderId(clientId);
      setClientDate(formattedDate)
      fetchMessages(clientId, collaborationId);
      setCollaborationId(collaborationId);
      setEmail(email);
    } else {
      console.log("No active coach found");
    }
  };

  const fetchMessages = async (clientId: string, collaborationId: string) => {
    const messages = await getCollaborationMessages(collaborationId);

    if (messages) {
      const sortedMessages = messages.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      const mappedMessages = sortedMessages.map((message) => ({
        sender: message.sender === clientId ? "client" : "coach",
        text: message.content,
      }));

      setMessages(mappedMessages);
      console.log(clientId)
    } else {
      console.log("No messages found.");
    }
  };


  const handleSendMessage = async () => {
    if (newMessage.trim() && collaborationId) {
      try {
        console.log("Calling saveMessage API...");
        await saveMessage(newMessage, collaborationId); // Save message to the backend
  
        // Clear input field after sending
        setNewMessage(""); 
      } catch (error) {
        console.error("Error saving message:", error);
        alert("Error sending message. Please check your connection and try again.");
      }
    } else {
      console.log("New message or collaborationId is missing.");
    }
  };
  
  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  // hit enter to send message
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="messages-container">
      {/* Header */}
      <div className="messages-header">
        <h2>Messages</h2>
      </div>

      {/* Coach Info */}
      <div className="coach-desc">
        <img src={clientImage} alt="Coach" />
        <div className="coach-details">
          <h4>{clientName}</h4>
          <p>{clientEmail}</p>
          <p>Client Since: {clientDate}</p>
        </div>
        <Icon
          icon="mdi:information"
          className="info-icon"
          onClick={handleOpenModal}
          style={{ cursor: "pointer" }}
        />
      </div>

      {/* Message Chat Area */}
      <div className="chat-area overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message-bubble ${message.sender === "coach" ? "client-message" : "coach-message"
              }`}
          >
            {message.text}
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="message-input-container">
        <input
          type="text"
          className="message-input"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message"
        />
        <button className="send-button" onClick={handleSendMessage}>
          <Icon icon="mdi:send" />
        </button>
      </div>

      {/* Coach Details Modal */}
      {modalVisible && (
        <CoachDetailsModal
          image={dummyImage}
          name="Kyriakos Kapakoulak"
          description="Strongman Instructor with 10 years of experience."
          onClose={handleCloseModal}
          showCollaborateButton={false}
        />
      )}
    </div>
  );
};

export default Messages;
