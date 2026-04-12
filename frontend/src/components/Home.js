import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import { House, Search, Wallet, Bell, User, ChevronDown, MoreVertical } from 'lucide-react'; 

const Home = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const savedGroups = JSON.parse(localStorage.getItem('stockvelGroups')) || [];
    setGroups(savedGroups);
  }, []);

  return (
    <section className="layout-root">
      <header className="top-navbar">
        <h1 className="brand-logo">Stockvel Stockie</h1>
        <nav className="top-nav-actions">
          <button type="button" className="icon-btn"><Bell size={24} /></button>
          <details className="profile-dropdown">
            <summary className="profile-summary"><User size={24} /><ChevronDown size={16} /></summary>
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

        {/* This is the dedicated area (The Container) */}
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
                          <button type="button" className="tile-menu" aria-label="Options">
                            <MoreVertical size={18} />
                          </button>
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
            <li><button onClick={() => setActiveTab('home')} className={activeTab === 'home' ? 'active' : ''}><House size={24} /><span>Home</span></button></li>
            <li><button onClick={() => setActiveTab('search')} className={activeTab === 'search' ? 'active' : ''}><Search size={24} /><span>Search</span></button></li>
            <li><button onClick={() => setActiveTab('wallet')} className={activeTab === 'wallet' ? 'active' : ''}><Wallet size={24} /><span>Wallet</span></button></li>
            <li><button onClick={() => setActiveTab('activity')} className={activeTab === 'activity' ? 'active' : ''}><Bell size={24} /><span>Activity</span></button></li>
            <li><button onClick={() => setActiveTab('profile')} className={activeTab === 'profile' ? 'active' : ''}><User size={24} /><span>Profile</span></button></li>
          </ul>
        </nav>
      </footer>
    </section>
  );
};

export default Home;