import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { signOutUser, supabase } from '../services/supabase';
import { SiteConfig } from '../types';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [user, setUser] = useState<{name: string} | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Config Loading
    const fetchConfig = async () => {
      try {
        const data = await dataService.getConfig();
        setConfig(data);
      } catch (err) {
        console.error("Failed to load navbar config", err);
      }
    };
    fetchConfig();

    // Sync user state from Supabase session
    const syncUser = (session: any) => {
      if (session?.user) {
        const u = session.user;
        const name = u.user_metadata?.full_name || u.email?.split('@')[0].toUpperCase() || 'USER';
        setUser({ name });
      } else {
        setUser(null);
      }
    };

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      syncUser(session);
    });

    // Listen for auth changes (Login/Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      syncUser(session);
    });

    const configInterval = setInterval(fetchConfig, 15000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(configInterval);
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOutUser();
      localStorage.removeItem('csp_user');
      localStorage.removeItem('csp_admin');
      setUser(null);
      setMobileMenuOpen(false);
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const normalizedPath = location.pathname.toLowerCase();
  const isAuthPage = normalizedPath.includes('/login') || 
                     normalizedPath.includes('/signup') || 
                     normalizedPath.includes('/admin');
                     
  if (isAuthPage) return null;

  const logoImg = config ? dataService.transformDriveUrl(config.logoImageUrl || '') : '';
  const logoText = config?.logoText || 'DAT CLOUDE';
  const logoParts = (logoText || '').split(' ');
  const firstPart = logoParts[0] || 'DAT';
  const restPart = logoParts.slice(1).join(' ');
  const logoPosition = config?.logoPosition || 'left';
  const logoX = config?.logoX || 0;
  const logoY = config?.logoY || 0;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isScrolled ? 'bg-black/40 backdrop-blur-2xl py-3 border-b border-white/5 shadow-2xl' : 'bg-transparent py-6 md:py-8'}`}>
      <div className={`max-w-7xl mx-auto px-6 flex items-center transition-all duration-700 ${
        logoPosition === 'center' ? 'flex-row justify-between md:flex-row md:justify-center md:gap-10' : 
        logoPosition === 'right' ? 'flex-row-reverse justify-between' : 
        'flex-row justify-between'
      }`}>
        <Link 
          to="/" 
          className="flex items-center gap-2 group transition-all duration-500 hover:scale-105 active:scale-95 shrink-0"
          style={{ transform: `translate(${logoX}px, ${logoY}px)` }}
        >
          {logoImg ? (
            <img src={logoImg} alt={logoText} className="h-8 md:h-10 w-auto object-contain transition-all duration-500 group-hover:brightness-125" />
          ) : (
            <span className="text-xl md:text-2xl font-black font-heading tracking-tighter text-white uppercase whitespace-nowrap">
              {firstPart}<span className="text-red-500 group-hover:text-red-400 transition-colors">{restPart}</span>
            </span>
          )}
        </Link>

        {/* Desktop Links */}
        <div className={`hidden md:flex items-center gap-8 lg:gap-12 ${logoPosition === 'center' ? 'justify-center' : ''}`}>
          <Link to="/" className="text-[10px] font-black tracking-widest text-white/80 hover:text-white transition-all uppercase whitespace-nowrap">HOME</Link>
          <div className="relative group">
            <button className="text-[10px] font-black tracking-widest text-white/80 flex items-center hover:text-white transition-all uppercase whitespace-nowrap">
              SERVICES
              <svg className="w-3 h-3 ml-2 transition-transform duration-500 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-56 bg-[#0a0a0a]/95 backdrop-blur-2xl rounded-2xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-500 shadow-2xl border border-white/5">
              <Link to="/portfolio/Video Editing" className="block px-8 py-4 text-[10px] font-bold tracking-widest uppercase hover:bg-red-600 hover:text-white text-gray-400 transition-all">Video Editing</Link>
              <Link to="/portfolio/Thumbnail Design" className="block px-8 py-4 text-[10px] font-bold tracking-widest uppercase hover:bg-red-600 hover:text-white text-gray-400 transition-all">Thumbnail Design</Link>
              <Link to="/portfolio/Web Development" className="block px-8 py-4 text-[10px] font-bold tracking-widest uppercase hover:bg-red-600 hover:text-white text-gray-400 transition-all">Web Development</Link>
              <Link to="/portfolio/Merchandise Design" className="block px-8 py-4 text-[10px] font-bold tracking-widest uppercase hover:bg-red-600 hover:text-white text-gray-400 transition-all">Merchandise Design</Link>
              <Link to="/portfolio/Poster Design" className="block px-8 py-4 text-[10px] font-bold tracking-widest uppercase hover:bg-red-600 hover:text-white text-gray-400 transition-all">Poster Design</Link>
            </div>
          </div>
          <Link to="/hire" className="px-8 py-3 bg-[#ef4444] text-white rounded-full text-[10px] font-black tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-600/20 uppercase whitespace-nowrap">HIRE US</Link>
          
          {user ? (
            <div className="relative group">
              <button className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:text-white transition-all whitespace-nowrap">
                {user.name}
              </button>
              <div className="absolute top-full right-0 mt-4 w-40 bg-[#0a0a0a]/95 backdrop-blur-2xl rounded-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-500 shadow-2xl border border-white/5">
                <button onClick={handleLogout} className="w-full text-left px-6 py-4 text-[10px] font-black hover:bg-red-600 text-gray-400 hover:text-white transition-all uppercase">Logout</button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="text-[10px] text-white/40 hover:text-white uppercase tracking-widest font-black transition-all whitespace-nowrap">LOGIN</Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-white transition-transform duration-300 hover:scale-110 active:scale-90 shrink-0 p-1">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-black/98 backdrop-blur-3xl z-50 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden`}>
        <div className="p-8 flex flex-col h-full">
          <div className="flex justify-between items-center mb-12">
            <span className="text-xl font-black font-heading tracking-tighter uppercase">
               {firstPart}<span className="text-red-500">{restPart}</span>
            </span>
            <button onClick={() => setMobileMenuOpen(false)} className="p-2 transition-transform duration-300 hover:rotate-90 text-gray-400"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center gap-6">
            <Link onClick={() => setMobileMenuOpen(false)} to="/" className="text-3xl font-black font-heading uppercase transition-all hover:text-red-500">HOME</Link>
            <Link onClick={() => setMobileMenuOpen(false)} to="/portfolio/Video Editing" className="text-3xl font-black font-heading uppercase transition-all hover:text-red-500">VIDEO EDITING</Link>
            <Link onClick={() => setMobileMenuOpen(false)} to="/portfolio/Thumbnail Design" className="text-3xl font-black font-heading uppercase transition-all hover:text-red-500">THUMBNAILS</Link>
            <Link onClick={() => setMobileMenuOpen(false)} to="/portfolio/Web Development" className="text-3xl font-black font-heading uppercase transition-all hover:text-red-500">WEB DEV</Link>
            <Link onClick={() => setMobileMenuOpen(false)} to="/portfolio/Merchandise Design" className="text-3xl font-black font-heading uppercase transition-all hover:text-red-500">MERCHANDISE</Link>
            <Link onClick={() => setMobileMenuOpen(false)} to="/portfolio/Poster Design" className="text-3xl font-black font-heading uppercase transition-all hover:text-red-500">POSTERS</Link>
            
            <div className="h-px w-24 bg-white/10 my-4" />

            {user ? (
              <button onClick={handleLogout} className="text-2xl font-black font-heading text-red-500 uppercase transition-all">LOGOUT ({user.name})</button>
            ) : (
              <Link onClick={() => setMobileMenuOpen(false)} to="/login" className="text-3xl font-black font-heading uppercase text-white/40 transition-all">LOGIN</Link>
            )}
            
            <Link onClick={() => setMobileMenuOpen(false)} to="/hire" className="mt-8 px-12 py-5 bg-red-600 rounded-full text-xl font-black tracking-tighter uppercase shadow-2xl shadow-red-600/30 transition-transform active:scale-95">HIRE US</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;