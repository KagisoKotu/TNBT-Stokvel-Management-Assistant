import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // 👈 Added for URL ID reading
import axios from 'axios'; // 👈 Added to talk to the backend
import './MemberDashboard.css';

const MemberDashboard = ({ user, onLogout }) => {
  // ==========================================
  // 1. STATE & ROUTING SETUP
  // ==========================================
  // Grab the VIP wristband from the URL (e.g., /member-dashboard/Stokvel123)
  const { groupId } = useParams(); 
  
  // Existing state for the dashboard UI
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // NEW State: specifically for holding the agendas from MongoDB
  const [agendas, setAgendas] = useState([]);
  const [loadingAgendas, setLoadingAgendas] = useState(false);
  const [agendaError, setAgendaError] = useState('');

  // ==========================================
  // 2. FETCH DASHBOARD DATA (Your existing mock data)
  // ==========================================
  useEffect(() => {
    const mockData = {
      groupName: 'Family Savings Stokvel',
      groupDescription: 'A stokvel for family members to save together for annual events and emergencies.',
      monthlyContribution: 500,
      nextContribution: '15 May 2026',
      totalContributed: 1500,
      savingsBalance: 2500,
      personalInfo: {
        name: user?.name || 'John Doe',
        email: user?.email || 'john@stokvel.com',
        phone: '+27 123 456 789',
        memberId: 'SS-MEM-001',
        joinDate: '15 January 2026'
      },
      contributions: [
        { date: '15 January 2026', amount: 500, status: 'Paid', method: 'Bank Transfer' },
        { date: '15 February 2026', amount: 500, status: 'Paid', method: 'Cash' },
        { date: '15 March 2026', amount: 500, status: 'Paid', method: 'Bank Transfer' },
        { date: '15 April 2026', amount: 500, status: 'Pending', method: '-' }
      ]
    };
    
    setTimeout(() => {
      setDashboardData(mockData);
      setLoading(false);
    }, 500);
  }, [user]);

  // ==========================================
  // 3. FETCH AGENDAS (The New Backend Scout)
  // ==========================================
  useEffect(() => {
    // Only run this if we actually have a group ID to look up
    const fetchAgendas = async () => {
      const activeGroupId = groupId || user?.groupId; // Fallback just in case!
      if (!activeGroupId) return; 

      setLoadingAgendas(true);
      try {
        const apiUrl = process.env.REACT_APP_API_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        
        // Knock on the backend door for this specific group's agendas
        const response = await axios.get(`${apiUrl}/meetings/agenda/${activeGroupId}`);
        
        // Save the real database data to our state
        setAgendas(response.data);
      } catch (err) {
        console.error("Error fetching agendas:", err);
        setAgendaError("Could not load agendas. Please check your connection.");
      } finally {
        setLoadingAgendas(false);
      }
    };

    fetchAgendas();
  }, [groupId, user]); // Re-run if the user or group changes

  // Helper function for styling your contribution badges
  const getStatusClass = (status) => {
    if (status === 'Paid') return 'status-paid';
    return 'status-pending';
  };
  
  if (loading) {
    return <main className="loading">Loading your dashboard...</main>;
  }

  // ==========================================
  // 4. THE UI RENDER
  // ==========================================
  return (
    <section className="dashboard">
      {/* --- SIDEBAR --- */}
      <aside className="sidebar">
        <header className="logo">
          <section className="logo-icon">SS</section>
          <section className="logo-text">
            <h2>Stokvel <strong className="blue-text">Stokie</strong></h2>
            <p>Member Portal</p>
          </section>
        </header>
        <nav>
          <ul className="nav-list">
            <li className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
              Overview
            </li>
            <li className={`nav-item ${activeTab === 'contributions' ? 'active' : ''}`} onClick={() => setActiveTab('contributions')}>
              My Contributions
            </li>
            <li className={`nav-item ${activeTab === 'savings' ? 'active' : ''}`} onClick={() => setActiveTab('savings')}>
              Savings
            </li>
            {/* ✨ NEW AGENDAS TAB IN SIDEBAR ✨ */}
            <li className={`nav-item ${activeTab === 'agendas' ? 'active' : ''}`} onClick={() => setActiveTab('agendas')}>
              Agendas & Meetings
            </li>
            <li className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
              Profile
            </li>
          </ul>
        </nav>
      </aside>
      
      {/* --- MAIN CONTENT AREA --- */}
      <main className="main-content">
        <header className="header">
          <section className="header-title">
            <h1>Member Dashboard</h1>
            <p>Track your contributions and savings across all your stokvels</p>
          </section>
          <section className="user-info">
            <section className="avatar">{user?.avatar || 'JD'}</section>
            <button className="btn-logout" type="button" onClick={onLogout}>
              Logout
            </button>
          </section>
        </header>
        
        {/* =========================================================
            TAB LOGIC: Show Agendas if selected, otherwise show Overview
            ========================================================= */}
        {activeTab === 'agendas' ? (
          
          /* --- THE NEW AGENDAS SCREEN --- */
          <section className="agendas-wrapper">
            <h2>Upcoming Group Agendas</h2>
            
            {loadingAgendas ? (
              <p>Loading your group's agendas from the database...</p>
            ) : agendaError ? (
              <p className="error-text" style={{color: 'red'}}>{agendaError}</p>
            ) : agendas.length === 0 ? (
              <p>No agendas have been posted for this group yet.</p>
            ) : (
              // Replaced <div> with <section> for the grid container
              <section className="agendas-grid">
                {/* Loop through real MongoDB data and draw the cards */}
                {agendas.map((meeting) => (
                  <article key={meeting._id} className="agenda-card stat-card" style={{marginTop: '20px', padding: '20px'}}>
                    <h3 style={{marginBottom: '5px'}}>{meeting.title}</h3>
                    <p style={{color: '#666', fontWeight: 'bold'}}>{meeting.date} at {meeting.time}</p>
                    <hr style={{margin: '15px 0', border: 'none', borderTop: '1px solid #eee'}}/>
                    
                    {/* Replaced <div> with <section> for the HTML content wrapper */}
                    <section 
                      className="agenda-content"
                      dangerouslySetInnerHTML={{ __html: meeting.agenda }} 
                    />
                  </article>
                ))}
              </section>
            )}
          </section>
          
        ) : (
          
          /* --- YOUR EXISTING OVERVIEW SCREEN --- */
          <>
            <section className="group-info">
              <h2>{dashboardData.groupName}</h2>
              <p>{dashboardData.groupDescription}</p>
            </section>
            
            <section className="stats-grid">
              <article className="stat-card">
                <h3 className="stat-title">Total Contributed</h3>
                <p className="stat-value">R{dashboardData.totalContributed.toLocaleString()}</p>
              </article>
              <article className="stat-card yellow">
                <h3 className="stat-title">Monthly Contribution</h3>
                <p className="stat-value">R{dashboardData.monthlyContribution}</p>
              </article>
              <article className="stat-card">
                <h3 className="stat-title">Next Contribution</h3>
                <p className="stat-value next-date">{dashboardData.nextContribution}</p>
              </article>
            </section>
            
            <section className="table-wrapper personal-info-wrapper">
              <h3>Personal Information</h3>
              <section className="personal-info">
                <p><strong>Name:</strong> {dashboardData.personalInfo.name}</p>
                <p><strong>Email:</strong> {dashboardData.personalInfo.email}</p>
                <p><strong>Phone:</strong> {dashboardData.personalInfo.phone}</p>
                <p><strong>Member ID:</strong> {dashboardData.personalInfo.memberId}</p>
                <p><strong>Join Date:</strong> {dashboardData.personalInfo.joinDate}</p>
              </section>
            </section>
            
            <section className="contribution-list">
              <h3>Contribution History</h3>
              <section className="contribution-header">
                <p>Date and Method</p>
                <p>Amount</p>
                <p>Status</p>
              </section>
              <section className="contributions-container">
                {dashboardData.contributions.map((contribution, index) => (
                  <article key={index} className="contribution-item">
                    <section className="contribution-date-section">
                      <p><strong>{contribution.date}</strong></p>
                      <p className="contribution-method">{contribution.method}</p>
                    </section>
                    <p className="contribution-amount">R{contribution.amount}</p>
                    <section>
                      <p className={`status-badge ${getStatusClass(contribution.status)}`}>
                        {contribution.status}
                      </p>
                    </section>
                  </article>
                ))}
              </section>
            </section>
            
            <section className="action-buttons">
              <button className="btn-primary" type="button">Make Contribution</button>
              <button className="btn-secondary" type="button">Download Statement</button>
            </section>
          </>
        )}
      </main>
    </section>
  );
};

export default MemberDashboard;