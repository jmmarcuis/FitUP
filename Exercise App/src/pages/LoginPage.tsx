import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faGoogle,
  faApple,
} from "@fortawesome/free-brands-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./LoginPage.scss"

const LoginPage: React.FC = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    // Check for missing fields
    if (!identifier || !password) {
      if (!identifier) toast.error("Email or Username is required.");
      if (!password) toast.error("Password is required.");
      return;
    }

    try {
      await login(identifier, password);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error: ", error);
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <>
      <div className="login-page">
        <h2>Welcome!</h2>
        <form onSubmit={handleLogin}>
          <div>
            <input
              type="text"
              placeholder="Email or Username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
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
          <p>
            Do not have an account? <Link to="/register">Sign up</Link>
          </p>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            type="submit"
          >
            Login
          </motion.button>
        </form>

        <div className="login-through-socials">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <FontAwesomeIcon icon={faApple} className="login__icon" />
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <FontAwesomeIcon icon={faFacebook} className="login__icon" />
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <FontAwesomeIcon icon={faGoogle} className="login__icon" />
          </motion.div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default LoginPage
