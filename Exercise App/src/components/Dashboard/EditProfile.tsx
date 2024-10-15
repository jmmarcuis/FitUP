import React, { useState } from "react";
import "./EditProfile.scss";
import { Icon } from "@iconify/react";
import yourImage from "../../assets/TrainerImages/coach-1.jpg";

interface EditProfileProps {
  onBack: () => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ onBack }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSaveChanges = () => {
    console.log("Profile updated", {
      firstName,
      lastName,
      weight,
      height,
      dateOfBirth,
      email,
      oldPassword,
      newPassword,
      confirmPassword,
    });
  };

  return (
    <div className="edit-profile-container">
      <div className="header">
        <Icon icon="mdi:arrow-left" className="back-icon" onClick={onBack} />
      </div>

      <div className="profile-image-section">
        <img
          src={yourImage} // Replace with actual user image path
          alt="User profile"
          className="profile-image"
        />
      </div>

      <div className="edit-profile-form">
        <div className="form-section">
          <h2>Personal Information</h2>
          <div className="row">
            <div className="input-group left">
              <label>First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="input-group right">
              <label>Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
          <div className="row">
            <div className="input-group left">
              <label>Weight (KG)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
            <div className="input-group center">
              <label>Height (CM)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </div>
            <div className="input-group right">
              <label>Date of Birth</label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Security</h2>
          <div className="row">
            <div className="input-group full-width">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="row">
            <div className="input-group full-width">
              <label>Old Password</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="row">
            <div className="input-group left">
              <label>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="input-group right">
              <label>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="button-group">
          <button className="save-button" onClick={handleSaveChanges}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
