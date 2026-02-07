// Added React import to provide React namespace for types like FC and ReactNode
import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { Project, SiteConfig } from '../types';
import { CATEGORIES } from '../constants';

const Home: React.FC = () => {
  const [featured, setFeatured] = useState<Project[]>([]);
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [counts, setCounts] = useState({ projects: 0, clients: 0, years: 0 });
  
  // Ref for intersection observer to trigger entrance animations
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [projectsData, configData] = await Promise.all([
          dataService.getFeaturedProjects(),
          dataService.getConfig()
        ]);
        setFeatured(projectsData);
        setConfig(configData);
      } catch (err) {
        console.error('Failed to load home data:', err);
      }
    };
    
    loadData();

    const configInterval = setInterval(async () => {
      const updatedConfig = await dataService.getConfig();
      setConfig(updatedConfig);
    }, 12000);

    return () => clearInterval(configInterval);
  }, []);

  useEffect(() => {
    if (!config) return;
    
    const statsInterval = setInterval(() => {
      setCounts(prev => ({
        projects: Math.min(prev.projects + 5, config.stats.projects),
        clients: Math.min(prev.clients + 2, config.stats.clients),
        years: Math.min(prev.years + 1, config.stats.years)
      }));
    }, 50);

    return () => clearInterval(statsInterval);
  }, [config?.stats]);

  if (!config) {
    return <div className="min-h-screen bg-black" />;
  }

  const heroImage = dataService.transformDriveUrl(config.heroImageUrl);
  const heroVideo = dataService.transformDriveUrl(config.heroVideoUrl);

  const specialtyDetails: Record<string, { description: string, icon: React.ReactNode }> = {
    'Video Editing': {
      description: 'High-quality cinematic edits, reels, and documentary style storytelling.',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )
    },
    'Thumbnail Design': {
      description: 'Conversion-focused thumbnails that drive CTR and engagement.',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      )
    },
    'Web Development': {
      description: 'Modern, responsive web applications built with the latest tech stack.',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      )
    },
    'Merchandise Design': {
      description: 'Exclusive studio merchandise, hoodies, and digital assets.',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      )
    },
    'Poster Design': {
      description: 'Impactful visual designs for events, marketing, and digital branding.',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    }
  };

  const alignmentClass = config.heroTextPosition === 'center' 
    ? 'text-center md:text-center md:mx-auto items-center' 
    : config.heroTextPosition === 'right' 
      ? 'text-center md:text-right md:ml-auto md:mr-0 items-end' 
      : 'text-center md:text-left md:mx-0 items-start';

  const buttonWrapperClass = config.heroTextPosition === 'center'
    ? 'justify-center'
    : config.heroTextPosition === 'right'
      ? 'justify-center md:justify-end'
      : 'justify-center md:justify-start';

  return (
    <div className="overflow-hidden">
      {/* Hero Section - Optimized for SVH height and centered fitting */}
      <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
        {/* Background Overlay & Media */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/30 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=2000"
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>

        {heroVideo && (
          <div className="absolute inset-0 z-0 overflow-hidden">
            <video
              autoPlay
              muted
              loop
              playsInline
              key={heroVideo}
              style={{ 
                opacity: (config.heroVideoOpacity ?? 100) / 100,
              }}
              className="absolute min-w-full min-h-full w-auto h-auto top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-cover"
            >
              <source src={heroVideo} type="video/mp4" />
            </video>
          </div>
        )}

        {/* Hero Content Grid */}
        <div className="max-w-[1400px] mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-30 w-full py-16 md:py-20">
          <div className={`flex flex-col ${alignmentClass} w-full reveal-up`}>
            <span className="inline-block py-1 px-4 bg-[#ef4444] text-white rounded-md text-[10px] font-black tracking-[0.25em] mb-4 md:mb-8 uppercase shadow-lg shadow-red-600/40">
              CREATIVE STUDIO & PRODUCTION
            </span>
            <h1 
              className="font-black font-heading mb-6 md:mb-10 uppercase tracking-tighter drop-shadow-2xl transition-all duration-700 hover:scale-[1.02]"
              style={{ 
                color: config.heroTextColor || '#ffffff',
                fontSize: `clamp(1.8rem, 12vw, ${config.heroTitleSize || 6.8}rem)`,
                lineHeight: '1.05'
              }}
            >
              {config.heroTitle || 'DESIGNING THE FUTURE OF DIGITAL EXPERIENCES.'}
            </h1>
            <p 
              className="text-base md:text-xl mb-8 md:mb-12 max-w-xl leading-relaxed font-medium transition-all"
              style={{ color: config.heroTextColor || '#ffffff', opacity: 0.85 }}
            >
              {config.heroSubtitle || 'We turn bold ideas into high-converting solutions.'}
            </p>
            <div className={`flex flex-wrap gap-4 md:gap-6 ${buttonWrapperClass} w-full`}>
              <Link to="/portfolio/Video Editing" className="flex-1 md:flex-none text-center px-8 md:px-12 py-4 md:py-5 bg-[#ef4444] rounded-full font-black text-[11px] tracking-widest hover:bg-red-700 transition-all hover:scale-105 active:scale-95 text-white shadow-2xl shadow-red-600/30 uppercase">
                PORTFOLIO
              </Link>
              <Link to="/hire" className="flex-1 md:flex-none text-center px-8 md:px-12 py-4 md:py-5 bg-white rounded-full font-black text-[11px] tracking-widest hover:bg-gray-100 transition-all text-black shadow-2xl uppercase hover:scale-105 active:scale-95">
                HIRE US
              </Link>
            </div>
          </div>
          
          <div className={`relative hidden md:flex items-center justify-center reveal-up stagger-1 ${config.heroTextPosition === 'right' ? 'order-first' : ''}`}>
             <div 
                className="relative group aspect-[4/5] perspective-1000"
                style={{ 
                    width: `${config.heroImageSize || 90}%`,
                    transform: `translate(${config.heroImageX || 0}px, ${config.heroImageY || 0}px)`
                }}
             >
               <div className="w-full h-full bg-[#1a1a1a] rounded-[4.5rem] overflow-hidden shadow-[0_60px_120px_rgba(0,0,0,0.6)] border border-white/10 transition-transform duration-1000 group-hover:rotate-0 -rotate-3 group-hover:scale-[1.03]">
                 <img 
                    src={heroImage || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200"} 
                    alt="Work showcase" 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
               </div>
               <div className="absolute -inset-10 border border-white/5 rounded-full -z-10 animate-spin-slow pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity duration-1000" />
             </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 md:py-24 bg-[#050505] border-y border-white/5 relative z-40">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="group reveal-up stagger-1">
            <div className="text-5xl md:text-7xl font-black font-heading text-[#ef4444] mb-2 group-hover:scale-110 transition-transform duration-500">{counts.projects}+</div>
            <div className="text-gray-500 uppercase tracking-[0.2em] font-black text-[10px]">Projects Completed</div>
          </div>
          <div className="group reveal-up stagger-2">
            <div className="text-5xl md:text-7xl font-black font-heading text-white mb-2 group-hover:scale-110 transition-transform duration-500">{counts.clients}+</div>
            <div className="text-gray-500 uppercase tracking-[0.2em] font-black text-[10px]">Happy Clients</div>
          </div>
          <div className="group reveal-up stagger-3">
            <div className="text-5xl md:text-7xl font-black font-heading text-[#ef4444] mb-2 group-hover:scale-110 transition-transform duration-500">{counts.years}</div>
            <div className="text-gray-500 uppercase tracking-[0.2em] font-black text-[10px]">Years of Experience</div>
          </div>
        </div>
      </section>

      {/* Specialty Section */}
      <section className="py-24 md:py-32 px-6 bg-[#0a0a0a] relative z-40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 md:mb-20 reveal-up">
            <h2 className="text-4xl md:text-9xl font-black font-heading mb-8 uppercase tracking-tighter leading-none">
              OUR <br className="md:hidden" /><span className="text-[#ef4444]">SPECIALTIES</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-base md:text-lg leading-relaxed font-medium">
              High-end digital solutions crafted with precision and creativity. 
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {CATEGORIES.map((category, idx) => (
              <Link 
                to={`/portfolio/${category}`} 
                key={category} 
                className={`group p-8 md:p-10 bg-[#0d0d0d] border border-white/5 rounded-[2.5rem] md:rounded-[3rem] transition-all duration-700 hover:border-[#ef4444]/30 hover:bg-[#111] hover:-translate-y-2 flex flex-col h-full shadow-2xl overflow-hidden reveal-up stagger-${idx + 1}`}
              >
                <div className="w-12 h-12 md:w-14 md:h-14 bg-gray-900 rounded-2xl flex items-center justify-center text-[#ef4444] mb-8 md:mb-10 border border-white/5 transition-all duration-500 group-hover:bg-[#ef4444] group-hover:text-white group-hover:scale-110 group-hover:rotate-6 shrink-0 shadow-lg">
                  {specialtyDetails[category]?.icon}
                </div>
                
                <h3 className="text-xl md:text-2xl font-black font-heading mb-4 md:mb-6 text-white uppercase tracking-tight leading-[1.1] break-words whitespace-normal group-hover:text-red-500 transition-colors duration-500">
                  {category}
                </h3>
                
                <p className="text-gray-500 text-xs md:text-sm leading-relaxed mb-8 md:mb-10 flex-grow font-medium group-hover:text-gray-300 transition-colors duration-500">
                  {specialtyDetails[category]?.description}
                </p>
                
                <div className="flex items-center text-gray-500 text-[9px] md:text-[10px] font-black uppercase tracking-widest group-hover:text-[#ef4444] transition-all duration-500 pt-6 border-t border-white/5">
                  DISCOVER MORE
                  <svg className="w-4 h-4 ml-3 transform group-hover:translate-x-3 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-20 md:py-24 border-y border-white/5 bg-[#050505] relative z-40">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-gray-600 font-black tracking-[0.3em] uppercase mb-12 md:mb-16 text-[9px] md:text-[10px] reveal-up">INDUSTRY STANDARD TOOLS</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-20">
            {(config.tools || []).map((tool, idx) => (
              <div key={tool.name} className={`flex flex-col items-center gap-4 md:gap-6 group reveal-up stagger-${(idx % 4) + 1}`}>
                <div className="w-16 h-16 md:w-20 md:h-20 bg-[#0d0d0d] rounded-2xl flex items-center justify-center border border-gray-800 shadow-xl group-hover:border-[#ef4444]/30 transition-all duration-500 group-hover:-translate-y-2 group-hover:rotate-3">
                  <img 
                    src={dataService.transformDriveUrl(tool.icon)} 
                    alt={tool.name} 
                    className="w-8 h-8 md:w-10 md:h-10 object-contain transition-transform duration-500 group-hover:scale-125" 
                  />
                </div>
                <span className="text-[9px] md:text-[10px] font-black text-gray-600 uppercase tracking-widest group-hover:text-white transition-colors duration-500">
                  {tool.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 md:py-32 bg-[#0d0d0d] relative overflow-hidden z-40">
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center reveal-up">
          <h2 className="text-4xl md:text-8xl font-black font-heading mb-8 md:mb-10 uppercase tracking-tighter hover:scale-[1.02] transition-transform duration-700 cursor-default">
            READY TO <span className="text-[#ef4444] italic">LAUNCH?</span>
          </h2>
          <p className="text-gray-400 mb-12 md:mb-14 text-lg md:text-xl font-medium max-w-xl mx-auto leading-relaxed">
            Select your path and start your journey with us today.
          </p>
          <Link 
            to="/hire"
            className="inline-block py-6 md:py-8 px-12 md:px-20 bg-[#ef4444] rounded-full font-black text-lg md:text-xl hover:bg-red-700 transition-all duration-500 shadow-[0_20px_50px_rgba(220,38,38,0.3)] active:scale-90 uppercase tracking-tighter text-white hover:scale-105"
          >
            HIRE US NOW
          </Link>
        </div>
      </section>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .perspective-1000 { perspective: 1000px; }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
      `}} />
    </div>
  );
};

export default Home;