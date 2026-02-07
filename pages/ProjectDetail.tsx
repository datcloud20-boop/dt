
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { Project } from '../types';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    if (id) {
      dataService.getProjectById(id).then(p => {
        if (p) setProject(p);
        else navigate('/');
      }).catch(err => {
        console.error('Error fetching project detail:', err);
        navigate('/');
      });
    }
  }, [id, navigate]);

  if (!project) return null;

  const isVideo = project.category === 'Video Editing';
  const isThumbnail = project.category === 'Thumbnail Design';
  const isMerchandise = project.category === 'Merchandise Design';
  const isPoster = project.category === 'Poster Design';

  // For posters, we don't want a fixed aspect ratio that crops the image.
  const aspectClass = isThumbnail ? 'aspect-video' : isMerchandise ? 'aspect-[2/3]' : isPoster ? 'aspect-auto' : 'aspect-video';

  return (
    <div className="pt-32 pb-24 px-6 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-500 hover:text-white mb-12 group uppercase text-xs font-bold tracking-widest"
        >
          <svg className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          BACK TO GALLERY
        </button>

        <div className="mb-16">
          <span className="text-red-600 font-bold tracking-widest mb-4 block uppercase text-sm">{project.category}</span>
          <h1 className="text-5xl md:text-7xl font-black font-heading leading-tight mb-8 uppercase tracking-tighter">{project.title}</h1>
          <div className="flex flex-wrap gap-4">
             {(project.tools || []).map(tool => (
               <span key={tool} className="px-6 py-2 bg-gray-900 border border-gray-800 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-400">{tool}</span>
             ))}
          </div>
        </div>

        {/* Media Player/Viewer */}
        <div className={`rounded-[2rem] md:rounded-[3rem] overflow-hidden bg-gray-900 mb-20 ${aspectClass} shadow-2xl border border-gray-800 ${isPoster ? 'h-auto' : ''}`}>
          {isVideo ? (
            <video controls className="w-full h-full object-cover">
              <source src={project.mediaUrl} type="video/mp4" />
            </video>
          ) : (
            <img 
              src={project.mediaUrl} 
              alt={project.title} 
              className={`w-full ${isPoster ? 'h-auto object-contain' : 'h-full object-cover'}`}
            />
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-16">
          <div className="md:col-span-2">
            <h2 className="text-3xl font-black font-heading mb-8 uppercase tracking-tighter">THE <span className="text-red-600">MISSION</span></h2>
            <p className="text-xl text-gray-400 leading-relaxed whitespace-pre-line font-medium">
              {project.description}
            </p>
          </div>
          
          <div className="bg-gray-900/50 p-10 rounded-3xl border border-gray-800 h-fit">
            <h3 className="font-bold text-lg mb-6 pb-6 border-b border-gray-800 uppercase tracking-widest">Project Intel</h3>
            <div className="space-y-6">
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Date Published</p>
                <p className="font-bold text-white">{new Date(project.date).toLocaleDateString()}</p>
              </div>
              {project.client && (
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Client</p>
                  <p className="font-bold text-white">{project.client}</p>
                </div>
              )}
              {project.status === 'Featured' && (
                <div>
                  <p className="text-xs text-red-600 font-bold uppercase tracking-widest mb-1 text-red-500">Recognition</p>
                  <p className="font-bold text-white">⭐ Featured Project</p>
                </div>
              )}
              {(project.liveUrl || project.githubUrl) && (
                <div className="pt-4 flex flex-col gap-4">
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer" className="block w-full text-center py-4 bg-red-600 rounded-2xl font-bold hover:bg-red-700 transition-all uppercase tracking-tighter">VIEW LIVE DEMO</a>
                  )}
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noreferrer" className="block w-full text-center py-4 border border-gray-700 rounded-2xl font-bold hover:bg-white hover:text-black transition-all uppercase tracking-tighter">SOURCE CODE</a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
