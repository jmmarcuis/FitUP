import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { motion } from "framer-motion";

import './ToggleLightDarkSwitch.scss';

const ToggleLightDarkSwitch = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const handleToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <label className={`toggle-switch ${isDarkMode ? 'dark' : 'light'}`}>
      <input
        type="checkbox"
        className="toggle-switch-input"
        checked={isDarkMode}
        onChange={handleToggle}
       
      />
      <motion.div className="toggle-switch-slider"  layout transition={spring}></motion.div>

      <Icon icon="ic:round-nightlight" className="moon-icon" />
      <Icon icon="ic:baseline-wb-sunny" className="sun-icon" />
    </label>
  );
};

const spring = {
  type: "spring",
  stiffness: 700,
  damping: 30
};

export default ToggleLightDarkSwitch;