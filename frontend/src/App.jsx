import React from 'react'
import { Route, Routes } from 'react-router';

import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import { AdminDashboard } from './pages/AdminDashboard';
import { TreasurerDashboard } from './pages/TreasurerDashboard';
import { MemberDashBoard } from './pages/MemberDashboard';

const App = () => {
  return <> <main data-theme="stokvel" className="min-h-screen bg-base-100 text-base-content">

    <button className="btn btn-secondary">bow hello</button>

    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/home" element={<HomePage /> } />
      <Route path="/admin/:id" element={<AdminDashboard />} />
      <Route path="/treasurer/:id" element={<TreasurerDashboard />} />
      <Route path="/member/:id" element={<MemberDashBoard />} />
    </Routes>
  </main> </>;
};

export default App;