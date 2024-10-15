/* eslint-disable @typescript-eslint/ban-types */
import React, { Component } from "react";
import "./Clients.scss";
import ReactModal from "react-modal";
import ActiveClientTable from "../Tables/ActiveClientTable";
import PendingClientTable from "../Tables/PendingClientTable";
ReactModal.setAppElement("#root");
// Define the type for the component state
interface ClientsState {
  showActiveClients: boolean;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export default class Clients extends Component<{}, ClientsState> {
  constructor(props: {}) {
    super(props);
    // Initialize the state with the correct type
    this.state = {
      showActiveClients: false, // Initially show pending clients
    };
  }

  // Method to toggle between tables
  handleToggleTable = (showActive: boolean) => {
    this.setState({ showActiveClients: showActive });
  };

  render() {
    return (
      <>
        <div className="client-container">
           <div className="client-button-flex">
            <button onClick={() => this.handleToggleTable(false)}>
              Pending Clients
            </button>
            <button onClick={() => this.handleToggleTable(true)}>
              Active Clients
            </button>
          </div>

          <div className="table-container">
            {this.state.showActiveClients ? (
              <ActiveClientTable />
            ) : (
              <PendingClientTable />
            )}
          </div>
        </div>
      </>
    );
  }
}
