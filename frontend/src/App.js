import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import CreateGroup from './components/Creategroup'; 
import './App.css';
import { LoginPage } from './components/Login';
import { SignUp } from './components/SignUp';
import { PostAgenda } from './components/PostAgendas';

import AdminDashboard from './Dashboard/AdminDashboard'; 
import TreasurerDashboard from './Dashboard/TreasurerDashboard'; 
import MemberDashboard from './Dashboard/MemberDashboard';
import MeetingManagerDashboard from './Dashboard/MeetingManagerDashboard';
import ScheduleMeeting from './Dashboard/ScheduleMeeting';
import PostAgendas from './Dashboard/PostAgendas'; 

function App() {
  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = '/';
  };

  const user = JSON.parse(sessionStorage.getItem('user'));

  return (
    <Router>
      <main className="app-root">
        <Routes>
          {/* Auth Routes */}
          <Route path="/" element={<LoginPage />} /> 
          <Route path="/signup" element={<SignUp />} />
          
          {/* App Routes */}
          <Route path="/home" element={<Home />} />
          <Route path="/create-group" element={<CreateGroup />} />
          
          {/* Navigation Target */}
          <Route path="/meeting-manager/:groupId" element={<MeetingManagerDashboard />} />
          <Route path="/schedule/:groupId" element={<ScheduleMeeting />} />
          
          {/* Dashboard Routes */}
          <Route 
            path="/admin-dashboard/:groupId" 
            element={<AdminDashboard user={user} onLogout={handleLogout} />} 
          />
          <Route 
            path="/treasurer-dashboard/:groupId" 
            element={<TreasurerDashboard user={user} onLogout={handleLogout} />} 
          />
          <Route 
            path="/member-dashboard/:groupId" 
            element={<MemberDashboard user={user} onLogout={handleLogout} />} 
          />

          {/* Post Agendas Route */}
          <Route 
            path="/post-agenda/:groupId"
            element={<PostAgendas />} 
          /> 
        </Routes>
      </main>
    </Router>
  );
}

export default App;