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
  Cloud,
  Brain,
  Lock,
  Plug,
  Code,
  UserPlus,
  Calendar,
  Wrench,
  FileCheck,
  ThumbsUp,
  Server,
  Activity,
  Search,
  CreditCard,
  Settings,
  Crown,
  Check,
  ArrowUp,
  Building,
} from "lucide-react";
import {
  useScrollAnimation,
  useStaggeredAnimation,
} from "../hooks/useScrollAnimation";

// CSS Imports - Typography system imported after component styles
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
  const [pricingRef, pricingVisible] = useScrollAnimation();
  const [testimonialsRef, testimonialsVisible] = useScrollAnimation();
  const [ctaRef, ctaVisible] = useScrollAnimation();
  const [featuresGridRef, featuresGridVisible] = useStaggeredAnimation();
  const [statsGridRef, statsGridVisible] = useStaggeredAnimation();
  const [workflowStepsRef, workflowStepsVisible] = useStaggeredAnimation();
  const [pricingGridRef, pricingGridVisible] = useStaggeredAnimation();
  const [testimonialsGridRef, testimonialsGridVisible] =
    useStaggeredAnimation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Platform technical capabilities - WHAT WE BUILT
  const platformFeatures = [
    {
      icon: <Cloud className="w-8 h-8" />,
      title: "Cloud Infrastructure",
      description:
        "Enterprise-grade cloud architecture built on AWS with 99.9% uptime SLA, auto-scaling capabilities, and multi-region deployment for optimal performance and reliability across Sri Lanka.",
      highlight: "99.9% Uptime SLA",
      benefits: ["Auto-scaling", "Multi-region", "Load Balancing"],
      color: "sky-blue",
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI & Analytics Engine",
      description:
        "Advanced machine learning algorithms powered by TensorFlow for predictive maintenance, fraud detection, market analysis, and intelligent recommendations with real-time processing.",
      highlight: "ML-Powered Analytics",
      benefits: ["Predictive Analytics", "Fraud Detection", "Smart Insights"],
      color: "navy-blue",
    },
    {
      icon: <Plug className="w-8 h-8" />,
      title: "Integration Hub",
      description:
        "RESTful APIs with GraphQL support, comprehensive webhook system, payment gateway integrations, and seamless third-party connectivity for extensible platform architecture.",
      highlight: "API-First Architecture",
      benefits: ["REST & GraphQL", "Webhook System", "Payment Gateways"],
      color: "aqua-mist",
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: "Security Framework",
      description:
        "Military-grade 256-bit encryption, OAuth 2.0 authentication, role-based access control, comprehensive audit trails, and ISO 27001 compliance ensuring data privacy.",
      highlight: "ISO 27001 Compliant",
      benefits: ["256-bit Encryption", "OAuth 2.0", "Audit Trails"],
      color: "navy-blue",
    },
    {
      icon: <Code className="w-8 h-8" />,
      title: "Technology Stack",
      description:
        "Modern tech stack with React, Node.js, PostgreSQL, Redis caching, Docker containers, and blockchain integration ensuring scalability, maintainability, and innovation.",
      highlight: "Blockchain-Secured",
      benefits: ["React & Node.js", "Docker Ready", "Blockchain Records"],
      color: "sky-blue",
    },
  ];

  // User workflow steps - HOW USERS EXPERIENCE IT
  const userWorkflowSteps = [
    {
      number: "1",
      title: "Vehicle Registration Journey",
      description:
        "Vehicle owners begin by uploading documents, completing identity verification, and creating comprehensive digital vehicle profiles with ownership history and specifications.",
      icon: <UserPlus className="w-6 h-6" />,
      color: "aqua-mist",
      features: ["Document Upload", "ID Verification", "Digital Profile"],
      stats: "2 min signup",
    },
    {
      number: "2",
      title: "Service Discovery & Booking",
      description:
        "Users browse verified service providers, compare ratings and pricing, check real-time availability, and book appointments through our intuitive booking interface.",
      icon: <Search className="w-6 h-6" />,
      color: "aqua-mist",
      features: ["Provider Search", "Price Comparison", "Instant Booking"],
      stats: "200+ providers",
    },
    {
      number: "3",
      title: "Service Appointment & Tracking",
      description:
        "Real-time service tracking, direct communication with providers, progress updates, and quality monitoring through integrated service management dashboard.",
      icon: <Activity className="w-6 h-6" />,
      color: "aqua-mist",
      features: ["Live Tracking", "Direct Chat", "Quality Control"],
      stats: "Real-time updates",
    },
    {
      number: "4",
      title: "Payment & Documentation",
      description:
        "Secure payment processing, digital receipt generation, automatic vehicle history updates, and comprehensive service record maintenance with blockchain verification.",
      icon: <CreditCard className="w-6 h-6" />,
      color: "aqua-mist",
      features: ["Secure Payment", "Digital Receipts", "History Updates"],
      stats: "Instant processing",
    },
    {
      number: "5",
      title: "Feedback & Continuous Improvement",
      description:
        "Rate service experience, provide detailed feedback, receive personalized maintenance recommendations, and benefit from AI-driven service optimization.",
      icon: <ThumbsUp className="w-6 h-6" />,
      color: "aqua-mist",
      features: ["Rating System", "AI Recommendations", "Service History"],
      stats: "4.9/5 satisfaction",
    },
  ];

  // Pricing plans
  const pricingPlans = [
    {
      name: "Basic",
      price: "Free",
      period: "forever",
      description: "Perfect for individual vehicle owners getting started",
      features: [
        "Vehicle registration",
        "Basic service booking",
        "Limited history access",
        "Standard support",
        "Basic marketplace access",
      ],
      buttonText: "Get Started",
      popular: false,
      icon: <Car className="w-6 h-6" />,
      color: "navy-blue",
    },
    {
      name: "Premium",
      price: "₹1,999",
      period: "per month",
      description: "Complete vehicle passport with premium features",
      features: [
        "Full vehicle passport access",
        "Complete bidding capabilities",
        "Comprehensive vehicle history",
        "Priority service booking",
        "Advanced analytics dashboard",
        "Insurance integration",
        "24/7 premium support",
        "Maintenance predictions",
      ],
      buttonText: "Go Premium",
      popular: true,
      icon: <Crown className="w-6 h-6" />,
      color: "navy-blue",
    },
    {
      name: "Enterprise",
      price: "₹9,999",
      period: "per month",
      description: "For fleet owners and automotive businesses",
      features: [
        "Everything in Premium",
        "Multi-vehicle management",
        "Fleet analytics & reporting",
        "Custom API integrations",
        "Dedicated account manager",
        "White-label solutions",
        "Custom workflow automation",
        "Enterprise-grade security",
      ],
      buttonText: "Contact Sales",
      popular: false,
      icon: <Building className="w-6 h-6" />,
      color: "navy-blue",
    },
  ];

  const stats = [
    {
      number: "500+",
      label: "Registered Vehicles",
      subtext: "Complete digital profiles",
    },
    {
      number: "200+",
      label: "Verified Service Providers",
      subtext: "Across Sri Lanka",
    },
    {
      number: "100+",
      label: "Services Completed",
      subtext: "With full transparency",
    },
    {
      number: "2.5B+",
      label: "Transaction Value",
      subtext: "Facilitated securely",
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
        "https://images.unsplash.com/photo-1614285919630-33bd6954d2c4?w=400&h=400&fit=crop&crop=face",
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
            <div className="logo">
              <div className="logo-icon">
                <img
                  src="/logo.png"
                  alt="AutoConnect Logo"
                  className="w-8 h-8"
                />
              </div>
              <span
                className="logo-text font-display font-bold"
                style={{ fontSize: "2rem" }}
              >
                Auto<span className="logo-accent">Connect</span>
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="nav-desktop">
              {[
                "Home",
                "Platform",
                "Services",
                "Pricing",
                "Success Stories",
                "Contact",
              ].map((item, index) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(" ", "-")}`}
                  className="nav-link font-primary font-medium"
                >
                  {item}
                </a>
              ))}
            </nav>

            {/* CTA Button */}
            <button className="cta-button-header button-text font-semibold">
              Join Platform
            </button>

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
                "Pricing",
                "Success Stories",
                "Contact",
              ].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(" ", "-")}`}
                  className="mobile-menu-link body-regular font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <button className="mobile-cta-button button-text font-semibold">
                Join Platform
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main>
        {/* Hero Section - Now imported as a separate component */}
        <HeroSection />

        {/* Platform Technical Capabilities Section - WHAT WE BUILT */}
        <section
          id="platform"
          className={`platform-section animate-on-scroll ${
            featuresVisible ? "animate-fade-up" : ""
          }`}
          ref={featuresRef}
        >
          <div className="section-container">
            {/* Section Header */}
            <div className="section-header">
              <div className="platform-badge">
                <Server className="w-4 h-4" />
                <span className="caption uppercase tracking-wide font-semibold">
                  Technical Infrastructure
                </span>
              </div>
              <h2 className="section-title display-2 text-center font-display">
                <span className="text-primary">Platform </span>
                <span className="title-gradient text-gradient">
                  Capabilities
                </span>
              </h2>
              <p className="section-description body-large text-secondary text-center leading-relaxed">
                Built on enterprise-grade technology infrastructure with
                advanced security, AI-powered analytics, and scalable cloud
                architecture designed for mission-critical automotive
                operations.
              </p>
            </div>

            {/* Platform Features Grid */}
            <div
              className={`platform-features-grid stagger-children ${
                featuresGridVisible ? "animate" : ""
              }`}
              ref={featuresGridRef}
            >
              {platformFeatures.map((feature, index) => (
                <div key={index} className="platform-feature-card hover-lift">
                  {/* Technical Badge */}
                  <div className="tech-badge">
                    <Zap className="w-3 h-3" />
                    <span className="caption uppercase tracking-wide font-semibold">
                      Enterprise
                    </span>
                  </div>

                  {/* Enhanced Icon */}
                  <div className="platform-feature-icon">
                    <div
                      className={`platform-icon-wrapper platform-icon-${feature.color}`}
                    >
                      {feature.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="platform-feature-content">
                    <div className="label text-accent font-semibold mb-2">
                      {feature.highlight}
                    </div>
                    <h3 className="platform-feature-title heading-3 text-primary font-secondary">
                      {feature.title}
                    </h3>
                    <p className="platform-feature-description body-regular text-secondary leading-relaxed">
                      {feature.description}
                    </p>

                    {/* Technical Benefits */}
                    <div className="tech-benefits">
                      {feature.benefits.map((benefit, idx) => (
                        <span
                          key={idx}
                          className="tech-benefit-tag body-small font-medium"
                        >
                          <CheckCircle className="w-3 h-3" />
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Platform Stats */}
            <div className="platform-stats">
              <div className="platform-stat-item">
                <Cloud className="w-5 h-5 platform-stat-icon" />
                <span className="button-text-small font-semibold">
                  99.9% Uptime SLA
                </span>
              </div>
              <div className="platform-stat-item">
                <Lock className="w-5 h-5 platform-stat-icon" />
                <span className="button-text-small font-semibold">
                  256-bit Encryption
                </span>
              </div>
              <div className="platform-stat-item">
                <Brain className="w-5 h-5 platform-stat-icon" />
                <span className="button-text-small font-semibold">
                  AI-Powered Analytics
                </span>
              </div>
              <div className="platform-stat-item">
                <Code className="w-5 h-5 platform-stat-icon" />
                <span className="button-text-small font-semibold">
                  RESTful APIs
                </span>
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
              <h2 className="section-title display-3 text-center font-display">
                <span className="text-primary">Platform Impact & </span>
                <span className="title-gradient text-gradient">Growth</span>
              </h2>
              <p className="section-description body-large text-secondary text-center leading-relaxed">
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
                    <div className="stat-number-large display-1 text-primary font-display font-black">
                      {stat.number}
                    </div>
                    <div className="stat-label-large heading-4 text-primary font-secondary font-semibold">
                      {stat.label}
                    </div>
                    <div className="stat-subtext body-small text-secondary">
                      {stat.subtext}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services User Workflow Section - HOW USERS EXPERIENCE IT */}
        <section
          id="services"
          className={`services-workflow-section animate-on-scroll ${
            workflowVisible ? "animate-fade-up" : ""
          }`}
          ref={workflowRef}
        >
          <div className="section-container">
            <div className="section-header">
              <div className="services-badge">
                <Users className="w-4 h-4" />
                <span className="caption uppercase tracking-wide font-semibold">
                  User Experience
                </span>
              </div>
              <h2 className="section-title display-2 text-center font-display">
                <span className="text-primary">How it </span>
                <span className="title-gradient text-gradient">Works</span>
              </h2>
              <p className="section-description body-large text-secondary text-center leading-relaxed">
                Step-by-step user journey from registration to service
                completion. Experience our intuitive workflow designed for
                vehicle owners, service providers, and all automotive
                stakeholders.
              </p>
            </div>

            <div
              className={`user-workflow-timeline stagger-children ${
                workflowStepsVisible ? "animate" : ""
              }`}
              ref={workflowStepsRef}
            >
              {userWorkflowSteps.map((step, index) => (
                <div key={index} className="workflow-timeline-item">
                  <div className="timeline-connector">
                    <div className={`timeline-dot timeline-dot-${step.color}`}>
                      <span className="timeline-number font-bold">
                        {step.number}
                      </span>
                    </div>
                    {index < userWorkflowSteps.length - 1 && (
                      <div className="timeline-line"></div>
                    )}
                  </div>

                  <div
                    className={`workflow-content-card workflow-card-${step.color} hover-lift`}
                  >
                    <div className="workflow-card-header">
                      <div
                        className={`workflow-icon workflow-icon-${step.color}`}
                      >
                        {step.icon}
                      </div>
                      <div className="workflow-stats">
                        <Clock className="w-4 h-4" />
                        <span className="body-small font-medium">
                          {step.stats}
                        </span>
                      </div>
                    </div>

                    <div className="workflow-card-body">
                      <h3 className="workflow-step-title heading-3 text-primary font-secondary font-semibold">
                        {step.title}
                      </h3>
                      <p className="workflow-step-description body-regular text-secondary leading-relaxed">
                        {step.description}
                      </p>

                      <div className="workflow-features">
                        {step.features.map((feature, idx) => (
                          <div key={idx} className="workflow-feature">
                            <CheckCircle className="w-4 h-4 workflow-check" />
                            <span className="body-small font-medium">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* User Experience Stats */}
            <div className="user-experience-stats">
              <div className="ux-stat-item">
                <div className="stat-icon ux-stat-icon-mint">
                  <UserPlus className="w-6 h-6" />
                </div>
                <div className="stat-info">
                  <div className="stat-number text-2xl font-bold text-primary">
                    2 min
                  </div>
                  <div className="stat-label body-small text-secondary">
                    Average Signup
                  </div>
                </div>
              </div>
              <div className="ux-stat-item">
                <div className="stat-icon ux-stat-icon-aqua">
                  <Calendar className="w-6 h-6" />
                </div>
                <div className="stat-info">
                  <div className="stat-number text-2xl font-bold text-primary">
                    95%
                  </div>
                  <div className="stat-label body-small text-secondary">
                    Booking Success
                  </div>
                </div>
              </div>
              <div className="ux-stat-item">
                <div className="stat-icon ux-stat-icon-sky">
                  <ThumbsUp className="w-6 h-6" />
                </div>
                <div className="stat-info">
                  <div className="stat-number text-2xl font-bold text-primary">
                    4.9/5
                  </div>
                  <div className="stat-label body-small text-secondary">
                    User Satisfaction
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section
          id="pricing"
          className={`pricing-section animate-on-scroll ${
            pricingVisible ? "animate-fade-up" : ""
          }`}
          ref={pricingRef}
        >
          <div className="section-container">
            <div className="section-header">
              <div className="pricing-badge">
                <Crown className="w-4 h-4" />
                <span className="caption uppercase tracking-wide font-semibold">
                  Pricing Plans
                </span>
              </div>
              <h2 className="section-title display-2 text-center font-display">
                <span className="text-primary">Choose Your </span>
                <span className="title-gradient text-gradient">Plan</span>
              </h2>
              <p className="section-description body-large text-secondary text-center leading-relaxed">
                Unlock premium features including complete vehicle passport
                access, advanced bidding capabilities, and comprehensive vehicle
                history for enhanced marketplace experience.
              </p>
            </div>

            <div
              className={`pricing-grid stagger-children ${
                pricingGridVisible ? "animate" : ""
              }`}
              ref={pricingGridRef}
            >
              {pricingPlans.map((plan, index) => (
                <div
                  key={index}
                  className={`pricing-card pricing-card-${plan.color} ${
                    plan.popular ? "pricing-card-popular" : ""
                  } hover-lift`}
                >
                  {plan.popular && (
                    <div
                      className="popular-badge"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.8rem",
                      }}
                    ></div>
                  )}

                  <div className="pricing-card-header">
                    <div className={`pricing-icon pricing-icon-${plan.color}`}>
                      {plan.icon}
                    </div>
                    <h3 className="pricing-plan-name heading-2 text-primary font-secondary font-bold">
                      {plan.name}
                    </h3>
                    <div className="pricing-amount">
                      <span className="price text-4xl font-bold text-primary">
                        {plan.price}
                      </span>
                      <span className="period body-regular text-secondary">
                        /{plan.period}
                      </span>
                    </div>
                    <p className="pricing-description body-regular text-secondary leading-relaxed">
                      {plan.description}
                    </p>
                  </div>

                  <div className="pricing-features">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="pricing-feature">
                        <Check className="w-4 h-4 pricing-check" />
                        <span className="body-regular text-primary">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  <button
                    className={`pricing-button pricing-button-${plan.color} ${
                      plan.popular ? "pricing-button-popular" : ""
                    } button-text font-semibold`}
                  >
                    {plan.buttonText}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="pricing-note">
              <Shield className="w-5 h-5" />
              <span className="body-small text-secondary font-medium">
                All plans include SSL security, 24/7 monitoring, and data backup
              </span>
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
              <h2 className="section-title display-2 text-center font-display">
                <span className="text-primary">Success </span>
                <span className="title-gradient text-gradient">Stories</span>
              </h2>
              <p className="section-description body-large text-secondary text-center leading-relaxed">
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
                      <h4 className="testimonial-name heading-4 text-primary font-secondary font-semibold">
                        {testimonial.name}
                      </h4>
                      <p className="testimonial-role body-small text-accent font-medium">
                        {testimonial.role}
                      </p>
                      <p className="testimonial-company body-small text-secondary">
                        {testimonial.company}
                      </p>
                      <p className="testimonial-location caption text-tertiary">
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
                    <p className="quote-text body-regular text-primary leading-relaxed italic">
                      {testimonial.comment}
                    </p>
                  </blockquote>

                  {/* Additional Elements */}
                  <div className="testimonial-footer">
                    <div className="testimonial-metrics">
                      <span className="metric caption text-secondary">
                        Verified Review
                      </span>
                      <span className="metric-separator">•</span>
                      <span className="metric caption text-secondary">
                        Platform User Since 2023
                      </span>
                    </div>
                  </div>

                  <div className="testimonial-glow"></div>
                </div>
              ))}
            </div>

            {/* Additional Social Proof */}
            <div className="testimonials-stats">
              <div className="testimonial-stat">
                <div className="stat-number text-3xl font-bold text-primary">
                  98%
                </div>
                <div className="stat-label body-small text-secondary">
                  Customer Satisfaction
                </div>
              </div>
              <div className="testimonial-stat">
                <div className="stat-number text-3xl font-bold text-primary">
                  2,500+
                </div>
                <div className="stat-label body-small text-secondary">
                  Happy Customers
                </div>
              </div>
              <div className="testimonial-stat">
                <div className="stat-number text-3xl font-bold text-primary">
                  4.9/5
                </div>
                <div className="stat-label body-small text-secondary">
                  Average Rating
                </div>
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
                <h2 className="cta-title display-3 text-center text-primary font-display font-bold">
                  Ready to Transform Your Vehicle Management?
                </h2>
                <p
                  className="cta-description body-large text-center leading-relaxed"
                  style={{ color: "#263238" }} // darker than #546e7a
                >
                  Join thousands of satisfied users across Sri Lanka and
                  experience the future of comprehensive vehicle lifecycle
                  management. Start your digital transformation today.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="cta-buttons">
                <button className="cta-primary-button button-text font-bold">
                  <span>Join the Platform</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="cta-secondary-button button-text font-semibold">
                  <span>Schedule Demo</span>
                </button>
              </div>

              {/* Features List */}
              <div className="cta-features">
                {ctaFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className="cta-feature body-regular text-primary font-medium"
                  >
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <footer
          id="contact"
          style={{
            background: "#1a1a1a", // --charcoal
            color: "#e8f4f8", // --aqua-light for readable contrast
            fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
            fontSize: "1.08rem",
            margin: 0,
            padding: 0,
            width: "100%",
            borderTopLeftRadius: "0",
            borderTopRightRadius: "0",
            boxShadow: "0 -2px 8px 0 rgba(26,26,26,0.14)",
          }}
        >
          <div
            style={{
              maxWidth: "1240px",
              margin: "0 auto",
              padding: "2.5rem 1.5rem 0 1.5rem",
              display: "grid",
              gridTemplateColumns:
                "minmax(210px, 1.7fr) minmax(180px, 1.15fr) minmax(195px, 1fr)",
              gap: "2rem",
              alignItems: "start",
            }}
          >
            {/* Brand Section */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}
              >
                <span
                  style={{
                    width: "2.2rem",
                    height: "2.2rem",
                    borderRadius: "9px",
                    background:
                      "linear-gradient(135deg,#7ab2d3 60%,#4a628a 100%)", // --sky-blue to --navy-blue
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 1px 6px rgba(74,98,138,0.13)",
                  }}
                >
                  <img
                    src="/logo.png"
                    alt="AutoConnect Logo"
                    style={{ width: "1.15rem", height: "1.15rem" }}
                  />
                </span>
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: "1.4rem",
                    color: "#dff2eb", // --soft-mint for a fresh look
                    letterSpacing: "-0.5px",
                  }}
                >
                  Auto
                  <span style={{ color: "#7ab2d3", fontWeight: 800 }}>
                    Connect
                  </span>
                </span>
              </div>
              <p
                style={{
                  fontSize: "1rem",
                  opacity: 0.8,
                  lineHeight: 1.65,
                  maxWidth: "305px",
                  color: "#b9e5e8", // --aqua-mist
                  margin: 0,
                }}
              >
                Sri Lanka’s most comprehensive vehicle lifecycle platform. We
                connect vehicle owners, service providers, and insurers with
                secure, smart workflow automation and transparency.
              </p>
              <div style={{ display: "flex", gap: ".74rem", marginTop: "5px" }}>
                {[Facebook, Twitter, Instagram, Linkedin].map((Icon, idx) => (
                  <a
                    href="#"
                    aria-label={Icon.name}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "2.05rem",
                      height: "2.05rem",
                      background: "#b9e5e8", // --aqua-mist
                      borderRadius: "7px",
                      color: "#4a628a", // --navy-blue
                      fontSize: "1.13rem",
                      transition: "background .22s,color .22s",
                    }}
                    key={idx}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = "#7ab2d3";
                      e.currentTarget.style.color = "#1a1a1a";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = "#b9e5e8";
                      e.currentTarget.style.color = "#4a628a";
                    }}
                  >
                    <Icon style={{ width: "1.11em", height: "1.11em" }} />
                  </a>
                ))}
              </div>
            </div>
            {/* Services Section */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.88rem",
              }}
            >
              <h4
                style={{
                  fontWeight: 600,
                  fontSize: "1.09rem",
                  color: "#7ab2d3", // --sky-blue
                  margin: 0,
                }}
              >
                Platform Services
              </h4>
              <ul
                style={{
                  listStyle: "none",
                  margin: 0,
                  padding: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: ".51rem",
                }}
              >
                {[
                  "Vehicle Registry",
                  "Trading Marketplace",
                  "Service Booking",
                  "Insurance Integration",
                  "Analytics Dashboard",
                ].map((item, idx) => (
                  <li key={idx}>
                    <a
                      href="#"
                      style={{
                        fontSize: "1rem",
                        color: "#e1f0f8", // --sky-light
                        textDecoration: "none",
                        opacity: 0.88,
                        fontWeight: 400,
                        transition: "color .14s",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.color = "#7ab2d3")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.color = "#e1f0f8")
                      }
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            {/* Contact Section */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.7rem",
              }}
            >
              <h4
                style={{
                  fontWeight: 600,
                  fontSize: "1.09rem",
                  color: "#7ab2d3", // --sky-blue
                  margin: 0,
                }}
              >
                Contact Us
              </h4>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: ".55rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: ".68rem",
                    color: "#b9e5e8",
                    fontSize: "1em",
                  }}
                >
                  <Mail
                    style={{
                      color: "#4a628a",
                      width: "1.11em",
                      height: "1.11em",
                    }}
                  />
                  <span>platform@autoconnect.lk</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: ".68rem",
                    color: "#b9e5e8",
                    fontSize: "1em",
                  }}
                >
                  <Phone
                    style={{
                      color: "#4a628a",
                      width: "1.11em",
                      height: "1.11em",
                    }}
                  />
                  <span>+94 11 234 5678</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: ".68rem",
                    color: "#b9e5e8",
                    fontSize: "1em",
                  }}
                >
                  <MapPin
                    style={{
                      color: "#4a628a",
                      width: "1.11em",
                      height: "1.11em",
                    }}
                  />
                  <span>Colombo 03, Sri Lanka</span>
                </div>
              </div>
            </div>
          </div>
          {/* Bottom Notice */}
          <div
            style={{
              textAlign: "center",
              paddingTop: "1.5rem",
              paddingBottom: "1.1rem",
              marginTop: "2.1rem",
              fontSize: "1.01rem",
              opacity: 0.71,
              color: "#aab9cb", // blend of --navy-light and --sky-blue
              borderTop: "1px solid #4a4a4a",
              letterSpacing: "0.01em",
            }}
          >
            © 2025{" "}
            <strong style={{ color: "#7ab2d3", fontWeight: 600 }}>
              AutoConnect
            </strong>
            . All rights reserved. Empowering Sri Lanka’s automotive ecosystem
            through trusted digital innovation.
          </div>
        </footer>
      </main>
    </div>
  );
};

export default LandingPage;
