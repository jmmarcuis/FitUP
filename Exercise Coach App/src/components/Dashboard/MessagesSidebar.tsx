import React, { useEffect, useState } from 'react';
import { ActiveClient } from '../../services/collaborationService';
import { getActiveClients } from '../../services/collaborationService';
import './MessagesSidebar.scss';

interface MessagesSidebarProps {
  onClientSelect: (client: ActiveClient) => void;
  selectedClientId?: string;
}

const MessagesSidebar: React.FC<MessagesSidebarProps> = ({ 
  onClientSelect, 
  selectedClientId 
}) => {
  const [activeClients, setActiveClients] = useState<ActiveClient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchActiveClients();
  }, []);

  const fetchActiveClients = async () => {
    try {
      setIsLoading(true);
      const clients = await getActiveClients();
      setActiveClients(clients);
      // If there are clients and none is selected, select the first one
      if (clients.length > 0 && !selectedClientId) {
        onClientSelect(clients[0]);
      }
    } catch (err) {
      setError('Failed to load clients');
      console.error('Error fetching active clients:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="messages-sidebar">
        <div className="loading-state">Loading clients...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="messages-sidebar">
        <div className="error-state">{error}</div>
      </div>
    );
  }

  return (
    <div className="messages-sidebar">
      <div className="sidebar-header">
        <h3>Active Clients</h3>
      </div>
      <div className="clients-list">
        {activeClients.length === 0 ? (
          <div className="no-clients">No active clients found</div>
        ) : (
          activeClients.map((client) => (
            <div
              key={client.clientId}
              className={`client-item ${
                selectedClientId === client.clientId ? 'selected' : ''
              }`}
              onClick={() => onClientSelect(client)}
            >
              <div className="client-avatar">
                <img
                  src={client.clientImage}
                  alt={`${client.firstName} ${client.lastName}`}
                />
              </div>
              <div className="client-info">
                <div className="client-name">
                  {client.firstName} {client.lastName}
                </div>
                <div className="client-email">{client.email}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MessagesSidebar;
