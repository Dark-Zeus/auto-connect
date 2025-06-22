import { Link, useLocation, matchPath } from "react-router-dom";
import "./SubNavBar.css";

function SubNavBar({ subNavLinks, version, icon, userId }) {
  const location = useLocation();
  const path = location.pathname;

  const isActive = (routePaths) =>
    Array.isArray(routePaths) ? routePaths.some(p => matchPath({ path: p, end: true }, path)) : false;


  if (!version) {
    version = "0.0.0v"
  }

  if (!icon) {
    icon = ""
  }

  const subNavLinkElements = subNavLinks.map((link, index) => {
    const ContainerType = link.sub ? "span" : Link;
    return (
      <li key={index} className={`sub-nav-link ${isActive(link.path) ? "selected" : ""}`} title={link.title}>
        <label htmlFor={index} className="link-label">
          <span className="sub-nav-link__main">
            <Link to={link.path ? link.path[0] : ""} className={`sub-nav-link__details sub-nav-link ${isActive(link.path) ? "selected" : ""}`}>
              <span className="sub-nav-link__icon material-symbols-outlined-fill"> {link.icon}</span>
              <span className="sub-nav-link__text">
                {link.title}
              </span>
            </Link>
          </span>
        </label>
      </li>
    );
  })

  return (
    <div className="sub-nav">
      <div className="sub-nav__wrapper">
        <ul className="sub-nav-links">
          {subNavLinkElements}
        </ul>
      </div>
    </div>
  );
}

export default SubNavBar;
