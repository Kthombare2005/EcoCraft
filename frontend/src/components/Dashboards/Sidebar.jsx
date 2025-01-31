import PropTypes from "prop-types"; // Import PropTypes for validation
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = ({ onToggle }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    onToggle(newState); // Notify parent component
  };

  useEffect(() => {
    if (window.innerWidth <= 768) {
      setIsCollapsed(true); // Default collapsed on small screens
    }
  }, []);

  return (
    <div className={`navigation ${isCollapsed ? "collapsed" : ""}`}>
      <ul>
        <li className="brand">
          {!isCollapsed && (
            <span className="title">
              Eco<span>Craft</span>
            </span>
          )}
        </li>
        <li className={location.pathname === "/dashboard/seller" ? "active" : ""}>
          <Link to="/dashboard/seller">
            <span className="icon">
              <ion-icon name="home-outline"></ion-icon>
            </span>
            {!isCollapsed && <span className="title">Home</span>}
          </Link>
        </li>
        <li className={location.pathname === "/profile" ? "active" : ""}>
          <Link to="/profile">
            <span className="icon">
              <ion-icon name="person-outline"></ion-icon>
            </span>
            {!isCollapsed && <span className="title">Profile</span>}
          </Link>
        </li>
        {/* Add more menu items as needed */}
        <li className="logout">
          <Link to="/logout">
            <span className="icon">
              <ion-icon name="log-out-outline"></ion-icon>
            </span>
            {!isCollapsed && <span className="title">Logout</span>}
          </Link>
        </li>
      </ul>
      <div className="toggle" onClick={toggleSidebar}>
        <ion-icon
          name={isCollapsed ? "chevron-forward-outline" : "chevron-back-outline"}
        ></ion-icon>
      </div>
    </div>
  );
};

// Add PropTypes validation
Sidebar.propTypes = {
  onToggle: PropTypes.func.isRequired, // Ensure 'onToggle' is passed as a function
};

export default Sidebar;






