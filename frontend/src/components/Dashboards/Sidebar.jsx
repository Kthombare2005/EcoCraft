// import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import "./Sidebar.css";

// const Sidebar = () => {
//   const [isCollapsed, setIsCollapsed] = useState(window.innerWidth <= 768); // Default collapsed for small screens
//   const [active, setActive] = useState("Home");

//   // Toggle the sidebar
//   const toggleSidebar = () => {
//     setIsCollapsed(!isCollapsed);
//   };

//   // Set the active state
//   const handleActive = (section) => {
//     setActive(section);
//     if (window.innerWidth <= 768) {
//       setIsCollapsed(true); // Auto-collapse after selection on small screens
//     }
//   };

//   // Handle resize event for responsiveness
//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth <= 768) {
//         setIsCollapsed(true); // Auto-collapse on small screens
//       } else {
//         setIsCollapsed(false); // Expand on large screens
//       }
//     };

//     window.addEventListener("resize", handleResize);
//     return () => {
//       window.removeEventListener("resize", handleResize);
//     };
//   }, []);

//   return (
//     <div className={`navigation ${isCollapsed ? "collapsed" : ""}`}>
//       <ul>
//         {/* EcoCraft Branding */}
//         <li className="brand">
//           {!isCollapsed && (
//             <span className="title">
//               Eco<span>Craft</span>
//             </span>
//           )}
//         </li>

//         {/* Sidebar Items */}
//         <li
//           className={active === "Home" ? "active" : ""}
//           onClick={() => handleActive("Home")}
//         >
//           <Link to="/">
//             <span className="icon">
//               <ion-icon name="home-outline"></ion-icon>
//             </span>
//             {!isCollapsed && <span className="title">Home</span>}
//           </Link>
//         </li>
//         <li
//           className={active === "Sell Scrap" ? "active" : ""}
//           onClick={() => handleActive("Sell Scrap")}
//         >
//           <Link to="/sell-scrap">
//             <span className="icon">
//               <ion-icon name="cash-outline"></ion-icon>
//             </span>
//             {!isCollapsed && <span className="title">Sell Scrap</span>}
//           </Link>
//         </li>
//         <li
//           className={active === "Transform Scrap" ? "active" : ""}
//           onClick={() => handleActive("Transform Scrap")}
//         >
//           <Link to="/transform-scrap">
//             <span className="icon">
//               <ion-icon name="hammer-outline"></ion-icon>
//             </span>
//             {!isCollapsed && <span className="title">Transform Scrap</span>}
//           </Link>
//         </li>
//         <li
//           className={active === "Artisans" ? "active" : ""}
//           onClick={() => handleActive("Artisans")}
//         >
//           <Link to="/artisans">
//             <span className="icon">
//               <ion-icon name="people-outline"></ion-icon>
//             </span>
//             {!isCollapsed && <span className="title">Artisans</span>}
//           </Link>
//         </li>
//         <li
//           className={active === "Profile" ? "active" : ""}
//           onClick={() => handleActive("Profile")}
//         >
//           <Link to="/profile">
//             <span className="icon">
//               <ion-icon name="person-outline"></ion-icon>
//             </span>
//             {!isCollapsed && <span className="title">Profile</span>}
//           </Link>
//         </li>

//         {/* Logout */}
//         <li className="logout">
//           <Link to="/logout">
//             <span className="icon">
//               <ion-icon name="log-out-outline"></ion-icon>
//             </span>
//             {!isCollapsed && <span className="title">Logout</span>}
//           </Link>
//         </li>
//       </ul>

//       {/* Toggle Button */}
//       <div className="toggle" onClick={toggleSidebar}>
//         <ion-icon
//           name={isCollapsed ? "chevron-forward-outline" : "chevron-back-outline"}
//         ></ion-icon>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;



import PropTypes from "prop-types"; // Import PropTypes
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = ({ onToggle }) => {
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth <= 768);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    onToggle(!isCollapsed);
  };

  useEffect(() => {
    const handleResize = () => {
      const isSmallScreen = window.innerWidth <= 768;
      setIsCollapsed(isSmallScreen);
      onToggle(isSmallScreen);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [onToggle]);

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
        <li>
          <Link to="/" className="active">
            <span className="icon">
              <ion-icon name="home-outline"></ion-icon>
            </span>
            {!isCollapsed && <span className="title">Home</span>}
          </Link>
        </li>
        <li>
          <Link to="/sell-scrap">
            <span className="icon">
              <ion-icon name="cash-outline"></ion-icon>
            </span>
            {!isCollapsed && <span className="title">Sell Scrap</span>}
          </Link>
        </li>
        <li>
          <Link to="/transform-scrap">
            <span className="icon">
              <ion-icon name="hammer-outline"></ion-icon>
            </span>
            {!isCollapsed && <span className="title">Transform Scrap</span>}
          </Link>
        </li>
        <li>
          <Link to="/artisans">
            <span className="icon">
              <ion-icon name="people-outline"></ion-icon>
            </span>
            {!isCollapsed && <span className="title">Artisans</span>}
          </Link>
        </li>
        <li>
          <Link to="/profile">
            <span className="icon">
              <ion-icon name="person-outline"></ion-icon>
            </span>
            {!isCollapsed && <span className="title">Profile</span>}
          </Link>
        </li>
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
  onToggle: PropTypes.func.isRequired,
};

export default Sidebar;
