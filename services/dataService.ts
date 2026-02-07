import { Project, CategoryType, Message, SiteConfig } from '../types';
import { supabase } from './supabase';

const DEFAULT_CONFIG: SiteConfig = {
  logoText: 'DAT CLOUDE',
  logoImageUrl: '',
  logoPosition: 'left',
  logoX: 0,
  logoY: 0,
  footerDescription: 'A high-end portfolio and service-based e-commerce platform for creative professionals.',
  heroTitle: 'DESIGNING THE FUTURE OF DIGITAL EXPERIENCES.',
  heroSubtitle: 'We turn bold ideas into high-converting solutions.',
  heroImageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
  heroVideoUrl: '',
  heroVideoOpacity: 100,
  heroTextColor: '#ffffff',
  heroTextPosition: 'left',
  heroTitleSize: 6.8,
  heroImageSize: 90,
  heroImageX: 0,
  heroImageY: 0,
  stats: { projects: 120, clients: 45, years: 8 },
  socials: { instagram: '#', twitter: '#', linkedin: '#', youtube: '#' },
  tools: [
    { name: 'Premiere Pro', icon: 'https://cdn.simpleicons.org/adobepremierepro' },
    { name: 'Photoshop', icon: 'https://cdn.simpleicons.org/adobephotoshop' },
    { name: 'React', icon: 'https://cdn.simpleicons.org/react' }
  ],
  contactEmail: 'datcloud20@gmail.com',
  whatsappNumber: ''
};

class DataService {
  private lastKnownGoodConfig: SiteConfig | null = null;

