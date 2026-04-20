import React from 'react';
import './ViewMembers.css';

const ViewMembers = ({ group, members, onSelectMember }) => {
  // Retrieve the logged-in user from session storage
  const currentUser = JSON.parse(sessionStorage.getItem('user'));

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
          <strong>{members?.length || 0}</strong> Members
        </p>
      </header>

      {/* Interactive Member List */}
      <nav className="members-list-nav">
        <ul className="members-list">
          {members && members.length > 0 ? (
            members.map((member) => {
              // Normalize emails to ensure the "You" highlight works reliably
              const isMe = 
                member.userEmail?.trim().toLowerCase() === 
                currentUser?.email?.trim().toLowerCase();
              
              const hasTag = member.memberType === 'Admin' || member.memberType === 'Treasurer';

              return (
                <li 
                  key={member._id} 
                  className="member-clickable-card" 
                  onClick={() => onSelectMember(member)}
                >
                  <section className="name-tag-row">
                    <p className="member-display-name">
                      {isMe ? "You" : member.displayName}
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