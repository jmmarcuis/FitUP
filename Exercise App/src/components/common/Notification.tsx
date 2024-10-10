import React from "react";
import { Icon } from "@iconify/react";
import "./Notification.scss";
import coachImage from "../../assets/TrainerImages/coach-2.jpg";

const notificationsData = [
  {
    id: 1,
    coachName: "Kyriakos Kapakoulak",
    description: "Agreed to coach you",
    date: "Today at 10:00 AM",
    imageUrl: coachImage,
  },
  {
    id: 2,
    coachName: "Jane Smith",
    description: "New Message: 'Make proper use of bracing'",
    date: "Today at 9:00 AM",
    imageUrl: coachImage,
  },
  {
    id: 3,
    coachName: "Mike Johnson",
    description: "New Workout Notification: PUSH DAY",
    date: "Yesterday at 5:00 PM",
    imageUrl: coachImage,
  },
];

const Notification: React.FC<{ onClose: () => void; visible: boolean }> = ({
  onClose,
  visible,
}) => {
  return (
    <div className={`notifications ${visible ? "active" : ""}`}>
      <div className="header">
        <button className="back-button" onClick={onClose}>
          <Icon icon="mdi:arrow-left" />
        </button>
        <h2>Notifications</h2>
      </div>
      <div className="notification-cards">
        {notificationsData.map((notification) => (
          <div className="notification-card" key={notification.id}>
            <img
              src={notification.imageUrl}
              alt="Coach"
              className="notification-image"
            />
            <div className="notification-content">
              <h4>{notification.coachName}</h4>
              <p>{notification.description}</p>
              <span className="notification-date">{notification.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notification;