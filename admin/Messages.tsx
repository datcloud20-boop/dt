
import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { dataService } from '../services/dataService';
import { Message } from '../types';

const AdminMessages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    refreshMessages();
  }, []);

  const refreshMessages = async () => {
    setLoading(true);
    try {
      const data = await dataService.getMessages();
      setMessages([...data]);
    } catch (err) {
      console.error('Error refreshing messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async (id: string) => {
    if (confirm('Move this transmission to archives?')) {
      try {
        await dataService.deleteMessage(id);
        refreshMessages();
      } catch (err) {
        console.error('Error archiving message:', err);
      }
    }
  };

  return (
    <AdminLayout>
      <header className="mb-14 relative">
        <h1 className="text-7xl md:text-[8rem] font-black font-heading leading-none text-white uppercase tracking-tighter opacity-90 mb-2">
          MESSAGES
        </h1>
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs ml-2">
          Project transmissions from potential clients.
        </p>
      </header>

      <div className="space-y-8">
        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-[10px] font-black tracking-[0.3em] text-gray-700 uppercase">Scanning Frequencies...</p>
          </div>
        ) : messages.length > 0 ? (
          messages.map(msg => (
            <div key={msg.id} className="bg-gray-900/30 backdrop-blur-sm p-8 md:p-12 rounded-[3.5rem] border border-gray-800/40 shadow-2xl hover:border-red-600/30 transition-all group reveal-up">
              <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-6">
                <div className="space-y-2">
                  <h3 className="text-4xl font-black font-heading text-white uppercase tracking-tighter group-hover:text-red-500 transition-colors">
                    {msg.name}
                  </h3>
                  <p className="text-gray-500 font-bold text-sm tracking-tight">{msg.email}</p>
                </div>
                <div className="flex flex-col md:items-end gap-3">
                  <span className="inline-block px-6 py-2 bg-red-600/10 text-red-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-600/20">
                    {msg.service || 'UNSPECIFIED'}
                  </span>
                  <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                    {new Date(msg.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                  </span>
                </div>
              </div>
              
              <div className="bg-black/60 p-10 rounded-[2.5rem] border border-gray-800/60 mb-8 shadow-inner">
                <p className="text-gray-300 leading-relaxed font-medium text-lg italic">
                  "{msg.content}"
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <a 
                  href={`mailto:${msg.email}`}
                  className="px-10 py-5 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-95 shadow-xl flex items-center gap-3"
                >
                  REPLY BY EMAIL
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </a>
                <button 
                  onClick={() => handleArchive(msg.id)}
                  className="px-10 py-5 bg-gray-900 border border-gray-800 rounded-2xl font-black text-[10px] uppercase tracking-widest text-gray-400 hover:text-red-500 hover:border-red-500/30 transition-all active:scale-95"
                >
                  ARCHIVE MISSION
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-40 bg-[#0d0d0d]/30 rounded-[3.5rem] border-2 border-dashed border-gray-800/50 flex flex-col items-center justify-center">
             <div className="w-24 h-24 bg-gray-900/50 rounded-full flex items-center justify-center mb-10 border border-gray-800/50 shadow-xl">
                <svg className="w-10 h-10 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2z"></path>
                </svg>
             </div>
             <p className="text-gray-600 font-black uppercase tracking-[0.3em] text-xs">
               No incoming transmissions yet.
             </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminMessages;
