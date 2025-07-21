import "./Header.css";

function Header({ route }) {
  return (
    <header
      className="main-header"
      style={{ position: "relative", backgroundColor: "#7AB2D3" }}
    >
      {/* Original route icon and title — DO NOT MODIFY */}
      <span className="horizontal-container">
        <span
          className="header-icon material-symbols-outlined-fill"
          style={{ color: "white" }}
        >
          {route?.icon}
        </span>
        <span className="header-title" style={{ color: "white" }}>
          {route?.title}
        </span>
      </span>

      {/* New: Centered AutoConnect branding/title */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontFamily: "'Poppins', 'Inter', sans-serif",
          fontSize: "32px",
          fontWeight: "700",
          color: "white",
          textAlign: "center",
          letterSpacing: "0.5px",
          pointerEvents: "none", // allows interaction with other elements
        }}
      >
        AutoConnect
      </div>
    </header>
  );
}

export default Header;
