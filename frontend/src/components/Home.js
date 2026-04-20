import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Home.css';
import { House, Search, Wallet, Bell, User, ChevronDown, MoreVertical, Trash2 } from 'lucide-react'; 
import NotificationBell from './NotificationBell';

const Home = () => {
  const navigate = useNavigate();
  
  // ==========================================
  // 1. STATE MANAGEMENT
  // ==========================================
  const [activeTab, setActiveTab] = useState('home'); // Tracks bottom nav bar
  const [groups, setGroups] = useState([]); // Holds the user's fetched stokvel groups
  const [openMenuId, setOpenMenuId] = useState(null); // Tracks which group's "3-dot" menu is open
  const [loading, setLoading] = useState(true); // Shows a loading state before data arrives

  // Grab the currently logged-in user from the session memory
  const loggedInUser = JSON.parse(sessionStorage.getItem('user'));

  // ==========================================
  // 2. DATA FETCHING (Runs on component load)
  // ==========================================
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        if (loggedInUser && loggedInUser.email) {
          // SMART URL LOGIC: dynamically switches between local testing and Render live server
          const apiUrl = process.env.REACT_APP_API_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
          
          // Fetch groups where this specific user is a member
          const response = await axios.get(`${apiUrl}/stokvel/user/${loggedInUser.email}`);
          setGroups(response.data);
        }
      } catch (err) {
        console.error("Error fetching groups:", err);
      } finally {
        setLoading(false); // Stop the loading spinner regardless of success or failure
      }
    };
    fetchGroups();
  }, [loggedInUser?.email]);

  // ==========================================
  // 3. EVENT HANDLERS
  // ==========================================
  
  // Routes the user to the correct dashboard based on their role in that specific group
  const handleGroupClick = (group) => {
    const role = group.userRole;
    console.log(`Navigating to ${role} dashboard for: ${group.groupName}`);
    
    switch (role) {
      case 'Admin':
        navigate(`/admin-dashboard/${group._id}`);
        break;
      case 'Treasurer':
        navigate(`/treasurer-dashboard/${group._id}`);
        break;
      case 'Member':
        navigate(`/member-dashboard/${group._id}`);
        break;
      default:
        console.warn("Unknown role detected, defaulting to Member Dashboard");
        navigate(`/member-dashboard/${group._id}`);
    }
  };

  // Removes a group from the UI instantly
  const removeGroup = (id) => {
    setGroups(groups.filter(group => group._id !== id));
    setOpenMenuId(null);
  };

  // Opens/Closes the tiny 3-dot dropdown menu on a group card
  const toggleMenu = (e, id) => {
    e.stopPropagation(); // Prevents clicking the menu from accidentally triggering the handleGroupClick routing
    setOpenMenuId(openMenuId === id ? null : id);
  };

  return (
    <section className="layout-root">
      <header className="top-navbar">
        <h1 className="brand-logo">Stockvel Stockie</h1>
        <nav className="top-nav-actions">

          {/* Our custom Notification Bell Component */}
          <NotificationBell userEmail={loggedInUser?.email} />

          <details className="profile-dropdown">
            <summary className="profile-summary">
              <User size={24} />
              <ChevronDown size={16} />
            </summary>
            <ul className="dropdown-menu">
              <li><button type="button">Profile</button></li>
              <li><button type="button" onClick={() => {
                sessionStorage.clear(); // Wipe secure data
                navigate('/'); // Send to login
              }}>Logout</button></li>
            </ul>
          </details>
        </nav>
      </header>

      <main className="content-area">
        <header className="content-header">
          <h2>My Stockvel Groups</h2>
          <button 
            type="button" 
            className="create-group-btn"
            onClick={() => navigate('/create-group')}
          >
            + Create a group
          </button>
        </header>

        <section className="groups-display-container">
          <article className={`status-container ${groups.length > 0 ? 'has-grid' : 'is-empty'}`}>
            {/* Conditional Rendering: Show loading, empty state, or actual data */}
            {loading ? (
              <p className="empty-msg">Loading your groups...</p>
            ) : groups.length === 0 ? (
              <p className="empty-msg">You are currently not in any group</p>
            ) : (
              <ul className="groups-grid">
                {groups.map((group) => (
                  <li key={group._id}>
                    <article 
                      className="group-tile" 
                      onClick={() => handleGroupClick(group)} 
                      style={{ cursor: 'pointer' }}
                    >
                      <header className="tile-banner"></header>
                      <section className="tile-content">
                        <h3>{group.groupName}</h3>
                        <p style={{ 
                          color: '#8b5cf6', 
                          fontWeight: 'bold', 
                          textTransform: 'capitalize',
                          margin: '4px 0' 
                        }}>
                          {group.userRole}
                        </p>
                        <p>{group.frequency} • R{group.contributionAmount}</p>
                        <footer className="tile-actions">
                          <button 
                            type="button" 
                            className="tile-menu-btn" 
                            onClick={(e) => toggleMenu(e, group._id)}
                          >
                            <MoreVertical size={18} />
                          </button>
                          {openMenuId === group._id && (
                            <ul className="tile-dropdown">
                              <li>
                                <button type="button" className="remove-opt" onClick={(e) => {
                                  e.stopPropagation();
                                  removeGroup(group._id);
                                }}>
                                  <Trash2 size={14} /> Remove
                                </button>
                              </li>
                            </ul>
                          )}
                        </footer>
                      </section>
                    </article>
                  </li>
                ))}
              </ul>
            )}
          </article>
        </section>
      </main>

      {/* Bottom Navigation */}
      <footer className="nav-container">
        <nav aria-label="Main Menu">
          <ul className="nav-list">
            <li><button onClick={() => setActiveTab('home')} className={activeTab === 'home' ? 'active' : ''}><House size={24} /><small>Home</small></button></li>
            <li><button onClick={() => setActiveTab('search')} className={activeTab === 'search' ? 'active' : ''}><Search size={24} /><small>Search</small></button></li>
            <li><button onClick={() => setActiveTab('wallet')} className={activeTab === 'wallet' ? 'active' : ''}><Wallet size={24} /><small>Wallet</small></button></li>
            <li><button onClick={() => setActiveTab('activity')} className={activeTab === 'activity' ? 'active' : ''}><Bell size={24} /><small>Activity</small></button></li>
            <li><button onClick={() => setActiveTab('profile')} className={activeTab === 'profile' ? 'active' : ''}><User size={24} /><small>Profile</small></button></li>
          </ul>
        </nav>
      </footer>
    </section>
  );
};

export default Home;