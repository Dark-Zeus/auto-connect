import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./AuthLayout.css";

const AuthLayout = ({
  children,
  title,
  subtitle,
  isLogin = false,
  showBackToHome = true,
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const slideVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="auth-layout">
      {/* Left Side - Branding */}
      <motion.div
        className="auth-left"
        variants={slideVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="auth-brand">
          <motion.div
            className="brand-logo"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 18V16C3 14.8954 3.89543 14 5 14H19C20.1046 14 21 14.8954 21 16V18M3 18V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V18M3 18H21M12 2L8 6H16L12 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="7" cy="18" r="1" fill="currentColor" />
              <circle cx="17" cy="18" r="1" fill="currentColor" />
            </svg>
          </motion.div>
          <h1 className="brand-name">AutoConnect</h1>
          <p className="brand-tagline">
            Sri Lanka's Premier Vehicle Lifecycle Management Platform
          </p>
        </div>

        <div className="auth-features">
          <motion.div className="feature-item" variants={itemVariants}>
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="feature-content">
              <h3>Complete Vehicle Management</h3>
              <p>
                Register, track, and manage your vehicle's entire lifecycle in
                one place
              </p>
            </div>
          </motion.div>

          <motion.div className="feature-item" variants={itemVariants}>
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M17 8L21 12L17 16M3 12H21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="feature-content">
              <h3>Seamless Service Booking</h3>
              <p>
                Connect with verified service providers and book appointments
                instantly
              </p>
            </div>
          </motion.div>

          <motion.div className="feature-item" variants={itemVariants}>
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L2 7L12 12L22 7L12 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 17L12 22L22 17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 12L12 17L22 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="feature-content">
              <h3>Secure & Trusted</h3>
              <p>
                Bank-level security with comprehensive insurance integration
              </p>
            </div>
          </motion.div>
        </div>

        <div className="auth-testimonial">
          <div className="testimonial-content">
            <p>
              "AutoConnect has revolutionized how I manage my fleet. The
              platform is intuitive, comprehensive, and incredibly reliable."
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">JD</div>
              <div className="author-info">
                <span className="author-name">Janaka Dissanayake</span>
                <span className="author-role">Fleet Manager, Colombo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Background decorations */}
        <div className="auth-left-bg">
          <div className="bg-circle-1"></div>
          <div className="bg-circle-2"></div>
          <div className="bg-circle-3"></div>
        </div>
      </motion.div>

      {/* Right Side - Form */}
      <motion.div
        className="auth-right"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="auth-form-container">
          {showBackToHome && (
            <motion.div className="back-to-home" variants={itemVariants}>
              <Link to="/" className="back-link">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M19 12H5M5 12L12 19M5 12L12 5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Back to Home
              </Link>
            </motion.div>
          )}

          <motion.div className="auth-header" variants={itemVariants}>
            <h2 className="auth-title">{title}</h2>
            <p className="auth-subtitle">{subtitle}</p>
          </motion.div>

          <motion.div className="auth-form" variants={itemVariants}>
            {children}
          </motion.div>

          <motion.div className="auth-footer" variants={itemVariants}>
            {isLogin ? (
              <p>
                Don't have an account?{" "}
                <Link to="/auth/register" className="auth-link">
                  Sign up for free
                </Link>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <Link to="/auth/login" className="auth-link">
                  Sign in
                </Link>
              </p>
            )}
          </motion.div>

          <motion.div className="auth-help" variants={itemVariants}>
            <p>
              Need help?{" "}
              <a href="mailto:support@autoconnect.lk" className="help-link">
                Contact Support
              </a>
            </p>
          </motion.div>
        </div>

        {/* Background decorations */}
        <div className="auth-right-bg">
          <div className="bg-pattern"></div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;
