import React, { useState, useEffect } from 'react';
import './ViewMembers.css';

const ViewMembers = ({ group, members: initialMembers, onSelectMember }) => {
  // Retrieve the logged-in user from session storage
  const currentUser = JSON.parse(sessionStorage.getItem('user'));
  
  // 1. Give the component its own memory (State) so it can update the screen
  const [displayMembers, setDisplayMembers] = useState(initialMembers || []);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 2. The Render API URL (No localhost ghosts!)
  const apiUrl = 'https://tnbt-stokvel-management-assistant.onrender.com/api';

  // 3. The "Brain" - Fetch fresh members automatically when the component loads
  useEffect(() => {
    // Keep it synced if the parent passes new data
    if (initialMembers && initialMembers.length > 0) {
      setDisplayMembers(initialMembers);
    }

    const fetchFreshMembers = async () => {
      if (!group?._id) return;
      setIsRefreshing(true);
      
      try {
        const token = localStorage.getItem('token');
        // Fetch the absolute latest members list from the live database
        const response = await fetch(`${apiUrl}/admin/members?groupId=${group._id}`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          // If the DB has fresh members, overwrite the stale ones and update the screen!
          if (data.members) {
            setDisplayMembers(data.members);
          }
        }
      } catch (error) {
        console.error("Silently falling back to parent props...", error);
      } finally {
        setIsRefreshing(false);
      }
    };

    fetchFreshMembers();
  }, [group?._id, initialMembers]); // Re-run if the group ID changes

  // Helper to format the creation date to a readable format
  const formatCreationDate = (dateString) => {
    if (!dateString) return "Processing...";
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <article className="view-members-layout">
      {/* Header showing Group Metadata */}
      <header className="members-header">
        <h2 className="group-name-bold">
          {group?.groupName || "Loading Group..."}
        </h2>
        <p className="creation-date">
          Created on: {formatCreationDate(group?.creationDate)}
        </p>
        <p className="member-count">
          <strong>{displayMembers?.length || 0}</strong> Members
          {isRefreshing && <span style={{fontSize: '12px', color: '#888', marginLeft: '8px'}}>(Updating...)</span>}
        </p>
      </header>

      {/* Interactive Member List */}
      <nav className="members-list-nav">
        <ul className="members-list">
          {displayMembers && displayMembers.length > 0 ? (
            displayMembers.map((member) => {
              // Normalize emails to ensure the "You" highlight works reliably
              const isMe = 
                member.userEmail?.trim().toLowerCase() === 
                currentUser?.email?.trim().toLowerCase();
              
              const hasTag = member.memberType === 'Admin' || member.memberType === 'Treasurer';

              return (
                <li 
                  key={member._id || Math.random()} // Fallback key just in case
                  className="member-clickable-card" 
                  onClick={() => onSelectMember(member)}
                >
                  <section className="name-tag-row">
                    <p className="member-display-name">
                      {isMe ? "You" : member.displayName || member.name}
                    </p>
                    
                    {/* Display specialized role tags if applicable */}
                    {hasTag && (
                      <strong className="role-tag-blue-inline">
                        {member.memberType}
                      </strong>
                    )}
                  </section>
                  <i className="arrow-indicator">›</i>
                </li>
              );
            })
          ) : (
            <p className="empty-state-msg">No members found in this group.</p>
          )}
        </ul>
      </nav>
    </article>
  );
};

export default ViewMembers;