import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Container, Typography, Button, Fade, Slide } from "@mui/material";
import { ArrowBack, Home as HomeIcon } from "@mui/icons-material";
import "./AuthPage.css";

const AuthPage = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const isLoginPage = location.pathname.includes("/login");
  const isRegisterPage = location.pathname.includes("/register");
  const showBackButton =
    location.pathname !== "/auth/login" &&
    location.pathname !== "/auth/register";

  const handleBackToHome = () => {
    navigate("/");
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="auth-page tw:min-w-full">
      {/* Background Elements */}
      <div className="auth-background">
        <div className="auth-bg-element element-1"></div>
        <div className="auth-bg-element element-2"></div>
        <div className="auth-bg-element element-3"></div>
        <div className="auth-bg-element element-4"></div>
        <div className="auth-bg-element element-5"></div>
      </div>

      {/* Navigation Header */}
      <Box className="auth-header">
        <Container maxWidth="lg">
          <Box className="auth-nav">
            <Fade in={isVisible} timeout={600}>
              <Button
                startIcon={<HomeIcon />}
                className="nav-button home-button"
                onClick={handleBackToHome}
              >
                Home
              </Button>
            </Fade>

            {showBackButton && (
              <Fade in={isVisible} timeout={800}>
                <Button
                  startIcon={<ArrowBack />}
                  className="nav-button back-button"
                  onClick={handleBack}
                >
                  Back
                </Button>
              </Fade>
            )}
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Box className="auth-content">
        <Container maxWidth="sm">
          <Slide direction="up" in={isVisible} timeout={1000}>
            <Box className="auth-form-container">{children}</Box>
          </Slide>
        </Container>
      </Box>

      {/* Brand Footer */}
      <Box className="auth-brand-footer">
        <Fade in={isVisible} timeout={1200}>
          <Box className="brand-container">
            <Typography variant="h5" className="brand-name">
              AutoConnect
            </Typography>
            <Typography variant="body2" className="brand-tagline">
              Secure • Reliable • Modern
            </Typography>
          </Box>
        </Fade>
      </Box>

      {/* Decorative Side Elements */}
      <div className="auth-decorations">
        <div className="decoration left-decoration">
          <div className="decoration-circle circle-1"></div>
          <div className="decoration-circle circle-2"></div>
          <div className="decoration-circle circle-3"></div>
        </div>
        <div className="decoration right-decoration">
          <div className="decoration-circle circle-1"></div>
          <div className="decoration-circle circle-2"></div>
          <div className="decoration-circle circle-3"></div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
