// auto-connect-frontend/src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const footerLinks = {
    product: [
      { name: "Features", href: "#features" },
      { name: "How It Works", href: "#how-it-works" },
      { name: "Pricing", href: "/pricing" },
      { name: "API", href: "/api" },
    ],
    company: [
      { name: "About Us", href: "/about" },
      { name: "Careers", href: "/careers" },
      { name: "Blog", href: "/blog" },
      { name: "Contact", href: "/contact" },
    ],
    support: [
      { name: "Help Center", href: "/help" },
      { name: "Documentation", href: "/docs" },
      { name: "Community", href: "/community" },
      { name: "Status", href: "/status" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
      { name: "Data Protection", href: "/data-protection" },
    ],
  };

  const socialLinks = [
    { name: "Facebook", href: "#", icon: "📘" },
    { name: "Twitter", href: "#", icon: "🐦" },
    { name: "LinkedIn", href: "#", icon: "💼" },
    { name: "Instagram", href: "#", icon: "📷" },
  ];

  return (
    <footer
      style={{
        background: "linear-gradient(135deg, #4A628A 0%, #7AB2D3 100%)",
        color: "white",
        padding: "3rem 1rem 1rem",
      }}
    >
      <div
        style={{
          maxWidth: "80rem",
          margin: "0 auto",
        }}
      >
        {/* Main Footer Content */}
        <div
          style={{
            display: "grid",
            gap: "2rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(15rem, 1fr))",
            marginBottom: "2rem",
          }}
        >
          {/* Brand Section */}
          <div style={{ gridColumn: "span 2" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{
                  width: "2.5rem",
                  height: "2.5rem",
                  borderRadius: "0.5rem",
                  background: "rgba(255, 255, 255, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{ width: "1.5rem", height: "1.5rem", color: "white" }}
                >
                  <path
                    d="M3 18V16C3 14.8954 3.89543 14 5 14H19C20.1046 14 21 14.8954 21 16V18M3 18V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V18M3 18H21M12 2L8 6H16L12 2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="7" cy="18" r="1" fill="currentColor" />
                  <circle cx="17" cy="18" r="1" fill="currentColor" />
                </svg>
              </div>
              <span
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                }}
              >
                AutoConnect
              </span>
            </div>
            <p
              style={{
                opacity: 0.9,
                lineHeight: "1.75",
                maxWidth: "28rem",
                marginBottom: "1.5rem",
              }}
            >
              Sri Lanka's premier vehicle lifecycle management platform.
              Connecting vehicle owners, service providers, and insurance
              companies in one comprehensive ecosystem.
            </p>

            {/* Contact Info */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                fontSize: "0.875rem",
                opacity: 0.9,
              }}
            >
              <div>📧 support@autoconnect.lk</div>
              <div>📞 +94 11 234 5678</div>
              <div>📍 No. 123, Galle Road, Colombo 03, Sri Lanka</div>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3
              style={{
                fontSize: "1.125rem",
                fontWeight: "600",
                marginBottom: "1rem",
              }}
            >
              Product
            </h3>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              {footerLinks.product.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    style={{
                      color: "white",
                      textDecoration: "none",
                      opacity: 0.8,
                      fontSize: "0.875rem",
                      transition: "opacity 0.3s ease",
                    }}
                    onMouseEnter={(e) => (e.target.style.opacity = "1")}
                    onMouseLeave={(e) => (e.target.style.opacity = "0.8")}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3
              style={{
                fontSize: "1.125rem",
                fontWeight: "600",
                marginBottom: "1rem",
              }}
            >
              Company
            </h3>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    style={{
                      color: "white",
                      textDecoration: "none",
                      opacity: 0.8,
                      fontSize: "0.875rem",
                      transition: "opacity 0.3s ease",
                    }}
                    onMouseEnter={(e) => (e.target.style.opacity = "1")}
                    onMouseLeave={(e) => (e.target.style.opacity = "0.8")}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3
              style={{
                fontSize: "1.125rem",
                fontWeight: "600",
                marginBottom: "1rem",
              }}
            >
              Support
            </h3>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    style={{
                      color: "white",
                      textDecoration: "none",
                      opacity: 0.8,
                      fontSize: "0.875rem",
                      transition: "opacity 0.3s ease",
                    }}
                    onMouseEnter={(e) => (e.target.style.opacity = "1")}
                    onMouseLeave={(e) => (e.target.style.opacity = "0.8")}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3
              style={{
                fontSize: "1.125rem",
                fontWeight: "600",
                marginBottom: "1rem",
              }}
            >
              Legal
            </h3>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    style={{
                      color: "white",
                      textDecoration: "none",
                      opacity: 0.8,
                      fontSize: "0.875rem",
                      transition: "opacity 0.3s ease",
                    }}
                    onMouseEnter={(e) => (e.target.style.opacity = "1")}
                    onMouseLeave={(e) => (e.target.style.opacity = "0.8")}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div
          style={{
            borderTop: "1px solid rgba(255, 255, 255, 0.2)",
            paddingTop: "2rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div
            style={{
              fontSize: "0.875rem",
              opacity: 0.8,
            }}
          >
            © {new Date().getFullYear()} AutoConnect. All rights reserved.
          </div>

          {/* Social Links */}
          <div
            style={{
              display: "flex",
              gap: "1rem",
            }}
          >
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "2.5rem",
                  height: "2.5rem",
                  borderRadius: "50%",
                  background: "rgba(255, 255, 255, 0.1)",
                  color: "white",
                  textDecoration: "none",
                  fontSize: "1.25rem",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(255, 255, 255, 0.2)";
                  e.target.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "rgba(255, 255, 255, 0.1)";
                  e.target.style.transform = "translateY(0)";
                }}
                title={social.name}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
