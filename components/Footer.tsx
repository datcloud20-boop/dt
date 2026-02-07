
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { SiteConfig } from '../types';

const Footer: React.FC = () => {
  const [config, setConfig] = useState<SiteConfig | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await dataService.getConfig();
        setConfig(data);
      } catch (err) {
        console.error("Failed to load footer config", err);
      }
    };
    fetchConfig();

    const interval = setInterval(async () => {
      const updatedConfig = await dataService.getConfig();
      setConfig(updatedConfig);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!config) return null;

  const logoImg = dataService.transformDriveUrl(config.logoImageUrl || '');
  const logoText = config.logoText || 'STUDIO';
  const logoParts = logoText.split(' ');
  const firstPart = logoParts[0];
  const restPart = logoParts.slice(1).join(' ');

  return (
    <footer className="bg-[#050505] pt-24 pb-12 px-6 border-t border-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <Link to="/" className="inline-block mb-6">
              {logoImg ? (
                <img src={logoImg} alt={logoText} className="h-10 w-auto object-contain" />
              ) : (
                <h2 className="text-3xl font-bold font-heading uppercase text-white">
                  {firstPart}<span className="text-red-500">{restPart}</span>
                </h2>
              )}
            </Link>
            <p className="text-gray-400 max-w-sm mb-8 leading-relaxed">
              {config.footerDescription}
            </p>
            
            <div className="flex gap-4 mt-8">
              <a 
                href={config.socials.instagram && config.socials.instagram !== '#' ? config.socials.instagram : '#'} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-12 h-12 bg-gray-900 border border-gray-800 rounded-2xl flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-500/30 hover:-translate-y-1 transition-all shadow-lg group"
                title="Instagram"
              >
                <svg className="w-6 h-6 transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.805.249 2.227.412.56.216.96.474 1.38.894.42.42.678.82.894 1.38.163.422.358 1.057.412 2.227.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.054 1.17-.249 1.805-.412 2.227-.216.56-.474.96-.894 1.38-.42.42-.82.678-1.38.894-.422.163-1.057.358-2.227.412-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.054-1.805-.249-2.227-.412-.56-.216-.96-.474-1.38-.894-.42-.42-.678-.82-.894-1.38-.163-.422-.358-1.057-.412-2.227-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.054-1.17.249-1.805.412-2.227.216-.56.474-.96.894-1.38.42-.42.82-.678 1.38-.894.422-.163 1.057-.358 2.227-.412 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-1.28.058-2.152.261-2.917.559-.79.307-1.459.718-2.126 1.384-.666.667-1.077 1.336-1.384 2.126-.298.765-.501 1.637-.559 2.917-.058 1.28-.072 1.688-.072 4.947s.014 3.667.072 4.947c.058 1.28.261 2.152.559 2.917.307.79.718 1.459 1.384 2.126.667.666 1.336 1.077 2.126 1.384.765.298 1.637.501 2.917.559 1.28.058 1.688.072 4.947.072s3.667-.014 4.947-.072c1.28-.058 2.152-.261 2.917-.559.79-.307 1.459-.718 2.126-1.384.666-.667 1.077-1.336 1.384-2.126.298-.765.501-1.637.559-2.917.058-1.28.072-1.688.072-4.947s-.014-3.667-.072-4.947c-.058-1.28-.261-2.152-.559-2.917-.307-.79-.718-1.459-1.384-2.126-.667-.666-1.336-1.077-2.126-1.384-.765-.298-1.637-.501-2.917-.559-1.28-.058-1.688-.072-4.947-.072zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.791-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.209-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a 
                href={config.socials.linkedin && config.socials.linkedin !== '#' ? config.socials.linkedin : '#'} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-12 h-12 bg-gray-900 border border-gray-800 rounded-2xl flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-500/30 hover:-translate-y-1 transition-all shadow-lg group"
                title="LinkedIn"
              >
                <svg className="w-6 h-6 transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-6 uppercase tracking-widest text-white">Services</h3>
            <ul className="space-y-4 text-gray-400 font-medium">
              <li><Link to="/portfolio/Video Editing" className="hover:text-red-500 transition-colors">Video Editing</Link></li>
              <li><Link to="/portfolio/Thumbnail Design" className="hover:text-red-500 transition-colors">Thumbnail Design</Link></li>
              <li><Link to="/portfolio/Web Development" className="hover:text-red-500 transition-colors">Web Development</Link></li>
              <li><Link to="/portfolio/Merchandise Design" className="hover:text-red-500 transition-colors">Merchandise Design</Link></li>
              <li><Link to="/portfolio/Poster Design" className="hover:text-red-500 transition-colors">Poster Design</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6 uppercase tracking-widest text-white">Company</h3>
            <ul className="space-y-4 text-gray-400 font-medium">
              <li><Link to="/" className="hover:text-red-500 transition-colors">Home</Link></li>
              <li><Link to="/hire" className="hover:text-red-500 transition-colors">Hire Us</Link></li>
              <li><a href="mailto:datcloud20@gmail.com" className="hover:text-red-500 transition-colors">Email Us</a></li>
              <li className="mt-[-8px]"><a href="mailto:datcloud20@gmail.com" className="text-gray-500 hover:text-red-500 transition-colors lowercase text-sm font-medium">datcloud20@gmail.com</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-12 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center text-xs font-bold uppercase tracking-widest text-gray-500">
          <p>&copy; {new Date().getFullYear()} {config.logoText}. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
