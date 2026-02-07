import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { signOutUser, supabase } from '../services/supabase';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        localStorage.removeItem('csp_admin');
        localStorage.removeItem('csp_user');
        navigate('/login');
        return;
      }

      const isAdmin = session.user.email?.toLowerCase() === 'datcloud20@gmail.com';
      
      if (!isAdmin) {
        console.warn('Access denied: User is not the authorized administrator.');
        localStorage.setItem('csp_admin', 'false');
        navigate('/');
      } else {
        localStorage.setItem('csp_admin', 'true');
        setIsVerifying(false);
      }
    };

    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session || session.user.email?.toLowerCase() !== 'datcloud20@gmail.com') {
        localStorage.removeItem('csp_admin');
        navigate('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOutUser();
      localStorage.removeItem('csp_admin');
      localStorage.removeItem('csp_user');
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
      localStorage.removeItem('csp_admin');
      localStorage.removeItem('csp_user');
      navigate('/');
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[10px] font-black tracking-[0.3em] text-gray-500 uppercase">Verifying Authorization</p>
      </div>
    );
  }

  const navItems = [
    { label: 'DASHBOARD', path: '/admin/dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { label: 'PROJECTS', path: '/admin/projects', icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4' },
    { label: 'MESSAGES', path: '/admin/messages', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2z' },
    { label: 'SETTINGS', path: '/admin/settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
  ];

  return (
    <div className="flex min-h-screen bg-[#050505] overflow-x-hidden">
      {/* Mobile Nav Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-black border-b border-gray-900 z-50 flex items-center justify-between px-6">
        <span className="text-lg font-bold font-heading uppercase text-white">DAT<span className="text-red-500">CLOUDE</span></span>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-white p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isSidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path></svg>
        </button>
      </div>

      {/* Sidebar Drawer */}
      <aside className={`w-72 bg-[#0a0a0a] border-r border-gray-900 p-8 flex flex-col fixed inset-y-0 z-[60] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-12">
          <span className="text-xl font-bold font-heading uppercase text-white">DAT<span className="text-red-500">CLOUDE</span></span>
          <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.3em] mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map(item => (
            <Link 
              key={item.label}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center px-6 py-4 rounded-2xl text-sm font-bold transition-all ${location.pathname === item.path ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' : 'text-gray-500 hover:text-white hover:bg-gray-900'}`}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon}></path></svg>
              {item.label}
            </Link>
          ))}
        </nav>

        <button 
          onClick={handleLogout}
          className="mt-auto flex items-center px-6 py-4 rounded-2xl text-sm font-bold text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-all"
        >
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          LOGOUT
        </button>
      </aside>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[50] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <main className="flex-1 lg:ml-72 p-6 md:p-12 pt-24 lg:pt-12 min-w-0">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;