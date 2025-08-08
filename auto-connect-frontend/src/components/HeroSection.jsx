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
import AutoConnectMascot from "@/assets/images/AutoConnectMascot.png";

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
                color: "#1a1a1a",
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
<div
  className="relative flex items-center justify-center min-h-[520px] p-10 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 shadow-[0_20px_80px_-10px_rgba(74,98,138,0.25)] overflow-hidden transition-all duration-500"
>
  {/* Orb glow background */}
  <div className="absolute -top-16 -left-16 w-64 h-64 bg-primary-medium opacity-20 rounded-full blur-3xl z-0"></div>
  <div className="absolute -bottom-12 -right-12 w-52 h-52 bg-primary-blue opacity-20 rounded-full blur-2xl z-0"></div>
  {/* Mascot image */}
  <img
    src={AutoConnectMascot}
    alt="AutoConnect Mascot"
    className="relative z-10 max-w-full max-h-[480px] object-contain rounded-2xl shadow-xl hover:scale-105 transition-transform duration-500 ease-in-out animate-bounce-smooth"
  />
</div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
