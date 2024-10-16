import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import "./Messages.scss";
import dummyImage from "../../assets/TrainerImages/coach-1.jpg"; // Update path based on your setup
import CoachDetailsModal from "../Modals/CoachModals/CoachDetailsModal";
import { getCollaborationByClient } from '../../services/collaborationService';
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

  const [coachName, setCoachName] = useState("Kyriakos Kapakoulak");
  const [coachSpecialization, setSpecialization] = useState("Jumping Rope");
  const [coachEmail, setEmail] = useState("hello@gmail.com");
  const [coachImage, setCoachImage] = useState(dummyImage);
  const [newMessage, setNewMessage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchCollaboration();
  }, [])

  const fetchCollaboration = async () => {
    const collab = await getCollaborationByClient();

    if (collab) {
      const { firstName, lastName, specialization, profilePicture, collaborationId, coachId, email } = collab;
      console.log(`Coach Name: ${firstName} ${lastName}`);
      setCoachName(`${firstName} ${lastName}`)
      setSpecialization(specialization)
      setCoachImage(profilePicture)
      fetchMessages(coachId, collaborationId);
      setEmail(email);
    } else {
      console.log("No active coach found");
    }

  };

  const fetchMessages = async (coachId: string, collaborationId: string) => {
    const messages = await getCollaborationMessages(collaborationId);

    if (messages) {
      const sortedMessages = messages.sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

      // Map the messages into the desired structure for the state
      const mappedMessages = sortedMessages.map((message) => ({
        sender: message.sender === coachId ? 'coach' : 'client',
        text: message.content,
      }));

      setMessages(mappedMessages);

    } else {
      console.log("No active coach found");
    }
  };


  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { sender: "client", text: newMessage }]);
      setNewMessage(""); // Clear input after sending
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
        <img src={coachImage} alt="Coach" />
        <div className="coach-details">
          <h4>{coachName}</h4>
          <p>{coachSpecialization}</p>
          <p>{coachEmail}</p>
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
            className={`message-bubble ${message.sender === "client" ? "client-message" : "coach-message"
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
          image={coachImage}
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
