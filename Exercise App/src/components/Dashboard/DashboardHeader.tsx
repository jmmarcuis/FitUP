// DashboardHeader.tsx

import React, { useState } from "react";
import { Icon } from "@iconify/react";
import "./DashboardHeader.scss";
import ToggleLightDarkSwitch from "../common/ToggleLightDarkSwitch";
import Notification from "../common/Notification";

interface DashboardHeaderProps {
  greeting: string;
  onShowModal: () => void;
  welcomeMessage: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  greeting,
  onShowModal,
  welcomeMessage,
}) => {
  const [notificationsVisible, setNotificationsVisible] = useState(false);

  const handleNotificationClick = () => {
    setNotificationsVisible(!notificationsVisible);
  };

  return (
    <header className="dashboard-header">
      <div className="greeting">
        <p>{greeting}</p>
        <h2>{welcomeMessage}</h2>
      </div>
      <div className="header-icons">
        <ToggleLightDarkSwitch />

        <Icon
          icon="mdi:bell"
          className="header-icon"
          onClick={handleNotificationClick}
          style={{ color: notificationsVisible ? "#bbf246" : "white" }} // Change color based on state
        />

        <Icon
          icon="mdi:plus"
          className="header-icon"
          onClick={onShowModal} // click handler
        />
      </div>

      <Notification
        onClose={handleNotificationClick}
        visible={notificationsVisible}
      />
    </header>
  );
};

export default DashboardHeader;
