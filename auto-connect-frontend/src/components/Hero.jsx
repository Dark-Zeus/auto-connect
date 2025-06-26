import React from "react";
import { motion } from "framer-motion";
import "./Hero.css";

const Hero = ({ onGetStarted }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="hero">
      <div className="hero-container">
        <motion.div
          className="hero-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="hero-badge">
            <span className="badge-icon">🚗</span>
            <span className="badge-text">
              Sri Lanka's #1 Vehicle Management Platform
            </span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="hero-title">
            Revolutionize Your
            <span className="hero-title-highlight"> Vehicle Lifecycle</span>
            <br />
            Management
          </motion.h1>

          <motion.p variants={itemVariants} className="hero-description">
            From registration to marketplace trading, service bookings to
            insurance claims - manage your entire vehicle journey in one
            comprehensive platform. Join thousands of satisfied users across Sri
            Lanka.
          </motion.p>

          <motion.div variants={itemVariants} className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">10K+</span>
              <span className="stat-label">Vehicles Registered</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Service Providers</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">50K+</span>
              <span className="stat-label">Services Completed</span>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="hero-actions">
            <motion.button
              onClick={onGetStarted}
              className="hero-button primary"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 15px 35px rgba(74, 98, 138, 0.3)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Get Started Free</span>
              <svg className="button-arrow" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12H19M19 12L12 5M19 12L12 19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.button>

            <motion.button
              className="hero-button secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                document
                  .getElementById("features")
                  .scrollIntoView({ behavior: "smooth" })
              }
            >
              <svg className="play-icon" viewBox="0 0 24 24" fill="none">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <polygon points="10,8 16,12 10,16" fill="currentColor" />
              </svg>
              <span>Watch Demo</span>
            </motion.button>
          </motion.div>

          <motion.div variants={itemVariants} className="hero-features">
            <div className="feature-badge">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Free to Start</span>
            </div>
            <div className="feature-badge">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22Z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M12 6V12L16 14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <span>24/7 Support</span>
            </div>
            <div className="feature-badge">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Secure & Trusted</span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="hero-visual"
          variants={imageVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="hero-image-container">
            <div className="hero-dashboard">
              <div className="dashboard-header">
                <div className="dashboard-nav">
                  <div className="nav-dot active"></div>
                  <div className="nav-dot"></div>
                  <div className="nav-dot"></div>
                </div>
                <div className="dashboard-title">AutoConnect Dashboard</div>
              </div>

              <div className="dashboard-content">
                <div className="dashboard-card vehicle-card">
                  <div className="card-icon">🚗</div>
                  <div className="card-content">
                    <h4>My Vehicles</h4>
                    <p>3 Registered</p>
                  </div>
                </div>

                <div className="dashboard-card service-card">
                  <div className="card-icon">🔧</div>
                  <div className="card-content">
                    <h4>Services</h4>
                    <p>2 Pending</p>
                  </div>
                </div>

                <div className="dashboard-card insurance-card">
                  <div className="card-icon">🛡️</div>
                  <div className="card-content">
                    <h4>Insurance</h4>
                    <p>Active</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              className="floating-element element-1"
              animate={{
                y: [0, -10, 0],
                rotate: [0, 5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="notification-card">
                <div className="notification-icon">📱</div>
                <div className="notification-content">
                  <span>Service Reminder</span>
                  <small>Oil change due in 2 days</small>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="floating-element element-2"
              animate={{
                y: [0, 10, 0],
                rotate: [0, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            >
              <div className="notification-card success">
                <div className="notification-icon">✅</div>
                <div className="notification-content">
                  <span>Insurance Approved</span>
                  <small>Claim processed successfully</small>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="floating-element element-3"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
            >
              <div className="trust-badge">
                <div className="badge-icon">🏆</div>
                <span>Trusted Platform</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Background decorations */}
      <div className="hero-background">
        <div className="bg-gradient-1"></div>
        <div className="bg-gradient-2"></div>
        <div className="bg-pattern"></div>
      </div>
    </section>
  );
};

export default Hero;
