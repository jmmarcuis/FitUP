import React, { Component } from "react";
import { Icon } from "@iconify/react";
import "./Notification.scss"
export class Notification extends Component {
  render() {
    return (
      <>
        <Icon icon="mdi:notifications" />
      </>
    );
  }
}

export default Notification;
