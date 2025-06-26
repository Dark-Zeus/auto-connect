import { Link, useLocation, matchPath } from "react-router-dom";
import "./NavBar.css";

function NavBar({ navLinks, version, icon, userId }) {
  const location = useLocation();
  const path = location.pathname;

  const isActive = (routePaths) =>
    Array.isArray(routePaths) ? routePaths.some(p => matchPath({ path: p, end: true }, path)) : false;

  const isNavLinkActive = (link) => {
    console.log("Checking if link is active:", link);
    if (link.path && isActive(link.path)) {
      return true;
    }

    if (link.sub) {
      if(isActive(link.sub.path)){
        return true;
      }

      if (link.subNav) {
        return true;
      }
    }

    if (link.subNav) {
      return link.subNav.some(subLink => isActive(subLink.path));
    }

    return false;
  };

  if (!version) {
    version = "0.0.0v"
  }

  if (!icon) {
    icon = ""
  }

  const navLinkElements = navLinks.map((link, index) => {
    const ContainerType = link.sub ? "span" : Link;
    
    return (
      <li key={index} className={`nav-link ${isNavLinkActive(link) ? "selected" : ""}`} title={link.title}>
        <label htmlFor={index} className="link-label">
          <span className="nav-link__main">
            <ContainerType to={link.path ? link.path[0] : ""} className={`nav-link__details nav-link ${isNavLinkActive(link) ? "selected" : ""}`}>
              <span className="nav-link__icon material-symbols-outlined-fill"> {link.icon}</span>
              <span className="nav-link__text">
                {link.title}
              </span>
              {link.sub && <input type="checkbox" id={index} name="nav-link" />}
            </ContainerType>
          </span>

          <ul className="nav-links__sub">
            {link.sub?.map((subLink, subIndex) => (
              <li key={`index-sub-li-${index}-${subIndex}`} className={`nav-link ${isNavLinkActive(subLink) ? "selected" : ""}`} title={subLink.title}>
                <Link className="link" to={subLink.path[0]} key={`index-sub_${subIndex}`}>
                  <span className="nav-link__icon material-symbols-outlined-fill"> {subLink.icon}</span>
                  <span className="nav-link__text">
                    {subLink.title}
                  </span>
                </Link>
              </li>
            ))
            }
          </ul>
        </label>
      </li>
    );
  })

  return (
    <div className="nav">
      <div className="nav-container">
        <div className="nav__logo-container">
          <div className="nav__logo">{icon}</div>
        </div>
        <div className="nav__name">
          <div className="nav__name-details">Auto Connect</div>
          <div className="nav__name-version">{version}</div>
        </div>
      </div>
      <div className="nav__wrapper">
        <ul className="nav-links">
          {navLinkElements}
        </ul>
      </div>
      <div className="nav-container">
        <div className="nav__profile-image-container">
          <div className="nav__profile-image"></div>
        </div>
        <div className="nav__profile">
          <div className="nav__profile-details">John Doe</div>
          <Link to="/auth/logout">
            <div className="nav__logout material-symbols-outlined-fill">
              logout
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NavBar;