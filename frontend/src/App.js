import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import CreateGroup from './components/Creategroup'; // 1. Import the new component
import ProtectedRoute from './components/ProtectedRoute'; // <-- NEW: Import the wrapper
import './App.css';
import { Login } from './components/Login';

function App() {
  return (
    <Router>
      {/* Semantic main container */}
      <main className="app-root">
        <Routes>
          <Route path="/" element={<Login />} />
<<<<<<< HEAD
          
          <Route 
            path="/home" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />
=======
          <Route path="/home" element={<Home />} />
>>>>>>> 639d93be84d9fac038ab24959affbea55184070d
          
          {/* 2. Define the path for your Create Group form */}
          <Route 
            path="/create-group" 
            element={
              <ProtectedRoute>
                <CreateGroup />
              </ProtectedRoute>
            } 
          />
          
          {/* Future routes like /search or /wallet will go here */}
        </Routes>
      </main>
    </Router>
  );
}

export default App;