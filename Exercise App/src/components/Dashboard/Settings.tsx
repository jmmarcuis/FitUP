import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { useAuth } from "../../hooks/useAuth";
import EditProfile from "./EditProfile";
import "./Settings.scss";
import coachImage from "../../assets/TrainerImages/coach-2.jpg";

const coach = {
  image: coachImage,
  name: "Jono Castano",
  title: "HIIT Instructor",
};

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [notificationsOn, setNotificationsOn] = useState(true);
  const [language, setLanguage] = useState("English");
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const handleNotificationsToggle = () => {
    setNotificationsOn((prev) => !prev);
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
  };

  // Handler to toggle showing EditProfile
  const handleEditProfileClick = () => {
    setIsEditingProfile(true);
  };

  const handleBackToProfileClick = () => {
    setIsEditingProfile(false);
  };

  return (
    <div className="main-container">
      <div className="settings-container">
        <h1 className="tabHeader">Settings</h1>
        <div className="settings-menu">
          <div className="menu-section">
            <h2>Account</h2>
            <ul>
              <li>
                <div className="menu-item">
                  <Icon icon="mdi:account-edit" className="menu-icon" />
                  <button
                    onClick={handleEditProfileClick}
                    className="menu-link"
                  >
                    Edit profile information
                  </button>
                </div>
              </li>
              <li>
                <div className="menu-item">
                  <Icon icon="mdi:bell-ring-outline" className="menu-icon" />
                  <a href="#" onClick={handleNotificationsToggle}>
                    Notifications{" "}
                    <span className="status">
                      {notificationsOn ? "ON" : "OFF"}
                    </span>
                  </a>
                </div>
              </li>
              <li>
                <div className="menu-item">
                  <Icon icon="mdi:translate" className="menu-icon" />
                  <a href="#" onClick={() => handleLanguageChange("English")}>
                    Language <span className="language">{language}</span>
                  </a>
                </div>
              </li>
              <li>
                <div className="menu-item">
                  <Icon icon="mdi:lock-outline" className="menu-icon" />
                  <a href="#" onClick={handleEditProfileClick}>
                    Change Password
                  </a>
                </div>
              </li>
            </ul>
          </div>

          <div className="menu-section">
            <h2>Support</h2>
            <ul>
              <li>
                <div className="menu-item">
                  <Icon
                    icon="material-symbols:contact-support-rounded"
                    className="menu-icon"
                  />
                  <a href="#">Help & Support</a>
                </div>
              </li>
              <li>
                <div className="menu-item">
                  <Icon icon="bx:support" className="menu-icon" />
                  <a href="#">Contact us</a>
                </div>
              </li>
              <li>
                <div className="menu-item">
                  <Icon icon="ic:outline-privacy-tip" className="menu-icon" />
                  <a href="#">Privacy policy</a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Profile Container */}
      <div className="profile-container">
        <h1 className="profile-header">User Profile</h1>
        {isEditingProfile ? (
          <EditProfile onBack={handleBackToProfileClick} />
        ) : (
          <div className="profile-details">
            <div className="profile-image">
              <img src={coach.image} alt="User profile" />
            </div>
            <div className="user-info">
              <h1>{user?.Name || "Thomas Fletcher"}</h1>
              <h2>{user?.email || "aaaaa@gmail.com"}</h2>
              <div className="user-stats">
                <div className="stat-item">
                  <span className="stat-value">{user?.height || "180"}cm</span>
                  <br />
                  <span className="stat-label">Height</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{user?.weight || "68"}kg</span>
                  <br />
                  <span className="stat-label">Weight</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{user?.age || "22"}yo</span>
                  <br />
                  <span className="stat-label">Age</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
