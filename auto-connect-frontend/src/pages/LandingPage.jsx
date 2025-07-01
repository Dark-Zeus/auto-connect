import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Button,
  Typography,
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Fade,
  Zoom,
} from "@mui/material";
import {
  Login as LoginIcon,
  PersonAdd as RegisterIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Cloud as CloudIcon,
  People as PeopleIcon,
} from "@mui/icons-material";
import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: <SecurityIcon className="feature-icon" />,
      title: "Secure Authentication",
      description:
        "Advanced security protocols to protect your data with multi-factor authentication and encryption.",
    },
    {
      icon: <SpeedIcon className="feature-icon" />,
      title: "Lightning Fast",
      description:
        "Optimized performance ensures quick access to your account and seamless user experience.",
    },
    {
      icon: <CloudIcon className="feature-icon" />,
      title: "Cloud Integration",
      description:
        "Seamlessly sync across all your devices with our robust cloud infrastructure.",
    },
    {
      icon: <PeopleIcon className="feature-icon" />,
      title: "Team Collaboration",
      description:
        "Connect with team members and manage permissions with our comprehensive user management system.",
    },
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <Container maxWidth="lg">
          <div className="hero-content">
            <Fade in={isVisible} timeout={1000}>
              <div className="hero-text">
                <Typography variant="h1" className="hero-title" gutterBottom>
                  Welcome to{" "}
                  <span className="brand-highlight">AutoConnect</span>
                </Typography>
                <Typography variant="h5" className="hero-subtitle" gutterBottom>
                  Your secure gateway to seamless authentication and user
                  management
                </Typography>
                <Typography variant="body1" className="hero-description">
                  Experience the future of secure authentication with our
                  cutting-edge platform. Join thousands of users who trust
                  AutoConnect for their security needs.
                </Typography>
              </div>
            </Fade>

            <Zoom in={isVisible} timeout={1200}>
              <div className="hero-actions">
                <Button
                  variant="contained"
                  size="large"
                  className="cta-button primary"
                  startIcon={<LoginIcon />}
                  onClick={() => navigate("/auth/login")}
                >
                  Sign In
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  className="cta-button secondary"
                  startIcon={<RegisterIcon />}
                  onClick={() => navigate("/auth/register")}
                >
                  Get Started
                </Button>
              </div>
            </Zoom>
          </div>
        </Container>

        {/* Animated Background Elements */}
        <div className="background-elements">
          <div className="floating-element element-1"></div>
          <div className="floating-element element-2"></div>
          <div className="floating-element element-3"></div>
          <div className="floating-element element-4"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <Container maxWidth="lg">
          <Fade in={isVisible} timeout={1500}>
            <Typography
              variant="h2"
              className="section-title"
              textAlign="center"
              gutterBottom
            >
              Why Choose AutoConnect?
            </Typography>
          </Fade>

          <Grid container spacing={4} className="features-grid">
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Zoom in={isVisible} timeout={1000 + index * 200}>
                  <Card className="feature-card">
                    <CardContent className="feature-content">
                      <Box className="feature-icon-container">
                        {feature.icon}
                      </Box>
                      <Typography
                        variant="h6"
                        className="feature-title"
                        gutterBottom
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        className="feature-description"
                      >
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>
            ))}
          </Grid>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <Container maxWidth="md">
          <Fade in={isVisible} timeout={2000}>
            <Box className="cta-content">
              <Typography
                variant="h3"
                className="cta-title"
                textAlign="center"
                gutterBottom
              >
                Ready to Get Started?
              </Typography>
              <Typography
                variant="h6"
                className="cta-subtitle"
                textAlign="center"
                gutterBottom
              >
                Join our platform today and experience secure, seamless
                authentication
              </Typography>
              <Box className="cta-actions">
                <Button
                  variant="contained"
                  size="large"
                  className="cta-button primary large"
                  startIcon={<RegisterIcon />}
                  onClick={() => navigate("/auth/register")}
                >
                  Create Account
                </Button>
                <Typography variant="body2" className="cta-note">
                  Already have an account?
                  <Link to="/auth/login" className="login-link">
                    Sign in here
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Fade>
        </Container>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <Container maxWidth="lg">
          <Box className="footer-content">
            <Typography variant="body2" className="footer-text">
              © 2025 AutoConnect. All rights reserved.
            </Typography>
            <Box className="footer-links">
              <Link to="/terms" className="footer-link">
                Terms & Conditions
              </Link>
              <Link to="/privacy" className="footer-link">
                Privacy Policy
              </Link>
              <Link to="/help" className="footer-link">
                Help Center
              </Link>
            </Box>
          </Box>
        </Container>
      </footer>
    </div>
  );
};

export default LandingPage;
