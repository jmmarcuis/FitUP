import React from "react";
import useActiveClients from "../../hooks/useActiveClients";
import "./Tables.scss";

const ActiveClientTable: React.FC = () => {
  const { activeClients, loading, error } = useActiveClients();

  if (loading) return <div className="pending-clients">Loading...</div>;
  if (error) return <div className="pending-clients error">{error}</div>;

  return (
    <>
      <div className="table-container">
        <h2>Active Clients</h2>
        {activeClients.length === 0 ? (
          <p>No pending requests at the moment.</p>
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Start Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {activeClients.map((client) => (
                  <tr key={client.clientId}>
                    <td>
                      <div className="action-flex">
                        <img
                          src={client.clientImage}
                          alt={`${client.firstName} ${client.lastName}`}
                          className="client-image"
                        />
                        {`${client.firstName} ${client.lastName}`}
                      </div>
                    </td>
                    <td>{client.email}</td>
                    <td>{client.startDate}</td>
                    <td><button className="complete-contract-button">Complete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </>
  );
};

export default ActiveClientTable;
