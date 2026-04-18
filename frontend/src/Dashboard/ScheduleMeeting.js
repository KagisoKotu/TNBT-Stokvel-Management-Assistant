import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios'; // 1. Import axios
import './ScheduleMeeting.css';

const ScheduleMeeting = () => {
  const [platform, setPlatform] = useState('google-meet');
  const [locationType, setLocationType] = useState('online');
  const navigate = useNavigate();

  // 2. Add State to capture input values
  const [formData, setFormData] = useState({
    meetingTitle: '',
    purpose: '',
    meetingDate: '',
    startTime: '',
    endTime: '',
    otherPlatform: '',
    meetingLink: '',
    physicalLocation: ''
  });

  // 3. Simple function to update the state as you type
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleGoBack = (e) => {
    e.preventDefault();
    navigate(-1);
  };

  // 4. The function that saves to MongoDB
  const handleSubmit = async (e) => {
    e.preventDefault();
    const meetingData = {
      ...formData,
      locationType,
      platform,
      // Ensure we only save the relevant location
      meetingLink: locationType === 'online' ? formData.meetingLink : '',
      physicalLocation: locationType === 'in-person' ? formData.physicalLocation : ''
    };

    try {
      await axios.post('http://localhost:5000/api/meetings/schedule', meetingData);
      alert("Meeting Scheduled Successfully!");
      navigate(-1);
    } catch (error) {
      console.error("Error saving meeting:", error);
      alert("Failed to schedule meeting.");
    }
  };

  return (
    <section className="app-shell">
      <nav className="top-navbar" aria-label="Main Navigation">
        <header className="navbar-content">
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

          {/* 5. Add onSubmit here */}
          <form className="meeting-form" onSubmit={handleSubmit}>
            <section className="input-group">
              <label htmlFor="meetingTitle">Meeting Title <mark className="required-marker">*</mark></label>
              <input 
                type="text" 
                id="meetingTitle" 
                placeholder="e.g., Project Kickoff Meeting" 
                required 
                value={formData.meetingTitle}
                onChange={handleInputChange} 
              />
            </section>

            <section className="input-group">
              <label htmlFor="purpose">Purpose / Agenda (optional)</label>
              <textarea 
                id="purpose" 
                rows="3" 
                placeholder="Add a short description or agenda"
                value={formData.purpose}
                onChange={handleInputChange}
              ></textarea>
            </section>

            <fieldset className="form-row">
              <section className="input-group">
                <label htmlFor="meetingDate">Date <mark className="required-marker">*</mark></label>
                <input 
                  type="date" 
                  id="meetingDate" 
                  required 
                  value={formData.meetingDate}
                  onChange={handleInputChange}
                />
              </section>
              <section className="input-group">
                <label htmlFor="startTime">Time <mark className="required-marker">*</mark></label>
                <section className="time-range-group">
                  <input 
                    type="time" 
                    id="startTime" 
                    required 
                    aria-label="Start time" 
                    value={formData.startTime}
                    onChange={handleInputChange}
                  />
                  <span aria-hidden="true">to</span>
                  <input 
                    type="time" 
                    id="endTime" 
                    required 
                    aria-label="End time" 
                    value={formData.endTime}
                    onChange={handleInputChange}
                  />
                </section>
              </section>
            </fieldset>

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

            {locationType === 'online' ? (
              <>
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
                    <input 
                      type="text" 
                      id="otherPlatform" 
                      placeholder="Type platform name" 
                      required 
                      value={formData.otherPlatform}
                      onChange={handleInputChange}
                    />
                  </section>
                )}

                <section className="input-group">
                  <label htmlFor="meetingLink">Meeting Link</label>
                  <section className="action-input-wrapper">
                    <input 
                      type="url" 
                      id="meetingLink" 
                      placeholder="https://meet.google.com/..." 
                      value={formData.meetingLink}
                      onChange={handleInputChange}
                    />
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
                  value={formData.physicalLocation}
                  onChange={handleInputChange}
                />
              </section>
            )}

            <footer className="form-footer">
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