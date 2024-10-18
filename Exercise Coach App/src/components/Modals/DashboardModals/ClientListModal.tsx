import React from "react";
import ReactModal from "react-modal";
import "./ClientListModal.scss";
import { Icon } from "@iconify/react";
import useActiveClients from "../../../hooks/useActiveClients";
import { ActiveClient } from "../../../Types/ActiveClient";
interface ClientListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClientSelect: (client: ActiveClient) => void; // Added onClientSelect prop
}

export const ClientListModal: React.FC<ClientListModalProps> = ({
  isOpen,
  onClose,
  onClientSelect,
}) => {
  const { activeClients, loading, error } = useActiveClients();

  if (loading) return <div className="pending-clients">Loading...</div>;
  if (error) return <div className="pending-clients error">{error}</div>;

  return (
    <ReactModal
      className="client-list-details-modal"
      overlayClassName="modal-overlay"
      isOpen={isOpen}
      onRequestClose={onClose}
    >
      <div className="header-modal-flex">
        <h2>Choose your Client</h2>
        <Icon icon="material-symbols:close" onClick={onClose} />
      </div>

      <div className="">
        {activeClients.map((client) => (
          <div
            key={client.clientId}
            className="client-info-card"
            onClick={() => onClientSelect(client)} // Call onClientSelect when a client is clicked
          >
            <img
              src={client.clientImage}
              alt={`${client.firstName} ${client.lastName}`}
            />
            <div className="coach-info">
              <h4>
                {client.firstName} {client.lastName}
              </h4>
              <p>{client.email}</p>
            </div>
          </div>
        ))}
      </div>
    </ReactModal>
  );
};
