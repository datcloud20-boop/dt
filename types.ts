
export type CategoryType = 'Video Editing' | 'Thumbnail Design' | 'Web Development' | 'Merchandise Design' | 'Poster Design';

export interface Project {
  id: string;
  title: string;
  description: string;
  category: CategoryType;
  tags: string[];
  thumbnailUrl: string;
  mediaUrl: string;
  tools: string[];
  status: 'Published' | 'Draft' | 'Featured';
  price?: number;
  date: string;
  client?: string;
  liveUrl?: string;
  githubUrl?: string;
}

export interface User {
  email: string;
  isAdmin: boolean;
}

export interface Tool {
  name: string;
  icon: string;
}

export interface SiteConfig {
  logoText: string;
  logoImageUrl?: string;
  logoPosition?: 'left' | 'center' | 'right';
  logoX?: number;
  logoY?: number;
  footerDescription: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
  heroVideoUrl: string;
  heroVideoOpacity?: number;
  heroTextColor?: string;
  heroTextPosition?: 'left' | 'center' | 'right';
  heroTitleSize?: number;
  heroImageSize?: number;
  heroImageX?: number;
  heroImageY?: number;
  stats: {
    projects: number;
    clients: number;
    years: number;
  };
  socials: {
    instagram: string;
    twitter: string;
    linkedin: string;
    youtube: string;
    facebook?: string;
    discord?: string;
  };
  tools: Tool[];
  contactEmail: string;
  whatsappNumber: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  service: string;
  content: string;
  date: string;
}
