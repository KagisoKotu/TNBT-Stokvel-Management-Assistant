import React from 'react';
import './ViewMembers.css';

const ViewMembers = ({ group, members = [], onMemberClick, onBack }) => {
  return (
    <article className="view-members-container">
      
      <button className="back-button" onClick={onBack} aria-label="Go back">
        ←
      </button>

    
      <header className="group-info-header">
        <h2 className="group-name-bold">{group?.name || "Group Name"}</h2>
        <p className="creation-date">
          {group?.createdAt ? `Created on: ${group.createdAt}` : "Date unknown"}
        </p>
      </header>

      {/* Member List */}
      <section className="members-list-section">
        <h3>Members</h3>
        <ul className="member-items">
          {members.map((member) => (
            <li 
              key={member._id} 
              className="member-item-link"
              onClick={() => onMemberClick(member)}
            >
              {member.firstName} {member.lastName}
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
};

export default ViewMembers;