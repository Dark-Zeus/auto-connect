import { Link, useLocation, matchPath } from "react-router-dom";
import "./NavBar.css";

// ADD THESE IMPORTS
import { useNavigate } from "react-router-dom"; // Add useNavigate
import { useContext } from "react"; // Add useContext
import { UserContext } from "../contexts/UserContext"; // Add UserContext
import { performLogout } from "../utils/logout.util"; // Add logout utility

function NavBar({ navLinks, version, icon, userId }) {
  const location = useLocation();
  const path = location.pathname;
  const navigate = useNavigate(); // ADD THIS
  const { setUserContext } = useContext(UserContext);

  // ADD THIS LOGOUT HANDLER
  const handleLogout = async (e) => {
    e.preventDefault(); // Prevent default link behavior
    await performLogout(setUserContext, navigate);
  };

  const isActive = (routePaths) =>
    Array.isArray(routePaths)
      ? routePaths.some((p) => matchPath({ path: p, end: true }, path))
      : false;

  const isNavLinkActive = (link) => {
    console.log("Checking if link is active:", link);
    if (link.path && isActive(link.path)) {
      return true;
    }

    if (link.sub) {
      if (isActive(link.sub.path)) {
        return true;
      }

      if (link.subNav) {
        return true;
      }
    }

    if (link.subNav) {
      return link.subNav.some((subLink) => isActive(subLink.path));
    }

    return false;
  };

  if (!version) {
    version = "0.0.0v";
  }

  if (!icon) {
    icon = "";
  }

  const navLinkElements = navLinks.map((link, index) => {
    const ContainerType = link.sub ? "span" : Link;

    return (
      <li
        key={index}
        className={`dashboard-nav-link ${
          isNavLinkActive(link) ? "selected" : ""
        }`}
        title={link.title}
      >
        <label htmlFor={index} className="link-label">
          <span className="dashboard-nav-link__main">
            <ContainerType
              to={link.path ? link.path[0] : ""}
              className={`dashboard-nav-link__details dashboard-nav-link ${
                isNavLinkActive(link) ? "selected" : ""
              }`}
            >
              <span className="dashboard-nav-link__icon material-symbols-outlined-fill">
                {" "}
                {link.icon}
              </span>
              <span className="dashboard-nav-link__text">{link.title}</span>
              {link.sub && (
                <input type="checkbox" id={index} name="dashboard-nav-link" />
              )}
            </ContainerType>
          </span>

          <ul className="dashboard-nav-links__sub">
            {link.sub?.map((subLink, subIndex) => (
              <li
                key={`index-sub-li-${index}-${subIndex}`}
                className={`dashboard-nav-link ${
                  isNavLinkActive(subLink) ? "selected" : ""
                }`}
                title={subLink.title}
              >
                <Link
                  className="link"
                  to={subLink.path[0]}
                  key={`index-sub_${subIndex}`}
                >
                  <span className="dashboard-nav-link__icon material-symbols-outlined-fill">
                    {" "}
                    {subLink.icon}
                  </span>
                  <span className="dashboard-nav-link__text">
                    {subLink.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </label>
      </li>
    );
  });

  return (
    <div className="dashboard-nav">
      <div className="dashboard-nav-container">
        <div className="dashboard-nav__logo-container">
          <div className="dashboard-nav__logo">{icon}</div>
        </div>
        <div className="dashboard-nav__name">
          <div className="dashboard-nav__name-details">Auto Connect</div>
          <div className="dashboard-nav__name-version">{version}</div>
        </div>
      </div>
      <div className="dashboard-nav__wrapper">
        <ul className="dashboard-nav-links">{navLinkElements}</ul>
      </div>
      <div className="dashboard-nav-container">
        <div className="dashboard-nav__profile-image-container">
          <div className="dashboard-nav__profile-image"></div>
        </div>
        <div className="dashboard-nav__notification" title="Notifications">
          Notifications
        </div>
        <div className="dashboard-nav__profile">
          <div className="dashboard-nav__profile-details">John Doe</div>
          <Link to="/auth/logout">
            <div
              className="dashboard-nav__logout material-symbols-outlined-fill"
              onClick={handleLogout}
              style={{ cursor: "pointer" }}
              title="Logout"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleLogout(e);
                }
              }}
            >
              logout
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
