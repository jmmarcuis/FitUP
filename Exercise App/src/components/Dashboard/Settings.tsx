import React, { useState } from "react";
import { Icon } from "@iconify/react";
import "./Settings.scss";
import useClientDetails from "../../hooks/useClientDetails";
import { EditClientModal } from "../Modals/EditClientModal";
import { ChangePasswordModal } from "../Modals/ChangePasswordModal";
import { ToastContainer, toast } from "react-toastify";
import ReactModal from "react-modal";

ReactModal.setAppElement("#root");

const Settings: React.FC = () => {
  const notifyNextFeature = () => toast.info("This feature is coming soon!");

  const { clientDetails, loading, error, refetch } = useClientDetails();
  const [isEditClientModalOpen, setEditClientModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setChangePasswordModalOpen] = useState(false);

  const toggleEditClientModal = () => {
    setEditClientModalOpen(!isEditClientModalOpen);
  };

  const handleCloseEditModal = () => {
    toggleEditClientModal();
    refetch();
  };

  const toggleChangePasswordModal = () => {
    setChangePasswordModalOpen(!isChangePasswordModalOpen);
  };

  const handleCloseChangePasswordModal = () => {
    toggleChangePasswordModal();
    refetch();
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!clientDetails) return null;

  return (
    <>
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
                    <button onClick={toggleEditClientModal} className="menu-link">
                      Edit profile information
                    </button>
                  </div>
                </li>
                <li>
                  <div className="menu-item">
                    <Icon icon="mdi:bell-ring-outline" className="menu-icon" />
                    <a href="#" onClick={notifyNextFeature}>
                      Notifications <span className="status">ON </span>
                    </a>
                  </div>
                </li>
                <li>
                  <div className="menu-item">
                    <Icon icon="mdi:translate" className="menu-icon" />
                    <a href="#" onClick={notifyNextFeature}>
                      Language <span className="language">English</span>
                    </a>
                  </div>
                </li>
                <li>
                  <div className="menu-item">
                    <Icon icon="mdi:lock-outline" className="menu-icon" />
                    <button onClick={toggleChangePasswordModal} className="menu-link">
                      Change Password
                    </button>
                  </div>
                </li>
              </ul>
            </div>

            <div className="menu-section">
              <h2>Support</h2>
              <ul>
                <li>
                  <div className="menu-item" onClick={notifyNextFeature}>
                    <Icon icon="material-symbols:contact-support-rounded" className="menu-icon" />
                    <a href="#">Help & Support</a>
                  </div>
                </li>
                <li>
                  <div className="menu-item" onClick={notifyNextFeature}>
                    <Icon icon="bx:support" className="menu-icon" />
                    <a href="#">Contact us</a>
                  </div>
                </li>
                <li>
                  <div className="menu-item" onClick={notifyNextFeature}>
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

          <div className="profile-details">
            <div className="profile-image">
              <img src={clientDetails.profilePicture} alt="User profile" />
            </div>
            <div className="user-info">
              <h1>
                {clientDetails.firstName} {clientDetails.lastName}
              </h1>
              <h2>{clientDetails.email || "aaaaa@gmail.com"}</h2>
              <div className="user-stats">
                <div className="stat-item">
                  <span className="stat-value">
                    {clientDetails.height || "180"}cm
                  </span>
                  <br />
                  <span className="stat-label">Height</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">
                    {clientDetails.weight || "68"}kg
                  </span>
                  <br />
                  <span className="stat-label">Weight</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">
                    {clientDetails.age || "22"}yr
                  </span>
                  <br />
                  <span className="stat-label">Age</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Toast Notifications */}
        <ToastContainer theme="dark" position="top-center" autoClose={3000} />
      </div>

      {/* Edit Client Modal */}
      <EditClientModal
        isOpen={isEditClientModalOpen}
        onClose={handleCloseEditModal}
      />

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={handleCloseChangePasswordModal}
      />
    </>
  );
};

export default Settings;