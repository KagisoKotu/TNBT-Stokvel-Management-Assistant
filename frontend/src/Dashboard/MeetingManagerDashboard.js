import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './MeetingManagerDashboard.css';

const MeetingManagerDashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [displayedDate, setDisplayedDate] = useState(new Date());
  const navigate = useNavigate();
  const today = new Date();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

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
    for (let i = 0; i < startOffset; i++) {
      days.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(d);
    }
    while (days.length % 7 !== 0) {
      days.push(null);
    }
    return days;
  };

  const isToday = (day) => {
    if (!day) return false;
    return (
      day === today.getDate() &&
      displayedDate.getMonth() === today.getMonth() &&
      displayedDate.getFullYear() === today.getFullYear()
    );
  };

  const allDays = getCalendarDays();
  const rows = [];
  for (let i = 0; i < allDays.length; i += 7) {
    rows.push(allDays.slice(i, i + 7));
  }

  return (
    <section className="app-shell">
      {}
      <nav className="top-navbar">
        <header className="navbar-content">
          <button 
            type="button"
            className="hamburger-btn" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-label="Toggle Navigation"
          >
            ☰
          </button>
        </header>
      </nav>

      {/* Side Menu Drawer */}
      <aside className={`side-drawer ${isMenuOpen ? 'open' : ''}`}>
        <nav className="drawer-nav">
          <header className="drawer-header">
            <button 
              type="button" 
              className="close-btn" 
              onClick={() => setIsMenuOpen(false)} 
              aria-label="Close Navigation"
            >
              ×
            </button>
          </header>
          <ul>
            <li>
              <Link to="/schedule" onClick={() => setIsMenuOpen(false)}>
                Schedule Meeting
              </Link>
            </li>
            <li><a href="#agendas">Post Agendas</a></li>
            <li><a href="#minutes">Record Minutes</a></li>
          </ul>
        </nav>
      </aside>

      {isMenuOpen && (
        <section 
          className="overlay" 
          onClick={() => setIsMenuOpen(false)} 
          aria-hidden="true"
        />
      )}

      <main className="dashboard-page">
        <section className="content-container">
          {}
          <header className="dashboard-header" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <button 
              onClick={() => navigate(-1)} 
              style={{ 
                background: 'none', 
                border: 'none', 
                fontSize: '28px', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '0',
                color: '#333'
              }}
              aria-label="Back to Admin Dashboard"
            >
              ←
            </button>
            <h1 style={{ margin: 0 }}>Dashboard</h1>
          </header>

          {}
          <section className="dashboard-card" aria-labelledby="timeline-heading">
            <header className="card-header">
              <h2 id="timeline-heading">Timeline</h2>
            </header>
            <nav className="timeline-controls">
              <select className="timeline-select" aria-label="Filter timeframe">
                <option>Next 7 days</option>
                <option>Next 30 days</option>
              </select>
              <input 
                type="search" 
                className="timeline-search"
                placeholder="Search by meeting name" 
              />
            </nav>
            <article className="status-display">
              <figure>
                <span role="img" aria-label="Task list icon" className="status-icon">📋</span>
                <figcaption>No scheduled Meeting</figcaption>
              </figure>
            </article>
          </section>

          {}
          <section className="dashboard-card" aria-labelledby="calendar-heading">
            <header className="card-header calendar-top-flex">
              <h2 id="calendar-heading">Calendar</h2>
              <button type="button" className="btn-primary" onClick={() => navigate('/schedule')}>New event</button>
            </header>

            <nav className="calendar-navigation" aria-label="Month navigation">
              <button type="button" className="nav-month-btn" onClick={() => changeMonth(-1)}>
                ‹ {getNearbyMonthName(-1)}
              </button>
              <time className="calendar-title-date">
                <strong>{currentMonth} {currentYear}</strong>
              </time>
              <button type="button" className="nav-month-btn" onClick={() => changeMonth(1)}>
                {getNearbyMonthName(1)} ›
              </button>
            </nav>

            <table className="calendar-grid">
              <thead>
                <tr>
                  <th scope="col">Mon</th>
                  <th scope="col">Tue</th>
                  <th scope="col">Wed</th>
                  <th scope="col">Thu</th>
                  <th scope="col">Fri</th>
                  <th scope="col">Sat</th>
                  <th scope="col">Sun</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((week, index) => (
                  <tr key={index}>
                    {week.map((day, dIndex) => (
                      <td key={dIndex}>
                        {day ? (
                          <time className={`day-number ${isToday(day) ? 'is-today' : ''}`}>
                            {day}
                          </time>
                        ) : ""}
                      </td>
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