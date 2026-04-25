import React, { useState } from 'react';
import './MemberDetails.css';

const MemberDetails = ({ member, onClose, onRemove }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState(null); 

  const currentUser = JSON.parse(sessionStorage.getItem('user') || '{}');
  
 
  const isMe = member.userEmail?.trim().toLowerCase() === currentUser?.email?.trim().toLowerCase();

  const handleConfirmYes = async () => {
    setError(null);
    const success = await onRemove(member._id);
    
    if (success) {
      setSuccessMsg("You have successfully removed this person as a member");
      
      setTimeout(() => {
        onClose(); 
      }, 2000);
    } else {
    
      setError("Failed to remove member.");
    }
  };

  const handleConfirmNo = () => {
    setShowConfirm(false); 
  };

  
  if (successMsg) {
    return (
      <aside className="member-details-panel">
        <article className="status-container">
          <p className="success-message">{successMsg}</p>
        </article>
      </aside>
    );
  }

  return (
    <aside className="member-details-panel">
      <header className="details-header">
        <button type="button" className="close-details" onClick={onClose} aria-label="Close">×</button>
        <h2>{isMe ? "Your Profile" : member.displayName}</h2>
      </header>

      <article className="details-content">
        {/* Render error if it exists */}
        {error && <p className="error-text">{error}</p>}

        {!showConfirm ? (
          <section className="profile-info">
            <section className="info-group">
              <label>Full Name</label>
              <p>{member.displayName}</p>
            </section>
            
            <section className="info-group">
              <label>Email Address</label>
              <p>{member.userEmail}</p>
            </section>

            <section className="info-group">
              <label>Role</label>
              <p>{member.memberType}</p>
            </section>

            <section className="info-group">
              <label>Date Joined Group</label>
              <p>
                {member.joiningDate 
                  ? new Date(member.joiningDate).toLocaleDateString('en-GB', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    }) 
                  : "N/A"}
              </p>
            </section>

            {!isMe && (
              <footer className="details-footer">
                <button 
                  type="button" 
                  className="remove-trigger-btn" 
                  onClick={() => setShowConfirm(true)}
                >
                  Remove Member
                </button>
              </footer>
            )}
          </section>
        ) : (
          <section className="confirmation-box">
            <p className="warning-text">Are you sure you want to remove this member?</p>
            <nav className="confirm-nav">
              <button type="button" className="confirm-btn no" onClick={handleConfirmNo}>No</button>
              <button type="button" className="confirm-btn yes" onClick={handleConfirmYes}>Yes</button>
            </nav>
          </section>
        )}
      </article>
    </aside>
  );
};

export default MemberDetails;