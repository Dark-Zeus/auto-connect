import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { performLogout } from "../utils/logout.util";

function Logout() {
  const navigate = useNavigate();
  const { setUserContext } = useContext(UserContext);

  useEffect(() => {
    performLogout(setUserContext, navigate);
  }, [setUserContext, navigate]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontSize: "1.1rem",
        color: "#4A628A",
      }}
    >
      Logging out...
    </div>
  );
}

export default Logout;
