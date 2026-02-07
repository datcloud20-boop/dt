
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { Project, CategoryType } from '../types';

const Portfolio: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('newest');

  useEffect(() => {
    const fetchAction = category 
      ? dataService.getProjectsByCategory(category as CategoryType)
      : dataService.getProjects();
    
    fetchAction.then(data => {
      setProjects(data);
    }).catch(err => {
      console.error('Error fetching portfolio projects:', err);
    });
  }, [category]);

  const uniqueTags: string[] = Array.from(new Set(projects.flatMap(p => p.tags || [])));
  
  let filteredProjects = filter === 'All' ? projects : projects.filter(p => (p.tags || []).includes(filter));
  
  // Apply sorting
  filteredProjects = [...filteredProjects].sort((a, b) => {
    if (sortOrder === 'newest') return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (sortOrder === 'oldest') return new Date(a.date).getTime() - new Date(b.date).getTime();
    return 0;
  });

  const isMerchandise = category === 'Merchandise Design';
  const isPoster = category === 'Poster Design';
  const isThumbnail = category === 'Thumbnail Design';

  const gridClass = (isMerchandise || isPoster)
    ? "grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-16" 
    : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10";

  const aspectClass = isThumbnail 
    ? "aspect-video" 
    : (isMerchandise || isPoster)
      ? "aspect-[2/3]" 
      : "aspect-[4/3]";

  return (
    <div className="pt-32 pb-24 px-6 min-h-screen bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <span className="text-red-500 font-bold tracking-widest uppercase text-sm mb-4 block">PORTFOLIO GALLERY</span>
          <h1 className="text-5xl md:text-7xl font-black font-heading mb-8 uppercase tracking-tighter">
            {category || 'ALL PROJECTS'}
          </h1>
          
          <div className="flex flex-wrap gap-4 mb-12">
            <button 
              onClick={() => setFilter('All')}
              className={`px-8 py-3 rounded-full text-xs font-black tracking-widest border-2 transition-all ${filter === 'All' ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-600/20' : 'border-gray-800 text-gray-500 hover:border-gray-600'}`}
            >
              ALL
            </button>
            {uniqueTags.map((tag: string) => (
              <button 
                key={tag}
                onClick={() => setFilter(tag)}
                className={`px-8 py-3 rounded-full text-xs font-black tracking-widest border-2 transition-all ${filter === tag ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-600/20' : 'border-gray-800 text-gray-500 hover:border-gray-600'}`}
              >
                {tag.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center py-6 border-y border-gray-900 gap-6 mb-12">
            <div className="flex gap-4">
              {(isMerchandise || isPoster) && (
                <div className="relative group">
                  <button className="px-6 py-2 border border-gray-800 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-white hover:text-black transition-all">
                    SIZE <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </button>
                  <div className="absolute top-full left-0 mt-2 w-32 bg-[#111] border border-gray-800 rounded-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 shadow-2xl">
                    {['S', 'M', 'L', 'XL', 'XXL'].map(s => (
                      <button key={s} className="w-full text-left px-4 py-2 text-[10px] font-bold hover:bg-red-600 transition-colors uppercase">{s}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">SORT BY:</span>
              <select 
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="bg-transparent border border-gray-800 rounded-lg px-4 py-2 text-[10px] font-bold uppercase tracking-wider outline-none cursor-pointer focus:border-red-600 transition-colors"
              >
                <option value="newest" className="bg-black text-white">DATE, NEW TO OLD</option>
                <option value="oldest" className="bg-black text-white">DATE, OLD TO NEW</option>
              </select>
            </div>
          </div>
        </header>

        {filteredProjects.length > 0 ? (
          <div className={gridClass}>
            {filteredProjects.map(project => {
              const cardContent = (
                <>
                  <div className={`relative ${aspectClass} rounded-2xl md:rounded-[2rem] overflow-hidden mb-6 bg-[#0f0f0f] border border-gray-900 shadow-xl group-hover:border-red-600/20 transition-colors`}>
                    <img 
                      src={dataService.transformDriveUrl(project.thumbnailUrl)} 
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    {!isMerchandise && !isThumbnail && !isPoster && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                        <p className="text-sm font-medium leading-relaxed line-clamp-2 text-gray-200">{project.description}</p>
                      </div>
                    )}
                  </div>
                  <div className={(isMerchandise || isPoster) ? "text-center" : "text-left"}>
                    <h3 className={`
                      ${isThumbnail ? 'text-lg md:text-xl font-bold text-white normal-case' : 
                        (isMerchandise || isPoster) ? 'text-xs font-bold text-gray-400' : 
                        'text-2xl font-black font-heading'} 
                      mb-2 group-hover:text-red-500 transition-colors uppercase tracking-tight line-clamp-2
                    `}>
                      {project.title}
                    </h3>
                    <div className={`flex flex-wrap gap-2 ${(isMerchandise || isPoster) ? 'justify-center' : 'justify-start'}`}>
                      {(project.tags || []).map(tag => (
                        <span key={tag} className="text-[9px] font-bold tracking-widest uppercase text-gray-600 bg-gray-900/40 px-2 py-1 rounded-md border border-gray-800/50">#{tag}</span>
                      ))}
                    </div>
                  </div>
                </>
              );

              if (project.category === 'Web Development' && project.liveUrl) {
                return (
                  <a 
                    href={project.liveUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    key={project.id} 
                    className="group flex flex-col h-full cursor-pointer"
                  >
                    {cardContent}
                  </a>
                );
              }

              return (
                <Link to={`/project/${project.id}`} key={project.id} className="group flex flex-col h-full">
                  {cardContent}
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-32 bg-gray-900/20 rounded-[40px] border-2 border-dashed border-gray-800">
            <div className="w-20 h-20 bg-gray-800/50 rounded-full mx-auto flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
            </div>
            <p className="text-gray-500 text-xl font-black uppercase tracking-widest">No projects found in this sector.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Portfolio;
