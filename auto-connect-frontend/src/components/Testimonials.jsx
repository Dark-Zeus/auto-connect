// auto-connect-frontend/src/components/Testimonials.jsx
import React from "react";
import { motion } from "framer-motion";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Priya Jayawardena",
      role: "Vehicle Owner",
      location: "Colombo",
      image: "PJ",
      content:
        "AutoConnect has completely transformed how I manage my family vehicles. The service booking feature is incredibly convenient, and I love getting reminders for maintenance.",
      rating: 5,
    },
    {
      name: "Kasun Perera",
      role: "Service Provider",
      location: "Kandy",
      image: "KP",
      content:
        "As a garage owner, AutoConnect has helped me reach more customers and manage appointments efficiently. The platform is user-friendly and reliable.",
      rating: 5,
    },
    {
      name: "Nirmal Fernando",
      role: "Fleet Manager",
      location: "Galle",
      image: "NF",
      content:
        "Managing our company fleet of 50+ vehicles was a nightmare before AutoConnect. Now everything is organized, tracked, and automated. Highly recommended!",
      rating: 5,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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

  const StarRating = ({ rating }) => {
    return (
      <div style={{ display: "flex", gap: "0.25rem", marginBottom: "1rem" }}>
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            style={{
              color: i < rating ? "#fbbf24" : "#e5e7eb",
              fontSize: "1.25rem",
            }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <section
      style={{
        padding: "5rem 1rem",
        backgroundColor: "#DFF2EB", // Your lightest color
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            textAlign: "center",
            marginBottom: "4rem",
          }}
        >
          <h2
            style={{
              fontSize: "2.5rem",
              fontWeight: "bold",
              color: "#4A628A", // Your darkest color
              marginBottom: "1rem",
              lineHeight: "1.2",
            }}
          >
            What Our Users Say
          </h2>
          <p
            style={{
              fontSize: "1.125rem",
              color: "#4A628A", // Your darkest color
              maxWidth: "600px",
              margin: "0 auto",
              lineHeight: "1.6",
            }}
          >
            Discover how AutoConnect is transforming vehicle management across
            Sri Lanka through the experiences of our valued users.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
            gap: "2rem",
            marginBottom: "3rem",
          }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{
                y: -5,
                transition: { duration: 0.2 },
              }}
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "1rem",
                padding: "2rem",
                boxShadow:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                border: "1px solid #e5e7eb",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Background Gradient */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "4px",
                  background:
                    "linear-gradient(90deg, #7AB2D3, #B9E5E8, #DFF2EB)", // Your color scheme
                }}
              />

              {/* Rating */}
              <StarRating rating={testimonial.rating} />

              {/* Content */}
              <blockquote
                style={{
                  fontSize: "1.125rem",
                  lineHeight: "1.7",
                  color: "#4A628A", // Your darkest color
                  marginBottom: "1.5rem",
                  fontStyle: "italic",
                  position: "relative",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: "-0.5rem",
                    left: "-0.5rem",
                    fontSize: "3rem",
                    color: "#B9E5E8", // Your light blue-green
                    fontFamily: "serif",
                    lineHeight: 1,
                  }}
                >
                  "
                </span>
                {testimonial.content}
              </blockquote>

              {/* User Info */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                {/* Avatar */}
                <div
                  style={{
                    width: "3rem",
                    height: "3rem",
                    borderRadius: "50%",
                    backgroundColor: "#7AB2D3", // Your medium blue
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    fontSize: "1.125rem",
                    fontWeight: "600",
                    flexShrink: 0,
                  }}
                >
                  {testimonial.image}
                </div>

                {/* User Details */}
                <div>
                  <h4
                    style={{
                      fontSize: "1.125rem",
                      fontWeight: "600",
                      color: "#4A628A", // Your darkest color
                      marginBottom: "0.25rem",
                    }}
                  >
                    {testimonial.name}
                  </h4>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "#7AB2D3", // Your medium blue
                      margin: 0,
                    }}
                  >
                    {testimonial.role} • {testimonial.location}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          style={{
            textAlign: "center",
            background: "linear-gradient(135deg, #7AB2D3 0%, #4A628A 100%)", // Your colors
            borderRadius: "1rem",
            padding: "3rem 2rem",
            color: "#ffffff",
          }}
        >
          <h3
            style={{
              fontSize: "1.875rem",
              fontWeight: "bold",
              marginBottom: "1rem",
              color: "#ffffff",
            }}
          >
            Join Thousands of Satisfied Users
          </h3>
          <p
            style={{
              fontSize: "1.125rem",
              marginBottom: "2rem",
              opacity: 0.9,
              maxWidth: "500px",
              margin: "0 auto 2rem auto",
            }}
          >
            Experience the future of vehicle management with AutoConnect. Start
            your journey today and see why users across Sri Lanka trust us.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              backgroundColor: "#ffffff",
              color: "#7AB2D3", // Your medium blue
              padding: "0.875rem 2rem",
              borderRadius: "0.5rem",
              border: "none",
              fontSize: "1.125rem",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 4px 6px -1px rgba(74, 98, 138, 0.1)",
              transition: "all 0.2s",
            }}
            onClick={() => {
              // Add navigation logic here
              console.log("Get Started clicked");
            }}
          >
            Get Started Today
          </motion.button>
        </motion.div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "2rem",
            marginTop: "4rem",
            textAlign: "center",
          }}
        >
          {[
            { number: "10,000+", label: "Active Users" },
            { number: "500+", label: "Service Providers" },
            { number: "50,000+", label: "Vehicles Managed" },
            { number: "99.9%", label: "Uptime" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              style={{
                padding: "1.5rem",
                backgroundColor: "#ffffff",
                borderRadius: "0.75rem",
                boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                border: "1px solid #e5e7eb",
              }}
            >
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: "bold",
                  color: "#7AB2D3", // Your medium blue
                  marginBottom: "0.5rem",
                }}
              >
                {stat.number}
              </div>
              <div
                style={{
                  fontSize: "0.875rem",
                  color: "#4A628A", // Your darkest color
                  fontWeight: "500",
                }}
              >
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
