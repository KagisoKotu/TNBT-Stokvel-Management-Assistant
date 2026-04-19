import { useState } from 'react';
import { 
  FaBars, FaBell, FaUserCircle, FaCaretDown, 
  FaUserAlt, FaCog, FaSignOutAlt,
  FaHome, FaUsers, FaMoneyBillWave, FaCalendarAlt, FaChartLine 
} from 'react-icons/fa';
import './Navbar.css';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const menuItems = [
    { name: "Home", icon: <FaHome /> },
    { name: "My Groups", icon: <FaUsers /> },
    { name: "Payout Pipeline", icon: <FaMoneyBillWave /> },
    { name: "Meeting Manager", icon: <FaCalendarAlt /> },
    { name: "Financial Reports", icon: <FaChartLine /> }
  ];

  const dropdownItems = [
    { name: "Profile", icon: <FaUserAlt /> },
    { name: "Settings", icon: <FaCog /> },
    { name: "Logout", icon: <FaSignOutAlt /> }
  ];

  return (
    <>
      <header className="header">
        <button className="hamburger-button" onClick={toggleMenu} aria-label="Open Menu">
          <FaBars />
        </button>

        <section className="header-right">
          <button className="icon-btn" aria-label="Notifications">
            <FaBell className="bell-gold" />
          </button>
          
          <nav className="profile-wrapper">
            <button className="profile-trigger" onClick={toggleDropdown} aria-haspopup="menu">
              <figure className="avatar-circle">
                <FaUserCircle className="avatar-icon" />
              </figure>
              <strong className="username">Treasurer</strong>
              <FaCaretDown className={`caret ${isDropdownOpen ? 'rotate' : ''}`} />
            </button>

            {isDropdownOpen && (
              <menu className="profile-dropdown">
                {dropdownItems.map((item, index) => (
                  <li key={index} className="dropdown-item">
                    <button onClick={() => setIsDropdownOpen(false)}>
                      <i className="dropdown-icon">{item.icon}</i>
                      {item.name}
                    </button>
                  </li>
                ))}
              </menu>
            )}
          </nav>
        </section>
      </header>

      <aside className={`side-nav ${isOpen ? 'open' : ''}`}>
        <nav>
          <ul className="nav-list">
            {menuItems.map((item, index) => (
              <li key={index}>
                <a href="#" onClick={toggleMenu}>
                  <i className="nav-icon">{item.icon}</i>
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {}
      {(isOpen || isDropdownOpen) && (
        <section 
          className="overlay" 
          onClick={() => {setIsOpen(false); setIsDropdownOpen(false);}}
          aria-hidden="true"
        ></section>
      )}
    </>
  );
}

export default Navbar;