  // Fix: Ensure property names in the returned object match the camelCase definitions in the Project interface
  private mapProject(row: any): Project {
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      category: row.category as CategoryType,
      tags: row.tags || [],
      thumbnailUrl: row.thumbnail_url || '',
      mediaUrl: row.media_url || '',
      tools: row.tools || [],
      status: row.status as 'Published' | 'Draft' | 'Featured',
      price: row.price,
      date: row.date,
      client: row.client,
      liveUrl: row.live_url,
      githubUrl: row.github_url,
    };
  }

  private mapProjectToDb(p: Partial<Project>) {
    const dbObj: any = {};
    if (p.title !== undefined) dbObj.title = p.title;
    if (p.description !== undefined) dbObj.description = p.description;
    if (p.category !== undefined) dbObj.category = p.category;
    if (p.tags !== undefined) dbObj.tags = p.tags;
    if (p.thumbnailUrl !== undefined) dbObj.thumbnail_url = p.thumbnailUrl;
    if (p.mediaUrl !== undefined) dbObj.media_url = p.mediaUrl;
    if (p.tools !== undefined) dbObj.tools = p.tools;
    if (p.status !== undefined) dbObj.status = p.status;
    if (p.price !== undefined) dbObj.price = p.price;
    if (p.client !== undefined) dbObj.client = p.client;
    if (p.liveUrl !== undefined) dbObj.live_url = p.liveUrl;
    if (p.githubUrl !== undefined) dbObj.github_url = p.githubUrl;
    return dbObj;
  }

  private mapConfig(row: any): SiteConfig {
    if (!row) return DEFAULT_CONFIG;
    return {
      logoText: row.logo_text ?? DEFAULT_CONFIG.logoText,
      logoImageUrl: row.logo_image_url ?? DEFAULT_CONFIG.logoImageUrl,
      logoPosition: row.logo_position ?? DEFAULT_CONFIG.logoPosition,
      logoX: Number(row.logo_x ?? DEFAULT_CONFIG.logoX),
      logoY: Number(row.logo_y ?? DEFAULT_CONFIG.logoY),
      footerDescription: row.footer_description ?? DEFAULT_CONFIG.footerDescription,
      heroTitle: row.hero_title ?? DEFAULT_CONFIG.heroTitle,
      heroSubtitle: row.hero_subtitle ?? DEFAULT_CONFIG.heroSubtitle,
      heroImageUrl: row.hero_image_url ?? DEFAULT_CONFIG.heroImageUrl,
      heroVideoUrl: row.hero_video_url ?? DEFAULT_CONFIG.heroVideoUrl,
      heroVideoOpacity: row.hero_video_opacity ?? DEFAULT_CONFIG.heroVideoOpacity,
      heroTextColor: row.hero_text_color ?? DEFAULT_CONFIG.heroTextColor,
      heroTextPosition: row.hero_text_position ?? DEFAULT_CONFIG.heroTextPosition,
      heroTitleSize: Number(row.hero_title_size ?? DEFAULT_CONFIG.heroTitleSize),
      heroImageSize: Number(row.hero_image_size ?? DEFAULT_CONFIG.heroImageSize),
      heroImageX: Number(row.hero_image_x ?? DEFAULT_CONFIG.heroImageX),
      heroImageY: Number(row.hero_image_y ?? DEFAULT_CONFIG.heroImageY),
      stats: row.stats ?? DEFAULT_CONFIG.stats,
      socials: row.socials ?? DEFAULT_CONFIG.socials,
      tools: row.tools ?? DEFAULT_CONFIG.tools,
      contactEmail: row.contact_email ?? DEFAULT_CONFIG.contactEmail,
      whatsappNumber: row.whatsapp_number ?? DEFAULT_CONFIG.whatsappNumber,
    };
  }

  // Fix: Added missing mapConfigToDb method to transform SiteConfig back to DB format
  private mapConfigToDb(config: SiteConfig): any {
    return {
      logo_text: config.logoText,
      logo_image_url: config.logoImageUrl,
      logo_position: config.logoPosition,
      logo_x: config.logoX,
      logo_y: config.logoY,
      footer_description: config.footerDescription,
      hero_title: config.heroTitle,
      hero_subtitle: config.heroSubtitle,
      hero_image_url: config.heroImageUrl,
      hero_video_url: config.heroVideoUrl,
      hero_video_opacity: config.heroVideoOpacity,
      hero_text_color: config.heroTextColor,
      hero_text_position: config.heroTextPosition,
      hero_title_size: config.heroTitleSize,
      hero_image_size: config.heroImageSize,
      hero_image_x: config.heroImageX,
      hero_image_y: config.heroImageY,
      stats: config.stats,
      socials: config.socials,
      tools: config.tools,
      contact_email: config.contactEmail,
      whatsapp_number: config.whatsappNumber,
    };
  }

  async getConfig(): Promise<SiteConfig> {
    try {
      const { data, error } = await supabase
        .from('site_config')
        .select('*')
        .eq('id', 1)
        .maybeSingle();

      if (error) return this.lastKnownGoodConfig || DEFAULT_CONFIG;
      if (!data) return DEFAULT_CONFIG;
      
      const mapped = this.mapConfig(data);
      this.lastKnownGoodConfig = mapped;
      return mapped;
    } catch (err) {
      return this.lastKnownGoodConfig || DEFAULT_CONFIG;
    }
  }

  async updateConfig(config: SiteConfig): Promise<void> {
    const { error } = await supabase
      .from('site_config')
      .update(this.mapConfigToDb(config))
      .eq('id', 1);

    if (error) throw error;
    this.lastKnownGoodConfig = config;
  }

  async getProjects(): Promise<Project[]> {
    const { data, error } = await supabase.from('projects').select('*').order('date', { ascending: false });
    return error ? [] : data.map(row => this.mapProject(row));
  }

  async getFeaturedProjects(): Promise<Project[]> {
    const { data, error } = await supabase.from('projects').select('*').eq('status', 'Featured').order('date', { ascending: false });
    return error ? [] : data.map(row => this.mapProject(row));
  }

  async getProjectsByCategory(category: CategoryType): Promise<Project[]> {
    const { data, error } = await supabase.from('projects').select('*').eq('category', category).order('date', { ascending: false });
    return error ? [] : data.map(row => this.mapProject(row));
  }

  async getProjectById(id: string): Promise<Project | null> {
    const { data, error } = await supabase.from('projects').select('*').eq('id', id).single();
    return error ? null : this.mapProject(data);
  }

  async addProject(project: Omit<Project, 'id' | 'date'>): Promise<Project> {
    const { data, error } = await supabase.from('projects').insert([this.mapProjectToDb(project as Project)]).select().single();
    if (error) throw error;
    return this.mapProject(data);
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<void> {
    const { error } = await supabase.from('projects').update(this.mapProjectToDb(updates)).eq('id', id);
    if (error) throw error;
  }

  async deleteProject(id: string): Promise<void> {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw error;
  }

  async getMessages(): Promise<Message[]> {
    const { data, error } = await supabase.from('messages').select('*').order('date', { ascending: false });
    return error ? [] : data;
  }

  // FIX: Removing .select() solves the "NEW ROW VIOLATES ROW-LEVEL SECURITY" error
  // because public users aren't allowed to read back from the messages table.
  async addMessage(msg: Omit<Message, 'id' | 'date'>): Promise<void> {
    const { error } = await supabase
      .from('messages')
      .insert([msg]); // No .select() call here

    if (error) throw error;
  }

  async deleteMessage(id: string): Promise<void> {
    const { error } = await supabase.from('messages').delete().eq('id', id);
    if (error) throw error;
  }

  public transformDriveUrl(url: string | null | undefined): string {
    if (!url) return '';
    if (url.startsWith('data:') || url.startsWith('blob:') || url.startsWith('https://cdn.')) return url;
    if (url.includes('drive.google.com') || url.includes('docs.google.com')) {
      const match = url.match(/\/d\/([\w-]+)/) || url.match(/[?&]id=([\w-]+)/);
      if (match && match[1]) return `https://drive.google.com/uc?export=download&id=${match[1]}`;
    }
    return url;
  }
}

export const dataService = new DataService();