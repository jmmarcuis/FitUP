import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import './TrainerCard.scss';
import CoachDetailsModal from '../../Modals/CoachModals/CoachDetailsModal';

interface TrainerCardProps {
  title: string;
  trainer: { name: string; role: string; contact: string; profilePicture: string };
}

const TrainerCard: React.FC<TrainerCardProps> = ({ title, trainer }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <div className="trainer-card">
      <h4>{title}</h4>
      <div className="trainer-info">
        <img src={trainer.profilePicture} alt={`${trainer.name}'s profile`} />
        <div className="trainer-details">
          <h4>{trainer.name}</h4>
          <p className="role">{trainer.role}</p>
          <p className="contact">{trainer.contact}</p>
        </div>
        <Icon
          icon="mdi:information"
          className="info-icon"
          onClick={handleOpenModal}
          style={{ cursor: 'pointer' }}
        />
      </div>

      {/* Coach Details Modal */}
      {modalVisible && (
        <CoachDetailsModal
          image={trainer.profilePicture}
          name={trainer.name}
          description={`${trainer.role} with extensive experience in strength training.`}
          onClose={handleCloseModal}
          showCollaborateButton={false}
        />
      )}
    </div>
  );
};

export default TrainerCard;