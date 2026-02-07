
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import ProjectDetail from './pages/ProjectDetail';
import Hire from './pages/Hire';
import Login from './admin/Login';
import Signup from './admin/Signup';
import Dashboard from './admin/Dashboard';
import AdminProjects from './admin/Projects';
import AdminMessages from './admin/Messages';
import Settings from './admin/Settings';
import LoadingScreen from './components/LoadingScreen';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  const [isAppLoading, setIsAppLoading] = useState(true);

  if (isAppLoading) {
    return <LoadingScreen onFinished={() => setIsAppLoading(false)} />;
  }

  return (
    <HashRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-[#0a0a0a] text-gray-200">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portfolio/:category" element={<Portfolio />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="/hire" element={<Hire />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/projects" element={<AdminProjects />} />
          <Route path="/admin/messages" element={<AdminMessages />} />
          <Route path="/admin/settings" element={<Settings />} />
        </Routes>
        <ConditionalFooter />
      </div>
    </HashRouter>
  );
};

const ConditionalFooter = () => {
  const location = useLocation();
  const hiddenRoutes = ['/admin', '/login', '/signup', '/hire'];
  const isHidden = hiddenRoutes.some(route => location.pathname.startsWith(route));
  if (isHidden) return null;
  return <Footer />;
};

export default App;
