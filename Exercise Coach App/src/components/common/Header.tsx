import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";  // Make sure this path is correct
import "./Header.scss";
import { motion } from "framer-motion";

const Header: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <header className="header">
      <motion.div
        className="header__logo"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => handleNavigation("/")}
      >
        FitUP
      </motion.div>
      
      {isAuthenticated ? (
        <div className="header__center">
          <nav className="header__nav">
            <Link to="/exercises" className="header__nav-link">
              Exercises
            </Link>
            <Link to="/workouts" className="header__nav-link">
              Workouts
            </Link>
            <Link to="/profile" className="header__nav-link">
              My Profile
            </Link>
          </nav>
          <div className="header__search">
            <input
              type="text"
              placeholder="Search exercises..."
              className="header__search-input"
            />
          </div>
        </div>
      ) : (
        <div className="header__search">
          <input
            type="text"
            placeholder="Search exercises..."
            className="header__search-input"
          />
        </div>
      )}

      <div className="header__auth">
        {isAuthenticated ? (
          <>
            <span className="header__user">Welcome, User</span>
            <button onClick={logout} className="header__button">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              <motion.button
                className="header__auth_button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                Login
              </motion.button>
            </Link>
            <Link to="/register">
              <motion.button
                className="header__auth_button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                Register
              </motion.button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;