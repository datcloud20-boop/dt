import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInUser, signInWithGoogle, supabase } from '../services/supabase';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showFixGuide, setShowFixGuide] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        handleNavigation(session.user);
      }
    };
    checkSession();
  }, [navigate]);

  const handleNavigation = (user: any) => {
    const userEmail = user.email?.toLowerCase().trim() || '';
    const isAdmin = userEmail === 'datcloud20@gmail.com';
    
    localStorage.setItem('csp_admin', isAdmin ? 'true' : 'false');
    localStorage.setItem('csp_user', JSON.stringify({ 
      name: user.user_metadata?.full_name || user.email?.split('@')[0].toUpperCase() || 'USER', 
      email: user.email 
    }));

    if (isAdmin) navigate('/admin/dashboard');
    else navigate('/');
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShowFixGuide(false);
    setLoading(true);

    const targetEmail = email.trim().toLowerCase();

    try {
      const { user, error: authError } = await signInUser(targetEmail, password);
      if (authError) throw authError;
      if (user) {
        handleNavigation(user);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      const msg = err.message?.toLowerCase() || '';
      
      if (msg.includes('invalid login credentials')) {
        setError('AUTHENTICATION FAILED: INVALID EMAIL OR PASSWORD.');
        setShowFixGuide(true);
      } else if (msg.includes('email not confirmed')) {
        setError('CRITICAL: EMAIL NOT CONFIRMED. PLEASE CHECK YOUR INBOX OR MANUALLY CONFIRM VIA SQL EDITOR.');
        setShowFixGuide(true);
      } else if (msg.includes('rate limit')) {
        setError('SECURITY BLOCK: TOO MANY ATTEMPTS. PLEASE WAIT.');
      } else {
        setError(err.message?.toUpperCase() || 'SERVER REJECTED LOGIN ATTEMPT.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Identity provider communication failed.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-red-600/10 via-transparent to-gray-900/20 pointer-events-none" />
      
      <div className="w-full max-w-lg relative z-10 py-20">
        <div className="text-center mb-10">
          <Link to="/" className="text-4xl font-black font-heading mb-4 inline-block text-white uppercase tracking-tighter">
            DAT<span className="text-red-500">CLOUDE</span>
          </Link>
          <p className="text-gray-500 font-bold tracking-widest uppercase text-xs">
            Authentication Protocol
          </p>
        </div>

        <div className="bg-[#0d0d0d]/80 backdrop-blur-2xl p-10 md:p-12 rounded-[2.5rem] border border-gray-800/50 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <form onSubmit={handleAuth} className="space-y-6">
            {error && (
              <div className="p-8 bg-red-600/10 border border-red-600/30 rounded-3xl text-red-500 text-[11px] font-black text-center uppercase tracking-widest leading-relaxed">
                <div className="mb-3 text-sm flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                  SYSTEM ALERT
                </div>
                {error}
                
                {showFixGuide && (
                  <div className="mt-8 pt-8 border-t border-red-600/20 text-left space-y-6">
                    <p className="text-white text-xs font-black uppercase">TROUBLESHOOTING GUIDE:</p>
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0 font-black text-[10px]">1</div>
                        <p className="text-gray-400 text-[10px] leading-relaxed">
                          ENSURE YOU HAVE CREATED AN ACCOUNT IN THE <Link to="/signup" className="text-red-500 underline font-black hover:text-red-400">SIGNUP SECTION</Link> FIRST.
                        </p>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-6 h-6 rounded-full bg-gray-800 text-white flex items-center justify-center shrink-0 font-black text-[10px]">2</div>
                        <p className="text-gray-400 text-[10px] leading-relaxed">
                          GO TO SUPABASE DASHBOARD -> AUTH -> PROVIDERS -> EMAIL AND <strong>DISABLE "CONFIRM EMAIL"</strong>.
                        </p>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-6 h-6 rounded-full bg-gray-800 text-white flex items-center justify-center shrink-0 font-black text-[10px]">3</div>
                        <p className="text-gray-400 text-[10px] leading-relaxed">
                          OR RUN THIS SQL IN SUPABASE SQL EDITOR TO FORCE VERIFY:
                        </p>
                      </div>
                    </div>
                    <div className="bg-black p-5 rounded-2xl font-mono text-[10px] text-red-500 select-all border border-gray-800 leading-normal shadow-inner">
                      UPDATE auth.users <br/>
                      SET email_confirmed_at = now() <br/>
                      WHERE email = '{email || 'datcloud20@gmail.com'}';
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <div className="space-y-4">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="datcloud20@gmail.com"
                className="w-full bg-black border border-gray-800 rounded-2xl p-5 focus:ring-1 focus:ring-red-600 outline-none transition-all text-sm font-bold text-white placeholder:text-gray-800"
                required
              />
            </div>

            <div className="space-y-4">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-black border border-gray-800 rounded-2xl p-5 focus:ring-1 focus:ring-red-600 outline-none transition-all text-sm font-bold text-white placeholder:text-gray-800"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-6 bg-red-600 rounded-2xl font-black text-lg hover:bg-red-700 transition-all shadow-xl shadow-red-900/20 active:scale-[0.98] disabled:opacity-50 uppercase tracking-tighter text-white"
            >
              {loading ? 'AUTHENTICATING...' : 'ACCESS SYSTEM'}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-800"></div></div>
              <div className="relative flex justify-center text-[9px] font-black uppercase tracking-[0.4em]"><span className="bg-[#0d0d0d] px-6 text-gray-600">OR PROVIDER ACCESS</span></div>
            </div>

            <button 
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-5 bg-white text-black rounded-[2rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-gray-200 transition-all active:scale-[0.98] shadow-xl"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" />
              </svg>
              Google Identity
            </button>

            <div className="pt-4 text-center space-y-4">
              <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest">
                <Link to="/signup" className="hover:text-red-400 transition-colors">Don't have an account? Sign Up</Link>
              </p>
              <Link to="/" className="inline-block text-[10px] font-bold text-gray-700 hover:text-white transition-colors uppercase tracking-[0.2em] mt-2">← Back to Headquarters</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;