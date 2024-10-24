import React, { Component } from "react";
import {Link} from "react-router-dom";
import "./Homepage.scss";

export default class Homepage extends Component {
  render() {
    return (
      <div className="HomePage-Background">
        <div className="HomePage-Content">
          <h1>
            Unleash your
            <br />
            strength, synced.
            <br />
            with <span className="highlight">PowerSync</span>
          </h1>
          <Link to="/login">
            <button>Let's Start </button>
          </Link>
        </div>
      </div>
    );
  }
}
