// auto-connect-frontend/src/components/HowItWorks.jsx
import React from "react";
import { motion } from "framer-motion";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Register Your Account",
      description:
        "Sign up and choose your role - Vehicle Owner, Service Provider, or Insurance Company.",
      icon: "👤",
    },
    {
      number: "02",
      title: "Add Your Vehicles",
      description:
        "Register your vehicles with complete documentation and verification.",
      icon: "🚗",
    },
    {
      number: "03",
      title: "Connect & Book Services",
      description:
        "Find trusted service providers and book appointments with ease.",
      icon: "🔧",
    },
    {
      number: "04",
      title: "Manage & Track",
      description:
        "Monitor your vehicle's lifecycle, maintenance, and insurance all in one place.",
      icon: "📊",
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
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section
      id="how-it-works"
      style={{
        padding: "5rem 1rem",
        background: "linear-gradient(135deg, #4A628A 0%, #7AB2D3 100%)",
        color: "white",
      }}
    >
      <div
        style={{
          maxWidth: "80rem",
          margin: "0 auto",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          style={{
            textAlign: "center",
            marginBottom: "4rem",
          }}
        >
          <h2
            style={{
              fontSize: "2.5rem",
              fontWeight: "bold",
              marginBottom: "1rem",
            }}
          >
            How AutoConnect Works
          </h2>
          <p
            style={{
              fontSize: "1.25rem",
              opacity: 0.9,
              maxWidth: "42rem",
              margin: "0 auto",
            }}
          >
            Get started with AutoConnect in just four simple steps and transform
            your vehicle management experience.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{
            display: "grid",
            gap: "2rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(18rem, 1fr))",
          }}
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{
                scale: 1.05,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              }}
              style={{
                position: "relative",
                padding: "2rem",
                borderRadius: "1rem",
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                transition: "all 0.3s ease",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-1rem",
                  left: "1.5rem",
                  width: "3rem",
                  height: "3rem",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #DFF2EB, #B9E5E8)",
                  color: "#4A628A",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  fontSize: "1.125rem",
                }}
              >
                {step.number}
              </div>

              <div
                style={{
                  fontSize: "2.5rem",
                  marginBottom: "1rem",
                  marginTop: "1rem",
                  textAlign: "center",
                }}
              >
                {step.icon}
              </div>

              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  marginBottom: "0.75rem",
                  textAlign: "center",
                }}
              >
                {step.title}
              </h3>

              <p
                style={{
                  opacity: 0.9,
                  lineHeight: "1.75",
                  textAlign: "center",
                }}
              >
                {step.description}
              </p>

              {/* Connection line for larger screens */}
              {index < steps.length - 1 && (
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    right: "-1rem",
                    width: "2rem",
                    height: "2px",
                    background: "rgba(255, 255, 255, 0.3)",
                    display: window.innerWidth > 768 ? "block" : "none",
                  }}
                />
              )}
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          style={{
            textAlign: "center",
            marginTop: "3rem",
          }}
        >
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 15px 35px rgba(0, 0, 0, 0.2)",
            }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: "1rem 2rem",
              borderRadius: "0.5rem",
              background: "white",
              color: "#4A628A",
              border: "none",
              fontWeight: "600",
              fontSize: "1.125rem",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onClick={() => (window.location.href = "/auth/register")}
          >
            Start Your Journey Today
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
