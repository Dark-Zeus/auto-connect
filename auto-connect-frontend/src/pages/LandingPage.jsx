import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import Navbar from "../components/NavBar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";

import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const [isVisible, setIsVisible] = useState({});

  // Parallax effects
  const yRange = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacityRange = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  useEffect(() => {
    // Intersection Observer for animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible((prev) => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting,
          }));
        });
      },
      { threshold: 0.1 }
    );

    // Observe all sections
    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const handleGetStarted = () => {
    navigate("/auth/register");
  };

  const handleSignIn = () => {
    navigate("/auth/login");
  };

  return (
    <div className="landing-page">
      {/* Navigation */}
      <Navbar onSignIn={handleSignIn} />

      {/* Hero Section */}
      <motion.div
        style={{ y: yRange, opacity: opacityRange }}
        className="hero-wrapper"
      >
        <Hero onGetStarted={handleGetStarted} />
      </motion.div>

      {/* Features Section */}
      <motion.section
        id="features"
        initial={{ opacity: 0, y: 50 }}
        animate={{
          opacity: isVisible.features ? 1 : 0,
          y: isVisible.features ? 0 : 50,
        }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="section"
      >
        <Features />
      </motion.section>

      {/* How It Works Section */}
      <motion.section
        id="how-it-works"
        initial={{ opacity: 0, y: 50 }}
        animate={{
          opacity: isVisible["how-it-works"] ? 1 : 0,
          y: isVisible["how-it-works"] ? 0 : 50,
        }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        className="section"
      >
        <HowItWorks />
      </motion.section>

      {/* Testimonials Section */}
      <motion.section
        id="testimonials"
        initial={{ opacity: 0, y: 50 }}
        animate={{
          opacity: isVisible.testimonials ? 1 : 0,
          y: isVisible.testimonials ? 0 : 50,
        }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
        className="section"
      >
        <Testimonials />
      </motion.section>

      {/* Call to Action Section */}
      <motion.section
        id="cta"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{
          opacity: isVisible.cta ? 1 : 0,
          scale: isVisible.cta ? 1 : 0.95,
        }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="section cta-section"
      >
        <div className="container">
          <div className="cta-content">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="cta-title"
            >
              Ready to Transform Your Vehicle Management?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="cta-description"
            >
              Join thousands of vehicle owners and service providers who trust
              AutoConnect for seamless automotive lifecycle management.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="cta-buttons"
            >
              <button onClick={handleGetStarted} className="cta-button primary">
                Get Started Free
                <span className="button-icon">→</span>
              </button>
              <button
                onClick={() =>
                  document
                    .getElementById("features")
                    .scrollIntoView({ behavior: "smooth" })
                }
                className="cta-button secondary"
              >
                Learn More
              </button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <Footer />

      {/* Scroll to Top */}
      <ScrollToTop />

      {/* Background Elements */}
      <div className="background-elements">
        <div className="bg-circle bg-circle-1"></div>
        <div className="bg-circle bg-circle-2"></div>
        <div className="bg-circle bg-circle-3"></div>
      </div>
    </div>
  );
};

export default LandingPage;
