import "./Header.css";

function Header({ route }) {
    return (
        <header className="main-header">
            <span className="horizontal-container">
                <span className="header-icon material-symbols-outlined-fill">{route?.icon}</span>
                <span className="header-title">{route?.title}</span>
            </span>
        </header>
    );
}

export default Header;