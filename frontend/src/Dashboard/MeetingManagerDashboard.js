import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MeetingManagerDashboard.css';
import {Link, useNavigate, useParams} from 'react-router-dom';

const MeetingManagerDashboard = () => {
  const { groupId } = useParams(); // Get the groupId from the URL parameters
  console.log("REACT IS SEEING THIS ID:", groupId);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [displayedDate, setDisplayedDate] = useState(new Date());
  const [meetings, setMeetings] = useState([]); 
  const navigate = useNavigate();
  const today = new Date();

  // FETCH REAL DATA FROM DATABASE
  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        // Points to your Express GET route
        const res = await axios.get('http://localhost:5000/api/meetings');
        setMeetings(res.data);
      } catch (err) {
        console.error("Error fetching meetings from MongoDB:", err);
      }
    };
    fetchMeetings();
  }, []);

  // FILTER LOGIC: Remove meetings that have already passed
  const upcomingMeetings = meetings.filter(meeting => {
    const meetingDateTime = new Date(`${meeting.meetingDate}T${meeting.startTime}`);
    return meetingDateTime > new Date(); 
  });

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const currentMonth = monthNames[displayedDate.getMonth()];
  const currentYear = displayedDate.getFullYear();

  const changeMonth = (offset) => {
    setDisplayedDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(prevDate.getMonth() + offset);
      return newDate;
    });
  };

  const getNearbyMonthName = (offset) => {
    const nearbyDate = new Date(displayedDate);
    nearbyDate.setMonth(displayedDate.getMonth() + offset);
    return monthNames[nearbyDate.getMonth()];
  };

  const getCalendarDays = () => {
    const year = displayedDate.getFullYear();
    const month = displayedDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    for (let i = 0; i < startOffset; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    while (days.length % 7 !== 0) days.push(null);
    return days;
  };

  const isToday = (day) => {
    if (!day) return false;
    return day === today.getDate() && displayedDate.getMonth() === today.getMonth() && displayedDate.getFullYear() === today.getFullYear();
  };

  const rows = [];
  const allDays = getCalendarDays();
  for (let i = 0; i < allDays.length; i += 7) rows.push(allDays.slice(i, i + 7));

  return (
    <section className="app-shell">
      <nav className="top-navbar">
        <header className="navbar-content">
          <button type="button" className="hamburger-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>☰</button>
        </header>
      </nav>

      <aside className={`side-drawer ${isMenuOpen ? 'open' : ''}`}>
        <nav className="drawer-nav">
          <header className="drawer-header">
            <button type="button" className="close-btn" onClick={() => setIsMenuOpen(false)}>×</button>
          </header>
          <ul>
            <li><Link to={`/schedule/${groupId}`} onClick={() => setIsMenuOpen(false)}>Schedule Meeting</Link></li>
            <li><Link to={`/post-agenda/${groupId}`} onClick={() => setIsMenuOpen(false)}>Post Agendas</Link></li>
            <li><Link to={`/admin/record-minutes/${groupId}`} onClick={() => setIsMenuOpen(false)}>Record Minutes</Link></li>
          </ul>
        </nav>
      </aside>

      {isMenuOpen && <section className="overlay" onClick={() => setIsMenuOpen(false)} />}

      <main className="dashboard-page">
        <section className="content-container">
          <header className="dashboard-header" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', fontSize: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0', color: '#333' }}>←</button>
            <h1 style={{ margin: 0 }}>Dashboard</h1>
          </header>

          <section className="dashboard-card">
            <header className="card-header">
              <h2>Timeline</h2>
            </header>
            
            <div className="timeline-content" style={{ padding: '20px' }}>
              {upcomingMeetings.length > 0 ? (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {upcomingMeetings.map((meeting) => (
                    <li key={meeting._id} style={{ 
                      padding: '15px', 
                      borderLeft: '4px solid #007bff', 
                      backgroundColor: '#f8f9fa', 
                      marginBottom: '10px',
                      borderRadius: '0 8px 8px 0'
                    }}>
                      <h3 style={{ margin: '0 0 5px 0' }}>{meeting.meetingTitle}</h3>
                      <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                        📅 {meeting.meetingDate} | ⏰ {meeting.startTime} - {meeting.endTime}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <article className="status-display">
                  <figure>
                    <span role="img" aria-label="Task list icon" className="status-icon">📋</span>
                    <figcaption>No scheduled Meeting</figcaption>
                  </figure>
                </article>
              )}
            </div>
          </section>

          {/* Calendar section stays here... */}
          <section className="dashboard-card">
            <header className="card-header calendar-top-flex">
              <h2>Calendar</h2>
              <button type="button" className="btn-primary" onClick={() => navigate('/schedule')}>New event</button>
            </header>
            <nav className="calendar-navigation">
              <button type="button" className="nav-month-btn" onClick={() => changeMonth(-1)}>‹ {getNearbyMonthName(-1)}</button>
              <time className="calendar-title-date"><strong>{currentMonth} {currentYear}</strong></time>
              <button type="button" className="nav-month-btn" onClick={() => changeMonth(1)}>{getNearbyMonthName(1)} ›</button>
            </nav>
            <table className="calendar-grid">
              <thead><tr><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th><th>Sun</th></tr></thead>
              <tbody>
                {rows.map((week, index) => (
                  <tr key={index}>
                    {week.map((day, dIndex) => (
                      <td key={dIndex}>{day ? <time className={`day-number ${isToday(day) ? 'is-today' : ''}`}>{day}</time> : ""}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </section>
      </main>
    </section>
  );
};

export default MeetingManagerDashboard;