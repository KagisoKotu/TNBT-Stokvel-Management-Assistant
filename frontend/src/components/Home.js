import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import { House, Search, Wallet, Bell, User, ChevronDown, MoreVertical, Trash2 } from 'lucide-react'; 

const Home = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const [groups, setGroups] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    const savedGroups = JSON.parse(localStorage.getItem('stockvelGroups')) || [];
    setGroups(savedGroups);
  }, []);

  const removeGroup = (id) => {
    const updatedGroups = groups.filter(group => group.id !== id);
    setGroups(updatedGroups);
    localStorage.setItem('stockvelGroups', JSON.stringify(updatedGroups));
    setOpenMenuId(null);
  };

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  return (
    <section className="layout-root">
      <header className="top-navbar">
        <h1 className="brand-logo">Stockvel Stockie</h1>
        <nav className="top-nav-actions">
          <button type="button" className="icon-btn" aria-label="Notifications">
            <Bell size={24} />
          </button>
          <details className="profile-dropdown">
            <summary className="profile-summary">
              <User size={24} />
              <ChevronDown size={16} />
            </summary>
            <ul className="dropdown-menu">
              <li><button type="button">Profile</button></li>
              <li><button type="button">Logout</button></li>
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
            {groups.length === 0 ? (
              <p className="empty-msg">You are currently not in any group</p>
            ) : (
              <ul className="groups-grid">
                {groups.map((group) => (
                  <li key={group.id}>
                    <article className="group-tile">
                      <header className="tile-banner"></header>
                      <section className="tile-content">
                        <h3>{group.groupName}</h3>
                        <p>{group.frequency} • R{group.contributionAmount}</p>
                        <footer className="tile-actions">
                          <button 
                            type="button" 
                            className="tile-menu-btn" 
                            onClick={() => toggleMenu(group.id)}
                          >
                            <MoreVertical size={18} />
                          </button>
                          {openMenuId === group.id && (
                            <ul className="tile-dropdown">
                              <li>
                                <button type="button" className="remove-opt" onClick={() => removeGroup(group.id)}>
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