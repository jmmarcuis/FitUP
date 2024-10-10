import React from "react";
import "./RestComplete.scss";

interface RestCompleteProps {
    onOk: () => void;
  }
  
  const RestComplete: React.FC<RestCompleteProps> = ({ onOk }) => {
    return (
      <div className="modal-overlay">
        <div className="rest-complete-modal">
          <p className="emoji">🏋️‍️</p>
          <p>
            Rest Complete Get back to <span className="work">Work!</span>
            </p><br/>
          <button onClick={onOk}>Ok</button>
        </div>
      </div>
    );
  };
  
  export default RestComplete;