import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import "./Messages.scss";
import dummyImage from "../../assets/TrainerImages/coach-2.jpg"; // Update path based on your setup
import CoachDetailsModal from "../Modals/CoachModals/CoachDetailsModal";
import { getClientCollabotion } from '../../services/collaborationService';
import { getCollaborationMessages } from '../../services/messageService';

const Messages = () => {
  const [messages, setMessages] = useState([
    { sender: "coach", text: "Hi, please check the new task." },
    { sender: "client", text: "Got it. Thanks." },
    {
      sender: "coach",
      text: "Hi, please check the last task that I have completed.",
    },
    { sender: "client", text: "Will check it soon." },
  ]);

  const [clientName, setClientName] = useState("Kyriakos Kapakoulak");
  const [clientDate, setClientDate] = useState("1-1-2000");
  const [clientEmail, setEmail] = useState("hello@gmail.com");
  const [clientImage, setClientImage] = useState(dummyImage);
  const [newMessage, setNewMessage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

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
      setClientDate(formattedDate)
      fetchMessages(clientId, collaborationId);
      setEmail(email);
    } else {
      console.log("No active coach found");
    }

  };

  const fetchMessages = async (clientId: string, collaborationId: string) => {
    const messages = await getCollaborationMessages(collaborationId);
  
    if (messages) {
      const sortedMessages = messages.sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
  
      const mappedMessages = sortedMessages.map((message) => ({
        sender: message.sender === clientId ? "coach" : "client",
        text: message.content,
      }));
  
      setMessages(mappedMessages);
      console.log(clientId)
    } else {
      console.log("No messages found.");
    }
  };
  
  

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { sender: "client", text: newMessage }]);
      setNewMessage(""); 
    }
  };

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  // hit enter to send message
  const handleKeyDown = (e: { key: string; }) => {
    if (e.key === "Enter") {
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
      <div className="chat-area">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message-bubble ${
              message.sender === "client" ? "client-message" : "coach-message"
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
