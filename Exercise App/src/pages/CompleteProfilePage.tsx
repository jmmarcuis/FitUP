// src/pages/CompleteProfilePage.tsx
import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { ProfileData } from "../Types/ProfileData";
import { motion, AnimatePresence } from "framer-motion";
import "./CompleteProfile.scss";

const CompleteProfilePage: React.FC = () => {
  const [step, setStep] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const { completeProfile } = useAuth();
  const navigate = useNavigate();

  const handleCompleteProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    const profileData: ProfileData = {
      firstName,
      lastName,
      dateOfBirth,
      height: Number(height),
      weight: Number(weight),
      
    };
    try {
      await completeProfile(profileData);
      navigate("/dashboard");
    } catch (error) {
      console.error("Profile completion error: ", error);
      alert("Profile completion failed");
    }
  };

  const questions = [
    {
      title: "What's your first name?",
      input: (
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
      ),
    },
    {
      title: "And your last name?",
      input: (
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
      ),
    },
    {
      title: "When were you born?",
      input: (
        <input
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          required
        />
      ),
    },
    {
      title: "How tall are you? (cm)",
      input: (
        <input
          type="number"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          required
        />
      ),
    },
    {
      title: "What's your weight? (kg)",
      input: (
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          required
        />
      ),
    },
  ];

  return (
    <div className="complete-profile-page">
      <motion.h2
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Complete Your Profile
      </motion.h2>
      <form onSubmit={handleCompleteProfile}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="question-container"
          >
            <h3>{questions[step].title}</h3>
            {questions[step].input}
          </motion.div>
        </AnimatePresence>
        <div className="button-container">
          {step > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStep((prev) => prev - 1)}
              type="button"
            >
              Previous
            </motion.button>
          )}
          {step < questions.length - 1 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStep((prev) => prev + 1)}
              type="button"
            >
              Next
            </motion.button>
          )}
          {step === questions.length - 1 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
            >
              Complete Profile
            </motion.button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CompleteProfilePage;