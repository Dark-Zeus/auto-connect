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
  Avatar,
} from "@mui/material";
import {
  Login as LoginIcon,
  PersonAdd as RegisterIcon,
  DirectionsCar as VehicleIcon,
  Build as ServiceIcon,
  Assessment as AnalyticsIcon,
  Security as InsuranceIcon,
  Gavel as AuctionIcon,
  History as HistoryIcon,
  VerifiedUser as TrustIcon,
  Speed as PerformanceIcon,
  Star as StarIcon,
  CheckCircle as CheckIcon,
  ArrowForward as ArrowIcon,
  Timeline as TimelineIcon,
  AttachMoney as MoneyIcon,
  Group as TeamIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
} from "@mui/icons-material";
import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const mainServices = [
    {
      icon: <VehicleIcon className="service-icon" />,
      title: "Vehicle Management",
      description:
        "Complete digital vehicle profiles with comprehensive history tracking and document management for your entire fleet.",
      features: [
        "Digital Vehicle Profiles",
        "Complete History Tracking",
        "Document Management",
        "Maintenance Reminders",
      ],
    },
    {
      icon: <AuctionIcon className="service-icon" />,
      title: "Vehicle Trading",
      description:
        "Transparent marketplace with competitive bidding system for buying and selling vehicles with complete transparency.",
      features: [
        "Competitive Bidding",
        "Market Intelligence",
        "Secure Transactions",
        "Transparent History",
      ],
    },
    {
      icon: <ServiceIcon className="service-icon" />,
      title: "Service Marketplace",
      description:
        "Connect with verified service providers for maintenance, repairs, and comprehensive automotive care services.",
      features: [
        "Verified Providers",
        "Direct Booking",
        "Rating System",
        "Service History",
      ],
    },
    {
      icon: <InsuranceIcon className="service-icon" />,
      title: "Insurance & Claims",
      description:
        "Streamlined insurance claim processing with automated workflows and comprehensive damage assessment.",
      features: [
        "Digital Claims",
        "Quick Processing",
        "Damage Assessment",
        "Settlement Tracking",
      ],
    },
  ];

  const features = [
    {
      icon: <TrustIcon className="feature-icon" />,
      title: "Trusted & Verified",
      description:
        "All service providers are verified and licensed professionals you can trust with your vehicle.",
    },
    {
      icon: <PerformanceIcon className="feature-icon" />,
      title: "Fast & Efficient",
      description:
        "Streamlined processes that save time and reduce paperwork for all stakeholders.",
    },
    {
      icon: <AnalyticsIcon className="feature-icon" />,
      title: "Smart Analytics",
      description:
        "Data-driven insights for better decision making and predictive maintenance scheduling.",
    },
    {
      icon: <HistoryIcon className="feature-icon" />,
      title: "Complete Records",
      description:
        "Immutable vehicle records that increase transparency and build lasting trust.",
    },
  ];

  const stats = [
    { number: "10,000+", label: "Registered Vehicles", icon: <VehicleIcon /> },
    { number: "500+", label: "Service Providers", icon: <ServiceIcon /> },
    { number: "50,000+", label: "Services Completed", icon: <CheckIcon /> },
    { number: "99.5%", label: "Customer Satisfaction", icon: <StarIcon /> },
  ];

  const testimonials = [
    {
      name: "Rajesh Fernando",
      role: "Vehicle Owner",
      avatar: "RF",
      comment:
        "AutoConnect made selling my car incredibly easy. The transparent bidding system helped me get the best possible price for my vehicle.",
      rating: 5,
    },
    {
      name: "Samantha Silva",
      role: "Auto Service Center",
      avatar: "SS",
      comment:
        "Excellent platform to connect with customers. The appointment system is efficient and has significantly improved our business operations.",
      rating: 5,
    },
    {
      name: "Lanka Insurance",
      role: "Insurance Partner",
      avatar: "LI",
      comment:
        "Claims processing is now 3x faster with AutoConnect. The digital workflow has completely transformed our operations and customer satisfaction.",
      rating: 5,
    },
  ];

  const processSteps = [
    {
      step: "01",
      title: "Register Your Vehicle",
      description:
        "Create a comprehensive digital profile for your vehicle with all necessary documents and information.",
      icon: <VehicleIcon />,
    },
    {
      step: "02",
      title: "Access Services",
      description:
        "Book maintenance services, list your vehicle for sale, or file insurance claims through our integrated platform.",
      icon: <ServiceIcon />,
    },
    {
      step: "03",
      title: "Track & Manage",
      description:
        "Monitor your vehicle's complete history and gain valuable insights for better decision making.",
      icon: <TimelineIcon />,
    },
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <Container maxWidth="lg">
          <div className="hero-content">
            <Fade in={isVisible} timeout={800}>
              <div className="hero-text">
                <Typography variant="h1" className="hero-title">
                  Welcome to <span className="brand-name">AutoConnect</span>
                </Typography>

                <Typography variant="h2" className="hero-subtitle">
                  Complete Vehicle Lifecycle Management Platform
                </Typography>

                <Typography variant="body1" className="hero-description">
                  From registration to sale - manage your vehicle's entire
                  journey with transparency, efficiency, and trust. Join
                  thousands of vehicle owners, service providers, and insurance
                  companies who rely on AutoConnect.
                </Typography>

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
              </div>
            </Fade>
          </div>
        </Container>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <Container maxWidth="lg">
          <div className="section-header">
            <Typography variant="h2" className="section-title">
              Our Core Services
            </Typography>
            <Typography variant="h5" className="section-subtitle">
              Everything you need for complete vehicle lifecycle management
            </Typography>
          </div>

          <Grid container spacing={4}>
            {mainServices.map((service, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card className="service-card">
                  <CardContent className="service-content">
                    <div className="service-header">
                      <div className="service-icon-container">
                        {service.icon}
                      </div>
                      <Typography variant="h4" className="service-title">
                        {service.title}
                      </Typography>
                    </div>

                    <Typography variant="body1" className="service-description">
                      {service.description}
                    </Typography>

                    <div className="service-features">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="feature-item">
                          <CheckIcon className="feature-check" />
                          <Typography variant="body2" className="feature-text">
                            {feature}
                          </Typography>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <div className="stat-card">
                  <div className="stat-icon">{stat.icon}</div>
                  <Typography variant="h3" className="stat-number">
                    {stat.number}
                  </Typography>
                  <Typography variant="h6" className="stat-label">
                    {stat.label}
                  </Typography>
                </div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </section>

      {/* How It Works Section */}
      <section className="process-section">
        <Container maxWidth="lg">
          <div className="section-header">
            <Typography variant="h2" className="section-title">
              How AutoConnect Works
            </Typography>
            <Typography variant="h5" className="section-subtitle">
              Simple steps to get started with our platform
            </Typography>
          </div>

          <div className="process-steps">
            {processSteps.map((step, index) => (
              <div className="process-step" key={index}>
                <div className="step-number">{step.step}</div>
                <div className="step-icon">{step.icon}</div>
                <Typography variant="h4" className="step-title">
                  {step.title}
                </Typography>
                <Typography variant="body1" className="step-description">
                  {step.description}
                </Typography>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <Container maxWidth="lg">
          <div className="section-header">
            <Typography variant="h2" className="section-title">
              Why Choose AutoConnect?
            </Typography>
            <Typography variant="h5" className="section-subtitle">
              Trusted by thousands of users across Sri Lanka
            </Typography>
          </div>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card className="feature-card">
                  <CardContent className="feature-content">
                    <div className="feature-icon-container">{feature.icon}</div>
                    <Typography variant="h5" className="feature-title">
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" className="feature-description">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <Container maxWidth="lg">
          <div className="section-header">
            <Typography variant="h2" className="section-title">
              What Our Users Say
            </Typography>
            <Typography variant="h5" className="section-subtitle">
              Real experiences from our satisfied customers
            </Typography>
          </div>

          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card className="testimonial-card">
                  <CardContent>
                    <div className="testimonial-header">
                      <Avatar className="testimonial-avatar">
                        {testimonial.avatar}
                      </Avatar>
                      <div className="testimonial-info">
                        <Typography variant="h6" className="testimonial-name">
                          {testimonial.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          className="testimonial-role"
                        >
                          {testimonial.role}
                        </Typography>
                      </div>
                      <div className="testimonial-rating">
                        {Array.from({ length: testimonial.rating }).map(
                          (_, i) => (
                            <StarIcon key={i} className="star-icon" />
                          )
                        )}
                      </div>
                    </div>
                    <Typography variant="body1" className="testimonial-comment">
                      "{testimonial.comment}"
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <Container maxWidth="md">
          <div className="cta-content">
            <Typography variant="h2" className="cta-title">
              Ready to Transform Your Vehicle Management?
            </Typography>

            <Typography variant="h5" className="cta-subtitle">
              Join thousands of satisfied users and experience the future of
              automotive service management with AutoConnect today.
            </Typography>

            <div className="cta-actions">
              <Button
                variant="contained"
                size="large"
                className="cta-button primary large"
                startIcon={<RegisterIcon />}
                onClick={() => navigate("/auth/register")}
              >
                Get Started Now
              </Button>

              <Typography variant="body1" className="cta-note">
                Already have an account?{" "}
                <Link to="/auth/login" className="login-link">
                  Sign in here
                </Link>
              </Typography>
            </div>

            <div className="trust-badges">
              <div className="trust-badge">
                <TrustIcon className="trust-icon" />
                <Typography variant="body2">Trusted Platform</Typography>
              </div>
              <div className="trust-badge">
                <MoneyIcon className="trust-icon" />
                <Typography variant="body2">Secure Transactions</Typography>
              </div>
              <div className="trust-badge">
                <TeamIcon className="trust-icon" />
                <Typography variant="body2">24/7 Support</Typography>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <Container maxWidth="lg">
          <div className="footer-content">
            <div className="footer-main">
              <Typography variant="h4" className="footer-brand">
                AutoConnect
              </Typography>
              <Typography variant="body1" className="footer-description">
                Complete Vehicle Lifecycle Management Platform for Sri Lanka
              </Typography>
              <div className="footer-contact">
                <div className="contact-item">
                  <EmailIcon className="contact-icon" />
                  <Typography variant="body2">info@autoconnect.lk</Typography>
                </div>
                <div className="contact-item">
                  <PhoneIcon className="contact-icon" />
                  <Typography variant="body2">+94 11 234 5678</Typography>
                </div>
              </div>
            </div>

            <div className="footer-links">
              <div className="footer-section">
                <Typography variant="h6" className="footer-section-title">
                  Services
                </Typography>
                <Link to="/services/vehicle-management" className="footer-link">
                  Vehicle Management
                </Link>
                <Link to="/services/marketplace" className="footer-link">
                  Service Marketplace
                </Link>
                <Link to="/services/trading" className="footer-link">
                  Vehicle Trading
                </Link>
                <Link to="/services/insurance" className="footer-link">
                  Insurance Claims
                </Link>
              </div>

              <div className="footer-section">
                <Typography variant="h6" className="footer-section-title">
                  Support
                </Typography>
                <Link to="/help" className="footer-link">
                  Help Center
                </Link>
                <Link to="/contact" className="footer-link">
                  Contact Us
                </Link>
                <Link to="/terms" className="footer-link">
                  Terms & Conditions
                </Link>
                <Link to="/privacy" className="footer-link">
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <Typography variant="body2" className="footer-copyright">
              © 2025 AutoConnect. All rights reserved. | Designed for Sri Lankan
              automotive industry
            </Typography>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default LandingPage;
