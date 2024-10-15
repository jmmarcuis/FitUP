/* eslint-disable @typescript-eslint/ban-types */
import React, { Component } from "react";
import "./Clients.scss";
import ReactModal from "react-modal";
import ActiveClientTable from "../Tables/ActiveClientTable";
import PendingClientTable from "../Tables/PendingClientTable";

ReactModal.setAppElement("#root");

interface ClientsState {
  showActiveClients: boolean;
}

export default class Clients extends Component<{}, ClientsState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      showActiveClients: false, // Initially show pending clients
    };
  }

  handleToggleTable = (showActive: boolean) => {
    this.setState({ showActiveClients: showActive });
  };

  render() {
    return (
      <>
        <div className="client-container">
          <div className="client-button-flex">
            <button
              className={!this.state.showActiveClients ? 'active' : ''}
              onClick={() => this.handleToggleTable(false)}
            >
              Pending Clients
            </button>
            <button
              className={this.state.showActiveClients ? 'active' : ''}
              onClick={() => this.handleToggleTable(true)}
            >
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
