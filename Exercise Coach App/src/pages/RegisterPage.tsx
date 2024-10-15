import React, { useRef, useState, useEffect } from "react";
import ReactModal from "react-modal";
import "./RegisterPage.scss";
import { Icon } from "@iconify/react";
import axios, { AxiosError } from "axios";
import { TermsandConditionsModal } from "../components/Modals/TermsandConditionsModal";
import { OTPModal } from "../components/Modals/OTPModal";
import { ToastContainer, toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

ReactModal.setAppElement("#root");

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const recaptchaRef = useRef<ReCAPTCHA | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);
  const [isTermsandConditionModalOpen, setIsTermsandConditionModalOpen] =
    useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isRegistrationComplete, setIsRegistrationComplete] = useState(false);
  const [clientId, setClientId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // State variables for form inputs
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");

  //Persistent storage for registration
  //Incase user accidently refreshes application, the application will remember the current state prior refreshing
  useEffect(() => {
    // Check if there's a pending registration
    const pendingRegistration = localStorage.getItem("pendingRegistration");
    if (pendingRegistration) {
      const registrationData = JSON.parse(pendingRegistration);
      // Restore form data
      setFirstName(registrationData.firstName || "");
      setLastName(registrationData.lastName || "");
      setEmail(registrationData.email || "");
      setGender(registrationData.gender || "");
      setDob(registrationData.dateOfBirth || "");
      setWeight(registrationData.weight?.toString() || "");
      setHeight(registrationData.height?.toString() || "");
      // Open OTP modal
      setIsOTPModalOpen(true);
    }
  }, []);

  const pageTransition = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const validateForm = (): boolean => {
    if (!firstName.trim()) {
      toast.error("Please enter your first name");
      return false;
    }
    if (!lastName.trim()) {
      toast.error("Please enter your last name");
      return false;
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (!password || password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    if (!gender) {
      toast.error("Please select your gender");
      return false;
    }
    if (!dob) {
      toast.error("Please enter your date of birth");
      return false;
    }
    if (!weight || isNaN(parseFloat(weight))) {
      toast.error("Please enter a valid weight");
      return false;
    }
    if (!height || isNaN(parseFloat(height))) {
      toast.error("Please enter a valid height");
      return false;
    }
    if (!isTermsAccepted) {
      toast.error("Please accept the terms and conditions");
      return false;
    }
    return true;
  };

  const handleOTPOpenModal = () => {
    setIsOTPModalOpen(true);
  };

  const handleOTPCloseModal = () => {
    setIsOTPModalOpen(false);
    setIsRegistrationComplete(false);
    setIsButtonDisabled(false);
    localStorage.removeItem("pendingRegistration");
  };

  const handleTnCCOpenModal = () => {
    setIsTermsandConditionModalOpen(true);
  };

  const handleTnCCloseModal = () => {
    setIsTermsandConditionModalOpen(false);
  };

  // Function to handle agreement acceptance
  const handleAgreeTerms = () => {
    setIsTermsAccepted(true);
    handleTnCCloseModal();
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const captchaToken = recaptchaRef.current?.getValue();

    if (!captchaToken) {
      toast.error("Please verify the reCAPTCHA!");
      return;
    }

    // // Proceed with form submission if reCAPTCHA is valid
    // toast.success("DEBUG!!!! Form submission successful!");

    setIsButtonDisabled(true);
    setIsLoading(true);

    const registrationData = {
      firstName,
      lastName,
      email,
      password,
      dateOfBirth: dob,
      gender,
      weight: parseFloat(weight),
      height: parseFloat(height),
      captchaToken,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/auth/register",
        registrationData
      );

      // Store registration data in local storage
      localStorage.setItem(
        "pendingRegistration",
        JSON.stringify({
          ...registrationData,
          clientId: response.data.clientId,
        })
      );

      setClientId(response.data.clientId);
      toast.success(response.data.message);
      handleOTPOpenModal();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string }>;
        toast.error(
          axiosError.response?.data?.message || "Registration failed"
        );
      } else {
        handleCancelRegistration();
        toast.error("An unexpected error occurred");
      }
    } finally {
      //Removes loader once modal opens
      setIsLoading(false);
      // Enable the button after 2 seconds
      setTimeout(() => {
        setIsButtonDisabled(false);
      }, 2000);
    }
  };

  const handleVerifyOTP = async (otp: string) => {
    try {
      const response = await axios.post("http://localhost:5000/auth/verify", {
        email,
        otp,
      });

      toast.success(response.data.message);
      handleOTPCloseModal();
      // Clear pending registration data after successful verification
      localStorage.removeItem("pendingRegistration");

      // Redirect to the dashboard or home page
      setTimeout(() => {
        localStorage.setItem("token", response.data.token);
        navigate("/dashboard"); // Adjust this route as needed
      }, 1500);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string }>;
        toast.error(
          axiosError.response?.data?.message || "OTP verification failed"
        );
      } else {
        handleCancelRegistration();
        toast.error("An unexpected error occurred during OTP verification");
      }
    }
  };

  const handleResendOTP = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/auth/resend-otp",
        {
          email,
        }
      );

      toast.success(response.data.message);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string }>;
        toast.error(
          axiosError.response?.data?.message || "Failed to resend OTP"
        );
      } else {
        handleCancelRegistration();
        toast.error("An unexpected error occurred while resending OTP");
      }
    }
  };

  const handleCancelRegistration = async () => {
    try {
      const pendingRegistration = localStorage.getItem("pendingRegistration");
      if (pendingRegistration) {
        const { email } = JSON.parse(pendingRegistration);
        await axios.post("http://localhost:5000/auth/cancel-registration", {
          email,
        });

        // Remove the pending registration data
        localStorage.removeItem("pendingRegistration");
        // Close the OTP modal
        setIsOTPModalOpen(false);
        // Reset the form
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setGender("");
        setDob("");
        setWeight("");
        setHeight("");
        setIsTermsAccepted(false);
        setClientId(null);
        // Show a toast notification
        toast.info("Registration cancelled. You can start over if you'd like.");
      }
    } catch (error) {
      console.error("Error cancelling registration:", error);
      toast.error("Failed to cancel registration. Please try again.");
    }
  };

  return (
    <>
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageTransition}
      >
        <div className="AuthenticationPage-Background">
          <div className="create-account">
            <h1>Create your account</h1>
            <form onSubmit={handleRegister}>
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
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Icon icon={showPassword ? "mdi:eye-off" : "mdi:eye"} />
                    </motion.div>
                  </button>
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="confirm-password">Confirm Password</label>
                <div className="input-with-icon">
                  <Icon icon="mdi:verified-user" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirm-password"
                    placeholder="Confirm your Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Icon
                        icon={showConfirmPassword ? "mdi:eye-off" : "mdi:eye"}
                      />
                    </motion.div>
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
                <input
                  type="checkbox"
                  id="terms"
                  checked={isTermsAccepted}
                  readOnly
                />
                <label htmlFor="terms">
                  I have read & agreed to PowerSync's{" "}
                  <span onClick={handleTnCCOpenModal}>Terms & Condition</span>
                </label>
              </div>
              <div className="form-footer">
                <h2>Let's complete your profile</h2>
                <p>It will help us to know more about you!</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                  type="submit"
                  className={`btn-finish ${isButtonDisabled ? "disabled" : ""}`}
                  disabled={isButtonDisabled || isRegistrationComplete}
                >
                  {isLoading ? (
                    <ClipLoader color="#ffffff" loading={true} size={20} />
                  ) : (
                    "Finish"
                  )}
                </motion.button>

                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey="6Le-Nl0qAAAAAOetJJVm9zgqPFZytBShMJMd8KyO"
                />

                <p className="sign-in-link">
                  Already have an account?{" "}
                  <Link to="/login">
                    <span>Sign In</span>
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
        <OTPModal
          isOpen={isOTPModalOpen}
          onClose={handleOTPCloseModal}
          otpLength={6}
          onVerify={handleVerifyOTP}
          onResend={handleResendOTP}
          onCancelRegistration={handleCancelRegistration}
          email={email}
          clientId={clientId}
        />
        <TermsandConditionsModal
          isOpen={isTermsandConditionModalOpen}
          onClose={handleTnCCloseModal}
          onAgree={handleAgreeTerms}
        />
        <ToastContainer theme="dark" />
      </motion.div>
    </>
  );
};

export default RegisterPage;
