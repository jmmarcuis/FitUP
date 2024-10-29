import React from "react";
import "./ClientReportCard.scss";
import useClientCounts from "../../hooks/useClientCounts";
const ClientReportCard = () => {
  const { clientCounts, loading, error } = useClientCounts();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="report-card">
      <div className="stat-box">
        <span className="stat-value">{clientCounts.totalClients}</span>
        <span className="stat-label">Total Clients</span>
      </div>
      <div className="stat-box">
        <span className="stat-value">{clientCounts.activeClients}</span>
        <span className="stat-label">Active Clients</span>
      </div>
      <div className="stat-box">
        <span className="stat-value">{clientCounts.pendingClients}</span>
        <span className="stat-label">Pending Clients</span>
      </div>
      
    </div>
  );
};

export default ClientReportCard;
