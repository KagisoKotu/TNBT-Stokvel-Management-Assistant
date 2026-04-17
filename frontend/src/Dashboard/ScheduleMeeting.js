import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './ScheduleMeeting.css';

const ScheduleMeeting = () => {
  const [platform, setPlatform] = useState('google-meet');
  const [locationType, setLocationType] = useState('online');
  const navigate = useNavigate(); 
  const handleGoBack = (e) => {
    e.preventDefault();
    navigate(-1); 
  };

  return (
    <section className="app-shell">
      <nav className="top-navbar" aria-label="Main Navigation">
        <header className="navbar-content">
          {}
          <button 
            onClick={handleGoBack} 
            className="back-link-btn" 
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}
            aria-label="Return to Dashboard"
          >
            <span className="back-icon" aria-hidden="true">←</span>
          </button>
        </header>
      </nav>

      <main className="schedule-page">
        <article className="form-card">
          <header className="form-header">
            <figure className="header-icon-container">
              <span className="header-icon" role="img" aria-label="Calendar">📅</span>
            </figure>
            <hgroup>
              <h2>Schedule Meeting</h2>
              <p>Create a new meeting</p>
            </hgroup>
          </header>

          <form className="meeting-form">
            {}
            <section className="input-group">
              <label htmlFor="meetingTitle">Meeting Title <mark className="required-marker">*</mark></label>
              <input type="text" id="meetingTitle" placeholder="e.g., Project Kickoff Meeting" required />
            </section>

            <section className="input-group">
              <label htmlFor="purpose">Purpose / Agenda (optional)</label>
              <textarea id="purpose" rows="3" placeholder="Add a short description or agenda"></textarea>
            </section>

            {}
            <fieldset className="form-row">
              <section className="input-group">
                <label htmlFor="meetingDate">Date <mark className="required-marker">*</mark></label>
                <input type="date" id="meetingDate" required />
              </section>
              <section className="input-group">
                <label htmlFor="startTime">Time <mark className="required-marker">*</mark></label>
                <section className="time-range-group">
                  <input type="time" id="startTime" required aria-label="Start time" />
                  <span aria-hidden="true">to</span>
                  <input type="time" id="endTime" required aria-label="End time" />
                </section>
              </section>
            </fieldset>

            {}
            <fieldset className="input-group">
              <legend>Location Type <mark className="required-marker">*</mark></legend>
              <nav className="toggle-navigation" role="group">
                <button 
                  type="button" 
                  className={`toggle-btn ${locationType === 'online' ? 'active' : ''}`}
                  onClick={() => setLocationType('online')}
                >
                  Online Meeting
                </button>
                <button 
                  type="button" 
                  className={`toggle-btn ${locationType === 'in-person' ? 'active' : ''}`}
                  onClick={() => setLocationType('in-person')}
                >
                  In-person Meeting
                </button>
              </nav>
            </fieldset>

            {}
            {locationType === 'online' ? (
              <>
                <fieldset className="form-row">
                  <section className="input-group">
                    <label htmlFor="platform">Meeting Platform</label>
                    <select id="platform" value={platform} onChange={(e) => setPlatform(e.target.value)}>
                      <option value="google-meet">Google Meet</option>
                      <option value="zoom">Zoom</option>
                      <option value="teams">Microsoft Teams</option>
                      <option value="whatsapp">WhatsApp call</option>
                      <option value="others">Others</option>
                    </select>
                  </section>

                  {platform === 'others' && (
                    <section className="input-group">
                      <label htmlFor="otherPlatform">Specify Platform <mark className="required-marker">*</mark></label>
                      <input type="text" id="otherPlatform" placeholder="Type platform name" required />
                    </section>
                  )}
                </fieldset>

                <section className="input-group">
                  <label htmlFor="meetingLink">Meeting Link</label>
                  <section className="action-input-wrapper">
                    <input type="url" id="meetingLink" placeholder="https://meet.google.com/..." />
                    <button type="button" className="copy-btn" aria-label="Copy link">📋</button>
                  </section>
                </section>
              </>
            ) : (
              <section className="input-group">
                <label htmlFor="physicalLocation">Meeting Room / Address <mark className="required-marker">*</mark></label>
                <input 
                  type="text" 
                  id="physicalLocation" 
                  placeholder="e.g., Conference Room B or 123 Business Way" 
                  required 
                />
              </section>
            )}

            <footer className="form-footer">
              {}
              <button type="button" onClick={handleGoBack} className="cancel-link" style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}>
                Cancel
              </button>
              <button type="submit" className="submit-btn">Schedule Meeting</button>
            </footer>
          </form>
        </article>
      </main>
    </section>
  );
};

export default ScheduleMeeting;