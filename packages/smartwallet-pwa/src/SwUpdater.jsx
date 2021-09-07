import React from "react";
import "./index.css";
import IconRefresh from "./Assets/svg/IconRefresh";

const SwUpdater = ({ onClick }) => {
  return (
    <div className="notification-wrapper">
      <p>Has an update available.</p>
      <div className="icon-wrapper" onClick={onClick}>
        <IconRefresh />
      </div>
    </div>
  );
};

export default SwUpdater;
