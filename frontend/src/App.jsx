// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import CustomNavbar from './components/Common/Navbar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import PublicProfile from './components/Profile/PublicProfile';
import PrivateRoute from './components/Common/PrivateRoute';
import { isAuthenticated } from './utils/auth';

function App() {
  return (
    <Router>
      <div className="App">
        <CustomNavbar />
        <Container fluid>
          <Routes>
            <Route 
              path="/" 
              element={
                isAuthenticated() ? 
                <Navigate to="/dashboard" /> : 
                <Navigate to="/login" />
              } 
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } 
            />
            <Route path="/profile/:userId" element={<PublicProfile />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App;