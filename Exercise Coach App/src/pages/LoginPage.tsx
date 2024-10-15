import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./RegisterPage.scss";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { ClipLoader } from "react-spinners";
import { useLogin } from "../hooks/useLogin";

const LoginPage: React.FC = () => {
  const { handleLogin, isLoading, isLoginComplete, isButtonDisabled } = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const notifyNextFeature = () => toast.info("This feature is coming soon!");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Basic validation
    if (!email || !password) {
      toast.error("Both email and password are required.");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    try {
      await handleLogin(email, password);
     } catch (error) {
      toast.error("Login failed. Please check your credentials.");
    }
  };

  return (
    <motion.div initial="initial" animate="animate" exit="exit">
      <div className="AuthenticationPage-Background">
        <div className="login-account">
          <h1>Coach Login</h1>
          <form onSubmit={onSubmit}>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <div
        
                className="input-with-icon"
              >
                <Icon icon="mdi:alternate-email" className="icon" />
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <div
    
                className="input-with-icon"
              >
                <Icon icon="mdi:verified-user" className="icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <div
          
                  >
                    <Icon icon={showPassword ? "mdi:eye-off" : "mdi:eye"} />
                  </div>
                </button>
              </div>
              <span onClick={notifyNextFeature}>Forgot Password?</span>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              type="submit"
              className={`btn-finish ${isButtonDisabled ? "disabled" : ""}`}
              disabled={isButtonDisabled || isLoginComplete}
            >
              {isLoading ? (
                <ClipLoader color="#ffffff" loading={true} size={20} />
              ) : (
                "Login"
              )}
            </motion.button>
          </form>
          <div className="divider-container">
            <div className="divider-line"></div>
            <div className="divider">Or Continue with</div>
            <div className="divider-line"></div>
          </div>



          <div className="form-footer">
            <p className="sign-in-link">
              Don't have an account?{" "}
              
                <span>Contact the Administrator</span>
           
            </p>
          </div>
        </div>
      </div>
      <ToastContainer theme="dark" position="top-center" autoClose={3000} />
    </motion.div>
  );
};



export default LoginPage;
