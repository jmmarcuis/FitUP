import React, { useState, useEffect, useRef } from "react";
import ReactModal from "react-modal";
import "./OTPModal.scss";
import { ConfirmationModal } from "./ConfirmationModal";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  otpLength?: number;
  onVerify: (otp: string) => void;
  onResend: () => void;
  onCancelRegistration: () => void;
  email: string;
  clientId: unknown;
}

export const OTPModal: React.FC<ModalProps> = ({
  isOpen,
  otpLength = 6,
  onVerify,
  onResend,
  onCancelRegistration,
  email,
}) => {
  const [countdown, setCountdown] = useState(15);
  const [canResend, setCanResend] = useState(false);
  const inputs = useRef<HTMLInputElement[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const initialOtp = JSON.parse(localStorage.getItem("otp") || "[]");
  const [otp, setOtp] = useState(Array(otpLength).fill("").map((_, index) => initialOtp[index] || ""));

  useEffect(() => {
    if (isOpen) {
      setCountdown(15);
      setCanResend(false);
    }
  }, [isOpen]);

  useEffect(() => {
    localStorage.setItem("otp", JSON.stringify(otp));
  }, [otp]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0 && !canResend) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [countdown, canResend]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
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
    onResend();
    setCountdown(15);
    setCanResend(false);
    setOtp(Array(otpLength).fill(""));
    localStorage.removeItem("otp");
  };

  const handleVerify = () => {
    onVerify(otp.join(""));
    // Clear the OTP input after successful verification
    setOtp(Array(otpLength).fill(""));
    localStorage.removeItem("otp");
  };

  const handleCloseRequest = () => {
    setShowConfirmation(true);
  };

  const handleConfirmClose = () => {
    // Clear the OTP input when canceling registration
    setOtp(Array(otpLength).fill(""));
    localStorage.removeItem("otp");
    
    setShowConfirmation(false);
    onCancelRegistration();
  };

  return (
    <>
      <ReactModal
        className="otp-modal-content"
        overlayClassName="modal-overlay"
        isOpen={isOpen}
        onRequestClose={handleCloseRequest}
      >
        <div className="otp-modal-header">
          <h2>Account Verification</h2>
          <p>Please enter the {otpLength}-digit code sent to</p>
          <span>{email}</span>
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
        <button onClick={handleVerify}>Verify</button>
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
      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmClose}
        message="Are you sure you want to cancel your registration? This action cannot be undone."
      />
    </>
  );
};
