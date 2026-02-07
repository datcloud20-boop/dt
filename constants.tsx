
import React from 'react';
import { Project, CategoryType } from './types';

export const COLORS = {
  primary: '#ef4444', // Red-500
  secondary: '#262626', // Gray-800
  background: '#0a0a0a', // Almost black
  text: '#f3f4f6', // Gray-100
};

/* Explicitly type CATEGORIES as CategoryType[] to ensure consistency with the Project interface */
export const CATEGORIES: CategoryType[] = [
  'Video Editing',
  'Thumbnail Design',
  'Web Development',
  'Merchandise Design',
  'Poster Design'
];

export const TOOLS = [
  { name: 'Premiere Pro', icon: 'https://cdn.simpleicons.org/adobepremierepro' },
  { name: 'After Effects', icon: 'https://cdn.simpleicons.org/adobeaftereffects' },
  { name: 'Photoshop', icon: 'https://cdn.simpleicons.org/adobephotoshop' },
  { name: 'Figma', icon: 'https://cdn.simpleicons.org/figma' },
  { name: 'VS Code', icon: 'https://cdn.simpleicons.org/visualstudiocode' },
  { name: 'Illustrator', icon: 'https://cdn.simpleicons.org/adobeillustrator' },
  { name: 'React', icon: 'https://cdn.simpleicons.org/react' },
  { name: 'Tailwind', icon: 'https://cdn.simpleicons.org/tailwindcss' }
];

/* Properly type MOCK_PROJECTS as Project[] to ensure category and status match the defined union types in types.ts */
export const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Gaming Excellence Montage',
    description: 'High-paced cinematic video editing for a top-tier esports organization.',
    category: 'Video Editing',
    tags: ['YouTube', 'Gaming', 'Reel'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800',
    mediaUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    tools: ['Premiere Pro', 'After Effects'],
    status: 'Featured',
    date: '2024-03-01'
  },
  {
    id: '2',
    title: 'Regular Fit Long Sleeve Micro Stripe',
    description: 'Minimalist long sleeve t-shirt design with micro stripe elbow patches.',
    category: 'Merchandise Design',
    tags: ['Branding', 'Print', 'Apparel'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80&w=800',
    mediaUrl: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80&w=1200',
    tools: ['Illustrator', 'Photoshop'],
    status: 'Featured',
    price: 2095,
    date: '2024-02-15'
  }
];
