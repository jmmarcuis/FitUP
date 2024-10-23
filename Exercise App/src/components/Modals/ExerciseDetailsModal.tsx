// components/ExerciseDetailsModal/ExerciseDetailsModal.tsx
import React from 'react';
import ReactModal from 'react-modal';
import { ClipLoader } from 'react-spinners';
import { Icon } from "@iconify/react";
import useExerciseDetails from '../../hooks/useExerciseDetails';
import './ExerciseDetailsModal.scss';

interface ExerciseDetailsModalProps {
  exerciseId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const ExerciseDetailsModal: React.FC<ExerciseDetailsModalProps> = ({
  exerciseId,
  isOpen,
  onClose,
}) => {
  const { exerciseDetails, loading, error } = useExerciseDetails(exerciseId);

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="exercise-modal"
      overlayClassName="modal-overlay"
      ariaHideApp={false}
    >
      <div className="modal-content">
        <div className="modal-header">
          <h2>{exerciseDetails?.name || 'Exercise Details'}</h2>
          <button className="close-button" onClick={onClose}>
            <Icon icon="material-symbols:close" />
          </button>
        </div>

        {loading ? (
          <div className="loading-container">
            <ClipLoader color="#007bff" size={50} />
          </div>
        ) : error ? (
          <div className="error-message">
            Error loading exercise details: {error}
          </div>
        ) : exerciseDetails && (
          <div className="exercise-content">
            {/* Main Image */}
            {exerciseDetails.images?.length > 0 && (
              <div className="image-container">
                <img
                  src={exerciseDetails.images.find(img => img.is_main)?.image || exerciseDetails.images[0].image}
                  alt={exerciseDetails.name}
                />
              </div>
            )}

            {/* Description */}
            <div className="content-section">
              <h3>Description</h3>
              <div 
                dangerouslySetInnerHTML={{ __html: exerciseDetails.description }}
                className="description"
              />
            </div>

            {/* Category */}
            <div className="content-section">
              <h3>Category</h3>
              <p>{exerciseDetails.category?.name}</p>
            </div>

            {/* Muscles */}
            {exerciseDetails.muscles?.length > 0 && (
              <div className="content-section">
                <h3>Primary Muscles</h3>
                <ul>
                  {exerciseDetails.muscles.map(muscle => (
                    <li key={muscle.id}>{muscle.name}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Equipment */}
            {exerciseDetails.equipment?.length > 0 && (
              <div className="content-section">
                <h3>Equipment Needed</h3>
                <ul>
                  {exerciseDetails.equipment.map(item => (
                    <li key={item.id}>{item.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </ReactModal>
  );
};

export default ExerciseDetailsModal;