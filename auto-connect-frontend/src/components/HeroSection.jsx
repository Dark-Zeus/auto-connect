import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  ArrowRight,
  Car,
  Zap,
  Shield,
  Users,
  LogIn,
  UserPlus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./HeroSection.css";

const HeroSection = () => {
  const [activeCard, setActiveCard] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  const heroFeatures = [
    "Complete Vehicle Registry & History Management",
    "Competitive Trading Platform with Transparent Bidding",
    "Direct Service Provider Marketplace Integration",
    "Automated Insurance Claims & Digital Processing",
  ];

  const interactiveCards = [
    {
      icon: <Car className="w-8 h-8" />,
      title: "500+",
      subtitle: "Vehicles Registered",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "200+",
      subtitle: "Service Providers",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "2.5B+",
      subtitle: "Transaction Value",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "99.9%",
      subtitle: "Uptime Guarantee",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % interactiveCards.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [interactiveCards.length]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const handleLogin = () => {
    navigate("/auth/login");
  };

  const handleRegister = () => {
    navigate("/auth/register");
  };

  return (
    <section id="home" className="hero-section-modern">
      <div className="hero-container-modern">
        <div className="hero-grid-modern">
          {/* Content */}
          <div className="hero-content-modern">
            <div className="hero-badge-modern">
              <div className="badge-glow"></div>
              <span>🚗 Sri Lanka's #1 Vehicle Platform</span>
            </div>

            <h1 className="hero-title-modern">
              <span className="title-line">Complete Vehicle</span>
              <span className="title-gradient-modern">
                Lifecycle Management
              </span>
            </h1>

            <p
              className="hero-description-modern"
              style={{
                fontSize: "1.35rem",
                lineHeight: "1.7",
                fontWeight: 500,
              }}
            >
              Revolutionary digital ecosystem connecting vehicle owners, service
              providers, and insurance companies through transparent, efficient,
              and secure platform operations across Sri Lanka.
            </p>

            <div className="hero-features-modern">
              {heroFeatures.map((feature, index) => (
                <div key={index} className="hero-feature-modern">
                  <div className="feature-icon-wrapper">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  </div>
                  <span
                    style={{
                      fontSize: "1.1rem",
                      lineHeight: "1.5",
                      fontWeight: 500,
                    }}
                  >
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hero-buttons-modern">
              <button className="hero-primary-button-modern">
                <span>Start Your Journey</span>
                <ArrowRight className="w-5 h-5 arrow-icon" />
              </button>
              <button className="hero-secondary-button-modern">
                <div className="button-ripple"></div>
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Auth Buttons */}
            <div className="hero-auth-buttons">
              <button className="hero-auth-button login" onClick={handleLogin}>
                <LogIn className="w-5 h-5" />
                <span>Login</span>
              </button>
              <button
                className="hero-auth-button register"
                onClick={handleRegister}
              >
                <UserPlus className="w-5 h-5" />
                <span>Register</span>
              </button>
            </div>
          </div>

          {/* Visual */}
          <div className="hero-visual-modern" onMouseMove={handleMouseMove}>
            {/* 3D Vehicle Visualization */}
            <div className="vehicle-showcase">
              <div className="vehicle-3d-container">
                {/* Animated Car Icon */}
                <div className="vehicle-icon-3d">
                  <Car className="w-24 h-24 text-white" />
                  <div className="vehicle-glow"></div>
                </div>

                {/* Rotating Ring */}
                <div className="rotating-ring">
                  <div className="ring-segment"></div>
                  <div className="ring-segment"></div>
                  <div className="ring-segment"></div>
                  <div className="ring-segment"></div>
                </div>
              </div>

              {/* Interactive Stats Cards */}
              <div className="stats-orbit">
                {interactiveCards.map((card, index) => (
                  <div
                    key={index}
                    className={`stat-card-floating ${
                      activeCard === index ? "active" : ""
                    }`}
                    style={{
                      "--delay": `${index * 0.5}s`,
                      "--angle": `${index * 90}deg`,
                    }}
                  >
                    <div className="card-gradient">
                      <div className="card-icon">{card.icon}</div>
                      <div className="card-content">
                        <div className="card-number">{card.title}</div>
                        <div className="card-label">{card.subtitle}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Particle Effects */}
              <div className="particle-field">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="particle"
                    style={{
                      "--delay": `${i * 0.3}s`,
                      "--x": `${Math.random() * 100}%`,
                      "--y": `${Math.random() * 100}%`,
                    }}
                  ></div>
                ))}
              </div>
            </div>

            {/* Background Effects */}
            <div className="hero-bg-effects">
              <div className="gradient-orb orb-1"></div>
              <div className="gradient-orb orb-2"></div>
              <div className="gradient-orb orb-3"></div>
            </div>

            {/* Mouse Follower */}
            <div
              className="mouse-follower"
              style={{
                left: `${mousePosition.x}%`,
                top: `${mousePosition.y}%`,
              }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
