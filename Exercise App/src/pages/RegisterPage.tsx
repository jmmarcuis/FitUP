import React, { useState } from "react";
import ReactModal from "react-modal";
import "./RegisterPage.scss";
import { Icon } from "@iconify/react";

import { TermsandConditionsModal } from "../components/Modals/TermsandConditionsModal";
import { OTPModal } from "../components/Modals/OTPModal";

ReactModal.setAppElement("#root");

const RegisterPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);
  const [isTermsandConditionModalOpen, setIsTermsandConditionModalOpen] =
    useState(false);
  // State variables for form inputs
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");

  const handleOTPOpenModal = () => {
    setIsOTPModalOpen(true);
  };

  const handleOTPCloseModal = () => {
    setIsOTPModalOpen(false);
  };

  
  const handleTnCCOpenModal = () => {
    setIsTermsandConditionModalOpen(true);
  };

  const handleTnCCloseModal = () => {
    setIsTermsandConditionModalOpen(false);
  };

  return (
    <>
      <div className="AuthenticationPage-Background">
        <div className="create-account">
          <h1>Create your account</h1>
          <form>
            <div className="input-row">
              <div className="input-group half">
                <label htmlFor="first-name">First Name</label>
                <div className="input-with-icon">
                  <Icon icon="mdi:user" />
                  <input
                    type="text"
                    id="first-name"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
              </div>
              <div className="input-group half">
                <label htmlFor="last-name">Last Name</label>
                <div className="input-with-icon">
                  <Icon icon="mdi:user" />
                  <input
                    type="text"
                    id="last-name"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="email">Email</label>
              <div className="input-with-icon">
                <Icon icon="mdi:alternate-email" />
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <div className="input-with-icon">
                <Icon icon="mdi:verified-user" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  role="button"
                  tabIndex={0}
                >
                  <Icon icon={showPassword ? "mdi:eye-off" : "mdi:eye"} />
                </button>
              </div>
            </div>

            <div className="input-row">
              <div className="input-group half">
                <label htmlFor="gender">Gender</label>
                <div className="input-with-icon">
                  <Icon icon="mdi:people" style={{ color: "black" }} />
                  <select
                    id="gender"
                    className="gender-select"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="">Choose Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="input-group half">
                <label htmlFor="dob">Date of Birth</label>
                <div className="input-with-icon">
                  <Icon icon="mdi:calendar-month" />
                  <input
                    type="date"
                    id="dob"
                    placeholder="Date of Birth"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="input-row">
              <div className="input-group half">
                <label htmlFor="weight">Weight</label>
                <div className="input-with-icon">
                  <Icon icon="mdi:weight-kilogram" />
                  <input
                    type="number"
                    id="weight"
                    placeholder="Your Weight"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                  <span className="unit">KG</span>
                </div>
              </div>
              <div className="input-group half">
                <label htmlFor="height">Height</label>
                <div className="input-with-icon">
                  <Icon icon="mdi:human-male-height" />
                  <input
                    type="number"
                    id="height"
                    placeholder="Your Height"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                  />
                  <span className="unit">CM</span>
                </div>
              </div>
            </div>

            <div className="checkbox-group">
              <input type="checkbox" id="terms" />
              <label htmlFor="terms" >
                I have read & agreed to PowerSync's <span onClick={handleTnCCOpenModal}>Terms & Condition</span>
              </label>
            </div>

            <div className="form-footer">
              <h2>Let's complete your profile</h2>
              <p>It will help us to know more about you!</p>
              <button onClick={handleOTPOpenModal} className="btn-finish">
                Finish
              </button>
              <p className="sign-in-link">
                Already have an account? <a href="#">Sign In</a>
              </p>
            </div>
          </form>
        </div>
      </div>

      <OTPModal
        isOpen={isOTPModalOpen}
        onClose={handleOTPCloseModal}
        otpLength={6}
      />
      <TermsandConditionsModal isOpen={isTermsandConditionModalOpen} onClose={handleTnCCloseModal} />
    </>
  );
};

export default RegisterPage;
