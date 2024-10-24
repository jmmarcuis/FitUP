import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faMailchimp,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";

import "./Footer.scss";

const Footer: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <footer className="footer">
      <motion.div
        className="footer__logo"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => handleNavigation("/")}
      >
        FitUP
      </motion.div>

      <div className="footer__socials">
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <FontAwesomeIcon icon={faGithub} className="footer__icon" />
        </motion.div>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <FontAwesomeIcon icon={faMailchimp} className="footer__icon" />
        </motion.div>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <FontAwesomeIcon icon={faInstagram} className="footer__icon" />
        </motion.div>
      </div>
      <div className="footer__details">©2024 Jhainno Marcos</div>
    </footer>
  );
};

export default Footer;
