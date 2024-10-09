import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./LoginPage.scss";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { ClipLoader } from "react-spinners";
 import { useLogin } from "../hooks/useLogin";
const LoginPage: React.FC = () => {
  const { handleLogin, isLoading, isLoginComplete, isButtonDisabled } = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);


 

  const notifyNextFeature = () => toast("This will be a feature soon!");

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await handleLogin(email, password); // Call the login handler from the custom hook
  };


  return (
    <>
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
       >
        <div className="AuthenticationPage-Background">
          <div className="login-account">
            <h1>Welcome Back!</h1>
            <form onSubmit={onSubmit}>
              <div className="input-group">
                <label htmlFor="email">Email</label>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                  className="input-with-icon"
                >
                  <Icon icon="mdi:alternate-email" />
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </motion.div>
              </div>

              <div className="input-group">
                <label htmlFor="password">Password</label>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                  className="input-with-icon"
                >
                  <Icon icon="mdi:verified-user" />
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
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Icon icon={showPassword ? "mdi:eye-off" : "mdi:eye"} />
                    </motion.div>
                  </button>
                </motion.div>
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

            <div className="login-thru-socials">
              <motion.button
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "#f7f7f7",
                 }}
                whileTap={{ scale: 0.9 }}
                onClick={notifyNextFeature}
              >
                <Icon icon="fe:google" /> <p>Google</p>
              </motion.button>

              <motion.button
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "#f7f7f7",
                  }}
                whileTap={{ scale: 0.9 }}
                onClick={notifyNextFeature}
              >
                <Icon icon="ic:baseline-apple" /> <p>Apple</p>
              </motion.button>

              <motion.button
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "#f7f7f7",
                 }}
                whileTap={{ scale: 0.9 }}
                onClick={notifyNextFeature}
              >
                <Icon icon="uil:facebook" /> <p>Facebook</p>
              </motion.button>
            </div>


            <div className="form-footer">
              <p className="sign-in-link">
                Don't have an account?{" "}
                <Link to="/register">
                  <span>Sign Up</span>
                </Link>
              </p>
            </div>
          </div>
        </div>
        <ToastContainer theme="dark" position="top-center" autoClose={2300} />
      </motion.div>
    </>
  );
};

export default LoginPage;
