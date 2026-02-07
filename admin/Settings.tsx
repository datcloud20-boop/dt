import React, { useState, useRef, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { dataService } from '../services/dataService';
import { SiteConfig, Tool } from '../types';

const Settings: React.FC = () => {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form state for adding new tool
  const [newToolName, setNewToolName] = useState('');
  const [newToolIcon, setNewToolIcon] = useState('');

  const logoFileRef = useRef<HTMLInputElement>(null);
  const heroImgFileRef = useRef<HTMLInputElement>(null);
  const heroVidFileRef = useRef<HTMLInputElement>(null);
  const toolFileRef = useRef<HTMLInputElement>(null);
  const newToolFileRef = useRef<HTMLInputElement>(null);
  const [editingToolIndex, setEditingToolIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await dataService.getConfig();
        setConfig(data);
      } catch (err) {
        console.error('Config fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;
    
    try {
      await dataService.updateConfig(config);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      console.error('Update failed details:', err);
      alert(`Update Failed: ${err.message || 'Unknown Error'}. Check console (F12) for details.`);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof SiteConfig) => {
    const file = e.target.files?.[0];
    if (file && config) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setConfig({ ...config, [fieldName]: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleToolIconUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file && config) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedTools = [...(config.tools || [])];
        updatedTools[index] = { ...updatedTools[index], icon: reader.result as string };
        setConfig({ ...config, tools: updatedTools });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNewToolIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewToolIcon(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!config) return;
    const { name, value, type } = e.target as any;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setConfig(prev => {
        if (!prev) return prev;
        const parentData = (prev as any)[parent];
        return {
          ...prev,
          [parent]: {
            ...parentData,
            [child]: type === 'number' ? (parseFloat(value) || 0) : value
          }
        };
      });
    } else {
      setConfig(prev => {
        if (!prev) return prev;
        return { 
          ...prev, 
          [name]: type === 'number' ? (parseFloat(value) || 0) : value 
        };
      });
    }
  };

  const handleAddTool = () => {
    if (!newToolName || !newToolIcon || !config) return;
    const updatedTools = [...(config.tools || []), { name: newToolName, icon: newToolIcon }];
    setConfig({ ...config, tools: updatedTools });
    setNewToolName('');
    setNewToolIcon('');
  };

  const handleRemoveTool = (index: number) => {
    if (!config) return;
    const updatedTools = config.tools.filter((_, i) => i !== index);
    setConfig({ ...config, tools: updatedTools });
  };

  if (loading || !config) return (
    <AdminLayout>
      <div className="h-full flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <header className="mb-10 md:mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl md:text-[5rem] font-black font-heading mb-2 uppercase tracking-tighter">SETTINGS</h1>
          <p className="text-gray-500 font-medium text-sm">Control the global content and identity of your studio.</p>
        </div>
        {saved && (
          <div className="w-full md:w-auto bg-green-600/20 text-green-500 px-8 py-4 rounded-3xl font-black text-xs tracking-widest animate-pulse border border-green-600/30 text-center">
            CHANGES SAVED
          </div>
        )}
      </header>

      <form onSubmit={handleSubmit} className="space-y-10 md:space-y-12 max-w-5xl pb-20">
        {/* Brand & Identity */}
        <section className="bg-gray-900/30 p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border border-gray-800 shadow-2xl backdrop-blur-sm">
          <h2 className="text-xl md:text-2xl font-black font-heading mb-10 flex items-center uppercase tracking-tighter text-white">
            <span className="w-8 h-8 md:w-10 md:h-10 bg-red-600 rounded-xl md:rounded-2xl flex items-center justify-center mr-4 md:mr-6 text-xs md:text-sm italic shadow-lg shadow-red-900/40">B</span>
            Brand & Identity
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4 ml-1">Logo Text</label>
              <input 
                name="logoText"
                value={config.logoText}
                onChange={handleChange}
                className="w-full bg-black border border-gray-800 rounded-3xl p-5 md:p-6 focus:ring-1 focus:ring-red-600 outline-none transition-all font-bold text-base md:text-lg text-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4 ml-1">Header Logo Position</label>
              <select 
                name="logoPosition"
                value={config.logoPosition || 'left'}
                onChange={handleChange}
                className="w-full bg-black border border-gray-800 rounded-3xl p-5 md:p-6 focus:ring-1 focus:ring-red-600 outline-none transition-all font-bold text-base md:text-lg text-white appearance-none"
              >
                <option value="left" className="bg-black text-white">Left Aligned</option>
                <option value="center" className="bg-black text-white">Centered</option>
                <option value="right" className="bg-black text-white">Right Aligned</option>
              </select>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 bg-black/40 p-8 md:p-10 rounded-[2.5rem] border border-gray-800/50 md:col-span-2">
              <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Logo Horizontal Offset (X)</label>
                  <span className="text-xs font-black text-red-500">{config.logoX || 0}px</span>
                </div>
                <input 
                  type="range"
                  name="logoX"
                  min="-200"
                  max="200"
                  step="1"
                  value={config.logoX || 0}
                  onChange={handleChange}
                  className="w-full h-2 bg-gray-800 rounded-full appearance-none cursor-pointer accent-red-600"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Logo Vertical Offset (Y)</label>
                  <span className="text-xs font-black text-red-500">{config.logoY || 0}px</span>
                </div>
                <input 
                  type="range"
                  name="logoY"
                  min="-200"
                  max="200"
                  step="1"
                  value={config.logoY || 0}
                  onChange={handleChange}
                  className="w-full h-2 bg-gray-800 rounded-full appearance-none cursor-pointer accent-red-600"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4 ml-1">Logo Asset</label>
              <div className="flex flex-col sm:flex-row gap-4">
                <input 
                  name="logoImageUrl"
                  value={config.logoImageUrl || ''}
                  onChange={handleChange}
                  placeholder="Paste Drive Link..."
                  className="flex-1 bg-black border border-gray-800 rounded-3xl p-5 md:p-6 focus:ring-1 focus:ring-red-600 outline-none text-sm text-white"
                />
                <button type="button" onClick={() => logoFileRef.current?.click()} className="px-8 py-5 sm:py-0 bg-gray-900 rounded-3xl border border-gray-800 hover:bg-white hover:text-black transition-all text-[10px] font-black uppercase tracking-[0.2em] shrink-0">UPLOAD</button>
                <input type="file" ref={logoFileRef} className="hidden" onChange={(e) => handleFileUpload(e, 'logoImageUrl')} accept="image/*" />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4 ml-1">Footer Description</label>
              <textarea 
                name="footerDescription"
                value={config.footerDescription}
                onChange={handleChange}
                rows={2}
                className="w-full bg-black border border-gray-800 rounded-3xl p-5 md:p-6 focus:ring-1 focus:ring-red-600 outline-none resize-none font-medium leading-relaxed text-white text-sm"
              />
            </div>
          </div>
        </section>

        {/* Hero Content & Appearance */}
        <section className="bg-gray-900/30 p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border border-gray-800 shadow-2xl backdrop-blur-sm">
          <h2 className="text-xl md:text-2xl font-black font-heading mb-10 flex items-center uppercase tracking-tighter text-white">
            <span className="w-8 h-8 md:w-10 md:h-10 bg-red-600 rounded-xl md:rounded-2xl flex items-center justify-center mr-4 md:mr-6 text-xs md:text-sm italic shadow-lg shadow-red-900/40">H</span>
            Hero Content & Appearance
          </h2>
          <div className="space-y-8 md:space-y-10">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4 ml-1">Main Headline</label>
              <input 
                name="heroTitle"
                value={config.heroTitle}
                onChange={handleChange}
                className="w-full bg-black border border-gray-800 rounded-3xl p-5 md:p-6 focus:ring-1 focus:ring-red-600 outline-none font-heading text-xl md:text-2xl uppercase tracking-tighter text-white"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 bg-black/40 p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-gray-800/50">
              <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Headline Scale</label>
                  <span className="text-xs font-black text-red-500">{config.heroTitleSize}rem</span>
                </div>
                <input 
                  type="range"
                  name="heroTitleSize"
                  min="2"
                  max="12"
                  step="0.1"
                  value={config.heroTitleSize || 6.8}
                  onChange={handleChange}
                  className="w-full h-2 bg-gray-800 rounded-full appearance-none cursor-pointer accent-red-600"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Image Scale</label>
                  <span className="text-xs font-black text-red-500">{config.heroImageSize}%</span>
                </div>
                <input 
                  type="range"
                  name="heroImageSize"
                  min="30"
                  max="100"
                  step="1"
                  value={config.heroImageSize || 90}
                  onChange={handleChange}
                  className="w-full h-2 bg-gray-800 rounded-full appearance-none cursor-pointer accent-red-600"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Horizontal Offset</label>
                  <span className="text-xs font-black text-red-500">{config.heroImageX}px</span>
                </div>
                <input 
                  type="range"
                  name="heroImageX"
                  min="-200"
                  max="200"
                  step="1"
                  value={config.heroImageX || 0}
                  onChange={handleChange}
                  className="w-full h-2 bg-gray-800 rounded-full appearance-none cursor-pointer accent-red-600"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Vertical Offset</label>
                  <span className="text-xs font-black text-red-500">{config.heroImageY}px</span>
                </div>
                <input 
                  type="range"
                  name="heroImageY"
                  min="-200"
                  max="200"
                  step="1"
                  value={config.heroImageY || 0}
                  onChange={handleChange}
                  className="w-full h-2 bg-gray-800 rounded-full appearance-none cursor-pointer accent-red-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4 ml-1">Hero Sub-headline</label>
              <textarea 
                name="heroSubtitle"
                value={config.heroSubtitle}
                onChange={handleChange}
                rows={3}
                className="w-full bg-black border border-gray-800 rounded-3xl p-5 md:p-6 focus:ring-1 focus:ring-red-600 outline-none resize-none leading-relaxed font-medium text-white text-sm"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 items-start md:items-center bg-black/40 p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-gray-800/50">
              <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Video Opacity</label>
                  <span className="text-xs font-black text-red-500">{config.heroVideoOpacity}%</span>
                </div>
                <input 
                  type="range"
                  name="heroVideoOpacity"
                  min="0"
                  max="100"
                  step="1"
                  value={config.heroVideoOpacity || 100}
                  onChange={handleChange}
                  className="w-full h-2 bg-gray-800 rounded-full appearance-none cursor-pointer accent-red-600"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4 ml-1">Text Color</label>
                <div className="flex gap-3">
                  <input 
                    type="color"
                    name="heroTextColor"
                    value={config.heroTextColor || '#ffffff'}
                    onChange={handleChange}
                    className="w-12 h-12 md:w-14 md:h-14 bg-transparent border-none cursor-pointer rounded-2xl overflow-hidden shadow-lg"
                  />
                  <input 
                    type="text"
                    name="heroTextColor"
                    value={config.heroTextColor || '#ffffff'}
                    onChange={handleChange}
                    className="flex-1 bg-black border border-gray-800 rounded-2xl px-5 md:px-6 text-[10px] font-mono uppercase focus:ring-1 focus:ring-red-600 outline-none text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4 ml-1">Text Position</label>
                <select 
                  name="heroTextPosition"
                  value={config.heroTextPosition}
                  onChange={handleChange}
                  className="w-full bg-black border border-gray-800 rounded-2xl p-5 md:p-6 text-[10px] font-black uppercase tracking-[0.2em] focus:ring-1 focus:ring-red-600 outline-none text-white appearance-none"
                >
                  <option value="left" className="bg-black">Left Aligned</option>
                  <option value="center" className="bg-black">Centered</option>
                  <option value="right" className="bg-black">Right Aligned</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
               <div className="space-y-4">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1 ml-1">Hero Overlay Image</label>
                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <input 
                      name="heroImageUrl"
                      value={config.heroImageUrl}
                      onChange={handleChange}
                      placeholder="Image URL..."
                      className="w-full sm:flex-1 bg-black border border-gray-800 rounded-3xl p-5 md:p-6 text-sm outline-none focus:ring-1 focus:ring-red-600 text-white"
                    />
                    <div className="flex gap-4 w-full sm:w-auto">
                      <button type="button" onClick={() => heroImgFileRef.current?.click()} className="flex-1 sm:flex-none px-6 bg-gray-900 border border-gray-800 rounded-3xl hover:bg-white hover:text-black transition-all text-[10px] font-black uppercase tracking-[0.1em] py-5">UPLOAD</button>
                      {config.heroImageUrl && (
                        <div className="w-14 h-14 rounded-2xl border-2 border-gray-800 overflow-hidden shrink-0 bg-black shadow-xl">
                          <img src={dataService.transformDriveUrl(config.heroImageUrl)} className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                    <input type="file" ref={heroImgFileRef} className="hidden" onChange={(e) => handleFileUpload(e, 'heroImageUrl')} accept="image/*" />
                  </div>
               </div>
               <div className="space-y-4">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1 ml-1">Hero Background Video</label>
                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <input 
                      name="heroVideoUrl"
                      value={config.heroVideoUrl}
                      onChange={handleChange}
                      placeholder="Video URL..."
                      className="w-full sm:flex-1 bg-black border border-gray-800 rounded-3xl p-5 md:p-6 text-sm outline-none focus:ring-1 focus:ring-red-600 text-white"
                    />
                    <button type="button" onClick={() => heroVidFileRef.current?.click()} className="w-full sm:w-auto px-8 bg-gray-900 border border-gray-800 rounded-3xl hover:bg-white hover:text-black transition-all text-[10px] font-black uppercase tracking-[0.1em] py-5">UPLOAD</button>
                    <input type="file" ref={heroVidFileRef} className="hidden" onChange={(e) => handleFileUpload(e, 'heroVideoUrl')} accept="video/*" />
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* Performance Statistics Section */}
        <section className="bg-gray-900/30 p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border border-gray-800 shadow-2xl backdrop-blur-sm">
          <h2 className="text-xl md:text-2xl font-black font-heading mb-10 flex items-center uppercase tracking-tighter text-white">
            <span className="w-8 h-8 md:w-10 md:h-10 bg-red-600 rounded-xl md:rounded-2xl flex items-center justify-center mr-4 md:mr-6 text-xs md:text-sm italic shadow-lg shadow-red-900/40 text-white">P</span>
            Performance Statistics
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4 ml-1">Projects Completed</label>
              <input 
                type="number"
                name="stats.projects"
                value={config.stats.projects}
                onChange={handleChange}
                className="w-full bg-black border border-gray-800 rounded-3xl p-5 md:p-6 focus:ring-1 focus:ring-red-600 outline-none font-bold text-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4 ml-1">Happy Clients</label>
              <input 
                type="number"
                name="stats.clients"
                value={config.stats.clients}
                onChange={handleChange}
                className="w-full bg-black border border-gray-800 rounded-3xl p-5 md:p-6 focus:ring-1 focus:ring-red-600 outline-none font-bold text-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4 ml-1">Years of Experience</label>
              <input 
                type="number"
                name="stats.years"
                value={config.stats.years}
                onChange={handleChange}
                className="w-full bg-black border border-gray-800 rounded-3xl p-5 md:p-6 focus:ring-1 focus:ring-red-600 outline-none font-bold text-white"
              />
            </div>
          </div>
        </section>

        {/* Social Media Links */}
        <section className="bg-gray-900/30 p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border border-gray-800 shadow-2xl backdrop-blur-sm">
          <h2 className="text-xl md:text-2xl font-black font-heading mb-10 flex items-center uppercase tracking-tighter text-white">
            <span className="w-8 h-8 md:w-10 md:h-10 bg-red-600 rounded-xl md:rounded-2xl flex items-center justify-center mr-4 md:mr-6 text-xs md:text-sm italic shadow-lg shadow-red-900/40 text-white">S</span>
            Social Media Channels
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {Object.keys(config.socials).map((platform) => (
              <div key={platform}>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4 ml-1 capitalize">{platform}</label>
                <input 
                  name={`socials.${platform}`}
                  value={(config.socials as any)[platform] || ''}
                  onChange={handleChange}
                  placeholder={`Your ${platform} URL...`}
                  className="w-full bg-black border border-gray-800 rounded-3xl p-5 focus:ring-1 focus:ring-red-600 outline-none text-xs text-white"
                />
              </div>
            ))}
          </div>
        </section>

        <button 
          type="submit"
          className="w-full py-6 md:py-8 bg-red-600 rounded-[2rem] md:rounded-[2.5rem] font-black text-xl md:text-2xl hover:bg-red-700 transition-all shadow-[0_30px_100px_rgba(220,38,38,0.3)] active:scale-[0.98] uppercase tracking-tighter text-white"
        >
          UPDATE STUDIO IDENTITY
        </button>
      </form>
    </AdminLayout>
  );
};

export default Settings;