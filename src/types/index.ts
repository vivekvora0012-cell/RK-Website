export interface Product {
  id: number;
  name: string;
  price: string;
  description: string;
  serial_no: string;
  model_no: string;
  ratio: string;
  images: string;
  created_at: string;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
  created_at: string;
}

export interface Blog {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  read_time: string;
  image?: string;
  created_at: string;
}

export interface Inquiry {
  id: number;
  name: string;
  email: string;
  phone?: string;
  message: string;
  is_read: number;
  created_at: string;
}

export interface Video {
  id: number;
  title: string;
  url: string;
  duration?: string;
  created_at: string;
}

export interface Slide {
  id: number;
  title: string;
  description: string;
  image_url: string;
  order_index: number;
  created_at: string;
}

export interface SocialLink {
  id: number;
  platform: string;
  url: string;
  order_index: number;
  created_at: string;
}
