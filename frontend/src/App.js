import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import CreateGroup from './components/Creategroup'; // 1. Import the new component
import './App.css';

function App() {
  return (
    <Router>
      {/* Semantic main container */}
      <main className="app-root">
        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* 2. Define the path for your Create Group form */}
          <Route path="/create-group" element={<CreateGroup />} />
          
          {/* Future routes like /search or /wallet will go here */}
        </Routes>
      </main>
    </Router>
  );
}

export default App;