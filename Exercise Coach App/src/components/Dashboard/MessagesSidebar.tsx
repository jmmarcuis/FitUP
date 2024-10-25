import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import "./MessagesSidebar.scss";
import tempImageChangeThisPls from "../../assets/TrainerImages/coach-1.jpg";

const MessagesSidebar: React.FC = () => {
  // Mock messages data
  const messages = [
    {
      id: "1",
      name: "Sukuna",
      lastMessage: "Hey, how are you?",
      timestamp: "10:30 AM",
      imageUrl: tempImageChangeThisPls,
    },
    {
      id: "2",
      name: "Light Yagami",
      lastMessage: "See you at the meeting!",
      timestamp: "9:45 AM",
      imageUrl: tempImageChangeThisPls,
    },
    {
      id: "3",
      name: "Denji",
      lastMessage: "Can you send me the report?",
      timestamp: "Yesterday",
      imageUrl: tempImageChangeThisPls,
    },
    {
      id: "4",
      name: "Gojo",
      lastMessage: "Can you send me the report?",
      timestamp: "Yesterday",
      imageUrl: tempImageChangeThisPls,
    },
  ];

  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <aside
      className={`messages-sidebar ${isExpanded ? "expanded" : "collapsed"}`}
    >
      <h2 className="sidebar-title">
        <span className="toggle-icon">
          <button className="toggle-button" onClick={toggleSidebar}>
            <Icon
              className="arrow-icon"
              icon={isExpanded ? "mdi:chevron-left" : "mdi:chevron-right"}
              style={{ color: "#fff" }}
            />
          </button>
        </span>
        <span className={`messages-title ${isExpanded ? "" : "hidden"}`}>
          Messages
        </span>
      </h2>
      <div className="separator"></div>
      <ul>
        {messages.map((message) => (
          <li key={message.id}>
            <Link to={`/dashboard/messages`} className="message-link">
              <div className={`message ${message.unread ? "unread" : ""}`}>
                <img
                  src={message.imageUrl}
                  alt={`${message.name}'s avatar`}
                  className="message-image"
                />
                {isExpanded && (
                  <div className="message-details">
                    <div className="message-name">{message.name}</div>
                    <div className="last-message">{message.lastMessage}</div>
                  </div>
                )}
                {/*
                  Uncomment this if u want to add the timestamps
                  isExpanded && (
                  <div className="timestamp">{message.timestamp}</div>
                )*/}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default MessagesSidebar;
