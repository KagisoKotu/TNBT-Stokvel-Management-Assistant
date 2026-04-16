import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

const AdminDashboard = ({ user, onLogout }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  useEffect(() => {
    const mockData = {
      totalMembers: 8,
      totalContributions: 12500,
      monthlyContribution: 4000,
      pendingAmount: 500,
      pendingRequests: 3,
      members: [
        { id: 1, name: 'John Doe', email: 'john@stokvel.com', phone: '+27 123 456 789', joinDate: '15 Jan 2026', status: 'Paid', amount: 500 },
        { id: 2, name: 'Jane Smith', email: 'jane@stokvel.com', phone: '+27 123 456 788', joinDate: '20 Jan 2026', status: 'Paid', amount: 500 },
        { id: 3, name: 'Mike Johnson', email: 'mike@stokvel.com', phone: '+27 123 456 787', joinDate: '1 Feb 2026', status: 'Pending', amount: 500 },
        { id: 4, name: 'Sarah Williams', email: 'sarah@stokvel.com', phone: '+27 123 456 786', joinDate: '10 Feb 2026', status: 'Paid', amount: 500 },
        { id: 5, name: 'David Brown', email: 'david@stokvel.com', phone: '+27 123 456 785', joinDate: '15 Feb 2026', status: 'Late', amount: 500 }
      ]
    };
    
    setTimeout(() => {
      setDashboardData(mockData);
      setLoading(false);
    }, 500);
  }, []);
  
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('');
  };
  
  const getStatusClass = (status) => {
    if (status === 'Paid') return 'status-paid';
    if (status === 'Pending') return 'status-pending';
    return 'status-late';
  };
  
  if (loading) {
    return <main className="loading">Loading dashboard...</main>;
  }
  
  return (
    <section className="dashboard">
      <aside className="sidebar">
        <header className="logo">
          <section className="logo-icon">SS</section>
          <section className="logo-text">
            <h2>Stokvel <strong className="blue-text">Stokie</strong></h2>
            <p>Admin Portal</p>
          </section>
        </header>
        <nav>
          <ul className="nav-list">
            <li className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
              Dashboard
            </li>
            <li className={`nav-item ${activeTab === 'members' ? 'active' : ''}`} onClick={() => setActiveTab('members')}>
              Members
            </li>
            <li className={`nav-item ${activeTab === 'transactions' ? 'active' : ''}`} onClick={() => setActiveTab('transactions')}>
              Transactions
            </li>
            <li className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')}>
              Reports
            </li>
          </ul>
        </nav>
      </aside>
      
      <main className="main-content">
        <header className="header">
          <section className="header-title">
            <h1>Admin Dashboard</h1>
            <p>Manage your stokvel groups, approve members, and track contributions</p>
          </section>
          <section className="user-info">
            <section className="avatar">{user?.avatar || 'AD'}</section>
            <button className="btn-logout" type="button" onClick={onLogout}>
              Logout
            </button>
          </section>
        </header>
        
        {dashboardData.pendingRequests > 0 && (
          <section className="pending-alert">
            <p>
              <strong>{dashboardData.pendingRequests} pending join requests</strong> - Members are waiting for your approval
            </p>
            <button className="btn-view-requests" type="button">
              View Requests
            </button>
          </section>
        )}
        
        <section className="stats-grid">
          <article className="stat-card">
            <h3 className="stat-title">Total Members</h3>
            <p className="stat-value">{dashboardData.totalMembers}</p>
          </article>
          <article className="stat-card yellow">
            <h3 className="stat-title">Total Contributions</h3>
            <p className="stat-value">R{dashboardData.totalContributions.toLocaleString()}</p>
          </article>
          <article className="stat-card">
            <h3 className="stat-title">Monthly Collection</h3>
            <p className="stat-value">R{dashboardData.monthlyContribution.toLocaleString()}</p>
          </article>
          <article className="stat-card yellow">
            <h3 className="stat-title">Pending Amount</h3>
            <p className="stat-value">R{dashboardData.pendingAmount.toLocaleString()}</p>
          </article>
        </section>
        
        <section className="table-wrapper">
          <h3>Member Management</h3>
          <table className="modern-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Contact</th>
                <th>Join Date</th>
                <th>Monthly Contribution</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.members.map((member) => (
                <tr key={member.id}>
                  <td>
                    <section className="member-info">
                      <section className="member-avatar">{getInitials(member.name)}</section>
                      <section className="member-details">
                        <p><strong>{member.name}</strong></p>
                        <p className="member-id">ID: MEM-{String(member.id).padStart(3, '0')}</p>
                      </section>
                    </section>
                  </td>
                  <td>
                    <p>{member.email}</p>
                    <p className="member-phone">{member.phone}</p>
                  </td>
                  <td>{member.joinDate}</td>
                  <td>R{member.amount.toLocaleString()}</td>
                  <td>
                    <p className={`status-badge ${getStatusClass(member.status)}`}>
                      {member.status}
                    </p>
                  </td>
                  <td>
                    <button className="btn-action" type="button">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </section>
  );
};

export default AdminDashboard;