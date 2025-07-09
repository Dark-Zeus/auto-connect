import React, { useState, useEffect } from "react";
import {
  Car,
  Menu,
  X,
  ArrowRight,
  CheckCircle,
  Database,
  Gavel,
  Users,
  Shield,
  BarChart3,
  Star,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Clock,
  Award,
  Zap,
  TrendingUp,
  ArrowDownRight,
  Sparkles,
} from "lucide-react";
import {
  useScrollAnimation,
  useStaggeredAnimation,
} from "../hooks/useScrollAnimation";
import "./LandingPage.css";

// Import the HeroSection component
import HeroSection from "../components/HeroSection";

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Animation refs
  const [featuresRef, featuresVisible] = useScrollAnimation();
  const [statsRef, statsVisible] = useScrollAnimation();
  const [workflowRef, workflowVisible] = useScrollAnimation();
  const [testimonialsRef, testimonialsVisible] = useScrollAnimation();
  const [ctaRef, ctaVisible] = useScrollAnimation();
  const [featuresGridRef, featuresGridVisible] = useStaggeredAnimation();
  const [statsGridRef, statsGridVisible] = useStaggeredAnimation();
  const [workflowStepsRef, workflowStepsVisible] = useStaggeredAnimation();
  const [testimonialsGridRef, testimonialsGridVisible] =
    useStaggeredAnimation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: <Database className="w-8 h-8" />,
      title: "Digital Vehicle Registry",
      description:
        "Comprehensive vehicle registration system with immutable maintenance history, secure document management, and automated compliance reminders for complete lifecycle tracking.",
      highlight: "Complete History Management",
      benefits: ["Immutable Records", "Document Storage", "Compliance Alerts"],
      color: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      icon: <Gavel className="w-8 h-8" />,
      title: "Competitive Trading Platform",
      description:
        "Transparent vehicle marketplace featuring competitive bidding, complete history disclosure, secure escrow transactions, and market intelligence for optimal valuations.",
      highlight: "Transparent Bidding System",
      benefits: [
        "Competitive Bidding",
        "History Transparency",
        "Secure Transactions",
      ],
      color: "from-green-500 to-green-600",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Service Marketplace",
      description:
        "Direct appointment booking with verified service providers, real-time service tracking, integrated payment processing, and comprehensive provider rating system.",
      highlight: "Verified Professional Network",
      benefits: ["Direct Booking", "Real-time Tracking", "Verified Providers"],
      color: "from-purple-500 to-purple-600",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Insurance Integration",
      description:
        "Automated insurance claim processing, digital accident reporting, AI-powered damage assessment, and seamless repair authorization workflows with real-time updates.",
      highlight: "Streamlined Claims Processing",
      benefits: ["Auto Claims", "Digital Reporting", "AI Assessment"],
      color: "from-orange-500 to-orange-600",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Business Intelligence",
      description:
        "Advanced analytics dashboard with predictive maintenance algorithms, market insights, fraud detection systems, and comprehensive performance monitoring for all stakeholders.",
      highlight: "AI-Powered Analytics",
      benefits: ["Predictive Analytics", "Fraud Detection", "Market Insights"],
      color: "from-teal-500 to-teal-600",
      iconBg: "bg-teal-100",
      iconColor: "text-teal-600",
    },
  ];

  const stats = [
    {
      number: "25,000+",
      label: "Registered Vehicles",
      subtext: "Complete digital profiles",
    },
    {
      number: "1,200+",
      label: "Verified Service Providers",
      subtext: "Across Sri Lanka",
    },
    {
      number: "150,000+",
      label: "Services Completed",
      subtext: "With full transparency",
    },
    {
      number: "₹2.5B+",
      label: "Transaction Value",
      subtext: "Facilitated securely",
    },
  ];

  const workflowSteps = [
    {
      number: "1",
      title: "Vehicle Registration & History",
      description:
        "Create comprehensive digital vehicle profiles with complete maintenance history tracking, document management, and automated compliance reminders.",
      icon: <Database className="w-8 h-8" />,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      features: ["Digital Profiles", "History Tracking", "Compliance Alerts"],
      stats: "25K+ Vehicles",
    },
    {
      number: "2",
      title: "Trading Platform & Bidding",
      description:
        "List vehicles on our transparent marketplace with competitive bidding system, complete history disclosure, and secure ownership transfer workflows.",
      icon: <Gavel className="w-8 h-8" />,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      features: [
        "Competitive Bidding",
        "Transparent Process",
        "Secure Transfer",
      ],
      stats: "₹2.5B+ Value",
    },
    {
      number: "3",
      title: "Service Marketplace",
      description:
        "Connect directly with verified service providers, book appointments, track service completion, and automatically update vehicle history records.",
      icon: <Users className="w-8 h-8" />,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      features: ["Direct Booking", "Verified Providers", "Real-time Tracking"],
      stats: "1.2K+ Providers",
    },
    {
      number: "4",
      title: "Insurance & Claims",
      description:
        "Streamlined insurance claim processing with automated workflows, digital accident reporting, damage assessment, and real-time claim tracking.",
      icon: <Shield className="w-8 h-8" />,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      features: ["Auto Claims", "Digital Reporting", "Real-time Tracking"],
      stats: "98% Success Rate",
    },
    {
      number: "5",
      title: "Analytics & Intelligence",
      description:
        "Access comprehensive dashboards, predictive maintenance recommendations, market insights, and fraud detection for optimal decision making.",
      icon: <BarChart3 className="w-8 h-8" />,
      color: "from-teal-500 to-teal-600",
      bgColor: "bg-teal-50",
      iconBg: "bg-teal-100",
      iconColor: "text-teal-600",
      features: ["Predictive Analytics", "Market Insights", "Fraud Detection"],
      stats: "Real-time Data",
    },
  ];

  const testimonials = [
    {
      name: "Rajesh Fernando",
      role: "Fleet Manager, Lanka Transport",
      comment:
        "The vehicle lifecycle management transformed our fleet operations. We've seen 40% reduction in maintenance costs and complete transparency in our vehicle history. This platform revolutionized how we manage our entire fleet.",
      rating: 5,
      avatar: "RF",
      company: "Lanka Transport Ltd.",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      location: "Colombo, Sri Lanka",
    },
    {
      name: "Samantha Silva",
      role: "Certified Service Provider",
      comment:
        "Since joining the platform, our service bookings increased by 60%. The direct appointment system and payment integration make business seamless. Customer satisfaction has never been higher.",
      rating: 5,
      avatar: "SS",
      company: "Silva Auto Services",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b60f67d4?w=400&h=400&fit=crop&crop=face",
      location: "Kandy, Sri Lanka",
    },
    {
      name: "Michael Perera",
      role: "Insurance Claims Manager",
      comment:
        "Claims processing time reduced from weeks to hours. The digital damage assessment and automated workflows revolutionized our operations completely. ROI exceeded all expectations.",
      rating: 5,
      avatar: "MP",
      company: "Ceylon Insurance Co.",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      location: "Galle, Sri Lanka",
    },
  ];

  const ctaFeatures = [
    "✓ Free platform registration",
    "✓ Complete vehicle history tracking",
    "✓ Access to verified service network",
    "✓ Transparent marketplace transactions",
  ];

  return (
    <div className="landing-page scrollable">
      {/* Header */}
      <header className={`header ${isScrolled ? "scrolled" : ""}`}>
        <div className="header-container">
          <div className="header-content">
            {/* Logo */}
            <div className="logo">
              <div className="logo-icon">
                <Car className="w-6 h-6 text-white" />
              </div>
              <span className="logo-text">
                Auto<span className="logo-accent">Connect</span>
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="nav-desktop">
              {[
                "Home",
                "Platform",
                "Services",
                "Success Stories",
                "Contact",
              ].map((item, index) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(" ", "-")}`}
                  className="nav-link"
                >
                  {item}
                </a>
              ))}
            </nav>

            {/* CTA Button */}
            <button className="cta-button-header">Join Platform</button>

            {/* Mobile Menu Button */}
            <button
              className="mobile-menu-button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="mobile-menu">
            <div className="mobile-menu-content">
              {[
                "Home",
                "Platform",
                "Services",
                "Success Stories",
                "Contact",
              ].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(" ", "-")}`}
                  className="mobile-menu-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <button className="mobile-cta-button">Join Platform</button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main>
        {/* Hero Section - Now imported as a separate component */}
        <HeroSection />

        {/* Enhanced Features Section */}
        <section
          id="platform"
          className={`features-section animate-on-scroll ${
            featuresVisible ? "animate-fade-up" : ""
          }`}
          ref={featuresRef}
        >
          <div className="section-container">
            {/* Section Header */}
            <div className="section-header">
              <h2 className="section-title">
                <span>Comprehensive </span>
                <span className="title-gradient">Platform Features</span>
              </h2>
              <p className="section-description">
                Five integrated modules working together to revolutionize
                vehicle lifecycle management across Sri Lanka's automotive
                ecosystem
              </p>
            </div>

            {/* Enhanced Features Grid */}
            <div
              className={`enhanced-features-grid stagger-children ${
                featuresGridVisible ? "animate" : ""
              }`}
              ref={featuresGridRef}
            >
              {features.map((feature, index) => (
                <div key={index} className="enhanced-feature-card hover-lift">
                  {/* Enhanced Icon */}
                  <div className="enhanced-feature-icon">
                    <div className={`enhanced-icon-wrapper ${feature.iconBg}`}>
                      <div className={feature.iconColor}>{feature.icon}</div>
                    </div>
                    <div className="feature-pulse"></div>
                  </div>

                  {/* Content */}
                  <div className="enhanced-feature-content">
                    <div className="feature-highlight">{feature.highlight}</div>
                    <h3 className="enhanced-feature-title">{feature.title}</h3>
                    <p className="enhanced-feature-description">
                      {feature.description}
                    </p>

                    {/* Enhanced Benefits */}
                    <div className="enhanced-feature-benefits">
                      {feature.benefits.map((benefit, idx) => (
                        <span key={idx} className="enhanced-benefit-tag">
                          <CheckCircle className="w-3 h-3" />
                          {benefit}
                        </span>
                      ))}
                    </div>

                    {/* Progress Indicator */}
                    <div className="feature-progress">
                      <div className="progress-bar">
                        <div
                          className={`progress-fill bg-gradient-to-r ${feature.color}`}
                        ></div>
                      </div>
                      <span className="progress-text">
                        Advanced Integration
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Feature Stats */}
            <div className="features-stats">
              <div className="stat-item">
                <Clock className="w-5 h-5 text-blue-500" />
                <span>24/7 Uptime</span>
              </div>
              <div className="stat-item">
                <Award className="w-5 h-5 text-green-500" />
                <span>ISO Certified</span>
              </div>
              <div className="stat-item">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span>Real-time Processing</span>
              </div>
              <div className="stat-item">
                <TrendingUp className="w-5 h-5 text-purple-500" />
                <span>97% Success Rate</span>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section
          className={`stats-section animate-on-scroll ${
            statsVisible ? "animate-scale-in" : ""
          }`}
          ref={statsRef}
        >
          <div className="section-container">
            {/* Header */}
            <div className="section-header">
              <h2 className="section-title">
                Platform Impact & <span className="title-gradient">Growth</span>
              </h2>
              <p className="section-description">
                Real numbers demonstrating our platform's success in
                transforming Sri Lanka's automotive sector
              </p>
            </div>

            {/* Stats Grid */}
            <div
              className={`stats-grid stagger-children ${
                statsGridVisible ? "animate" : ""
              }`}
              ref={statsGridRef}
            >
              {stats.map((stat, index) => (
                <div key={index} className="stat-card-large hover-lift">
                  <div className="stat-content">
                    <div className="stat-number-large">{stat.number}</div>
                    <div className="stat-label-large">{stat.label}</div>
                    <div className="stat-subtext">{stat.subtext}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Workflow Section */}
        <section
          id="services"
          className={`enhanced-workflow-section animate-on-scroll ${
            workflowVisible ? "animate-fade-up" : ""
          }`}
          ref={workflowRef}
        >
          <div className="section-container">
            <div className="section-header">
              <h2 className="section-title">
                <span>Our Platform's </span>
                <span className="title-gradient">Core Ecosystem</span>
              </h2>
              <p className="section-description">
                Five integrated modules working together to revolutionize
                vehicle lifecycle management from registration to analytics
                across Sri Lanka's automotive ecosystem.
              </p>
            </div>

            <div
              className={`enhanced-workflow-grid stagger-children ${
                workflowStepsVisible ? "animate" : ""
              }`}
              ref={workflowStepsRef}
            >
              {workflowSteps.map((step, index) => (
                <div key={index} className="enhanced-workflow-card hover-lift">
                  {/* Card Header */}
                  <div className="workflow-card-header">
                    <div
                      className={`workflow-step-number bg-gradient-to-r ${step.color}`}
                    >
                      {step.number}
                    </div>
                    <div className="workflow-stats-badge">
                      <Sparkles className="w-4 h-4" />
                      <span>{step.stats}</span>
                    </div>
                  </div>

                  {/* Enhanced Icon Section */}
                  <div className="workflow-icon-section">
                    <div className={`workflow-icon-wrapper ${step.iconBg}`}>
                      <div className={step.iconColor}>{step.icon}</div>
                    </div>
                    <div className="workflow-icon-glow"></div>
                  </div>

                  {/* Content Section */}
                  <div className="workflow-content-section">
                    <h3 className="workflow-step-title">{step.title}</h3>
                    <p className="workflow-step-description">
                      {step.description}
                    </p>

                    {/* Features List */}
                    <div className="workflow-features-list">
                      {step.features.map((feature, idx) => (
                        <div key={idx} className="workflow-feature-item">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Section */}
                  <div className="workflow-action-section">
                    <button
                      className={`workflow-action-button bg-gradient-to-r ${step.color}`}
                    >
                      <span>Learn More</span>
                      <ArrowDownRight className="w-4 h-4 group-hover:translate-x-1 group-hover:translate-y-1 transition-transform" />
                    </button>
                  </div>

                  {/* Background Decoration */}
                  <div className={`workflow-card-bg ${step.bgColor}`}></div>
                </div>
              ))}
            </div>

            {/* Workflow Stats */}
            <div className="workflow-bottom-stats">
              <div className="workflow-stat-item">
                <div className="stat-icon bg-blue-100 text-blue-600">
                  <Database className="w-6 h-6" />
                </div>
                <div className="stat-info">
                  <div className="stat-number">100%</div>
                  <div className="stat-label">Integration Success</div>
                </div>
              </div>
              <div className="workflow-stat-item">
                <div className="stat-icon bg-green-100 text-green-600">
                  <Shield className="w-6 h-6" />
                </div>
                <div className="stat-info">
                  <div className="stat-number">99.9%</div>
                  <div className="stat-label">Security Uptime</div>
                </div>
              </div>
              <div className="workflow-stat-item">
                <div className="stat-icon bg-purple-100 text-purple-600">
                  <Zap className="w-6 h-6" />
                </div>
                <div className="stat-info">
                  <div className="stat-number">24/7</div>
                  <div className="stat-label">Support Available</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Testimonials Section */}
        <section
          id="success-stories"
          className={`testimonials-section animate-on-scroll ${
            testimonialsVisible ? "animate-fade-up" : ""
          }`}
          ref={testimonialsRef}
        >
          <div className="section-container">
            {/* Header */}
            <div className="section-header">
              <h2 className="section-title">
                <span>Success </span>
                <span className="title-gradient">Stories</span>
              </h2>
              <p className="section-description">
                Real experiences from vehicle owners, service providers, and
                insurance companies who transformed their operations with our
                comprehensive automotive platform
              </p>
            </div>

            {/* Fixed Testimonials Grid */}
            <div
              className={`testimonials-grid stagger-children ${
                testimonialsGridVisible ? "animate" : ""
              }`}
              ref={testimonialsGridRef}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="testimonial-card hover-lift">
                  <div className="testimonial-background"></div>

                  {/* Fixed Header Layout */}
                  <div className="fixed-testimonial-header">
                    <div className="testimonial-avatar-container">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="testimonial-image"
                        loading="lazy"
                      />
                      <div className="avatar-ring"></div>
                      <div className="avatar-badge">
                        <CheckCircle className="w-4 h-4" />
                      </div>
                    </div>

                    <div className="testimonial-info">
                      <h4 className="testimonial-name">{testimonial.name}</h4>
                      <p className="testimonial-role">{testimonial.role}</p>
                      <p className="testimonial-company">
                        {testimonial.company}
                      </p>
                      <p className="testimonial-location">
                        {testimonial.location}
                      </p>
                    </div>
                  </div>

                  {/* Separated Rating */}
                  <div className="testimonial-rating">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="star-icon" />
                    ))}
                  </div>

                  {/* Enhanced Quote */}
                  <blockquote className="testimonial-quote">
                    <div className="quote-mark">"</div>
                    <p className="quote-text">{testimonial.comment}</p>
                  </blockquote>

                  {/* Additional Elements */}
                  <div className="testimonial-footer">
                    <div className="testimonial-metrics">
                      <span className="metric">Verified Review</span>
                      <span className="metric-separator">•</span>
                      <span className="metric">Platform User Since 2023</span>
                    </div>
                  </div>

                  <div className="testimonial-glow"></div>
                </div>
              ))}
            </div>

            {/* Additional Social Proof */}
            <div className="testimonials-stats">
              <div className="testimonial-stat">
                <div className="stat-number">98%</div>
                <div className="stat-label">Customer Satisfaction</div>
              </div>
              <div className="testimonial-stat">
                <div className="stat-number">2,500+</div>
                <div className="stat-label">Happy Customers</div>
              </div>
              <div className="testimonial-stat">
                <div className="stat-number">4.9/5</div>
                <div className="stat-label">Average Rating</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section
          className={`cta-section animate-on-scroll ${
            ctaVisible ? "animate-scale-in" : ""
          }`}
          ref={ctaRef}
        >
          {/* Background Elements */}
          <div className="cta-background">
            <div className="cta-decoration cta-decoration-1"></div>
            <div className="cta-decoration cta-decoration-2"></div>
          </div>

          <div className="cta-container">
            <div className="cta-content">
              {/* Main Content */}
              <div className="cta-text">
                <h2 className="cta-title">
                  Ready to Transform Your Vehicle Management?
                </h2>
                <p className="cta-description">
                  Join thousands of satisfied users across Sri Lanka and
                  experience the future of comprehensive vehicle lifecycle
                  management. Start your digital transformation today.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="cta-buttons">
                <button className="cta-primary-button">
                  <span>Join the Platform</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="cta-secondary-button">
                  <span>Schedule Demo</span>
                </button>
              </div>

              {/* Features List */}
              <div className="cta-features">
                {ctaFeatures.map((feature, index) => (
                  <div key={index} className="cta-feature">
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer id="contact" className="footer">
          <div className="footer-container">
            <div className="footer-grid">
              {/* Brand Section */}
              <div className="footer-brand">
                <div className="footer-logo">
                  <div className="footer-logo-icon">
                    <Car className="w-6 h-6 text-white" />
                  </div>
                  <span className="footer-logo-text">
                    iAuto<span className="logo-accent">Connect</span>
                  </span>
                </div>
                <p className="footer-description">
                  Sri Lanka's most comprehensive vehicle lifecycle management
                  platform. Connecting vehicle owners, service providers, and
                  insurance companies through transparent, efficient, and secure
                  digital ecosystem.
                </p>
                <div className="footer-social">
                  {[Facebook, Twitter, Instagram, Linkedin].map(
                    (Icon, index) => (
                      <a key={index} href="#" className="social-link">
                        <Icon className="w-5 h-5" />
                      </a>
                    )
                  )}
                </div>
              </div>

              {/* Platform Services */}
              <div className="footer-section">
                <h4 className="footer-section-title">Platform Services</h4>
                <ul className="footer-links">
                  {[
                    "Vehicle Registry",
                    "Trading Marketplace",
                    "Service Booking",
                    "Insurance Integration",
                    "Analytics Dashboard",
                  ].map((item, index) => (
                    <li key={index}>
                      <a href="#" className="footer-link">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact */}
              <div className="footer-section">
                <h4 className="footer-section-title">Contact Us</h4>
                <div className="footer-contact">
                  <div className="contact-item">
                    <Mail className="w-5 h-5 contact-icon" />
                    <span>platform@autoconnect.lk</span>
                  </div>
                  <div className="contact-item">
                    <Phone className="w-5 h-5 contact-icon" />
                    <span>+94 11 234 5678</span>
                  </div>
                  <div className="contact-item">
                    <MapPin className="w-5 h-5 contact-icon" />
                    <span>Colombo 03, Sri Lanka</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom */}
            <div className="footer-bottom">
              <p className="footer-copyright">
                © 2025 AutoConnect. All rights reserved. Revolutionizing Sri
                Lanka's automotive ecosystem through comprehensive digital
                transformation.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default LandingPage;
