import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { dataService } from '../services/dataService';

const Hire: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const fd = new FormData(e.currentTarget);
    const name = fd.get('name') as string;
    const email = fd.get('email') as string;
    const service = fd.get('service') as string;
    const message = fd.get('message') as string;

    try {
      // Send data to Supabase messages table
      await dataService.addMessage({
        name,
        email,
        service,
        content: message
      });

      setSubmitted(true);
    } catch (err: any) {
      console.error("Submission error:", err);
      const msg = err.message || '';
      
      if (msg.toLowerCase().includes('row-level security')) {
        setError("TRANSMISSION FAILED: NEW ROW VIOLATES ROW-LEVEL SECURITY POLICY FOR TABLE \"MESSAGES\". PLEASE RUN THE UPDATED SQL FIX IN YOUR SUPABASE DASHBOARD.");
      } else {
        setError("TRANSMISSION FAILED: " + msg.toUpperCase());
      }
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-6 text-center">
        <div className="max-w-md reveal-up">
          <div className="w-24 h-24 bg-red-600/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(220,38,38,0.2)]">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h1 className="text-4xl font-black font-heading mb-4 uppercase tracking-tighter text-white">MISSION LOGGED</h1>
          <p className="text-gray-400 mb-10 leading-relaxed font-medium">
            Your project brief has been successfully saved to the server. Our team will review your objectives and reach out shortly.
          </p>
          <Link to="/" className="inline-block px-12 py-5 bg-red-600 rounded-2xl font-black text-xs tracking-widest hover:bg-red-700 transition-all text-white uppercase shadow-xl shadow-red-900/20 active:scale-95">
            RETURN TO BASE
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-40 pb-24 px-6 relative overflow-hidden bg-[#0a0a0a]">
      {/* Background Decor - Blue/Red Glows from screenshot */}
      <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-blue-900/10 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute top-[10%] right-[-5%] w-[500px] h-[500px] bg-red-900/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-4xl mx-auto relative z-10">
        <header className="text-center mb-10 reveal-up">
          <p className="text-gray-500 max-w-xl mx-auto leading-relaxed font-bold text-xs uppercase tracking-[0.2em] opacity-60">
            WE'RE CURRENTLY ACCEPTING HIGH-IMPACT PROJECTS. FILL OUT THE DETAILS BELOW AND WE'LL HANDLE THE REST.
          </p>
        </header>

        <div className="bg-[#080808] backdrop-blur-3xl p-8 md:p-14 rounded-[3.5rem] border border-gray-900 shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] reveal-up stagger-1 ring-1 ring-white/5">
          {/* Logo Branding - Top Left (Matching screenshot) */}
          <div className="mb-14 flex items-center gap-3">
             <div className="text-2xl font-black font-heading tracking-tighter text-white uppercase">
              DAT<span className="text-red-600">CLOUDE</span>
            </div>
          </div>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10" onSubmit={handleSubmit}>
            {error && (
              <div className="md:col-span-2 p-6 bg-red-600/10 border border-red-600/30 rounded-2xl text-red-500 text-[10px] font-black text-center uppercase tracking-widest leading-relaxed mb-6">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <label className="text-[11px] font-black text-gray-600 uppercase tracking-[0.2em] ml-2">Your Name</label>
              <input 
                required
                name="name"
                type="text" 
                placeholder="Name" 
                className="w-full bg-black border border-gray-900/60 rounded-xl p-5 focus:ring-1 focus:ring-red-600 outline-none transition-all text-sm font-bold text-white placeholder:text-gray-800"
              />
            </div>
            
            <div className="space-y-4">
              <label className="text-[11px] font-black text-gray-600 uppercase tracking-[0.2em] ml-2">Email Address</label>
              <input 
                required
                name="email"
                type="email" 
                placeholder="Email Address" 
                className="w-full bg-black border border-gray-900/60 rounded-xl p-5 focus:ring-1 focus:ring-red-600 outline-none transition-all text-sm font-bold text-white placeholder:text-gray-800"
              />
            </div>

            <div className="md:col-span-2 space-y-4">
              <label className="text-[11px] font-black text-gray-600 uppercase tracking-[0.2em] ml-2">Select Primary Service</label>
              <div className="relative">
                <select 
                  name="service"
                  className="w-full bg-black border border-gray-900/60 rounded-xl p-5 focus:ring-1 focus:ring-red-600 outline-none transition-all text-sm font-black appearance-none text-white cursor-pointer"
                >
                  <option>Video Editing</option>
                  <option>Thumbnail Design</option>
                  <option>Web Development</option>
                  <option>Merchandise Design</option>
                  <option>Poster Design</option>
                  <option>Custom Project</option>
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 space-y-4">
              <label className="text-[11px] font-black text-gray-600 uppercase tracking-[0.2em] ml-2">Project Brief</label>
              <textarea 
                required
                name="message"
                rows={6} 
                placeholder="Details..." 
                className="w-full bg-black border border-gray-900/60 rounded-2xl p-6 focus:ring-1 focus:ring-red-600 outline-none transition-all text-sm font-bold resize-none text-white placeholder:text-gray-800 shadow-inner"
              />
            </div>

            <div className="md:col-span-2 pt-6">
              <button 
                type="submit" 
                disabled={loading}
                className="group relative w-full py-7 bg-[#ef4444] rounded-2xl font-black text-xl hover:bg-red-700 transition-all shadow-[0_15px_40px_rgba(239,68,68,0.4)] active:scale-[0.98] uppercase tracking-tighter text-white disabled:opacity-50"
              >
                <span className="relative z-10 flex items-center justify-center gap-4">
                  {loading ? 'INITIALIZING...' : 'INITIALIZE PROJECT'}
                  {!loading && (
                    <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  )}
                </span>
              </button>
              <p className="text-center text-[10px] font-bold text-gray-800 uppercase tracking-[0.2em] mt-12 opacity-60">
                BY CLICKING, YOU AGREE TO START A CREATIVE TRANSMISSION WITH OUR HEADQUARTERS.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Hire;