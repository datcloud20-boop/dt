import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from './AdminLayout';
import { dataService } from '../services/dataService';
import { Project, CategoryType } from '../types';
import { CATEGORIES } from '../constants';

const AdminProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');

  const thumbFileRef = useRef<HTMLInputElement>(null);
  const mediaFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await dataService.getProjects();
      setProjects(data);
    } catch (err) {
      console.error('Fetch projects error:', err);
    } finally {
      setLoading(false);
    }
  };

  const activeProject = editingId ? projects.find(p => p.id === editingId) : null;

  useEffect(() => {
    if (isModalOpen) {
      setThumbnailUrl(activeProject?.thumbnailUrl || '');
      setMediaUrl(activeProject?.mediaUrl || '');
    }
  }, [isModalOpen, activeProject]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: Omit<Project, 'id' | 'date'> = {
      title: (fd.get('title') || '') as string,
      description: (fd.get('description') || '') as string,
      category: (fd.get('category') || CATEGORIES[0]) as CategoryType,
      tags: (fd.get('tags')?.toString() || '').split(',').map(t => t.trim()).filter(Boolean),
      thumbnailUrl: thumbnailUrl,
      mediaUrl: mediaUrl,
      tools: (fd.get('tools')?.toString() || '').split(',').map(t => t.trim()).filter(Boolean),
      status: (fd.get('status') || 'Published') as 'Published' | 'Draft' | 'Featured',
      client: (fd.get('client') || '') as string,
      liveUrl: (fd.get('liveUrl') || '') as string,
      githubUrl: (fd.get('githubUrl') || '') as string,
    };

    try {
      if (editingId) {
        await dataService.updateProject(editingId, data);
      } else {
        await dataService.addProject(data);
      }
      setIsModalOpen(false);
      setEditingId(null);
      fetchProjects();
    } catch (err) {
      alert('Error saving project');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await dataService.deleteProject(id);
        fetchProjects();
      } catch (err) {
        alert('Error deleting project');
      }
    }
  };

  const startEdit = (project: Project) => {
    setEditingId(project.id);
    setIsModalOpen(true);
  };

  if (loading) return (
    <AdminLayout>
      <div className="h-full flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 md:mb-12 gap-6">
        <div>
          <h1 className="text-4xl md:text-[5rem] font-black font-heading mb-2 uppercase tracking-tighter">PROJECTS</h1>
          <p className="text-gray-500 font-medium text-sm">Manage your masterpiece collection.</p>
        </div>
        <button 
          onClick={() => { setIsModalOpen(true); setEditingId(null); }}
          className="w-full md:w-auto px-8 py-4 bg-red-600 rounded-2xl font-bold hover:bg-red-700 transition-all flex items-center justify-center text-white"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          ADD PROJECT
        </button>
      </header>

      <div className="bg-gray-900/30 rounded-3xl border border-gray-800/60 overflow-hidden shadow-2xl backdrop-blur-sm">
        <div className="overflow-x-auto hide-scrollbar">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="bg-gray-900/50 border-b border-gray-800">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Project</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 text-center">Category</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 text-center">Status</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-900">
              {projects.map(p => (
                <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center">
                      <img src={dataService.transformDriveUrl(p.thumbnailUrl)} className="w-16 h-10 md:w-20 md:h-12 rounded-xl object-cover mr-4 md:mr-6 border border-gray-800 shadow-lg group-hover:border-red-600/30 transition-colors" />
                      <div>
                        <p className="font-bold text-white text-sm md:text-base group-hover:text-red-500 transition-colors">{p.title}</p>
                        <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest">{new Date(p.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-xs md:text-sm font-bold text-gray-400 text-center uppercase tracking-tight">{p.category}</td>
                  <td className="px-8 py-6 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-[0.1em] border ${p.status === 'Featured' ? 'bg-red-600/10 text-red-500 border-red-600/20' : p.status === 'Published' ? 'bg-green-600/10 text-green-500 border-green-600/20' : 'bg-gray-600/10 text-gray-500 border-gray-600/20'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-end space-x-2 md:space-x-3">
                      <button onClick={() => startEdit(p)} className="p-2.5 md:p-3 bg-gray-900/50 rounded-xl hover:bg-white hover:text-black transition-all border border-gray-800 text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="p-2.5 md:p-3 bg-gray-900/50 rounded-xl hover:bg-red-600 hover:text-white transition-all border border-gray-800 text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 md:p-6 overflow-hidden">
          <div className="bg-[#0b0c10] border border-blue-900/20 rounded-[2.5rem] md:rounded-[3rem] w-full max-w-4xl h-full md:h-auto md:max-h-[90vh] overflow-y-auto hide-scrollbar shadow-[0_0_100px_rgba(37,99,235,0.05)]">
            <div className="p-8 md:p-12">
              <div className="flex justify-between items-center mb-10 md:mb-12">
                <h2 className="text-3xl md:text-4xl font-black font-heading uppercase text-white tracking-tighter">{editingId ? 'Edit Project' : 'New Project'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 flex items-center justify-center bg-gray-900 rounded-full hover:bg-red-600 transition-all text-white border border-gray-800">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8 md:space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 md:gap-y-10">
                  <div className="space-y-8 md:space-y-10">
                    <div className="group">
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 ml-1">Title</label>
                      <input name="title" required defaultValue={activeProject?.title} className="w-full bg-black border border-gray-800 rounded-2xl p-5 focus:ring-1 focus:ring-blue-600 outline-none transition-all text-white placeholder:text-gray-800" placeholder="Project Name" />
                    </div>
                    
                    <div className="group">
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 ml-1">Category</label>
                      <select name="category" required defaultValue={activeProject?.category} className="w-full bg-black border border-gray-800 rounded-2xl p-5 focus:ring-1 focus:ring-blue-600 outline-none transition-all text-white">
                        {CATEGORIES.map(c => <option key={c} value={c} className="bg-black">{c}</option>)}
                      </select>
                    </div>

                    <div className="group">
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 ml-1">Tags</label>
                      <input name="tags" placeholder="YouTube, Gaming" defaultValue={activeProject?.tags.join(', ')} className="w-full bg-black border border-gray-800 rounded-2xl p-5 focus:ring-1 focus:ring-blue-600 outline-none transition-all text-white placeholder:text-gray-800" />
                    </div>
                  </div>

                  <div className="space-y-8 md:space-y-10">
                    <div className="group">
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 ml-1">Thumbnail URL</label>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <input value={thumbnailUrl} onChange={e => setThumbnailUrl(e.target.value)} className="flex-1 bg-black border border-gray-800 rounded-2xl p-5 focus:ring-1 focus:ring-blue-600 outline-none transition-all text-white placeholder:text-gray-800" placeholder="Drive or Image URL" />
                        <button type="button" onClick={() => thumbFileRef.current?.click()} className="px-6 py-4 sm:py-0 bg-gray-900 border border-gray-800 rounded-2xl hover:bg-white hover:text-black transition-all text-[10px] font-black uppercase tracking-widest shrink-0">UPLOAD</button>
                        <input type="file" ref={thumbFileRef} className="hidden" onChange={(e) => handleFileUpload(e, setThumbnailUrl)} accept="image/*" />
                      </div>
                    </div>

                    <div className="group">
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 ml-1">Media URL</label>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <input value={mediaUrl} onChange={e => setMediaUrl(e.target.value)} className="flex-1 bg-black border border-gray-800 rounded-2xl p-5 focus:ring-1 focus:ring-blue-600 outline-none transition-all text-white placeholder:text-gray-800" placeholder="Video or Asset URL" />
                        <button type="button" onClick={() => mediaFileRef.current?.click()} className="px-6 py-4 sm:py-0 bg-gray-900 border border-gray-800 rounded-2xl hover:bg-white hover:text-black transition-all text-[10px] font-black uppercase tracking-widest shrink-0">UPLOAD</button>
                        <input type="file" ref={mediaFileRef} className="hidden" onChange={(e) => handleFileUpload(e, setMediaUrl)} accept="video/*,image/*" />
                      </div>
                    </div>

                    <div className="group">
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 ml-1">Tools Used</label>
                      <input name="tools" placeholder="Premiere Pro, AE" defaultValue={activeProject?.tools.join(', ')} className="w-full bg-black border border-gray-800 rounded-2xl p-5 focus:ring-1 focus:ring-blue-600 outline-none transition-all text-white placeholder:text-gray-800" />
                    </div>
                  </div>
                </div>

                <div className="group">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 ml-1">Description / Brief</label>
                  <textarea name="description" required defaultValue={activeProject?.description} rows={4} className="w-full bg-black border border-gray-800 rounded-3xl p-6 focus:ring-1 focus:ring-blue-600 outline-none transition-all text-white resize-none" placeholder="The mission objectives..."></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 pt-2">
                  <div className="group">
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 ml-1">Live URL (For Websites)</label>
                    <input name="liveUrl" defaultValue={activeProject?.liveUrl} className="w-full bg-black border border-gray-800 rounded-2xl p-5 focus:ring-1 focus:ring-blue-600 outline-none transition-all text-white placeholder:text-gray-800" placeholder="https://..." />
                  </div>
                  <div className="group">
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 ml-1">GitHub URL</label>
                    <input name="githubUrl" defaultValue={activeProject?.githubUrl} className="w-full bg-black border border-gray-800 rounded-2xl p-5 focus:ring-1 focus:ring-blue-600 outline-none transition-all text-white placeholder:text-gray-800" placeholder="https://github.com/..." />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 ml-1">Launch Status</label>
                    <div className="flex gap-3">
                      {['Draft', 'Published', 'Featured'].map(s => (
                        <label key={s} className="flex-1 cursor-pointer">
                          <input type="radio" name="status" value={s} defaultChecked={activeProject?.status === s || (s === 'Published' && !editingId)} className="sr-only peer" />
                          <div className="text-center py-4 rounded-2xl border border-gray-800 bg-black peer-checked:bg-red-600 peer-checked:border-red-600 text-[9px] font-black uppercase tracking-widest transition-all peer-checked:text-white text-gray-600">
                            {s}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 ml-1">Client (Optional)</label>
                    <input name="client" defaultValue={activeProject?.client} className="w-full bg-black border border-gray-800 rounded-2xl p-4 md:p-5 focus:ring-1 focus:ring-blue-600 outline-none transition-all text-white" placeholder="Brand Name" />
                  </div>
                </div>

                <div className="pt-6 md:pt-10">
                  <button type="submit" className="w-full py-6 md:py-8 bg-red-600 rounded-[2rem] font-black text-lg md:text-xl hover:bg-red-700 transition-all shadow-[0_20px_60px_rgba(220,38,38,0.2)] uppercase tracking-tighter text-white active:scale-[0.98]">
                    {editingId ? 'Update Masterpiece' : 'Deploy Project'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminProjects;