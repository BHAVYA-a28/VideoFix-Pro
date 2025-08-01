import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PluginManager from './pages/PluginManager';
import SoftwareDownload from './pages/SoftwareDownload';
import ProjectManager from './pages/ProjectManager';
import MediaLibrary from './pages/MediaLibrary';
import RenderQueue from './pages/RenderQueue';
import SystemDiagnostics from './pages/SystemDiagnostics';
import FirebaseExample from './components/FirebaseExample';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/plugins" element={<PluginManager />} />
              <Route path="/software" element={<SoftwareDownload />} />
              <Route path="/projects/new" element={<ProjectManager />} />
              <Route path="/media" element={<MediaLibrary />} />
              <Route path="/render" element={<RenderQueue />} />
              <Route path="/diagnostics" element={<SystemDiagnostics />} />
              <Route path="/firebase" element={<FirebaseExample />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;