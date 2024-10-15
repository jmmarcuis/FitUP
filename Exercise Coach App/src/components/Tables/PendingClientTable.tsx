import React, { useState } from "react";
import ReactModal from "react-modal";
import usePendingRequests from "../../hooks/usePendingRequest";
import useCollaborationResponse from "../../hooks/useCollaborationResponse";
import { ConfirmationModal } from "../Modals/ConfirmationModal";
import "./Tables.scss";

ReactModal.setAppElement("#root");

const PendingClientTable: React.FC = () => {
  const { pendingRequests, loading, error, refetch } = usePendingRequests();
  const { respondToCollaboration, isLoading: isRespondingLoading, error: respondError } = useCollaborationResponse();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<{ id: string; action: 'accept' | 'decline' } | null>(null);

  const handleAction = (id: string, action: 'accept' | 'decline') => {
    setSelectedRequest({ id, action });
    setIsModalOpen(true);
  };

  const handleConfirm = async () => {
    if (selectedRequest) {
      await respondToCollaboration(selectedRequest.id, selectedRequest.action);
      setIsModalOpen(false);
      refetch(); 
    }
  };

  if (loading) return <div className="pending-clients">Loading...</div>;
  if (error) return <div className="pending-clients error">{error}</div>;

  return (
    <div className="table-container ">
      <h2>Pending Clients</h2>
      {pendingRequests.length === 0 ? (
        <p>No pending requests at the moment.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingRequests.map((request) => (
              <tr key={request._id}>
                <td>
                  <div className="action-flex">
                    <img
                      src={request.client.clientImage}
                      alt={`${request.client.firstName} ${request.client.lastName}`}
                      className="client-image"
                    />
                    {`${request.client.firstName} ${request.client.lastName}`}
                  </div>
                </td>
                <td>{request.client.email}</td>
                <td>{request.status}</td>
                <td>
                  <div className="action-flex">
                    <button onClick={() => handleAction(request._id, 'accept')}>Accept</button>
                    <button onClick={() => handleAction(request._id, 'decline')}>Decline</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
        message={`Are you sure you want to ${selectedRequest?.action} this collaboration request?`}
      />
      {(isRespondingLoading || respondError) && (
        <div className="response-status">
          {isRespondingLoading && <p>Processing your response...</p>}
          {respondError && <p className="error">{respondError}</p>}
        </div>
      )}
    </div>
  );
};

export default PendingClientTable;