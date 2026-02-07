
import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import { dataService } from '../services/dataService';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../constants';
import { Project, Message } from '../types';

const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [p, m] = await Promise.all([
          dataService.getProjects(),
          dataService.getMessages()
        ]);
        setProjects(p);
        setMessages(m);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { label: 'Total Projects', value: projects.length, icon: 'bg-red-600' },
    { label: 'Messages', value: messages.length, icon: 'bg-blue-600' },
    { label: 'Featured', value: projects.filter(p => p.status === 'Featured').length, icon: 'bg-orange-600' },
    { label: 'Drafts', value: projects.filter(p => p.status === 'Draft').length, icon: 'bg-gray-600' }
  ];

  if (loading) return (
    <AdminLayout>
      <div className="h-full flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <header className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black font-heading mb-2">DASHBOARD</h1>
          <p className="text-gray-500">Welcome back, Commander. Here's your performance summary.</p>
        </div>
        <Link to="/admin/projects" className="px-6 py-3 bg-red-600/10 text-red-500 rounded-2xl font-bold text-sm hover:bg-red-600 hover:text-white transition-all">
          MANAGE ALL PROJECTS
        </Link>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        {stats.map(stat => (
          <div key={stat.label} className="bg-gray-900/50 p-8 rounded-3xl border border-gray-800">
            <div className={`w-12 h-12 ${stat.icon} rounded-2xl mb-4 flex items-center justify-center text-white font-bold`}>
               {stat.label.charAt(0)}
            </div>
            <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">{stat.label}</p>
            <p className="text-4xl font-black font-heading">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <section className="bg-gray-900/50 p-8 rounded-3xl border border-gray-800">
          <h3 className="text-xl font-bold mb-6">Recent Projects</h3>
          <div className="space-y-4">
            {projects.slice(0, 5).map(p => (
              <div key={p.id} className="flex items-center p-4 bg-black/50 rounded-2xl border border-gray-800">
                <img src={dataService.transformDriveUrl(p.thumbnailUrl)} className="w-12 h-12 rounded-xl object-cover mr-4" />
                <div className="flex-1">
                  <p className="font-bold text-sm">{p.title}</p>
                  <p className="text-xs text-gray-500">{p.category}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${p.status === 'Featured' ? 'bg-red-600/20 text-red-500' : p.status === 'Published' ? 'bg-green-600/20 text-green-500' : 'bg-gray-600/20 text-gray-500'}`}>
                  {p.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gray-900/50 p-8 rounded-3xl border border-gray-800">
          <h3 className="text-xl font-bold mb-6">Project Categories</h3>
          <div className="grid grid-cols-2 gap-4">
            {CATEGORIES.map(cat => {
              const count = projects.filter(p => p.category === cat).length;
              return (
                <Link to="/admin/projects" key={cat} className="p-6 bg-black/50 rounded-2xl border border-gray-800 hover:border-red-600 transition-all">
                  <p className="text-2xl font-black font-heading mb-1">{count}</p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{cat}</p>
                </Link>
              );
            })}
          </div>
        </section>
      </div>

      <section className="bg-gray-900/50 p-8 rounded-3xl border border-gray-800">
        <h3 className="text-xl font-bold mb-6">Latest Messages</h3>
        <div className="space-y-4">
          {messages.slice(0, 5).map(m => (
            <div key={m.id} className="p-4 bg-black/50 rounded-2xl border border-gray-800">
              <div className="flex justify-between mb-2">
                <p className="font-bold text-sm">{m.name}</p>
                <p className="text-[10px] text-gray-500">{new Date(m.date).toLocaleDateString()}</p>
              </div>
              <p className="text-xs text-gray-400 line-clamp-2">{m.content}</p>
            </div>
          ))}
          {messages.length === 0 && <p className="text-center py-10 text-gray-600 italic">No messages yet.</p>}
        </div>
      </section>
    </AdminLayout>
  );
};

export default Dashboard;
