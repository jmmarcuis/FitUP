import React, { useState, useEffect } from "react";
import ReactModal from "react-modal";
import "./EditClientModal.scss";
import { Icon } from "@iconify/react";
import useClientDetails from "../../hooks/useClientDetails";
import useUpdateClientDetails from "../../hooks/useUpdateClientDetails";
 
interface EditClientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditClientModal: React.FC<EditClientModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const {
    clientDetails,
    loading: fetchLoading,
    error: fetchError,
  } = useClientDetails();
  const {
    updateClientDetails,
    loading: updateLoading,
    error: updateError,
  } = useUpdateClientDetails();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    height: 0,
    weight: 0,
  });
  const [profilePicture, setProfilePicture] = useState<File | null>(null);

  useEffect(() => {
    if (clientDetails) {
      setFormData({
        firstName: clientDetails.firstName,
        lastName: clientDetails.lastName,
        dateOfBirth: clientDetails.dateOfBirth,
        height: clientDetails.height,
        weight: clientDetails.weight,
      });
    }
  }, [clientDetails]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePicture(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updates = { ...formData };
      if (profilePicture) {
        await updateClientDetails({ ...updates, profilePicture });
      } else {
        await updateClientDetails(updates);
      }
      onClose();
    } catch (error) {
      console.error("Failed to update client details", error);
    }
  };

  if (fetchLoading) return <div>Loading...</div>;
  if (fetchError) return <div>Error: {fetchError}</div>;
  if (!clientDetails) return null;

  return (
    <ReactModal
      className="edit-client-modal-content"
      overlayClassName="modal-overlay"
      isOpen={isOpen}
      onRequestClose={onClose}
    >
      <div className="header">
        <div className="header-flex">
          <h2>Edit Profile</h2>
          <button onClick={onClose} className="close-button">
            <Icon icon="mdi:close" />
          </button>
        </div>
        <p>Provide details about yourself and any other information</p>
      </div>
      <form onSubmit={handleSubmit} className="information-container">
        <h4>Basic Information</h4>
        <div className="profile-picture-container">
          <img
            src={previewImage || clientDetails.profilePicture}
            alt="User profile"
          />
          <label htmlFor="profile-picture-upload" className="upload-button">
            <Icon icon="mdi:camera" />
            Upload Photo
          </label>
          <input
            type="file"
            id="profile-picture-upload"
            onChange={handleFileChange}
            accept="image/*"
            hidden
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">
              <Icon icon="mdi:account" />
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">
              <Icon icon="mdi:account" />
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="dateOfBirth">
            <Icon icon="mdi:calendar" />
            Date of Birth
          </label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="height">
              <Icon icon="mdi:human-male-height" />
              Height (cm)
            </label>
            <input
              type="number"
              id="height"
              name="height"
              value={formData.height}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="weight">
              <Icon icon="mdi:weight" />
              Weight (kg)
            </label>
            <input
              type="number"
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={updateLoading}
          className="submit-button"
        >
          {updateLoading ? (
            <>
              <Icon icon="mdi:loading" className="spin" /> Updating...
            </>
          ) : (
            <>Save Changes</>
          )}
        </button>
        {updateError && <p className="error">{updateError}</p>}
      </form>
    </ReactModal>
  );
};
