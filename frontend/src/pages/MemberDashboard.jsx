import React, { useState, useEffect } from 'react';
import '../styles/dashboard.css';

const MemberDashboard = ({ user, onLogout }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
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
  
  const getStatusClass = (status) => {
    if (status === 'Paid') return 'status-paid';
    return 'status-pending';
  };
  
  if (loading) {
    return <main className="loading">Loading your dashboard...</main>;
  }
  
  return (
    <section className="dashboard">
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
            <li className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
              Profile
            </li>
          </ul>
        </nav>
      </aside>
      
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
          <button className="btn-primary" type="button">
            Make Contribution
          </button>
          <button className="btn-secondary" type="button">
            Download Statement
          </button>
        </section>
      </main>
    </section>
  );
};

export default MemberDashboard;
