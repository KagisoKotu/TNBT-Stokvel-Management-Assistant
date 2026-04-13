import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import CreateGroup from './components/Creategroup'; 
import './App.css';
import { LoginPage } from './components/Login';

import AdminDashboard from './Dashboard/AdminDashboard'; 
//import TreasurerDashboard from './Dashboard/TreasurerDashboard'; 
import MemberDashboard from './Dashboard/MemberDashboard';

function App() {
  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = '/';
  };

  // Retrieves user from session storage after login
  const user = JSON.parse(sessionStorage.getItem('user'));

  return (
    <Router>
      <main className="app-root">
        <Routes>
          <Route path="/" element={<LoginPage />} /> 
          <Route path="/home" element={<Home />} />
          <Route path="/create-group" element={<CreateGroup />} />
          
          {}
           <Route 
            path="/admin-dashboard/:groupId" 
              element={<AdminDashboard user={user} onLogout={handleLogout} />} 
          />
        //  <Route 
          //  path="/treasurer-dashboard/:groupId" 
         //   element={<TreasurerDashboard user={user} onLogout={handleLogout} />} 
          />
          <Route 
            path="/member-dashboard/:groupId" 
              element={<MemberDashboard user={user} onLogout={handleLogout} />} 
          />
        </Routes>
      </main>
    </Router>
  );
}

export default App;