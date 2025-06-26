// auto-connect-frontend/src/components/Features.jsx
import React from "react";
import { motion } from "framer-motion";

const Features = () => {
  const features = [
    {
      icon: "🚗",
      title: "Vehicle Registration",
      description:
        "Register and manage your vehicles with comprehensive documentation and tracking.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: "🔧",
      title: "Service Network",
      description:
        "Connect with verified service providers and book appointments instantly.",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: "🛡️",
      title: "Insurance Integration",
      description:
        "Streamlined insurance claims and policy management in one place.",
      color: "from-purple-500 to-indigo-500",
    },
    {
      icon: "📱",
      title: "Digital Marketplace",
      description:
        "Buy, sell, and discover vehicle-related products and services.",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: "📊",
      title: "Analytics Dashboard",
      description:
        "Track vehicle performance, costs, and maintenance schedules.",
      color: "from-pink-500 to-rose-500",
    },
    {
      icon: "🔔",
      title: "Smart Notifications",
      description:
        "Get timely reminders for maintenance, renewals, and important updates.",
      color: "from-yellow-500 to-amber-500",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  return (
    <section
      id="features"
      style={{
        padding: "5rem 1rem",
        background:
          "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(223, 242, 235, 0.5) 100%)",
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
              color: "#4A628A",
              marginBottom: "1rem",
            }}
          >
            Everything You Need for Vehicle Management
          </h2>
          <p
            style={{
              fontSize: "1.25rem",
              color: "#6b7280",
              maxWidth: "42rem",
              margin: "0 auto",
            }}
          >
            Comprehensive tools and services to manage your vehicle's entire
            lifecycle efficiently and securely.
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
            gridTemplateColumns: "repeat(auto-fit, minmax(20rem, 1fr))",
          }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
              }}
              style={{
                background: "white",
                padding: "2rem",
                borderRadius: "1rem",
                border: "1px solid rgba(122, 178, 211, 0.2)",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  fontSize: "3rem",
                  marginBottom: "1rem",
                  textAlign: "center",
                }}
              >
                {feature.icon}
              </div>
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  color: "#4A628A",
                  marginBottom: "0.75rem",
                  textAlign: "center",
                }}
              >
                {feature.title}
              </h3>
              <p
                style={{
                  color: "#6b7280",
                  lineHeight: "1.75",
                  textAlign: "center",
                }}
              >
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
