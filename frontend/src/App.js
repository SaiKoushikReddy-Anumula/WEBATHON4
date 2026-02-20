import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import CreateProject from './pages/CreateProject';
import ProjectDetails from './pages/ProjectDetails';
import Workspace from './pages/Workspace';
import MyProjects from './pages/MyProjects';
import SearchUsers from './pages/SearchUsers';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          
          <Route path="/profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />
          
          <Route path="/my-projects" element={
            <PrivateRoute>
              <MyProjects />
            </PrivateRoute>
          } />
          
          <Route path="/search-users" element={
            <PrivateRoute>
              <SearchUsers />
            </PrivateRoute>
          } />
          
          <Route path="/create-project" element={
            <PrivateRoute>
              <CreateProject />
            </PrivateRoute>
          } />
          
          <Route path="/projects/:id" element={
            <PrivateRoute>
              <ProjectDetails />
            </PrivateRoute>
          } />
          
          <Route path="/workspace/:id" element={
            <PrivateRoute>
              <Workspace />
            </PrivateRoute>
          } />
          
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
