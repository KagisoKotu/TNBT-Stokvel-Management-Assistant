import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ViewMembers from './ViewMembers';
import MemberDetails from './MemberDetails';
import './GroupManagement.css';

const GroupManagement = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();

  // CHANGE: Initialize as null so the list is hidden on page load
  const [activeTab, setActiveTab] = useState(null); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [members, setMembers] = useState([]);
  const [groupData, setGroupData] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);

  // Fetch data on mount to ensure it's ready when the tab is clicked
  useEffect(() => {
    const loadData = async () => {
      try {
        // Matches your backend: router.get('/:groupId/members', ...)
        const response = await fetch(`http://localhost:5000/api/managegroup/${groupId}/members`);
        const data = await response.json();
        if (response.ok) {
          setMembers(data.members);
          setGroupData(data.group);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    if (groupId) loadData();
  }, [groupId]);

  const handleRemove = async (memberId) => {
    try {
      // Matches your backend: router.delete('/:groupId/member/:memberId', ...)
      const response = await fetch(`http://localhost:5000/api/managegroup/${groupId}/member/${memberId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setMembers(prev => prev.filter(m => m._id !== memberId));
        return true; 
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  return (
    <section className="management-container">
      <header className="top-navigation">
        <section className="nav-left">
          <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
          <button className="menu-toggle" onClick={() => setIsSidebarOpen(true)}>☰ Menu</button>
        </section>
        <h1>Manage Group</h1>
      </header>

      <aside className={`management-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <button className="close-sidebar" onClick={() => setIsSidebarOpen(false)}>×</button>
        <header className="sidebar-header">
          <h3>Group Actions</h3>
        </header>
        <nav className="sidebar-nav">
          <ul>
            <li 
              className={activeTab === 'members' ? 'active' : ''} 
              onClick={() => { 
                setActiveTab('members'); // Shows the ViewMembers component
                setSelectedMember(null); // Ensures detail view is closed
                setIsSidebarOpen(false); // Closes sidebar on mobile
              }}
            >
              View Members
            </li>
          </ul>
        </nav>
      </aside>

      {isSidebarOpen && <div className="overlay-dim" onClick={() => setIsSidebarOpen(false)} />}

      <main className="management-main">
        {/* The List: ONLY shows if activeTab is 'members' AND no member is selected */}
        {activeTab === 'members' && !selectedMember && (
          <ViewMembers 
            group={groupData} 
            members={members} 
            onSelectMember={(m) => setSelectedMember(m)}
          />
        )}

        {/* The Details: Shows when a member is clicked from the list */}
        {selectedMember && (
          <MemberDetails 
            member={selectedMember} 
            onClose={() => setSelectedMember(null)}
            onRemove={handleRemove}
          />
        )}

        {/* Optional: Placeholder when nothing is selected */}
        {!activeTab && (
          <div className="welcome-placeholder">
            <p>Select an action from the menu to get started.</p>
          </div>
        )}
      </main>
    </section>
  );
};

export default GroupManagement;