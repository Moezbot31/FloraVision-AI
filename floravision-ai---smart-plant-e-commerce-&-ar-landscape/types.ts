
export enum PlantCategory {
  INDOOR = 'Indoor',
  OUTDOOR = 'Outdoor',
  TREE = 'Tree',
  SHRUB = 'Shrub'
}

export enum UserRole {
  SUPER_ADMIN = 'Super Admin',
  BUSINESS_ADMIN = 'Business Admin',
  STAFF = 'Staff',
  CUSTOMER = 'Customer'
}

export interface Plant {
  id: string;
  name: string;
  price: number;
  category: PlantCategory;
  size: 'Small' | 'Medium' | 'Large' | 'Extra Large';
  growthStage: 'Seedling' | 'Sapling' | 'Mature';
  sunlight: string;
  watering: string;
  soil: string;
  imageUrl: string;
  description: string;
  hardinessZone?: string;
  spacing?: string;
  stock: number;
  maintenanceLevel: 'Easy' | 'Moderate' | 'Expert';
  previewCount?: number;
}

export interface Tool {
  id: string;
  name: string;
  imageUrl: string;
  category: 'maintenance' | 'construction' | 'irrigation';
}

export interface DiseaseAnalysis {
  species: string;
  diseaseName: string;
  severity: 'Low' | 'Moderate' | 'High';
  confidence: number;
  causes: string[];
  treatment: string;
  prevention: string;
  recommendedProducts: string[];
}

export interface CartItem extends Plant {
  quantity: number;
}

export interface LandscapeItem {
  instanceId: string;
  itemId: string;
  type: 'plant' | 'tool';
  x: number;
  y: number;
  rotation: number;
  scale: number;
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  isSubscribed: boolean;
  wishlist: string[];
  history: Order[];
}

export interface Order {
  id: string;
  date: string;
  items: string[];
  total: number;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered';
  trackingNumber?: string;
}
