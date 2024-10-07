import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate,Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faGoogle,
  faApple,
} from "@fortawesome/free-brands-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./RegisterPage.scss";

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState(""); 
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
  

    if (!email || !userName || !password || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }
  
    // Check if passwords match
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
  
    try {
      await register(email, password, userName);
            navigate("/complete-profile");
    } catch (error) {
      console.error("Registration error: ", error);
      toast.error("Registration failed. Please try again.");
    }
  };
  
  return (
    <>
      <div className="register-page">
        <h2>Welcome!</h2>
        <form onSubmit={handleRegister}>
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            type="submit"
          >
            Register
          </motion.button>
        </form>

        <div className="register-through-socials">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <FontAwesomeIcon icon={faApple} className="register__icon" />
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <FontAwesomeIcon icon={faFacebook} className="register__icon" />
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <FontAwesomeIcon icon={faGoogle} className="register__icon" />
          </motion.div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default RegisterPage;
