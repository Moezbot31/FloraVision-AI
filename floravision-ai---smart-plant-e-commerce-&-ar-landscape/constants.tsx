
import { Plant, PlantCategory, Tool } from './types';

export const MOCK_PLANTS: Plant[] = [
  {
    id: '1',
    name: 'Monstera Deliciosa',
    price: 12500, // PKR
    category: PlantCategory.INDOOR,
    size: 'Medium',
    growthStage: 'Sapling',
    sunlight: 'Bright Indirect',
    watering: 'Once a week',
    soil: 'Well-draining peat mix',
    imageUrl: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=400',
    description: 'Iconic Swiss Cheese plant.',
    stock: 15,
    maintenanceLevel: 'Easy'
  },
  {
    id: '2',
    name: 'Japanese Maple',
    price: 35000, // PKR
    category: PlantCategory.TREE,
    size: 'Large',
    growthStage: 'Mature',
    sunlight: 'Partial Shade',
    watering: 'Twice a week',
    soil: 'Acidic, moist',
    imageUrl: 'https://images.unsplash.com/photo-1599939575322-780f6da96e17?auto=format&fit=crop&w=400',
    description: 'Stunning ornamental tree.',
    stock: 5,
    maintenanceLevel: 'Moderate'
  },
  {
    id: '3',
    name: 'Areca Palm',
    price: 8500, // PKR
    category: PlantCategory.INDOOR,
    size: 'Large',
    growthStage: 'Mature',
    sunlight: 'Indirect Sun',
    watering: 'Twice a week',
    soil: 'Loamy',
    imageUrl: 'https://images.unsplash.com/photo-1545239351-ef35f43d514b?auto=format&fit=crop&w=400',
    description: 'Air purifying tropical palm.',
    stock: 20,
    maintenanceLevel: 'Easy'
  },
  {
    id: '4',
    name: 'Boxwood Shrub',
    price: 4500, // PKR
    category: PlantCategory.SHRUB,
    size: 'Medium',
    growthStage: 'Mature',
    sunlight: 'Full Sun',
    watering: 'Regularly',
    soil: 'Loamy',
    imageUrl: 'https://images.unsplash.com/photo-15a84479898061-15742e14f50d?auto=format&fit=crop&w=400',
    description: 'Perfect for hedging.',
    stock: 25,
    maintenanceLevel: 'Easy'
  }
];

export const GARDEN_TOOLS: Tool[] = [
  { id: 't1', name: 'Victorian Trellis', imageUrl: 'https://cdn-icons-png.flaticon.com/512/3233/3233497.png', category: 'construction' },
  { id: 't2', name: 'Royal Stone Fountain', imageUrl: 'https://cdn-icons-png.flaticon.com/512/3516/3516353.png', category: 'maintenance' },
  { id: 't3', name: 'Classic Terracotta Pot', imageUrl: 'https://cdn-icons-png.flaticon.com/512/628/628283.png', category: 'maintenance' },
  { id: 't4', name: 'Solar Path Torch', imageUrl: 'https://cdn-icons-png.flaticon.com/512/2164/2164631.png', category: 'construction' },
  { id: 't5', name: 'Handcrafted Oak Bench', imageUrl: 'https://cdn-icons-png.flaticon.com/512/2635/2635398.png', category: 'maintenance' },
  { id: 't6', name: 'Garden Dwarf Statue', imageUrl: 'https://cdn-icons-png.flaticon.com/512/3043/3043598.png', category: 'maintenance' },
  { id: 't7', name: 'Antique Water Well', imageUrl: 'https://cdn-icons-png.flaticon.com/512/3246/3246261.png', category: 'construction' }
];
