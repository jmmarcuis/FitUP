import React, { useState } from "react";
import ReactModal from "react-modal";
import "./ChangePasswordModal.scss";
import { Icon } from "@iconify/react";
import useChangePassword from "../../hooks/useChangePassword";

interface ChangePasswordModal {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModal> = ({
  isOpen,
  onClose,
}) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { changePassword, loading, error } = useChangePassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New passwords don't match");
      return;
    }
    try {
      await changePassword({ currentPassword, newPassword });
      alert("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      onClose();
    } catch (err) {
      // Error is handled by the hook and stored in the error state
    }
  };

  return (
    <ReactModal
      className="change-password-modal-content"
      overlayClassName="modal-overlay"
      isOpen={isOpen}
      onRequestClose={onClose}
    >
      <div className="header">
        <div className="header-flex">
          <h2>Change Password</h2>
          <button onClick={onClose} className="close-button">
            <Icon icon="mdi:close" />
          </button>
        </div>
        <p>Enter your current password and choose a new one</p>
      </div>
      <form onSubmit={handleSubmit} className="password-form">
        <div className="form-group">
          <label htmlFor="currentPassword">
            <Icon icon="mdi:lock" />
            Current Password
          </label>
          <input
            type="password"
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            autoComplete="off" 
          />
        </div>
        <div className="form-group">
          <label htmlFor="newPassword">
            <Icon icon="mdi:lock-plus" />
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            autoComplete="off" 
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">
            <Icon icon="mdi:lock-check" />
            Confirm New Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="off" 
          />
        </div>
        <button type="submit" disabled={loading} className="submit-button">
          {loading ? (
            <>
              <Icon icon="mdi:loading" className="spin" /> Changing Password...
            </>
          ) : (
            <>
              <Icon icon="mdi:check" /> Change Password
            </>
          )}
        </button>
        {error && <p className="error">{error}</p>}
      </form>
    </ReactModal>
  );
};