import React from "react";
import ReactModal from "react-modal";
import "./TermsandConditionsModal.scss";
import { Icon } from "@iconify/react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAgree: () => void;
}

export const TermsandConditionsModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onAgree,
}) => {
    
  return (
    <>
      <ReactModal
        className="termsAndConditions-modal-content"
        overlayClassName="modal-overlay"
        isOpen={isOpen}
        onRequestClose={onClose}
      >
        <div className="header-flex">
          <h2>Terms and Conditions</h2>
          <Icon onClick={onClose}   className="icon" icon="material-symbols:close" />
        </div>

        <div className="content">
          <h3>1. Acceptance of Terms</h3>
          <p>
            By creating an account or using our Services, you confirm that you are at least 18 years old and have the legal capacity to enter into these Terms.
          </p>

          <h3>2. User Accounts</h3>
          <h4>2.1 Registration</h4>
          <p>
            To access certain features of FitConnect, you must create an account. You agree to provide accurate, current, and complete information during the registration process.
          </p>

          <h4>2.2 Account Security</h4>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
          </p>

          <h3>3. Use of Services</h3>
          <h4>3.1 User Conduct</h4>
          <p>
            You agree to use FitConnect only for lawful purposes and in accordance with these Terms.
          </p>

          <h4>3.2 Content Sharing</h4>
          <p>
            By sharing content on FitConnect, you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, modify, and display such content.
          </p>

          <h3>4. Collaboration Features</h3>
          <h4>4.1 Group Workouts</h4>
          <p>
            Participation in group workouts is voluntary and at your own risk.
          </p>

          <h4>4.2 Trainer Collaboration</h4>
          <p>
            FitConnect does not guarantee the qualifications or expertise of trainers listed on the platform.
          </p>

          <h3>5. Payment Terms</h3>
          <h4>5.1 Subscription Fees</h4>
          <p>
            Certain features may require a subscription fee. By subscribing, you agree to pay all applicable fees and taxes associated with your subscription.
          </p>

          <h4>5.2 Refund Policy</h4>
          <p>
            All subscription fees are non-refundable unless otherwise specified in promotional offers.
          </p>

          <h3>6. Intellectual Property</h3>
          <p>
            All content and trademarks associated with FitConnect are owned by us or our licensors.
          </p>

          <h3>7. Limitation of Liability</h3>
          <p>
            FitConnect is not liable for any indirect damages arising from your use of the Services.
          </p>

          <h3>8. Termination</h3>
          <p>
            We reserve the right to suspend or terminate your account at any time for any reason without prior notice.
          </p>

          <h3>9. Changes to Terms</h3>
          <p>
            We may update these Terms from time to time, and your continued use constitutes acceptance of the new Terms.
          </p>

          <h3>10. Governing Law</h3>
          <p>
            These Terms shall be governed by the laws of [Your Jurisdiction].
          </p>

        </div>

        <div className="button-flex">
          <button id="agree" onClick={onAgree}>Agree</button>
          <button id="reject" onClick={onClose}>Reject</button>
        </div>
      </ReactModal>
    </>
  );
};
