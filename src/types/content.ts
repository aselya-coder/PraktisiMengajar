export interface CTAButton {
  text: string;
  link: string;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface IconItem {
  title: string;
  description: string;
  icon: string;
}

export interface HeroSection {
  title: string;
  subtitle: string;
  badge: string;
  benefits: string[];
  cta_primary: CTAButton;
  cta_secondary: CTAButton;
  image: string;
  stats: StatItem[];
}

export interface AboutSection {
  section_title: string;
  title: string;
  description: string;
  sub_description: string;
  values: IconItem[];
  features_title: string;
  features: string[];
}

export interface ServiceItem {
  title: string;
  description: string;
  icon: string;
  features: string[];
}

export interface ServicesSection {
  section_title: string;
  title: string;
  description: string;
  items: ServiceItem[];
  benefits: IconItem[];
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
  icon: string;
}

export interface ProcessSection {
  section_title: string;
  title: string;
  description: string;
  steps: ProcessStep[];
}

export interface TestimonialItem {
  name: string;
  role: string;
  institution: string;
  quote: string;
  rating: number;
}

export interface TestimonialsSection {
  section_title: string;
  title: string;
  description: string;
  items: TestimonialItem[];
  stats: StatItem[];
}

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  location?: string;
}

export interface CTASection {
  section_title: string;
  title: string;
  description: string;
  cta_primary: CTAButton;
  cta_whatsapp: CTAButton;
  contact_info: ContactInfo;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface HeaderSection {
  logo_text: string;
  title: string;
  nav_links: NavLink[];
  cta_buttons: {
    primary: CTAButton;
    secondary: CTAButton;
  };
}

export interface FooterSection {
  description: string;
  contact_info: ContactInfo;
  quick_links: NavLink[];
  services_list: string[];
  whatsapp_cta: CTAButton;
}

export interface SiteContent {
  hero: HeroSection;
  about: AboutSection;
  services: ServicesSection;
  process: ProcessSection;
  testimonials: TestimonialsSection;
  cta: CTASection;
  header: HeaderSection;
  footer: FooterSection;
}
