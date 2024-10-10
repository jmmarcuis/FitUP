import React from "react";
import "./VideoSentModal.scss";

interface VideoSentModalProps {
  onOk: () => void;
}

const VideoSentModal: React.FC<VideoSentModalProps> = ({ onOk }) => {
  return (
    <div className="modal-overlay">
      <div className="video-sent-modal">
        <p className="emoji">🏋️‍️</p>
        <p className="recorded">Recorded Video</p>
        <p>
          Has <span className="success">successfully</span> been Sent!
        </p>
        <br />
        <button onClick={onOk}>Ok</button>
      </div>
    </div>
  );
};

export default VideoSentModal;
