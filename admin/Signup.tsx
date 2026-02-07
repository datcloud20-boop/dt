import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signUpUser, signInWithGoogle } from '../services/supabase';

const Signup: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signUpUser(email.trim(), password, fullName);
      setSuccess(true);
    } catch (err: any) {
      if (err.message?.includes('rate limit')) {
        setError('EMAIL RATE LIMIT EXCEEDED. Please try again later or contact support.');
      } else {
        setError(err.message || 'Failed to create account.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError('');
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Google registration failed.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-red-600/10 via-transparent to-gray-900/20 pointer-events-none" />
      
      <div className="w-full max-w-lg relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-black font-heading mb-4 inline-block text-white">
            DAT<span className="text-red-500">CLOUDE</span>
          </Link>
          <p className="text-gray-500 font-bold tracking-widest uppercase text-[10px] mb-4">
            New Member Registration
          </p>
        </div>

        <div className="bg-[#0d0d0d]/80 backdrop-blur-2xl p-10 md:p-12 rounded-[3.5rem] border border-gray-800/40 shadow-[0_20px_100px_rgba(0,0,0,0.7)]">
          {success ? (
            <div className="text-center py-10">
              <div className="w-24 h-24 bg-green-600/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(34,197,94,0.1)]">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-black font-heading text-white uppercase mb-4 tracking-tighter">Account Created</h2>
              <p className="text-gray-400 text-sm font-medium mb-8 leading-relaxed">
                Registration successful! <br/>Your account has been initialized. You can now proceed to access the system.
              </p>
              <Link to="/login" className="inline-block px-12 py-5 bg-red-600 rounded-2xl font-black text-xs uppercase tracking-widest text-white hover:bg-red-700 transition-all shadow-xl shadow-red-900/20">
                PROCEED TO LOGIN
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              <form onSubmit={handleSignup} className="space-y-7">
                {error && (
                  <div className="p-6 bg-red-600/10 border border-red-600/30 rounded-2xl text-red-500 text-[10px] font-black text-center uppercase tracking-widest leading-relaxed mb-6">
                    {error}
                  </div>
                )}
                
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 ml-1">Your Name</label>
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full bg-black border border-gray-800/60 rounded-2xl p-6 focus:ring-1 focus:ring-red-600 outline-none transition-all text-sm font-medium text-white placeholder:text-gray-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 ml-1">Email Address</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="datcloud20@gmail.com"
                    className="w-full bg-black border border-gray-800/60 rounded-2xl p-6 focus:ring-1 focus:ring-red-600 outline-none transition-all text-sm font-medium text-white placeholder:text-gray-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 ml-1">Create Secret Key</label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••••••"
                    className="w-full bg-black border border-gray-800/60 rounded-2xl p-6 focus:ring-1 focus:ring-red-600 outline-none transition-all text-sm font-medium text-white placeholder:text-gray-800"
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-6 bg-red-600 rounded-[2rem] font-black text-lg hover:bg-red-700 transition-all shadow-xl shadow-red-900/30 active:scale-[0.98] disabled:opacity-50 uppercase tracking-tighter text-white"
                >
                  {loading ? 'INITIALIZING...' : 'CREATE ACCOUNT'}
                </button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-800"></div></div>
                <div className="relative flex justify-center text-[9px] font-black uppercase tracking-[0.4em]"><span className="bg-[#0d0d0d] px-6 text-gray-600">OR JOIN WITH</span></div>
              </div>

              <button 
                onClick={handleGoogleSignup}
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
                  <Link to="/login" className="hover:text-red-400 transition-colors">Already have an account? Login</Link>
                </p>
                <Link to="/" className="inline-block text-[10px] font-bold text-gray-700 hover:text-white transition-colors uppercase tracking-[0.2em] mt-2">← Back to Headquarters</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;