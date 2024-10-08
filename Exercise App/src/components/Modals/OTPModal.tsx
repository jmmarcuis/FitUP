import React, { useState, useEffect, useRef } from "react";
import ReactModal from "react-modal";
import "./OTPModal.scss";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  otpLength?: number;
}

export const OTPModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  otpLength = 6,
}) => {
  const [countdown, setCountdown] = useState(15);
  const [canResend, setCanResend] = useState(false);
  const inputs = useRef<HTMLInputElement[]>([]);
  const [otp, setOtp] = useState(Array(otpLength).fill(""));

  // Start countdown when modal opens
  useEffect(() => {
    if (isOpen) {
      setCountdown(15);
      setCanResend(false);
    }
  }, [isOpen]);

  // Countdown logic
  useEffect(() => {
    if (countdown > 0 && !canResend) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (countdown === 0) {
      setCanResend(true);
    }
  }, [countdown, canResend]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value } = e.target;
    if (value.match(/^\d*$/)) {
      const newOtp = [...otp];
      newOtp[index] = value.slice(-1);
      setOtp(newOtp);
      if (value && index < otpLength - 1) {
        inputs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      if (index > 0) {
        inputs.current[index - 1]?.focus();
      }
    }
  };

  const handleResend = () => {
    setCountdown(15);
    setCanResend(false);
  };

  return (
    <ReactModal
      className="otp-modal-content"
      overlayClassName="modal-overlay"
      isOpen={isOpen}
      onRequestClose={onClose}
    >
      <div className="otp-modal-header">
        <h2>Account Verification</h2>
        <p>Please enter the {otpLength}-digit code sent to</p>
        <span>placeholderemail@gmail.com</span>
      </div>
      <div className="otp-field-flex">
        {otp.map((_, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            value={otp[index]}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            ref={(el) => (inputs.current[index] = el as HTMLInputElement)}
          />
        ))}
      </div>

      <button onClick={onClose}>Verify</button>

      <div className="resend-container">
        <p>
          Didn't receive the code?&nbsp;
          <span
            onClick={canResend ? handleResend : undefined}
            style={{
              cursor: canResend ? "pointer" : "not-allowed",
              textDecoration: "underline",
              color: canResend ? "#ffffff" : "#4c4c4d",
            }}
          >
            Resend
          </span>
         </p>

        {countdown > 0 && <p>Resend available in {countdown} seconds</p>}
      </div>
    </ReactModal>
  );
};
